/*******************************
* 第十四章 
* 函数式编程
* 函数的几种使用形式
********************************/

var bee = (function(bee){

	//研究案例1: 最简单的开始 fun();
	bee.caseN1 = function(){
		var fun = function(a){l('最简答的开始:'+a);}
		fun(a);
	}

	//研究案例2: 对象的方法 obj.fun();
	bee.caseN2 = function(){
		var obj = {
			fun:function(){l('我是方法');}
		}
		obj.fun();
	}

	//研究案例3: 链式调用 obj.fun1().fun2();
	//比较典型的就是jquery
	bee.caseN3 = function(){
		var obj = {
			fun1:function(){l('我是方法1');return this;},
			fun2:function(){l('我是方法2');return this;},
		}
		obj.fun1().fun2().fun1().fun1();
	}

	//研究案例3_2: 上例演变
	//这里对象方法中接受的是函数的时候，别有一番味道。
	bee.caseN3_2 = function(){
		var obj = {
			data:[10000,11,22],
			pipe:function(fn){
				//处理数据
				this.data = fn(this.data);
				return this;
			},
			tap:function(fn){
				fn(this.data);
				return this;
			}
		}
		function add100(data){
			return data.map(function(a){
				return a+100;
			})
		}
		function less1000(data){
			return data.filter(function(a){
				return a<1000;
			})
		}
		function log(data){
			console.log('现在的结果是:'+data);
		}
		obj.pipe(add100).tap(log).pipe(less1000).tap(log);

		//上例中的典型案例就是jquery，链式调用的方法传入的对象应该很少是函数的吧，而这里却都用了函数。
		//这里的obj其实是包装之后的数据对象，pipe中可以传入处理数据的方法。
		//tap和pipe的实现非常的类似。区别在于，只是利用值，而不会改变值。
		//这里把解决问题的过程分解为几个函数，是典型的函数式编程
		//函数式编程也分精妙与否，关键看 add100、less1000 这等函数是具有高度复用性，否者的话也是无用。
	}

	//研究案例3_3: 继续优化
	//上面那个，数据是包含在obj中，不是很灵活，是不是拿出来更加的灵活呢？
	//其实很简单的了，只有小小的改变了
	bee.caseN3_3 = function(){

		//这里处理成闭包函数，就可以了
		function originData(data){
			return {
				data:data,
				pipe:function(fn){
					this.data = fn(this.data);
					return this;
				},
				tap:function(fn){
					fn(this.data);
					return this;
				}
			}
		}
		function add100(data){
			return data.map(function(a){
				return a+100;
			})
		}
		function less1000(data){
			return data.filter(function(a){
				return a<1000;
			})
		}
		function log(data){
			console.log('现在的结果是:'+data);
		}
		var arr = [10000,11,22];
		originData(arr).pipe(add100).tap(log).pipe(less1000).tap(log);
		var arr2 = [111,222,333];
		originData(arr2).pipe(add100).tap(log);
	}

	//研究案例3_4: 继续优化
	//之前的操作中都没有出现异步的情况，如果出现了，怎么办呢！ 
	//其实在那种模式下，中间出现异步这个本身就没有任何意义的。
	//因为根本就无法将异步操作的值作为返回值返回！！！
	bee.caseN3_4 = function(){

		function originData(data){
			return {
				data:data,
				pipe:function(fn){
					this.data = fn(this.data);
					return this;
				},
				tap:function(fn){
					fn(this.data);
					return this;
				}
			}
		}
		function add100(data){
			return data.map(function(a){
				return a+100;
			})
		}
		function add10(data){

			//这个异步行为是无力的，以为在里面的内容执行的时候
			//下面的return就已经完毕了...
			//所以说这种模式本来就不应该出现异步的东西。
			window.setTimeout(function(){
				data = [9999,9999,9999];
				l('我是异步的行为，但是没用啥用');
			},1000);
			
			return data.map(function(a){
				return a+10;
			})
		}
		function log(data){
			console.log('现在的结果是:'+data);
		}
		var arr2 = [1,2,3];
		originData(arr2).pipe(add10).tap(log).pipe(add100).tap(log);
	}

	//研究案例3_5: 链式中出现异步的模式
	//（要求先输出1，然后是2，也就是说，then这个函数要保证执行的顺序）
	//本例先抛出没有解决顺序的。
	bee.caseN3_5 = function(){
		var obj ={
			then:function(fun){
				fun();
				return this;
			}
		}
		function asyncfun(){
			window.setTimeout(function(){
				console.log(1);
			},500)
		}
		function syncfun(){
			console.log(2);
		}
		obj.then(asyncfun).then(syncfun);
	}

	//研究案例3_6: 链式中出现异步的模式
	//obj.then(asyncfun).then(syncfun);
	//这里就和数据没有关系了(相比3_4)，这里链式，仅仅是梳顺函数调用的顺序。
	//这里其实是在处理流式函数调动。
	bee.caseN3_6 = function(){
		function obj(){
			var arr = [];
			return {
				then:function(fun){

					arr.push(fun);
					if(arr.length>1){
						return this;
					}

					//第一次，无论是同步代码还是异步都执行了。
					(function dealWithNextFunInArray(){
						if(arr.length==0)return;
						arr[0](function(){
							arr.shift();
							dealWithNextFunInArray();
						});
					})();

					return this;
				}
			}
		}
		function wait1000(next){
			window.setTimeout(function(){
				l('（我是异步任务，这里啥也没有做，只用作延时1000）')
				next();
			},1000)
		}
		function wait3000(next){
			window.setTimeout(function(){
				l('（我是异步任务，这里啥也没有做，只用作延时3000）')
				next();
			},3000)
		}
		function log(next){
			console.log('一开始就出现啦');
			next();
		}
		function log1(next){
			console.log('间隔一段时间');
			next();
		}
		function log2(next){
			console.log('间隔较长一段时间');
			next();
		}
		obj().then(log).then(wait1000).then(log1).then(wait3000).then(log2);

		//其实在本例子中，所有要执行的函数都被放置到一个数组中去了。
		//然后一个个根据回调进行串联。
		//这里的例子还不够精妙，以为传入的函数中被耦合了 next 参数，这样子就不方便复用。
		//另外这个实现其实就是 async.js 中 series 函数。 series 中使用的函数也是和我一样需要有参数的，耦合度也是很高的。
	}


	//研究案例3_7: 继续深入
	//上面的链式的then函数是高阶，需要参入一个函数，但是函数中需要有这个next这个才行
	//能不能把这个给省略了呢？岂不是更加的好。
	//我们看看一种现成的：（书上看到的）
	bee.caseN3_7 = function(){

		$.when('').then(function(){
			setTimeout(function(){
				l('1秒后出现');
			},1000)
		}).then(function(){
			setTimeout(function(){
				l('2秒后出现');
			},2000)
		}).then(function(){
			setTimeout(function(){
				l('3秒后出现');
			},3000)
		})

		//这种模式下，这些异步行为其实是并行的！
		//虽然省略了函数中的参数next，但是功能并不相同。
		//所以说，既然async.js 封装的时候，有next，肯定是最精简了的，要是可以再简化的话
		//这个库的作者早就想到了，还用我去质疑？
	}


	/*******************************
	* 一级 curry
	********************************/

	//研究案例4: 一级 curry 
	//一级curry:curry这个函数内容，只返回函数一次。
	//这里传入的是函数，返回的是函数。
	//起初写完这个案例的时候，我突然说不上来，这样子有什么好处。感觉把案例一中的绕了一下。
	//然后我马上想起了一个重要的特征。见下个案例
	bee.caseN4 = function(){
		function curry(fun){
			return function(a){
				return fun(a);
			}
		}
		var fun = function(x){
			l('结果是：'+x);
		}
		curry(fun)(2);
	}

	//研究案例4_2: 一级 curry 应用
	//这里是高阶函数的一个应用场景，而curry正好是来处理高阶函数的！
	//这里可以看到有没有curry的包装的结果是不一样的。
	//包装后的那个函数主要是在接受参数的时候，参数个数发生了变化。从原来的接受无限个的参数，变成了只接受一个。
	bee.caseN4_2 = function(){
		function curry(fun){
			return function(a){
				return fun(a);
			}
		}
		var gaojie = function(fn){
			l(fn(5,4,3,2,1))
			return;
		}
		var sum = function(){
			var arr = Array.prototype.slice.call(arguments,0);
			var n=0 ;
			for(var i=0;i<arr.length;i++){
				n += arr[i];
			}
			return n;
		}
		gaojie(sum);
		gaojie(curry(sum));
	}

	//研究案例4_3: 一级 curry 多参数
	//重构案例4
	//区别在于，案例4返回的函数的参数是一个，这里确是多个。
	//见案例4_4的运用，对比4_2就知道了。 
	bee.caseN4_3 = function(){
		function curry(fun){
			return function(){
				var args = Array.prototype.slice.call(arguments,0);
				return fun.apply(null,args);
			}
		}
		var fun = function(x){
			l('结果是：'+x);
		}
		curry(fun)(2);
	}

	//研究案例4_4: 一级 curry 多参数 应用
	bee.caseN4_4 = function(){
		function curry(fun){
			return function(){
				var args = Array.prototype.slice.call(arguments,0);
				return fun.apply(null,args);
			}
		}
		var gaojie = function(fn){
			l(fn(5,4,3,2,1))
			return;
		}
		var sum = function(){
			var arr = Array.prototype.slice.call(arguments,0);
			var n=0 ;
			for(var i=0;i<arr.length;i++){
				n += arr[i];
			}
			return n;
		}
		//这个时候结果是一样的，也在预料之中。
		gaojie(sum);
		gaojie(curry(sum));
	}


	//研究案例4_5: 同上
	//这里使用了bind 函数，来实现 curry。
	//bind的作用相当于return了一个函数。
	bee.caseN4_5 = function(){
		function curry(fun){
			return fun.bind(null)
		}
		var gaojie = function(fn){
			l(fn(5,4,3,2,1))
			return;
		}
		var sum = function(){
			var arr = Array.prototype.slice.call(arguments,0);
			var n=0 ;
			for(var i=0;i<arr.length;i++){
				n += arr[i];
			}
			return n;
		}
		gaojie(sum);
		gaojie(curry(sum));
	}

	/*******************************
	* 二级 curry
	********************************/

	//研究案例5: 二级 curry 
	bee.caseN5 = function(){

		function curry(fun){
			return function(a){
				return function(b){
					return fun(a,b)
				};
			}
		}
		var fun = function(x,y){
			var sum = x+y;
			l('结果是：'+sum);
		}
		curry(fun)(2)(1000);
		//curry(fun)(2,1000)();
	}

	//研究案例5_2: 二级 curry 
	bee.caseN5_2 = function(){

		function curry(fun){
			return function(){
				var arr = Array.prototype.slice.call(arguments,0);
				arr.unshift(null);
				return fun.bind.apply(fun,arr);
			}
		}
		var fun = function(x,y){
			var sum = x+y;
			l('结果是：'+sum);
		}
		curry(fun)(2)(1000);
		curry(fun)(2,1000)();
	}

	//研究案例6: 惰性链
	//今天看到react项目中有使用一个叫做 d3-scale 
	//发现它的使用，基本就是惰性链的模式
	//之前的函数的调用，仅仅是在内部闭包中做了一些配置
	//这种模式基本上就是利用函数式编程
	//
	// 模式如下：
	// var fun = obj.xxx(配置a).yyy(配置b)
	// fun();
	//
	//我也来实现一个比例因子的功能
	bee.caseN6 = function(){

		var obj = (function(){
			var scale;
			var a1,b1,c1,a2,b2,c2;
			return {	
				domain:function(arr1){
					a1 = arr1[0];
					b1 = arr1[1];
					c1 = b1-a1; 
					return this;
				},
				range:function(arr2){	
					a2 = arr2[0];
					b2 = arr2[1];
					c2 = b2-a2; 
					
					//计算比例因子
					scale = c1/c2;

					return function(x){
						return a2+(x-a1)/scale ;
					}
				}
			}
		})();

		//这里就是将百分制，转化为五颗星制度的一个用法：
		var x = obj.domain([0,100]).range([0,5]);
		l(x(10));
		l(x(50));
		l(x(100));

		var x = obj.domain([-10,10]).range([1,2]);
		l(x(0));

		//小结
		//其实这里的比例因子就是我们高中学的函数是一样的，这里的是一次函数。
		//也就是是说domain中的数组和range中的数组，正好满足了一次函数的关系。前者是x轴的取值范围，后者是y轴的取值范围。
		//
		//那么，我现在想把一次函数这个部分抽象出来。改如何做呢？
	}

	//比例因子 高级 一次函数
	bee.caseN6_2 = function(){

		var obj = (function(){
			var x1,y1,x2,y2;
			var scaleFun;

			//把比例因子抽象出来
			
			//一次函数（线性比例变化）
			function scaleLinear(x){
				//该公式可以用，相似三角形来推出，也可以使用一次函数的y=kx+b，进行处理。
				return y1+(x-x1)*(y2-y1)/(x2-x1); 
			}

			return {
				scaleLinear:function(x){
					scaleFun = scaleLinear;
					return this;
				},	
				domain:function(arr1){
					x1 = arr1[0];
					x2 = arr1[1];
					return this;
				},
				range:function(arr2){	
					y1 = arr2[0];
					y2 = arr2[1];
					return scaleFun;
				}
			}
		})();

		var x = obj.scaleLinear().domain([0,100]).range([0,5]);
		l(x(50));
	};

	//比例因子 高级 二次函数 【BOSS】可用来实现animate中缓动之类的~
	bee.caseN6_2 = function(){

		var obj = (function(){
			var x1,y1,x2,y2;
			var scaleFun;

			//把比例因子抽象出来
			
			//一次函数（线性比例变化）
			function scaleLinear(x){
				return y1+(x-x1)*(y2-y1)/(x2-x1); 
			}

			//二次函数（曲线比例）定点在x1的情况
			//解方程
			//式子1 ax1*x1+b*x2+c=y1
			//式子2 a21*21+b*22+c=y2
			//式子3 -b/2a=x1 (定点在x1)
			//式子1-式子2 可消去c，再结合式子3，可以解a
			//接着求解b,求解c 
			function scaleCurveApexLeft(x){
				var a = (y2-y1)/(x1-x2)/(x1-x2);
				var b = -2*a*x1;
				var c = y1-a*x1*x1-b*x1;
				return a*x*x+b*x+c;
			}

			return {
				scaleLinear:function(x){
					scaleFun = scaleLinear;
					return this;
				},	
				scaleCurveApexLeft:function(){
					scaleFun = scaleCurveApexLeft;
					return this;
				},
				domain:function(arr1){
					x1 = arr1[0];
					x2 = arr1[1];
					return this;
				},
				range:function(arr2){	
					y1 = arr2[0];
					y2 = arr2[1];
					return scaleFun;
				}
			}
		})();

		var x = obj.scaleCurveApexLeft().domain([0,100]).range([0,100]);
		l(x(0));
		l(x(10));
		l(x(20));
		l(x(30));
		l(x(40));
		l(x(50));
		l(x(60));
		l(x(70));
		l(x(80));
		l(x(90));
		l(x(100));
		//从结果观察可以发现，在x平均递增的时候，y的值急剧递增。
		//此曲线可以用来描述，一辆正在加速的汽车，跑过的路程距离的变化。
		//也可以用来描述，在重力作用下，下落的距离变化。
		//无论这个抛物线开口向上还是向下，总是表示了结果变化越来越剧烈，即急剧递增或者急剧递减。
		//
		//和 scaleCurveApexLeft 对应的是 scaleCurveApexRight。
		//用来描述，类似刹车的效果、阻力效果。
		//或者想动画中的缓动，慢慢静止的效果。
		//这里就不再实现了。
		//
		//另外这个例子，其实也是解决了，我当前一直迷惑的第一点。就是那些anmite中的缓动是如何实现的。
		//包括模拟cavas中的重力加速度。
		//都可以从这个例子中得到解答！
	}

	//比例因子 继续优化 实现逆过程
	bee.caseN6_2 = function(){

		var obj = (function(){
			var x1,y1,x2,y2;
			var scaleFun;

			function scaleLinear(x){
				return y1+(x-x1)*(y2-y1)/(x2-x1); 
			}
			//这个很有意思，是反求y值，和上面正好相反的操作！
			scaleLinear.invert = function(y){
				return (y-y1)*(x2-x1)/(y2-y1)+x1;
			}

			function scaleCurveApexLeft(x){
				var a = (y2-y1)/(x1-x2)/(x1-x2);
				var b = -2*a*x1;
				var c = y1-a*x1*x1-b*x1;
				return a*x*x+b*x+c;
			}
			scaleCurveApexLeft.invert = function(y){
				//求 a*x*x+b*x+c-y = 0 的根
				var a = (y2-y1)/(x1-x2)/(x1-x2);
				var b = -2*a*x1;
				var c = y1-a*x1*x1-b*x1;
				c = y1-a*x1*x1-b*x1-y;
				return (-b+Math.sqrt(b*b-4*a*c))/2/a ;
			}

			return {
				scaleLinear:function(x){
					scaleFun = scaleLinear;
					return this;
				},	
				scaleCurveApexLeft:function(){
					scaleFun = scaleCurveApexLeft;
					return this;
				},
				domain:function(arr1){
					x1 = arr1[0];
					x2 = arr1[1];
					return this;
				},
				range:function(arr2){	
					y1 = arr2[0];
					y2 = arr2[1];
					return scaleFun;
				}
			}
		})();

		var x = obj.scaleCurveApexLeft().domain([0,100]).range([0,100]);
		l(x(20));
		l(x.invert(4)); 
		l(x.invert(x(20))); 
		l(x(x.invert(4)));

		//这里实现了 x.invert() 操作,和 x() 正好是反操作
	}

	//比例因子 继续优化 实现多段变化
	bee.caseN6_3 = function(){

		var obj = (function(){
			var x1,y1,x2,y2;
			var scaleFun;
			var arr1,arr2;
			var len1,len2;

			//这个是决定是在哪个区间，用来配置x1,y1,x2,y2的具体取值
			function assignment(n,array){

				//例因子的区段应该一一对应
				if(len1!==len2){
					throw new Error('比例因子的区段应该一一对应');
				}

				var i;
				var arr = array.slice(0);
				arr.push(n);
				arr.sort(function(x,y){
					return x>y;
				})
				i = arr.indexOf(n);

				//这里要做极限的判断（也就是在数据范围之外）
				if(i>=len1){
					i--;
				}
				else if(i<0){
					i=0;
				}

				x1 = arr1[i-1];
				x2 = arr1[i];
				y1 = arr2[i-1];
				y2 = arr2[i];
			}

			function scaleLinear(x){
				assignment(x,arr1);
				return y1+(x-x1)*(y2-y1)/(x2-x1); 
			}
			scaleLinear.invert = function(y){
				assignment(y,arr2);
				return (y-y1)*(x2-x1)/(y2-y1)+x1;
			}

			function scaleCurveApexLeft(x){
				assignment(x,arr1);
				var a = (y2-y1)/(x1-x2)/(x1-x2);
				var b = -2*a*x1;
				var c = y1-a*x1*x1-b*x1;
				return a*x*x+b*x+c;
			}
			scaleCurveApexLeft.invert = function(y){
				assignment(y,arr2);
				var a = (y2-y1)/(x1-x2)/(x1-x2);
				var b = -2*a*x1;
				var c = y1-a*x1*x1-b*x1;
				c = y1-a*x1*x1-b*x1-y;
				return (-b+Math.sqrt(b*b-4*a*c))/2/a ;
			}

			return {
				scaleLinear:function(x){
					scaleFun = scaleLinear;
					return this;
				},	
				scaleCurveApexLeft:function(){
					scaleFun = scaleCurveApexLeft;
					return this;
				},
				domain:function(arr){
					arr1 = arr;
					len1 = arr.length;
					return this;
				},
				range:function(arr){	
					arr2 = arr;
					len2 = arr.length;
					return scaleFun;
				}
			}
		})();

		var x = obj.scaleLinear().domain([0,100,600]).range([0,5,15]);
		l(x(100));
		l(x(350));
		l(x.invert(x(350)));

		var x = obj.scaleLinear().domain([0,10000,10001,10002]).range([0,1,11,10011]);
		l(x(5000));
		l(x(10000.5));
		l(x(10001.5));
		l(x(20000));

		//这里 scaleLinear 的多段变化其实好比是个折线图。
		//关于 scaleCurveApexLeft 的多段变化，我觉得是没有意义的。
	
		//动画实例（加速）
		$(function(){
			var s = 1;
			var x = obj.scaleCurveApexLeft().domain([0,100]).range([0,1200]);
			$('body').append('<div class="myBox bg5" id="myBox"></div>');
			window.setInterval(function(){
				s = s+1;
				if(s>100)return;
				$('#myBox').css('left',x(s));
			},20);
		})
	}



	bee.caseN6_4 = function(){

		var obj = (function(){
			var x1,y1,x2,y2;
			var scaleFun;
			var arr1,arr2;
			var len1,len2;

			//这个是决定是在哪个区间，用来配置x1,y1,x2,y2的具体取值
			function assignment(n,array){

				//例因子的区段应该一一对应
				if(len1!==len2){
					throw new Error('比例因子的区段应该一一对应');
				}

				var i;
				var arr = array.slice(0);
				arr.push(n);
				arr.sort(function(x,y){
					return x>y;
				})
				i = arr.indexOf(n);

				//这里要做极限的判断（也就是在数据范围之外）
				if(i>=len1){
					i--;
				}
				else if(i<0){
					i=0;
				}

				x1 = arr1[i-1];
				x2 = arr1[i];
				y1 = arr2[i-1];
				y2 = arr2[i];
			}

			function scaleLinear(x){
				assignment(x,arr1);
				return y1+(x-x1)*(y2-y1)/(x2-x1); 
			}
			scaleLinear.invert = function(y){
				assignment(y,arr2);
				return (y-y1)*(x2-x1)/(y2-y1)+x1;
			}

			function scaleCurveApexLeft(x){
				assignment(x,arr1);
				var a = (y2-y1)/(x1-x2)/(x1-x2);
				var b = -2*a*x1;
				var c = y1-a*x1*x1-b*x1;
				return a*x*x+b*x+c;
			}
			scaleCurveApexLeft.invert = function(y){
				assignment(y,arr2);
				var a = (y2-y1)/(x1-x2)/(x1-x2);
				var b = -2*a*x1;
				var c = y1-a*x1*x1-b*x1;
				c = y1-a*x1*x1-b*x1-y;
				return (-b+Math.sqrt(b*b-4*a*c))/2/a ;
			}

			return {
				scaleLinear:function(x){
					scaleFun = scaleLinear;
					return this;
				},	
				scaleCurveApexLeft:function(){
					scaleFun = scaleCurveApexLeft;
					return this;
				},
				domain:function(arr){
					arr1 = arr;
					len1 = arr.length;
					return this;
				},
				range:function(arr){	
					arr2 = arr;
					len2 = arr.length;
					return scaleFun;
				}
			}
		})();

		var x = obj.scaleLinear().domain([0,100]).range([0,5]);
		l(x(100));
	}


	/*
	 * 研究案例7: 管道 pipe
	 * 这个是管道中最最简单的例子：直接把数据传入，然后把数据传给另外一个函数~
	 */
	bee.caseN7 = function(){
		
		var fun = function(data){
			var value = data;
			return {
				pipe:function(fun){
					fun(value)
				}
			}
		}
		fun('我是数据').pipe(console.log)
	}

	/*
	 * 研究案例7_2: 管道 pipe
	 * 这个和7_1其实是完全一样的！
	 */
	bee.caseN7_2 = function(){
		
		var fun = (function(_global){
			//这里可以别样的内容~
			l(_global)
			return function(data){
				var value = data;
				return {
					pipe:function(fun){
						fun(value)
					}
				}
			}
		})(window);
		fun('我是数据').pipe(console.log)
	}

	/*
	 * 研究案例7_3: 中间件
	 * 20190110
	 * 这个模拟中间件的写法，不过，这个好像可以为了满足这种实现而刻意写出来的。
	 * 真正的实现，更加精妙，特别是对next的处理。
	 * 我觉得aysnc源码中可以有我要的答案
	 */
	bee.caseN7_3 = function(){
		
		let result;
		let app = {
			myCtx:{},
			flag:true,
			next:function(){
				app.flag = true;
			},
			use:function(fun){
				if(app.flag){
					app.flag = false;
					fun(this.myCtx,this.next);
				}
			},
			go:function(){
				return this.myCtx
			}
		}

		app.use((ctx,next)=>{
			ctx.name='I';
			next();
		})
		app.use((ctx,next)=>{
			ctx.name += ' love';
			//next();
		})
		app.use((ctx,next)=>{
			ctx.name += ' you!';
			next();
		})
		result = app.go();
		console.log(result.name);
	
	}


	

	return bee;
})(bee || {});



