metro.exit.back = function (e) {
    if (this.getAttribute('href') == '#') {
        e.preventDefault()
        window.history.back()
/*
        if (typeof (window['navigator']['app']) !== 'undefined') {
            window['navigator']['app']['backHistory']()
        } else {
        }
*/
        return false
    }
}
window.addEventListener('load', function () {
    document.getElementById('back').onclick = metro.exit.back
})