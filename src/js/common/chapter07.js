/*******************************
* 第七章 算法
********************************/

var bee = (function(bee){

	/* 
	 * 研究案例1:排序(从大到小)
	 * 这个是我脑子里能想到的，写的很烂。
	 * 实现思路是每次获取最小的元素的索引，然后交换放置到数组的最后的位置。
	 * 这个不算是冒泡吧。
	 */
	bee.caseG1 = function(){

		function lessThan(x,y){
			return x<y;
		}

		function sort(arr){
			var i,j,index,min;
			var len = arr.length;

			for(var i=0;i<len-1;i++){
				index = 0;
				min = arr[index];
				for(var j=0;j<len-i;j++){
					if(lessThan(arr[j],min)){
						index = j;
						min = arr[index];
					}
				}
				arr[index] = arr[len-i-1];
				arr[len-i-1] = min;
			}
			return arr;
		}

		var arr = [3,7,1,9,8];
		var arr2 = [28,4,18,64,29,10,493,27,33];
		l(sort(arr));
		l(sort(arr2));
	}

	/* 
	 * 研究案例2:排序(从大到小) 冒泡
	 * 在写完案例1自后，我再处理案例2的时候就从容多了，马上就搞定了冒泡的。
	 */
	bee.caseG2 = function(){

		function lessThan(x,y){
			return x<y;
		}

		function sort(arr){
			var i,j,t;
			var len = arr.length;

			for(var i=0;i<len-1;i++){
				//从第一个元素开始到，倒数（除了已经完成排序的）第二个元素为止。
				for(var j=0;j<len-i-1;j++){
					if(lessThan(arr[j],arr[j+1])){
						//交换位置
						t = arr[j+1];
						arr[j+1] = arr[j];
						arr[j] = t;
					}
				}
			}
			return arr;
		}

		var arr = [3,7,1,9,8];
		var arr2 = [28,4,18,64,29,10,493,27,33];
		l(sort(arr));
		l(sort(arr2));
	}

	return bee;
})(bee || {});


//去重
//这个是有问题的案例
// var arr = [1,2,2,1,4];
// var obj = {}
// arr.forEach(function(one,index){

//     console.log(one,index);

//     if(obj[one]){
//         arr.splice(index,1)
//     }else{
//         obj[one] = true;
//     }

// });
// console.log(arr)










