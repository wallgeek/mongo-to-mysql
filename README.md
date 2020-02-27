# mongo-to-mysql
Convert simple mongodb queries to mysql command. See example below

We will soon be coming up with more queries with proper documentation. Stay tuned

## Installation
Using npm:
```shell
$ npm i mongo-to-mysql
```

## Usage

### Insert
```js
const MoMy = require("mongo-to-mysql")

let mongoDoc = {userName: "x", password: "y"}
let tableName = "user"
let getQuery = MoMy.insert(mongoDoc, tableName)

console.log(getQuery)
// Result: "insert into user (userName, password) values (x, y)"
```

### Update
"$in" example:
```js
const MoMy = require("mongo-to-mysql")

let mongoFind = {name: {$in: ["abc", "def", "ghi"]}}
let mongoUpdate = {$inc: {visits: 1}}
let tableName = "user"
let getQuery = MoMy.update(mongoFind, mongoUpdate, tableName)

console.log(getQuery)
// Result: "update user set visits = visits + 1 where name in ("abc","def","ghi")"
```

"$gt" example:
```js
const MoMy = require("mongo-to-mysql")

let mongoFind = {hour: {$gt: 9}}
let mongoUpdate = {$inc: {visits: 1}}
let tableName = "user"
let getQuery = MoMy.update(mongoFind, mongoUpdate, tableName)

console.log(getQuery)
// Result: "update user set visits = visits + 1 where hour > 9"
```

Combined example:
```js
const MoMy = require("mongo-to-mysql")

let mongoFind = {name: {$in: ["abc", "def", "ghi"]}, hour: {$gt: 9}}
let mongoUpdate = {$inc: {visits: 1}}
let tableName = "user"
let getQuery = MoMy.update(mongoFind, mongoUpdate, tableName)

console.log(getQuery)
// Result: "update user set visits = visits + 1 where name in ("abc","def","ghi") and hour > 9"
```

Multiple updates ("$inc" and "$set"):
```js
const MoMy = require("mongo-to-mysql")

let mongoFind = {name: {$in: ["abc", "def", "ghi"]}, hour: {$gt: 9}}
let mongoUpdate = {$inc: {visits: 1}, $set: {hasVisited: 1}}
let tableName = "user"
let getQuery = MoMy.update(mongoFind, mongoUpdate, tableName)

console.log(getQuery)
// Result: "update user set visits = visits + 1, hasVisited = 1 where name in ("abc","def","ghi") and hour > 9"
```

Supported mongodb operations currently: "$in", "$nin", "$eq", "$ne", "$gte", "$gt", "$lte", "$lt"
