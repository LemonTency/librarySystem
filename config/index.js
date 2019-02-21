const {join} = require("path");
const _ = require("lodash");
let config = {
    "viewDir": join(__dirname,"..","views"),
    "staticDir": join(__dirname,'..',"asserts"),
}
if(process.env.NODE_ENV == "development"){
    const localConfig = {
        baseURL:"http://localhost/Yii/test3/web/index.php?r=",
        port:3000,
        cacheModel:false
    }
    config = _.extend(config,localConfig)
}
if(process.env.NODE_ENV == "production"){
    const prodConfig = {
        port:8081,
        cacheModel:"memory"
    }
    config = _.extend(config,prodConfig)  
}

module.exports = config;