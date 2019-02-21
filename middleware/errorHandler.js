const errorHandler = {
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