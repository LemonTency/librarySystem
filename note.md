https://github.com/gyson/koa-simple-router
![image.png](https://upload-images.jianshu.io/upload_images/7728915-df269e02be3c02e5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
1. 将YII文件夹复制过来，主要学习MVC框架结构
![image.png](https://upload-images.jianshu.io/upload_images/7728915-561e6cbc4783e75e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
文件结构如下：
wigdets = components都是组件的意思。
![image.png](https://upload-images.jianshu.io/upload_images/7728915-a758dbe863f02126.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
然后删除掉一些不需要用到的文件夹。
assert里面是js css目录
config里面是配置文件
controller里面是路由
models和后台请求有关（通信）
将runtime更改为middleware，放中间件
tests文件夹存放单元测试文件。
views存放视图文件
web存放前端的项目（前后端分离的时候）
widgets改为components存放组件。

2. controller里面新建index.js（路由的初始化）
index.js就是我们的路由注册中心
安装koa-simple-router
npm install koa-simple-router
将demo 里面的代码复制过去并且修改

        module.exports = (app) => {
            app.use(router(_ => {
                _.get('/', (ctx, next) => {
                  ctx.body = 'hello'
                })
              }))
        }
但是我们需要把一些具体的操作都独自放在一个控制器里面，用class来控制。
所以，新建IndexController。

    class IndexController{
        constructor(){

        }
        actionIndex(){
            return async(ctx, next) => {
                ctx.body = 'hello 大家好'
            }
        }
    }

    module.exports = IndexController;
定义 actionIndex并将IndexController导出。
此时，路由初始化文件可以更改为：

      const router = require('koa-simple-router')
      const IndexController = require('./IndexController');
      const indexController = new IndexController(); 

      module.exports = (app) => {
          app.use(router(_ => {
                _.get('/',indexController.actionIndex())
            }))
      }
app.js中的代码如下：

        const Koa = require('Koa');
        const app = new Koa();
        //注入我们的路由
        require('./controllers')(app);
        console.log('服务已启动');

        app.listen(3000);
启动服务，此时就可以看到
![image.png](https://upload-images.jianshu.io/upload_images/7728915-c059f1d3efaf1297.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

3. 每次更改都要手动去重启服务，很麻烦，在node中可以使用supervisor进行设置，所以我们可以直接在package.json里面的script进行设置。

[cross-env](https://www.npmjs.com/package/cross-env)。
能够提供一个设置环境变量的scripts，让你能够以unix方式设置环境变量，然后在windows上也能兼容运行。
https://blog.csdn.net/qq_26927285/article/details/78105510
他是运行[跨平台](https://www.baidu.com/s?wd=%E8%B7%A8%E5%B9%B3%E5%8F%B0&tn=24004469_oem_dg&rsv_dl=gh_pl_sl_csd)设置和使用环境变量的脚本
是因为windows不支持NODE_ENV=development的设置方式。会报错，所以cross-env能够提供一个设置环境变量的scripts，让你能够以unix方式设置环境变量，然后在windows上也能兼容运行。
而且这个也能判断生产环境还是开发环境，后续能进行流清洗。

**安装**

        cnpm install cross-env --save

**使用**

      "dev": "cross-env NODE_ENV=development supervisor app.js"
设置当前环境是development，然后再执行supervisor app.js
执行之后就可以看见process.env.NODE_ENV打印出development

下面是package.json的标准教程
http://javascript.ruanyifeng.com/nodejs/packagejson.html#toc0

4.  新建views视图
view中新建index.html和test.html
一一对应的渲染，index.html继承于layout.html
swig模板的使用

Swig 使用 extends 和 block 来实现模板继承 layout.html
layout.html

    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>{% block title %}{% endblock %}</title>
        {% block head %}{% endblock %}
        <!-- block head的位置是留给CSS -->
    </head>
    <body>
        {% block content %}{% endblock %}
        <!-- block content的位置是留给html的 -->
        {% block scripts %}{% endblock %}
        <!-- block scripts的位置是留给js的 -->
    </body>
    </html>
index.html

    {% extends './layout.html' %}

    {% block title %}新闻系统 {%endblock%}

    {% block head %}
    <link rel = "stylesheet" href="/styles/index.css">
    {% endblock %}

    {% block content %}
        {% include "../widgets/news/list.html" %}
    {% endblock %}
    {% block scripts %}
    <script src = "/scripts/index.js"></script>
    {% endblock %}
 http://www.iqianduan.net/blog/how_to_use_swig
**koa2-connect-history-api-fallback**
https://www.npmjs.com/package/koa2-connect-history-api-fallback
koa2的一个中间件，用于处理vue-router使用history模式返回index.html，让koa2支持SPA应用程序。

https://www.npmjs.com/package/koa-swig
npm install koa-swig
cnpm install co(koa2.x需要加载co模块使得yield不是yield)
https://www.npmjs.com/package/koa-static
npm install koa-static
加载静态资源文件的。

5. 容错
利用洋葱模型的特性来做Koa的容错。
在中间件中建立errorHandler.js

如果是404，就接入腾讯404小孩回家页面
https://www.qq.com/404/


      const errorHandler = {
        error(app){
            app.use(async (ctx,next) => {
                await next();
                //先让代码往前走
                if(404 != ctx.status){
                    return 
                }
                //不承认网站404，百度会降权，将ctx.status修改为200,并修改ctx.body为找不到页面的页面
                //腾讯404脚本
                ctx.status = 404;
                ctx.body = '<script type="text/javascript" src="//qzonestyle.gtimg.cn/qzone/hybrid/app/404/search_children.js" charset="utf-8"></script>';
            })
        }
    }

    module.exports = errorHandler;

app.js

        const errorHandler = require('./middleware/errorHandler');
在路由之前加上

        errorHandler.error(app);
如果去营造服务器错误？？就应该执行一个不存在的函数，这样就不是在编译时出错，而是可以跑起来。

在errorHandler.js里面增加

        app.use(async (ctx,next) => {
            try{
                await next();
            }catch(error){
                ctx.status = 500;
                console.log(error);
                ctx.body = '( ▼-▼ )';
            }
        });

在indexController.js里面添加一个不存在的函数（例如我们没有定义indexAction()），那么就会出现500错误，是服务器这边的错误。
这个时候在localhost里面可以看到( ▼-▼ )
**在命令行可以看到下面的提示indexAction is not defined**
ReferenceError: indexAction is not defined
    at C:\document\frontEnd\京城一灯\note\0204homework_second_week\controllers\IndexController.js:8:13
    at dispatch (C:\document\frontEnd\京城一灯\note\0204homework_second_week\node_modules\_koa-simple-router@0.2.0@koa-simple-router\index.js:186:18)
    at Router._lookup (C:\document\frontEnd\京城一灯\note\0204homework_second_week\node_modules\_koa-simple-router@0.2.0@koa-simple-router\index.js:198:12)
    at C:\document\frontEnd\京城一灯\note\0204homework_second_week\node_modules\_koa-simple-router@0.2.0@koa-simple-router\index.js:138:21
    at dispatch (C:\document\frontEnd\京城一灯\note\0204homework_second_week\node_modules\_koa-compose@4.1.0@koa-compose\index.js:42:32)
    at app.use (C:\document\frontEnd\京城一灯\note\0204homework_second_week\middleware\errorHandler.js:13:19)
    at dispatch (C:\document\frontEnd\京城一灯\note\0204homework_second_week\node_modules\_koa-compose@4.1.0@koa-compose\index.js:42:32)
    at app.use (C:\document\frontEnd\京城一灯\note\0204homework_second_week\middleware\errorHandler.js:5:23)
    at dispatch (C:\document\frontEnd\京城一灯\note\0204homework_second_week\node_modules\_koa-compose@4.1.0@koa-compose\index.js:42:32)
    at serve (C:\document\frontEnd\京城一灯\note\0204homework_second_week\node_modules\_koa-static@5.0.0@koa-static\index.js:53:15)

**error的捕获是特别重要的，最好可以打印出日志。**
log4js
https://www.npmjs.com/package/log4js
在服务器上面也应该打印出日志。
1. 先安装log4js
app.js里面定义

        const log4js = require('log4js');
再添加配置

    log4js.configure({
      appenders: {
        cheese: { 
          type: 'file', filename: 'cheese.log'
        }
      },
      categories: { 
        default: { 
          appenders: ['cheese'], level: 'error' 
        } 
      }
    });
    const logger = log4js.getLogger('cheese');
    errorHandler.error(app,logger);
此时，在errorHandler里面添加logger

    error(app,logger){
        app.use(async (ctx,next) => {
            try{
                await next();
            }catch(error){
                ctx.status = 500;
                //console.log(error);
                logger.error(error);
                ctx.body = '( ▼-▼ )';
            }
        });
将error打印出来。
6. model和php连接
在model里面新建一个index.js
新建一个utils文件夹，工具包的意思。

为什么要注释？因为要输出文档，我们可以用jsdoc来生成相关的说明文档，避免撕逼
https://www.npmjs.com/package/jsdoc
* 安装
cnpm install --save-dev jsdoc
* 在package.json里面的scripts里面加上一个命令

         "docs": "jsdoc ./**/*.js -d ./docs/jsdocs"
执行npm run docs
在linux系统上面的**是可以起作用的，但是在windows上面是不起作用的。
所以改成下面：

         "docs": "jsdoc ./models/index.js -d ./docs/jsdocs"
才可以在window上面跑。
执行npm run docs，可以看到docs目录下面生成了一个jsdocs的文件夹，打开index_.html用浏览器打开就可以看到文档了。
controller可以不写文档，但是model就要写文档。

![image.png](https://upload-images.jianshu.io/upload_images/7728915-7a85c9847c3e9923.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**论写docs邀功的重要性**
在安装依赖的时候注意到了一个问题：
npm install 在安装 npm 包时，有两种命令参数可以把它们的信息写入 package.json 文件，一个是npm install--save另一个是 npm install –save-dev，他们表面上的区别是--save 会把依赖包名称添加到 package.json 文件 dependencies 键下，--save-dev 则添加到 package.json 文件 devDependencies 键下，譬如：

    {
     "dependencies": {
        "vue": "^2.2.1"
      },
      "devDependencies": {
        "babel-core": "^6.0.0",
        "babel-lo
    }
    }
它们真正的区别是，npm自己的文档说dependencies是运行时依赖，devDependencies是开发时的依赖。即devDependencies 下列出的模块，是我们开发时用的，比如 我们安装 js的压缩包gulp-uglify 时，我们采用的是 “npm install –save-dev gulp-uglify ”命令安装，因为我们在发布后用不到它，而只是在我们开发才用到它。dependencies 下的模块，则是我们发布后还需要依赖的模块，譬如像jQuery库或者Angular框架类似的，我们在开发完后后肯定还要依赖它们，否则就运行不了。

另外需要补充的是： 
正常使用npm install时，会下载dependencies和devDependencies中的模块，当使用npm install –production或者注明NODE_ENV变量值为production时，只会下载dependencies中的模块。

models下面的index.js代码如下：

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
     * getData(options)
     */
    getData(options){
        return {};
    }
    }
    module.exports = Index;
一直把ladash拼错了尴尬。
7. 多个路由的配置
在controller里面新建一个文件TestController，类名与文件名称相对应

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
        //将模块暴露出去。
    然后在路由的注册中心index.js上面引入，并对新路由进行定义。

        const TestController = require('./TestController');
        const testController = new TestController(); 


        module.exports = (app) => {
            app.use(router(_ => {
                _.get('/',indexController.actionIndex())
              }))
            app.use(router(_ => {
                _.get('/test',testController.actionIndex())
              }))
        }

    之后输入相对应的路由就能到不同的页面了
8. 生成JSON接口
在我们之前的yii项目里面的controller里面的libaryController进行更改就行了。

        /**
         * Lists all Library models.
         * @return mixed
         */
        public function actionIndex()
        {
            $searchModel = new LibrarySearch();
            $dataProvider = $searchModel->search(Yii::$app->request->queryParams);
            //将输出指定为JSON格式
            Yii::$app->response->format = Response::FORMAT_JSON;
            return $dataProvider->getModels();
        }

重点就在于            

        Yii::$app->response->format = Response::FORMAT_JSON;
        return $dataProvider->getModels();
看到了一个错误：Class 'app\controllers\Response' not found
原来是没有引入这个东西
应该在libaryController头部加上
use yii\web\Response;
然后就没有问题了。
之后在浏览器地址栏输入http://localhost/Yii/test3/web/index.php?r=library
library对应LibrartController这个控制器
![image.png](https://upload-images.jianshu.io/upload_images/7728915-3b8ede078430962b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
9. 容错
安装node-fetch

        cnpm install node-fetch --save
https://www.npmjs.com/package/node-fetch

继续编辑utils中SafeRequest，对一些请求进行容错。

        const fetch = require("node-fetch");
        const config = require("../config");

        //设置传输进来的url和baseURL
        class SafeRequest{
            constructor(url){
                this.url = url;
                this.baseURL = config.baseURL;
            }
            fetch(options){
                let ydfetch = fetch(this.baseURL + this.url);
                return new Promise((resolve,reject) =>{
                    let result = {
                        code:0,
                        message:"",
                        data:[]
                    }
                    ydfetch
                    .then(res => res.json())
                    .then((json) => {
                        result.data = json;
                        resolve(result);
                    }).catch((error) => {
                        result.code = 1;
                        result.message = "node-fetch与后端通讯异常";
                        
                    })
                })
            }
        }


        module.exports = SafeRequest;
将indexController中的actionIndex修改为

        const Index = require("../models/index");
        class IndexController{
            constructor(){

            }
            actionIndex(){
                //SSR 
                return async(ctx, next) => {
                    const index = new Index();
                    const result = await index.getData();
                    ctx.body = await ctx.render("index",{
                        // data: '欢迎来到新世界'
                        data:result.data
                    })
                }
            }
        }

        module.exports = IndexController;
将取得的data渲染出来。

好尴尬，把assets写错了

10. 在views里面添加add.html文件（swig模板）
只有这个add.html需要用到vue，所以在add.html的swig模板里面引入这个src。

        {% extends './layout.html' %}

        {% block title %}新增新闻页面{%endblock%}

        {% block head %}
        <link rel="stylesheet" type="text/css" href="/styles/index.css" /> 
        {% endblock %}

        {% block content %}
            {% include "../components/news/add.html" %}
        {% endblock %}
        {% block scripts %}
        <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
        <script src = "/scripts/add.js"></script>
        {% endblock %}
在components里面添加add.html文件（纯纯的html文件）

    <div>
    <p>新增新闻页面</p>
    <div id="app-6">
        <p>{{ message }}</p>
        <input v-model="message">
    </div>
    </div>
add.js代码

    var app6 = new Vue({
        el: '#app-6',
        data: {
          message: 'Hello Vue!'
        }
      })
**但是这里的swig和vue的{{}}冲突了，所以我们的p不能被渲染出来**
这个时候就可以在app.js里面进行设置了，在app.context.render里面加上

        varControls:["[[","]]"],
将swig中的渲染{{}}改成[[ ]],

http://www.staticfile.org/
里面存放了很多开源的库
可以搜索你想要的一些CDN资源，jquery等

**还有一个问题**
V8对一些新的API都是有优化的，比如map,set等
如果不管三七二十一就把ES6代码用babel转换为ES5代码，那就白瞎了敲那些ES6代码
所以就可以利用type=module来进行判断，如果支持的话就可以直接加载ES6模块不然就可以加载babel转换的ES5模块。
https://www.imooc.com/article/20630?block_id=tuijian_wz














