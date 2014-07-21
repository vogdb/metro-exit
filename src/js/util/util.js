/*полезности*/

var goog = goog || {};
goog.global = this;
goog.isDef = function (val) {
    return val !== undefined;
};
goog.exportPath_ = function (name, opt_object, opt_objectToExportTo) {
    var parts = name.split('.');
    var cur = opt_objectToExportTo || goog.global;
    if (!(parts[0] in cur) && cur.execScript) {
        cur.execScript('var ' + parts[0]);
    }
    for (var part; parts.length && (part = parts.shift());) {
        if (!parts.length && goog.isDef(opt_object)) {
            // last part and we have an object; use it
            cur[part] = opt_object;
        } else if (cur[part]) {
            cur = cur[part];
        } else {
            cur = cur[part] = {};
        }
    }
};
goog.exportSymbol = function (publicPath, object, opt_objectToExportTo) {
    goog.exportPath_(publicPath, object, opt_objectToExportTo);
};
goog.exportProperty = function (object, publicName, symbol) {
    object[publicName] = symbol;
};

metro.exit.gpskey = function (gps) {
//    return ((gps.lat.toFixed(6) * 100000000000000).toFixed(0) + (gps.lng.toFixed(6)*1000000).toFixed(0));
//    return gps.lat * 100000000000000 + gps.lng * 1000000;
    return gps[0].toString() + gps[1].toString();
}

/**
 * Загрузка скрипта из javascript'a
 * @param url адрес скрипта
 * @return xhr с загруженным скриптом
 */
metro.exit.loadScriptSync = function (url) {
    url = metro.exit.defineAbsolutePath(url)
    var request = new XMLHttpRequest()
    request.open('HEAD', url, false);
    request.send(null);
    return request
}

metro.exit.defineAbsolutePath = function (url) {
    if (url.indexOf('http') === -1) {
        url = metro.exit.defineRootPath() + url
    }
    return url
}

metro.exit.defineRootPath = function () {
    if (!metro.exit.rootPath) {
        var scripts = document.getElementsByTagName('script')
        for (var i = 0; i < scripts.length; i++) {
            var src = scripts[i].src
            if (src.indexOf('/js/') > 0) {
                metro.exit.rootPath = src.substring(7, src.indexOf('js'))
                break
            }
        }
    }
    return metro.exit.rootPath
}

metro.exit.evalRet = function (text) {
    return new Function('return ' + text)
}
metro.exit.execRet = function (url) {
    return metro.exit.evalRet(metro.exit.loadScriptSync(url).responseText)
}
/**
 * Загрузка и исполнени скрипта из javascript'a
 * @param url адрес скрипта
 */
metro.exit.exec = function (url) {
    return (new Function(metro.exit.loadScriptSync(url).responseText)())
}

metro.exit.extend = function (trgt, src) {
    for (var name in src) {
        if (typeof src[name] === 'object' && typeof trgt[name] !== 'undefined') {
            metro.exit.extend(trgt[name], src[name])
        } else if (typeof trgt[name] !== 'undefined') {
            trgt[name] = src[name]
        }
    }
}

metro.exit.userAgent = function () {
    return navigator.userAgent.toLowerCase()
}
metro.exit.isAndroid = function () {
    return metro.exit.userAgent().indexOf('android') !== -1
}
metro.exit.getAndroidVersion = function () {
    var ua = metro.exit.userAgent()
    return parseFloat(ua.slice(ua.indexOf("android") + 8))
}
metro.exit.isAndroid23 = function () {
    return metro.exit.isAndroid() && metro.exit.getAndroidVersion() < 4
}
metro.exit.isAndroid4 = function () {
    return metro.exit.isAndroid() && metro.exit.getAndroidVersion() >= 4
}