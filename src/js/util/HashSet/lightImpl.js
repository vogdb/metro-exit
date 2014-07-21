metro.exit.HashSet = function(){
    this.content = []
    this.keys = {}
}
metro.exit.HashSet.prototype.sizeOfSet = function(){
    return this.content.length
}
/**
 * @param key
 * @return принадлежит ли element(gpsKey) данному HashSet
 */
metro.exit.HashSet.prototype.hasKey = function(key){
    return this.keys[key]
}
/**
 * добавляет в content те elements, которых там еще нет
 * @param elements
 * @return разницу между получивщимся content и исходным
 */
metro.exit.HashSet.prototype.putAll = function(elements){
    var result = {}
    for(var i = 0; i < elements.length; i++){
        var key = metro.exit.gpskey(elements[i]['gps'])
        if(!this.hasKey(key)){
            this.content.push(elements[i])
            this.keys[key] = true
            result[key] = elements[i]
        }
    }
    return result
}