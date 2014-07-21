metro.exit.mmap.LeafletFacade = function () {
    metro.exit.mmap.MapFacade.call(this)
}



metro.exit.mmap.LeafletFacade.LAYER_STORAGE_KEY = 'leaflet.layer'

metro.exit.mmap.LeafletFacade.restoreLayerName = function(){
    return localStorage.getItem(metro.exit.mmap.LeafletFacade.LAYER_STORAGE_KEY)
}

metro.exit.mmap.LeafletFacade.getDefaultLayerName = function(){
    return LeafletProviderFabric._getName(LeafletProviderFabric.providers.OpenStreetMap['variants'].Mapnik)
}

metro.exit.mmap.LeafletFacade.saveLayerName = function (name) {
    if (name) {
        localStorage.setItem(metro.exit.mmap.LeafletFacade.LAYER_STORAGE_KEY, name)
    }
}



metro.exit.mmap.LeafletFacade.prototype = Object.create(metro.exit.mmap.MapFacade.prototype)

metro.exit.mmap.LeafletFacade.prototype.init = function () {
    metro.exit.loadRel('css/leaflet.css')

    metro.exit.exec('js/3rdparty/leaflet.js')
    //правим путь к картинкам leaflet'a
    L['Icon']['Default']['imagePath'] = metro.exit.defineAbsolutePath('css/images')
    metro.exit.exec('js/3rdparty/leaflet.active-layers.min.js')
}

metro.exit.mmap.LeafletFacade.prototype.createMap = function (marArea, center) {
    var map = L.map(marArea)['setView'](center.gps, 16)
    this.providerFabric = new LeafletProviderFabric()
    var layerName = metro.exit.mmap.LeafletFacade.restoreLayerName()
    if(!layerName){
        layerName = metro.exit.mmap.LeafletFacade.getDefaultLayerName()
        metro.exit.mmap.LeafletFacade.saveLayerName(layerName)
    }
    var defaultLayer = this.providerFabric.layers()[layerName]
    defaultLayer['addTo'](map)
    if (L['Browser']['android23']) {
        this.control = L['control']['activeLayers'](this.providerFabric.layers(), {})
    } else {
        metro.exit.exec('js/3rdparty/leaflet.select-layers.min.js')
        this.control = L['control']['selectLayers'](this.providerFabric.layers(), {})
    }
    this.control['addTo'](map)
    if (!center.noMarker)
        L['marker'](center.gps)['addTo'](map)
    return map
}

metro.exit.mmap.LeafletFacade.prototype.createMarkers = function (map) {
    return new metro.exit.mmap.LeafletMarkers(map)
}

metro.exit.mmap.LeafletFacade.prototype.createExits = function (map, markers) {
    return new metro.exit.mmap.LeafletExits(map, markers)
}

metro.exit.mmap.LeafletFacade.prototype.saveSelectedLayer = function () {
    var layer = this.control['getActiveBaseLayer']()
    //we know that we have only ONE layer on the map
    if (!layer) {
        alert('Leaflet map should have the base layer')
    }
    metro.exit.mmap.LeafletFacade.saveLayerName(layer['name'])
}