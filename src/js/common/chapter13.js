/*******************************
* 第十三章 链式 
********************************/

var bee = (function(bee){


	/*******************************
	* 非惰性链
	********************************/

	//研究案例1: 链式 最简单的开始
	bee.caseM1 = function(){
		var obj = {
			fun1:function(){l(1);return this;},
			fun2:function(){l(2);return this;}
		}
		obj.fun1().fun2();
	}


	//研究案例2: 这里添加一些配置的数据吧
	bee.caseM2 = function(){

		var obj = {
			name:'程咬金',
			setName:function(name){
				this.name = name || this.name;
				return this;
			},
			getName:function(){
				return this.name;
			}
		}
		var n = obj.setName('兰陵王').getName();
		l(n);
		var n = obj.getName();
		l(n);

		//这个模式的特点是，每次引用obj的时候，都是同一个对象，我也不能在创建一个相同类型的对象。
		//在案例三中就用了闭包，有了新的特征！
	}


	//研究案例3: 这里，我们把之前的 obj对象 改成函数的形式
	//这样子会更加的灵活
	bee.caseM3 = function(){

		//创建一个王者
		function kingCreate(){
			var name = "程咬金";
			return {
				setName:function(n){
					name = n;
					return this;
				},
				getName:function(){
					return name;
				}
			}
		}

		var n1 = kingCreate().setName('兰陵王').getName();
		l(n1);
		var n2 = kingCreate().getName();  //因为闭包的作用，这里就不是那个兰陵王了，是程咬金
		l(n2);

		//比较案例2的用法：
		//var n = obj.setName('兰陵王').getName();
		//原来的对象，变成了这里的函数。这里的函数内部还有闭包的成分，显然比案例2的形式更加的高级。
	}


	//研究案例4: 把数据抽出来 
	bee.caseM4 = function(){

		//创建一个王者
		function kingCreate(name){
			var name = name||'程咬金';
			return {
				setName:function(n){
					name = n;
					return this;
				},
				getName:function(){
					return name;
				}
			}
		}

		var n1 = kingCreate().getName();
		l(n1);
		var n2 = kingCreate('兰陵王').getName();
		l(n2);
		var n3 = kingCreate('兰陵王').setName('甄姬').getName();
		l(n3);
	}


	//研究案例5: 现在我们把 kingCreate 挂在到一个对象上
	bee.caseM5 = function(){

		var king = {
			kingCreate : function(name){
				var name = name||'程咬金';
				return {
					setName:function(n){
						name = n;
						return this;
					},
					getName:function(){
						return name;
					}
				}
			}
		}

		//这种情况下，使用还是差不多的，结果也一样
		var n1 = king.kingCreate().getName();
		l(n1);
		var n2 = king.kingCreate('兰陵王').getName();
		l(n2);
		var n3 = king.kingCreate('兰陵王').setName('甄姬').getName();
		l(n3);

		//需要注意的是：链式调用在 kingCreate 之后才开始（才使用return this）,在getName函数终止（没有在return this了）。
		//对于 king 本身并没有可以链式的（至少我这里没有这样子做）
		//所以，getName 方法在king上还是没有的哦~ 使用下面的会报错：
		
		//var n4 = king.getName();
		//l(n4);

		//我这里的模式，其实是等价于 underscore 中的：
		//_.chain({}).cort().value();
		//_就好比我的king，chain是链式的开始，就好比我的kingCreate
		//value是链式的终止，就好比我的getName。

		//不同之处是，我的链式只是采用了比较简单的字符串的处理。
		//而他则是对数组和对象的高级操作！
	}

	//研究案例6: 在链式中 打入！（围棋的术语）
	//高阶函数大展身手！
	bee.caseM6 = function(){

		var king = {
			kingCreate : function(name){
				var name = name||'程咬金';
				return {
					setName:function(n){
						name = n;
						return this;
					},
					getName:function(){
						return name;
					},
					tap:function(fun){
						fun(name);
						return this;
					}
				}
			}
		}

		//通过tap就可以提取链中的数据
		king.kingCreate('兰陵王').setName('孙悟空').tap(function(n){
			l('我就是'+n);
		}).setName('甄姬').getName();
	}


	/*******************************
	* 惰性链 
	********************************/

	//研究案例7: 尚未被调用的函数的形式
	//在学习惰性链之前要知道这个概念——就是那些迟迟没有执行的函数
	bee.caseM7 = function(){

		//1）最基础的，就是函数表达式，只有被调用了里边的内容才执行。
		var fun1 = function(){
			l('啦啦啦');
		};

		//2）数组中的函数
		//这个就很少用了。但是非常有意义。
		//rxjs中的 observable 这个定义，就要数组、异步函数队列的概念，大概也可以从这里延伸开来
		var arr = [fun1];

		//3) 函数中的函数（闭包）
		var fun2 = function(){
			var text = "嘻嘻"
			return function(){
				l(text);
			}
		}
		//这里就保存了一个为执行的函数，其实是一个闭包。
		//fun2()还是一个函数~
		l(fun2());
	}

	//研究案例7_2: 函数中的函数
	bee.caseM7_2 = function(){
		
		var obj = {king:'程咬金'}
		var getName = function(){
			l(this.king);
		}

		//这里的fun也是未调用的状态
		var fun = getName.bind(obj);
		fun();
	}


	//研究案例8:函数中的函数变化  _.compose
	bee.caseM8 = function(){
		function fun1(){l(1);}
		function fun2(){l(2);}
		var fun = _.compose(fun2,fun1); //从右到左，执行函数
		fun();

		//可见 _.compose 和 bind 一样，都有“惰”的特性
	}


	//研究案例9: 数组中的函数(1)
	bee.caseM9 = function(){

		function fun(a){
			return a;
		}

		var arr = [fun];
		l(arr)
		l(arr[0])
		//本例子的数组中，包含着一个非常简单的一个函数
	}

	//研究案例10: 数组中的函数(2)
	bee.caseM10 = function(){

		function fun(){
			a = '这里可以是非常复杂的配置'
			return function(){
				return a;
			}
		}

		var fun2 = fun();
		var arr = [fun2];
		l(arr);
		l(arr[0]);
		//本例子的数组中，包含着一个函数，乍眼看，输出的和上例一样
		//但是这个函数是个闭包，隐藏着更多的信息
	}

	//研究案例11: 数组中的函数（3）
	bee.caseM11 = function(){

		//初始值
		var i = 1;
		//各种用来操作的函数
		var add5 = function(n){return n+5};
		var add2 = function(n){return n+2};
		var mul10 = function(n){return n*10};
		//放在数组中
		var arr=[];
		arr.push(add5)
		arr.push(add2)
		arr.push(mul10)
		
		//延迟到某个特定时刻，让他们依次调用
		setTimeout(function(){
			var r = arr[2](arr[1](arr[0](i)));
			l(r);
		},2000);

		//这个例子其实可以解释"惰性"了。
		//add5、add2等函数，没有直接对初始值 i 进行操作。而是将操作的函数放置到数组中
		//等待某个时刻（异步回调、延时回调、被指定调用）来使用

		//它已经是"惰性"的了，但是，这个不是链式的，没有流畅的api
		//如果基于这个做修改，我们就能得到惰性链
	}


	//研究案例12: 最简单的惰性链 和 thunk函数
	bee.caseM12 = function(){

		//这个是要对数据进行操作的函数
		//被保存到数组中，等待执行的时候，这个函数也被称之为 thunk函数
		function do1(s){return s+'很肉';}

		function kingCreate(name){
			//初始数据（这里为了简单，就用了字符串，要复杂点的话，就是对象啊、数组啊）
			var name = name || '程咬金';
			//一个空数组，用来保存，需要的操作队列的！
			var arr = [];
			return {
				//这个函数把操作函数放到数组中，到未来才被执行（要么被回调、要么被指定调用，这里是后者。）。
				invoke:function(fun){
					arr.push(fun);
					return this;
				},
				arr:arr,
				name:name
			}

		}
		//这里看到的是一个对象
		var n1 = kingCreate('兰陵王').invoke(do1);
		l(n1)
		//这里看到的是讲被操作的函数序列（数组形式）
		var n2 = kingCreate('兰陵王').invoke(do1).arr;
		l(n2)
		//这里看到的是原始数据，可见 do1 函数其实并没有生效！
		var n3 = kingCreate('兰陵王').invoke(do1).name;
		l(n3)
		//这里我手动调用了那个 do1 函数。
		//最悲惨的是，'兰陵王'这个又被传递了一次，真是丑爆了的链式api。
		var n4 = kingCreate('兰陵王').invoke(do1).arr[0]('兰陵王');
		l(n4)

		//不过输出结果对就好了~
		//所以这是非常简单的、丑陋的惰性链。我们是否可以提供统一的接口来输出最后的值。
	}


	//研究案例13: 惰性链 输出最后结果
	bee.caseM13 = function(){

		function do1(s){return s+'很肉';}
		function kingCreate(name){
			var name = name || '程咬金';
			var arr = [];
			return {
				invoke:function(fun){
					arr.push(fun);
					return this;
				},
				arr:arr,
				name:name,

				//其他部分和上例一样，这里额外添加了一个force函数，来输出最后的结果
				force:function(){
					return this.arr[0](this.name)
				}
			}

		}

		var n = kingCreate('兰陵王').invoke(do1).force();
		l(n)

		//它还有一个很大的缺点，这里只调用了一次 invoke （言外之意，数组中只有一个操作函数）
		//如何提供一个借口，能够让这些操作，按次序作用在初始值之上，最后输出我们想要的结构呢？？？？
	}


	//研究案例14: 一个较为完整的惰性链
	bee.caseM14 = function(){

		function do1(s){return s+'很肉';}
		function do2(s){return s+'很坦克';}
		function do3(s){return s+'很厉害';}

		function kingCreate(name){
			var name = name || '程咬金';
			var arr = [];
			return {
				invoke:function(fun){
					arr.push(fun);
					return this;
				},
				arr:arr,
				name:name,

				//其他部分和上例一样，这里额外添加了一个force函数，来输出最后的结果
				force:function(){
					return this.arr.reduce(function(text,thunk){
						return thunk(text);
					},this.name);
				}
			}
		}

		var n = kingCreate()
					.invoke(do1)
					.invoke(do2)
					.invoke(do3)
					.force();
		l(n);
	}


	//研究案例15: 惰性链 中也需要tap函数
	bee.caseM15 = function(){

		function do1(s){return s+'很肉';}
		function do2(s){return s+'很坦克';}
		function do3(s){return s+'很厉害';}

		function kingCreate(name){
			var name = name || '程咬金';
			var arr = [];
			return {
				invoke:function(fun){
					arr.push(fun);
					return this;
				},
				arr:arr,
				name:name,
				force:function(){
					return this.arr.reduce(function(text,thunk){
						return thunk(text);
					},this.name);
				},
				//在上例子基础上新增
				tap:function(fun){
					this.arr.push(function(name){
						//处理回调函数
						fun(name);
						//这个确保初始值能够在reduce中进行传递
						return name;
					});
					//这个this是确保链式调用
					return this;
				}

			}
		}

		var n = kingCreate()
					.invoke(do1)
					.tap(function(name){
						l('我是tap函数，来看看，现在初始值被处理成什么了 ===> '+name);
					})
					.invoke(do2)
					.invoke(do3)
					.force();    //如果没有这个函数的调用，tap中函数是不会被执行的。这点来看，也足见其“惰性”。
		l(n);

		//惰性链，某种程度上和 promise 是一样的。promise（caseH24）中done函数中的内容，也是没有立即执行的，等待异步回调完成之后，才进行的！
	}





	return bee;
})(bee || {});

//bee.caseM4();















