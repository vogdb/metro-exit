metro.exit.SchemeRouteBuilder = function (scheme) {
    this.scheme = scheme

    //возможные режимы работы строителя
    this.MODES = {
        //режим по умолчанию. Показывает параметры выделенного элемента.
        DEFAULT:0,
        //режим проставления узлов на карте.
        NODE:1,
        //режим связывания узлов.
        EDGE:2
    }

    this.init()
}

/**
 * Существует ли уже узел по искомым координатам
 * @param coord координаты
 */
metro.exit.SchemeRouteBuilder.prototype.getNodeKeyByCoord = function (coord) {
    //тупой перебор, знаю  дурак, но умнее не придумал
    for (var key in this.nodes) {
        var ncoord = this.nodes[key]['coord']
        if (Math.abs(ncoord['x'] - coord['x']) < 20 && Math.abs(ncoord['y'] - coord['y']) < 20) {
            return key
        }
    }
    return undefined
}

metro.exit.SchemeRouteBuilder.prototype.getNode = function (nodeKey) {
    return this.nodes[nodeKey]
}

metro.exit.SchemeRouteBuilder.prototype.createNode = function (coord) {
    this.nodes[coordKey(coord)] = {'coord':coord}
}

metro.exit.SchemeRouteBuilder.prototype.addNode = function (node) {
    this.nodes[coordKey(node['coord'])] = node
}

metro.exit.SchemeRouteBuilder.prototype.deleteNode = function (nodeKey) {
    //this.drawUtils.drawPoint(this.nodes[nodeKey]['coord'], 'delete')
    delete this.nodes[nodeKey]
}

metro.exit.SchemeRouteBuilder.prototype.editNode = function (nodeKey) {
    this.nodeEditor.setNode(nodeKey)
}

metro.exit.SchemeRouteBuilder.prototype.addNodeAttr = function (nodeKey, attrName, attrVal) {
    var node = this.getNode(nodeKey)
    if (node) {
        node[attrName] = attrVal
        //перерисовываем с новыми атрибутами
        this.updateNodeLinks(attrName, node)
    }
}

metro.exit.SchemeRouteBuilder.prototype.removeNodeAttr = function (nodeKey, attrName) {
    var node = this.getNode(nodeKey)
    if (node) {
        if (node[attrName]) {
            delete node[attrName]
        }
        //перерисовываем с новыми атрибутами
        this.updateNodeLinks(attrName, node)
    }
}

metro.exit.SchemeRouteBuilder.prototype.updateNodeLinks = function (attrName, node) {
    if (attrName == 'type' || attrName == 'color') {
        for (var i = 0; i < node['children'].length; i++) {
            this.drawUtils.drawEdge(node['coord'], node['children'][i]['coord'], 'delete')
            this.drawUtils.draw(node, node['children'][i])
        }
    }
}

metro.exit.SchemeRouteBuilder.prototype.moveNode = function (nodeKey, coord) {
    //берем старый узел по старым координатам
    var node = this.getNode(nodeKey)
    if (node['coord']['x'] != coord['x'] || node['coord']['y'] != coord['y']) {
        //кладем на его место заглушку со старыми координатами
        this.nodes[nodeKey] = {'coord':createCoord(node['coord']['x'], node['coord']['y'])}
        //меняем координаты старого узла
        node['coord']['x'] = coord['x']
        node['coord']['y'] = coord['y']
        //удаляем из хранилища узлов заглушку
        this.deleteNode(nodeKey)
        //добавляем старый узел, как новый, т.к. координаты поменялись
        this.addNode(node)
        //рисуем новый узел
        //this.drawUtils.drawPoint(node['coord'])
        this.refresh()
    }
    //возвращаем ключ на новый узел
    return coordKey(node['coord'])
}

/**
 * перерисовывает всю схему текущим значением this.nodes
 */
