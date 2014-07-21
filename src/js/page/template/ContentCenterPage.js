metro.exit.ContentCenterPage = function () {
    metro.exit.DefaultPage.call(this)
}

metro.exit.ContentCenterPage.prototype = Object.create(metro.exit.DefaultPage.prototype)

metro.exit.ContentCenterPage.prototype.vertical = function () {
    metro.exit.DefaultPage.prototype.vertical.call(this)
    this.paddingTop()
}

metro.exit.ContentCenterPage.prototype.horizontal = function () {
    metro.exit.DefaultPage.prototype.horizontal.call(this)
    this.paddingTop()
}

metro.exit.ContentCenterPage.prototype.paddingTop = function () {
    var content = this.content
    content.style.paddingTop = '0'
    if (window.innerHeight - content.offsetHeight > 0) {
        var padding = Math.floor((window.innerHeight - content.offsetHeight) / 2)
        if (padding > 0) {
            content.style.paddingTop = padding + 'px'
        }
    } else {
        //когда содержимое превышает высоту body, необходимо растянуть body
        //body{height: auto}
        document.body.style.height = 'auto'
        //html{height: auto}
        document.documentElement.style.height = 'auto'
    }
}