metro.exit.MapPrefPage = function () {
    metro.exit.Page.call(this)
}

metro.exit.MapPrefPage.prototype = Object.create(metro.exit.Page.prototype)

metro.exit.MapPrefPage.prototype.init = function () {
    metro.exit.Page.prototype.init.call(this)

    this.hotizontalFont = new metro.exit.Font(18, 0.7)
    this.verticalFont = new metro.exit.Font(18, 1.0)
    this.content = document.getElementById('content')
    this.prefs = document.getElementById('prefs')
    this.mapList = document.getElementById('mapList')
    this.mapFabrics = {}

    this.generateMapList()
    var self = this
    document.getElementById('save').addEventListener('click', function (e) {
        e.preventDefault()
        self.saveSelectedMap()
    })
}

metro.exit.MapPrefPage.prototype.orient = function () {
    metro.exit.Page.prototype.orient.call(this)

    //get all .mapArea and apply new size
    var areas = document.getElementsByClassName('mapArea')
    var areaHeight = this.calculateMapAreaHeight()
    for (var areaIndex = 0; areaIndex < areas.length; areaIndex++) {
        areas[areaIndex].style.height = areaHeight
    }
}

metro.exit.MapPrefPage.prototype.vertical = function () {
    metro.exit.Page.prototype.vertical.call(this)

    this.prefs.style.fontSize = this.verticalFont.calculateSizePxCss(this.content.offsetWidth)
}

metro.exit.MapPrefPage.prototype.horizontal = function () {
    metro.exit.Page.prototype.horizontal.call(this)

    this.prefs.style.fontSize = this.hotizontalFont.calculateSizePxCss(this.content.offsetWidth)
}

metro.exit.MapPrefPage.prototype.calculateMapAreaHeight = function () {
    return (this.content.offsetHeight - this.prefs.offsetHeight) + 'px'
}

metro.exit.MapPrefPage.prototype.previewMap = function () {
    var mapType = this.mapList.value
    var activeArea = document.getElementsByClassName('active')[0]
    if (activeArea) {
        activeArea.className = 'mapArea'
    }
    var mapArea = document.getElementById(this.getMapAreaId(mapType))
    if (mapArea) {
        mapArea.className = 'mapArea active'
    } else {
        this.createMapArea(mapType)
    }
}

metro.exit.MapPrefPage.prototype.getMapAreaId = function (mapType) {
    return mapType + 'Area'
}
metro.exit.MapPrefPage.prototype.createMapArea = function (mapType) {
    var mapArea = document.createElement('div')
    mapArea.setAttribute('id', this.getMapAreaId(mapType))
    mapArea.className = 'mapArea active'
    mapArea.style.height = this.calculateMapAreaHeight()
    this.content.appendChild(mapArea)
    var self = this
    metro.exit.mmap.MapFacade.create(mapType,
        function (facade) {
            facade.init()
            facade.createMap(mapArea, {gps:[55.75196, 37.610254]})
            self.mapFabrics[mapType] = facade
        }
    )
}

metro.exit.MapPrefPage.prototype.generateMapList = function () {
    this.generateMapListOption(this.mapList, metro.exit.mmap.Types.LEAFLET, 'Open Street Maps')
    this.generateMapListOption(this.mapList, metro.exit.mmap.Types.GOOGLE, 'Google Maps')
    var self = this
    this.mapList.onchange = function () {
        self.previewMap()
    }
}

metro.exit.MapPrefPage.prototype.generateMapListOption = function (mapList, val, text) {
    var opt = document.createElement('option')
    opt.setAttribute('value', val)
    opt.innerHTML = text
    if (metro.exit.config.getMapType() === val) {
        opt.setAttribute('selected', 'selected')
    }
    mapList.appendChild(opt)
}

metro.exit.MapPrefPage.prototype.saveSelectedMap = function () {
    var mapType = this.mapList.value
    metro.exit.config.setMapType(mapType)
    this.mapFabrics[mapType].saveSelectedLayer()
    alert(i18n.text('page.preferences.mapSave'))
}

//Важно, что здесь onload =, а не addEventListener, чтобы переопределить load из map.js.
window.onload = function () {
    metro.exit.HeaderPage(metro.exit.MapPrefPage)
    var page = new metro.exit.MapPrefPage()
    page.init('content')
    page.orient()
    page.previewMap()
}
