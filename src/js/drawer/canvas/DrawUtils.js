metro.exit.drawer.DrawUtils = function(canvas) {
    //контекст где рисуем
    this.ctx = canvas.getContext('2d');
    //хранилище цветов для отрисовки связей графа
    this.color = metro.exit.config.getDrawerColors()
    //толщина линий-связей
    this.lineWidth = metro.exit.config.getDrawerLineWidth()

    this.drawMethod = {}
    this.drawMethod['none'] = this.drawNone
    this.drawMethod['line'] = this.drawLine
    this.drawMethod[undefined] = this.drawEdge
}

metro.exit.drawer.DrawUtils.prototype.draw = function(parent, child) {
    this.drawMethod[parent['type']].call(this, parent['coord'], child['coord'], parent['color'])
}

metro.exit.drawer.DrawUtils.prototype.drawPoint = function(coord, color) {
    this.ctx.beginPath()
    this.ctx.fillStyle = this.color[color]
    this.ctx.arc(
        coord.x, coord.y,
        2, 0, 2 * Math.PI, true
    )
    this.ctx.fill()
    this.ctx.closePath()
}

metro.exit.drawer.DrawUtils.prototype.drawNone = function(from, to, color) {
}

metro.exit.drawer.DrawUtils.prototype.drawLine = function(from, to, color) {
    this.ctx.beginPath()
    this.ctx.lineWidth = this.lineWidth
    this.ctx.strokeStyle = this.ctx.fillStyle = this.color[color]
    this.ctx.moveTo(from['x'], from['y']);
    this.ctx.lineTo(to['x'], to['y']);
    this.ctx.stroke()
    this.ctx.closePath()
}

metro.exit.drawer.DrawUtils.prototype.drawEdge = function(from, to, color) {
    this.ctx.beginPath()
    this.ctx.lineWidth = this.lineWidth
    this.ctx.strokeStyle = this.ctx.fillStyle = this.color[color]
    var angle = Math.PI / 8;
    var d = 12;

    // For ends with arrow we actually want to stop before we get to the arrow
    // so that wide lines won't put a flat end on the arrow.
    var dist = Math.sqrt((to['x'] - from['x']) * (to['x'] - from['x']) + (to['y'] - from['y']) * (to['y'] - from['y']));
    var ratio = (dist - d / 3) / dist;
    var tox, toy, fromx, fromy;

    tox = from['x'] + (to['x'] - from['x']) * ratio;
    toy = from['y'] + (to['y'] - from['y']) * ratio;
    fromx = from['x'];
    fromy = from['y'];

    // Draw the shaft of the arrow
    this.ctx.beginPath();
    this.ctx.moveTo(fromx, fromy);
    this.ctx.lineTo(tox, toy);
    this.ctx.stroke();

    // calculate the angle of the line
    var lineangle = Math.atan2(to['y'] - from['y'], to['x'] - from['x']);
    // h is the line length of a side of the arrow head
    var h = Math.abs(d / Math.cos(angle));

    var angle1 = lineangle + Math.PI + angle;
    var topx = to['x'] + Math.cos(angle1) * h;
    var topy = to['y'] + Math.sin(angle1) * h;
    var angle2 = lineangle + Math.PI - angle;
    var botx = to['x'] + Math.cos(angle2) * h;
    var boty = to['y'] + Math.sin(angle2) * h;
    this.drawArrowHead(topx, topy, to['x'], to['y'], botx, boty);
}

metro.exit.drawer.DrawUtils.prototype.drawArrowHead = function(x0, y0, x1, y1, x2, y2) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(x0, y0);
    this.ctx.lineTo(x1, y1);
    this.ctx.lineTo(x2, y2);

    this.ctx.lineTo(x0, y0);
    this.ctx.fill();
    this.ctx.restore();
};


metro.exit.drawer.DrawUtils.prototype.calcTextLengthPx = function (title) {
    return this.ctx.measureText(title).width
}

metro.exit.drawer.DrawUtils.prototype.setFont = function (fontSize) {
    this.ctx.font = 'bolder ' + fontSize + 'px Arial'
}

metro.exit.drawer.DrawUtils.prototype.drawText = function(coord, title, fontSize, color, ruColor) {
    this.setFont(fontSize)
    this.ctx.fillStyle = color
    if (i18n.getLocale() == I18n.RU) {
        this.ctx.fillText(i18n.text(title), coord['x'], coord['y'])
    } else {
        var margin = Math.round(fontSize * 0.5)
        this.ctx.fillText(i18n.text(title), coord['x'] - margin, coord['y'] - margin)
        if(!ruColor){
            ruColor = lighterColor(color, 0.2)
        }
        this.setFont(Math.round(fontSize * 0.7))
        this.ctx.fillStyle = ruColor
        var ruMargin = fontSize - margin
        this.ctx.fillText(i18n.text(title, I18n.RU), coord['x'] + ruMargin, coord['y'] + ruMargin)
    }
}

metro.exit.drawer.DrawUtils.prototype.calcNeighborRect = function (coord, fontSize, title) {
    var rect = {}
    rect.x = coord['x'] - 2 * fontSize
    rect.y = coord['y'] - Math.round(1.5 * fontSize)
    this.setFont(fontSize)
    //ширина равна длине текста плюс по отступу шириной в два fontSize слева и справа
    rect.w = this.calcTextLengthPx(i18n.text(title)) + 3 * fontSize
    rect.h = Math.round(2.5 * fontSize)
    return rect
}

metro.exit.drawer.DrawUtils.prototype.drawNeighborRect = function(coord, title, params) {
    var fontSize = params['size']
    var direct = params['direct']
    var rect = this.calcNeighborRect(coord, fontSize, title)

    if (direct < 0) {
        //данная замена необходима, чтобы title попадал в arrowRect.
        rect.x += rect.w
    }
    /*
     direct > 0
     x1,y1     x2,y2
     ------------
     |           \x3,y3
     |           /
     ------------
     x5,y5     x4,y4

     direct < 0
      x2,y2     x1,y1
      ------------
x3,y3/           |
     \           |
      ------------
     x4,y4     x5,y5
     */

    this.ctx.beginPath()
    var x1 = rect.x
    var y1 = rect.y
    var x2 = rect.x + direct * rect.w
    var y2 = y1
    var x3 = x2 + direct * fontSize
    var y3 = y2 + rect.h / 2
    var x4 = x2
    var y4 = y2 + rect.h
    var x5 = x1
    var y5 = y4
    this.ctx.moveTo(x1, y1)
    this.ctx.lineTo(x2, y2)
    this.ctx.lineTo(x3, y3)
    this.ctx.lineTo(x4, y4)
    this.ctx.lineTo(x5, y5)
    this.ctx.lineTo(x1, y1)

    this.ctx.fillStyle = '#fff'
    this.ctx.fill()
    this.ctx.lineWidth = metro.exit.config.getDrawerLineWidth() / 2
    this.ctx.strokeStyle = darkerColor(metro.exit.config.getStationColor(params['station']), 0.2)
    this.ctx.stroke()
    this.ctx.closePath()

    this.drawText(coord, title, fontSize, '#000000', '#888888')
}

metro.exit.drawer.DrawUtils.prototype.reset = function() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
}
