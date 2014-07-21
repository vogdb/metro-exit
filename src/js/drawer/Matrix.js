metro.exit.drawer.Matrix = function (angle) {
    this.angle = angle
}

metro.exit.drawer.Matrix.prototype.rotateVector = function (v) {
    var angle = this.degree(this.angle)
    return {
        "x":Math.round(v["x"] * Math.cos(angle) + v["y"] * Math.sin(angle)),
        "y":Math.round(-v["x"] * Math.sin(angle) + v["y"] * Math.cos(angle))
    }
}

metro.exit.drawer.Matrix.prototype.degree = function (number) {
    return number * Math.PI / 180;
}