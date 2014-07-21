metro.exit.ScaleTool = metro.exit.DialogTool.makeSubclass()

metro.exit.ScaleTool.prototype.init = function (uiPanel, builder) {
    metro.exit.DialogTool.prototype.init.call(this, uiPanel, builder)

    this.makeUI('scale')

    this.button.onclick = this.apply.bind(this)
}

metro.exit.ScaleTool.prototype.apply = function () {
    var nodes = this.builder.nodes
    var x = parseFloat(this.x.value)
    var y = parseFloat(this.y.value)
    for (var nodeKey in nodes) {
        var nodeCoord = nodes[nodeKey]['coord']
        this.builder.moveNode(nodeKey, createCoord(Math.round(nodeCoord['x'] * x), Math.round(nodeCoord['y'] * y)))
    }
}