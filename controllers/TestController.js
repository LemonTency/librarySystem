const Index = require("../models/index");
class TestController{
    constructor(){

    }
    actionIndex(){
        return async(ctx, next) => {
            //ctx.body = 'hello 我是zty'
            ctx.body = await ctx.render("index",{
                data:'jjjj'
            })
        }
    }
}

module.exports = TestController;