metro.exit.Config.prototype.MAP_TYPE_STORAGE_KEY = 'mapType'
metro.exit.Config.prototype.getMapType = function () {
    var type = localStorage.getItem(this.MAP_TYPE_STORAGE_KEY)
    if (type) {
        return type
    } else {
        return metro.exit.mmap.Types.LEAFLET
    }
}
metro.exit.Config.prototype.setMapType = function (mapType) {
    return localStorage.setItem(this.MAP_TYPE_STORAGE_KEY, mapType)
}
metro.exit.Config.prototype.getGpsSquare = function (squareName) {
    if (this.gpsSquare === undefined) {
        this.gpsSquare = metro.exit.execRet('js/config/gpsSquare/moscow.js')();
    }
    return this.gpsSquare[squareName];
}