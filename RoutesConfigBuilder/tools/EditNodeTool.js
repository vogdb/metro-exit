metro.exit.EditNodeTool = metro.exit.ToggleTool.makeSubclass()

metro.exit.EditNodeTool.prototype.init = function (uiPanel, builder) {
    metro.exit.ToggleTool.prototype.init.call(this, uiPanel, builder)

    this.addToPanel.call(this, 'D')
    this.clickListener = this.handleClick.bind(this)
}

metro.exit.EditNodeTool.prototype.doDisable = function () {
    this.builder.scheme.removeEventListener('click', this.clickListener)
}

metro.exit.EditNodeTool.prototype.doEnable = function () {
    this.builder.scheme.addEventListener('click', this.clickListener)
}


metro.exit.EditNodeTool.prototype.handleClick = function (e) {
    var coord = metro.exit.getCursorPosition(this.builder.scheme, e)
    var key = this.builder.getNodeKeyByCoord(coord)
    if (key) {
        this.builder.editNode(key)
    }
}