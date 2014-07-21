metro.exit.RoutesConfigGenerator = function () {
}

metro.exit.RoutesConfigGenerator.prototype.generate = function (nodes) {
    var routes = []
    this.nodeKeysToRouteIndexes = {}
    var i = 0
    var exits = []

    //переводим ассоциативный массив nodes в одномерный массив routes
    for (var key in nodes) {
        routes.push(nodes[key])
        //сохраняем связь между ключом в nodes и индексом в routes
        this.nodeKeysToRouteIndexes[key] = i++
        //запоминаем выходы
        if (nodes[key]['gps']) {
            exits.push(nodes[key])
        }
    }

    //убираем ненужные станции
    this.filterStation(routes)
    //проставляем связи индексами в массиве, чтобы сохранить маршрут в файл.
    for (var j = 0; j < exits.length; j++) {
        this.linksToIndexes(exits[j])
    }

    var routesText = JSON.stringify(routes, function (key, value) {
        if (key == 'parent' || key == 'children') {
            return undefined
        } else {
            return value
        }
    })
    routesText = routesText.replace(/parentInt/g, 'parent')
    console.log(routesText)
    window.prompt("Copy to clipboard: Ctrl+C, Enter", routesText);

}

/**
 * функция заменяет связи ссылки на индексы в массиве routes
 * @param node
 */
metro.exit.RoutesConfigGenerator.prototype.linksToIndexes = function (node) {
    if (node['parent']) {
        if (!node['parentInt']) {
            node['parentInt'] = []
        }
        for (var i = 0; i < node['parent'].length; i++) {
            var parent = node['parent'][i]
            //индекс узла родителя в массиве routes
            var nodeIndex = this.nodeKeysToRouteIndexes[coordKey(parent['coord'])]
            //добавляем индекс на родителя
            node['parentInt'][i] = nodeIndex
            //продолжаем замену дальше
            this.linksToIndexes(parent)
        }
    }
}

/**
 * оставляет станции только для тех узлов, где они нужны.
 * @param routes
 */
metro.exit.RoutesConfigGenerator.prototype.filterStation = function (routes) {
    for (var i = 0; i < routes.length; i++) {
        if (routes[i]['parent'] !== undefined && routes[i]['parent'].length > 1) {
            //если родителей несколько, то станции родителей сохраняются
            for (var k = 0; k < routes[i]['parent'].length; k++) {
                routes[i]['parent'][k]['hasStation'] = true
            }
        }
    }
    for (i = 0; i < routes.length; i++) {
        if (routes[i]['hasStation']) {
            delete routes[i]['hasStation']
        } else {
            delete routes[i]['station']
        }
    }
}