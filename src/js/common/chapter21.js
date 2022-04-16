/*******************************
* 第二十一章 新增几种重要的模式
********************************/


var bee = (function(bee){

    /* 
     * 研究案例1: 装饰者 
     * js中的装饰器在mobx中就用到了，理解不是很深刻。
     * 最近学python中的装饰器，看了一个文章才有所领悟。
     * 《Python装饰器为什么难理解？》
     * 于是写了这个js的
     */

    //装饰者的由来
    bee.caseU1 = function(){
        //一个简单的函数
        function foo(){
            console.log("111");
        }
        
        // function foo(){
        //     console.log("111");
        //     console.log("222");
        //     console.log("333");
        // }
        // 当我要把foo函数扩展成这样子的时候，就会改变原来的代码
        // 装饰者就是来解决这个问题的
    }

    //一个简单的装饰者案例
    //利用的是高阶函数
    bee.caseU1_2 = function(){
        //一个简单的函数
        function foo(){
            console.log("111");
        }

        function outer(func){
            return function(){
                func();
                //新增的逻辑
                console.log("222");
                console.log("333");
            }
        }

        //利用高阶函数包装下（就是用outer来装饰下）
        var foo = outer(foo);
        foo();
    }

    //语法糖 @
    //这个在es7中支持
    bee.caseU1_3 = function(){

        // @outer
        // function foo(){
        //     console.log("111");
        // }

        // function outer(func){
        //     return function(){
        //         func();
        //         //新增的逻辑
        //         console.log("222");
        //         console.log("333");
        //     }
        // }

        // foo();
    }



    




})(bee || {});







