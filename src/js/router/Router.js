metro.exit.router = metro.exit.router || {}

/**
 * Сервис построения маршрутов
 */
metro.exit.router.Router = function () {
    this.config//хранит конфиг последней загруженной станции
    this.gpsNodes = {}//все узлы выходов со станции
    this.station//текущий станция, к-ой принадлежит текущий выход
    this.exit//текущий выход, к к-му строится маршрут
    this.firstRouteNode//первый видимый узел маршрута
    this.route//маршрут
}

metro.exit.router.Router.prototype.setScheme = function (scheme) {
    this.config = metro.exit.execRet(metro.exit.config.getStationRoutes(scheme))()
    this.config.exits = []
    this.setParent()
}

/**
 * Заменяет индексы объектов родителей самими объектами. Дополнительно собирает все выходы в массив this.config.exits и this.gpsNodes.
 */
metro.exit.router.Router.prototype.setParent = function () {
    var routes = this.config['routes']
    for (var i = 0; i < routes.length; i++) {
        if (routes[i]['parent'] !== undefined) {
            for (var k = 0; k < routes[i]['parent'].length; k++) {
                routes[i]['parent'][k] = routes[routes[i]['parent'][k]]
            }
        }
        if (routes[i]['gps']) {
            this.config.exits.push(routes[i])
            this.gpsNodes[metro.exit.gpskey(routes[i]['gps'])] = routes[i]
        }
    }
}

metro.exit.router.Router.prototype.setExit = function (latLng) {
    this.exit = this.gpsNodes[metro.exit.gpskey(latLng)]
    if (!this.exit) {
        alert('no exit for this gps{' + latLng['gps'][0] + ', ' + latLng['gps'][1] + '}')
    }
}

metro.exit.router.Router.prototype.buildRoute = function(params) {
    this.initRoute()
    this.setScheme(params['scheme'])
    this.station = params['station']
    this.setExit(params['gps'])
    this.collectEdge(this.exit)
}

metro.exit.router.Router.prototype.initRoute = function() {
    this.route = {}
    var colors = metro.exit.config.getDrawerColors()
    for (var colorKey in colors) {
        this.route[colorKey] = {}
    }
}

metro.exit.router.Router.prototype.collectEdge = function (node) {
    if (node.parent) {
        if (metro.exit.isArray(node.parent)) {
            if (this.isFirstRouteNode(node)) {
                this.setFirstRouteNode(node)
            } else {
                for (var i = 0; i < node.parent.length; i++) {
                    if (this.isStationNode(node.parent[i])) {
                        this.addToRoute(node, node.parent[i])
                        this.collectEdge(node.parent[i])
                    }
                }
            }
        } else {
            alert('config error: parent parameter isn\'t array')
        }
    }
}

metro.exit.router.Router.prototype.isStationNode = function(node) {
    return !this.station || !node || !node["station"] || node["station"].indexOf(this.station) >= 0
}

metro.exit.router.Router.prototype.addToRoute = function(child, parent) {
    if (parent.type !== 'none') {
        var route = this.route[parent.color]
        var routeKey = this.getEdgeKey(child, parent)
        if (!route[routeKey]) {
            route[routeKey] = [child, parent]
        }
    }
}

metro.exit.router.Router.prototype.getEdgeKey = function(child, parent) {
    return this.getNodeKey(child) + this.getNodeKey(parent)
}

metro.exit.router.Router.prototype.getNodeKey = function(node) {
    return '' + node['coord'].x + node['coord'].y
}

metro.exit.router.Router.prototype.isFirstRouteNode = function (node) {
    var isParentTypeNone = node['type'] != 'none' && node.parent.length === 1 && node.parent[0]['type'] == 'none'
    if (isParentTypeNone) {
        var parent = node.parent[0]
        while (parent.parent && parent.parent.length === 1 && parent.parent[0]['type'] == 'none') {
            parent = parent.parent[0]
        }
        if (!parent.parent) {
            return true
        }
    }
    return false
}

metro.exit.router.Router.prototype.setFirstRouteNode = function (node) {
    if (node.parent && node.parent[0]['angle']) {
        //Случай, когда для хранения угла поворота вводится дополнительный родитель,
        //чтобы не дублировать эту информацию во всех смежных firstRoute одной станции.
        this.firstRouteNode = node.parent[0]
    } else {
        this.firstRouteNode = node
    }
}

metro.exit.router.Router.prototype.getFirstRouteNode = function () {
    return this.firstRouteNode
}
