        function common(){}
        common._version = 0.1;
        common.throttle = function(fn,wait){
            var timer;
            return function (...args){
                if(!timer){
                    timer = setTimeout(()=>timer = null,wait);
                    //方便改变this指向，改变更加灵活
                    return fn.apply(this,args);
                }
            }
        }
