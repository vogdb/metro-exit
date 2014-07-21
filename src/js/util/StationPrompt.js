metro.exit.StationPrompt = {
}

metro.exit.StationPrompt.getColor = function (stationId) {
    var icon = document.createElement("div")
    var colorClass = metro.exit.StationColor.getColorCssClass(stationId)
    icon.className = "color " + colorClass
    return icon
}

metro.exit.StationPrompt.appendTitle = function (prompt, stationId) {
    var title = document.createElement("span")
    title.innerHTML = metro.exit.config.getStationName(stationId)
    prompt.appendChild(title)
    if(i18n.getLocale() != I18n.RU){
        var ruTitle = document.createElement('div')
        ruTitle.className = 'ru'
        ruTitle.innerHTML = i18n.text(metro.exit.config.getStationI18nKey(stationId), I18n.RU)
        prompt.appendChild(ruTitle)
    }
}