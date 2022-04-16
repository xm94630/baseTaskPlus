/*******************************
* 第二章
* 函数、闭包、this、引用
********************************/

var bee = (function(bee){

	/* 
	 * 研究案例1:函数表达式
	 * 这个案例执行会报错，因为return中的函数，也属于函数表达式
	 * 函数表达式的特征：
	 * 声明不会提前，这里的aaa只是函数标识符，只有在函数内部作用域识别
	 */
	bee.caseB1 = function(){

	    function fun(){
	    	aaa();
	    	return function aaa(){
	    		l(123);
	    	} 
	    }
	    fun();

	}

	/* 
	 * 研究案例2:函数表达式
	 * 这里再次验证了这个结论：
	 * aaa只是函数标识符，只有在函数内部作用域识别
	 */
	bee.caseB2 = function (){

	    function fun(){
	    	return function aaa(){
	    		l(aaa);
	    	}
	    }
	    fun()();

	}

	bee.caseB2_1 = function (){

		function sum(num){
			if (num<=1) {
				return 1;
			} else{
				return num*sum(num-1);   //自己调用自己,递归
			}
		}
		l(sum(4));
	}

	//上个例子递归用的是函数的名字，这里用的是callee
	bee.caseB2_2 = function (){
		function sum(num){
			if (num<=1) {
				return 1;
			}else{
				return num*arguments.callee(num-1);
			}
		}
		l(sum(4));
	}

	/* 
	 * 研究案例3:函数表达式
	 * 有报错
	 * 原理同案例1、2
	 * 这里的aaa只是函数标识符，只有在函数内部作用域识别
	 */
	bee.caseB3 = function(){

		var fun = function aaa(){
			l(aaa);
		}
		fun();
		l(aaa);

	}

	/* 
	 * 研究案例4:函数表达式
	 * 原理同上
	 * nnn是函数标识符，只有在函数内部作用域识别
	 * bee.caseB4调用的时候，log是生效的
	 */
	bee.caseB4 = function nnn(){

		l(nnn);

	}

	/* 
	 * 研究案例5:函数调用
	 * 这里是一个非常简单的一个函数，在没有被调用的时候，它什么也不是
	 * 第一次调用的时候，会创建一个函数对象
	 * 内部声明的变量a，在内存中分配空间
	 * 函数调用完毕，a就被销毁了，所以说函数中的局部变量的声明周期仅仅在函数内部（当然也有例外）
	 * 第二次调用的时候，是一样的，同样会声明一个变量，但是和上一个并不是同一个内存地址了，这点要明白
	 */
	bee.caseB5 = function (){

	    function fun(){
	    	var a = 123;
	    	return a;
	    }
	    l(fun());
	    l(fun());

	}

	/* 
	 * 研究案例6:函数调用
	 * 只要函数（bee.caseB6）不调用，nnn函数中的内容就算出错（这里fun没有定义）也没有关系（除非是语法错误）
	 * 再次验证：在没有被调用的时候，它什么也不是
	 */
	bee.caseB6 = function nnn(){

	    fun();

	}


	/*****************************************************
	 * 这个算是这次研究的最为重要的成果了,7~12是铺垫，见13
	 *****************************************************/
	/* 
	 * 研究案例7:引用
	 * 这个例子会为后面的讲解做铺垫，所以需要讲一下
	 * 看似很简答的问题，却非常容易错
	 * 给a赋值，值是对象，所以值引用
	 * b = a,表示的是b获取和a相同的引用，所以l(b===a)的结果是true
	 * 但是，不要以为两者全等了，a和b就是同一个东西，你我不分，融为一体了，错！
	 * 其实a还可以改变引用，去引用另一个对象
	 * 这个时候b还是引用的原来的，并不会因为和a全等了，也跟着a改姓了
	 */
	bee.caseB7 = function(){

		var a = {xxx:111};
		var b = a;
		l(b===a)
		a = {yyy:222};
		l(b);

	}

	/* 
	 * 研究案例8:引用
	 * 这里也是很容易犯错的点：第一个a对象和第二个完全不是同一个，虽然输出的时候一模一样
	 * 这个问题以前暴露在 Fish.prototype.x=1，Fish.prototype={x:1} 的区分，一个是在原型上添加，一个是覆盖了原型
	 */
	bee.caseB8 = function(){

		var a = {};
		a.x = 1;
		l(a);
		a = {x:1};
		l(a)

	}

	/* 
	 * 研究案例9:声明
	 * 这个对我困扰了很久，之前也发现了这个问题，一直没有解决，今天终于真相大白了！
	 * 其实这里就是“声明提前”的知识点，但是我掌握的有点问题，所以解不了这个题目
	 * 真相见案例10
	 */
	bee.caseB9 = function(){

		l('-->')
		l(fun);
		l(fun2);

	    var fun = 111;
	    function fun(){l(222)};

	    function fun2(){l(444)};
	    var fun2 = 333;

	    l('==>')
	    l(fun);
	    l(fun2);

	}

	/* 
	 * 研究案例10:声明提前
	 * 这个里案例完全等价于案例9，看看那些变化：
	 * 变量的声明是最先提前的，这个时候都是undefined
	 * 紧接着不是变量的赋值，而是函数的声明（这点很重要）
	 * 剩下的东西保持不变
	 * 这就是结果了
	 */
	bee.caseB10 = function(){

		//这部分被提前了
		var fun;
		var fun2;
		function fun(){l(222)};
		function fun2(){l(444)};

		//剩下的保持原样
		l('-->')
		l(fun);
		l(fun2);

	    fun = 111;
	    fun2 = 333;

	    l('==>')
	    l(fun);
	    l(fun2);

	}

	/* 
	 * 研究案例11:异想天开——函数把自己传进去
	 * fn获得了对fun的对象的引用，所以 l(fun==fn) 必须成立
	 * 然后把fn的引用改了，但是fun还是不变的！这其实是案例7的运用
	 * 之前总以为 因为是引用，fun和fn就你我不分了呢
	 */
	bee.caseB11 = function(){

		function fun(fn){
			l(fun==fn)
			fn = {};
			l(fun);
			l(fn);
		}
		fun(fun);

	}

	/* 
	 * 研究案例12:对案例11扩展
	 * 什么，连参数都是fun!结果是如何呢？
	 * 这里参数虽然是fun，和上例中的fn是一样的，也是对外层fun的引用
	 * 这里很重要的一点是外层的fun是被屏蔽的！
	 * l(fun==fun) 的判断是没有意义的，是对参数自己和自己的对比
	 * 同样改变了fun的引用其实没有改变外面的
	 */
	bee.caseB12 = function(){

		function fun(fun){
			l(fun===fun);
			l(fun);
			fun = {};
			l(fun);
		}
		fun(fun);
		l(fun);
	}

	/* 
	 * 研究案例13:BOSS
	 * 7-12的问题全是由它引出的！
	 * 里面的代码简单的不能简单，就是把bee放空！
	 * 但是结果呢，全局中的依然存在，为什么呢?
	 * 就是案例12的结论
	 * 因为bee被屏蔽了！
	 * 可能你会说nnn也没有bee的参数呢
	 * 但是它会沿着作用域链向外找嘛
	 * “var bee = (function(bee){...”中第二个bee就是他了，这个bee就是《函数式编程》中说的“自由变量”
	 * 为何是自由变量，一般自由变量是因为闭包的作用，继续对它引用而不销毁
	 * 这个自由变量到底被谁引用了呢
	 * 哈哈，不就下面nnn中的bee~
	 * 这个自由变量的值唯独被bee.caseB13访问了（目前如此，除非我添加更加多的闭包对其引用），所以无论设置成什么，都不会影响到最外层的bee
	 */
	bee.caseB13 = function nnn(){

		//不会把全局的bee覆盖，因为已经被屏蔽
		bee = {};

	}

	/* 
	 * 研究案例14:同13
	 * bee2.bbb对自由变量设置了新的引用，所以结果为false
	 */
	bee.caseB14 = function(){

		var bee2 = (function(bee2){
			bee2.aaa = function(){};
			bee2.bbb = function(){
				bee2 = {};
				return bee2;
			}
			return bee2;
		})(bee2||{})

		l(bee2.bbb()===bee2);

	}


	/* 
	 * 研究案例15:无闭包
	 * 这里的bee2和bee3没有本质的区别
	 * 只是bee2多了一个函数的作用域，可以放一些私有变量
	 * 只有当这些私有变量被内部函数引用并且一起return出去了，才产生了闭包
	 * 所以这里没有闭包
	 * 以前我误以为bee2中的函数作用域误认为是闭包
	 * 另外，通过log比较两者，bee3中的方法是有函数名字的，就是其方法名，bee2不是
	 */
	bee.caseB15 = function(){

		var bee2 = (function(bee2){
			bee2.aaa = function(){};
			bee2.bbb = function(){return 123;}
			return bee2;
		})(bee2||{});

		var bee3 = {
			aaa:function(){},
			bbb:function(){return 123;}
		};

		l(bee2);
		l(bee3);

		l(bee2.bbb);
		l(bee3.bbb);
	}
	
	/* 
	 * 研究案例16:闭包
	 * 这里私有变量privite也可以是引用类型的（比如对象）
	 * 闭包生成之后，继续保持对privite的引用
	 * 之前，我以为引用对象为自由变量就不是闭包了，看来是我错啦，目前已经改正
	 * 下面的例子很好的说明了这点
	 */
	bee.caseB16 = function(){

		var bee2 = (function(){
			var privite = {a:0};
			return {
				add:function(){
					privite.a +=1;
					return;
				},
				get:function(){
					return privite.a;
				}
			};
		})();

		l(bee2);
		bee2.add();
		bee2.add();
		bee2.add();
		bee2.add();
		l(bee2.get());
	}

	/* 
	 * 研究案例17:-
	 */
	bee.caseB17 = function(){
	}

	/* 
	 * 研究案例18:闭包
	 * 和16的区别只在privite是不是引用类型，其实没有关系，结果都一样的
	 */
	bee.caseB18 = function(){

		var bee2 = (function(bee2){
			var privite = 0;
			bee2.add = function(){
				privite +=1;
				return;
			};
			bee2.get = function(){
				return privite;
			};
			return bee2;
		})(bee2||{});

		l(bee2);
		bee2.add();
		bee2.add();
		bee2.add();
		bee2.add();
		l(bee2.get());

	}

	/* 
	 * 研究案例19:闭包
	 * 同18
	 * 这里的返回的函数是作为对象的方法存在（有函数名，就是方法名），和实例18就这么点区别
	 */
	bee.caseB19 = function(){

		var bee2 = (function(){
			var privite = 0;
			return {
				add:function(){
					privite +=1;
					return;
				},
				get:function(){
					return privite;
				}
			};
		})();

		l(bee2);
		bee2.add();
		bee2.add();
		bee2.add();
		bee2.add();
		l(bee2.get());

	}

	/* 
	 * 研究案例20:this
	 * 第一个是方法的调用，this指向对象本身
	 * 第二个引用函数的调用
	 */
	bee.caseB20 = function(){

		var a = ({fun:function(){return this}}).fun();
		l(a)

		var fun = ({fun:function(){return this}}).fun;
		l(fun())

	}

	/* 
	 * 研究案例21:值引用
	 */
	bee.caseB21 = function(){

		//修改arr的第一个元素的值
		var my  = [1] 
		var arr = my;
		arr[0] = 222;
		l(arr);
		l(arr==my);

		//不要这样子
		var my2 = [1]
		var arr2 = my2;
		arr2 = [222];
		l(arr2);
		l(arr2==my2);
	}

	//研究案例22: webComponent
	bee.caseB22 = function(){

		var proto = Object.create(HTMLElement.prototype, {
		  attachedCallback: {
		    value: function() {
		      var mountPoint = document.createElement('span');
		      this.createShadowRoot().appendChild(mountPoint);
		      mountPoint.innerHTML = ('我是 webComponent 形式渲染的便签');
		    }
		  }
		});
		document.registerElement('my-xxx', {prototype: proto});

		var fish = Object.create(HTMLElement.prototype, {
		  attachedCallback: {
		    value: function() {
		      var mountPoint = document.createElement('div');
		      this.createShadowRoot().appendChild(mountPoint);
		      mountPoint.innerHTML = ('我是一条小鱼哦');
		    }
		  }
		});
		document.registerElement('my-fish', {prototype: fish});
	}

	//案例23: 巧妙利用数组做映射
	bee.caseB23 = function(){
		let months = ['1月份', '2月份', '3月份', '4月份', '5月份', '6月份',
					  '7月份','8月份', '9月份', '10月份', '11月份', '12月份'];
		var m = months[new Date().getMonth()];
		l(m);
	}

	//案例24: Object.defineProperty
	//这个defineProperty其实就是给对象添加属性。相对于直接用点符号添加属性而言，它具有更多的控制权。
	bee.caseB24 = function(){
		var obj = {}
		Object.defineProperty(obj,'xm',{
			//writable:false, //比如这样子的控制
			value:997788
		})
		l(obj)
	}

	//案例24_2: Object.defineProperty 中的 set 和 get
	//set 和 get 好像是我之前一直搞不明白的，这次是要把他消化了！
	//get会在 'xm' 被读取的时候执行，return 会覆盖原来的值作为最终的值。
	//set会在 'xm' 被赋值的时候执行，这里的return是没有意义的，不过，我们能获取那个值用来干点别的（比如这里更新了jy这个值）
	//千万注意的是：set函数内部不要在给'xm'赋值，否者就是死循环了！！
	bee.caseB24_2 = function(){

		function Test(){
			Object.defineProperty(this,'xm',{
				get: function () {
				    return '无论如何复制，都是返回这个~';
				},
				set: function (v) {
				    this.jy = 'set 被调用了('+v+')';
				}
			})
		}

		var obj = new Test();
		obj.xm = 997788;
		l(obj.xm)
		l(obj.jy)
	}

	//案例24_3: 注意
	// descriptor 分成2个主要类别，一个叫做“data descriptors”和“accessor descriptors”，这两套只能存在一套。
	bee.caseB24_3 = function(){
		Object.defineProperty(this,'haha',{
			get: function () {
				return 123;
			},
			set: function (v) {
				l(this)
			},
			//value:123, //这个不能和 getter-setter pair 在一起，否者就会报错。
		})
		l(haha);
	}

	//案例24_4: 继续
	//这里的set是否可以成为 two-way binding 的实现。
	bee.caseB24_4 = function(){
		Object.defineProperty(this,'haha',{
			get: function () {
				return '我这个字符串本身能不能被改变呢';
				//答案是有的，看案例 24_5
			},
			set: function (v) {
				window.xixi='haha变量的set，导致window上xixi属性的改变，这是不是一种类似“two-way binding”的实现呢？';
			},
		})
		haha='试着改变一下';
		l(haha);
		l(window.xixi)
	}

	//案例24_5: 继续
	//这里get时候，返回的值是一个变量。这样子haha的值一直会跟随 myValue 的变化。
	bee.caseB24_5 = function(){
		var obj = {};
		var myValue = '我这个字符串本身能不能被改变呢'
		Object.defineProperty(obj,'haha',{
			get: function () {
				return myValue;
			},
			set: function (v) {
			},
		})
		myValue = '试着改变一下';
		l(obj.haha);
	}

	//案例24_6: data deccriptor
	//这个类似于es6的“const”
	bee.caseB24_6 = function(){
		var obj = {};
		Object.defineProperty(obj,'PI',{
			value:        3.14,
			enumerable:   true, //待学
			writable:     false,
			configurable: false //待学
		})
		l(obj.PI);
		obj.PI = '不会被改变';
		l(obj.PI);
	}




	return bee;
})(bee || {});


