metro.exit.mmap.GoogleExits = function (map, markers) {
    metro.exit.mmap.Exits.call(this, map, markers)
}

metro.exit.mmap.GoogleExits.prototype = Object.create(metro.exit.mmap.Exits.prototype)

metro.exit.mmap.GoogleExits.prototype.init = function () {
    var self = this
    google.maps.event.addListener(this.map, 'bounds_changed', function () {
        self.updateBounds(self.getBounds())
    });
}
metro.exit.mmap.GoogleExits.prototype.getBounds = function () {
    var bounds = this.map.getBounds()
    return {
        ne:[bounds.getNorthEast().lat(), bounds.getNorthEast().lng()],
        sw:[bounds.getSouthWest().lat(), bounds.getSouthWest().lng()]
    }
}