/*******************************
* 第十七章 异步
********************************/

var bee = (function(bee){


    /**************************************************************
    * 第1节
    ***************************************************************/

    /*
     * 研究案例1: 异步函数 【BOSS】
     *
     * 首先，一定要搞清楚5个的基础概念：
     * 1）异步函数，即能产生异步行为的函数本身。本案例中，setTimeout就是异步函数
     * 2）回调函数，作为参数传给“异步函数”的函数（或者赋值给“document.onready”的函数）。本例中，myCallback就是回调函数。
     * 3）事件处理器，已经在“事件队列”中的“回调函数”
     * 4）事件，促发“事件处理器”被调用的那个因素，比如：延时结束事件、dom加载完毕事件等等。
     * 5）列队，即事件列队。由一堆“事件处理器”组成。（有些是已经有顺序的，比如延时的，有的是暂时没有顺序，比如点击事件处理器们）
     * 5）事件循环，用于描述描述“列队”的工作方式，非常类似循环的结构。
     *
     * 其次，要明白 js（异步）事件模型。说白了，就是js事件是如何工作的，工作原理如下：
     * 每当使用异步函数的时候，其回调函数就成为事件列队中一员，即事件处理器。当某的事件触发的时候，对应的事件处理器就会被调用。
     * 它具有如下特点：
     * 1）延时性：事件处理器一定是将来运行的，哪怕是0毫秒之后！
     * 2）对应性：使用异步函数，就有其对应的“事件处理器”加入列队。
     * 3）阻塞性：“事件处理器”只有在当前运行代码结束之后才能进行，否则，处于阻塞状态。
     *
     * 最后，解决一个困扰我多年的问题：
     * js中同时提及异步和阻塞，异步的怎么会被阻塞，而阻塞的又如何还能称得上异步，到底哪里出问题了？？
     * 解答，正确的答案是，异步的js，即阻塞又不阻塞。为何怎么说呢的？我们来看一个场景：
     * 我使用了一个异步函数setTimeout，这是个异步的行为，“不会阻塞”异步之后的其他代码的执行。这个时候，setTimeout的回调函数进入队列。
     * 等待“延时结束”事件的到来。假如，延时事件来的特别快（0毫秒之后就被触发），这个回调原本就会被马上执行，但是我们说了，js是一个单线程的，
     * 你要执行你这回调函数的时候，怎么着也得保证目前的线程上是空闲的，如果这个时候还有代码在跑的话，那么就会“被阻塞”。
     * 再举一个例子，node中的下面用法：
     * fs.readFile('/etc/passwd', (err, data) => {});
     * 这个是异步的，读取文件的事情其实交给别人去做了，所以，“不会阻塞”自己的代码。读取完毕文件之后，总会有执行回调的那个时候，这个时候，如果js
     * 自身线程中的代码都没有执行完毕，该回调就会被“阻塞”。
     * 由此可见，js中的“阻塞“仅仅发生在，回调被触发的时候!! 这样子的阻塞的发生的机会其实是很低的。因为大多数的时候，js线程还是处于空闲的状态呢~
     * node服务器就得益于这样子的“事件驱动”的优势。
     *
     * 其实在html中，是可以使用多线程的，只是这些线程还是辅助于js的主线程，为什么这么说呢，在html5中的其他线程其实是有很多的限制的，比如说
     * 他不能操作DOM，否则就很容易乱套的。
     *
     */
    bee.caseQ1 = function(){

        window.setTimeout(function myCallback(){
            l('1秒之后出现');
        },1000);
    }


    /*
     * 研究案例2: 阻塞？不阻塞？
     */
    bee.caseQ2 = function(){

        var start = new Date;
        window.setTimeout(function(){
            var time = new Date - start;
            l('这个本来是300毫秒被执行的异步回调，实际上花了 '+time+ '毫秒，被阻塞了！')
        },300);
        var time2 = new Date - start;
        l('耗时：'+time2+',我是线程中同步代码，异步的代码并不会阻塞我！');
        while(new Date - start<500){}

        //这个例子很好的说明了，其实异步的代码中，既可能发生阻塞，也有可能不阻塞。
        //不阻塞的行为发生在异步函数的使用
        //阻塞发生在回调函数触发的时候
        //了解这个对“异步”的掌握很是关键。
    }


    /*
     * 研究案例3: 阻塞之后，谁先触发
     */
    bee.caseQ3 = function(){

        var start = new Date;
        window.setTimeout(function(){
            var time = new Date - start;
            l('这个本来是400毫秒被执行的异步回调，实际上花了 '+time+ '毫秒，被阻塞了！')
        },400);
        window.setTimeout(function(){
            var time = new Date - start;
            l('这个本来是300毫秒被执行的异步回调，实际上花了 '+time+ '毫秒，被阻塞了！')
        },300);
        var time2 = new Date - start;
        l('耗时：'+time2+',我是线程中同步代码，异步的代码并不会阻塞我！');
        while(new Date - start<500){}

        //这个例子是上面的变体
        //但是能可以说明一个非常重要的道理。
        //这里对于两个异步函数 setTimeout 而言，都会被阻塞的。这个时候，对于延时300毫秒也好、400毫秒也好，都是过了原本该触发的时间。
        //那么到底哪个先触发呢？是代码靠前的先触发，还是别的？
        //答案是，看参数中的那个数值，谁小就先触发
    }


    /*
     * 研究案例4: 神奇！既有同步属性，又有异步属性的DOM操作
     * DOM的操作，并不是异步的，而是即时生效的
     * 但是，它在浏览器界面上的渲染，确实被延时了，为什么？这个机制主要是为了“渲染状态一致的DOM”
     */
    bee.caseQ4 = function(){

        $(function(){
            var div  = document.createElement('div');
            var content = document.createTextNode('你好');
            div.append(content);
            document.body.append(div);
            div.style.background = 'red';

            var start = new Date;
            //添加下面的语句会阻塞UI的渲染(延迟2秒)
            while(new Date - start<2000){}
        });
    }

    /*
     * 研究案例5: 嵌套异步（延时函数）的触发顺序（1）
     * 这个比较简单
     */
    bee.caseQ5 = function(){
        window.setTimeout(function(){      //a
            l(1);
            window.setTimeout(function(){  //c
                l(3);
            },0);
        },0);
        window.setTimeout(function(){      //b
            l(2);
            window.setTimeout(function(){  //d
                l(4);
            },0);
        },0);
        //先后输出1、2、3、4
    }


    /*
     * 研究案例6: 嵌套异步（延时函数）的触发顺序（2）
     */
    bee.caseQ6 = function(){
        window.setTimeout(function(){      //a
            l(1);
            window.setTimeout(function(){  //c
                l(3);
            },1000);
        },0);
        window.setTimeout(function(){      //b
            l(2);
            window.setTimeout(function(){  //d
                l(4);
            },0);
        },0);

        //和上例相比，c中的延时变成一秒，这个时候，执行的顺序如何呢？
        //其实就不好说了。
        //这个就靠考虑，代码本身执行的时间了。
        //如果本身运行很快（接近0），顺序是1、2、4、3
        //如果很耗时，也许，这个1毫秒的延时已经进入触发状态，比d先触发。是1、2、3、4
        //
        //如何c中的1毫秒改成1000毫秒，目前这种情况下，代码本身执行的时间，一定是不会超过1000的
        //所以结果必然是：1、2、4、3
    }


    /*
     * 研究案例7: 嵌套异步（延时函数）的触发顺序（3）
     */
    bee.caseQ7 = function(){
        window.setTimeout(function(){      //a
            l(1);
            window.setTimeout(function(){  //c
                l(3);
            },1000);

            //用于阻塞的循环
            var s = new Date();
            while(new Date - s<1100){}
        },0);
        window.setTimeout(function(){      //b
            l(2);
            window.setTimeout(function(){  //d
                l(4);
            },0);
        },0);

        //和上例相比，增加了阻塞部分，时间是1100毫秒，这样子c的触发依然会比d早。
        //因为阻塞的作用“2”的输出也会被延后。
    }


    /*
     * 研究案例8: 何时称一个函数为异步的呢？
     * 异步函数必然能通过以下测试
     */
    bee.caseQ8 = function(){
        //异步函数
        function fun (fn){
            window.setTimeout(function(){
                fn();
            },0);
        }
        //同步函数
        /*function fun (fn){
            fn();
        }*/

        //测试
        var a = 1;
        fun(function(){
            l(a==2);
        });
        a = 2;

        //能通过这个测试的就是异步函数，否则就是同步函数。
        //通常情况下我们的项目中没有这样子的测试案例让我们一目了然的知道，是不是异步函数。
        //所以我们只有看看fun函数的源代码了。
    }


    /*
     * 研究案例9: 间或异步函数
     * 最简单的展示
     */
    bee.caseQ9 = function(){

        function fun(a,fn){
            if(a==1){
                window.setTimeout(function(){
                    fn();
                },0)
            }else{
                fn();
            }
        }

        //异步
        fun(1,function(){l(111)});
        //同步
        fun(9,function(){l(222)});

        //间或异步函数，就是有的时候表现为异步函数，有的时候表现为同步函数。
        //取决于一些参数的变化啥的。
    }



    /*
     * 研究案例10: 异步递归（反模式）
     */
    bee.caseQ10 = function(){

        var flag = 0,
            n    = 0;

        //模拟一个状态的改变
        window.setTimeout(function(){
            flag = 1;
        },3000);

        //异步递归函数
        function recursionFun(){
            if(flag!==1){
                l('递归循环发生'+(++n)+'次')
                window.setTimeout(function(){
                    recursionFun();
                },1000);
            }else{
                l('递归循环结束！')
            }
        }
        recursionFun();

        //这里递归函数，在等待（使用延时函数）一个异步状态的改变。
        //延时函数的时间颗粒越小，得到改变信息更新的越精准。到时间设定为0的时候，状态的改变会马上得到通知。
        //但是缺点也是非常明显的！这样子消耗的内存资源太大了。所以这个是一种反模式。
    }


    /*
     * 研究案例10_2: “惰性”操作
     * 实现类似的功能，如何替换上面的异步递归的反模式
     * 答案就是“惰性”操作。
     * “惰性”的概念，我们也不是一次出现了！
     * 它的另外的作用，就是这里的应用场合。
     */
    bee.caseQ10_2 = function(){

        var flag = 0,
            n    = 0,
            cbs  = [];

        //模拟一个状态的改变
        window.setTimeout(function(){
            flag = 1;

            //这个模拟的是，在flag状态改变之后，再次调用recursionFun
            //这个时候，会把之前那些处理“惰性”状态的回调一次性全部都处理了。
            recursionFun();
        },3000);

        //异步递归函数
        function recursionFun(){
            if(flag!==1){
                ++n;
                var cb = (function(n){
                    return function(){
                        l('递归循环发生'+n+'次')
                    }
                })(n);
                cbs.push(cb);
            }else{
                cbs.forEach(function(v,i){
                    v();
                })
                l('递归循环结束！')
            }
        }

        //这些调用的时候，flag的状态还没有被改变。
        //但是即将处理的回调将被存到一个数组中。（这就是惰性的原理）
        recursionFun();
        recursionFun();
        recursionFun();
    }


    /*
     * 研究案例11: 异步回调中使用返回值
     */
    bee.caseQ11 = function(){

        function asyncFun(cb){

            //这个是异步的，在回调中使用反值fish，没有问题
            window.setTimeout(cb,10);
            //这个是同步的，在回调中使用反值fish，就不行了，因为还没有return呢！
            //cb();

            return {
                run:function(){
                    l('run!');
                }
            }
        }

        var fish = asyncFun(function(){
            fish.run();
        });

        //本例中，asyncFun中有 异步的行为，也有同步的返值行为。
        //在异步函数的回调中使用返值，是没有什么问题的。为什么呢？
        //因为同步行为比异步而言，总是要先发生的。所以，在异步回调中使用fish，没有啥问题！
        //但是！但是！
        //但是前提要件是 asyncFun 是一个完全的异步函数。
        //因为有的时候，我们是会使用缓存技术的，也就是如果已经有过一次异步之后，之后就直接回使用缓存值。
        //这个时候 asyncFun 就不是一个完全的异步函数了，而是一个间或异步函数（caseQ9 中提到了）
        //读取缓存是一个同步的行为，这个时候回调就会出现问题！解决方案就是：
        //即使是读取缓存这样子的同步行为，我也强制让他成为异步！
        //window.setTimeout(function(){
        //    cb();
        //},0);
    }





    /*l('===>')

    var chache = {}

    function xxx(title,cb){
        if(title in chache){
            l('同步')
            chache[title]();
        }else{
            chache[title] = cb;
            setTimeout(function(){
                l('异步')
                cb();
            },1000);
        }
    }

    xxx('a',function(){
        l('第一次调用');
    })
    xxx('a',function(){
        l(123);
    })*/


    /*
     * 研究案例12: 异步函数的嵌套
     */
    bee.caseQ12 = function(){

        //a
        setTimeout(function(){
            l(1)
            //c
            setTimeout(function(){
                l(3)
            },1000);
        },1000);
        //b
        setTimeout(function(){
            l(2)
        },2000);

        //这里输出的顺序一定是 1、2、3
        //异步执行的原理是，先执行现有的代码，然后是从事件队列中获取下一个执行的内容。
        //这里a、b会依次执行，然后将两个回调放置到队列中。一个是在1000毫秒之后触发（e），一个是2000毫秒之后触发(f)。
        //1000毫秒之后，第一个回调(e)触发，然后执行c处的异步函数，又在队列中添加一个回调函数(g)，是1000之后执行。
        //这里的关键就是，f、g哪个先执行的问题（都会在2000毫秒之后触发）。
        //其实f必然是先行的，主要是代码本身执行也是需要时间的，也就是说，在执行的c的时候，其实已经有几毫秒的时间过去了！
        //所以对已中f比g要稍微的靠前。
    }

    /*
     * 研究案例12_2: 变化
     * 本案例可以说明，异步函数如果没有得到很好的维护，其实执行的顺序就会变得不可确定！
     */
    bee.caseQ12_2 = function(){


        setTimeout(function(){
            alert(1)
            l(1)
            console.log(1)
            alert(2)
            setTimeout(function(){
                l(3)
            },995); //这里做了修改
        },1000);
        setTimeout(function(){
            l(2)
        },2000);


        //这个案例在chrome中测试的答案是不确定的，可能是1、2、3，也可能是1、3、2
        //e、f的在事件队列中的顺序不确定引起的。
        //关键看代码执行所花的时间和 （1000-995）毫秒的关系。
        //另外也说明了，代码执行的时间是在 5 毫秒左右变化。
    }











    return bee;
})(bee || {});




























