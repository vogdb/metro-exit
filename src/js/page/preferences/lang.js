metro.exit.LangPage = function () {
  metro.exit.ContentCenterPage.call(this)

  this.SELECTED_LANG_HOLDER_ID = 'selectedLang'
}

metro.exit.LangPage.prototype = Object.create(metro.exit.ContentCenterPage.prototype)

metro.exit.LangPage.prototype.init = function () {
  metro.exit.ContentCenterPage.prototype.init.call(this)

  this.createLangsUI()

  var self = this
  document.getElementById('go').onclick = function(){self.select()}
}

metro.exit.LangPage.prototype.createLangsUI = function () {
  var container = document.getElementById('langs')
  this.selectabeList = new metro.exit.SelectableList(container, this.SELECTED_LANG_HOLDER_ID)
  this.selectabeList.init()

  var langs = [
    [I18n.RU, 'Русский'],
    ['en', 'English']
  ]
  for (var i = 0; i < langs.length; i++) {
    container.appendChild(this.createSingleLangUI(langs[i]))
  }
}

metro.exit.LangPage.prototype.createSingleLangUI = function (lang) {
  var wrapper = document.createElement("li")

  var icon = document.createElement("img")
  icon.className = 'icon'
  icon.src = metro.exit.config.getLocaleIcon(lang[0])

  var input = document.createElement("input")
  input.setAttribute("type", "hidden")
  input.setAttribute("value", lang[0])

  var title = document.createElement('span')
  title.innerHTML = lang[1]

  wrapper.appendChild(icon)
  wrapper.appendChild(input)
  wrapper.appendChild(title)

  if (lang[0] == i18n.getLocale()) {
    this.selectabeList.selectItem(wrapper)
  }

  return wrapper
}

metro.exit.LangPage.prototype.select = function () {
  var locale = document.getElementById(this.SELECTED_LANG_HOLDER_ID).value
  I18n.saveLocale(locale)
  location.reload()
}

window.onload = function () {
  metro.exit.HeaderPage(metro.exit.LangPage)
  var page = new metro.exit.LangPage()
  page.init('contentWrapper')
  page.orient()
}
