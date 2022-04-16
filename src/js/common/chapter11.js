/*******************************
* 第十一章
* jquery 版本的 promise
* async.js
********************************/


var bee = (function(bee){


	/*******************************
	* 第1节 jquery 版本的 promise
	********************************/

	/* 
	 * 研究案例1: 模拟get方法，返回一个promise
	 */
	bee.caseK1 = function(){

		//这里 $getMock 返回的是一个defer对象（是promise的超集）
		//和promise共享相同的方法（done、fail）
		function $getMock (){
			var df = new $.Deferred;
			window.setTimeout(function(){
				df.resolve('成功');
				//df.fail('失败');
			},1000);
			return df;
		}

		var promise = $getMock();
		promise.done(function(d){
			console.log(d);
		})
		promise.fail(function(d){
			console.log(d);
		})
	}


	/* 
	 * 研究案例2: pipe
	 * 这里的pipe和我之前自己实现的链式中的pipe有些不同。
	 * 相同的是，都可以链式调用。
	 * 这是这里每次返回的对象比较特殊，是一个promise对象。这是不同之处。
	 */
	bee.caseK2 = function(){

		function $getMock (){
			var df = new $.Deferred;
			window.setTimeout(function(){
				//df.resolve('参数1');
				df.reject('参数1');
			},1000);
			return df;
		}
		var getPromise = $getMock();
		//pipe中参数分别代表done、fail、progress的回调
		var x = getPromise.pipe(function(data){
			console.log(data);
			//当这里返回的不是promise对象，那么内部会处理成：
			//这个promise被履行了，具体是done、还是fail要看上个promise的处理
			//这里上一级的promise是拒绝，所以这里的promise就相当于也是“拒绝”
			//所以回调走的是x.fail这个的
			return 'ok';
		},function(data){
			console.log(data);
			return 'no';
		});
		x.done(function(d){
			console.log('-->'+d);
		});
		x.fail(function(d){
			console.log('==>'+d);
		});
	}

	/* 
	 * 研究案例3: 变化
	 * 和上例不同的是，这里pipe回调中，返回的是还是一个“promise”!
	 */
	bee.caseK3 = function(){

		function $getMock (){
			var df = new $.Deferred;
			window.setTimeout(function(){
				df.resolve('参数1');
			},1000);
			return df;
		}
		function $postMock (){
			var df = new $.Deferred;
			window.setTimeout(function(){
				df.resolve('参数2');
			},1000);
			return df;
		}
		var getPromise = $getMock();
		//这里没有必要这样子用了。
		/*getPromise.done(function(d){
			console.log('第1个promise已经履行，参数是：'+d);
		})*/
		var postPromise = getPromise.pipe(function(d){
			//这里其实相当于已经默认履行了第一个promise了呢，
			//没有没有必要再提供 getPromise.done 这样子的调用了呢~
			console.log('第1个promise已经履行，参数是：'+d);
			return $postMock();
		});
		postPromise.done(function(d){
			console.log('第2个promise已经履行，参数是：'+d);
		})
	}


	/* 
	 * 研究案例4: 变化
	 * 上例中只有履行resolve的情况，本例中还列出了 reject 的情况
	 */
	bee.caseK4 = function(){

		function $getMock (){
			var df = new $.Deferred;
			window.setTimeout(function(){
				//df.resolve('参数1');
				df.reject('参数1');
			},1000);
			return df;
		}
		function $postMock (){
			var df = new $.Deferred;
			window.setTimeout(function(){
				df.resolve('参数2');
				//df.reject('参数2');
			},1000);
			return df;
		}
		var getPromise = $getMock();
		var postPromise = getPromise.pipe(function(d){
			console.log('第1个promise已经履行，参数是：'+d);
			return $postMock();
		},function(d){
			console.log('第1个promise已经拒绝，参数是：'+d);
			return $postMock();
		});
		postPromise.fail(function(d){
			console.log('第2个promise已经拒绝，参数是：'+d);
		})
		postPromise.done(function(d){
			console.log('第2个promise已经履行，参数是：'+d);
		})
	}


	/* 
	 * 研究案例5: 变化
	 * 这里履行了resolve、还有 notify ~
	 */
	bee.caseK4 = function(){

		//进度
		function $getMock (){
			var df = new $.Deferred;
			p = 0;
			var holder = window.setInterval(function(){
				p=p+20;
				if(p>100){
					df.resolve('完成');
					clearInterval(holder)
				}else{
					df.notify(p+'%');
				}
			},300);
			return df;
		}
		var getPromise = $getMock();
		var x = getPromise.pipe(function(data){
			return data;
		},null,function(data){
			console.log(data);
			return '反馈进度'+data;
		});
		x.done(function(r){
			console.log(r);
		})
		x.progress(function(r){
			console.log(r);
		})

		//其实可以发现 df.resolve(参数);就是一个发布订阅的模式的变体，
		//我们来看看发布订阅类似的该如何写，下面几种都是等价的，只是具体的实现有些小差异
		//pubsub.publish('resolve',参数);
		//emitter.emit('resolve',参数);
		//$('xx').trigger('resolve',参数);
	}




	/*******************************
	* 第2节 async.js
	********************************/

	/* 
	 * 研究案例9: forEachSeries
	 * 它的作用是将异步的迭代器按照顺序执行。
	 * 这里的关键是 next 这个函数。
	 * 是通过它的调用来维系顺序，然后才能继续 下一个迭代！
	 */
	bee.caseK9 = function(){

		async.forEachSeries(['兰陵王','程咬金'],iterator,function(err){
			l('两人已经复活');
		})

		function iterator(name,next){
			
			//模拟的异步行为
			window.setTimeout(function(){
				l('1秒后...'+name+'复活');
				next();
			},1000);
		}

		//对数组、集合，进行迭代器操作的方法又称之为 async.js的 “数据收集方法”。
		//比如这里 forEachSeries，还有mapSeries、reduceSeries
		//上面的是有顺序的，没顺序的：forEach、map、reduce。这些是异步的。
		//
		//在同步的迭代中也有forEach、map、reduce这些。
	}


	/* 
	 * 研究案例10: series方法
	 * 这个其实对第八章 bee.caseH4 的一个完美解决方案。
	 * 这里的callback扮演者极其重要的角色！
	 * 其实我在自己实现的时候，也有了这个思想的萌芽，但是还是不知道具体如何运用
	 * 另外，这里async.series传入参数结构更加的丰富，我想在内部应该更加好控制
	 */
	bee.caseK10 = function(){

		async.series({
		    one: function(callback) {
		        setTimeout(function() {
		        	l('1（异步）：一秒后出现');
		            callback(null);
		        }, 1000);
		    },
		    two: function(callback){
		        l('2（同步）：步骤1完毕，马上出现');
		        callback(null);
		    },
		    tree: function(callback) {
		        setTimeout(function() {
		        	l('3（异步）：步骤2完毕之后，再一秒后出现');
		            callback(null);
		        }, 1000);
		    },
		}, function(err, results) {});

		//以前我傻傻的分不清楚 forEachSeries 和 series 这些。
		//其实很明显，前者是对数组迭代的异步版本。（又分成有顺序、和无顺序），forEachSeries就是有顺序的异步版本的forEach。
		//series 和迭代无关，而是对一些列的任务的处理。
	}


	/* 
	 * 研究案例11: series方法 重组代码
	 * 这里对案例的代码重新组合，为的是将结构调整的更加像第八章 bee.caseH4 中的实现
	 */
	bee.caseK12 = function(){

		var serial = async.series

		function eat(callback){
			setTimeout(function() {
				l('吃小鱼！');
			    callback(null);
			}, 1000);
		}
		function run(callback){
			l('开始跑！');
			//对于同步代码而言，这个好像不是必要的?
			//其实是必须的，如果后面还有别的函数，至少可以起到传递的作用！所以还是不能少
			callback(null);
		}

		serial({
		    one: eat,
		    two: run
		});
	}


	return bee;
})(bee || {});


//bee.caseK2();


