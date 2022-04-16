/*******************************
* 第十章
* 正则表达式研究 实战
********************************/

var bee = (function(bee){

	/* 
	 * 研究案例1:科学计数法
	 */
	bee.caseJ1 = function(){

		//有了上一个章节的铺垫，这个式子分析就简单多了
		//其实就是科学计数法的匹配
		var r = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/;  
		l(r.test('123'));
		l(r.test('+123'));
		l(r.test('-123'));
		l(r.test('+123.'));
		l(r.test('+123.123'));
		l(r.test('+123.123E100'));
		l(r.test('+123.123E-100'));
		l(r.test('+123.123e-100'));
		l(r.test('+123.123e-123'));
		l(r.test('+.123e-123'));
	}

	/* 
	 * 研究案例2:自测
	 * 正则表达式匹配开头为11N, 12N或1NNN，后面是-7-8个数字的电话号码
	 */
	bee.caseJ2 = function(){

		var r = /1(?:1\d|2\d|\d{3})-\d{7,8}/;  
		l(r.test('112-1234567'));
		l(r.test('122-1234567'));
		l(r.test('1789-1234567'));
		l(r.test('1789-12345678'));
		l(r.test('222-12345678'));
	}

	/* 
	 * 研究案例3:一个小坑
	 */
	bee.caseJ3 = function(){

		//这个例子和下面的是有区别的，这个会变成死循环。。
		//看上去差别很小，其实大有玄机
		//这里的正则表达式是字面量，在每次做循环的时候，都是重新实例。
		//所以 lastIndex的值总是为零。
		/*while((arr=/\S+/g.exec('\n\r\f\v\b你好 \n哈哈')) !== null){
			l(arr);
		}*/
		
		var r = /\S+/g;
		l(r.lastIndex);
		while((arr=r.exec('\n\r\f\v\b你好 \n哈哈')) !== null){
			l(arr);
			l(r.lastIndex);
		}
	}

	/* 
	 * 研究案例4:[\w\W]+ 
	 */
	bee.caseJ4 = function(){

		var r1 = /[\w]+/;
		var r2 = /[\W]+/;
		l(r1.exec('123abc'));    	
		l(r1.exec('.-'));    	
		l(r1.exec(' '));    	
		l(r1.exec('\n'));  
		l(r1.exec('你好'));  
		l('-------------------------');  
		l(r2.exec('123abc'));    	
		l(r2.exec('.-'));    	
		l(r2.exec(' '));    	
		l(r2.exec('\n'));   
		l(r2.exec('你好'));
		l('-------------------------');  
		//匹配任何字符	
		l(/[\w\W]+/.exec('你好，123abc-.?/n/t'));
		l(/[\s\S]+/.exec('你好，123abc-.?/n/t'));
	}

	/* 
	 * 研究案例5:jquery中用到的一个正则
	 * 这里就有[\w\W]+
	 */
	bee.caseJ5 = function(){

		var rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;
		l(rquickExpr.test('<div>'));    	//true
		l(rquickExpr.test('  <div>'));		//true
		l(rquickExpr.test('  <div>  '));	//true
		l(rquickExpr.test('<标签>'));	    //true
		l(rquickExpr.test('<<>'));	        //true
		l(rquickExpr.test('<<>>>>>'));	    //true
		l(rquickExpr.test('<div'));	        //false,没有关闭
		l(rquickExpr.test('<img src=a onerror=alert()>'));	//true        //false,没有关闭
		l('---------')
		l(rquickExpr.test('#'));	        //true
		l(rquickExpr.test('#123-abc'));	    //true
		l(rquickExpr.test('#123-abc.'));	//false，不包含点
	}

	/* 
	 * 研究案例6: \1、\2
	 * 这样子用于对对应括号的配对用的，用来保证一样的字符
	 */
	bee.caseJ6 = function(){

		var rsingleTag = /^(\w+)-\1/;
		l(rsingleTag.test('123-123'));             //true
		l(rsingleTag.test('xm94630-xm94630'));     //true
		var rsingleTag = /^(abc)(\w+)-\1/;
		l(rsingleTag.test('abc9-abc'));            //true
		var rsingleTag = /^(abc)(\w+)-\2/;
		l(rsingleTag.test('abc9-9'));              //true 
	}


	/* 
	 * 研究案例7:空标签
	 */
	bee.caseJ7 = function(){

		var rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
		l(rsingleTag.test('<div></div>'));     //true
		l(rsingleTag.test('<div ></div>'));    //true
		l(rsingleTag.test('< div></div>'));    //false,\w字母数组
		l(rsingleTag.test('<div></span>'));    //false
		l(rsingleTag.test('<div/>'));          //true
		l(rsingleTag.test('<div  />'));        //true
		l('---------')
		//true,下面这个其实是不合理的，但是这个正则也是允许的！
		l(rsingleTag.test('<div  /></div>'));  
	}

	/* 
	 * 研究案例8: 【BOSS】(.)* 和 (.*)的区别
	 * 注意观察输出
	 */
	bee.caseJ8 = function(){
		var r=/(.)*/;
		l(r.exec('123456'))
		var r=/(.*)/;
		l(r.exec('123456'))
	}

	/* 
	 * 研究案例9: ?!的运用
	 * 其实在上个章节中已经有解释。但是我后来看到的时候又忘记了
	 * 所以还是要把这个实例讲讲
	 */
	bee.caseJ9 = function(){
		//匹配的时候要排除 匹配xm94630的情况
		var r=/^(?!xm94630).*\.js/;
		l(r.exec('xm94630.min.js'))
		l(r.exec('xm9463000.min.js'))
		l(r.exec('jy2006.min.min.js'))
	}

	return bee;
})(bee || {});






