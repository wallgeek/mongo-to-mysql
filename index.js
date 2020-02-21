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
