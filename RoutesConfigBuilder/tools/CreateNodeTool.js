metro.exit.CreateNodeTool = metro.exit.ToggleTool.makeSubclass()

metro.exit.CreateNodeTool.prototype.init = function (uiPanel, builder) {
    metro.exit.ToggleTool.prototype.init.call(this, uiPanel, builder)

    this.addToPanel.call(this, 'N')
    this.clickListener = this.handleClick.bind(this)
    this.dblClickListener = this.handleDblClick.bind(this)
}

metro.exit.CreateNodeTool.prototype.doDisable = function () {
    this.builder.mode = this.builder.MODES.DEFAULT
    this.builder.scheme.removeEventListener('click', this.clickListener)
    this.builder.scheme.removeEventListener('dblclick', this.dblClickListener)
}

metro.exit.CreateNodeTool.prototype.doEnable = function () {
    this.builder.mode = this.builder.MODES.NODE
    this.builder.scheme.addEventListener('click', this.clickListener)
    this.builder.scheme.addEventListener('dblclick', this.dblClickListener)

}


metro.exit.CreateNodeTool.prototype.handleClick = function (e) {
    var coord = metro.exit.getCursorPosition(this.builder.scheme, e)
    var key = this.builder.getNodeKeyByCoord(coord)
    if (key) {
        this.builder.editNode(key)
    } else {
        this.builder.drawUtils.drawPoint(coord)
        this.builder.createNode(coord)
    }
}

metro.exit.CreateNodeTool.prototype.handleDblClick = function (e) {
    var coord = metro.exit.getCursorPosition(this.builder.scheme, e)
    if (this.builder.mode == this.builder.MODES.NODE) {
        var key = this.builder.getNodeKeyByCoord(coord)
        if (key) {
            this.builder.deleteNode(key)
        }
    }
}
