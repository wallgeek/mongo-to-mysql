const Util = module.exports = {}

Util.isObject = function (value) {
    if(value && typeof value === "object" && value.constructor !== Array) return true
    else return false
}

Util.cloneObject = function myself(obj, cloneObj){
    if(!obj) return cloneObj
    cloneObj = cloneObj || {}
    Object.keys(obj).forEach(ele => {
        if(obj[ele] && typeof obj[ele] === "object" && obj[ele].constructor !== Array){
            cloneObj[ele] = {}
            myself(obj[ele], cloneObj[ele])
        }else {
            cloneObj[ele] = obj[ele]
        }
    })

    return cloneObj
}
