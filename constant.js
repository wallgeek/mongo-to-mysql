const Constant = module.exports = {}

Constant.OPERATOR_MAP = {
    EQUAL: {
        MONGO: "$eq",
        MYSQL: "="
    },
    NOT_EQUAL: {
        MONGO: "$ne",
        MYSQL: "!="
    },
    IN: {
        MONGO: "$in",
        MYSQL: "in"
    },
    NOT_IN: {
        MONGO: "$nin",
        MYSQL: "not in"
    },
    GREATER_THAN: {
        MONGO: "$gt",
        MYSQL: ">"
    },
    GREATER_THAN_EQUAL: {
        MONGO: "$gte",
        MYSQL: ">="
    },
    LESS_THAN: {
        MONGO: "$lt",
        MYSQL: "<"
    },
    LESS_THAN_EQUAL: {
        MONGO: "$lte",
        MYSQL: "<="
    }
}
