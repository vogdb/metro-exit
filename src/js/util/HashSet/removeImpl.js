metro.exit.HashSet = function(){
    this.content = {};
}
metro.exit.HashSet.prototype.sizeOfSet = function(){
    var size = 0, key;
    for (key in this.content) {
        if (this.content.hasOwnProperty(key)) size++;
    }
    return size
}
/**
 * @param key
 * @return принадлежит ли element(gpsKey) данному HashSet
 */
metro.exit.HashSet.prototype.hasKey = function(key){
    return this.content[key]
}
/**
 * @param gps
 * @return принадлежит ли gps данному HashSet
 */
metro.exit.HashSet.prototype.containsGPS = function(gps){
    return this.content[metro.exit.gpskey(gps)]
}
/**
 * оставляет в content только elements
 * @param elements
 * @return разницу между исходным content и получившимся
 */
metro.exit.HashSet.prototype.retainAll = function(elements){
    var tmp = {}
    for(var i = 0; i < elements.length; i++){
        tmp[metro.exit.gpskey(elements[i])] = elements[i]
    }
    //PERFOMANCE. заменить на var result = []
    var result = {}
    for(var key in this.content){
        if(!tmp[key]){
            result[key] = this.content[key]
            delete this.content[key]
        }
    }
    return result
}
/**
 * добавляет в content те elements, которых там еще нет
 * @param elements
 * @return разницу между получивщимся content и исходным
 */
metro.exit.HashSet.prototype.putAll = function(elements){
    var result = {}
    for(var i = 0; i < elements.length; i++){
        var key = metro.exit.gpskey(elements[i])
        if(!this.hasKey(key)){
            this.content[key] = elements[i]
            result[key] = elements[i]
        }
    }
    return result
}