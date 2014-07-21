/**
 * Внешний вид выходов на карте
 * @param map карта
 * @constructor
 */
metro.exit.mmap.Markers = function (map) {
    this.map = map
    this.markers = {}
    this.init()
}

metro.exit.mmap.Markers.prototype.init = function () {
}

metro.exit.mmap.Markers.prototype.drawMarkers = function (markers) {
    for (var key in markers) {
        this.markers[key] = this.drawMarker(key, markers[key])
    }
}

metro.exit.mmap.Markers.prototype.removeMarkers = function (markers) {
    for (var key in markers) {
        this.removeMarker(key)
        delete this.markers[key]
    }
}
metro.exit.mmap.Markers.prototype.removeMarker = function (key) {
}

/**
 * Хранит в себе общую информацию о внешнем виде одного маркера.
 * @constructor
 */
metro.exit.mmap.MarkerIcon = {
    text: 'M',
    cssClass: 'icon'
}

metro.exit.mmap.MarkerIcon.create = function () {
    var div = document.createElement('div');
    div.className = this.cssClass
    div.innerHTML = this.text
    return div
}