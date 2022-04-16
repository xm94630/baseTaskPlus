/*******************************
* 第十八章 事件
* 和十七章是姐妹篇，为何怎么说？
* 因为事件总是和异步的有很大的关联呢
********************************/

var bee = (function(bee){


    /**************************************************************
    * 第一节 浏览器的默认事件
    ***************************************************************/

    /* 
     * 研究案例1: 最简单的事件
     * onload的事件是由浏览器自己触发的
     */
    bee.caseR1 = function(){
        window.onload = function(){
            l('页面加载完毕');
        }
    }


    /* 
     * 研究案例2:点击事件
     * 点击事件的触发是由用户手动触发的
     */
    bee.caseR2 = function(){
        window.onload = function(){
            var ele = document.getElementById('myBtn');
            ele.onclick = fun;
            function fun(){
                l(this==ele)
            }
        }

        //这里的问题是this，指代的是谁？
        //这个结论我们很久之前就有了，就是看这个函数被如何使用的：
        //我们看 fun 赋给了 ele.onclick，事件的触发，相当ele.onclick()，所以是方法的形式进行调用的。
        //那么 this 就是这个对象——ele。
    }


    /* 
     * 研究案例3:点击事件 变化
     */
    bee.caseR3 = function(){
        window.onload = function(){
            var ele = document.getElementById('myBtn');
            ele.onclick = function(){
                fun();

                //可以这样子修正fun中的this
                //fun.call(this);
            };
            function fun(){
                l(this==ele)
            }
        }

        //这里的问题是this，指代的是谁？
        //这个时候，函数是被直接调用的，this就是全局对象~
    }


    /* 
     * 研究案例4:一个元素中绑定多个处理事件 [错误案例]
     * onclick 是属性的形式，给他多次赋值的话，就会被覆盖。
     */
    bee.caseR4 = function(){

        window.onload = function() {
            var ele = document.getElementById('myBtn');
            ele.onclick = fun1;
            ele.onclick = fun2;
            function fun1(){
                l(111)
            }
            function fun2(){
                l(222)
            }
        };

        //这样子并不能绑定多个处理函数！其实是，后者覆盖了全部。
    }


    /* 
     * 研究案例5:一个元素中绑定多个处理事件 [正确案例]
     * 上例要正确的运行，只能这样子处理。
     */
    bee.caseR5 = function(){

        window.onload = function() {
            
            var ele = document.getElementById('myBtn');
            ele.onclick = function(){
                fun1.call(this);
                fun2.call(this);
            }
            function fun1(){
                l(111)
                l(this)
            }
            function fun2(){
                l(222)
                l(this)
            }
        }

        //这样子写的话，总归不是很美观，addEventListener 可以来优化
    }


    /* 
     * 研究案例6: ele.addEventListener VS ele.onclick  
     */
    bee.caseR6 = function(){

        window.onload = function() {
            var ele = document.getElementById('myBtn');
            ele.addEventListener('click',fun1);
            ele.addEventListener('click',fun2);
            function fun1(){
                l(111)
                l(this)
            }
            function fun2(){
                l(222)
                l(this)
            }
        }

        //addEventListener 就高级多了，允许绑定多个事件！
        //它属于“分布式事件”的处理方式。说白了，就是发布订阅模式。（发布订阅模式也可能是“分布式事件”的处理方式之一）
        //在发布订阅模式中，多个订阅者可以绑定同一个“信道”，比如这里的“click”。
        //
        //这里的是this是谁呢？关键看 fun1 函数在 addEventListener 中如何被使用的。
        //addEventListener是系统默认的函数，不方便看源码了。不过从结果中，我们就可以知道，它被绑定到ele上了 ~
    }


    /* 
     * 研究案例7: ele.addEventListener VS ele.onclick  
     * 这个案例说明，两者都可以绑定行为，而且他们之前不会相互干涉和覆盖。
     */
    bee.caseR7 = function(){

        window.onload = function() {
            var ele = document.getElementById('myBtn');
            ele.addEventListener('click',fun1);
            ele.addEventListener('click',fun1);
            ele.addEventListener('click',fun2);
            function fun1(){
                l(111)
                l(this)
            }
            function fun2(){
                l(222)
                l(this)
            }
            ele.onclick = function(){
                l(333)
                l(this)
            }
        }

        //那么原理是什么呢？
        //我认为，addEventListener 和 onclick 都是纯js中 独立的事件处理器系统。
        //当浏览器中有一个事件产生的时候，都会自动去调度这些处理器。
    }


    /* 
     * 研究案例8: addEventListener 和 onclick 原理（模拟）
     */
    bee.caseR8 = function(){

        //事件化对象
        var ele = {
            onclick : function(){},
            addEventListener : function(name,fun){
                if(!this.handler[name]){
                    this.handler[name] = [];
                }
                this.handler[name].push(fun);
            },
            handler:{},
            emit:function(name){
                this.handler[name].forEach(function(fn){
                    fn();
                }); 
            }
        };

        //事件绑定1
        ele.onclick = function(e){l('onclick!');}
        //事件绑定2
        ele.addEventListener('click',function(){l('addEventListener_1!')})
        ele.addEventListener('click',function(){l('addEventListener_2!')})

        //事件触发
        //这个我们是手动触发的。对于浏览器的事件而言，浏览器在事件发生的时候，就会自动去调用。
        l('==>');
        window.setTimeout(function(){
            ele.onclick();
            ele.emit('click');
        },1000);

        //这个只是一个实现机制的模拟，和真实实现肯定是不一样的，但是也能说明其原理。
        //事件绑定的两种方法中，第一种是直接改变了方法的内容，第二种是调用其方法。
        //从调用角度看，第一种对应的是“直接调用”，所以多次对 onclick 进行赋值的时候，以最后一次为准。
        //第二种对应的是“调用了其他的函数”，比如这里的emit。
        //
        //我也可以改变 addEventListener 这个函数！ 但是对用用户来说，它的实现就是个黑盒子。你不知道它内部的发布订阅系统的实现逻辑。
        //比如把变量存到那个地方。
    }

    /* 
     * 研究案例8: 这个是事件触发顺序，一定要记住
     */
    bee.caseR8_1 = function(){
        $(function(){
            $('#myBtn').hover(function(){
                //移入移出会被触发一次
                alert(0)
            })
            $('#myBtn').on('mouseover',function(){
                alert(1)
            });
            $('#myBtn').on('mouseenter',function(){
                alert(2)
            });
        })
    }



    /**************************************************************
    * 第二节 事件化对象（原理：发布订阅模式）
    * 结合浏览器的默认事件，使用发布订阅模式可以构建更加优雅的事件处理系统。
    * 这里要知道几个概念
    * 1）事件化对象：继承了“发布订阅模式的接口”的对象
    * 2）module：一个储存数据的对象，在其内容发生改变的时候能够发布事件，这样子的对象
    * 就是module。module是特殊的“事件化对象”。
    * 3）事件化集合（数组），由“事件化对象”集合组成的事件化对象。
    * 4）事件化模型，用“事件化”的思想的一种架构。
    * 5) MVC： module、view、control 构成了MVC。其中 module 更新的时候，发布事件，
    * 通知view发生改变。MCV也是事件化模型的一种
    * 6）事件循环：如果一个对象的事件，触发了一些列的事件，最后又导致了自身的对象的改变。
    * 这就是“事件循环”，如果这个循环是同步的，那就和死循环无异。但是我们有时候又需要这种特性，
    * 所以如何来解决这对矛盾，是一个可以研究的课题。
    ***************************************************************/

    /* 
     * 研究案例9: 【BOSS】解决之前一直困扰我的一个重要问题！
     * 这里将发布订阅模式和js的事件系统（其中addEventListener也是一个发布订阅模式）进行了结合。
     * 发布订阅模式，其实是很简单的，我很久之前就已经明白这个道理。
     * 当时，唯独让我困惑的是 jquery 的 triger:
     * $ele.triger('click');
     * 我一直想，为何能手动的触发click的事件呢？我一直怀疑，但是 triger 确实做到了。另一方面，
     * 点击事件，确实也能触发回调。
     *
     * 到底是怎么回事呢？
     *
     * 如今，我才知道了原理：其实针对于浏览器的那种默认的事件（如click）,事件分发系统做了两手的准备，
     * 一方面把回调放到 handler 中存储，另外用原生的 addEventListener 进行了代理！！
     * 所以，emit 可以手动触发。而鼠标的点击事件，就可以触发addEventListener中的回调！
     */
    bee.caseR9 = function(){

        //用发布订阅者模式实现的 事件分发系统
        //当对象继承了它，就成为“事件化对象”
        //这里只是简单的实现（事件取消啥的都没有实现，够说明就行）
        var Emiter = {
            on : function(name,fun){
                if(!this.handler[name]){
                    this.handler[name] = [];
                }
                this.handler[name].push(fun);

                //重点原理：
                //如果是事件的名字是浏览器中的默认的事件，比如这里的click，需要使用默认的 addEventListener
                if(name="click"){
                    //相当于用 addEventListener 来代理 on：
                    this.addEventListener(name,fun);
                }
            },
            handler:{},
            emit:function(name){
                this.handler[name].forEach(function(fn){
                    fn();
                }); 
            }
        };

        window.onload = function() {
            var ele = document.getElementById('myBtn');
            //ele成为事件化对象
            ele = $.extend(ele,Emiter);
            ele.on('click',function(){l('1')})
            ele.on('click',function(){l('2')})
            ele.emit('click')
        }
    }

    
    /* 
     * 研究案例10: 一个简单的 module
     */
    bee.caseR10 = function(){

        var Emiter = {
            on : function(name,fun){
                if(!this.handler[name]){
                    this.handler[name] = [];
                }
                this.handler[name].push(fun);
            },
            handler:{},
            emit:function(name){
                this.handler[name] && this.handler[name].forEach(function(fn){
                    fn();
                }); 
            }
        };

        function Module(data){
            var module = {
                data:data,
                set:function(key,v){
                    var oldValue = this.data[key]
                    if(oldValue!==v){
                        this.emit('change');
                        this.data[key] = v;
                    }
                }
            };
            module = $.extend(module,Emiter);
            return module;
        }

        var m = Module({a:123});
        m.on('change',function(){
            l('被改变啦~');
        })

        //module数据没有改变，不触发change事件
        //m.set('a',123);
        
        //module数据改变，触发chang事件
        m.set('a',100);
        m.set('a',101);
    }


    /* 
     * 研究案例10: 一个简单的 集合
     */
    bee.caseR10 = function(){

        //这里将之前案例中的Emiter的实现，由简单的对象改成了工厂
        //我的之前的章节中也讲了工厂。他能提供独立的一个新的实例。
        var Emiter = {
            create:function(){
                return {
                    on : function(name,fun){
                        if(!this.handler[name]){
                            this.handler[name] = [];
                        }
                        this.handler[name].push(fun);
                    },
                    handler:{},
                    emit:function(name){
                        this.handler[name] && this.handler[name].forEach(function(fn){
                            fn();
                        }); 
                    }
                }
            }
        };

        function Module(data){
            var module = {
                parent:null,  //新增
                data:data,
                set:function(key,v){
                    var oldValue = this.data[key]
                    if(oldValue!==v){
                        this.emit('change');
                        this.parent && this.parent.emit('change'); //如果有父级，则通知父级（即集合）
                        this.data[key] = v;
                    }
                }
            };
            module = $.extend(module,Emiter.create());
            return module;
        }

        function Collection(data){
            var collection = {
                data:data
            };
            //为集合中每一个module添加对集合本身的引用
            collection.data.forEach(function(m){
                m.parent = collection;
            })
            collection = $.extend(collection,Emiter.create());
            return collection;
        }

        var m1    = Module({a:111});
        var collection = Collection([m1]);
        collection.on('change',function(){
            l('集合发生了改变！');
        });
        m1.set('a',100);


        //这个只是最最简单的一个演示，可以优化的东西还有很多：
        //1）事件回调中，不是简单的一个回调，可以新增有用的参数，比如，对moudle本身的引用，改变的是哪个键值。
        //2）能否有嵌套的集合
        //3）如何规避“事件循环”的负面影响？这个也是需要思考的。
        //4) 有命名空间的事件名称
        //5) ...
        
        //完成上面这些，你就可以写一个库了
    }


    /* 
     * 研究案例10: 事件循环 
     * 当事件循环是同步的时候，就是一个死循环。
     * 不过，为了避免上述的噩耗，我这里用setTimeout走了异步，
     * 这样子就避免了死循环。
     */
    bee.caseR10 = function(){

        //这里将之前案例中的Emiter的实现，由简单的对象改成了工厂
        //我的之前的章节中也讲了工厂。他能提供独立的一个新的实例。
        var Emiter = {
            create:function(){
                return {
                    on : function(name,fun){
                        if(!this.handler[name]){
                            this.handler[name] = [];
                        }
                        this.handler[name].push(fun);
                    },
                    handler:{},
                    emit:function(name){
                        this.handler[name] && this.handler[name].forEach(function(fn){
                            fn();
                        }); 
                    }
                }
            }
        };

        //生成一个事件化对象
        var eModule = $.extend({},Emiter.create());

        //绑定事件
        eModule.on('xxx',function(){
            l('触发一次');
            setTimeout(function(){

                //事件的回调中再次触发了事件，这样子就是“事件的循环”。
                eModule.emit('xxx');
            },1000)
        });

        //启动
        eModule.emit('xxx');

        //结论，同步的事件循环是一定要避免的，这个是事件循环的一个噩耗。
        //异步的，就避免了这样子的噩耗。
        //由此可见，处理成异步的，是解决“事件循环”负面影响的一个重要方法呢？
        //当然还有更多的方法，需要思考的。
        //这里为了展示，仅仅列出一种。
    }








})(bee || {});







