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
			<li><span>J(selector)</span></li>
		</ul>
    </div>
    <div id="content">
		<div id="module" class="section">
			<h3 class="title">J(selector,context) 包装选择器</h3>
			<div class="desc">
				<h3>参数</h3>	
				<table cellspacing="0" cellpadding="0">
						<tr>
								<th>名称</th>
								<th>类型</th>
								<th>描述</th>
						</tr>
						<tr>
								<td>selector</td>
								<td>string</td>
								<td>选择器表达式，支持#id，#id tag，#id .cls,#id [attr=val],tag,.cls,[attr=val],支持tag.cls[attr=val]</td>
						</tr>
				</table>
			</div>
		</div>
		<div id="methods" class="section">
			<div class="example">
				<h3>例如： 先加载DOM元素， 再执行事件</h3>
				<pre class="brush:php;">
					<div id="box"></div> //Dom 元素
					
					简单替换方法：
					
					$(function(){
						$('#content').html('hello, world!'); // 可以简单的把Dom元素内容进行替换
					}) 
					
					或 
					 
					J(function(){
						$('#content').html('hello, world!'); // 可以简单的把Dom元素内容进行替换
					})</pre>
			</div>
		</div>
	
    </div>
</div>
<?php
	require("../../page_footer.php");
?>