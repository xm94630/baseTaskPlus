/*******************************
* 第十六章 类的继承、类、mixin模式、装饰者模式
* 这个三者其实关系还是比较紧密的，所以组合在一起处理
* 之前已经对原型继承有不少案例了，这里还是会回顾一些
********************************/

var bee = (function(bee){


    /**************************************************************
    * 第一节 类的继承 
    ***************************************************************/

    /* 
     * 研究案例1: 最简单的 类的继承
     */
    bee.caseP1 = function(){
        
        var Animal = function(age){
            this.age = age;
        }
        Animal.prototype.run = function(){
            l('run');
        }
        var Fish = function(width){
            this.width = width;
        }
        Fish.prototype = new Animal(2);  //这里是Animal实例，Fish实例中含有父级的全部属性
        Fish.prototype.constructor = Fish;
        Fish.prototype.swim = function(){l('swimming');}
        var f = new Fish(100);
        l(f);

        //此案例原型链共有节点 3+1（后一个是null）
    }


    /* 
     * 研究案例1_2: 变化
     */
    bee.caseP1_2 = function(){
        
        var Animal = function(age){
            this.age = age;
        }
        Animal.prototype.run = function(){
            l('run');
        }
        var Fish = function(width){
            this.width = width;
        }
        Fish.prototype = Animal.prototype;  //这里是Object实例，Fish实例中只含有父级“原型”上的全部属性（因此不包含age，所以这个继承有点问题）
        Fish.prototype.constructor = Fish;
        Fish.prototype.swim = function(){l('swimming');}
        var f = new Fish(100);
        l(f);

        //此案例原型链共有节点 2+1（后一个是null）
    }


    /* 
     * 研究案例1_3: 变化
     * 和1_2相比，多了mixin这部分，所以这里有age属性，并且是fish实例自己的，而不是来自父级。就是mixin的作用！
     */
    bee.caseP1_3 = function(){
        
        var Animal = function(age){
            this.age = age;
        }
        Animal.prototype.run = function(){
            l('run');
        }
        var Fish = function(width,age){
            Animal.call(this,age)           //mixin
            this.width = width;
        }
        Fish.prototype = Animal.prototype;  //这里是Object实例，Fish实例中只含有父级“原型”上的全部属性（所以不包含age，这里ages属性是通过mixin进来的）
        Fish.prototype.constructor = Fish;
        Fish.prototype.swim = function(){l('swimming');}
        var f = new Fish(100,9);
        l(f);

        //同上例
    }


    /* 
     * 研究案例1_4: 标准 类继承 
     * 使用 Object.create + mixin 官方推荐
     * 当然，这里还可以优化的是，比如，改函数如果调用的时候，忘记了new的处理。为了展示核心，其他细节都不处理了。
     */
    bee.caseP1_4 = function(){
        
        var Animal = function(age){
            this.age = age;
        }
        Animal.prototype.run = function(){
            l('run');
        }
        var Fish = function(width,age){
            Animal.call(this,age)           //mixin
            this.width = width;
        }
        Fish.prototype = Object.create(Animal.prototype);  //这样子和1_3已经非常类似了，只是在原型链上要多出 Animal实例 这个节点！
        Fish.prototype.constructor = Fish;
        Fish.prototype.swim = function(){l('swimming');}
        var f = new Fish(100,9);
        l(f);

        //此案例原型链共有节点 3+1（后一个是null）
    }


    /* 
     * 研究案例1_5: 再变化 
     */
    bee.caseP1_5 = function(){
        
        var Animal = function(age){
            this.age = age;
        }
        Animal.prototype.run = function(){
            l('run');
        }
        var Fish = function(width,age){
            Animal.call(this,age)           //mixin
            this.width = width;
        }

        //继续使用 Object.create ，这里使用了new Animal(88)
        //然而，这个模式并不好，
        //1）观察log，比1_4又多了一个原型链节点！
        //2）既然已经有mixin了，age属性可以直接给出，完全没有必要去“new Animal(88)”一下，而且这个88的参数也显得有点多余。
        Fish.prototype = Object.create(new Animal(88));  
        Fish.prototype.constructor = Fish;
        Fish.prototype.swim = function(){l('swimming');}
        var f = new Fish(100,9);
        l(f);

        //此案例原型链共有节点 4+1（后一个是null）
    }


    /* 
     * 研究案例2: Object.setPrototypeOf 改变实例原型链节点 ！
     */
    bee.caseP2 = function(){
        
        var Animal = function(age){
            this.age = age;
        }
        Animal.prototype.run = function(){
            l('run');
        }
        var Fish = function(width,age){
            Animal.call(this,age)           //mixin
            this.width = width;
        }
        Fish.prototype.swim = function(){l('swimming');}  //这个不会在log中出现！因为原型链被改变了。

        var f = new Fish(100,9);
        Object.setPrototypeOf(f,Animal.prototype);
        f.constructor = Fish;
        l(f);

        //这个例子最接近 caseP1_3 案例中的写法：
        //Fish.prototype = Animal.prototype; 
        //Fish.prototype.constructor = Fish;
        //
        //区别是：一个是在构造之前处理原型。一个是在实例之后改变原型。
        //为何它没有成为最好的继承方式呢？
        //原因就在于：
        //“f.constructor = Fish;”这个！因为如果我每次实例之后，需要调整其构造函数，这个是非常蠢的做法...
        
        //此案例原型链共有节点 2+1（后一个是null）
    }


    /* 
     * 研究案例3: 类继承 封装 【BOSS】
     * 如何将1_4案例中经典继承封装成通用函数呢？见下：
     */
    bee.caseP3 = function(){
        
        var Animal = function(age){
            this.age = age;
        }

        Animal.prototype.run = function(){
            l('run');
        }

        function extend(parentClass,options){
            var fn = function(){
                if(!(this instanceof fn)){throw new Error('missing new');}
                var args = Array.prototype.slice.call(arguments,0);
                args.unshift(parentClass.bind(this));
                options.constructor.apply(this,args);
            };
            fn.prototype = Object.create(parentClass.prototype);
            for(k in options){
                fn.prototype[k] = options[k];
            }
            fn.prototype.constructor = fn;
            return fn;
        }

        var Fish = extend(Animal,{
            //本来以为这个没有constructor会报错，但是意外的发现没有事！
            //因为，这里 options 作为为一个对象，其默认的constructor就是 Object
            //这个 options.constructor.apply(this,args); 执行的时候，等效于：
            //Object.apply(this,args);
            //这个调用的时候，会实例化一个新的对象，因为也没有赋值给别的变量，并没有什么副作用！
            //因为这个话题，我还研究了 Object.apply 的用法，非常有意思，我会在别的地方列出来。
            constructor:function(superClass,width){
                superClass(9);
                this.width = width;

                //这里案例中，可以继承上级属性和方法，但是如果实现“多态”的话，目前只有属性可以做到。
                //对于方法呢？本案例确实没有实现，可能认为下面的做法是可以的：
                /*this.run = function(){
                    superClass.prototype.run.call();
                }*/
                //其实是不对的，看之前的代码：args.unshift(parentClass.bind(this));
                //也就是说 传过来的 superClass，其实不是原先的那个，而是被 bind 包装了的。
                //所以其原型上的内容（run）也就不存在。
                //不过，如果硬是要这样子做，对代码调整下，也是可以实现的。只是有点丑陋。
                //或者把 superPrototype 也带过来？有没有更好的呢？可以思考！
                //
                //补充：这个问题，我觉得好解决
                //首先，把函数放在这里是不合适的。因为，按照这里的设计，构造器中的只有属性。
                //见swim下方的run函数
            },
            swim:function(){
                l('swimming');
            }

            //这样子是可以的~ 只是 Animal.prototype.run 这样子的写法，看上去丑丑的
            //如果，这里的extend 第二个参数是函数的形式（而不是这里的对象的形式），就可以用参数的形式把
            //Animal.prototype 传过来，这样子也是个不错的手法。
            /*,run:function(){
                Animal.prototype.run.call(this); //这里的this是实例对象f
                l('小鱼跑啊跑');
            }*/
        });

        var f = new Fish(100);

        l(f)
        //f.run()
        //l(f.age)
        //l(f.width)
        //l(f.constructor===Fish)

        //这个案例非常有趣！！是对通用继承的优秀封装！
        //唯一的缺憾就是：
        //Fish 是对 extend中的 fn的引用，也就是log出来的时候，函数的name却还是fn。
        //这个不算是问题啦~~
        //
        //接下来我们来试着用另外的方法来解决这个问题
        
        //此案例原型链共有节点 3+1（后一个是null）
    }


    /* 
     * 研究案例3_2: 上例变化 【失败】
     */
    bee.caseP3_2 = function(){
        
        /*var Animal = function(age){
            this.age = age;
        }

        Animal.prototype.run = function(){
            l('run');
        }

        Function.prototype.extend = function (parentClass,options){
            var that = this;

            l('== 这里会报错，因为this不能被改变 ==')
            this = function(){
                if(!(this instanceof that)){throw new Error('missing new');}
                var args = Array.prototype.slice.call(arguments,0);
                args.unshift(parentClass.bind(this));
                options.constructor.apply(this,args);
            };
            this.prototype = Object.create(parentClass.prototype);
            this.prototype.constructor = this;
            
            for(k in options){
                if(k!=='constructor' && typeof options[k]==='function'){
                    this.prototype[k] = options[k];
                }
            }
        }

        var Fish = function Fish(){};
        Fish.extend(Animal,{
            constructor:function(superClass,width){
                superClass(9);
                this.width = width;
            },
            swim:function(){
                l('swimming');
            }
        });

        var f = new Fish(100);

        l(f)
        l(f.age)
        l(f.width)
        l(f.constructor===Fish)*/

        //这个案例视图在Function的原型上啦扩展extend的方法，其实是不可行的。
        //是因为我不了解this不可写这个特性。
        //见下：
    }


    /* 
     * 研究案例3_3: 不可改变的this
     */
    bee.caseP3_3 = function(){
        /*function a(){
            function b(){
                function c(){
                    this=1;
                }
            }
        }*/

        //这里改变this的引用就会出错。（在this上添加属性进行扩展是可以的）
        //而且这个错误还不是运行时的，行为同语法错误，哪怕外层函数都还没有被调用，就会被报错。
        //所以这里需要把代码注释起来。
    }


    /* 
     * 研究案例4: es6 标准 类的继承
     */
    bee.caseP4 = function(){

        class Animal {
          constructor(age) {
            this.age = age;
          }  
          run() {
            l('run')
          }
        }

        class Fish extends Animal {
          constructor(age,width) {
            super(3);   //用于访问父级对象上的方法 //有待进一步研究
            this.age = age;
            this.width = width;
          } 
          swim(){
            l('swim')
          }
        }

        var f = new Fish(9,100);
        l(f);

        //比较案例3，发现log得到的结构是完全一样的。差异很细微。
    }




    /**************************************************************
    * 第二节 类、构造函数
    ***************************************************************/

    /* 
     * 研究案例5: 构造函数（类）
     * 这个案例就是最简单的构造函数。
     * 构造函数利用了原型继承的原理。注意，“原型继承”不代表就是“类的继承”。
     * 当然，类、类的继承是以原型继承为基础基础的。
     */
    bee.caseP5 = function(){

        var Animal = function(age){
            this.age = age;
        }
        Animal.prototype.run =function () {
            console.log("run");
        }
        var a = new Animal(4);
        l(a);
    }


    /* 
     * 研究案例6: 模拟es6 的class
     */
    bee.caseP6 = function(){

        function defClass(options) {
            var fn = options.constructor;
            //这里有一个妙处，就是这个options中的constructor，正好是我们想要的。
            //话句话说，这个“constructor”属性的名字起的好~
            //如果改成别的名字的，用法就没有那么巧妙了，所以，以后我的代码中也要有这样子的妙处！
            //caseP3案例中的“constructor”也是一样的道理呢
            fn.prototype = options;   
            return fn;
        }

        var Animal = defClass({
            constructor: function(age) {
                this.age = age;
            },
            run: function () {
                console.log("run");
            }
        });

        var a = new Animal(4);
        l(a)

        //生成实例的结构和上例是完全一样的。只是构造函数的名字依旧是“constructor”，上例子中是“Animal”
        //这个原因和 caseP3 是一样的。
    }

    /* 
     * 研究案例7:es6 标准 class
     */
    bee.caseP7 = function(){

        class Animal {
          constructor(age) {
            this.age = age;
          }  
          run() {
            l('run')
          }
        }

        var a = new Animal(4);
        l(a)
    }


    /* 
     * 研究案例8: 类的继承
     * 这个案例基于caseP6展开的。
     */
    bee.caseP8 = function(){

        //caseP6 中已经讲解
        function defclass(options) {
            var constructor = options.constructor;
            constructor.prototype = options;
            return constructor;
        }

        function extend(superClass, options) {
            var prototype = Object.create(superClass.prototype);
            for (var key in options) prototype[key] = options[key];
            //这里复用了defclass函数，比较巧妙
            return defclass(prototype);
        }

        var Animal = defclass({
            constructor: function (age) {
                this.age = age;
            },
            run: function () {
                l('run');
            }
        });

        var Fish = extend(Animal, {
            constructor: function (age,width) {
                //mixin 父级的属性
                //这里用法也是比较标准的做法，不过和案例 caseP3 相比，那个更加的巧妙些。
                Animal.call(this, age);
                //子类自己的属性
                this.width = width;

                
            },
            swim:function(){
                l('swim');
            }

            //可以在 run 方法中利用父级的方法
            /*,run:function(){
                Animal.prototype.run.call(this);
                l('小鱼跑啊跑');
            }*/
        });

        var f = new Fish(9,100);
        l(f);

        //这种写法，构造函数的名字，都是“constructor”，其他方面和 caseP3是一样的呢
    }


    /* 
     * 研究案例9: 类的继承【失败】【BOSS】
     * 这个案例是我最初的设计思想，现在看上去非常的蠢。
     * 不过介于失败的案例能够让我有更好的认知，也列于此
     */
    bee.caseP9 = function(){

        //父级构造函数，这个没有问题
        function Animal(age){
            this.age = age;
        }
        Animal.prototype.run = function(){
            l('run');
        }

        //这里问题大的去了。
        //1）传入Fun1希望是在其函数体内mixin父级，但是其实我们不能在传入的函数体内做处理。所以 Fun1 传入是没有用的。
        //2）如果 这个子类的函数，我们完全在 extend 内部构造（即这里的fn），那么 Fun1 自身的那些属性，方法如何配置？
        //
        //这个是我当时面临的问题。当然，这些问题都可以转换思路解决的。
        //正确的解决方法，其实之前的案例中已经有了：
        //Fun1的一些构造的信息，其实我们可以通过options配置对象传入！然后在内部组装这个函数。这是一个绝妙的思想！【BOSS】 
        function extend(Fun1,Fun2){
            var fn = function(){
                var args = Array.prototype.slice.call(arguments,0);
                Fun2.apply(this,args);
            };
            fn.prototype = Object.create(Fun2.prototype);
            fn.prototype.constructor = fn;
            fn.prototype.parent = Fun2;
            return fn;
        }

        var Fish = function(width){
            this.width = width;
        };
        Fish = extend(Fish,Animal);
        //非常有趣的是，我当时其实已经孕育出，再传入第三个、第四个参数的思想，比如这里注释中的三个参数fun。
        //只是我为何没有想到直接用一个对象呢？所以，后来我确实又进步了。
        //Fish = extend(Fish,Animal,fun); 
        var f = new Fish(100);
        l(f)
    }


    /**************************************************************
    * 第三节 mixin 模式
    ***************************************************************/

    /* 
     * 研究案例10: mixin模式1
     * 通过简单的属性复制
     */
    bee.caseP10 = function(){

        var animal = {
            age:4,
            run:function(){l('run')},
            eat:function(){l('eat')}
        }
        var fish = {
            width:100
        }
        //通过属性复制，获取了animal的全部属性
        for(var i in animal){
            fish[i] = animal[i];
        }
        //使用extend 也是一样的道理
        //$.extend(fish,animal);
        l(fish);
    }

    /* 
     * 研究案例11: mixin模式2
     * 通过在构造函数中call另外一个构造函数
     */
    bee.caseP11 = function(){

        function Animal(age){
            this.age = age
        }
        function Fish(age,width){
            Animal.call(this,age);
            this.width = width;
        }
        var f = new Fish(4,100);
        l(f);
        //这个在之前的类的继承中已经多次出现了。
    }


    /* 
     * 研究案例12: mixin模式3
     * 通过在构造函数中call另外一个构造函数
     */
    bee.caseP11 = function(){

        function Animal(age){
            this.age = age
        }
        function Fish(age,width){
            Animal.call(this,age);
            this.width = width;
        }
        var f = new Fish(4,100);
        l(f);
        //这个在之前的类的继承中已经多次出现了。
    }


    /* 
     * 研究案例12: mixin模式 
     * 上面两个例子中的mixin模式都有使用
     */
    bee.caseP12 = function(){

        var Animal = function(age){
            this.age = age;
        }
        Animal.prototype.run = function(){
            l('run');
        }
        var Fish = function(width,age){
            Animal.call(this,age);        //混入1
            this.width = width;
        }
        $.extend(Fish.prototype,Animal.prototype)   //混入2
        Fish.prototype.constructor = Fish;
        Fish.prototype.swim = function(){l('swimming');}
        var f = new Fish(100,9);
        l(f);

        //这个案例虽然是讲 mixin 模式的
        //但是同时也是 类的继承 的案例。同 caseP1_2 案例的结果是类似的。也就是说：
        //$.extend(Fish.prototype,Animal.prototype) 和
        //Fish.prototype = Animal.prototype;
        //这两个行为是类似的
    }


    /* 
     * 研究案例13: mixin模式 
     * 控制混入的内容
     */
    bee.caseP13 = function(){

        var Animal = function(age){this.age = age;}
        Animal.prototype.run = function(){l('run');}
        Animal.prototype.eat = function(){l('eat');}
        var Fish = function(width,age){
            Animal.call(this,age);        
            this.width = width;
        }

        //自定义一个augment方法来进行 mixin
        //augment的中文意思是补充、增强
        function augment(obj1,obj2){
            //如有第三个参数，说明是部分混入
            if(arguments[2]){

                for(var i=2;i<arguments.length;i++){
                    obj1[arguments[i]] = obj2[arguments[i]]
                }

            //否则就是全部混入
            }else{
                $.extend(obj1,obj2);
            }
        }

        //部分混入，这里只有混入eat这个属性
        augment(Fish.prototype,Animal.prototype,'eat') 
        //全部混入
        //augment(Fish.prototype,Animal.prototype)   
        
        Fish.prototype.swim = function(){l('swimming');}
        Fish.prototype.constructor = Fish;
        var f = new Fish(100,9);
        l(f);
    }



    /**************************************************************
    * 第四节 装饰者 模式
    ***************************************************************/

    /* 
     * 研究案例14: 最简单的装饰者
     * 给一个对象添加一个属性，就是一种装饰行为~
     * 装饰者和mixin，两者是非常类似的。
     * 依我看来，我觉得 mixin 更加适合用在对 构造函数 的处理
     * 而装饰者，就是对一个对象实例的修饰。
     */
    bee.caseP14 = function(){

        var Animal = function(age){this.age = age;}
        var animal = new Animal(4);
        //装饰
        animal.eat = function(){l('eat')}
        l(animal)
    }


    /* 
     * 研究案例15:装饰对象
     */
    bee.caseP15 = function(){

        var Fish = function(age,width){
            this.age = age;
            this.width = width;
        }
        Fish.prototype.getAge = function(){
            return this.age;
        }
        Fish.prototype.getWidth = function(){
            return this.width;
        }
        var fish = new Fish(9,100);

        //这个就是一个装饰者，会对一个对象进行装饰（新增属性、方法，修改属性和方法等等）
        function modFishAge(fish){
            var age = fish.getAge();
            fish.getAge = function(){
                return 100+age;
            }
        }

        //装饰一次
        modFishAge(fish);
        //还可以继续装饰
        modFishAge(fish);
        //装饰之后的结果
        l(fish.getAge());
    }


    /**************************************************************
    * 第五节 综合练习
    * 到目前为止，我其实已经实现了自己的“类的继承”(包含“mixin”、“装饰者”)，那么是不是还有更加优秀的实现存在呢？
    * 恰好，今天我在网上看到了一个名为 “fiber” 的继承库，它还拿很多实现进行了对比，所以我获得了很多的对比的素材
    * 官网：https://github.com/linkedin/Fiber
    * 对比：http://jsperf.com/js-inheritance-performance
    ***************************************************************/
    /* 
     * 研究案例16: fiber.js 类
     */
    bee.caseP16 = function(){

        var Animal = Fiber.extend(function() {
            return {
                init: function(age) {
                    this.age = age;

                    /*****下面的这几个，不是这个fiber的特色，因为我之前的几个案例中，也完全可以加入这部分。****/
                    //私有函数
                    //function private(){l('myRun');};
                    //特权函数（其实就是构造函数中的方法，通常的做法就是把这些函数外在原型上，比如这里的run函数）
                    //this.myRun = private;
                },
                run: function(){
                    l('run');
                }
            }
        });
        var animal = new Animal(4);
        l(animal)

        //相比 caseP8
        //这里定义类的函数，传入的是一个函数，这个函数返回一个对象。
        //其实目的都是类似的，略微觉得这里稍微麻烦了点。
        //这里的 init 的功能和我之前的实现的 constructor 是一样的功能。似乎用 constructor 会更加巧妙点。
        //init这个最后还会出现在实例上，不是很优雅的样子。
        //
        //另外，观察输出的结果，在原型链上会多一个层级
    }

    /* 
     * 研究案例17: fiber.js 类的继承
     */
    bee.caseP17 = function(){

        var Animal = Fiber.extend(function() {
            return {
                init: function(age) {
                    this.age = age;
                },
                run: function(){
                    l('run');
                }
            }
        });
        
        var Fish = Animal.extend(function(superClass) {
            return {
                init: function(width,age) {

                    //这个是调用父级的
                    superClass.init(age);
                    //可以使用call来绑定this
                    //superClass.init.call(this,age);
                    //也可以使用 Fiber.proxy 这个来完成 this 的绑定
                    //Fiber.proxy(superClass, this).init();
                    
                    this.width = width;
                },
                run:function(){
                    //调用父级的run;
                    superClass.run.call(this);
                    //自己的
                    l('小鱼跑啊跑');
                },
                swim:function(){
                    l('swim');
                }
            }
        });

        var f = new Fish(100,4);
        l(f); 
        //l(f.age)
        //f.run() 
        
        //fiber 继承就显得有点怪怪的了。用了extend之后，对方法的继承确实做的不错。
        //属性的继承是通过调用 superClass.init 这个方法。
    }


    /* 
     * 研究案例18: fiber.js 混入
     */
    bee.caseP18 = function(){

        var Animal = Fiber.extend(function() {
            return {
                init: function(age) {
                    this.age = age;
                },
                run: function(){
                    l('run');
                }
            }
        });

        var animal = new Animal(4);        
        l(animal)

        //混入
        Fiber.mixin(Animal, function(xxx) {
            return  {
                run: function() {
                    //l(animal.__proto__.__proto__==xxx);  ==>true
                    l('小鱼跑啊跑！');
                }
            }
        });

        animal.run();

        //这里 mixin 这个单独的方法还是不错的，我之前的混入都是内部的实现，这里单独在提供一个的思路很好。
        //这样子可以继承多个了（多重继承）。
        //另外还有值得注意的是，实例化在前，mixin在后，可见，内部的实现，其实是修改了原型中的内容。
        //
        //最后 这里还传入了一个xxx的参数，我测试了下，正好是 animal.__proto__.__proto__
        //这个传进来，是不是意义很大呢？
    }


    /* 
     * 研究案例19: fiber.js 装饰者
     */
    bee.caseP19 = function(){

        function AnimalWithPowerRun(base) {
            return {
                run: function() {
                    l('run <=== 这个是被装饰的功能')
                }
            }
        }

        var Animal = Fiber.extend(function() {
            return {
                init: function(age) {
                    this.age = age;
                }
            }
        });
        var animal = new Animal(4);        

        Fiber.decorate(animal, AnimalWithPowerRun);

        l(animal)
        animal.run();
    }










	return bee;
})(bee || {});



/*var Fish = function(){
    this.age = 123;
}
Fish.prototype = new Fish();
var f = new Fish();
l(f)*/



















