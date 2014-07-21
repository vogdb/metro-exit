metro.exit.NodeEditor = function (canvas, builder) {
    this.offsetLeft = canvas.offsetLeft
    this.builder = builder

    var editor = document.createElement('div')
    editor.setAttribute('id', 'nodeEditor')
    document.body.appendChild(editor)

    function createDiv(name) {
        var div = document.createElement('div')
        div.setAttribute('class', name)
        editor.appendChild(div)
        return div
    }

    var self = this
    var close = createDiv('close')
    close.addEventListener('click', function () {
        self.close()
    })
    close.innerHTML = 'X'
    //node area
    var node = createDiv('node')

    function createSpan(text, appendTo) {
        var span = document.createElement('span')
        span.innerHTML = text
        appendTo.appendChild(span)
    }

    function createInput(appendTo, name) {
        var input = document.createElement('input')
        input.setAttribute('type', 'text')
        input.setAttribute('size', '5')
        input.setAttribute('value', '')
        input.setAttribute('name', name)
        appendTo.appendChild(input)
        return input
    }

    createSpan(' x: ', node)
    this.x = createInput(node, 'x')
    this.x.onchange = function () {
        self.updateNodeCoord()
    }
    createSpan('<br/> y: ', node)
    this.y = createInput(node, 'y')
    this.y.onchange = function () {
        self.updateNodeCoord()
    }

    //edge area
    var edge = createDiv('edge')
    createSpan('Помни, что параметры отвечают за связь с потомком.', edge)
    function createOption(select, value, text) {
        var opt = document.createElement('option')
        opt.value = value
        opt.innerHTML = text
        select.appendChild(opt)
    }

    //node type
    createSpan('<br/> type: ', edge)
    var type = document.createElement('select')
    type.setAttribute('name', 'type')
    edge.appendChild(type)
    type.onchange = function () {
        self.updateNodeAttrElem(type)
    }
    this.type = type

    /*
     type.addEventListener('change', function () {
     self.updateNodeAttrElem(type)
     })
     */
    createOption(type, '', 'undefined')
    createOption(type, 'none', 'none')
    createOption(type, 'line', 'line')

    //node color
    createSpan('<br/> color: ', edge)
    var color = document.createElement('select')
    color.setAttribute('name', 'color')
    edge.appendChild(color)
    createOption(color, '', 'undefined')
    createOption(color, 'dim', 'dim')
    color.onchange = function () {
        self.updateNodeAttrElem(color)
    }
    this.color = color

    /*
     color.addEventListener('change', function () {
     self.updateNodeAttrElem(color)
     })
     */

    //node station
    createSpan('<br/> station: ', edge)
    var station = createInput(edge, 'station')
    station.onchange = function () {
        self.updateNodeAttrElem(station)
    }
    this.station = station

    //node angle
    createSpan('<br/> angle: ', edge)
    var angle = createInput(edge, 'angle')
    angle.onchange = function () {
        self.updateNodeAttrElem(angle)
    }
    this.angle = angle

    //gps lat
    createSpan('<br/><br/> gps: ', edge)
    var gps = createInput(edge, 'lat')
    gps.setAttribute('size', '12')

    gps.onchange = function () {
        var val = gps.value.trim().split(',')
        if (val.length === 2) {
            val = [+val[0], +val[1]]
        } else {
            val = null
        }
        self.updateNodeAttr(val, 'gps')
    }
    this.gps = gps
    this.editor = editor
}

metro.exit.NodeEditor.prototype.updateNodeAttrElem = function (attr) {
    this.updateNodeAttr(attr.value, attr.getAttribute('name'))
}

metro.exit.NodeEditor.prototype.updateNodeAttr = function (attrVal, attrName) {
    if (attrVal) {
        this.builder.addNodeAttr(this.nodeKey, attrName, attrVal)
    } else {
        this.builder.removeNodeAttr(this.nodeKey, attrName)
    }
}

metro.exit.NodeEditor.prototype.updateNodeCoord = function () {
    this.setNode(
        this.builder.moveNode(
            this.nodeKey,
            createCoord(+this.x.value, +this.y.value)
        )
    )
}

metro.exit.NodeEditor.prototype.setNode = function (nodeKey) {
    this.nodeKey = nodeKey
    var node = this.builder.getNode(nodeKey)
    var coord = node['coord']
    if (!this.editor.style.display || this.editor.style.display == 'none')
        this.editor.style.display = 'block'

    this.editor.style.left = Math.round(coord['x'] + this.offsetLeft + 50) + 'px'
    this.editor.style.top = Math.round(coord['y'] + 50) + 'px'

    this.x.value = coord["x"]
    this.y.value = coord["y"]

    var props = ['angle', 'station', 'color', 'type']
    for (var i = 0; i < props.length; i++) {
        if (node[props[i]]) {
            this[props[i]].value = node[props[i]]
        } else {
            this[props[i]].value = ''
        }
    }

    if (node['gps']) {
        this.gps.value = node['gps'][0] + ',' + node['gps'][1]
    } else {
        this.gps.value = ''
    }
}

metro.exit.NodeEditor.prototype.close = function () {
    this.editor.style.display = 'none'
}