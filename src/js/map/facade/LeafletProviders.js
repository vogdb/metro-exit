var LeafletProviderFabric = function () {}



LeafletProviderFabric.providers = {}

LeafletProviderFabric.providers.OpenStreetMap = {
    url:'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    options:{
        'attribution':'&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
    },
    'variants':{
        Mapnik:{
            name:'Open Street Map'
        },
        BlackAndWhite:{
            name:'Black And White',
            url:'http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png'
        }
    }
}

LeafletProviderFabric.providers.Thunderforest = {
    url:'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
    options:{
        'attribution':'&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, ' + LeafletProviderFabric.providers.OpenStreetMap.options['attribution']
    },
    'variants':{
        OpenCycleMap:{
            name:'Open Cycle Map'
        },
        Transport:{
            name:'Open Cycle Map Transport',
            url:'http://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png'
        },
        Landscape:{
            name:'Open Cycle Map Landscape',
            url:'http://{s}.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png'
        }
    }
}

LeafletProviderFabric.providers.MapQuestOpen = {
    name:'Map Quest Open',
    url:'http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg',
    options:{
        'attribution':'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data ' + LeafletProviderFabric.providers.OpenStreetMap.options['attribution'],
        'subdomains':'1234'
    }
}
LeafletProviderFabric.providers.Stamen = {
    name:'Stamen',
    url:'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png',
    options:{
        'attribution':'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; ' +
            'Map data ' + LeafletProviderFabric.providers.OpenStreetMap.options['attribution'],
        'subdomains':'abcd',
        'minZoom':0,
        'maxZoom':20
    }
}
LeafletProviderFabric.providers.Esri = {
    url:'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    'variants':{
        WorldStreetMap:{
            name:'Esri World Street Map',
            options:{
                'attribution':'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
            }
        },
        WorldTopoMap:{
            name:'Esri World Topo Map',
            url:'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
            options:{
                'attribution':'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
            }
        },
        WorldImagery:{
            name:'Esri World Imagery Map',
            url:'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            options:{
                'attribution':'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            }
        }
    }
}

LeafletProviderFabric._getName = function (provider) {
    if (!provider.name) {
        alert('provider must have a name!')
    }
    return provider.name
}



LeafletProviderFabric.prototype.layers = function () {
    if (this._layers === undefined) {
        this._initLayers()
    }
    return this._layers
}

LeafletProviderFabric.prototype._tileLayer = function (provider) {
    return L['tileLayer'](provider.url, provider.options)
}

LeafletProviderFabric.prototype._initLayers = function () {
    this._layers = {}
    var providers = LeafletProviderFabric.providers
    for (var providerName in providers) {
        this._providerLayers(providers[providerName])
    }
}

LeafletProviderFabric.prototype._providerLayers = function (providerValue) {
    if (providerValue['variants']) {
        var variants = providerValue['variants']
        for (var variantName in variants) {
            var variant = variants[variantName]
            this._addLayer(variant, {
                'url':variant.url || providerValue.url,
                'options':L['Util']['extend']({}, providerValue.options, variant.options)
            })
        }
    } else {
        this._addLayer(providerValue, providerValue)
    }
}

LeafletProviderFabric.prototype._addLayer = function (provider, layerOptions) {
    this._layers[LeafletProviderFabric._getName(provider)] = this._tileLayer(layerOptions)
}