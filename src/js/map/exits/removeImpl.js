/////////////// выходы из метро, доступные для данной карты/////////////
metro.exit.mmap.Exits = function(map) {

    this.map = map
    this.exits = new metro.exit.HashSet()
    this.markers = new metro.exit.Markers(map)

    this.init();
}
metro.exit.mmap.Exits.prototype.init = function() {
    var self = this
    google.maps.event.addListener(this.map, 'bounds_changed', function() {
        self.updateBounds(self.map.getBounds())
    });
    //this.update(this.map.getBounds())
}
/**
 * обновляет выходы из метро для заданных bounds
 * @param bounds
 */
metro.exit.mmap.Exits.prototype.updateBounds = function(bounds) {
    var newExits = this.updater.updateBounds(bounds);
    if (newExits == 0) {
        this.map.setZoom(this.map.getZoom() - 1);
        return;
    }
    if (newExits !== -1) {
        if (newExits.length < this.exits.sizeOfSet()) {
            this.markers.removeMarkers(this.exits.retainAll(newExits));
        } else if (newExits.length > this.exits.sizeOfSet()) {
            this.markers.drawMarkers(this.exits.putAll(newExits));
        }
    } else {
        //Perfomance если включить, то учесть
        this.markers.removeMarkers(this.exits.content);
    }
}
////////////////////////////////////////////////////////////////////////