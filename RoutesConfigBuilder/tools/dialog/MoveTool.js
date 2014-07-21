metro.exit.MoveTool = metro.exit.DialogTool.makeSubclass()

metro.exit.MoveTool.prototype.init = function (uiPanel, builder) {
    metro.exit.DialogTool.prototype.init.call(this, uiPanel, builder)

    this.makeUI('move')

    this.button.onclick = this.apply.bind(this)
}

metro.exit.MoveTool.prototype.apply = function () {
    var nodes = this.builder.nodes
    var x = parseInt(this.x.value)
    var y = parseInt(this.y.value)
    for (var nodeKey in nodes) {
        var nodeCoord = nodes[nodeKey]['coord']
        this.builder.moveNode(nodeKey, createCoord(nodeCoord['x'] + x, nodeCoord['y'] + y))
    }
}