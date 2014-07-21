metro.exit.getCursorPosition = function (area, e) {
    var x, y
    if (e.pageX != undefined && e.pageY != undefined) {
        x = e.pageX
        y = e.pageY
    } else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop
    }
    x -= (area.offsetLeft) ? area.offsetLeft : 0
    y -= (area.offsetTop) ? area.offsetTop : 0
    return {x:x, y:y}
}

/*
metro.exit.getCursorPosition2 = function (area, e) {
    var element = area, offsetX = 0, offsetY = 0, mx, my;

    // Compute the total offset
    if (element.offsetParent !== undefined) {
        do {
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
        } while ((element = element.offsetParent))
    }

    // Add padding and border style widths to offset
    // Also add the <html> offsets in case there's a position:fixed bar
    offsetX += (this.stylePaddingLeft) ? this.stylePaddingLeft : 0 + (this.styleBorderLeft) ? this.styleBorderLeft : 0 + (this.htmlLeft) ? this.htmlLeft : 0
    offsetY += (this.stylePaddingTop) ? this.stylePaddingTop : 0 + (this.styleBorderTop) ? this.styleBorderTop : 0 + (this.htmlTop) ? this.htmlTop : 0

    mx = e.pageX - offsetX
    my = e.pageY - offsetY

    // We return a simple javascript object (a hash) with x and y defined
    return {x:mx, y:my}
}
*/
