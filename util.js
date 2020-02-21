const Util = module.exports = {}

Util.isObject = function (value) {
    if(value && typeof value === "object" && value.constructor !== Array) return true
    else return false
}
