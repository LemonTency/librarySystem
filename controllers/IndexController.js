const Index = require("../models/index");
//引入url参数方便处理
const {URLSearchParams} = require("url");
class IndexController{
    constructor(){

    }
    actionIndex(){
        //SSR 
        return async(ctx, next) => {
            const index = new Index();
            const result = await index.getData();
            
            //ctx.body = 'hello 我是zty'
            //render(渲染)index.html这个模板
            ctx.body = await ctx.render("index",{
                // data: '欢迎来到新世界'
                data:result.data
            })
        }
    }
    actionAdd(){
        //SSR 
        return async(ctx, next) => {
            ctx.body = await ctx.render("add")
        }
    }
    actionSave(){
        //SSR 
        return async(ctx, next) =>{
        const index = new Index();
        const params = new URLSearchParams();
        params.append("Library[title]","你知道的CSS");
        params.append("Library[author]","zty");
        const result = await index.saveData({
            params
        });
        ctx.body = result;
        }
    }
    
}

module.exports = IndexController;