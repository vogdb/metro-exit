metro.exit.DialogTool = Object.makeSubclass()

metro.exit.DialogTool.prototype.init = function (uiPanel, builder) {
    this.uiPanel = uiPanel
    this.builder = builder
}

metro.exit.DialogTool.prototype.makeUI = function (text) {
    var tool = document.createElement('div')
    tool.className = 'dialog'
    tool.appendChild(this.createTitle(text))
    this.content = this.createContent()
    tool.appendChild(this.content)
    this.uiPanel.appendChild(tool)
    return tool
}

metro.exit.DialogTool.prototype.createTitle = function (text) {
    var title = document.createElement('div')
    title.className = 'title'
    title.innerHTML = text
    title.onclick = function () {
        if (isHidden(this.content)) {
            this.content.style.display = 'block'
        } else {
            this.content.style.display = 'none'
        }
    }.bind(this)
    return title
}

metro.exit.DialogTool.prototype.createContent = function () {
    var content = document.createElement('div')
    content.className = 'content'
    var x = this.createCoord('x')
    content.appendChild(x)
    this.x = x.input
    var y = this.createCoord('y')
    content.appendChild(y)
    this.y = y.input
    this.button = this.createButton()
    content.appendChild(this.button)
    return content
}

metro.exit.DialogTool.prototype.createCoord = function (titleText) {
    var coord = document.createElement('div')
    coord.className = 'coord'
    var title = document.createElement('div')
    title.innerHTML = titleText
    coord.appendChild(title)
    var input = document.createElement('input')
    input.setAttribute('type', 'text')
    coord.appendChild(input)
    coord.input = input
    return coord
}

metro.exit.DialogTool.prototype.createButton = function () {
    var button = document.createElement('button')
    button.innerHTML = 'apply'
    return button
}