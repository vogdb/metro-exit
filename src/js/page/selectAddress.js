metro.exit.SelectAddress = function () {
    metro.exit.ContentCenterPage.call(this)

    this.SELECTED_ADDRESS_HOLDER_ID = 'selectedAddress'
}

metro.exit.SelectAddress.prototype = Object.create(metro.exit.ContentCenterPage.prototype)

metro.exit.SelectAddress.prototype.init = function () {
    metro.exit.ContentCenterPage.prototype.init.call(
        this,
        {font:{
            vertical:new metro.exit.Font(20, 0.95),
            horizontal:new metro.exit.Font(22, 0.95)
        }}
    )

    this.createAddressesUI(this.parseParams())
    var self = this
    document.getElementById("go").onclick = function () {
        self.select()
    }
}

metro.exit.SelectAddress.prototype.parseParams = function () {
    //вырезаем из запроса "?", поэтому substring(1)
    var query = decodeURIComponent(window.location.search.substring(1))
    var params = query.split("&")
    if (params.length <= 1)
        alert(i18n.text('page.wrongArgs'))
    return params
}

metro.exit.SelectAddress.prototype.createAddressesUI = function (addresses) {
    var container = document.getElementById("addresses")
    for (var i = 0; i < addresses.length; i++) {
        container.appendChild(this.createSingleAddressUI(addresses[i]))
    }
    new metro.exit.SelectableList(container, this.SELECTED_ADDRESS_HOLDER_ID).init()
}

metro.exit.SelectAddress.prototype.createSingleAddressUI = function (address) {
    var wrapper = document.createElement("li")

    var input = document.createElement("input")
    input.setAttribute("type", "hidden")
    var addressParts = address.split(metro.exit.config.arraySeparator)
    //input.setAttribute("value", "lat=" + addressParts[1] + "&lng=" + addressParts[2]);
    input.setAttribute("value", addressParts[1] + "," + addressParts[2]);

    var title = document.createElement("span")
    title.innerHTML = addressParts[0]

    wrapper.appendChild(input)
    wrapper.appendChild(title)

    return wrapper
}

metro.exit.SelectAddress.prototype.select = function () {
    var inputValue = document.getElementById(this.SELECTED_ADDRESS_HOLDER_ID).value
    if (inputValue) {
        var gps = inputValue.split(",")
        metro.exit.mmap.openMap(gps[0], gps[1])
    } else {
        alert(i18n.text('page.selectAddress.emptyInput'));
    }
    return false
}

window.onload = function () {
    metro.exit.HeaderPage(metro.exit.SelectAddress)
    var page = new metro.exit.SelectAddress()
    page.init('contentWrapper')
    page.orient()
}