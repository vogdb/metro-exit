/*рисование полученных результатов*/
metro.exit.drawer = metro.exit.drawer || {}

//canvas - где рисовать, на твое усмотрение, что сюда передавать div или альтернативу.
metro.exit.drawer.Drawer = function(canvas, router){

    this.canvas = document.getElementById(canvas)
    this.router = router
    this.init()
}

metro.exit.drawer.Drawer.prototype.init = function(){
    //mouse click handlers, photo + change route + redirect to new route exit on map
}

/**
 * рисует на канвасе карту станции
 * @param map гиперссылка на картинку станции. Важно! картинку нужно масштабировать под экран.
 */
metro.exit.drawer.Drawer.prototype.drawMap = function(map){
    this.canvas.appendChild(document.createTextNode(map))
}

/**
 * рисует на канвасе
 * @param exits массив узлов выходов из станции
 *  структура node
 *    node.x - x координата узла на карте
 *    node.y - y координата узла на карте
 *    node.photo - гиперссылка на фото узла
 *    node.pre - массив вида [[x,y],[x,y]...]. Содержит координаты точек, рисующих маршрут, но не влияющий на него.
 */
metro.exit.drawer.Drawer.prototype.setExits = function(exits){
    this.canvas.appendChild(document.createTextNode(" ; exits:"))
    for(var i = 0; i < exits.length; i++){
        var data = "[" + exits[i].coord[0].toString() + "," + exits[i].coord[1].toString() + "]"
        this.canvas.appendChild(document.createTextNode(data))
    }
}

/**
 * рисует на канвасе заданный маршрут
 * @param route маршрут
 *  route массив node, где node узел маршрута
 *  структура node
 *    node.x - x координата узла на карте
 *    node.y - y координата узла на карте
 *    node.photo - гиперссылка на фото узла
 *    node.pre - массив вида [[x,y],[x,y]...]. Содержит координаты точек, рисующих маршрут, но не влияющий на него.
 *  обращение к опр-ой node = route[i]
 */
metro.exit.drawer.Drawer.prototype.setRoute = function(route){
    this.canvas.appendChild(document.createTextNode(" ; route:"))
    for(var i = 0; i < route.length; i++){
        var data = "[" + route[i].coord[0].toString() + "," + route[i].coord[1].toString() + "]"
        if(route[i].pre !== undefined){
            data += "pre:"
            for(var j = 0; j < route[i].pre.length; j++)
                data += "[" + route[i].pre[j] + "," + route[i].pre[j] + "]"
        }
        data += ", "
        this.canvas.appendChild(document.createTextNode(data))
    }
}