metro.exit.PreferencesPage = function () {
    metro.exit.ContentCenterPage.call(this)
}

metro.exit.PreferencesPage.prototype = Object.create(metro.exit.ContentCenterPage.prototype)

metro.exit.PreferencesPage.prototype.init = function () {
    metro.exit.ContentCenterPage.prototype.init.call(this)

    var langIcon = document.querySelector('#lang > img')
    langIcon.src = metro.exit.config.getLocaleIcon(i18n.getLocale())
}

window.onload = function () {
    metro.exit.HeaderPage(metro.exit.PreferencesPage)
    var page = new metro.exit.PreferencesPage()
    page.init('contentWrapper')
    page.orient()
}
