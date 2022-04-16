/* 
 * 研究案例:worker
 * 这里和普通的js并不是完全一样的，比如不能访问window、document对象
 */

onmessage =function (e){
  var d = e.data;
  postMessage( d );
}

//还可以这样子写
// self.onmessage =function (e){
//   var d = e.data;
//   self.postMessage( d );
// }
