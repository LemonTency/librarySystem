const Koa = require('Koa');
const app = new Koa();
var render = require('koa-swig');
const path = require('path');
const co = require('co');
const serve = require('koa-static');
const errorHandler = require('./middleware/errorHandler')
const log4js = require('log4js');
const config = require('./config');
//console.log('哈哈哈',process.env.NODE_ENV);
//哈哈哈 development
//process.env.NODE_ENV是当前的环境
//注入我们的路由
app.use(serve(__dirname + '/assets'));
//app.use(serve(config.staticDir));
//dirname加上所在文件夹名称
app.context.render =  co.wrap(render({
    root: path.join(__dirname, 'views'),
    // root: path.join(config.viewDir),
    autoescape: true,
    cache: config.cacheModel, // disable, set to false
    ext: 'html',
    varControls:["[[","]]"],
    writeBody: false
  }));
//log4js的配置
//设置日志的分类和名字
//逻辑和业务错误 http日志
//filename默认在但钱当前文件夹下面
//filename: __dirname+'/zty.log'
log4js.configure({
  appenders: {
    cheese: { 
      type: 'file', filename: 'logs/zty.log'
    }
  },
  categories: { 
    default: { 
      appenders: ['cheese'], level: 'error' 
    } 
  }
});
const logger = log4js.getLogger('cheese');
//errorHandler容错要写到路由前面
errorHandler.error(app,logger);

require('./controllers')(app);


// app.listen(3000,() => {
//   console.log('服务已启动');
// });
app.listen(3000,() => {
  console.log('服务已启动');
  });
