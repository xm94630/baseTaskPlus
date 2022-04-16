var l = function(){
	return console.log.apply(console,arguments);
}

var bee = (function(bee){
	

	/********************************************
	 * 第1章节所用实例
	 * 回顾的时候也要做讲解
	 ********************************************/

	// 实例1：curry 函数
	bee.test1 = function(){
		
		function curry(fn){
			return function(n){
				return fn(n);
			}
		}
		l(parseInt('11',0));
		l(parseInt('11',1));
		l(parseInt('11',2));
		l(['11','22','123'].map(parseInt));
		l(['11','22','123'].map(curry(parseInt)));
	}
	// 实例2：self函数
	bee.test2 = function(){
		var x = 123;
		var arr = [1,2,3];
		function self(n){
			return n;
		}
		function double(n){
			return 2*n;
		}
		l(x==self(x));
		l(arr.map(self));
		l(arr.map(double));
	}








	/********************************************
	 * 第2章节中间所用
	 * 讲谓词的时候用
	 ********************************************/

	//实例3：高阶函数、谓词函数
	bee.test3 = function(){
		
		[0,2,-108,-6,43].sort();
		[0,2,-108,-6,43,-1].sort();

		//传入比较器函数，这就高阶的行为
		[0,2,-108,-6,43,-1].sort(function(x,y){
			if(x<y) return -1;
			if(x>y) return 1;
			return 0;
		});
	}
	//实例4：高阶函数、谓词函数(对实例6的改造)
	bee.test4 = function(){
		
		//吧这部分抽象出来，我们还会在别出用到这个逻辑
		//但是问题是，这个比较器耦合度很高啊，不够通用
		function lessThanOrEqual(x,y){
			if(x<y) return -1;
			if(x>y) return 1;
			return 0;
		}
		l([0,2,-108,-6,43,-1].sort(lessThanOrEqual));

		//这个比较器单独用的话.........
		if(lessThanOrEqual(1,1)){
			l('小于等于');
		}else{
			l('大于');
		}	
	}
	//实例5：高阶函数、谓词函数(对实例7的改造)
	bee.test5 = function(){
		
		function lessThanOrEqual(x,y){
			return x<=y;
		}

		//谁能告诉我做一个什么操作就能ok
		l([0,2,-108,-6,43,-1].sort(lessThanOrEqual));

		//这个比较器单独用的话.........
		if(lessThanOrEqual(1,1)){
			l('小于等于');
		}else{
			l('大于');
		}
	}
	//实例6：高阶函数、谓词函数(对实例8的改造)
	bee.test6 = function(){
		
		function lessThanOrEqual(x,y){
			return x<=y;
		}

		function comparator(pred){
			return function(x,y){
				/*if(pred(x,y)){
					return -1;
				}else if(pred(y,x)){
					return 1;
				}else{
					return 0;
				}*/
				return pred(x,y)?-1:1;
			}
		}

		[0,2,-108,-6,43,-1].sort(comparator(lessThanOrEqual));

		//这个比较器单独用的话.........
		if(lessThanOrEqual(1,1)){
			l('小于等于');
		}else{
			l('大于');
		}
	}








	/********************************************
	 * 第2章节结束处所用
	 * 将命令式编程时候要讲
	 ********************************************/
	
	//实例7：函数式编程简单的开始
	bee.test7 = function(){
		//命令式写法
		function parseAge(age){
			if(!_.isString(age)) throw new Error('接受字符串');
			l('开始转换...');
			var a = parseInt(age,10);
			if(_.isNaN(a)){
				l('转换失败!');
				a = 0;
			}
			return a;
		}		
	}
	//实例8：对上面的函数式优化
	bee.test8 = function(){

		function fail(thing){
			throw new Error(thing);
		}
		function warn(thing){
			console.log('Warning:'+thing);
		}
		function note(thing){
			console.log('note:'+thing);
		}
		
		//函数式写法
		function parseAge(age){
			if(!_.isString(age)) fail('接受字符串');
			note('开始转换...');
			var a = parseInt(age,10);
			if(_.isNaN(a)){
				warn('转换失败!');
				a = 0;
			}
			return a;
		}		
	}



	



	/********************************************
	 * 第3章节 任何时间合适的时候可以讲
	 ********************************************/

	// 实例9：函数构建函数
	bee.test9 = function(){
		
		var nums = [1,2,3,null,5];
		_.reduce(nums,function(total,n){
			return total * n; 
		});

		//1:用来对迭代器的包装
		function fnull(fun/*,defaults*/){
			var defaluts = _.rest(arguments);
			return function(/*args*/){
				var args = _.map(arguments,function(e,i){
					return (e!=null)?e:defaluts[i];
				});
				return fun.apply(null,args);
			}
		}

		var safeMult = fnull(function(total,n){
			return total * n; 
		},1,1);

		_.reduce(nums,safeMult);

		//2:用来对fnull的包装
		function defaults(obj){
			return function(o,k){
				var val = fnull(_.identity,obj[k]);
				return o && val(o[k]);
			}
		}

		//3:使用defaults
		function dosomething(config){
			return defaults({id:9527})(config,'id');
		}

		dosomething({});
		dosomething({name:'xuming'});
		dosomething({id:'12680'});
	}



	return bee;
})(bee||{});

















