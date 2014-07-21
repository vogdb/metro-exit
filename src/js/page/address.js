metro.exit.AddressPage = function () {
    metro.exit.DefaultPage.call(this)
}

metro.exit.AddressPage.prototype = Object.create(metro.exit.DefaultPage.prototype)

metro.exit.AddressPage.prototype.init = function () {
    metro.exit.DefaultPage.prototype.init.call(
        this,
        {font:{horizontal:new metro.exit.Font(20, 0.9)}}
    )
    //карты грузятся только после проставления локали, хотя и начинать их загрузку лучше раньше всех.
    metro.exit.mmap.loadGoogleMap()

    var address = document.getElementById("address")
    this.address = address
    var addressStorage = localStorage.getItem("address")
    this.prompter = new window['Prompter']({'target': address, 'data': addressStorage ? addressStorage.split("#") : []})

    document.getElementById("go").onclick = function (e) {
        e.preventDefault()
        var addressValue = address.value.trim()
        if (addressValue) {
            if (addressStorage) {
                if (addressStorage.toLowerCase().indexOf(addressValue.toLowerCase()) == -1)
                    localStorage.setItem("address", addressValue + "#" + addressStorage)
            } else
                localStorage.setItem("address", addressValue)
            metro.exit.mmap.searchAddress(i18n.text('page.address.searchPrefix') + addressValue)
        } else {
            alert(i18n.text('page.address.emptyInput'))
        }
    }
}

window.onload = function () {
    metro.exit.AutoCompletePage(metro.exit.AddressPage)
    var page = new metro.exit.AddressPage()
    page.init('contentWrapper')
    page.orient()
}
