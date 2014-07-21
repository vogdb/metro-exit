metro.exit.Page = function () {
}

metro.exit.Page.prototype.init = function () {
    i18n.setLocale(I18n.restoreLocale())
    var i18nElements = document.querySelectorAll('.i18n')
    for (var i = 0; i < i18nElements.length; i++) {
        var i18elem = i18nElements[i]
        if(i18elem.innerHTML){
            i18elem.innerHTML = i18n.text(i18elem.innerHTML)
            i18elem.className = i18elem.className.replace('i18n', '')
        } else {
            var placeHolder = i18elem.getAttribute('placeholder')
            i18elem.setAttribute('placeholder', i18n.text(placeHolder))
        }
    }
    var self = this
    window.addEventListener('orientationchange', function () {
        //обязательно timeout, т.к. перестроение элементов интерфейса идет позднее срабатывания события.
        setTimeout(function () {
            self.orient()
        }, 1000)
    })
}

metro.exit.Page.prototype.orient = function () {
    var w = window.innerWidth
    var h = window.innerHeight
    if (w <= h) {
        this.vertical()
    } else {
        this.horizontal()
    }
}
metro.exit.Page.prototype.horizontal = function () {
}
metro.exit.Page.prototype.vertical = function () {
}
