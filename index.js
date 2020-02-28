const Util = require("./util")
const Constant = require("./constant")

const Query = module.exports = {}

const ConvertFindOperation = function (data) {
    const opMap = Constant.OPERATOR_MAP
    let val = null
    let op = opMap.EQUAL.MYSQL // General

    //TODO: write more cases. These are just comparison operator
    Object.keys(data).forEach(ele => {
        val = data[ele]

        if (ele === opMap.EQUAL.MONGO) op = opMap.EQUAL.MYSQL
        else if (ele === opMap.NOT_EQUAL.MONGO) op = opMap.NOT_EQUAL.MYSQL
        else if (ele === opMap.GREATER_THAN.MONGO) op = opMap.GREATER_THAN.MYSQL
        else if (ele === opMap.GREATER_THAN_EQUAL.MONGO) op = opMap.GREATER_THAN_EQUAL.MYSQL
        else if (ele === opMap.LESS_THAN.MONGO) op = opMap.LESS_THAN.MYSQL
        else if (ele === opMap.LESS_THAN_EQUAL.MONGO) op = opMap.LESS_THAN_EQUAL.MYSQL
        else if(ele === opMap.IN.MONGO || ele === opMap.NOT_IN.MONGO){
            val = "(" + data[ele].map(e => "\"" + e + "\"").join(",") + ")"
            op = ele === opMap.IN.MONGO ? opMap.IN.MYSQL : opMap.NOT_IN.MYSQL
        }
    })

    return {
        operator: " " + op + " ",
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