metro.exit.SchemeRouteBuilder.prototype.refresh = function () {
    this.drawUtils.reset()
    var rootNode
    //рисуем сначала узлы
    for (var key in this.nodes) {
        if (this.nodes[key]['parent'] === undefined && this.nodes[key]['type'] == 'none') {
            rootNode = this.nodes[key]
        }
        this.drawUtils.drawPoint(this.nodes[key]['coord'])
    }

    var self = this
    //соединяем узлы
    drawEdge(rootNode)

    function drawEdge(node) {
        if (node['children']) {
            for (var i = 0; i < node['children'].length; i++) {
                self.drawUtils.draw(node, node['children'][i])
                drawEdge(node['children'][i])
            }
        }
    }
}

metro.exit.SchemeRouteBuilder.prototype.init = function () {
    //узлы маршрута. Формат: конкатенация x и y координат - ключ(@see coordKey()), сам узел - значение
    this.nodes = {}
    //текущий выбранный режим
    this.mode = this.MODES.DEFAULT

    this.initDrawUtils()
    this.defineSchemeSize()
    this.loadSchemeRoutes()
    this.initTools()

    this.nodeEditor = new metro.exit.NodeEditor(this.scheme, this)

}

/**
 * @return путь к картинке фона this.scheme
 */
metro.exit.SchemeRouteBuilder.prototype.getSchemeImgSrc = function () {
    return this.scheme.style.backgroundImage
        .replace(/url\(['"]?(.*)['"]?\)/gi, '$1')
        .split(',')[0];
}

/**
 * Определяет размер схемы this.scheme
 * @return void
 */
metro.exit.SchemeRouteBuilder.prototype.defineSchemeSize = function () {
    var schemeImg = new Image()
    schemeImg.src = this.getSchemeImgSrc()

    //Задавать размер через style неверно. Сам canvas растягивается на этот размер, а не покрывает.
    //scheme.style.width = width + 'px'
    //scheme.style.height = height + 'px'
    this.scheme.width = schemeImg.width
    this.scheme.height = schemeImg.height
}

/**
 * Загружает картинку схемы фоном для объекта this.scheme
 */
metro.exit.SchemeRouteBuilder.prototype.loadSchemeRoutes = function () {
    var schemeImgSrc = this.getSchemeImgSrc()

    //имя схемы станции
    var schemeNameStart = schemeImgSrc.lastIndexOf('/') + 1
    var schemeNameEnd = schemeImgSrc.lastIndexOf('.')
    var schemeName = schemeImgSrc.substring(schemeNameStart, schemeNameEnd)

    //грузим маршруты к схеме станции
    var router = new metro.exit.router.Router()
    router.setScheme(schemeName)
    for (var i = 0; i < router.config.routes.length; i++) {
        var node = router.config.routes[i]
        //добавляем children для узла
        if (node['parent'] !== undefined) {
            for (var k = 0; k < node['parent'].length; k++) {
                if (node['parent'][k]['children'] === undefined) {
                    node['parent'][k]['children'] = []
                }
                node['parent'][k]['children'].push(node)
            }
        }
        //добавляем узел к this.nodes
        this.addNode(node)
    }
    this.refresh()
}

metro.exit.SchemeRouteBuilder.prototype.initTools = function () {
    var uiPanel = document.getElementById('tools')
    new metro.exit.EditNodeTool().init(uiPanel, this)
    var createNodeTool = new metro.exit.CreateNodeTool()
    createNodeTool.init(uiPanel, this)
    new metro.exit.EdgeTool().init(uiPanel, this)
    new metro.exit.SaveTool().init(uiPanel, this)
    new metro.exit.ScaleTool().init(uiPanel, this)
    new metro.exit.MoveTool().init(uiPanel, this)

    createNodeTool.enable()
}

metro.exit.SchemeRouteBuilder.prototype.initDrawUtils = function () {
    this.drawUtils = new metro.exit.drawer.DrawUtils(this.scheme)
    this.drawUtils.color['delete'] = '#fff'
    this.drawUtils.color['none'] = '#000'
    this.drawUtils.color['blue'] = '#00f'
    //переопределяем рисовку для невидимых связей
    var self = this
    this.drawUtils.drawMethod['none'] = function (parent, child, color) {
        self.drawUtils.drawLine(parent, child, 'none')
    }
    /*
     this.drawUtils.drawMethod['line'] = function(parent, child, color){
     self.drawUtils.drawLine(parent, child, color)
     }
     */
}