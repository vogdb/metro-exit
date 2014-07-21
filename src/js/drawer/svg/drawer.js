metro.exit.drawer = metro.exit.drawer || {}

metro.exit.drawer.Drawer = function(container, router, stationId, callback) {
    this.svgNS = "http://www.w3.org/2000/svg"
    this.container = document.getElementById(container)
    this.router = router
    this.schemeId = stationId//ID отображаемой станции

    this.init(callback)
}

metro.exit.drawer.Drawer.prototype.init = function(callback) {
//    this.container.style.height = "100%"
//    this.container.style.width = "100%"
    this.container.style.backgroundRepeat = "no-repeat"
    this.scale = {}

    this.photo = {}
    this.photo.popup = new metro.exit.popup("photo", 1000)
    this.photo.div = document.createElement("div")
    this.photo.div.style.width = "100%"
    this.photo.div.style.height = "100%"
    this.photo.popup.setContent(this.photo.div)

    this.photoIcon = new Image();
    this.photoIcon.src = "images/icon/photo.png";
    this.photoIcon.onload = function() {
        callback()
    }
}

metro.exit.drawer.Drawer.prototype.drawMap = function(data, callback) {
    var self = this
    var bg = new Image()
    //var imgUrl = metro.exit.config.getStationMap(this.stationId) + ".svg"
    //bg.src = imgUrl
    bg.src = metro.exit.config.getStationMap(this.schemeId)

    bg.onload = function() {
        self.resize(bg)
        //self.container.style.backgroundImage = "url(" + imgUrl + ")"
        self.container.style.display = "block"
        self.setExits(data.exits)
        callback()
    }

//    window.addEventListener("resize", function() {
//        self.resize(bg)
//    }, false);

}

metro.exit.drawer.Drawer.prototype.setExits = function(exits) {
    for (var i = 0; i < exits.length; i++) {
        this.scaleNode(exits[i])
        this.drawNode(exits[i], "#00ff00")
    }
    this.exits = exits
}

metro.exit.drawer.Drawer.prototype.setRoute = function(route) {
    var nextLength = route.length
    for (var i = 0; i < nextLength; i++)
        this.scaleNode(route[i])
    //TODO add this.nodes и логику работы с ними. Если однажды node был отрисован, то он больше не отрисовывается
    if (this.route) {
        if (this.route.length == nextLength &&
            this.eqNode(this.route[0], route[0]) &&
            this.eqNode(this.route[nextLength - 1], route[nextLength - 1])
            ) {
            return
        } else {
            for (var i = 0; i < this.route.length; i++) {
                this.route[i].circle.setAttribute('visibility', 'invisible')
                if (this.route[i].line)
                    this.route[i].line.setAttribute('visibility', 'invisible')
            }//TODO последний узел выход, поэтому просто меняем стиль
            //this.route[i].circle.setAttribute('fill', "#00ff00")
        }
    }
    for (var i = 0; i < route.length - 1; i++) {
        this.drawEdge(route[i], route[i + 1])
        this.drawNode(route[i], "#ff0000")
    }
    this.drawNode(route[i], "#ff0000")
    this.route = route
}

metro.exit.drawer.Drawer.prototype.eqNode = function(node1, node2) {
    return node1.x == node2.x && node1.y == node2.y
}

metro.exit.drawer.Drawer.prototype.drawNode = function(node, fill) {
    var circle = document.createElementNS(this.svgNS, "circle");
    circle.setAttribute('fill', fill);
    circle.setAttribute('cx', node.x);
    circle.setAttribute('cy', node.y);
    //circle.setAttribute('visibility', 'visible');
    circle.setAttribute('r', this.scale.node.radius);
    //circle.setAttribute('cursor', "pointer");
    //circle.onclick = function(){alert(123)}

    node.circle = circle
    this.container.appendChild(circle);

    if (node.photo) {
        this.drawPhoto(node)
    }
}

metro.exit.drawer.Drawer.prototype.drawEdge = function(from, to) {
    var line = document.createElementNS(this.svgNS, "line");
    line.setAttribute('x1', from.x);
    line.setAttribute('y1', from.y);
    line.setAttribute('x2', to.x);
    line.setAttribute('y2', to.y);
    line.setAttribute('stroke', '#ff0000');
    line.setAttribute('stroke-linecap', 'round');
    line.setAttribute('stroke-width', this.scale.node.radius / 2);

    from.line = line
    this.container.appendChild(line);
}

metro.exit.drawer.Drawer.prototype.drawPhoto = function(node) {
    var photo = document.createElementNS(this.svgNS, "image");
    photo.setAttribute('x', node.x - 1.5 * this.scale.node.radius);
    photo.setAttribute('y', node.y - this.scale.node.radius - this.scale.photoIcon.y);
    photo.setAttribute('width', this.scale.photoIcon.x);
    photo.setAttribute('height', this.scale.photoIcon.y);
    photo.setAttributeNS('http://www.w3.org/1999/xlink', 'href', this.photoIcon.src);
    photo.setAttribute('cursor', "pointer");

    var self = this
    photo.onclick = function(){self.popupPhoto(node.photo)}

    //node.circle = photo
    this.container.appendChild(photo);

}

metro.exit.drawer.Drawer.prototype.scaleNode = function(node) {
    node.x = this.scaleX(node)
    node.y = this.scaleY(node)
}

metro.exit.drawer.Drawer.prototype.scaleX = function(node) {
    return Math.round(node.x * this.scale.x)
}
metro.exit.drawer.Drawer.prototype.scaleY = function(node) {
    return Math.round(node.y * this.scale.y)
}

metro.exit.drawer.Drawer.prototype.resize = function(img) {
//    this.container.width = (document.body.scrollWidth > document.body.offsetWidth)?document.body.scrollWidth:document.body.offsetWidth
//    this.container.height = (document.body.scrollHeight > document.body.offsetHeight)?document.body.scrollHeight:document.body.offsetHeight
    this.container.style.width = window.innerWidth + "px"
    this.container.style.height = window.innerHeight + "px"

    var containerW = metro.exit.getPx(this.container.style.width)
    var containerH = metro.exit.getPx(this.container.style.height)
    var imgW = img.naturalWidth
    var imgH = img.naturalHeight

    this.scale.x = containerW / imgW
    this.scale.y = containerH / imgH
    this.scale.koef = (containerH * containerH + containerW * containerW) / (imgH * imgH + imgW * imgW)

    this.scale.node = {}
    this.scale.node.radius = Math.round(10 * this.scale.koef)

    this.scale.photoIcon = {}
    this.scale.photoIcon.x = Math.round(this.photoIcon.naturalWidth * this.scale.x)
    this.scale.photoIcon.y = Math.round(this.photoIcon.naturalHeight * this.scale.y)

    this.container.style.backgroundImage = "url(" + img.src + ")"
    //this.container.style["backgroundSize"] = (this.scale.x * 100) + "% " + (this.scale.y * 100) + "%"
    this.container.style["backgroundSize"] = "100% 100%"

}

metro.exit.drawer.Drawer.prototype.popupPhoto = function(photo) {
    var photoUrl = this.schemeId + "/" + photo
    if (!this.photo.current || this.photo.current != photoUrl) {
        this.photo.current = photoUrl
        this.photo.div.style.backgroundImage = "url(" + metro.exit.config.getPhoto(this.schemeId, photo) + ")"
    }
    this.photo.popup.show()
}