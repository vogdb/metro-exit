/*photo
metro.exit.Config.prototype.getPhoto = function(stationId, photo){
    return "images/photo/" + stationId + "/" + photo + ".png"
}
*/

metro.exit.Config.prototype.getStationRoutes = function(stationId){
    return "js/config/routes/" + stationId + ".js"
}

metro.exit.Config.prototype.getStationMap = function(schemeId){
    return "images/scheme/" + schemeId + ".png"
}
