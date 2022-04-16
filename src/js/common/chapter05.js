/*******************************
* 第五章 this、curry
********************************/

var bee = (function(bee){

	/* 
	 * 研究案例1:this
	 * 属性中的this并不是指代 people
	 * 方法中的this才指 people
	 * 
	 * 20190912 同 caseE22
	 */
	bee.caseE1 = function(){

		l(this);
		var people={
			a:this   
		};
		l(people.a==this);
	}

	/* 
	 * 研究案例2:this
	 * this到底指代什么，只要看this所在的那个函数是如何被使用的
	 * 无非就四种：函数的方法、直接调用、new调用、call(apply)调用
	 * 下面的案例就展示了这4种情况
	 */
	bee.caseE2 = function(){

		l('==>1');
		l(this);
		function aaa(){
			l('==>2');
			l(this);
			new bbb();
		}
		function bbb(){
			l('==>3');
			l(this);
		}
		function ccc(){
			l('==>4');
			l(this);
		}
		aaa();
		ccc.call('我是文本');
	}

	/* 
	 * 研究案例3:this
	 * this的其他的用法
	 */
	bee.caseE3 = function(){

		var that = this;
		var arr = [this];
		l(that);
		l(arr[0]);

		l(this.toString());
		
		//+操作其实就是字符串的合并，默认也执行了this.toString()
		//"[object Window]0"
		l(this+0);

		//除了+之外的运算，得到的结果为NaN
		l(this/0);
	}

	/* 
	 * 研究案例4:this.a 和 var a 
	 * 这里同时在fun函数中出现this.a和var a的情况，其实处理起来也是很简单的：
	 * this指代谁，就看函数如何使用，这里用了call，于是this指代的是obj对象
	 * var a还是作为还是的私有变量存在
	 */
	bee.caseE4 = function(){

		function fun(){
			this.a = 111;
			this.b = 222;
			var a = 'haha';
			return a;
		}

		var obj = {a:999};
		l(fun.call(obj));
		l(obj);
	}

	/* 
	 * 研究案例5: this.a 和 var a 
	 * 使用new调用的情况，上下文是一个新的{}，this指向这个新的对象
	 * 返回的也是这个处理后的对象
	 * 那个return的是个数字类型的就被忽视了（如果是对象就另当别论，见案例6）
	 */
	bee.caseE5 = function(){

		function fun(){
			this.a = 111;
			this.b = 222;
			var a = 'haha';
			return a;
		}

		var obj = {a:999};
		l(new fun());
	}

	/* 
	 * 研究案例6: this.a 和 var a 
	 * 那个return的是个对象类型，把新的实例给干掉了
	 */
	bee.caseE6 = function(){

		function fun(){
			this.a = 111;
			this.b = 222;
			var a = 'haha';
			return {
				'name':a
			};
		}

		var obj = {a:999};
		l(new fun());
	}

	/* 
	 * 研究案例8: 函数作用域
	 * 本例中，fun函数并没有定义a，却也能读取a的值
	 * 结合案例9
	 */
	bee.caseE8 = function(){

		var a = 1;
		function fun(){
			return a;
		}
		l(fun());
	}

	/* 
	 * 研究案例9: 用this模拟函数作用域
	 * 结合案例8
	 */
	bee.caseE9 = function(){

		function fun(){
			return this.a;
		}
		l(fun.call({a:1}));
	}

	/* 
	 * 研究案例10: 函数作用域
	 * 本例中，fun函数定义了a，外层也有a，内部屏蔽了外层的a
	 */
	bee.caseE10 = function(){

		var a = 1;
		function fun(){
			var a = 2;
			return a;
		}
		l(fun());
	}

	/* 
	 * 研究案例11: 用this模拟函数作用域
	 * 这个基本上是用this来说明了案例10中函数作用域的原理
	 */
	bee.caseE11 = function(){

		function fun(){
			this.a = 2;
			return this.a;
		}
		l(fun.call({a:1}));
	}

	/* 
	 * 研究案例12: 变量屏蔽
	 */
	bee.caseE12 = function(){

		function fun(){
			var a = '我会被屏蔽';
			return function(){
				//只有声明，没有赋值，默认为undefined
				var a;
				l(a);
			}
		}
		fun()();
	}

	/* 
	 * 研究案例13: 泄漏的闭包
	 * 其实下面的这种情况可是标准的闭包
	 * return出去的a维持了对最外层的那个a的引用（根据作用域原理，再外层的都能捕获呢）
	 * 不过呢，这个距离有点遥远...
	 * 那个外层的a并没有被保护起来，可以随便被改动
	 * 这样子闭包的意义就不存在了
	 * 所以闭包要捕获的，一定是被立即执行的函数所保护的，比如注释处a才是合适的位置
	 */
	bee.caseE13 = function(){

		var a = 1000;
		function fun(){
			//把上面的a放在这里才是私有的哦
			//var a = 1000;
			return {
				v:a,
				add:function(){
					a++;
				},
				get:function(){
					return a;
				}

			}
		}
		var newFun = fun();
		newFun.add();
		l(newFun.get());
		newFun.add();
		newFun.add();
		l(newFun.get());
		//a还可以在这里直接修改，就比较坑人了
		a = 10;
		newFun.add();
		l(newFun.get());
	}
	
	/* 
	 * 研究案例14: 泄漏的闭包
	 * 本例子和案例12完全一个意思
	 * 然而这个例子就来源于《函数式编程》，58页的案例
	 * 说的就是我案例12的道理，现在有看到书这里，有了共鸣
	 * 说明我这部分已经掌握的很纯熟了，哈哈
	 */
	bee.caseE14 = function(){

		function fun(obj){
			return function(){
				return obj;
			}
		}
		var fish = {width:100};
		var newFun = fun(fish);
		l(newFun());
		fish.width = 200;
		l(newFun());
	}

	/* 
	 * 研究案例15: 前馈函数
	 * 本例子很简单，思想很重要
	 * pipe实现原来就来源于此
	 * 
	 * 20191209 不太明白“前馈函数”、pipe和这个有啥关系
	 */
	bee.caseE15 = function(){

		var result=1;
		function fun(n){
			return 2*n;
		}
		while(result<1000){
			result = fun(result);
		}
		l(result);
	}

	/* 
	 * 研究案例16: 使用函数，而不是值
	 * 本例子很简单，思想很重要
	 * 用实现2代替实现1
	 */
	bee.caseE16 = function(){

		//实现1
		function repeat(n,value){
			return _.map(_.range(n),function(){
				return value;
			});
		}
		l(repeat(3,"hello~"));

		//实现2
		function repeat2(n,fun){
			return _.map(_.range(n),fun);
		}
		l(repeat2(3,function(){
			return "hello~";
		}));
	}

	/* 
	 * 研究案例17: 默认值
	 * 这里直接设计defaults这个函数的时候，其实我自己也是蒙圈了
	 * 后来想想，如果从实现目标来反推，是不是就清晰多了
	 * 比如：defaults({a:123})({a:undefined},'a')
	 * 首先，它是个高阶函数，有两个‘()’,
	 * 第1对是，默认值的设置
	 * 第2对是，获取对象的某个属性
	 * 这样子的思路，再来设计defaults就明确多了
	 * 
	 * 20191209 还好，不是很难理解。主要还是 apply\call 的功效。
	 */
	bee.caseE17 = function(){

		//为函数添加默认参数
		function fnull(fun){
			var rest = Array.prototype.slice.call(arguments,1);
			return function(){
				var args = _.map(arguments,function(v,i){
					return v==null?rest[i]:v;
				});
				return fun.apply(null,args);
			}
		}
		function abc(a,b,c,d){
			return a+b+c+d;
		}
		var safe = fnull(abc,0,0,0,0);
		l(safe(undefined,9,null,91));

		//获取对象的默认值
		function defaults(obj){
			return function(o,k){
				var val = fnull(_.identity,obj[k]);
				return o && val(o[k]);
			}
		}
		l(  defaults({a:123}) ({a:undefined},'a')  );
	}


	/* 
	 * 研究案例18: 高阶中的特例——curry化
	 */
	bee.caseE18 = function(){
		
		function mult(n){
			return 2*n;
		}
		
		//普通的高阶，把需要的参数一次性传入
		//不推荐使用此方法，既然用了高阶，处理成curry是更好的做法
		function fun(fn,n){
			return fn(n);
		}
		l(fun(mult,10));

		//curry：每一次消耗一个参数，直到完成，更加灵活
		function curry(fn){
			return function(n){
				return fn(n);
			}
		}
		var myMult = curry(mult);
		l(myMult(100));
	}


	/* 
	 * 研究案例19: 2级curry
	 * 就是最后调用函数需要逐级消耗两个参数，如这里的：firstArg,secondArg
	 * 这里curry的顺序是从右到左，所以第一次进入的参数是secondArg，第二次才是firstArg
	 *
	 * 和1级curry的异同：
	 * 不同之处是，1级的消耗一个参数，2级的消耗两个参数
	 * 相同之处是，第一次层级都是接受一个函数
	 * 无论是curry、和curry2消耗的参数的个数是固定的，这种被称之为“显式”，或者“手动”
	 */
	bee.caseE19 = function(){
		
		function double(n){
			return 2*n;
		}
		function tenfold(n){
			return 10*n;
		}
		function operate(fun,a){
			return fun(a);
		}
		function curry2(fn){
			return function(secondArg){
				return function(firstArg){
					return fn(firstArg,secondArg);
				}
			}
		}

		//处理10
		var dealWith10 = curry2(operate)(10);
		//双倍
		l(dealWith10(double));
		//十倍
		l(dealWith10(tenfold));
	}

	/* 
	 * 研究案例20: curry1（2）的优势
	 * 用在回调里面有很好的可读性
	 */
	bee.caseE20 = function(){
		
		var arr = [1,2,3,4,5];
		function curry2(fn){
			return function(second){
				return function(first){
					return fn(first,second);
				}
			}
		}
		
		//这里filter的第二个参数是匿名函数
		l(_.filter(arr,function(n){
			return n>3;
		}));

		var greatThan = curry2(function(a,b){
			return a>b;
		});
		////这里filter的第二个参数是curry化用法，使用很灵活，可读性强
		l(_.filter(arr,greatThan(3)));
	}

	/* 
	 * 研究案例21:字符串的乘法
	 * 最后一例是比较奇葩的
	 */
	bee.caseE21 = function(){
		
		l(10*10);
		l(10*'10');
		l(10*'a');
		l(10*'10a');
		l('10'*'10');
		l('10a'*'10a');
		l(''*'');
	}

	/* 
	 * 研究案例22: this 指的是谁？ 
	 * 20191209 本案例同 caseE22
	 */
	bee.caseE22 = function(){
		
		function fun(){
			var obj = {a:this};
			l(obj.a);
		}
		fun();

		//我们说，this指代的是谁，关键看的是外层的函数如何使用，
		//fun是直接被调用的，那么this就是fun所在的作用域，也就是会fun所在的this
		//fun所在的this,取决于fun外层的函数：这是一个被直接调用的函数，this指向window
		//所以这里的this还是指向的是window!
	};

	/* 
	 * 研究案例23: this 指的是谁？
	 * 20191209 这个案例比较傻逼，以后可以删了
	 */
	bee.caseE23 = function(){
		
		var arr = [];
		arr.push({content:this});
		l(arr[0].content)

		//这里的this，在一个对象呢中，然后被作为参数传入到了arr中去。
		//其实原则还是很简单，不过上面的例子确实很容易被push函数混淆。我们改成下面这个：
		/*
		var arr = [];
		var obj = {content:this}; 
		arr.push(obj);
		l(arr[0].content)
		*/
		//这样子是不是比较明了了。this引用只取决于外层函数的使用！
	}

	/* 
	 * 研究案例24: this 指的是谁？
	 */
	bee.caseE24 = function(){

		function fun(){
			var arr = [];
			arr.push({content:this});
			l(arr[0].content)
			return {
				xx:arr
			}
		}
		
		//这样子使用的话，this就是window，不管是不是在数组中，还是对象中！
		var o = fun();

		//当fun方法作为对象“方法”存在的时候
		var yyy = {
			key:fun
		}
		//方法被调用，this就是指该对象！
		yyy.key();

		//所以，无论this是被放到数组中，还是对象中，其值的特点是：
		//1.依旧是动态的
		//2.只取决于外层函数的使用形式
	}

	/* 
	 * 研究案例25: this 指的是谁？
	 * 很简单，不再细说
	 */
	bee.caseE25 = function(){

		function fun(){
			return [this];
		}
		l(fun())
		l(fun.call('123'));
	}


	/* 
	 * 研究案例26: this 指的是谁？
	 * 20191209 目前看是不会犯错了，这个题目也是为了理解而存在，本身没啥意思。
	 */
	bee.caseE26 = function(){
		
		var obj = (function(){
			var topics = {}
			function fun(key){
				topics[key] = [{a:this}];
				l('==>')
				l(topics[key][0].a)
				return this;
			}
			return {
				fun:fun
			}
		})()
		
		l(obj.fun())
	}


	/* 
	 * 研究案例27: 构造函数中的行为
	 * 20191209 这个案例意义何在？
	 */
	bee.caseE27 = function(){
	
		function Shark(){
			this.superclass = {a:111};
			this.superclass.a = 222;
		}
		var s = new Shark;
		l(s);
		l(s.superclass.a);

		//this指代实例本身，this.superclass是添加了属性（是一个对象）。
		//this.superclass.a 是对这个属性（是一个对象）的属性，进行了值的设置。
	}

	/* 
	 * 研究案例27_2: 上例变化
	 * 2019 这个没意思。xxx要使用call才调用才能在 Shark上
	 */
	bee.caseE27_2 = function(){

		function xxx(){
			this.superclass = {a:111};
			this.superclass.a = 222;
		}
		var Shark=function(){
			xxx();
		}
		var s = new Shark;
		l(s);
		l(window.superclass.a)

		//如果构造函数中出现函数的调用，xxx函数中的this指代什么，只取决于xxx的使用方式。
		//直接调用的话，就是window(关于这个点以后还需要讨论)
	}

	/* 
	 * 研究案例27_3: 上例变化
	 * 同 bee.caseD23 ，这27的三个例子都可以删除了。。
	 */
	bee.caseE27_3 = function(){

		function xxx(){
			this.superclass = {a:111};
			this.superclass.a = 222;
		}
		var Shark=function(){
			xxx.call(this);
		}
		var s = new Shark;
		l(s);
		l(s.superclass.a);

		//这个中模式下，等同于caseE27
		//上例中出现问题是因为this,解析出了问题
		//这里通过call传入了当前的函数作用域。当前函数作用域this，取决于所在函数的调用形式
		//因为是new，所以就是指实例本身。
	}

	/* 
	 * 研究案例27_4: 继续 （研究this） 【BOSS】
	 */
	bee.caseE27_4 = function(){

		//注意本案例使用的使用，请 bee.caseE27_4() 这样子调用。
		l('bee.caseE27_4 所在作用域的 this ===>');
		//这样子，this就是指的是bee
		l(this);

		var kee = {};
		kee.case = function(){

			l('kee.case 所在作用域的 this ===>');
			//这样子，this就是指的是kee
			l(this);

			function xx(){
				l('xx 所在作用域的 this ===>');
				l(this);
			}

			xx();
			//xx.call(this);
		}

		kee.case();

		//这个案例中，有函数的层层嵌套的结构：bee.caseE27_4 中有 kee.case， kee.case中有 xx函数
		//虽然可有结构关系，但是，不代表this，也会有类似的继承关系，这个就大错特错了。
		//我以前也得出一个this绑定策略的研究，结论是：
		//它就是一个堆栈，首先入栈的是window，然后如果是“对象.方法”调用，则再次入栈这个“对象”，如果有new，再入栈“实例对象”，如果有call\apply，入栈它们的“指定对象”。
		//他们几个是有优先级的，window是毫无疑问第一个入栈，后面几个是看情况
		//call、apply、new 比对象方法有级别要高，也就是说，同时出现的话，先入栈方法
		//call、apply、new他们三个，本身等级是一样的（况且，根本就不会同时出现！）
		//补充，不会同时出现是指，不可能同时对同一个函数进行操作！在一个表达式中其实也是可以出现的，只是并不是对同一个函数操作罢了。
		//
		//这个结论是没有错的，但是还有一点最重要的，我要在这里补充！
		//就是上面的这个堆栈，会止于“下一个函数”的出现！！！
		//另外之意是：“下一个函数”的this，并不会继承“上个函数”中所绑定的this
		//“下个函数”的this策略，依旧从一个全新的堆栈开始！！也就是栈底依然是：“window”!!
	}


	/* 
	 * 研究案例27_5: this 是谁？
	 */
	bee.caseE27_5 = function(){

		function xxx(){
			return function yyy(){
				l(this);
			}
		}

		//等价于 (new xxx())();
		//看样子new和函数的结合优先级很高哟~
		//首先执行的是 (new xxx()) ，注意，通常，new Fish 和 new Fish() 是一样的，运算结合的时候，默认会带上后面那对括号
		//如果有return 对象的行为，构造函数就会返回这个对象，而不是新建一个实例。
		//这里返回的是一个函数，然后被调用了。根据我们之前的法则，一个新的函数执行的时候，
		//都会从一个新的堆栈开始，栈底就是window，所以这个时候this就是window
		new xxx()();
		
		//这个this是 yyy的实例。
		//因为现在是（）中的表达式先执行，最后执行的是new 操作，故而this是实例。
		new (xxx.apply({a:123}))();
	}


	/* 
	 * 研究案例28: this 指的是谁？
	 */
	bee.caseE28 = function(){
		
		//本案例主要是对 this.superclass.constructor 的理解
		//通常构造函数中的内容会像：this.age = 123； 这样子的
		//所以在这个例子中我就对使用 this.superclass 的方法 constructor 有点蒙圈。
		//其实后来有对构造函数的原型进行扩展： Shark.prototype.superclass = fish;
		//所以实例中是包含 superclass 属性的
		//因为有new 操作，this 指代的是 实例。
		//所以 this.superclass.constructor(200)，即为 fish.constructor(200)，这个是属性的调用形式，this指向 fish，所以fish的属性被修改了
		function Shark(){
			this.superclass.constructor(200);
		}
		function Fish(age){
			this.age = age;
		}
		var fish = new Fish(100)
		Shark.prototype.superclass = fish;
		
		var s = new Shark();
		l(s);
		l(s.age);
		l(s.superclass.age);
		l(fish)
	}

	/* 
	 * 研究案例28: this 指的是谁？
	 *
	 * 上例子中其实蕴含了这个道理。
	 */
	bee.caseE28_2 = function(age){
		function Fish(age){this.age=age};
		let f = new Fish(100);
		l(f)
		f.constructor(200); // f.constructor 虽然就是 Fish，但是和 直接调用 Fish 还是不一样的。这个道理虽然早明白，却也要搞错。
		l(f)
	}


	// 研究案例29: this，简单的开始
	// 这个例子是常见的构造函数，this当然就是实例本身啦~~
	bee.caseE29 = function(){
		function Fish(age){
			this.age = age;
			l(this);
		}
		var fish = new Fish(100);
	}
	
	// 研究案例29_2: 变化
	// 20191209 同案例 caseE28_2 
	bee.caseE29 = function(){
		function Fish(age){
			this.age = age;
			l(this);
		}
		var fish = new Fish(100);
		//我们知道实例中有一个constructor属性，保持了对构造函数的引用
		//如果我如下使用：
		//这个构造函数Fish，其实并没有起到“构造新实例”的作用。
		//为什么呢？因为这个构造函数并没有被new，而且是以对象的方法的形式被使用的
		//所以函数中的this指的就是对象fish本身了！恰好这个对象就是实例本身
		//所以这样子的写法，其实就是在处理实例本身。（这里修改了对象的age）
		fish.constructor(200)
	}

	// 研究案例29_3: 变化
	bee.caseE29 = function(){
		function Fish(age){
			this.age = age;
		}
		var fish = new Fish(100);
		//这里对构造函数使用了，new，所以产生一个新的实例fish2
		//而fish实例本身没有发生变化~
		var fish2 = new fish.constructor(200);
		l(fish)
		l(fish2)

		//这系列的例子，还是印证了之前说的结论。
		//关键看如何使用函数。
	}


	// 研究案例30: this
	bee.caseE30 = function(){
		var obj ={
			obj2:{
				obj3:{
					fun:function(){
						l(this===obj.obj2.obj3);
					}
				}
			}
		};
		obj.obj2.obj3.fun();

		//这里的用法，是对象方法的使用。
		//this指代的就是离它最近的那个对象，这里就是指的是 obj.obj2.obj3。
	}

	return bee;
})(bee || {});






