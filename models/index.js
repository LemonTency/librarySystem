/**
 * @fileoverview 实现index的数据模型
 * @author zty
 */
const SafeRequest = require('../utils/SafeRequest.js')
/**
 * Index类 获取后台关于图书相关的数据类
 * class
 */
class Index{
    /**
     * @constructor 
     * @param{string} app 参数是字符串，是Koa执行上下文
     */
    constructor(app){

    }
    /**
     * 获取后台全部图书的数据方法
     * @param{*} option 配置项
     * @example
     * return new Promise
     * getData()
     */
    getData(){
        const safeRequest = new SafeRequest("library");
        return safeRequest.fetch({});
    }
    /**
     * 把用户传过来的书名作者等信息传入php接口
     * @param{*} option 配置项
     * @example
     * return new Promise
     * saveData(options)
     */
    saveData(options){
        //create对应actionCreate
        const safeRequest = new SafeRequest("library/create");
        return safeRequest.fetch({
            method:"POST",
            params:options.params
        });
    }
}
module.exports = Index;