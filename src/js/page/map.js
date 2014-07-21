metro.exit.MapPage = function () {
    metro.exit.Page.call(this)
}

metro.exit.MapPage.prototype = Object.create(metro.exit.Page.prototype)

metro.exit.MapPage.prototype.init = function () {
    metro.exit.Page.prototype.init.call(this)

    var builder = new metro.exit.mmap.Builder("mapArea")
    builder.init()
}

window.onload = function () {
    function load() {
        metro.exit.HeaderPage(metro.exit.MapPage)
        var page = new metro.exit.MapPage()
        page.init('mapArea')
        page.orient()
    }

    if (window['cordova'] !== undefined) {
        /*
         if 'cordova' defined than wait for until it loads. This is necessary for Android 2.X because when you got back from
         the router page window needs time to resize from big router's canvas.
         */
        document.addEventListener('deviceready', load, true)
    } else {
        //this means that app works in desktop browser
        load()
    }
}
