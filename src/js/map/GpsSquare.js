/**
 * Created: vogdb Date: 5/16/12 Time: 12:42 PM
 */
metro.exit.mmap.GpsSquare = function () {
    this.last = [] //координаты последнего квадрата к обр-ке
    this.first = [] //координаты первого квадрата к обр-ке
    this.processedSquares = {} //список обра-ых квадратов.
    this.squareStep = 0.01 //длина стороны квадрата
    this.exits = [] //массив всех выходов
    this.callback
}

/**
 * обработка области между ne и sw
 * @param ne NorthEast
 * @param sw SouthWest
 */
metro.exit.mmap.GpsSquare.prototype.process = function (ne, sw) {
    if (!this.containSquare(ne, sw)) {
        //увеличиваем область выходов на одну сторону квадрата из-за неточности округлений в javascript
        this.first[0] = this.inSquare(ne[0] + this.squareStep)
        this.first[1] = this.inSquare(ne[1] + this.squareStep)
        this.last[0] = this.inSquare(sw[0] - this.squareStep)
        this.last[1] = this.inSquare(sw[1] - this.squareStep)
        //начинаем рекурсивную обработку с NorthEast до SouthWest
        this.processSquare(this.first[0], this.first[1])
    }
    return this.exits
}

metro.exit.mmap.GpsSquare.prototype.processSquare = function (squareLat, squareLng) {
    //данные преобразования обязательны, т.к. 55.7 + 0.01 == 55.7100000005
    squareLat = this.inSquare(squareLat)
    squareLng = this.inSquare(squareLng)
    //имя квадрата
    var squareName = this.getSquareName(squareLat, squareLng)
    if (!this.processedSquares[squareName]) {
        this.processedSquares[squareName] = true
        this.execSquare(squareName)
    }

    if (squareLat > this.last[0] && squareLng >= this.last[1]) {
        //не дошли до границы lat
        this.processSquare(squareLat - this.squareStep, squareLng)
    } else if (squareLat <= this.last[0]) {
        //дошли до границы lat
        if (squareLng > this.last[1]) {
            //не дошли до границы lng
            //меняем долготу квадрата
            this.processSquare(this.first[0], squareLng - this.squareStep)
        } else {
            //дошли до границы lng, конец обработки
        }
    }
}

metro.exit.mmap.GpsSquare.prototype.execSquare = function (squareName) {
    var square = metro.exit.config.getGpsSquare(squareName)
    if (Array.isArray(square)) {
        //если квадрат содержит выходы
        for (var i = 0; i < square.length; i++) {
            this.exits.push(square[i])
        }
    }
}

metro.exit.mmap.GpsSquare.prototype.getSquareName = function (squareLat, squareLng) {
    return squareLat + "_" + squareLng
}

metro.exit.mmap.GpsSquare.prototype.containSquare = function (ne, sw) {
    return
    //существуют ли предыдущие границы
    (this.first === undefined || this.last === undefined)
        //содержат ли предыдущие границы заданные
    || (this.first[0] >= ne[0] && this.last[0] <= sw[0] && this.first[1] >= ne[1] && this.last[1] <= sw[1])
}

metro.exit.mmap.GpsSquare.prototype.inSquare = function (coord) {
    return Math.round(coord * 100) / 100
}