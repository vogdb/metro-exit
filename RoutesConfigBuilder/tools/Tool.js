metro.exit.BaseTool = Object.makeSubclass()

metro.exit.BaseTool.prototype.init = function (uiPanel, builder) {
    this.uiPanel = uiPanel
    this.builder = builder
}

metro.exit.BaseTool.prototype.makeIcon = function (iconSymbol) {
    var tool = document.createElement('div')
    tool.className = 'icon'
    tool.innerHTML = iconSymbol
    this.uiPanel.appendChild(tool)
    return tool
}

metro.exit.ToggleTool = metro.exit.BaseTool.makeSubclass()
metro.exit.ToggleTool.activeTool = undefined
metro.exit.ToggleTool.prototype.tool = undefined

metro.exit.ToggleTool.prototype.addToPanel = function (iconSymbol) {
    var tool = this.makeIcon(iconSymbol)
    this.tool = tool
    var self = this
    tool.addEventListener('click', function (e) {
        if (tool.className.indexOf('active') !== -1) {
            self.disable()
        } else {
            self.enable()
        }
    })
    return tool
}

metro.exit.ToggleTool.prototype.enable = function () {
    if (metro.exit.ToggleTool.activeTool) {
        metro.exit.ToggleTool.activeTool.disable()
    }
    this.tool.className = this.tool.className + ' active'
    metro.exit.ToggleTool.activeTool = this
    this.doEnable()
}

metro.exit.ToggleTool.prototype.disable = function () {
    if (metro.exit.ToggleTool.activeTool) {
        metro.exit.ToggleTool.activeTool = undefined
    }
    this.tool.className = this.tool.className.replace(' active', '')
    this.doDisable()
}
