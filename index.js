const Util = require("./util")
const Query = module.exports = {}


Query.insert = function (data, table) {

    //---------Error handling----------//
    if(!(Util.isObject(data) && Object.keys(data).length !== 0)) throw new Error('Missing data')
    else if(!table || table.length === 0) throw new Error('Missing table name')
    //---------------------------------//

    const columnList = []
    const valueList = []

    const columnMap = {}

    Object.keys(data).forEach(ele => {
        let column = ele
        let value = data[ele]

        columnList.push(column)
        valueList.push(value)
    })

    return "insert into " + table + " (" + columnList.join(",") + ") values (" + valueList.join(",") + ")"
}

const ConvertFindOperation = function (data) {
    let val = null
    let op = " = "

    //TODO: write more cases. These are just comparison operator
    Object.keys(data).forEach(ele => {
        if(ele === "$in"){
            val = "(" + data[ele].map(e => "\"" + e + "\"").join(",") + ")"
            op = " in "
        }else if (ele === "$eq") {
            val = data[ele]
            op = " = "
        }else if (ele === "$gt") {
            val = data[ele]
            op = " > "
        }else if (ele === "$gte") {
            val = data[ele]
            op = " >= "
        }else if (ele === "$lt") {
            val = data[ele]
            op = " < "
        }else if (ele === "$lte") {
            val = data[ele]
            op = " <= "
        }else if (ele === "$ne") {
            val = data[ele]
            op = " != "
        }else if (ele === "$nin") {
            val = "(" + data[ele].map(e => "\"" + e + "\"").join(",") + ")"
            op = " not in "
        }
    })

    return {
        operator: op,
        value: val
    }
}

const GenerateUpdate = function (data, list, isInc) {
    let val = ""
    list = list || []
    isInc = isInc || false

    Object.keys(data).forEach(ele => {
        if(ele === "$set"){
            GenerateUpdate(data[ele], list)
        }else if(ele === "$inc"){
            Object.keys(data[ele]).forEach(e => {
                data[ele][e] = e + " + " + data[ele][e]
            })
            GenerateUpdate(data[ele], list, true)
        }else if(Util.isObject(data[ele])){
            // object is cloned only for that particular key to avoid any duplication in list array
            const cloneData = {}
            cloneData[ele] = Util.cloneObject(data[ele])
            GenerateUpdate(cloneData, list)
        }else if (typeof data[ele] !== "object") list.push(ele + " = " + data[ele])
    })

    return list
}

const GenerateWhere = function myself (find){
    // Every element of find can either have value or json object
    // if it is a value then it is simple for where query.
    // If not so then check for different cases
    const whereList = []

    Object.keys(find).forEach(ele => {

        if (ele === "$or" && find[ele] && find[ele].constructor === Array) {
            let orList = []
            find[ele].forEach(e => {
                orList.push("(" + myself(e).join(" and ") + ")")
            })

            whereList.push("(" + orList.join(" or ") + ")")
        }else {
            let value = find[ele]
            let op = " = "

            if(value && typeof value === "object" && value.constructor !== Array){
                let convertedVal = ConvertFindOperation(value)
                value = convertedVal.value
                op = convertedVal.operator
            }

            whereList.push(ele + op + value)
        }
    })

    return whereList
}

Query.update = function (find, data, table) {

    //---------Error handling----------//
    if(!(Util.isObject(find) && Object.keys(find).length !== 0)) throw new Error('Missing where query')
    else if(!(Util.isObject(data) && Object.keys(data).length !== 0)) throw new Error('Missing data')
    else if(!table || table.length === 0) throw new Error('Missing table name')
    //---------------------------------//

    const where = GenerateWhere(find)
    const update = GenerateUpdate(data)

    if(where.length === 0 || update.length === 0) return null

    const query = "update " + table + " set " + update.join(", ") + " where " + where.join(" and ")

    return query
}
