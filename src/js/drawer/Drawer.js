/*рисование полученных результатов*/

metro.exit.drawer.Drawer = function(canvas, router, shemeId) {

    this.canvas = document.getElementById(canvas)
    this.ctx = this.canvas.getContext('2d')
    this.router = router
    this.schemeId = shemeId//ID отображаемой схемы, одна схема может содержать несколько станций

    /*photo this.elems//содержит информацию по элементам рисования*/
    /*exits this.exits//отображаемые выходы станции*/
/*photo
    this.photoIcon//иконка фотографии
    this.photo//окно для фотографий + данные о последней показанной фотографии
    this.touch//инфа о таче
*/
    this.drawUtils = new metro.exit.drawer.DrawUtils(this.canvas)
    this.bg//текущая карта станции
    this.canvasUI//CanvasUserInteraction for canvas
}

metro.exit.drawer.Drawer.prototype.init = function() {
    var self = this
    this.canvasUI = new CanvasManipulation(
        this.canvas,
        function(){self.draw()},
        {
            'leftTop':{'x':0, 'y':0},
            'rightBottom':{'x':this.bg.width, 'y':this.bg.height}
        }
    )
    this.canvasUI['init']()
/*photo
    this.photo = {}
    this.photo.popup = new metro.exit.popup("photo", 1000)
    this.photo.div = document.createElement("div")
    this.photo.div.style.width = "100%"
    this.photo.div.style.height = "100%"
    this.photo.popup.setContent(this.photo.div)

    this.photoIcon = new Image();
    this.photoIcon.src = "images/icon/photo.png";
    this.photoIcon.onload = function() {

        callback()
    }
*/
//    if(callback !== undefined)
//        callback()
/*photo
    var self = this
    this.canvas.addEventListener("touchstart", function(e) {
        self.touchstartListener(e)
    }, false)
    this.canvas.addEventListener("touchend", function(e) {
        self.clickListener(e)
    }, false)
    //TODO mouse click handlers, change route + redirect to new route exit on map
*/
}

metro.exit.drawer.Drawer.prototype.orient = function() {
    this.canvasUI['layout']()
    //Это необходимо т.к. при изменение размеров canvas сбрасывает примененную к нему текущую матрицу.
    this.ctx['setTransformMatrix'](this.ctx['getTransformMatrix']())
    if (metro.exit.isAndroid4()) {
        //Bugfix of http://stackoverflow.com/questions/12804710/android-4-html5-canvas-not-redrawing
        var self = this
        setTimeout(function () {
            self.draw()
        }, 1000)
    } else {
        this.draw()
    }
}

/**
 * рисует на канвасе карту станции
 * @param scheme схема станций для отрисовки.
 * @param callback исполнить, когда выполнится загрузка карты.
 */
metro.exit.drawer.Drawer.prototype.loadMap = function(scheme, callback) {
/*photo
    this.elems.photoIcon = {}
    this.elems.photoIcon.width = this.photoIcon.naturalWidth
    this.elems.photoIcon.height = this.photoIcon.naturalHeight
*/
    this.bg = new Image()
    this.bg.onload = callback
    this.bg.src = metro.exit.config.getStationMap(scheme)
}

metro.exit.drawer.Drawer.prototype.draw = function() {
    this.ctx['clearCanvas']()
    this.ctx.drawImage(this.bg, 0, 0)
    this.drawRoute(this.router.route)
    this.drawSchemeTitles(this.router.config)
}

metro.exit.drawer.Drawer.prototype.drawRoute = function(route) {
    this.drawRouteColor(route['dim'])
    this.drawRouteColor(route[undefined])
}

metro.exit.drawer.Drawer.prototype.drawRouteColor = function (routeColor) {
    for (var edgeKey in routeColor) {
        var edge = routeColor[edgeKey]
        this.drawEdge(edge[0], edge[1])
    }
}

/**
 * @param child - узел маршрута
 * @param parent - непосредственный предок узла, с к-ым чертим связь
 */
metro.exit.drawer.Drawer.prototype.drawEdge = function (child, parent) {
    this.drawUtils.draw(parent, child)
}

metro.exit.drawer.Drawer.prototype.drawSchemeTitles = function (config) {
    var titles = config['titles']
    for (var i = 0; i < titles.length; i++) {
        this.drawTitle(titles[i])
    }
}

metro.exit.drawer.Drawer.prototype.drawTitle = function (params) {
    var title = params['text'] || metro.exit.config.getStationI18nKey(params['station'])
    var coord = params['coord']
    //поворачиваем с самого начала, чтобы любые дополнительные украшалки текста были повернуты вместе с самим текстом.
    if (params['angle']) {
        this.ctx.save()
        this.ctx.translate(coord['x'], coord['y'])
        this.ctx.rotate(this.toRadians(params['angle']))
        this.ctx.translate(-coord['x'], -coord['y'])
    }

    if (params['type'] == 'neighbor') {
        this.drawUtils.drawNeighborRect(coord, title, params)
    } else {
        if (!params['color']) {
            params['color'] = metro.exit.config.getStationColor(params['station'])
        }
        this.drawUtils.drawText(coord, title, params['size'], params['color'])
    }
    if (params['angle']) {
        this.ctx.restore()
    }
}

