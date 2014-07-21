Function.prototype.makeSubclass = function () {
    function Class() {}

    Function.prototype.makeSubclass.nonconstructor.prototype = this.prototype;
    Class.prototype = new Function.prototype.makeSubclass.nonconstructor();
    return Class;
};
Function.prototype.makeSubclass.nonconstructor = function () {};