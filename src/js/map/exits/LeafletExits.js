metro.exit.mmap.LeafletExits = function (map, markers) {
    metro.exit.mmap.Exits.call(this, map, markers)
}

metro.exit.mmap.LeafletExits.prototype = Object.create(metro.exit.mmap.Exits.prototype)

metro.exit.mmap.LeafletExits.prototype.init = function () {
    var self = this

    function boundsChanged() {
        self.updateBounds(self.getBounds())
    }

    this.map['on']('zoomend', boundsChanged)
    this.map['on']('dragend', boundsChanged)

    boundsChanged()
}

metro.exit.mmap.LeafletExits.prototype.getBounds = function () {
    var bounds = this.map.getBounds()
    return {
        ne:[bounds.getNorthEast().lat, bounds.getNorthEast().lng],
        sw:[bounds.getSouthWest().lat, bounds.getSouthWest().lng]
    }
}
