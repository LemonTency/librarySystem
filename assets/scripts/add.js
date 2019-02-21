// var app6 = new Vue({
//     el: '#app-6',
//     data: {
//       message: 'Hello Vue!'
//     }
//   })

class Create{
    constructor(){
        this.btn = $("#js-btn");
    }
    fn(){
        this.btn.click(common.throttle(function(){
            fetch("添加新闻页面");
        },2000))
    }
}

export default Create;



