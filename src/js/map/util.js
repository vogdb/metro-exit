/**
 * Created: vogdb Date: 5/20/12 Time: 4:13 PM
 */
/**
 * открывает страницу с картой
 * @param lat широта центра карты
 * @param lng долгота центра карты
 */
metro.exit.mmap.openMap = function(lat, lng, noMarker) {
    window.location.assign("map.html?lat=" + lat +"&lng=" + lng + (noMarker ? "&nm=1" : ""));
}

/**
 * Загрузка скрипта из javascript'a
 * @param url адрес скрипта конфига
 * @param callback
 */
metro.exit.loadScript = function(url, callback) {
    url = metro.exit.defineAbsolutePath(url)
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    if (callback !== undefined) {
        script.onreadystatechange = callback;
        script.onload = callback;
    }
    head.appendChild(script);
}

metro.exit.loadRel = function(url) {
    var link = document.createElement('link')
    link.setAttribute('rel', 'stylesheet')
    link.setAttribute('type', 'text/css')
    link.setAttribute('href', metro.exit.defineAbsolutePath(url))
    document.head.appendChild(link)
}

/**
 *  загружает библиотеку гугл карт
 *  @param callback по завершению загрузки
 */
metro.exit.mmap.loadGoogleMap = function (callback) {
  var url = "http://maps.googleapis.com/maps/api/js?key=WhatKey&sensor=false"
  url += "&language=" + i18n.getLocale()
  // if(callback) Если использовать этот if, то все определения google будут undefined в address.js в Chromium Version 25.0.1364.160 Ubuntu 12.04 (25.0.1364.160-0ubuntu0.12.04.1)
  // но без него всегда будет ошибка, что callback undefined. Поскольку это ошибка никак не влияет на работу приложения, то живем с ней.
  url += "&callback=" + callback
  metro.exit.loadScript(url)
}
//goog.exportSymbol('metro.exit.mmap.loadGoogleMap', metro.exit.mmap.loadGoogleMap)