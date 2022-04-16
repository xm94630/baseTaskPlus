/*******************************
* 第九章
* 正则表达式研究 基础知识
* 2 种实例化
* 3 种修饰符
* 3 种方法
* 5 种属性
* 10种量词
********************************/

var bee = (function(bee){

	/* 
	 * 研究案例1:正则对象 实例化
	 * 实例化方法有两种：
	 */
	bee.caseI1 = function(){

		var r1 = /abc/g ; 
		var r2 = new RegExp('abc','g') ; 
		var r3 = new RegExp(/abc/,'g') ; 
	}



	/*******************************
	* 正则对象的3个方法
	********************************/

	/* 
	 * 研究案例2:正则对象 方法：exec
	 */
	bee.caseI2 = function(){

		//这里就算最后加上g，匹配的也只有一个
		var r = /cde/;
		//var r = /(c)d(e)/;
		//var r = /CDE/;   //不匹配的时候，返回null
		//var r = /CDE/i;  //i：忽略大小写
		var arr = r.exec('abcdefg-abcdefg'); 
		l(arr);         //存放匹配结果的数组
		l(arr.length);  //匹配的个数
		l(arr[0]);      //匹配的那个字符串
		l(arr.index);   //开始匹配的索引起始位置
		l(arr.input);	//被匹配的字符串
	}

	/* 
	 * 研究案例3:正则对象 方法：exec
	 * 来个比上面例子复杂点的
	 */
	bee.caseI3 = function(){

		//这里的小括号不是可选，而是作为子表达式来用
		var r = /(c)d(e)/;
		var arr = r.exec('abcdefg-abcdefg'); 
		l(arr);         
		l(arr.length);  
		l(arr[0]);      
		l(arr[1]);      //子表达式匹配的文本（就是括号中的）
		l(arr[2]);      //子表达式匹配的文本（就是括号中的）
		l(arr.index);   
		l(arr.input);	

		//这里的字符串的match方法，得到和上面一样的结果。
		//（注意：仅当非全局正则对象）
		l('abcdefg-abcdefg'.match(/(c)d(e)/));
		//当全局正则对象的时候，会有点不同
		l('abcdefg-abcdefg'.match(/(c)d(e)/g));
	}

	/* 
	 * 研究案例4:正则对象 方法：exec
	 * 继续加大难度
	 */
	bee.caseI4 = function(){

		var r = /cde/g;
		
		l(r.lastIndex);  //这里用到正则对象的一个属性，一开始为0
		var arr = r.exec('abcdefg-abcdefg'); 
		l(arr); 

		l(r.lastIndex);  //检索1次后，开始检索起始下标为5
		var arr = r.exec('abcdefg-abcdefg'); 
		l(arr); 

		l(r.lastIndex);  //检索2次后，开始检索起始下标为13
		var arr = r.exec('abcdefg-abcdefg'); 
		l(arr); 

		l(r.lastIndex);  //检索完毕，重置为0

		//这里的字符串的match方法
		//当为全局正则对象，获得数组包含，多次匹配的结果字符串的数组。
		l('abcdefg-abcdefg'.match(r));
		
		/*
		 * 重要事项：如果在一个字符串中完成了一次模式匹配之后要开始检索新的字符串，就必须手动地把 lastIndex 属性重置为 0。
		 * 提示：请注意，无论 RegExpObject 是否是全局模式，exec() 都会把完整的细节添加到它返回的数组中。
		 * 这就是 exec() 与 String.match() 的不同之处，后者在全局模式下返回的信息要少得多。
		 * 因此我们可以这么说，在循环中反复地调用 exec() 方法是唯一一种获得全局模式的完整模式匹配信息的方法。
		 */
	}

	/* 
	 * 研究案例5:正则对象 方法：exec
	 * 应用！
	 * 一个重要的循环模式！
	 *
	 * 有了/g，并不是说，配合的结果会出现多个匹配，而是会改变lastIndex的值，以便在下一次中匹配下一个。
	 */
	bee.caseI5 = function(){

		var r = /cde/g; //这里要是把g去了就死循环了。
		var str = 'abcdefg-abcdefg';
		var arr; 

		while((arr=r.exec(str))!==null){
			console.log(arr);
			console.log(r.lastIndex);
		}
	}

	/* 
	 * 研究案例6:正则对象 方法：test
	 * 这个相比exec就简单多了！！
	 */
	bee.caseI6 = function(){

		var r = /cde/g;
		var str = 'abcdefg-abcdefg';
		l(r.test(str));

		//等价于
		l(r.exec(str)!==null); //看看exec方法多么灵活！
	}

	/* 
	 * 研究案例7:正则对象 方法：compile
	 * 这个方法，说是是用于改变或者重新编译正则。感觉好像没啥用。。
	 */
	bee.caseI7 = function(){

		var str = 'abcdefg-abcdefg';

		//开始不匹配
		var r = /xxx/;
		l(r.test(str));

		//重新编译之后，匹配
		r.compile(/cde/);  //感觉等效于：r = /cde/;
		l(r.test(str));
	}
	/*
	 * 到目前为止，正则对象的3个方法全部学完！！
	 * 容易和字符串的那个几个和正则相关的方法混淆。这里有个好的办法来记忆：
	 * 字母数量在4个或者7个的是正则对象的，其他的是字符串对象的！
	 * 好记吧！
	 */

	 /*******************************
	 * 3个修饰符
	 ********************************/

	 /* 
	  * 研究案例8:正则 修饰符
	  * 超级简单
	  */
	 bee.caseI8 = function(){
	 	l(/abc/g);     //全局匹配，案例3和4的match方法就因为这个g标志，有不同结果。
	 	l(/abc/i);     //忽略大小写匹配，这个简单不说了
	 	l(/abc/m);     //多行匹配，这个目前还没有合适的例子，看到实际问题再增加吧。
	 }


	 /*******************************
	 * 正则对象的5个属性
	 ********************************/

	 /* 
	  * 研究案例9:正则对象 5个属性
	  * 超级简单
	  */
	 bee.caseI9 = function(){
	 	l(/abc/.source);      //获取字符串形式  
	 	l(/abc/g.global);     //是否有g标志
	 	l(/abc/i.ignoreCase); //是否有i标志
	 	l(/abc/m.multiline);  //是否有m标志
	 	l(/abc/.lastIndex);   //之前已经出现了，不在细说
	 }



	 /********************************
	  * 正则中出现的10个量词 
	  ********************************/

	 /* 
	  * 研究案例10:量词
	  */
	 bee.caseI10 = function(){

	 	//匹配任何包含至少一个 n 的字符串。
	 	var reg = /n+/;
	 	l(reg.exec(''));     //null
	 	l(reg.exec('n'));
	 	l(reg.exec('nnnnn'));
	 	l('-------------------------------');

	 	//匹配任何包含零个或多个 n 的字符串。
	 	var reg = /n*/;
	 	l(reg.exec(''));     
	 	l(reg.exec('n'));
	 	l(reg.exec('nnnnn'));
	 	l('-------------------------------');

	 	//匹配任何包含零个或一个 n 的字符串。
	 	var reg = /n?/;
	 	l(reg.exec(''));     
	 	l(reg.exec('n'));
	 	//注意，虽然说是匹配0或1个，但是会以最大量来满足。
	 	//这里的最大的量就是1个。
	 	l(reg.exec('nnnnn'));  
	 	l('-------------------------------');

	 	//匹配包含 X 个 n 的序列的字符串。
	 	var reg = /n{4}/;
	 	l(reg.exec(''));      //null
	 	l(reg.exec('n'));     //null
	 	l(reg.exec('nnnnn'));  
	 	l('-------------------------------');

	 	//匹配包含 X 或 Y 个 n 的序列的字符串。
	 	var reg = /n{3,5}/;
	 	l(reg.exec(''));      //null
	 	l(reg.exec('n'));     //null
	 	//注意，虽然说是匹配3或5个，但是会以最大量来满足。
	 	//这里的最大的量就是5个。
	 	l(reg.exec('nnnnn'));  
	 	l('-------------------------------');


	 	//匹配包含至少 X 个 n 的序列的字符串。
	 	var reg = /n{2,}/;
	 	l(reg.exec(''));      //null
	 	l(reg.exec('n'));     //null
	 	//注意，虽然说是匹配2个及以上，但是会以最大量来满足。
	 	//这里的最大的量就是5个。
	 	l(reg.exec('nnnnn'));  
	 	l('-------------------------------');

	 	//匹配任何结尾为 n 的字符串。（注：这种匹配数量就是1个）
	 	var reg = /n$/;
	 	l(reg.exec(''));        //null
	 	l(reg.exec('n'));     
	 	l(reg.exec('nnnnn'));  
	 	l(reg.exec('nnnnna'));  //null
	 	l('-------------------------------');

	 	//匹配任何开头为 n 的字符串。（注：这种匹配数量就是1个）
	 	var reg = /^n/;
	 	l(reg.exec(''));        //null
	 	l(reg.exec('n'));     
	 	l(reg.exec('nnnnn'));  
	 	l(reg.exec('annnnn'));  //null
	 	l('-------------------------------');

	 	//匹配任何其后紧接指定字符串 n 的字符串a。
	 	//这个是相对比较难的一个量词，注意一下几点：
	 	//1.这里使用括号是很有必要的
	 	//2.言外之意是n前面的那个“一个”才是需要匹配的，和n本身无关
	 	//3.另外，这里的括号不会匹配！
	 	var reg = /a(?=n)/;
	 	l(reg.exec(''));        //null
	 	l(reg.exec('n'));       //null
	 	l(reg.exec('nnnnn'));   //null
	 	l(reg.exec('aaannnnn'));  
	 	l(reg.exec('nnnnnaaa'));//null
	 	l('-------------------------------');

	    //匹配任何其后没有紧接指定字符串 n 的字符串a。
	    //同上，括号也是必不可少的
	    //这里匹配的是a，所以字符串中可能首先找到三个a。
	    //由于其后不能带有n，所以呢，只有最后一个a才是正确的匹配。
	    //另外要说明的是?!和外面的括号是一套组合拳
	    //另外，这里的括号不会匹配！
	 	var reg = /a(?!n)/;
	 	l(reg.exec('anannnna'));  //null
	 	l('-------------------------------');


	 	//(?:)模式，我们知道()的作用，不仅是个组合，而且还会作为子表达式被使用。
	 	//但是现在的情况是我只需要组合，但是不希望被捕获，就用这个。
	 	var regexp = /abc(def)/;
	 	l(regexp.exec('abcdef')); 
	 	var regexp = /abc(?:def)/;
	 	l(regexp.exec('abcdef')); 
	 }

	 /* 
	  * 研究案例11:量词 深入
	  */
	 bee.caseI11 = function(){

	 	//*号在默认情况下，只对前面的一个字符有效果
	 	var reg = /abc*/;
	 	l(reg.exec('abcccc'));
	 	l(reg.exec('abcabc'));
	 	l('-------------------------------');

	 	//使用的括号的时候，*号对括号中的内容作为匹配单元
	 	//另外非常重要的一点是:括号还有一个作用，子表达式
	 	//子表达式也会作为返回结果数组的一个元素！
	 	var reg = /(abc)*/;
	 	l(reg.exec('abcccc'));
	 	l(reg.exec('abcabc'));
	 	l('-------------------------------');

	 	//当括号中出现|符号的时候，abc、def是作为组合存在的
	 	var reg = /(abc|def)*/;
	 	l(reg.exec('abcccc'));
	 	l(reg.exec('abcabc'));
	 	l(reg.exec('abcdef'));  //这个时候，括号中匹配了abc和def,最后只显示后者
	 	l(reg.exec(''));        //这里子表达式的结果是undefined，有点意思
	 						 	//length为2
	 	l('-------------------------------');

	 	//这里|右边的是空格的时候，也有点意思。
	 	var reg = /(abc| )+/;
	 	l(reg.exec('abc  abc'));

	 	//空格省略，这种比较诡异...展示没有研究明白，特别是第二个
	 	var reg = /(abc|)+/;
	 	l(reg.exec('abc  abc'));//优先匹配的是|符号左边的，也就是abc
	 	l(reg.exec('abd  abc'));//|左边的不满足，才找右边的，也就是""
	 	l('-------------------------------');

	 	//关于子表达式子
	 	//这里因为有重复匹配，但是括号中的的子表达式的值，以最后一次的为准！
	 	//当有嵌套的子表达式子的时候，从左到右，从外到内进行
	 	var reg = /(a(b)+)+/;
	 	l(reg.exec('abbbbbbabbaab'));
	 	var reg = /(a(b))(c(d))/;
	 	l(reg.exec('abcd'));
	 	l('-------------------------------');
	 }


	 /********************************
	  * 方括号
	  ********************************/

	 /* 
	  * 研究案例12:方括号
	  */
	 bee.caseI12 = function(){

	 	//中括号中的都可以匹配，但是只取一个哦
	 	l(/[abc]/.exec('abacdsa'));    
	 	//中括号中的都可以匹配，这里可以取很多啦
	 	l(/[abc]*/.exec('abacdsa'));   
	 	//除了中括号中的都行，但是只取一个哦
	 	//另外^在没有中括号的时候是别的意思！
	 	l(/[^abc]/.exec('abacdsa'));   
	 	
	 	//以为结果是‘ds’，结果是‘’，因为*允许是零个，匹配了最最开始的空字符串
	 	//有点奇怪的说，index为0，若匹配了'a'的情况，index也是0
	 	l(/[^abc]*/.exec('abacdsa'));      
	 	//改变下，上面的意图就达到了。
	 	l(/[^abc]+/.exec('abacdsa'));    

	 	l(/[0-9]+/.exec('a921b')); 
	 	l(/[^0-9]+/.exec('a921b'));  
	 	l(/[^a-z]+/.exec('a921b'));
	 	l(/[A-Z]+/.exec('a921b'));  
	 	l(/[A-z]+/.exec('a921b'));  
	 	
	 	l(/[0-9A-z_.?]+/.exec('?xm_946.30'));  
	 }


	 /********************************
	  * 元字符
	  ********************************/

	 /* 
	  * 研究案例13:元字符
	  * 拥有特殊含义的字符
	  */
	 bee.caseI13 = function(){

	 	var str = 'xm94630.就是我 haha\n我是第 2 行哦！';

	 	l(/.+/  .exec(str));  //匹配单个字符，除了换行和结束符
	 	l(/[.+]/.exec(str));  //注意当点在中括号中的时候，匹配的就是点
	 	l(/\w+/ .exec(str));  //匹配单个单词（包含数字和字母）
	 	l(/\W+/ .exec(str));  //匹配单个非单词（不包含数字和字母）
	 	l(/\d+/ .exec(str));  //匹配单个数字
	 	l(/\D+/ .exec(str));  //匹配单个非数字
	 	
	 	l(/\n+/ .exec(str));  //常见的换行符
	 	l(/\s+/ .exec(' \n\r\f\v\b你好'));   //匹配单个空白字符，‘ \n\r\f\v\b’都是，不过只有前两者是会在结果中打印出来。
	 	l(/\S+/ .exec(' \n\r\f\v\b你好'));   //匹配非空白字符
	 	
	 	//不常用的
	 	l('----------------------')
	 	l(/\b/ .exec(str));   //boundary 匹配边界，注意不能跟上加号，会报错。
	 	l(/\B/ .exec(str));   //boundary 匹配非边界，注意不能跟上加号，会报错。不过结果很神奇，和上面一样。。
	 	l(/\f+/ .exec(str));  //formfeed 
	 	l(/\r+/ .exec(str));  //return
	 	l(/\t+/ .exec(str));  //tabs
	 	l(/\v+/ .exec(str));  //vertical
	 }

	 /* 
	  * 研究案例14: | 的优先级
	  * 首先出现的优先级总是要高点
	  */
	 bee.caseI14 = function(){
	 	l(/ab|a/.exec('ab'));
	 	l(/a|ab/.exec('ab'));
	 }

	 /* 
	  * 研究案例15: 字符串方法 match
	  * 这里学习match方法
	  * 同时这里的正则的写法也有点意思
	  * 在bee.caseH36 案例中详细的应用
	  */
	 bee.caseI15 = function(){
	 	var selector = 'div';
	 	var myClass  = 'red';
	 	var html = '<div class="ML10"><p>你好</p></div>';
	 	var reg = new RegExp('(<\s*('+selector+').+class\s*=\s*)([\"\'])(.*)(\\3)(>)');   

	 	//当使用函数的作为第二个参数的时候，函数中的参数a,b,c...对应的值就是正则中的匹配值
	 	//他和 reg.exec('xxxxxxx'); 这个表达式返回的结果是类似的！
	 	html = html.replace(reg,function(a,b,c,d,e,f,g){
	 		return b+d+e+' '+myClass+f+g;
	 	});
	 	l(html);
	 }

	 /********************************
	  * 高级用法
	  * 
	  * 1）贪婪模式
	  * 2）懒惰模式
	  * 3）零宽度断言       (?!exp)
	  * 4）顺序环视         (?=exp)
	  * 5）逆序环视的否定形式 (?<!com) 
	  * 6）忽略优先 .*?  也就是优先忽略不匹配任何字符
	  * 7）反向条件搜索
	  ********************************/

	 /* 
	  * 研究案例16: 贪婪模式 
	  * 这个不要被名字吓到了，其实就是很简单的
	  * 我这个练习做的晚了点，前些天面试的时候，就是答不上来
	  */
	 bee.caseI16 = function(){

	 	var str = "xxxm94630xm";

	 	//贪婪
	 	//默认的情况下，常用的几个量词都是贪婪的
	 	//量词“?”匹配0个或者一个，但是他是贪婪的，能匹配一个就不会匹配0个
	 	//量词“+”匹配至少一个，但是他是贪婪的，总是匹配最多的
	 	//量词“*”匹配0个或者多个，但是他是贪婪的，总是匹配最多的
	 	l(/x?m/.exec(str));  
	 	l(/x+m/.exec(str));  
	 	l(/x*m/.exec(str));  

	 	//用花括号表示的量词同样也是贪婪的
	 	//虽然它匹配0-3个，但是他总是期望匹配更多的，这里匹配的是最大值3个
	 	l(/(xm){0,3}/.exec("xmxmxmxmxmxm94630")); 
	 }

	 /* 
	  * 研究案例17: 非贪婪模式 
	  * 只要在量词的后面加上一个问号就可以了
	  */
	 bee.caseI17 = function(){
	 	var str = "xxxm94630xm";	 	
	 	l(/x+?/.exec(str));  //非贪婪
	 	l(/x+/.exec(str));   //贪婪
	 }

	 /* 
	  * 研究案例18: 上例子演变，难度加大
	  */
	 bee.caseI18 = function(){

	 	var str = "xxxm94630xm";	 	
	 	l(/x+?m/.exec(str));  //非贪婪 
	 	l(/x+m/.exec(str));   //贪婪

	 	//匹配的结果都是：xxxm 
	 	//这里有人就要问了，这里非贪婪模式的结果不应该是 xm, 他的理由是，因为不贪婪了，所以只匹配一个x。
	 	//其实不是这样子的。我们仔细看，这个例子和上一个案例的区别在于，正则中多了一个m而已。
	 	//为何结果中，那个非贪婪的效果没有生效呢？？
	 	//
	 	//那么我们就来分析下这里的第一种情况：
	 	//首先“x+?”确实是非贪婪的，找到了第一个x的时候，内部实现确实终止了，接下来呢，就是正则中的“m”,
	 	//发现后面并不是m啊，也就是说，这种情况下，匹配是失败的。
	 	//对于正则来说，要完成一次匹配的话，至少要把所有的历史路径情况都走完了，才会放弃，然后从下一个开始匹配。
	 	//到目前来说，路径并没有走完呢，还有别的情况：
	 	//也就是要打破非贪婪，（言外之意是，非贪婪模式虽然优先非贪婪，但是还是要服从“可匹配的情况”）
	 	//所以，这次“x+?”部分会匹配"xxxm94630xm"中前两个“x”,但是因为非贪婪模式的制约，它还是不想匹配跟多的x,
	 	//然后呢，又去看正则中的m部分，发现后面跟的，还不是m，于是：
	 	//这次“x+?”部分会匹配"xxxm94630xm"中前3个“x”,
	 	//然后呢，又去看正则中的m部分，发现，啊呀，成功啦！
	 	//
	 	//好了，这就是非贪婪模式的过程。优先非贪婪，要是不行的话，就多贪一个，再不行，再多贪一个。
	 	//始终是保持最少。在不得已的时候就多贪一个。
	 }

	 /* 
	  * 研究案例19: 贪婪和非贪婪的综合练习
	  */
	 bee.caseI19 = function(){

	 	var b="abeeeeIeeeeeIeeeeeab";
	 	l(/e+Ie+/.exec(b));      //对e的匹配是贪婪
	 	l(/e+?Ie+?/.exec(b));	 //对e的匹配是非贪婪，这里分前后两部分，应用的效果有点不同。前者因为要匹配I，不得不贪（虽然设置是非贪）。后者就是标准的非贪。
	 	l(/e+I(?=e+)/.exec(b));  //“?=”不在说了，已讲。
	 	l(/e+?I(?=e+)/.exec(b)); //“?=”不在说了，已讲。 这里结合了非贪，也很好理解的
	 	l(/e+?I(?!e+)/.exec(b)); //“?！”不在说了，已讲。
	 	l(/(?:e+)?I(?:e+?)/.exec(b));  //“?:”不在说了，已讲。
	 }

	/* 
	 * 研究案例20: 去空格1
	 * 利用的是字符串方法：replace
	 */
	bee.caseI20 = function(){
		var s = 'hello xiao  ming'
		var x = s.replace(/\s/g,function(){
		    return ''
		});
		console.log(x)
	}

	/* 
	 * 研究案例21: 去空格2
	 * 利用的是字符串方法：match
	 */
	bee.caseI21 = function(){
		var str = 'hello xiao  ming';
		var newStr = str.match(/\S+/g).join('');
		console.log(newStr)
	}



	return bee;
})(bee || {});

//bee.caseI19();







