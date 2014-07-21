metro.exit.StationPage = function () {
    metro.exit.DefaultPage.call(this)
}

metro.exit.StationPage.prototype = Object.create(metro.exit.DefaultPage.prototype)

metro.exit.StationPage.prototype.init = function () {
    metro.exit.DefaultPage.prototype.init.call(
        this,
        {font:{horizontal:new metro.exit.Font(20, 0.9)}}
    )
    this.initPrompterAndStationGps()
    this.initColorIcon()
    this.initGoButton()
}

metro.exit.StationPage.prototype.initPrompterAndStationGps = function(){
    //координаты станций
    var gps = metro.exit.execRet("js/config/gpsStation.js")()
    //отображение имен станций на их gps
    this.stationGps = {}
    var stationPrompts = []
    for (var stationId in gps) {
        var stationName = metro.exit.config.getStationName(stationId)
        stationPrompts.push({'text': stationName, 'html': this.createStationPrompt(stationId), 'value': stationId})
        this.stationGps[stationName] = gps[stationId]
    }
    this.station = document.getElementById("station")
    this.prompter = new window['Prompter']({'target': this.station, 'data': stationPrompts})
}

metro.exit.StationPage.prototype.createStationPrompt = function (stationId) {
    var prompt = document.createElement('div')
    prompt.appendChild(metro.exit.StationPrompt.getColor(stationId))
    metro.exit.StationPrompt.appendTitle(prompt, stationId)
    return prompt
}

metro.exit.StationPage.prototype.initColorIcon = function(){
    var colorIcon = document.getElementById('color')
    this.station.addEventListener('prompt_select', function (e) {
        var prompt = e['detail']['prompt']['html']
        var promptColor = prompt.getElementsByClassName('color')[0]
        colorIcon.className = promptColor.className
    })

    this.station.addEventListener('prompt_reset', function () {
        colorIcon.className = 'color'
    })
}

metro.exit.StationPage.prototype.initGoButton = function(){
    var self = this
    document.getElementById("go").onclick = function (e) {
        e.preventDefault()
        var stationValue = self.station.value.trim()
        if (stationValue && self.stationGps[stationValue]) {
            var gps = self.stationGps[stationValue]
            metro.exit.mmap.openMap(gps[0], gps[1], true)
        } else {
            alert(i18n.text('page.station.emptyInput'))
        }
    }
}

window.onload = function () {
    metro.exit.AutoCompletePage(metro.exit.StationPage)
    var page = new metro.exit.StationPage()
    page.init('contentWrapper')
    page.orient()
    page.prompter['list']['show']()
    //Android 2.X bugfix.
    page.station.focus()
}
