# mongo-to-mysql
Convert mongo query to mysql queries

This package works very well with mongodb package. This version only contains "insert" function. We will soon be coming up with more queries with proper documentation. Stay tuned

# Usage

## Insert
```node
const MoMy = require("mongo-to-mysql")

let mongoDoc = {userName: "x", password: "y"}
let tableName = "user"
let getQuery = MoMy.insert(mongoDoc, tableName)

console.log(getQuery)
// Result: "insert into user (userName, password) values (x, y)"
```

## Update
```node
const MoMy = require("mongo-to-mysql")

let mongoFind = {hour: {$gt: 9}}
let mongoUpdate = {$inc: {visits: 1}}
let tableName = "user"
let getQuery = MoMy.update(mongoFind, mongoUpdate, tableName)

console.log(getQuery)
// Result: "update user set visits = visits + 1 where hour > 9"
```
Update query currently works for operations "$in", "$eq", "$gte", "$gt", "$lte", "$lt", "$ne", "$nin"
Use simple queries.
And use "$set" and "$inc" to update
