metro.exit.SaveTool = metro.exit.BaseTool.makeSubclass()

metro.exit.SaveTool.prototype.init = function (uiPanel, builder) {
    metro.exit.BaseTool.prototype.init.call(this, uiPanel, builder)

    var self = this
    this.makeIcon('S').addEventListener('click', function () {
        new metro.exit.RoutesConfigGenerator().generate(builder.nodes)
    })
}
