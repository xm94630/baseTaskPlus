/*******************************
* 第十二章 
* 字符串、小数点、表达式
********************************/

var bee = (function(bee){

	//研究案例1: print
	//这个重来也没有用过，尝试了下发现时呼出系统的打印机的。
	//打印的默认页面就是当前的页面。真是神气。
	//不过书上用这个是，是基于 javascript shell，估计就是和基于浏览器中console是一样的。
	bee.caseL1 = function(){
		print(1);
	}

	//研究案例2: 数组的 indexof 
	//它可以在数组中进行搜索，没有的时候返回 -1
	//我突然觉得，我以前交大群侠传3的时候，还要自己去手动搜索数组，实在是..
	//而且当时居然还不会用数组方法concat,是在是不应该啊。
	bee.caseL2 = function(){
		var arr=['a','b','c','a'];
		l(arr.indexOf('a'))
		l(arr.indexOf('b'))
		l(arr.indexOf('c'))
		l(arr.indexOf('d'))
		l(arr.lastIndexOf('a'))
	}

	//研究案例3: 字符串的 indexof 
	bee.caseL3 = function(){
		var arr = 'axbxc';
		l(arr.indexOf('a'))
		l(arr.indexOf('b'))
		l(arr.indexOf('c'))
		l(arr.indexOf('d'))
		//前者总是匹配最先匹配的，后者是最后的
		l(arr.indexOf('x'))
		l(arr.lastIndexOf('x'))  
	}

	//研究案例4: 三项表达式
	//这个够简单的了吧，但是发现我自己没有掌握，比较尴尬
	bee.caseL4 = function(){
		var a,b;
		//这个结果是222，感觉把三项表达式的最后结果给了a,其实并不是。
		//这里的a仅仅是作为表达式判断的依据。
		l(a?111:222);
		l(a);

		//只有这种情况下才是对b赋值了
		l(b=b?111:222);
		l(b);
	}

	//研究案例5: 逗号表达式。 
	//逗号表达式从左到右，每一项可以是“表达式”、函数、一个变量。
	bee.caseL5 = function(){
		//其实这个就是，只是自己用习惯了。
		var a,b;       

		//这个也是，不过这两个都是私有变量
		var c=1,d=2;   
		
		//这种情况是其实是声明了全部变量。
		//需要注意的是：这个全局变量是临时创建的。（和直接在全局var声明的情况还是有点区别的）
		//只有 bee.caseL5 被调用之后才能访问到
		e=111,f=222;   

		//这样子也是可以的
		g=333,function xx(){}; 
		//这个同理
		;(g=333,function xx(){});
		//于是也能得出这个
		//我就是在网上看到这样子的表达式才添加了这个案例。
		//一开始都看不懂
		;(g=555,function xx(x){l(x)})(g);

		//唯独这种是不允许的
		//var g=333,function xx(){};
	}

	//研究案例6: 连等号
	//这个是从右边到左边进行
	//不过下面的写法是很坑人的，这样子创建了一个全局的xx
	bee.caseL6 = function(){
		var x = (xx=1);
	}

	//研究案例7: 连等号和逗号表达式组合
	//这两种结果不一样的
	bee.caseL7 = function(){
		var x = (e=111,f=222,g=888);
		l(x);
		var y = e = 111,f=222,g=888;
		l(y);
	}

	//研究案例8: 三项、逗号表达式组合应用（BOSS）
	bee.caseL8 = function(){
		var a;
		(a?11:22,function(x){l(x)})(a);
		//结果是undefined
		
		//但是对于这个 (0, _xx2.default)(); 中的0有意义呢？
	}

	//研究案例9: 整数除10后的保留一位小数点的做法！
	bee.caseL9 = function(){
		var m1 = 1234;
		var m2 = 1240;
		l( m1 / 10 + (m1 % 10 ? '' : '.0' ) );
		l( m2 / 10 + (m2 % 10 ? '' : '.0' ) );
	}

	//研究案例10: 案例9扩展 
	bee.caseL10 = function(){
		var m1 = 1200;
		//var m1 = 1314;
		//var m1 = 1310;
		var a = m1/100 
		var b = m1%100?'':'.0';
		var c = m1%10?'':'0';
		l(a+b+c)
	}

	//研究案例11:小数点后两位
	bee.caseL11 = function(){
		function get(n){
			var s= n+'';
			var r = /^(\d*).{0,1}(\d{0,2})/.exec(s);
			if(!r[1] && !r[2]) return false;
			var len = 2-r[2].length
			for(var i=0;i<len;i++){
				r[2] =r[2] + '0';
			}
			if(!r[1]){
				r[1] = '0'+r[1];
			}
			return r[1]+'.'+r[2];
		}
		l(get(12));
		l(get(12.));
		l(get(12.1));
		l(get(12.12));
		l(get(12.123));
		l(get(.1));
		l(get(.12));
		l(get(.123));
		l('--->')
		l(get('12'));
		l(get('12.'));
		l(get('12.1'));
		l(get('12.12'));
		l(get('12.123'));
		l(get('.1'));
		l(get('.12'));
		l(get('.123'));
	}

	//研究案例12:小数点操作
	bee.caseL12 = function(){
		var num=22.155678;
		l( Math.round(num*100)/100);

		var num=22.155;
		l( num.toFixed(2));
	}



	return bee;
})(bee || {});

//bee.caseL12();













