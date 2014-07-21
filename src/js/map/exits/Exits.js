/**
 * выходы из метро, доступные для карты
 * @param map карта
 * @param markers внешний вид выходов на карте
 * @constructor
 */
metro.exit.mmap.Exits = function(map, markers) {

    this.map = map//ссылка на google карту
    this.markers = markers//UI представление выходов
    this.exits = new metro.exit.HashSet()//хранилище выходов
    this.gpsSquare = new metro.exit.mmap.GpsSquare()

    this.init();
}

/**
 * Содержит код инициализации специфичный для используемой карты.
 */
metro.exit.mmap.Exits.prototype.init = function() {}

/**
 * обновляет выходы из метро для заданных границ карты
 * @param bounds границы карты {ne: LatLng, sw: LatLng}
 */
metro.exit.mmap.Exits.prototype.updateBounds = function(bounds) {
    //Обновление координат выходов
    if (bounds.ne[0] - bounds.sw[0] >= 0.2) {
        return -1;
    } else {
        var data = this.gpsSquare.process(bounds.ne, bounds.sw)
        //обработчик полученных выходов
        if (data.length > 0 && data.length > this.exits.sizeOfSet()) {
            this.markers.drawMarkers(this.exits.putAll(data))
        }
    }
}