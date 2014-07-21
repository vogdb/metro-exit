I18n.STORAGE_KEY = 'i18n_locale'
I18n.RU = 'ru'

I18n.saveLocale = function (locale) {
  localStorage.setItem(I18n.STORAGE_KEY, locale)
}
I18n.restoreLocale = function () {
  return localStorage.getItem(I18n.STORAGE_KEY)
}
//i18n создается здесь, чтобы быть в глобальном скопе всегда вне зависимости от
// того является ли глобальный скоп window или нет.
var i18n = new I18n({'path': metro.exit.defineAbsolutePath('js/config/messages')})