/**
 * рисует на канвасе
 * param exits массив узлов выходов из станции
 *  структура node
 *    node.x - x координата узла на карте
 *    node.y - y координата узла на карте
 *    node.photo - гиперссылка на фото узла
 */
/*exits
metro.exit.drawer.Drawer.prototype.setExits = function(exits) {
    this.ctx.beginPath()
    for (var i = 0; i < exits.length; i++) {
        this.drawEdge(exits[i]["coord"])
    }
    this.ctx.fillStyle = "green"
    this.ctx.fill()
    this.exits = exits
}
*/

metro.exit.drawer.Drawer.prototype.toRadians = function (angle) {
    return angle * Math.PI / 180
}

metro.exit.drawer.Drawer.prototype.setViewPort = function (node) {
    var coord = node['coord']
    var canvasWidthHalf = this.canvas.offsetWidth >> 1
    var canvasHeightHalf = this.canvas.offsetHeight >> 1
    this.canvasUI['dragStart']({x:0, y:0})
    var dragToX = -coord.x + canvasWidthHalf
    var dragToY = -coord.y + canvasHeightHalf
    this.canvasUI['drag']({x:dragToX, y:dragToY})
    this.canvasUI['dragEnd']()
    var angle = node['angle']
    if (angle) {
        this.canvasUI['rotate']({x:canvasWidthHalf, y:canvasHeightHalf}, this.toRadians(angle))
    }
}

function changeColor(color, ratio, darker) {
    var difference = Math.round(ratio * 256) * (darker ? -1 : 1)
    var decimal = (parseInt(color.substr(1, 2), 16) + ',' +
        parseInt(color.substr(3, 2), 16) + ',' +
        parseInt(color.substr(5, 2), 16))
        .split(/,/)

    var result = 'rgb(' +
        Math[darker ? 'max' : 'min'](
          parseInt(decimal[0], 10) + difference, darker ? 0 : 255
        ) + ', ' +
        Math[darker ? 'max' : 'min'](
          parseInt(decimal[1], 10) + difference, darker ? 0 : 255
        ) + ', ' +
        Math[darker ? 'max' : 'min'](
          parseInt(decimal[2], 10) + difference, darker ? 0 : 255
        ) + ')'
    return result
}

function lighterColor(color, ratio) {
    return changeColor(color, ratio, false)
}

function darkerColor(color, ratio) {
    return changeColor(color, ratio, true)
}
/*photo
metro.exit.drawer.Drawer.prototype.drawPhoto = function(node) {
    this.ctx.drawImage(this.photoIcon,
        node["x"],
        node["y"],
        this.elems.photoIcon.width,
        this.elems.photoIcon.height
    )
}

metro.exit.drawer.Drawer.prototype.touchstartListener = function(e) {
    if (e.touches.length == 1) {
        this.touch = e.touches[0];
    }
}

metro.exit.drawer.Drawer.prototype.clickListener = function(e) {
    var touches
    if (e.changedTouches === undefined)
        touches = e.touches
    else
        touches = e.changedTouches
    if (touches !== undefined && touches.length == 1 && touches[0].pageX == this.touch.pageX && touches[0].pageY == this.touch.pageY) {
        if (this.exits && this.route) {
            var event = touches[0]
            var coord = this.getCursorPosition(event);
            //var coord2 = this.getCursorPosition2(event);
            //alert('{' + event.pageX + ':' + event.pageY + '}' + '{' + coord["x"] + ':' + coord["y"] + '}')
            //alert('{' + coord["x"] + ':' + coord["y"] + '}' + '{' + coord2["x"] + ':' + coord2["y"] + '}')
            for (var i = 0; i < this.exits.length; i++) {
                if (this.intersect(this.exits[i]["coord"], coord)) {
                    this.popupPhoto(this.exits[i]["coord"].photo)
                    return
                }
            }
            for (var i = 0; i < this.route.length; i++) {
                if (this.route[i]["coord"].photo && this.intersect(this.route[i]["coord"], coord)) {
                    this.popupPhoto(this.route[i]["coord"].photo)
                    return
                }
            }
        }
    }
}

metro.exit.drawer.Drawer.prototype.popupPhoto = function(photo) {
    //window.location.assign(metro.exit.config.getPhoto(this.stationId, photo))
    window.location.href = metro.exit.config.getPhoto(this.stationId, photo)
    //window.location.href = "touch.html"

//    var photoUrl = this.stationId + "/" + photo
//    if (!this.photo.current || this.photo.current != photoUrl) {
//        this.photo.current = photoUrl
//        this.photo.div.style.backgroundImage = "url(" + metro.exit.config.getPhoto(this.stationId, photo) + ")"
//    }
//    this.photo.popup.show()
}

metro.exit.drawer.Drawer.prototype.intersect = function(node, coord) {

    var photoIconX = node["x"] - this.elems.node.radius
    var photoIconY = node["y"] - this.elems.node.radius - this.elems.photoIcon.height

    return (coord["x"] >= photoIconX && coord["x"] <= photoIconX + this.elems.photoIcon.width) &&
        (coord["y"] >= photoIconY && coord["y"] <= photoIconY + this.elems.photoIcon.height)
}*/
