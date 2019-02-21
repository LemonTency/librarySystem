
const router = require('koa-simple-router')
const IndexController = require('./IndexController');
const TestController = require('./TestController');
const indexController = new IndexController(); 
const testController = new TestController(); 

module.exports = (app) => {
    app.use(router(_ => {
        _.get('/',indexController.actionIndex())
      }))
    app.use(router(_ => {
        _.get('/test',testController.actionIndex())
      }))
    app.use(router(_ => {
        _.get('/add',indexController.actionAdd())
      }))
    app.use(router(_ => {
        _.get('/save',indexController.actionSave())
      }))  
}