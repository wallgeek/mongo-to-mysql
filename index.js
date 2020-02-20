const Query = module.exports = {}

Query.insert = function (data, table) {
    const columnList = []
    const valueList = []

    const columnMap = {}

    Object.keys(data).forEach(ele => {
        let column = ele
        let value = data[ele]

        columnList.push(column)
        valueList.push(value)
    })

    const query = "insert into " + table + " (" + columnList.join(",") + ") values (" + valueList.join(",") + ")"
    return query
}
