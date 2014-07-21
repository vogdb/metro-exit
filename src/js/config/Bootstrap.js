/**
 * Created: vogdb Date: 5/19/12 Time: 6:45 PM
 */
metro.exit.BOOTSTRAP_VERSION = 15
metro.exit.BOOTSTRAP_STORAGE_KEY = 'metro-exit-' + metro.exit.BOOTSTRAP_VERSION

metro.exit.isBootstrapped = function () {
    return localStorage.getItem(metro.exit.BOOTSTRAP_STORAGE_KEY) == 'true'
}
//Botstrap отработал и больше не будет запускаться при старте приложения
metro.exit.setBootstrapped = function () {
    localStorage.setItem(metro.exit.BOOTSTRAP_STORAGE_KEY, 'true')
}

metro.exit.Storage = function () {
    this.data = {}
}

metro.exit.Storage.prototype.dump = function () {
    this.dumpAddress()
    this.dumpMap()
}

metro.exit.Storage.prototype.dumpAddress = function () {
    if (localStorage.getItem('address')) {
        this.data['address'] = localStorage.getItem('address')
    }
}

metro.exit.Storage.prototype.restoreAddress = function () {
    for (var key in this.data) {
        localStorage.setItem(key, this.data[key])
    }
}

metro.exit.Storage.prototype.dumpMap = function () {
    this.mapType = metro.exit.config.getMapType()
    this.leafletLayerName = metro.exit.mmap.LeafletFacade.restoreLayerName()
    this.googleLayerName = metro.exit.mmap.GoogleFacade.restoreLayerName()
}

metro.exit.Storage.prototype.restoreMap = function () {
    metro.exit.config.setMapType(this.mapType)
    metro.exit.mmap.LeafletFacade.saveLayerName(this.leafletLayerName)
    metro.exit.mmap.GoogleFacade.saveLayerName(this.googleLayerName)
}

metro.exit.Storage.prototype.restore = function () {
    this.restoreAddress()
    this.restoreMap()
}

metro.exit.bootstrap = function () {
    var storage = new metro.exit.Storage()
    storage.dump()
    localStorage.clear()
    storage.restore()

    //цвета станций
    var colors = metro.exit.execRet('js/config/color.js')()
    for (var key in colors) {
        var ids = colors[key][1]
        for (var i = 0; i < ids.length; i++) {
            localStorage.setItem(ids[i] + '.clr', colors[key][0])
        }
    }
    //схемы станций
    var schemes = metro.exit.execRet('js/config/scheme.js')()
    for (key in schemes) {
        if (schemes[key] == 1)
            localStorage.setItem(key + '.sch', key)
        else
            localStorage.setItem(key + '.sch', schemes[key])
    }
    metro.exit.setBootstrapped()
}
