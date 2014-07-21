metro.exit.mmap.GoogleFacade = function () {
    metro.exit.mmap.MapFacade.call(this)
}



metro.exit.mmap.GoogleFacade.LAYER_STORAGE_KEY = 'gmap.layer'

metro.exit.mmap.GoogleFacade.restoreLayerName = function(){
    return localStorage.getItem(metro.exit.mmap.GoogleFacade.LAYER_STORAGE_KEY)
}

metro.exit.mmap.GoogleFacade.getDefaultLayerName = function(){
    return google.maps.MapTypeId.ROADMAP
}

metro.exit.mmap.GoogleFacade.saveLayerName = function (name) {
    if (name) {
        localStorage.setItem(metro.exit.mmap.GoogleFacade.LAYER_STORAGE_KEY, name)
    }
}



metro.exit.mmap.GoogleFacade.prototype = Object.create(metro.exit.mmap.MapFacade.prototype)

metro.exit.mmap.GoogleFacade.prototype.createMap = function (marArea, center) {
    var gcenter = new google.maps.LatLng(center.gps[0], center.gps[1])
    var layerName = metro.exit.mmap.GoogleFacade.restoreLayerName()
    if(!layerName){
        layerName = metro.exit.mmap.GoogleFacade.getDefaultLayerName()
        metro.exit.mmap.GoogleFacade.saveLayerName(layerName)
    }
    var myOptions = {
        zoom:17,
        center:gcenter,
        mapTypeId:layerName
    };

    var map = new google.maps.Map(marArea, myOptions)
    if (!center.noMarker)
        var marker = new google.maps.Marker({
            position:gcenter,
            optimized:false,
            map:map,
            title:"Вам сюда"
        });
    this.map = map
    return map
}

metro.exit.mmap.GoogleFacade.prototype.createMarkers = function (map) {
    return new metro.exit.mmap.GoogleMarkers(map)
}

metro.exit.mmap.GoogleFacade.prototype.createExits = function (map, markers) {
    return new metro.exit.mmap.GoogleExits(map, markers)
}

metro.exit.mmap.GoogleFacade.prototype.saveSelectedLayer = function () {
    metro.exit.mmap.GoogleFacade.saveLayerName(this.map.getMapTypeId())
}