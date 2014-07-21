metro.exit.router = {}

metro.exit.router.build = function (info) {
    var stationIds = info["id"]
    if (info["noSelect"]) {
        //Несколько станций и на схеме они смешаны, пример Третьяковская, Китай-город.
        //В таком случае не имеет никакой разницы для какой из станций строить маршрут, поэтому берем первую - stationId[0]
        info.id = stationIds[0]
        metro.exit.router.buildStation(info)
    } else {
        //несколько станций на одной схеме либо одна станция
        metro.exit.router.buildStation(info)
    }
}
metro.exit.router.buildStation = function (info) {
    var scheme
    var page
    if (typeof info["id"] == "string") {
        page = "router.html"
        scheme = metro.exit.config.getStationScheme(info["id"])
    } else {
        page = "selectRoute.html"
        scheme = info["id"]
    }
    window.location.assign(
        page
            + "?id=" + scheme
            + "&lat=" + info['gps'][0]
            + "&lng=" + info['gps'][1]
            + (info["station"] ? "&station=" + info["station"] : "")
    )
}