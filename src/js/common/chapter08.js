/*******************************
* 第八章 模式
********************************/

var bee = (function(bee){

	/* 
	 * 研究案例1:jquery Deffer
	 * 我只有大概的实现思路，没有具体的细节
	 */
	bee.caseH1 = function(){

		function Deffer(){
			return new Deffer.prototype.init;
		}
		Deffer.prototype ={
			init:function(){
				this.arr = [];
			},
			done:function(fun){
				this.arr.push(fun);
			},
			resolve:function(){
				var callback = this.arr[0]?this.arr[0]:function(){
					l('没有什么要处理的');
				};
				return callback();
			}
		}
		Deffer.prototype.init.prototype = Deffer.prototype;

		var dfd = Deffer();
		dfd.done(function(){
			l(2);
		});
		window.setTimeout(function(){
			l(1);
			dfd.resolve();
		},1000);
	}


	/* 
	 * 研究案例2: 异步同步
	 * 这里目的是实现一个先异步后同步的链式操作
	 * 下面的操作是有误的，同步代码先得到执行，然后是异步的
	 */
	bee.caseH2 = function(){

		var fish = {
			eat:function(){
				setTimeout(function(){
					l('吃小鱼！');
				},1000);
				return this;
			},
			run:function(){
				l('开始跑！');
				return this;
			}
		}
		fish.eat().run();
	}


	/* 
	 * 研究案例3: 异步同步
	 * 这个是对案例2的解决方案。
	 * 这时候，无论eat中的行为是同步的还是异步的，都是支持的。
	 * 但是观察代码发现其实是把处理run的逻辑放到了eat的回调中。
	 * 这个时候，就算我最后不调用run方法，在eat中也被调用了，这是有问题的。
	 */
	bee.caseH3 = function(){

		var fish = {
			full:false,
			eat:function(){
				var that = this;
				setTimeout(function(){
					l('吃小鱼！');
					that.full = true;
					that.run();		
					that.full = false;
				},1000);
				return that;
			},
			run:function(){
				if(fish.full){
					l('开始跑！');
					return this;
				}
			}
		}
		fish.eat().run();
		//下面这样子的调用形式也会在内部调用run,这显然不是我们想要的。
		//fish.eat();
		
		/* 
		 * 仔细想来这个的实现，有点难度，我不妨先把promise的搞定
		 * 因为这里的模式，其实就是promise的了。
		 * $.get('xxx').then(function(){xxxx})...
		 */
	}


	/* 
	 * 研究案例4: 同步异步代码的串行
	 * 上面的模式，我暂时没有想到解决的办法，我们可以来试一试下面模式：
	 * 仔细看，这不就是async插件处理的事情！
	 * 我之前还研究过，可是等到自己写的时候，发现十分困难！
	 * 如何包装才好？
	 * 本例子不再提供解决方案，请继续往下看
	 */
	bee.caseH4 = function(){

		function eat(){
			setTimeout(function(){
				l('吃小鱼！');
			},1000);
		}
		function run(){
			l('开始跑！');
		}
		//这个是串行的方法，支持同步和异步的代码！如何实现呢？
		function serial(fn1,fn2){
			//这里该如何处理呢？？?
			//.....
		}
		serial(eat,run);
	}


	/* 
	 * 研究案例5: 同步异步代码的串行
	 * 我们知道 callback 是必不可少了，第十一章中第二个案例就给我很好的示范。
	 * 我再来自己尝试解决下，哪怕很蹩脚也行啊：
	 */
	bee.caseH5 = function(){

		function eat(callback){
			setTimeout(function(){
				l('吃小鱼！');
				callback()
			},1000);
		}
		function run(callback){
			l('开始跑！');
			callback();
		}

		//这个就可以实现目标，不过真的很蹩脚
		//底层的实现其实逃不出“回调”的处理呢！
		function serial(fn1,fn2){
			var cb = function(){
				fn2(function(){});
			}
			fn1(cb);
		}
		serial(eat,run);
	}


	/* 
	 * 研究案例6: 同步异步代码的串行
	 * 在案例5的基础上，多一个处理函数的时候，serial需要这样子处理：
	 */
	bee.caseH6 = function(){

		function eat(callback){
			setTimeout(function(){
				l('吃小鱼！');
				callback()
			},1000);
		}
		function run(callback){
			l('开始跑！');
			callback();
		}
		function eat2(callback){
			setTimeout(function(){
				l('吃大鱼！');
				callback()
			},500);
		}

		//这里是处理回调的地方，这样子写很死板，看看如何抽象呢？接着看案例7
		function serial(fn1,fn2,fn3){
			var cb2 = function(){
				fn3(function(){});
			}
			var cb = function(){
				fn2(cb2);
			}
			fn1(cb);
		}
		serial(eat,run,eat2);
	}

	/* 
	 * 研究案例7: 同步异步代码的串行
	 * 在案例6的基础上，能不能实现一个通用的实现呢？？
	 */
	bee.caseH7 = function(){

		function eat(callback){
			setTimeout(function(){
				l('吃小鱼！');
				callback(null)
			},1000);
		}
		function run(callback){
			l('开始跑！');
			callback(null);
		}
		function eat2(callback){
			setTimeout(function(){
				l('吃大鱼！');
				callback(null)
			},500);
		}

		//好歹还是写出来了，哈哈
		//这是个递归！要不是自己亲手写一写，还不知道有这样子的实现。
		function serial(){
			var i=0;
			//这个arguments是serial，在cb的匿名函数中使用的使用要用args，因为那个匿名函数自己也有arguments，这个和this用that替换是一样的道理。
			var args = arguments;
			var cb = function(err){
				if(err){
					throw new Error('有错误');
				}
				i++;
				var fun = args[i];
				if(fun) args[i](cb);
			}
			arguments[i](cb);
		}
		//serial(eat,run,eat2);
		//我们还可以试试更多的：
		serial(eat,run,eat2,eat);
	}


	/* 
	 * 研究案例8: promise
	 * 本来就个是放在案例2要实现的，结果搞不定，真是丢脸。
	 * 后来在实现完案例7之后，茅塞顿开，很快就搞定了这个。
	 */
	bee.caseH8 = function(){

		function promise(fn){

			//这是异步回调用要用的函数，期初就设定为一个啥也不做的函数。
			var myFun = function(){};

			var callback = function(data){
				myFun(data);
			};

			//异步方法的调用，在“回调”中呼起对myFun的使用
			fn(callback);

			var promiseObject = {
				then:function(dealFun){
					//这个是个同步的方法！在异步之前就配置好了，将来要回调的方法呢！
					myFun = dealFun;
				}
			}

			return promiseObject;
		}

		//核心实现全部依靠cb,这个和案例7的serial中的cb的作用几乎是一样一样的！！
		promise(function(cb){
			l('等待1秒...');
			setTimeout(function(){
				cb('xm94630');
			},1000);
		}).then(function(data){
			console.log('获取异步数据：'+ data);
		});

		//这个promise的实现还不够完美，比如，promise函数中传入的异步的到没有啥，如果是同步代码的话，
		//then中的函数就没有意义了。因为同步代码会先执行，那个myFun,还是个空函数呢~
		//优化的方法很简单：
		//上面的 fn(callback); 改写成：
		//setTimeout(function(){
		//	fn(callback);
		//},0);
		//caseH39中就由此优化
	}


	/* 
	 * 研究案例9: 案例3 解决方案一
	 * 这里用案例8中实现的promise的方法来解决。
	 */
	bee.caseH9 = function(){

		function promise(fn){
			var myFun = function(){};
			var callback = function(data){myFun(data);};
			var promiseObject = {then:function(dealFun){myFun = dealFun;}}
			fn(callback);
			return promiseObject;
		}

		var fish = {
			eat:function(cb){
				setTimeout(function(){
					l('吃小鱼！');
					cb('这条小鱼很鲜呢');
				},1000);
			},
			run:function(data){
				l('开始跑！');
				l('这里还可以传递数据呢，如果你想要的话:'+data);
			}
		}

		//需要声明的是，用promise实现的话，异步的eat就成为了run实现的依赖，只有eat成功了，run才能得以进行。
		//如果run是类似ajax的实现，那好需要有处理出错的情况。不过这里只是思路实现的示例，不是完整的实现。
		promise(fish.eat).then(fish.run);
		/*
		 * 用promise解决这个问题当然是妥妥的啦
		 * 不过呢，好像和我的初衷实现的结构不太一样哦，我希望这样实现：
		 * fish.eat().run();
		 * 上述到底有没有出路，我们再案例10里面实现下吧！
		 */
	}


	/* 
	 * 研究案例10: 案例3 解决方案二(无解的)
	 * 采用这样子的解决方案：fish.eat().run();是无解的
	 */
	bee.caseH10 = function(){

		var fish = {
			eat:function(){
				setTimeout(function(){
					l('吃小鱼！');
				},1000);
				return this;
			},
			run:function (){
				l('开始跑！');
				return this;
			}
		}
		fish.eat().run();

		/* 这个为何是无解的呢？
		 * 对于案例8的promise而言，他能够对eat、run方法进行包装。
		 * 而且eat和run函数本身并没有遭到破坏，最多在eat函数中嵌入了一个必要的cb回调（可成为一种规范，简单好记）。
		 * 另外被包装的是两个函数作为高阶函数传入，本身就灵活抽象，eat和run函数保持了很好的独立性。
		 *
		 * 这里的 fish.eat().run(); 写法，是站不住脚的：
		 * 这里的eat、run直接就是调用的形式了，没有像上面那样作为高阶存在（能被包装），没有被包装的余地。
		 * 同样，作为处理异步的极其重要的callback函数没有合适的切入口。
		 * 外层没有包装的余地，那么要处理异步同步的问题的逻辑必须放在eat、run本身中！
		 * 如此，eat、run本身就变复杂了，也不能把这部分逻辑抽出来。
		 *
		 * 所以，如果eat是异步的，run是同步的，那么run()必然是先行的，除非在run内部添加格外的处理逻辑，就像案例3那样。
		 * 但是和初衷矛盾。因此我认为这种模式是不能站住脚的。
		 * 如果有的话，我想早有人实现了吧。
		 * 我在观察观察。
		 */
	}

	/* 
	 * 研究案例11: noConflict 
	 * 插件防止冲突的逃生舱
	 * 这里展示的是覆盖的情况
	 */
	bee.caseH11 = function(){

		//这个整个就是一个插件
		;(function(window,undefined){
			//假设这个就是插件的内容
			var plugin = {name:'我是一个插件'};
			//插件挂载到全局
			if(typeof window =='object' && typeof window.document=='object'){
				window.plugin = plugin;
			}
		})(window);
		//全局中的那个插件
		l(plugin)
		//全局中有使用同名的，于是就发生了覆盖。
		plugin = 123;
		l(plugin)
	}

	/* 
	 * 研究案例12: noConflict 
	 * 插件防止冲突的逃生舱
	 * 这里的noConflict实现是我自己想的，所以...
	 * 可能还会有漏洞吧，所以我们还要参考$中noConflict的实现！
	 */
	bee.caseH12 = function(){

		//这个整个就是一个插件
		;(function(window,undefined){
			//假设这个就是插件的内容
			var plugin = {
				name:'我是一个插件',
				noConflict:function(){
					return plugin;
				}
			};
			//插件挂载到全局
			if(typeof window =='object' && typeof window.document=='object'){
				window.plugin = plugin;
			}
		})(window);
		//全局中的那个插件
		l(plugin)
		//使用了一个别名进行逃生
		var newP = plugin.noConflict();
		//这个时候全局中使用了plugin，也没有关系
		//我们的插件名字已经改成了newP
		plugin = 123;
		l(plugin)
		l(newP)
	}

	/* 
	 * 研究案例13: 【BOSS】jq 的 noConflict 
	 * 观察jq中的实现，确实比我的高明多了。逻辑更加的谨慎。
	 * 1）我上面的问题：如果把plugin插件部分整体移动到最后，
	 * 那么原来的plugin变量中的值就消失了。而在这里，被备份了
	 * 2）这里的if条件的使用，逻辑很严密。
	 */
	bee.caseH13 = function(){

		;(function(window,undefined){

			//理解 noConflict() 须知几点：
			//1) jQuery文件应该在其它冲突库文件之后导入
			//2) 那个库也是用$作为全局变量的。

			// 如此一来，我们知道这里的 _$ 是保存了其他库的 备份！！
			// (之前我一直有误解，以为是对jquery自己的备份)
			_$ = window.$;
			var jQuery = {
				name:'我是一个插件',
				noConflict:function(){
					//这个if的作用是：因为从下一if看，一旦jquery被引入，全局的$就是jQuery了。
					//于是条件成立，进入内部，把原来备份的那个冲突的库交给全局的$去引用。
					if(window.$===jQuery){
						window.$ = _$;
					}
					//2019 这里返回jQuery的实例，说明，我们还可以自定义，比如： var jq = $.noConflict();
					return jQuery;
				}
			};
			if(typeof window =='object' && typeof window.document=='object'){
				window.$ = jQuery;
			}
		})(window);

		// 大概流程：
		// 1) 首先存在其他库的$
		// 2) 然后引入jquery，备份了原来的$，同时把全局的那个$设置成自己
		// 3) 调用 noConflict 的时候，把全局的$交还给那个库，同时自己逃生到新的变量

	}

	/* 
	 * 研究案例14: undersoce 结构
	 * 上面研究了 jQuery,其实也研究了 jQuery 最外层的大的结构
	 * 那么我们来看看 undersoce 用了什么结构呢？
	 */
	bee.caseH14 = function(){

		(function(){l('...')})();       //jquery
		(function(){l('...')}());		//？
		//function(){l('...')}();		//这个时候错误的
		(function(){l('...')}.call());  //underscore
		
		/* 这个三种基本上类似的，只有小小的区别
		 * 第1、2两种意思是一样的，那个括号是不可以少的，第3种就不行了。
		 * 第3种和前面两种是一样的，只会用call来进行调用了而已，
		 * call比较灵活，可以执行this的指向，仅此而已
		 */
	}

	/* 
	 * 研究案例15: undersoce 结构
	 */
	bee.caseH15 = function(){

		(function(){
			l(this);
		}.call(this));
		/* 
		 * 看这个例子，call传入的this，其实指代的就是bee
		 * 如此，匿名函数内部的this，都指代的就是bee了。
		 * underscore使用这样子的结构，this作为上下文环境，
		 * 相对比较的灵活，当它用在node的时候，这个this就是global了！！
		 */
	}

	/* 
	 * 研究案例16: 自己实现 undersoce 中的 conflict
	 * 这个是我根据之前的总结自己来实现的一个。
	 * 真实的实现看案例17
	 */
	bee.caseH16 = function(){

		this._ = '我是本来就存在的变量！';
		(function(){
			var root = this;
			var clone = root._
			var _ = {
				name:'我是插件哦',
				conflict:function(){
					if(root._===_){
						root._ = clone;
					}
					return _;
				}
			};
			if(typeof this==='object'){
				root._ = _;
			}
		}.call(this));

		var new_ = this._.conflict();
		l(this._);
		l(new_);
	}

	/* 
	 * 研究案例17: undersoce 中的 conflict
	 * 可以发现真实_中的实现和我的推测也是相差无几的。
	 */
	bee.caseH17 = function(){

		this._ = '我是本来就存在的变量！';
		(function(){
			var root = this;
			var previousUnderscore = root._
			var _ = {
				name:'我是插件哦',
				conflict:function(){
					root._ = previousUnderscore;
					return this;
				}
			};
			//注意，这里只是支持了浏览器端的一种全局抛出。
			//实际上，_还对node、amd等做了支持！
		    root._ = _;
		}.call(this));

		var new_ = this._.conflict();
		l(this._);
		l(new_);
	}

	/* 
	 * 研究案例18: 函数声明 和 函数表达式
	 * 这里看出，作为构造函数来用，这两种形式没有大的区别
	 * 当有别的变量（如xxx,yyy）对构造函数引用的时候，实例对象也是这些变量的实例。
	 */
	bee.caseH18 = function(){

		function Fish(age){
			this.age = age;
		}
		var Bird = function(age){
			this.age = age;
		}
		var xxx = Fish;
		var yyy = Bird;

		var f = new xxx(123);
		l(f)
		//需要说明的是，在浏览器中log显示的时候，constructor是命名函数Fish，而不是xxx.
		//虽然在用instanceof的时候都是对的。
		l(f.constructor)           
		l(f instanceof Fish);
		l(f instanceof xxx);

		var b = new yyy(123);
		l(b)
		l(b.constructor)       //在函数表达式子的时候，这个constructor是一个匿名函数，既不是yyy、也不睡Bird（因为这个两个其实都是表达式引用）
		l(b instanceof Bird);
		l(b instanceof yyy);
	}

	/* 
	 * 研究案例19: 工厂模式
	 */
	bee.caseH19 = function(){

		function Fish(option){
			this.age = option.age || 1;
			this.weight = option.weight || 100;
		}
		function Bird(option){
			this.age = option.age || 1;
			this.height = option.height || 100;
		}

		var Factory = function(){}
		Factory.prototype.type = Fish;
		Factory.prototype.create = function(option){
			if(option.type == 'Bird'){
				this.type = Bird;
			}else{
				this.type = Fish;
			}
			return new this.type(option);
		}

		var factory = new Factory();

		var myBird = factory.create({
			type:'Bird',
			age:4,
			height:300
		});
		l(myBird)
		var myFish = factory.create({
			type:'Fish',
			age:2,
			height:300   //Fish构造的时候是不需要有这个height属性的，也没关系。而没传入的weight会采用默认的值。
		});
		l(myFish)
	}

	/* 
	 * 研究案例20: 子类工厂
	 */
	bee.caseH20 = function(){

		function Fish(option){
			this.age = option.age || 1;
			this.weight = option.weight || 100;
		}
		function Bird(option){
			this.age = option.age || 1;
			this.height = option.height || 100;
		}

		//工厂
		function Factory(){}
		Factory.prototype.type = Fish;
		Factory.prototype.create = function(option){
			//这里的时候就不需要type的处理了
			//因为在子类工厂就已经指定好类型了。
			/*if(option.type == 'Bird'){
				this.type = Bird;
			}else{
				this.type = Fish;
			}*/
			return new this.type(option);
		}

		//子类工厂
		var BirdFactory = function(){}
		BirdFactory.prototype = new Factory;
		BirdFactory.prototype.type = Bird;
		var bfactory = new BirdFactory();

		var myBird = bfactory.create({
			age:10,
			height:660
		});
		l(myBird)
		l(myBird instanceof Bird)

		//在这个例子中看看 bfactory 的构造函数吧~ 结果是Factory呢
		//这个是因为“BirdFactory.prototype = new Factory;”中是对原来的原型进行了覆盖。
		l(bfactory.constructor)
	}

	/* 
	 * 研究案例21: $.holdReady 的实现原理
	 */
	bee.caseH21 = function(){
		var a = 0;
		var d = $.Deferred();
		function hold(b){
			if(b){a++;}else{
				a--;
				if(a<=0){ 
					a=0;
					d.resolveWith();
				}
			}			
		}

		setTimeout(function(){
			d.promise().done(function(){
				l('执行了');
			})
		},300)

		//hold住了两次，释放两次最后还是会被执行的。
		hold(true);
		hold(true);
		hold(false);
		hold(false);


		//第一次，在学习jquery源码的时候，看到这个$.holdReady的时候，惊呆了。
		//现在看来其实就是 promise 的应用吧
		//hold函数中的计数器，其实就是为了满足“d.resolveWith();”这个（和异步的执行是同样的道理。那个是通过延时，这个是通过计数。）
		//最后都是执行done中的那个函数。（done就好比我H8中实现的then）
	}

	/* 
	 * 研究案例22: $.holdReady 的实现原理 
	 * 应用
	 */
	bee.caseH22 = function(){
		var a = 0;
		var d = $.Deferred();
		function hold(b){
			if(b){a++;}else{
				a--;
				if(a<=0){ 
					a=0;
					d.resolveWith();
				}
			}			
		}
		function promiseFun(fn){
			setTimeout(function(){
				d.promise().done(function(){
					l('执行了');
				})
			},200)
		}

		hold(true);
		setTimeout(function(){
			l('我被延时了1000秒，但是还是我先执行哦');
			hold(false);
		},1000)
		promiseFun();
	}

	/* 
	 * 研究案例23: 22案例的扩展
	 * 使用我自己的promise，也是可以方便实现同上功能
	 */
	bee.caseH23 = function(){

		//这个是我在bee.caseH8案例中实现的
		function promise(fn){
			var myFun = function(){};
			var callback = function(data){myFun(data);};
			fn(callback);
			var promiseObject = {
				then:function(dealFun){
					myFun = dealFun;
				}
			}
			return promiseObject;
		}

		promise(function(cb){
			setTimeout(function(){
				l('我被延时了2000秒，但是还是我先执行哦');
				cb();
			},2000);
		}).then(function(){
			setTimeout(function(){
				l('执行了');
			},1000);
		});
	}

	/* 
	 * 研究案例24: jquery版本的promise  
	 * 自己实现下，记得和 bee.caseH08 的对比
	 * 这个版本我没有参考过jquery的源码，花了5分钟写出来的，以后在研究源码的时候
	 * 看看自己是不是和他的一致。
	 * 另外从思考上来看，我现在思路比以前清晰了，很多原理能够马上领悟和实现。
	 */
	bee.caseH24 = function(){
		function Deferred(){
			var dealWithFun = function(){};
			return {
				promise:function(){
					return {
						done:function(fn){
							dealWithFun = fn;
						}
					}
				},
				resolveWith:function(data){ //2017-03-06补充：添加了data
					dealWithFun(data);
				}
			}
		}

		//应用
		var d = Deferred();

		//2017-03-06补充：这个异步的时候是对的，当为同步的时候，执行的函数是 dealWithFun 默认的那个空函数
		//所以还是有缺陷的。合理的话，应该还是能正常调用我指定的回调的！
		//我现在思路是有的：可以参考 bee.caseO10 案例中的 ‘惰性’的 概念！
		setTimeout(function(){
			l('延时1000，执行');
			d.resolveWith(123);
		},1000);

		d.promise().done(function(data){
			l(data)
			setTimeout(function(){
				l('延时500，执行');
			},500);
		});
	}

	/* 
	 * 研究案例25: 抽象工厂
	 * 这个可以结合“研究案例19”来看
	 * 在案例19的时候，我就想到：这种工厂模式，和构造函数的耦合度视乎很高的样子。
	 * 如何来自己灵活的配置需要在内部实例化的那个构造函数呢？
	 * 抽象工厂就可以做到。这种模式视乎在新浪的项目中也有涉及。
	 *
	 * 这个是我自己实现的，和书上的对比了下，几乎是一样，就算掌握啦
	 */
	bee.caseH25 = function(){

		//构造函数
		function Fish(option){
			this.age = option.age;
			this.weight = option.weight;
		}
		Fish.prototype.run = 1000;

		function Bird(option){
			this.age = option.age;
			this.weight = option.weight;
		}
		Fish.prototype.fly = 900;

		//抽象工厂
		function absoluteFactory(){
			var arr ={};
			return {
				register:function(name,myConstructor){
					if(myConstructor.prototype.run){ //这有符合这个规范的才能被注册哦
						arr[name] = myConstructor;
					}
					//这个有没有都无所谓了
					return this;
				},
				getObject:function(name,opts){
					return (thisConstructor = arr[name]) ? new thisConstructor(opts) : null;
				}
			}
		}

		//鱼的工厂
		var myFactory = absoluteFactory();
		myFactory.register('myFish',Fish);
		var fish = myFactory.getObject('myFish',{
			age:99,
			weight:299
		});
		l(fish)

		//鱼的工厂
		var myFactory2 = absoluteFactory();
		myFactory2.register('myBird',Bird);
		var bird = myFactory2.getObject('myBird',{
			age:11,
			weight:22
		});
		//这里的鸟的实例获取失败，是因为register中必须有“.prototype.run”的实现才行~
		l(bird)
	}

	/* 
	 * 研究案例26: 工厂模式再思考
	 * 之前我们已经学习了工厂模式、子类工厂、抽象工厂
	 * 在上面的工厂中，工厂本身就是个构造函数，通过实例化一个实例工厂，才能创建真正的实例对象。
	 * 那么工厂是构造函数，和直接是工厂对象会有何区别呢？
	 * 其实就是类和对象的区别。工厂是构造函数，就可以有很多的独立的工厂呗！
	 *
	 * 下面是react中的工厂。
	 * myFactory = React.createFactory(Text);  //React.createFactory相当于是工厂的构造函数
	 * myFactory({})  //这里获取的工厂实例和之前的案例中不同，哪里是对象，通过调用create在创建目标，而这里是函数，通过直接调用完实现。
	 * 好吧，反正都一样的，灵活。这里就实现下吧~
	 */
	bee.caseH26 = function(){

		//构造函数
		function Fish(option){
			this.age = option.age;
			this.weight = option.weight;
		}
		function Bird(option){
			this.name = option.name;
		}

		React = {
			createFactory:function(klass){
				return function(options){
					return new klass(options);
				}
			}
		}

		var myFactory  = React.createFactory(Fish);
		var myFactory2 = React.createFactory(Bird);
		var fish  = myFactory ({age:99,weight:100});
		var bird  = myFactory2({name:'xm'});
		var bird2 = myFactory2({name:'jy'});
		l(fish);
		l(bird);
		l(bird2);	
	}

	/* 
	 * 研究案例27: React 的模式
	 */
	bee.caseH27 = function(){

		//构造函数
		function Fish(opts){
			this.props = opts;
			this.render = function(){
				l(this.props.name);
				return "开始渲染！";
			}
		}

		React = {
			createFactory:function(klass){
				return function(options){
					return new klass(options);
				}
			}
		}
		ReactDOM = {
			render:function(obj){
				l(obj.render());
			}
		}


		var myFactory  = React.createFactory(Fish);
		ReactDOM.render( myFactory({name:'XiaoYu'}) );
	}

	/* 
	 * 研究案例28: React 的模式 继续深入
	 * 这个案例和 React 的大面上的实现已经非常的类似了。
	 * 不过这里，Fish这个类，还是通过用户自己来写的，能不能更加高级一点呢，我们来看案例29
	 */
	bee.caseH28 = function(){

		//模拟react中两个核心方法
		var React = {
			createFactory:function(klass){
				return function(options){
					return new klass(options);
				}
			},
			DOM:{
				p:function(content){
					var newEle = document.createElement('p');
					var text = document.createTextNode(content);
					newEle.appendChild(text);
					return newEle;
				}
			}

		}
		var ReactDOM = {
			render:function(obj,element){
				$(element).html( obj.render() );
			}
		}
		
		//构造函数
		function Fish(opts){
			this.props = opts;
			this.render = function(){
				l(this.props.name);
				return React.DOM.p('我是组件:'+this.props.name);
			}
		}

		//创建组件
		var myFactory  = React.createFactory(Fish);
		$(function(){
			ReactDOM.render( myFactory({name:'XiaoYu'}) , document.getElementById('container'));
		})
	}

	/* 
	 * 研究案例29: React 的模式 
	 * 这个就相对比较完美了
	 *
	 * 但是 ReactDOM.render 外层还有个jquery的dom加载的玩样，这个逻辑应该封装起来。
	 * 在优化上面的问题的前，我们就先来看看真正的Rect中是如何的？
	 *
	 * 我试验的结果是：也是和我存在一样的问题，可以通过下面的方法来规避：
	 * 1.在body标签关闭之前使用js.
	 * 2.把渲染的行为放在异步中，比如setTimeout
	 */
	bee.caseH29 = function(){

		//模拟react中两个核心方法
		var React = {
			createFactory:function(klass){
				return function(options){
					return new klass(options);
				}
			},
			DOM:{
				p:function(content){
					var newEle = document.createElement('p');
					var text = document.createTextNode(content);
					newEle.appendChild(text);
					return newEle;
				},
				div:function(content){
					var newEle = document.createElement('div');
					var text = document.createTextNode(content);
					newEle.appendChild(text);
					return newEle;
				}
			},
			createClass:function(obj){
				return function(opts){
					this.props = opts;
					this.render = obj.render?obj.render:function(){};
				}
			}
		}
		var ReactDOM = {
			render:function(obj,element){
				element.innerHTML = '';
				element.append(obj.render());
				//等效于:
				//$(element).html(obj.render());
			}
		}
		
		//构造函数
		var Fish = React.createClass({
			render:function(){
				return React.DOM.p('我是组件:'+this.props.name);
			}
		});
		var Bird = React.createClass({
			render:function(){
				return React.DOM.div(this.props.name+'的体重是'+this.props.weight);
			}
		});
		var Counter = React.createClass({
			render:function(){
				return React.DOM.div('即时开始：'+this.props.time);
			}
		});

		//创建组件
		var myFactory  = React.createFactory(Fish);
		var myFactory2 = React.createFactory(Bird);
		var myFactory3 = React.createFactory(Counter);
		$(function(){
			ReactDOM.render( myFactory({name:'XiaoYu'}) , document.getElementById('container'));
			ReactDOM.render( myFactory({name:'DaYu'}) , document.getElementById('container2'));
			ReactDOM.render( myFactory2({name:'XiaoNiao',weight:'200g'}) , document.getElementById('container3'));
			var n = 0;
			window.setInterval(function(){
				n+=100
				ReactDOM.render( myFactory3({time:n}) , document.getElementById('container4'));
			},100)
		})
	}

	/* 
	 * 研究案例30: getElementById
	 * getElementById只有等待dom加载完毕才能获取
	 * 除了使用 $() 和 DOMContentLoaded时间，使用异步方法也是确保DOM加载完毕的方法
	 */
	bee.caseH30 = function(){
		//异步的优先级要低于addEventListener事件的触发！
		window.setTimeout(function(){
			l(1)
			l(document.getElementById('container'))
		},0)
		document.addEventListener("DOMContentLoaded",function(){
			l(2)
			l(document.getElementById('container'))
		})
	}

	/* 
	 * 研究案例31: innerHTML
	 */
	bee.caseH31 = function(){
		window.setTimeout(function(){
			var ele = document.getElementById('container');
			var ele2 = document.getElementById('container2');
			var ele3 = document.getElementById('container3');

			//innerHTML的用法：
			//注意他不是一个方法，我一直以为是方法的调用形式！
			ele.innerHTML = '你好吗';

			var newEle = document.createElement('p');
			var text = document.createTextNode('我是动态创建的DOM元素');
			newEle.appendChild(text);
			//innerHTML 添加元素对象的话视乎是不是我想要的
			ele2.innerHTML = newEle;

			ele3.innerHTML = '';
			ele3.append(newEle);
			//等效于:
			//$(ele3).html(newEle);

		},0)
	}

	/* 
	 * 研究案例32: React 的模式 【BOSS】
	 * 这个还是很有成就感的！哈哈
	 */
	bee.caseH32 = function(){

		//模拟react中两个核心方法
		var React = {

			createClass:function(obj){
				var _state = {};
				return function(opts){
					this.CID = Math.random();
					this.state = _state;
					this.state = {};
					this.flag = true;
					this.getInitialState = function(){
						return this.state;
					}
					//这里要做值的监听，如果发生变化的话需要重新渲染
					//也就是说这里要有一个值变化的判断
					this.setState = function(obj){
						var str = JSON.stringify(this.state);
						$.extend(this.state,obj);
						var str2 = JSON.stringify(this.state);
						if(str!==str2){
							ReactDOM.reRender(this.CID);
						}
					}
					this.props = opts;

					//只有这样子，obj中的所有属性才能得到全部的扩展
					//如果opts中就包含了 setState 的方法（或其他），就会发生覆盖。
					for(var k in obj){
						this[k] = obj[k];
					}
				}
			},

			createFactory:function(klass){
				var FID = Math.random();
				return function(options){
					var instance = new klass(options);
					instance.id = FID+'-'+ instance.CID ;
					//getInitialState 是用来初始化 state，而且只会被调用一次
					if(instance.flag){
						instance.flag = false;
						$.extend(instance.state,instance.getInitialState());
					}
					return instance;
				}
			},
			
			DOM:{
				p:function(content){
					var newEle = document.createElement('p');
					var text = document.createTextNode(content);
					newEle.appendChild(text);
					return newEle;
				},
				div:function(content){
					var newEle = document.createElement('div');
					var text = document.createTextNode(content);
					newEle.appendChild(text);
					return newEle;
				}
			}

			
		}

		var ReactDOM = {
			
			lists:{},

			reRender:function(cid){
				this.render(this.lists[cid][0],this.lists[cid][1]);
			},
			
			render:function(obj,element){

				//通过实例id，记录经过渲染的那些dom
				this.lists[obj.id.split('-')[1]] = [obj,element]; 

				element.innerHTML = '';
				element.append(obj.render());
			}

		}
		
		//构造函数
		var Fish = React.createClass({
			getInitialState:function(){
				l(this.id);
				return {n:0};
			},
			clickFun:function(){
				var x = this.state.n;
				x += 1; 
				this.setState({n:x});
			},
			render:function(){
				var ele = React.DOM.p(this.props.name+' 组件，被点击了: '+this.state.n+' 次');
				ele.addEventListener('click',this.clickFun.bind(this));
				return ele;
			}
		});
		//创建组件
		var myFactory  = React.createFactory(Fish);
		var myDom = myFactory({name:'XiaoYu'});
		var myDom2 = myFactory({name:'XiaoYu2'});
		$(function(){
			ReactDOM.render( myDom , document.getElementById('container'));
			ReactDOM.render( myDom2 , document.getElementById('container2'));
		})

		//20191209 这个案例可以
	}


	/* 
	 * 研究案例33: 还没有 append 的元素的事件绑定
	 * 结果居然是可以绑定事件的！！
	 */
	bee.caseH33 = function(){
		var newEle = document.createElement('div');
		var text = document.createTextNode('我是动态创建的元素，点击我看看！');
		newEle.appendChild(text);
		newEle.addEventListener('click',function(){
			alert(123);
		})
		$(function(){
			document.getElementById('container').append(newEle);
		})
		
	}

	/* 
	 * 研究案例34: mockschema
	 * 这里研究的是一个简单的插件 mockschema 中的两个函数是如何通信的。
	 */
	bee.caseH34 = function(){

		function createSchema(obj){
			//从 mock 函数的使用来看，并没有和 createSchema 交互。
			//可以见一定是内部创建了一个全局的变量。
			globalMockObject = obj;
		}
		function mock(name,n){
			var obj,arr=[];
			var obj = (obj = globalMockObject[name])?obj:{};
			for(var i=0;i<n;i++){
				//其实这里应该push的是obj的一个副本，我为了方便起见，就不写那么麻烦了。
				arr.push(obj);
			}
			return arr;
		}
		createSchema({
		  fish: {
		    age: 25,
		    name:'lala'
		  }
		});
		var arr = mock('fish', 10);
		l(arr);

		/* 结论：
		 * 由此可见，连个函数没有直接交换数据，必定有一个全局的变量来进行交换。
		 * 但是这样子的设计模式，并不是很高明，因为我们不希望把插件的状态泄露到全局。
		 * 
		 * 20191209
		 * 恩，这个 mockschema 是用来做mock假数据的。可以在npm上先看下。
		 */
	}

	/* 
	 * 研究案例35: 正则的练习
	 * 为案例36做准备
	 */
	bee.caseH35 = function(){
		var str1 = '<div class></div>';
		var str2 = '<div class = ""></div>';
		var str3 = '<div class = \'\'></div>';
		var str4 = '<div class = "red"></div>';

		var reg = /div.+class\s+=\s+([\'\"])(.*)\1|div.+class/;
		l(reg.exec(str1))
		l(reg.exec(str2))
		l(reg.exec(str3))
		l(reg.exec(str4))
	}


	/* 
	 * 研究案例36: 模拟 npm插件 cheerio 的实现
	 */
	bee.caseH36 = function(){
		function load(htmlStr){
			var html = htmlStr;
			function jquery(selector){

				//正则匹配 selector 对应的 class 部分
				//// \3 中\要转义
				var reg = new RegExp('(<\s*('+selector+').+class\s*=\s*)([\"\'])(.*)(\\3)(>)');   
				var arr = reg.exec(html);

				return {
					addClass:function(myClass){
						htmlStr.replace()
						l('在“'+selector+'”上添加“'+myClass+"”");

						//正则处理文案
						if(arr==null){
							//没有class，则直接添加class
							html = html.replace(new RegExp('<\s*'+selector),'<'+selector+' class="'+myClass+'"')
						}else{
							//已经有了class，在class中追加
							html = html.replace(reg,function(a,b,c,d,e,f,g){

								return b+d+e+' '+myClass+f+g;

							});
						}

						return this;
					}
				}
			}
			jquery.html = function(){
				return html;
			}
			return jquery;
		}
		$ = load('<div class=\'xx\'><p>你好</p></div>');
		$('div').addClass('myb').addClass('myb2');
		$('p').addClass('red');
		l($.html());

		//20191209 可以的
	}


	/* 
	 * 研究案例37: factory function 
	 * 工厂函数，其实就是之前出现过的工厂模式
	 * 这里主要需要强调的是，他是由闭包的效用产生的。
	 */
	bee.caseH37 = function(){
		var counter = function(){
			var i=1000;
			return {
				increment:function(){
					i++;
					l(i);
				}
			}
		}
		var c = counter();
		c.increment();
		c.increment();
		c.increment();
	}

	/* 
	 * 研究案例38: 继续深入 promise 模式
	 * 在之前的案例中（bee.caseH8），我们已经实现了如下模式：
	 * 
	 * promise(异步获取数据).then(处理数据函数)
	 *
	 * 这里的技术核心是在promise传入的函数的参数cb，呼起了回调的作用。
	 * 这个思路是参照 async.js 中的思想
	 *
	 * 那么我能不能做的更加的优秀呢？即上面说的cb，不是固定的参数。是不是更加的灵活呢？我们来试一试吧~

	 * caseH24中和这个很类似了。
	 */
	bee.caseH38 = function(){

		function yanshiFactory(){

			var callback = function(){
				l('数据还没有呢~');
				return;
			};

			return {
				resolve:function(myData){
					setTimeout(function(){
						callback(myData);
					},0);
				},
				promise:function(){
					return {
						done:function(fun){
							callback = fun;	
						}
					}
				}
			};
		}

		var yanshi = yanshiFactory();

		setTimeout(function(){
			//模拟异步获取数据
			var myAjaxData = 'ajax数据';
			yanshi.resolve( myAjaxData );
		},2000);
		
		var promise = yanshi.promise();
		promise.done(function(data){
			l('获取延时数据成功:'+data);
		});

		//完美实现~
		//其实这就是和jquery中的deffer延时对象是一样的用法。
	}

	/* 
	 * 研究案例39: 继续深入 promise 模式
	 * 这里我优化下调用结构，这样子看上去比较好理解。
	 */
	bee.caseH39 = function(){

		//这部分保持不变
		function yanshiFactory(){

			var callback = function(){
				l('数据还没有呢~');
				return;
			};

			return {
				resolve:function(myData){
					//2017-03-06注释：这里使用了setTimeout，导致，所有的行为都变成了异步的。
					//话说回来，promise本来就是异步。
					//如果把setTimeout去了，支持同步代码的时候，就会出现问题的！
					//能否出一个支持同步行为的呢？也许caseO10能给点提示
					setTimeout(function(){
						callback(myData);
					},0);
				},
				promise:function(){
					return {
						done:function(fun){
							callback = fun;	
						}
					}
				}
			};
		}

		//一个被包装了的异步行为
		//返回promise
		function go(){
			var yanshi = yanshiFactory();
			setTimeout(function(){
				//模拟异步获取数据
				var myAjaxData = 'ajax数据';
				yanshi.resolve( myAjaxData );
			},2000);
			return yanshi.promise();
		}
		var myGo = go();
		myGo.done(function(data){
			l('获取延时数据成功:'+data);
		});

		//这种模式其实在jquery中非常常见
		//比如 $.get('...').done(function(){...});
		//这个例子做完之后，我连对jquery中的所谓的promise对象也认识很深刻了！！所以基础真的很重要。

		//这里函数的结构是：
		//go().done();

		//其实和我H8中自己实现的promise的调用结构是一致的，只是包装的略有不同：
		//promise(xxx).then();  
		//这里 异步函数xxx 通过传入 promise 中这种方法。go函数那个是，直接把异步函数放在 go 函数体内。
		//两者的关系就好比：
		//(function go(){alert(1)})()
		//(function promise(fun){fun()})(function(){alert(1)})
	}


	/* 
	 * 研究案例40: 包装模式
	 * 不知道如何命名，就暂时如此称呼吧。
	 * 这种模式是在我常用的模式上（包括本项目本身就是如此），进行深入。
	 * 这种模式在 什么CMD、AMD 的模块的兼容中非常常见。
	 * 另外，使用webpack，进行包装一些代码的时候，也常常会有这样子的模式。
	 * 并且，在极端的情况下，这种嵌套的层次可能还会更加的深。
	 * 这里主要是掌握它的思路。以后遇到这种类似的嵌套，要能快速的辨别和使用。
	 */
	bee.caseH40 = function(){

		;(function(root,module){
			//这样子就在全局中创建了一个bee2
			l('add bee2 to window');
			root.bee2 = module;
		})(window,(function(global){
			var bee = (function(bee){
				bee.xxx={a:123}
				return bee;
			})(bee||{});
			return bee;
		})(window))

	}

	/*
	 * 研究案例41: 工厂 类工厂
	 * 这个例子是 Eric Elliott 写的，我来学习下。
	 */
	bee.caseH41 = function(){

		//这里的AutoMaker，是汽车制造商的意思（就是"工厂"）
		//auto 这个词汇在易车公司中不是经常出现么~
		const AutoMaker = {
			Fish(myBundle){
				return Object.create(this.bundle[myBundle]);
			},
			bundle:{
				shark:{
					width: 9,
					eat:function(fishName){
						l("鲨鱼吃了："+fishName)
					}
				},
				whale:{
					width: 20,
					eat:function(fishName){
						l("鲸鱼吃了："+fishName)
					}
				}
			}
		}

		const shark = AutoMaker.Fish('shark');
		const whale = AutoMaker.Fish('whale');
		shark.eat('章鱼');
		whale.eat('小虾米');

		//作者说，这种工厂，在很多人调用的时候，都会写成下面这样子的。作者的观点是：
		//Unfortunately, in JavaScript, switching from a constructor or class to a factory is a breaking change
		//但是我没有觉得，我之前也罗列了不少的工厂，我觉得没有他说的那么严重吧？
		//另外在这种工厂中，鱼的宽度不能设置吧？
		
		//const shark = new AutoMaker.Fish();
		
		//Eric Elliott 的文章中也列出了不少工厂的好处：
		//1） Return any arbitrary object and use any arbitrary prototype
		//2） No refactoring worries
		//3） No `new`
		//4） Standard `this` behavior
		//5） No deceptive `instanceof`
		//4） Some people like the way `myFoo = createFoo()` reads
		//这这些可以作为我自己总结的补充吧。
	}
	

	/*
	 * 研究案例42: 完美的 promise !
	 */
	bee.caseH42 = function(){
		//参见 caseO13 案例
	}

	/*
	 * 研究案例43: 最简单的 promise !
	 */
	bee.caseH43 = function(){
		window.setTimeout(function(){
			feature();
		},1000);
		
		//这个feature函数，可以认为是promise的基础的形态。
		function feature(){
			l('promise被履行了');
		}
	}


	/*
	 * 研究案例44: jquery 中的动画也实现了promise的接口
	 */
	bee.caseH44 = function(){
		$(function(){
			pro = $('#myBtn').fadeOut(500).fadeIn(500);
			$.when(pro).done(function(x){console.log('完成动画')})
		})
	}




	// 20191209 这个章节，看的是有点累。


	return bee;
})(bee || {});






//bee.caseH41();









