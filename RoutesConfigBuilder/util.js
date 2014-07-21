function coordKey(coord) {
    return coord['x'] + ',' + coord['y']
}
function createCoord(x, y) {
    return {'x': x, 'y': y}
}

function isHidden(elem) {
    return !elem.offsetWidth && !elem.offsetHeight;
}
