# mongo-to-mysql
Convert mongo query to mysql queries

This package works very well with mongodb package. This version only contains "insert" function. We will soon be coming up with more queries with proper documentation. Stay tuned

# Usage
```node
const MoMy = require("mongo-to-mysql")

let mongoDoc = {userName: "x", password: "y"}
let tableName = "user"
let getQuery = MoMy.insert(mongoDoc, tableName)

console.log(getQuery)
// Result: "insert into user (userName, password) values (x, y)"
```
