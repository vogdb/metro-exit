metro.exit.SelectableList = function (list, valueHolderId) {
    this.list = list
    this.valueHolderId = valueHolderId
    this.valueHolder
    this.selectedItem = undefined
}

metro.exit.SelectableList.prototype.init = function () {
    this.valueHolder = document.getElementById(this.valueHolderId)
    if (!this.valueHolder) {
        //creating input to hold selected value
        this.valueHolder = document.createElement('input')
        this.valueHolder.setAttribute('id', this.valueHolderId)
        this.valueHolder.setAttribute('type', 'hidden')
        document.body.appendChild(this.valueHolder)
    }
    var self = this
    this.list.onclick = function (e) {
        var target = e.target
        while (target !== self.list) {
            if (target.tagName == 'LI') {
                break
            }
            target = target.parentNode
        }
        if (target === self.list) {
            return
        }
        self.selectItem(target)
    }
}

metro.exit.SelectableList.prototype.selectItem = function (item) {
    if (this.selectedItem !== item) {
        var selectedClassName = ' selected'
        if (this.selectedItem !== undefined) {
            this.selectedItem.className = this.selectedItem.className.substring(0, this.selectedItem.className.length - selectedClassName.length)
        }
        this.valueHolder.value = this.getItemValue(item)
        item.className = item.className + selectedClassName
        this.selectedItem = item
    }
}

metro.exit.SelectableList.prototype.getItemValue = function (item) {
    return item.getElementsByTagName('input')[0].value
}