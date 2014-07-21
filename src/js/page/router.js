metro.exit.RouterPage = function () {
    metro.exit.Page.call(this)
}

metro.exit.RouterPage.prototype = Object.create(metro.exit.Page.prototype)

metro.exit.RouterPage.prototype.init = function () {
    metro.exit.Page.prototype.init.call(this)

    this.params = this.parseRoute()
    this.router = new metro.exit.router.Router()
    this.router.buildRoute(this.params)
    this.drawer = new metro.exit.drawer.Drawer('container', this.router, this.params['scheme'])

    if (metro.exit.isAndroid()) {
        this.fixAndroid()
    }
}

/**
 * выдираем id и gps из входящих GET параметров
 */
metro.exit.RouterPage.prototype.parseRoute = function () {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    if (vars.length > 4 || vars.length < 3)
        throw new Error(i18n.text('page.wrongArgs'));
    var result = {'scheme':vars[0].split('=')[1], 'gps':[vars[1].split('=')[1], vars[2].split('=')[1]]}
    if (vars.length == 4)
        result['station'] = vars[3].split('=')[1]
    return result
}

metro.exit.RouterPage.prototype.fixAndroid = function () {
    this.touchDummyOnElem(document)
    var zoomControl = document.getElementById('container').nextSibling
    this.touchDummyOnElem(zoomControl)

    var backButton = document.getElementById('back')
    var hammer = window['Hammer'](backButton, {'prevent_default':true})
    hammer['on']('touch', metro.exit.back)
}

metro.exit.RouterPage.prototype.touchDummyOnElem = function (elem) {
    elem.addEventListener('touchstart', this.touchDummy, false)
    elem.addEventListener('touchmove', this.touchDummy, false)
    elem.addEventListener('touchend', this.touchDummy, false)
}

metro.exit.RouterPage.prototype.touchDummy = function (e) {
    e.preventDefault()
    return false
}

metro.exit.RouterPage.prototype.orient = function () {
    metro.exit.Page.prototype.orient.call(this)

    this.drawer.orient()
}

metro.exit.RouterPage.prototype.load = function () {
    var self = this
    this.drawer.loadMap(this.params['scheme'], function () {
        self.drawer.init()
        self.orient()
        if (metro.exit.isAndroid4()) {
            //Bugfix of http://stackoverflow.com/questions/12804710/android-4-html5-canvas-not-redrawing
            setTimeout(function () {
                self.drawer.setViewPort(self.router.getFirstRouteNode())
            }, 1100)
        } else {
            self.drawer.setViewPort(self.router.getFirstRouteNode())
        }
    })
}

window.onload = function () {
    metro.exit.HeaderPage(metro.exit.RouterPage)
    var page = new metro.exit.RouterPage()
    page.init('container')
    page.load()
}
