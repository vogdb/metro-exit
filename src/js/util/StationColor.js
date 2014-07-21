metro.exit.StationColor = {
    colorClasses: {}
}

/**
 * @param stationId id станции из конфига gpsRoute
 * @return имя css класса для окраски данного stationId
 */
metro.exit.StationColor.getColorCssClass = function (stationId) {
    //имя класса для stationId
    var colorClassName
    //цвета для stationId
    var stationColors
    if (typeof(stationId) === 'string') {
        stationColors = metro.exit.config.getStationColor(stationId)
        colorClassName = stationColors.substring(1)
    } else {
        colorClassName = ''
        stationColors = []
        for (var i = 0; i < stationId.length; i++) {
            var color = metro.exit.config.getStationColor(stationId[i])
            stationColors.push(color)
            colorClassName += color.substring(1)
        }
    }
    //добавляем букву в начало имени класса, т.к. имя класса может начинаться с цифры, т.к. использует цвет для своего именования
    colorClassName = 'c' + colorClassName
    if (!this.colorClasses[colorClassName]) {
        this.createColorClass(colorClassName, stationColors)
        this.colorClasses[colorClassName] = true
    }
    return colorClassName
}

/**
 * Создает css класс с определенным набором цветов фона
 * @param colorClassName имя css класса
 * @param colors набор цветов
 */
metro.exit.StationColor.createColorClass = function (colorClassName, colors) {
    var content
    if (typeof(colors) === 'string') {
        content = 'background-color: ' + colors
    } else if (colors.length == 2) {
        content = 'background: -webkit-gradient(linear, 0 0, 100% 0, color-stop(0.5, ' + colors[0] + '), color-stop(0.5, ' + colors[1] + '))'
    } else if (colors.length == 3) {
        content = 'background-size: 50% 100%,100% 100%;'
            + 'background: -webkit-gradient(linear, 0 0, 100% 100%, color-stop(0.65, ' + colors[0] + '), color-stop(0.65, ' + colors[1] + ')) 0 0 no-repeat, '
            + '-webkit-gradient(linear, 50% 0, 0 100%, color-stop(0.45, ' + colors[2] + '), color-stop(0.45, ' + colors[1] + ')) 0 0 no-repeat'
    } else if (colors.length == 4) {
        content = 'background-size: 50% 100%,100% 100%;'
            + 'background: -webkit-gradient(linear, 0 0, 0 100%, color-stop(0.5, ' + colors[0] + '), color-stop(0.5, ' + colors[1] + ')) 0 0 no-repeat,'
            + '-webkit-gradient(linear, 0 0, 0 100%, color-stop(0.5, ' + colors[2] + '), color-stop(0.5, ' + colors[3] + ')) 0 0 no-repeat'
    }

    content = '.' + colorClassName + '{' + content + '}\n'
    if(!this.styleTag){
        var style = document.createElement('style')
        style.type = 'text/css'
        style.innerHTML = content
        document.head.appendChild(style)
        this.styleTag = style
    } else {
        this.styleTag.innerHTML += content
    }
}