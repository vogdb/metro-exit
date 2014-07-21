metro.exit.IndexPage = function () {
    metro.exit.ContentCenterPage.call(this)
}

metro.exit.IndexPage.prototype = Object.create(metro.exit.ContentCenterPage.prototype)

metro.exit.IndexPage.prototype.init = function () {
    //bootstrap отрабатывает в первую очередь
    if (!metro.exit.isBootstrapped()) {
        metro.exit.bootstrap()
    }
    //обязательно после бутстрапа, т.к. он чистит весь localStorage.
    this.initLocale()

    metro.exit.ContentCenterPage.prototype.init.call(this)
    this.noInternet = document.getElementById('noInternet')
    this.hasInternet = document.getElementById('hasInternet')
    this.loading = document.getElementById('loading')

    var self = this
    this.noInternet.getElementsByClassName('button')[0].onclick = function (e) {
        e.preventDefault()
        self.startLoadingMap()
    }
}

metro.exit.IndexPage.prototype.initLocale = function () {
    var locale = window['lang']
    if (!locale) {
        //Android pass lang through url param, because it has a bug which can be fixed only by loading stub html first(main.html).
        locale = window.location.search.substring(1).split('=')[1]
    }
    if (!locale) {
        locale = I18n.restoreLocale()
    }
    if (!locale) {
        locale = I18n.RU
    }
    I18n.saveLocale(locale)
/*
  window['navigator']['globalization']['getLocaleName'](
      function (locale) {
          console.log('### ' + locale)
          I18n.saveLocale(locale.value.substring(0, 2))
      },
      function (e) {
          console.log('### error: ' + e)
          var locale = I18n.restoreLocale()
          if (!locale) {
              locale = I18n.RU
          }
          I18n.saveLocale(locale)
      }
  )
*/
}

metro.exit.IndexPage.prototype.successMapLoad = function () {
    this.stopLoadingMap()
    this.hide(this.noInternet)
    this.show(this.hasInternet)
    this.paddingTop()
}

metro.exit.IndexPage.prototype.failMapLoad = function () {
    this.stopLoadingMap()
    this.show(this.noInternet)
    this.paddingTop()
}

metro.exit.IndexPage.prototype.isMapLoaded = function () {
    return this.hasInternet.style.display == 'block'
}

metro.exit.IndexPage.prototype.stopLoadingMap = function () {
    this.hide(this.loading)
    clearInterval(this.isLoadingMap)
}

metro.exit.IndexPage.prototype.loadingMapAnimation = function () {
    var loadingIconHolder = document.getElementById('loadingIcon')
    var loadingIcon = '.....'
    var loadingIndex = 1;
    this.isLoadingMap = setInterval(function () {
        loadingIconHolder.innerHTML = loadingIcon.substring(0, loadingIndex)
        loadingIndex = loadingIndex + 1
        if (loadingIndex > loadingIcon.length) {
            loadingIndex = 0;
        }
    }, 300)
}

metro.exit.IndexPage.prototype.startLoadingMap = function () {
    //close other blocks
    this.hide(this.noInternet)
    this.hide(this.hasInternet)
    this.show(this.loading)
    this.paddingTop()
    this.loadingMapAnimation()
    metro.exit.mmap.loadGoogleMap('successMapLoad');
    this.launchCheckMapTimer()
}

metro.exit.IndexPage.prototype.launchCheckMapTimer = function () {
    var self = this
    setTimeout(function () {
        //if map won't be loaded in 2 seconds we show 'noInternet' alert
        if (!self.isMapLoaded()) {
            self.failMapLoad()
        }
    }, 2000)
}

metro.exit.IndexPage.prototype.show = function (element) {
    element.style.display = 'block'
}

metro.exit.IndexPage.prototype.hide = function (element) {
    element.style.display = 'none'
}

var indexPage
function successMapLoad() {
    indexPage.successMapLoad()
}
window['successMapLoad'] = successMapLoad

window.addEventListener('load', function () {
    indexPage = new metro.exit.IndexPage()
    indexPage.init()
    indexPage.orient()
    indexPage.startLoadingMap()
})