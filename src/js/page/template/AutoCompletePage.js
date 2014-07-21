metro.exit.AutoCompletePage = function (page) {
    metro.exit.HeaderPage(page)

    var proto = page.prototype

    var _superInit = proto.init
    proto.init = function (headerAdjacent) {
        _superInit.call(this, headerAdjacent)

        this.headerAdjacent.appendChild(this.prompter['list']['ul'])

        this.prompterList = document.getElementsByClassName('prompter')[0]
        this.control = document.getElementById('control')
    }

    proto.getElemPadding = function(){
        return parseInt(window.getComputedStyle(this.headerAdjacent).getPropertyValue('font-size')) / 3
    }

    var _superHorizontal = proto.horizontal
    proto.horizontal = function () {
        _superHorizontal.call(this)

        this.headerAdjacent.className = this.HORIZONTAL
        this.control.style.paddingTop = '0'
        this.prompterList.style.paddingTop = this.control.offsetHeight + 'px'
        if (metro.exit.isAndroid23()) {
            this.control.style.paddingLeft = this.header.offsetWidth + 'px'
        }
    }

    var _superVertical = proto.vertical
    proto.vertical = function () {
        _superVertical.call(this)

        this.headerAdjacent.className = this.VERTICAL
        var headerBottom = this.header.offsetHeight
        this.control.style.paddingTop = headerBottom + 'px'
        this.prompterList.style.paddingTop = this.control.offsetHeight + 'px'
        if (metro.exit.isAndroid23()) {
            this.control.style.paddingLeft = '0.2em'
        }
    }
}