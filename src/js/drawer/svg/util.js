/**
 *"100px" -> 100
 */
metro.exit.getPx = function(param) {
    return parseInt(param.split("px")[0])
}