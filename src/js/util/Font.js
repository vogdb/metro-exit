/**
 * @param sizeEm size of elem in 'em'
 * @param sizePercent size of elem in percent. Percent should be measured from 0.0 to 1.0
 * @constructor
 */
metro.exit.Font = function (sizeEm, sizePercent) {
    this.sizeEm = sizeEm
    this.sizePercent = sizePercent
}

metro.exit.Font.DEFAULT_MAX_LENGTH_EM = 13
metro.exit.Font.DEFAULT_VERTICAL = new metro.exit.Font(metro.exit.Font.DEFAULT_MAX_LENGTH_EM, 0.9)
metro.exit.Font.DEFAULT_HORIZONTAL = new metro.exit.Font(metro.exit.Font.DEFAULT_MAX_LENGTH_EM, 0.7)

metro.exit.Font.prototype.calculateSizePx = function (containerSizePx) {
    return Math.floor(this.sizePercent * containerSizePx / this.sizeEm)
}

metro.exit.Font.prototype.calculateSizePxCss = function (containerSizePx) {
    return this.calculateSizePx(containerSizePx) + 'px'
}