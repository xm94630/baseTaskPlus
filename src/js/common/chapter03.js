/*******************************
* 第三章 细碎知识点
* worker、定时器、监听器
* 各种方法
********************************/

var bee = (function(bee){

	/* 
	 * 研究案例1:worker
	 * worker也是异步的，和ajax、setTime系列是同样的道理
	 * 
	 * 20191206 补充：worker 是提升性能的一个重要工具。我之前的关于提升前端性能的知识点中没有这个，现在要补上。
	 */
	bee.caseC1 = function(){

		var worker =new Worker("../js/morejs/worker.js");
		worker.postMessage("这是后来输出的文字");  		
		worker.onmessage =function(e){   
	        console.log(e.data);
		}
		l('先输出这个文字')

	}

	/* 
	 * 研究案例2:worker可以提交的数据
	 * 支持下面7种数据，注释的是不可以传递的
	 * 函数是不可以传递的，对象可以，不过对象中包含函数的形式也是不可以的-
	 */
	bee.caseC2 = function(){

		var worker =new Worker("../js/morejs/worker.js");
		worker.postMessage('文本');  		
		worker.postMessage({a:'啦啦'});  		
		//worker.postMessage({a:function(){}});  		
		worker.postMessage([1,2,3]);  		
		worker.postMessage(document.getElementById('xxx'));//其实是null		
		worker.postMessage(/abc/);  		
		worker.postMessage(123);  		
		worker.postMessage(undefined);  		
		//worker.postMessage(function(){});  		
		//worker.postMessage(this);  		//这里的this指代的是bee本身，因为包含函数也不可以
		//worker.postMessage(window);  		
		//worker.postMessage(document);  		
		//worker.postMessage(document.getElementsByTagName('body'));
		worker.onmessage =function(e){   
	        console.log('可以支持传递的数据类型（不含dom对象等）：'+Object.prototype.toString.call(e.data));
		}

	}

	/* 
	 * 研究案例3:worker
	 */
	bee.caseC3 = function(){

		var worker =new Worker("../js/morejs/worker.js");
		worker.postMessage("啦啦");  		
		//这个写法和worker.onmessage是一致的
		worker.addEventListener('message',function(e){   
	        console.log(e.data);
		})
	}

	/* 
	 * 研究案例4:in
	 * 这个可以判断是否为一个对象的属性
	 * 还支持原型上的属性呢
	 */
	bee.caseC4 = function(){
		var obj = {
			aaa:123
		}
		l('aaa' in obj)
		l('toString' in obj)
	}

	/* 
	 * 研究案例5:定时器
	 * 定时器使用的时候回返回一个句柄，其实就是一个整数，从1开始，每次增加一个定时器就返回中值就加1
	 * 我们也可以通过这个值来取消定时器
	 */
	bee.caseC5 = function(){

		var c = setTimeout(function(){l('取消调用');fun(d)},1000);
		var d = setInterval(function(){l('调用了')},200);
		l(c);
		l(d);
		function fun(holder){
			clearTimeout(holder);
		}
	}

	/* 
	 * 研究案例5-2:事件监听器
	 * 定时器和事件监听器中都有取消设置的方法，我曾经一度混淆过他们两个的“取消”的实现。
	 * 对定时器而言，取消如上，有一个从1开始计数的句柄，在clearTimeout中传入就可以实现取消。
	 * 对于事件监听而言，也是调用对应的取消方法：removeEventListener，而参数是绑定的那个函数。切记。
	 */
	bee.caseC5_2 = function(){
		var ele;
		var eles;
		function fun(){
			l('只会响应一次哦');
			ele.removeEventListener('click',fun);//取消！！
		}
		window.onload = function(){
			eles = document.getElementsByTagName('body');
			ele = document.getElementsByTagName('body')[0]; 
			//通过getElementsByTagName 返回的是一个数组集合，这个要注意哦
			l(eles);
			ele.addEventListener('click',fun);
		}
	}

	/*
	 * 研究案例5_2:定时器
	 * 我记得那边看到还有这样子的实现，但是我试了下是不行的。。。
	 */
	/*bee.caseC5_2 = function(){

		function xxx(){
			console.log('一秒钟之后，取消定时器')
			clearInterval(xxx);
		}
		setInterval(xxx,1000);
	}
	bee.caseC5_2();*/

	/* 
	 * 研究案例6:定时器
	 * 这个例子其实还是很有难度的，原因在于fun是一个异步递归的执行，而且是一个0秒之后就要递归的！
	 * 我开始觉得，这样子的话岂不是xxx的改变永远也不会发生，因为异步递归永远会占用着堆栈。
	 * 其实并不是这样子的：
	 * 异步递归确实会比xxx改变先跑起来，毕竟人家0秒之后就要触发的，不过一旦执行回调的时候，里面的代码执行总是要花时间的
	 * 所以执行一段时间之后，花去的时间总会越来越多，这个时候，xxx改变的那个计时器一直在运行，总有一刻的时候，它的计时器也变成了0
	 * 同样是0秒之后执行，排在序列前面的回调总会优先执行，这个时候xxx改变的回调触发了！！
	 * 紧接着，fun的递归回调也马上执行，发现xxx值改变了，于是结束了递归！
	 *
	 * 一定要记住，这种异步递归是一种反模式，消耗的内存是很大的
	 */
	bee.caseC6 = function(){

     	var xxx=0;
		setTimeout(function(){l('我是第1个异步调用，只有在1秒后才能执行');xxx=1;},1000);

		function fun(){
			if(xxx!=1){
				setTimeout(function(){
					l('等待中...');
					fun();
				},0);
			}else{
				l('异步递归结束，之前一直在等待xxx值的改变')
			}
		}

		fun();
	}

	/* 
	 * 研究案例7:JQ发布订阅模式
	 * 这里可以看出，这种形式的事件回调，其实是同步的代码
	 * 
	 * 20190612 我现在理解，trigger这个中触发的是同步的，真实的点击事件肯定还是异步的。
	 */
	bee.caseC7 = function(){
		$(function(){
			$('body').on('click',function(){l('xixi')})
				.trigger('click');
			console.log('我是同步的代码')
		});
	}
	
	/* 
	 * 研究案例8:把需要复杂的、不需要马上发生的事情推后（异步执行）
	 * 这样子不会阻塞
	 */
	bee.caseC8 = function(){
		var tasks = [
			function(){l('任务1：这是个复杂的任务')},
			function(){l('任务2：这是个复杂的任务')},
			function(){l('任务3：这是个复杂的任务')},
			function(){l('任务4：这是个复杂的任务')}
		];
		setInterval(function(){
			if(task=tasks.shift()){
				task();
			}
		},0);
		l('我是同步的代码');
	}

	/* 
	 * 研究案例9:parseInt第二个参数，省略、或者为0的时候，表示为十进制。为1的时候，会有问题，没有1一进制。
	 */
	bee.caseC9 = function(){

		l([11,11,11,11].map(parseInt));
		//上面的相当于执行了
		l(parseInt(11,0,[11,11,11,11])); 
		l(parseInt(11,1,[11,11,11,11]));
		l(parseInt(11,2,[11,11,11,11]));
		l(parseInt(11,3,[11,11,11,11]));

		function curry(fun){
			return function(x){
				return fun(x);
			}
		}
		l([11,11,11,11].map(curry(parseInt))); //curry函数包装之后，就没有这个问题了。
	}

	/* 
	 * 研究案例10:requestAnimationFrame
	 * 这个老早之前就有了，我都没有应用过，看了下原来很简单。
	 * 它的优点是：
	 * 1、requestAnimationFrame 会把每一帧中的所有DOM操作集中起来，在一次重绘或回流中就完成，并且重绘或回流的时间间隔紧紧跟随浏览器的刷新频率，一般来说，这个频率为每秒60帧。
	 * 2、在隐藏或不可见的元素中，requestAnimationFrame将不会进行重绘或回流，这当然就意味着更少的的cpu，gpu和内存使用量。
	 */
	bee.caseC10 = function(){

		$(function(){
		    $('body').append('<div id="SomeElementYouWantToAnimate" style="width:50px;height:50px;" class="bg3"></div>');
		    var ele = document.getElementById('SomeElementYouWantToAnimate');
		    ele.style.position = 'absolute';

		    var start = null;
		    window.requestAnimationFrame(function step(timestamp) { //只需要提供一个回调就好了，timestamp就是经过的时间，每次增加16毫秒左右（按照60帧每秒）
		        if (!start) start = timestamp;
		        var progress = timestamp - start;
		        var s = progress  + 'px';
		        ele.style.left = s;
		        if (progress < 1000) {
		          window.requestAnimationFrame(step);
		        }
		    });
		});
	
	}

	return bee;
})(bee || {});




