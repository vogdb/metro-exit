metro.exit.EdgeTool = metro.exit.ToggleTool.makeSubclass()

metro.exit.EdgeTool.prototype.init = function (uiPanel, builder) {
    metro.exit.ToggleTool.prototype.init.call(this, uiPanel, builder)

    this.addToPanel.call(this, 'E')
    this.clickListener = this.handleClick.bind(this)
}

metro.exit.EdgeTool.prototype.doDisable = function () {
    this.builder.mode = this.builder.MODES.DEFAULT
    this.builder.scheme.removeEventListener('click', this.clickListener)
}

metro.exit.EdgeTool.prototype.doEnable = function () {
    this.builder.mode = this.builder.MODES.EDGE
    this.builder.scheme.addEventListener('click', this.clickListener, false)
}


metro.exit.EdgeTool.prototype.handleClick = function (e) {
    var coord = metro.exit.getCursorPosition(this.builder.scheme, e)
    var key
    var builder = this.builder
    if (this.parentNodeKey) {
        //соединяем со вторым узлом
        key = builder.getNodeKeyByCoord(coord)
        if (key) {
            if (this.parentNodeKey == key) {
                return
            }
            var parent = builder.getNode(this.parentNodeKey)
            var child = builder.getNode(key)
            if (child['parent']) {
                child['parent'].push(parent)
            } else {
                child['parent'] = [parent]
            }
            if (parent['children']) {
                parent['children'].push(child)
            } else {
                parent['children'] = [child]
            }
            builder.drawUtils.draw(parent, child)
            this.release()
        }
    } else {
        //запоминаем первый узел(родитель)
        key = builder.getNodeKeyByCoord(coord)
        if (key) {
            this.parentNodeKey = key
            this.builder.drawUtils.drawPoint(this.builder.getNode(key)['coord'], 'blue')
        }
    }
}

metro.exit.EdgeTool.prototype.release = function () {
    if (this.parentNodeKey) {
        this.builder.drawUtils.drawPoint(this.builder.getNode(this.parentNodeKey)['coord'])
        this.parentNodeKey = undefined
    }
}
