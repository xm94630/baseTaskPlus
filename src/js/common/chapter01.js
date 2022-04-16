/*******************************
* 第一章 
* this、闭包、apply、call、bind等
********************************/

var bee = (function(bee){

	/* 
	 * 研究案例1:call、this
	 * 这里第3、4、5中情况是一致的
	 * 言外之意就是3、4中，call方法是无效的，为什么呢？因为call仅影响的是函数中的this
	 * 3、4中，call前面那坨东西中已经不存在this了。
	 * 【说明】
	 * 该案例灵感来自于《函数式变编程》P50页中的_.bind
	 * 那个时候，我以为_.bind函数改造了原来的函数，其实是没有的，只是消耗(书中说是锁定，是一样的意思)了this
	 */
	bee.case01 = function(){
		var obj1 = {a:111}
		var obj2 = {a:222}
		function fun (){return this;}
		function bind (myFun,obj){
			return function(){
				return myFun.call(obj)
			}
		}

	    var r1 = fun();
		var r2 = fun.call(obj1);
		var r3 = (function(){
			return fun.call(obj2);
		}).call(obj1);
		var r4 = bind(fun,obj2).call(obj1);
		var r5 = bind(fun,obj2)();

		l('第1种情况中，this指代的是：');
		l(r1);
		l('第2种情况中，this指代的是：');
		l(r2);
		l('第3种情况中，this指代的是：');
		l(r3);
		l('第4种情况中，this指代的是：');
		l(r4);
		l('第5种情况中，this指代的是：');
		l(r5);
	}


	/* 
	 * 研究案例2:this
	 * 这中情况只需要用一句话来总结就行了:
	 * 如果函数是以方法调用的，则函数中的this指代那个对象，否则就是全局变量，一般是window对象
	 * r2中的那个匿名函数不是以方法调用的，所以this指代的就会window对象
	 */
	bee.case02 = function(){

		var obj1 = {
			fun: function(){
				return this;
			}
		}
		var obj2 = {
			fun: function(){
				return (function(){return this;})();
			}
		}
		var r1 = obj1.fun();
		var r2 = obj2.fun();
		l(r1)
		l(r2)

	}


	/* 
	 * 研究案例3:闭包
	 * 因为有闭包的存在，不能简单地通过log两个函数来比较是否功能相同
	 * 下面的fun1和fun3通过log、tostring处理后显示完全一样
	 * 然而调用的时候结果完全不同！
	 */
	bee.case03 = function(){

		var n = 123;
		var fun1 = function(){return n;};
		var fun2 = function(){
			var n = 222;
			return function(){return n;};
		}
		var fun3 = fun2();

		l(fun1);
		l(fun3);
		l(fun1());
		l(fun3());
		l(fun1.toString());
		l(fun3.toString());
		l(fun1.toString()===fun3.toString());

	}


	/* 
	 * 研究案例4:函数对象
	 * 本案例中，可以看到函数对象的很多特性
	 * 1）直接log出函数，基本上是它的toString状态(不对，log出函数就是函数、log对象就是对象)
	 * 2）只有作为函数方法的时候log出来，才把它显示为对象，所以要查看全局函数，可以log(window),然后找到该方法。
	 * 3）arguments、caller、length、name为4个函数对象属性，并不被for循环输出。
	 * 4）自己为函数对象添加的属性，会在for in循环中输出
	 * 5）可以使用函数对象继承自原型的方法，如：toString
	 */
	bee.case04 = function(){

		var fun1 = function(){}
		var obj  = {
			fun2:function(){}
		}
		l(fun1)
		l(obj)

		l(obj.fun2.arguments)
		l(obj.fun2.caller)
		l(obj.fun2.length)
		l(obj.fun2.name)
		l(obj.fun2.lalala)

		obj.fun2.xxx=123;
		l('获取函数对象中的属性:')
		for(var key in obj.fun2){
			l(key)
		}
		l(obj.fun2.toString)
	}


	/* 
	 * 研究案例5:_.bindAll
	 * 本案例研究的是《函数式编程》P50页中提到的函数_.bindAll
	 * 对比上下两种情况，下面的绑定生了效
	 * _.bindAll函数调用的时候并没有返回一个新的函数，可见一定是直接修改了第一个参数(这里指的是obj2，具体的说就是obj2.fun这个函数)
	 * 直接输出两者fun函数发现是一样的，至少在表面上是的
	 * 要真正的观察fun的不同，必须输出外层的对象，发现func函数对象确实被改动了
	 * fun函数对象的name属性变成了“bound fun”，这个带空格的写法很奇特，因为函数的名字不可能带空格
	 * fun函数对象还有[[bound fun]]（最近一次看，变成了[[TargetFunction]]）、[[BoundThis]]、[[BoundArgs]]这样的写法
	 * 百度了下发现和原生的bind实现有关系，其中诡异的写法也就原生的能做到了
	 * 可见_.bindAll函数可以用bind来实现封装的
	 * 
	 * 20191205 对bind解释比较好的文章：
	 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
	 */
	bee.case05 = function(){

		var obj1 = {
			appName:'大鱼一条',
			fun:function(){return this.appName;}
		}
		var a = obj1.fun;
		l(a())


		var obj2 = {
			appName:'大鱼一条',
			fun:function (){return this.appName;}
		}
		_.bindAll(obj2,'fun')
		var b = obj2.fun;
		l(b())

		l(obj1.fun);
		l(obj2.fun);

		l(obj1);
		l(obj2);
	}


	/* 
	 * 研究案例6:原生bind
	 * 没有bind之前，call可以改变this
	 * bind之后，call就无效了，和直接调用是一样的
	 * 案例1中也有call无效的概念，也许bing实现的原理就是案例1中所言的道理
	 */
	bee.case06 = function(){
		var obj={
			myName:'111',
			xxx:function(){return this.myName;}
		};
		var obj2={myName:'222'};

		l(obj.xxx.call(obj2))
		obj.xxx = obj.xxx.bind(obj);
		l(obj.xxx.call(obj2));
		l(obj.xxx());
	}


	/* 
	 * 研究案例7:原生bind
	 * 看看bind的第1个参数之后的其他参数，作为新函数默认传入的参数
	 * 于是真正函数调用的唯一参数“cc”其实是第三个参数了
	 * 
	 * 20191205补充：
	 * 1）bind一方面会返回一个函数
	 * 2）一方面会指定this指向
	 * 3）还有一个重要的作用，就是预先设置好参数，就是本案例的作用。
	 */
	bee.case07 = function(){
		var func = function( a,b,c ) {
		    return a+b+c
		}
		myFunc = func.bind( null, 'aa','bb' );
		console.log( myFunc('cc') );
	}

	/* 
	 * 研究案例7_1:案例7和本例的 partical 功能非常的接近
	 * 这里案例是我后来添加的，这个partical也是我自己凭借记忆写的
	 * 先前也实现过一个名为 partical1 的函数，这个是书上标准的写法
	 * 和我的区别在于，它提前消耗了一个函数和一个参数，然后最后一次补全
	 * 而我的第一次消耗的是一个需要被包装的函数，第二次是消耗的任意参数，第三次消耗任意参数，当然受到原函数的作用func，只有一共是3个参数是有效的，再多的就被忽略的
	 * 
	 * 当然，案例7和partical 在包装函数的时候，形式上还是有些区别的，bind包装函数后，返回的新的函数，如果直接log出来，发现长的和原来的函数是一模一样的
	 * partical 包装后的函数，和原函数就不一样了。
	 *
	 * 这里 newFunc 和 newFunc2 都用partical实现，只是消耗的参数不同。
	 */
	bee.case07_1 = function(){

		var partical = function(fn){
			return function(){
				var args1 = Array.prototype.slice.call(arguments,0);
				return function(){
					var args2 = Array.prototype.slice.call(arguments,0);
					return fn.apply(null,args1.concat(args2));
				};
			}
		}

		var func = function( a,b,c ) {
		    return a+b+c;
		}

		var newFunc = partical(func)('aa','bb');
		l(newFunc)
		l(newFunc('cc','dd'));

		var newFunc2 = partical(func)('aa');
		l(newFunc2)
		l(newFunc2('bb','cc'));

	}

	/* 
	 * 研究案例7_2:案例7和 partical1
	 */
	bee.case07_2 = function(){

		//这个是书上的partical1
		var partical1 = function(fn,arg){
			return function(){
				var args = Array.prototype.slice.call(arguments,0);
				return fn.apply(null,[arg].concat(args));
			}
		};
		var func = function( a,b,c ) {
		    return a+b+c;
		};
		l(partical1(func,'aa')('bb','cc'));
	}

	/* 
	 * 研究案例7_3: fn.bind 和 fn.bind.apply 【BOSS】
	 * 
	 */
	bee.case07_3 = function(){

		var fish = {
			age:'9岁',
			name:'lala',
			getAge:function(){
				return this.age;
			},
			getName:function(){
				return this.name;
			}
		}
		var getAgeFun = fish.getAge;
		var getNameFun = fish.getName;
		l('========分隔线1=======');
		l(getAgeFun());
		l(getAgeFun.bind(fish)());
		l(getAgeFun.bind.apply(getAgeFun,[fish])());
		l(getAgeFun.bind.apply(getNameFun,[fish])()); // 【标记001】方便别处索引
		

		l('========分隔线2=======');
		//getAgeFun.bind 也是一个函数，我把他想象成 myBind:
		//如果，myBind本身不涉及 this 的参与，其实call调用完全没有意义！和直接调用一样的
		//所以下面的3中调用是不会影响结果的
		function myBind(a){return a;}
		l( myBind.call({},'我是参数') );
		l( myBind.call(function(){},'我是参数') );
		l( myBind.call([],'我是参数') );


		l('========分隔线3=======');
		//getAgeFun.bind 也是一个函数，我把他想象成 myBind2:
		//如果，myBind2本身涉及 this 的参与，那么call调用就有趣多了
		//比如下面的情况：
		
		function myBind2(a){
			return this(a);
		}
		
		//这个是不行的，因为this绑定到{}，所以执行 this(a) 是有错误的
		//l( myBind2.call({},'我是参数') );
		
		//同理：也是有错误
		//l( myBind2.call([],'我是参数') );
		
		//这个是可以的，this指代的是function(){}，不过这个函数返回的是undefined
		l( myBind2.call(function(){},'我是参数') );

		//这个是可以的，this指代的是function(x){return x;}，正确返回
		l( myBind2.call(function(x){return x;},'我是参数') );

		/* 小结
		 * 这里实现的 myBind2 比较接近 getAgeFun.bind（其实就是原生bind） 的实现
		 * 因为内部至少存在一个this，这样子call的第一个参数才会生效。
		 * 另外，myBind2 中 this作为方法在调用，务必需要call的第一个参数是函数，这点上和也比较接近原生的bind
		 *
		 * 当然，我这里myBind2是随意写的，bind 内部实现肯定不是如此：如我的myBind2内部直接调用了this（this指代了方法），
		 * bind至少不会直接调用函数，而是返回这个函数吧
		 */		
	}

	/* 
	 * 研究案例7_4: 自定义bind 和 自定义bind.apply 【BOSS】
	 * 这是研究fn.bind 和 fn.bind.apply的最好办法
	 */
	bee.case07_4 = function(){

		var fish = {
			age:'9岁',
			name:'lala',
			getAge:function(){
				return this.age;
			},
			getName:function(){
				return this.name;
			}
		}
		var getAgeFun = fish.getAge;
		var getNameFun = fish.getName;

		//自定义bind
		function bind (myFun,obj){
			return function(){
				return myFun.call(obj);
			}
		}

		//和原生bind是一样的效果哦，无非原生的形式是：getAgeFun.bind(fish);
		l( bind(getAgeFun,fish)() );
		//和上面是一样的效果，关键看，这里的 apply 第一个参数改变会如何影响
		l( bind.apply(null,[getAgeFun,fish])() );
		//将null换成了function(){return 'xxx';}，没有啥影响。
		//其实看自定义的bind的源码就可以知道，因为内部不存在this,这里使用apply其实是没有关系的。
		l( bind.apply(function(){return 'xxx';},[getAgeFun,fish])() );

		//结论是，原生的bind内部还处理了this,并且this必须是个方法,所以bind.apply调用的时候，受第一个参数的影响。
		//所以原生的 bind 和 bind.apply 还是有点点不一样, 后这稍微灵活点。见【标记001】处，apply偷换了函数。
		//自己实现的 bind, 就无所谓apply调用了。
	}


	/* 
	 * 研究案例7_5: 使用 bind.apply 的真正原因
	 * 这个结论让我恍然大悟，之前7_*系列的都是为了搞明白区别，这样要从使用apply的目的来看：
	 * 使用apply一方面可以解决this的归宿，一方面可以处理参数的形式（这个是超级重要）
	 * 这里 bind.apply 这样子写，仅仅是为了得到自己想要的参数组合形式！！！！！！！！！！
	 */
	bee.case07_5 = function(){

		var obj = {
			base:900,
			add:function(x,y){return x+y+this.base;}
		}

		//使用apply与否，这里仅仅影响的参数的形式
		l( obj.add.bind(obj,90,9)() );
		l( obj.add.bind.apply(obj.add,[obj,90,9])() );

		//两者在使用参数上都很灵活，有点像 curry 和patical 的气质
		l( obj.add.bind(obj,90)(9) );
		l( obj.add.bind.apply(obj.add,[obj,90])(9) );
		
		//但是apply明显更加的灵活，看看 concat 函数的介入
		var args = [9,90];
		l( obj.add.bind.apply(obj.add,[obj].concat(args))() );

	}


	/* 
	 * 研究案例8:自己写一个类似于_.bind的简单例子
	 * myBind利用原生的bind很好实现
	 */
	bee.case08 = function(){
		var obj2 = {
			appName:'大鱼一条',
			fun:function (){return this.appName;}
		}
		function myBind(myObj,AttrName){
			//替换了原来的方法
			myObj[AttrName] = myObj[AttrName].bind(myObj);
		}

		var b = obj2.fun;
		l(b());
		l(b.call({appName:'用call可以改变this'}));

		myBind(obj2,'fun')
		var b = obj2.fun;
		l(b());
		l(b.call({appName:'用call可以改变this'}));

		//从log输出来看和原来的是一模一样的
		l(obj2.fun)
	}


	/* 
	 * 研究案例9:自己写一个类似于_.bind的简单例子
	 * 这里不用bind的情况下也实现了上案例8的功能
	 * 由此可见，underscore的_.bindAll,基本上就是用这里提到的方法实现的
	 * 当然我这里是简单的实现，是原理级的
	 * 刚才看了_.bindAll源码，正如我所言
	 */
	bee.case09 = function(){

		var obj2 = {
			appName:'大鱼一条',
			fun:function (){return this.appName;}
		}

		//myFunc命名为myObj会好点哦
		function myBind(myFunc,AttrName){

			//不要写成注释中的那样，堆栈会溢出
			//20191205：这里是会重复的调用自身。而下者是，先记住了原来的函数，然后对其改装。不存在反复调用
			// myFunc[AttrName] = function(){
			// 	return myFunc[AttrName].call(myFunc);
			// }

			//正确使用
			//这里的操作，说白了就是把obj2.fun改造了，把原来的this用闭包代替了
			var fun = myFunc[AttrName];
			myFunc[AttrName] = function(){
				return fun.call(myFunc);
			}
		}

		var b = obj2.fun;
		l(b());
		l(b.call({appName:'用call可以改变this'}));

		myBind(obj2,'fun')
		var b = obj2.fun;
		l(b());
		l(b.call({appName:'用call可以改变this'}));
	}


	/* 
	 * 研究案例10:函数把自己返回
	 * 把自身返回的效果，可以用作链式调用法
	 * 返回自身的行为，比普通函数更加复杂
	 */
	bee.case10 = function(){

		function fun(){
			l('运行一次')
			return fun;
		}
		l(fun()()()==fun);

	}


	/* 
	 * 研究案例11:函数改变自身的效果
	 * 这样子的函数很有混淆性，因为他在运行时，改变了自身
	 * 所以我们从词法角度去看原函数时候，不是很明了
	 */
	bee.case11 = function(){

		var fun = function(){
			fun = function(){
				return 123;
			}
		}
		l(fun);
		fun();
		l(fun);

	}


	/* 
	 * 研究案例12:函数调用自身
	 * 这其实是递归实现原理，如果没有终止条件，就会进入死循环，如下代码
	 */
	bee.case12 = function(){

		function fun(){
			fun();
		}
		fun();

	}


	/* 
	 * 研究案例13:被函数作用域屏蔽的值
	 * 通常，没有var声明的变量是全局的，然而下面情况并不是
	 * 函数fun中的“a=a;”其实是函数的参数中的a，外层的a因为和fun函数中的同名，所以被屏蔽了。
	 * 第二种情况就没有
	 */
	bee.case13 = function(){

		var a = 123;
		function fun(a){
			a = a;
			return a;
		}
		l(fun(222));
		l(a);

		var b = 'aaa';
		function fun2(a){
			b = a;
			return a;
		}
		l(fun2('bbb'));
		l(b);

	}


	/* 
	 * 研究案例14:案例11的扩展，同时也是对案例09中内存溢出的那种情况的解释
	 * 第一种情况，把obj.fun寄存到xxx是正确的操作
	 * 第二种看上去很像第一种，其实不然
	 * “obj2.fun=...”的操作会立即生效，导致“obj2.fun()“会马上执行，于是变成了函数自身调用，死循环一个
	 * 因此呢，要解决第二种问题，其实第一种寄存的方案就是其解决方案呢
	 */
	bee.case14 = function(){

		//正确
		var obj = {
			fun:function (){return 123;}
		}
		var xxx = obj.fun;
		obj.fun = function(){
			return xxx();
		}
		l(obj.fun());

		//死循环
		// var obj2 = {
		// 	fun:function (){return 123;}
		// }
		// obj2.fun = function(){
		// 	return obj2.fun();
		// }
		// l(obj2.fun());

		//上者其实就是这个
		// var obj3 = {
		// 	fun:function(){
		// 		return obj3.fun();
		// 	}
		// }
		// l(obj3.fun());

		//也等同于
		// var fun = function(){
		// 	fun();
		// }
		// l(fun());

	}

	/* 
	 * 研究案例15:this
	 * 这个问题其实是困扰我很久的一个例子
	 * 就是fun的调用的时候，第二个参数是个函数，而且里面用了this
	 * 那么这个this是指什么？
	 * 其实，没有定论：一定要记住，函数在没有调用之前，里面的代码是没有意义的！
	 * 所以关键看函数内部是如何使用这个函数
	 * 于是结果也是完全不同的，例子中给了三种类型的，结果都不同
	 */
	bee.case15 = function(){

		function fun(obj,fun){
			//使用1
			fun();
			//使用2
			fun.call(obj)
			//使用3
			fun = fun.bind({x:2});
			fun();
		}

		fun({a:1},function(){
			l(this);
			return this;
		});
	}

	/* 
	 * 研究案例16:BOSS:函数中的this
	 * 15中的研究，开始就是出自这个
	 * 我以前一直想this是谁呢，当然根据经验我知道是dom对象
	 * 但是我一直是很好奇为什么是这样子
	 * 其实this完全取决于$对bind的定义
	 * 这就是高阶函数最最混淆之处：
	 * 比如别人定义的高阶函数，你知道这里可以传入一个函数
	 * 但是你完全不知道函数在内部是如何被使用的！只有写的人自己知道，包括函数传什么参数之类的
	 * 所以在看别人的库的时候，一遇到高阶就头晕也是正常
	 * 特别是出现几个闭包，几个this(这些很多伴随高阶而来)
	 */
	bee.case16 = function(){

		$(function(){
			$('.C1').bind('click',function(){
				l(this)
				l(this.id);
				l($(this))
			});
		});

	}

	/* 
	 * 研究案例17:闭包(结合案例18一起学习)
	 * 这里闭包中捕获的自由变量x,外界是无法改变的
	 * 为何研究本案例呢，来自给晓燕解决的问题，项目用sea.js作为模块加载，在模块间交互的时候，总是有一个变量为undefined
	 * 那个道理和这个是一样的，sea模块就好比这里fun2对象，有属性name、fun等，但是它维持引用了一个自由变量x
	 * 所以我无论如何改变全局中的x的值，fun2中的值还是捕获的那个自由变量
	 * 那么如何改变自由变量，见案例18
	 */
	bee.case17 = function(){

		var x ='我是全局的';
		function newFun(){
			var x = '我是闭包的，别人休想访问';
			return {
				name:'xixi',
				fun:function(a,b){
					return x;
				}
			}
		}

		var fun2 = newFun().fun;
		l(fun2);
		l(fun2());

	}

	/* 
	 * 研究案例18:闭包(结合案例17一起学习)
	 * 案例17的解决办法就是——
	 * 在fun函数中加入一个和x同名的参数“x”,这样子，fun函数的内部的函数就阻断了那个私有变量
	 */
	bee.case18 = function(){
	
		var x ='我是全局的'
		function newFun(){
			var x = '我是闭包的，别人休想访问';
			return {
				name:'xixi',
				fun:function(x,a,b){
					return x;
				}
			}
		}
		var fun2 = newFun().fun;
		l(fun2);
		//使用自己传入的参数，来作为x值
		l(fun2('除非是参数的形式进来，闭包的捕获的值才能被覆盖！'));
		//也可以使用全局的x
		l(fun2(x));

	}

	/* 
	 * 研究案例19:
	 */
	bee.case19 = function(){
	



	}


	return bee;
})(bee || {});



/*$.get('http://localhost:5000/api/getStocks/',function(data){
	var d = JSON.parse(data);
	l(d);
	l(d[0].name);
})
*/

//jsonp的用法
/*$.ajax({

    type: "GET",
    url: "http://localhost:5000/api/getStocks/",
    dataType:"jsonp",
    jsonp:"callback",         
    success: function(data){
    	l('===>')
        console.log(data);
    }

});
*/
		


















