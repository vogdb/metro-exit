metro.exit.SelectRoute = function () {
    metro.exit.ContentCenterPage.call(this)

    this.SELECTED_STATION_HOLDER_ID = 'selectedStation'
}

metro.exit.SelectRoute.prototype = Object.create(metro.exit.ContentCenterPage.prototype)

metro.exit.SelectRoute.prototype.init = function () {
    metro.exit.ContentCenterPage.prototype.init.call(
        this,
        {font:{
            vertical:new metro.exit.Font(15, 0.95),
            horizontal:new metro.exit.Font(22, 0.95)
        }}
    )

    this.params = this.parseParams()
    this.createRoutesUI()
    var self = this
    document.getElementById("go").onclick = function () {
        self.select()
    }
}

metro.exit.SelectRoute.prototype.parseParams = function () {
    //вырезаем из запроса "?", поэтому substring(1)
    var query = decodeURIComponent(window.location.search.substring(1))
    var params = query.split("&")
    if (params.length !== 3)
        alert(i18n.text('page.wrongArgs'))
    return params
}

metro.exit.SelectRoute.prototype.createRoutesUI = function () {
    var container = document.getElementById("routes")
    var stations = this.params[0].substring(3).split(",")
    for (var i = 0; i < stations.length; i++) {
        container.appendChild(this.createSingleRouteUI(stations[i]))
    }
    new metro.exit.SelectableList(container, this.SELECTED_STATION_HOLDER_ID).init()
}

metro.exit.SelectRoute.prototype.createSingleRouteUI = function (stationId) {
    var wrapper = document.createElement("li")
    wrapper.className = "station"

    var stationColor = metro.exit.StationPrompt.getColor(stationId)

    var input = document.createElement("input")
    input.setAttribute("type", "hidden")
    input.setAttribute("value", stationId)

    wrapper.appendChild(stationColor)
    wrapper.appendChild(input)
    metro.exit.StationPrompt.appendTitle(wrapper, stationId)

    return wrapper
}

metro.exit.SelectRoute.prototype.select = function () {
    var inputValue = document.getElementById(this.SELECTED_STATION_HOLDER_ID).value
    if (inputValue) {
        metro.exit.router.buildStation({
            id:inputValue,
            'gps':[this.params[1].split("=")[1], this.params[2].split("=")[1]],
            "station":inputValue
        })
    } else {
        alert(i18n.text('page.selectRoute.emptyInput'))
    }
    return false
}

window.onload = function () {
    function load() {
        metro.exit.HeaderPage(metro.exit.SelectRoute)
        var page = new metro.exit.SelectRoute()
        page.init('contentWrapper')
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