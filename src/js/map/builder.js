/////////////// класс рисующий google карту с выходами метро/////////////
metro.exit.mmap.Builder = function(mapArea) {
    this.mapArea = document.getElementById(mapArea)//место для карты
    this.map//карта
    this.exits//выходы метро
}

metro.exit.mmap.Builder.prototype.init = function () {
    var coord = this.parseInput()
    var self = this
    metro.exit.mmap.MapFacade.create(metro.exit.config.getMapType(),
        function (facade) {
            facade.init()
            var map = facade.createMap(self.mapArea, coord)
            var markers = facade.createMarkers(map)
            facade.createExits(map, markers)
        }
    )
}

/**
 * выдираем коорд. из входящих GET параметров
 */
metro.exit.mmap.Builder.prototype.parseInput = function() {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    if (vars.length < 2)
        alert("неверные входящие параметры");

    return {gps: [parseFloat(vars[0].split("=")[1]), parseFloat(vars[1].split("=")[1])], noMarker: vars.length == 3}
}
