metro.exit.DefaultPage = function () {
    metro.exit.Page.call(this)
}

metro.exit.DefaultPage.prototype = Object.create(metro.exit.Page.prototype)

metro.exit.DefaultPage.prototype.init = function (args) {
    metro.exit.Page.prototype.init.call(this)
    this.contentWrapper = document.getElementById('contentWrapper')
    this.content = document.getElementById('content')
    this.font = {vertical:metro.exit.Font.DEFAULT_VERTICAL, horizontal:metro.exit.Font.DEFAULT_HORIZONTAL}
    if (args && args.font) {
        metro.exit.extend(this.font, args.font)
    }
}

metro.exit.DefaultPage.prototype.vertical = function () {
    this.contentWrapper.style.fontSize = this.font.vertical.calculateSizePxCss(this.contentWrapper.offsetWidth)
    if (this.content) {
        this.content.style.width = this.font.vertical.sizeEm + 'em'
    }
}

metro.exit.DefaultPage.prototype.horizontal = function () {
    this.contentWrapper.style.fontSize = this.font.horizontal.calculateSizePxCss(this.contentWrapper.offsetWidth)
    if (this.content) {
        this.content.style.width = this.font.horizontal.sizeEm + 'em'
    }
}