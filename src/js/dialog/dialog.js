metro.exit.popup = function(id, zindex) {
    this.id = id
    this.div = document.getElementById(id)
    this.isShown = false
    this.zindex = zindex || 50
//    this.waitifrm

    this.create()
}

metro.exit.popup.prototype.show = function() {

    if (!this.isShown) {
        //this.div = document.getElementById("xdivmasking");
        //this.waitifrm = document.getElementById("xmaskframe");

        var dsh = document.documentElement.scrollHeight;
        var dch = document.documentElement.clientHeight;
        var dsw = document.documentElement.scrollWidth;
        var dcw = document.documentElement.clientWidth;

        var bdh = (dsh > dch) ? dsh : dch;
        var bdw = (dsw > dcw) ? dsw : dcw;

        this.div.style.height = bdh + 'px';
        this.div.style.width = bdw + 'px';
        this.div.style.display = "block";

//        this.div.style.height = this.waitifrm.style.height = bdh + 'px';
//        this.div.style.width = this.waitifrm.style.width = bdw + 'px';
//        this.waitifrm.style.display = this.div.style.display = "block";
        this.isShown = true
    }
}

metro.exit.popup.prototype.hide = function() {
    if (this.isShown) {
        //this.waitifrm.style.display = this.div.style.display = "none";
        this.div.style.display = "none";
        this.isShown = false
    }
}

metro.exit.popup.prototype.setContent = function(content) {
    this.div.appendChild(content)
}

metro.exit.popup.prototype.create = function() {
    if (!this.div) {
        this.div = document.createElement('div');
        this.div.setAttribute("id", this.id);
        document.body.appendChild(this.div);
    }

    this.div.className = 'overlay';
    this.div.style.zIndex = this.zindex
    this.div.appendChild(this.createCloseButton())

//    this.waitifrm = document.createElement('iframe');
//    this.waitifrm.setAttribute("id", "xmaskframe");
//    document.body.appendChild(this.waitifrm);
//
//    divSty = this.waitifrm.style;
//    divSty.position = "absolute";
//    divSty.top = "0px";
//    divSty.left = "0px";
//    divSty.zIndex = "45";
//    divSty.backgroundColor = "#000";
//    divSty.opacity = "0.5";
//    divSty.filter = "alpha(opacity=50)";
    //this.show()

}

metro.exit.popup.prototype.createCloseButton = function(){
    var button = document.createElement('div');
    button.setAttribute("id", this.id + "close");
    button.className = 'closeButton';
    button.style.zIndex = this.zindex

    var self = this
    button.addEventListener("click", function(){
        self.hide()
    })
    return button
}
