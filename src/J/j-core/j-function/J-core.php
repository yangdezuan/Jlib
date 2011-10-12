<?php
	require("../../page_header.php");
?>
<script>
(function(){
	$.extend({
		trim: function( obj ) {
			// Check if a string has a non-whitespace character in it
			var rnotwhite = /\S/,
			// Used for trimming whitespace
			trimLeft = /^\s+/,
			trimRight = /\s+$/;
			// IE doesn't match non-breaking spaces with \s but IE9 has support it
			if ( rnotwhite.test( "\xA0" ) ) {
				trimLeft = /^[\s\xA0]+/;
				trimRight = /[\s\xA0]+$/;
			}
			obj = obj.toString().replace( trimLeft, "" ).replace( trimRight, "" );
			return obj;
		}
	});
})();
$(function(){
	var text = $.trim("\xA0 h ");
	//$('#content').html(text);
})
</script>
<div id="page">
    <div class="related">
        <ul>
			<li><a accesskey="U" href="../../main.html">Home</a> » </li>
			<li><span>核心</span> » </li>
			<li><span>核心函数</span> » </li>
			<li><span>J()</span></li>
		</ul>
    </div>
    <div id="content">
		<div id="module" class="section">
			<h3 class="title">概述 : 命名空间</h3>
			<div class="desc">
				<pre>命名空间默认为J, 可以直接引用静态方法，也可以把它当做一个DOM的构造器，具体请参见 <a href="http://1stjs.googlecode.com/svn/trunk/fw4/api/showpages/2.html">J()</a>    
				<br>如果J这个变量有冲突，可以用其他名字代替， 
				<br>修改jy.js文件的参数
				<br>加参数ns可以设置命名空间</pre>
			</div>
		</div>
		<div id="methods" class="section">
			<div class="example">
				<h3>例如： 先加载DOM元素， 再执行事件</h3>
				<pre class="brush:php;">
					(function( window, undefined ) {
						var J = (function(ns){
							var J = function(selector){
								return new J.prototype.init(selector); // 返回创建一个对象,让此对象具有 相对应的方法和属性;
							};
							J.prototype = {
								init: function(selector){
									var quickExpr = /^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]+)$)/,
									match = quickExpr.exec( selector ),
									elem = document.getElementById( match[2] );
									this[0] = elem;
									return this; //返回dom 对象
								},
								html: function(value){
									return this[0].innerHTML = value;    
								}
							}
							J.prototype.init.prototype = J.prototype; // 将已有对象的属性和方法赋值给 DOM对象
							return window[ns] = window.$ = J; // 这个比较好理解，把J的对象赋值给全局$
						})("Jack");// 这里的jack可以自定义,方向区别$
					})(window);
				</pre>
			</div>
		</div>
	
    </div>
</div>
<?php
	require("../../page_footer.php");
?>