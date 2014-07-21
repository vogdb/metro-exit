metro.exit.Config = function(){
}

metro.exit.Config.prototype.getStationName = function(stationId){
    return i18n.text(this.getStationI18nKey(stationId))
}

metro.exit.Config.prototype.getStationI18nKey = function(stationId){
    return 'station.' + stationId
}

metro.exit.Config.prototype.getStationColor = function (stationId) {
    return window.localStorage.getItem(stationId + '.clr')
}

metro.exit.Config.prototype.getStationScheme = function (stationId) {
    return window.localStorage.getItem(stationId + '.sch')
}

metro.exit.Config.prototype.getLocaleIcon = function (locale) {
    return metro.exit.defineAbsolutePath('images/icon/lang/' + locale + '.png')
}

metro.exit.Config.prototype.arraySeparator = "|"

metro.exit.config = new metro.exit.Config()