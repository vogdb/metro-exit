metro.exit.mmap.GoogleMarkers = function (map) {
    metro.exit.mmap.Markers.call(this, map)
}

metro.exit.mmap.GoogleMarkers.prototype = Object.create(metro.exit.mmap.Markers.prototype)

metro.exit.mmap.GoogleMarkers.prototype.init = function () {
    metro.exit.mmap.GoogleMarker = function (opts) {
        this.info_ = opts.info
        this.setMap(opts.map)
    }
    metro.exit.mmap.GoogleMarker.prototype = new google.maps.OverlayView();

    metro.exit.mmap.GoogleMarker.prototype.onAdd = function () {
        var info = this.info_

        this.div_ = metro.exit.mmap.MarkerIcon.create()
        this.div_.className += ' ' + metro.exit.StationColor.getColorCssClass(info.id)
        this.div_.style.position = "absolute";

        google.maps.event.addDomListener(this.div_, "click", function () {
            metro.exit.router.build(info)
        });

        var panes = this.getPanes();
        panes.overlayMouseTarget.appendChild(this.div_);
    }
    goog.exportProperty(metro.exit.mmap.GoogleMarker.prototype, 'onAdd', metro.exit.mmap.GoogleMarker.prototype.onAdd)

    metro.exit.mmap.GoogleMarker.prototype.draw = function () {
        var overlayProjection = this.getProjection();
        var pos = overlayProjection.fromLatLngToDivPixel(new google.maps.LatLng(this.info_['gps'][0], this.info_['gps'][1]));
        this.div_.style.left = (pos.x - 10) + 'px';
        this.div_.style.top = (pos.y - 10) + 'px';
    }
    goog.exportProperty(metro.exit.mmap.GoogleMarker.prototype, 'draw', metro.exit.mmap.GoogleMarker.prototype.draw)

    metro.exit.mmap.GoogleMarker.prototype.onRemove = function () {
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
    }
    goog.exportProperty(metro.exit.mmap.GoogleMarker.prototype, 'onRemove', metro.exit.mmap.GoogleMarker.prototype.onRemove)
}

metro.exit.mmap.GoogleMarkers.prototype.removeMarker = function (key) {
    this.markers[key].setMap(null)
}
metro.exit.mmap.GoogleMarkers.prototype.drawMarker = function (key, value) {
    return new metro.exit.mmap.GoogleMarker({
        map:this.map,
        info:value
    })
}