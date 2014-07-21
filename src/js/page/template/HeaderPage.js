metro.exit.HeaderPage = function (klass) {

    var proto = klass.prototype
    proto.HORIZONTAL = 'horizontal'
    proto.VERTICAL = 'vertical'

    proto.makeTextHorizontal = function (text) {
        return text.replace(/(.)<br\/?>/g, '$1')
    }

    proto.makeTextVertical = function (text) {
        return text.replace(/(.)/g, '$1<br/>')
    }

    proto.makeElemVertical = function (elem) {
        var children = elem.children
        for (var childIndex = 0; childIndex < children.length; childIndex++) {
            var child = children[childIndex]
            child.innerHTML = this.makeTextVertical(child.innerHTML)
        }
    }

    proto.makeElemHorizontal = function (elem) {
        var children = elem.children
        for (var childIndex = 0; childIndex < children.length; childIndex++) {
            var child = children[childIndex]
            child.innerHTML = this.makeTextHorizontal(child.innerHTML)
        }
    }

    var _superInit = proto.init
    proto.init = function (headerAdjacent) {
        _superInit.call(this)

        this.header = document.getElementById('header')
        this.headerFont = new metro.exit.Font(10, 0.45)
        this.backFontVertical = new metro.exit.Font(5, 0.3)
        this.backFontHorizontal = new metro.exit.Font(5, 0.35)
        this.back = document.getElementById('back')
        this.headerAdjacent = document.getElementById(headerAdjacent)
    }

    var _superHorizontal = proto.horizontal
    proto.horizontal = function () {
        this.headerAdjacent.style['float'] = 'right'
        this.headerAdjacent.style.height = '100%'

        this.header.className = this.HORIZONTAL
        this.header.style.fontSize = this.headerFont.calculateSizePxCss(this.header.offsetHeight)

        this.makeElemVertical(this.header)
        this.back.style.fontSize = this.backFontHorizontal.calculateSizePxCss(this.header.offsetHeight)

        //IMPORTANT! This calculation must be at the end because it uses document.body which is stable only after all css changes applied
        this.headerAdjacent.style.width = (document.body.offsetWidth - this.header.offsetWidth) + 'px'

        //IMPORTANT! HeaderPage layout is superior to any other layout, so his invocation comes first
        _superHorizontal.call(this)
    }

    var _superVertical = proto.vertical
    proto.vertical = function () {
        this.headerAdjacent.style['float'] = 'none'
        this.headerAdjacent.style.width = '100%'

        this.header.className = this.VERTICAL
        this.header.style.fontSize = this.headerFont.calculateSizePxCss(this.header.offsetWidth)

        this.makeElemHorizontal(this.header)
        this.back.style.fontSize = this.backFontVertical.calculateSizePxCss(this.header.offsetWidth)

        //IMPORTANT! This calculation must be at the end because it uses document.body which is stable only after all css changes applied
        this.headerAdjacent.style.height = (document.body.offsetHeight - this.header.offsetHeight) + 'px'

        /*IMPORTANT! HeaderPage layout is superior to any other layout, so his invocation comes first*/
        _superVertical.call(this)
    }
}