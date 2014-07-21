metro.exit.mmap.Types = {
    GOOGLE: 'g',
    LEAFLET: 'l'
}

metro.exit.mmap.MapFacade = function () {
}

metro.exit.mmap.MapFacade.create = function (mapType, callback) {
    //подключаем нужную Фабрику
    if (mapType == metro.exit.mmap.Types.GOOGLE) {
        window['googleMapLoadCallback'] = function () {
            callback(new metro.exit.mmap.GoogleFacade())
        }
        metro.exit.mmap.loadGoogleMap('googleMapLoadCallback')
    } else if (mapType == metro.exit.mmap.Types.LEAFLET) {
        //к сожалению здесь необходимо использовать metro.exit.loadScript, а не metro.exit.exec т.к. callback нельзя
        //исполнять сразу, а иначе js/LeafletMap.js будет считаться не исполненным
        callback(new metro.exit.mmap.LeafletFacade())
/*
        setTimeout(function(){
            metro.exit.mmap.createLeaflet()
            callback()
        }, 100)
*/
    }
}

metro.exit.mmap.MapFacade.prototype.init = function () {
}

/**
 * Создает карту
 * @param mapArea dom элемент для карты
 * @param center координаты центра
 * @return ссылку на карту
 */
metro.exit.mmap.MapFacade.prototype.createMap = function (mapArea, center) {
}

/**
 * @param map карта
 * @return {metro.exit.mmap.Markers} внешний вид выходов на карте
 */
metro.exit.mmap.MapFacade.prototype.createMarkers = function (map) {
    return new metro.exit.mmap.Markers(map)
}
/**
 * @param map карта
 * @param markers @see this.createMarkers
 * @return {metro.exit.mmap.Exits} Класс, отвечающий за логику работы с выходами.
 */
metro.exit.mmap.MapFacade.prototype.createExits = function (map, markers) {
    return new metro.exit.mmap.Exits(map, markers)
}

metro.exit.mmap.MapFacade.prototype.saveSelectedLayer = function () {
}
