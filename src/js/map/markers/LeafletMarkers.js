metro.exit.mmap.LeafletMarkers = function (map) {
    metro.exit.mmap.Markers.call(this, map)
}

metro.exit.mmap.LeafletMarkers.prototype = Object.create(metro.exit.mmap.Markers.prototype)

metro.exit.mmap.LeafletMarkers.prototype.drawMarker = function (key, value) {
    var myIcon = L['divIcon']({
        'className': metro.exit.mmap.MarkerIcon.cssClass + ' ' + metro.exit.StationColor.getColorCssClass(value.id),
        'html': metro.exit.mmap.MarkerIcon.text,
        'iconSize':[20, 20]// должно было проставиться через css, но увы нет
    })
    L['marker'](value['gps'], {'icon':myIcon})
        ['addTo'](this.map)
        ['on']('click', function () {
        metro.exit.router.build(value)
    })
}