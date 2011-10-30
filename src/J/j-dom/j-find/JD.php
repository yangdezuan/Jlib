<?php
	require("../../page_header.php");
?>
<script>
$(function(){
	//
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
				<h3>例如：通过选择器，渲染Dom 元素样式</h3>
				<pre class="brush:js;">
					<dl id="id">
						<dt>
							your content
						</dt>
						<dd>
							your content
						</dd>
						<dd>
							your content
						</dd>
						<dt class="cls">
							your content
						</dt>
					</dl>
					<script>
						$("#id").css("border:1px solid #000");
						$("#id dd").css("border:1px solid red");
						$("#id dd.cls").css("background:#ccc");
						$("dd.cls").css("fontWeight:bold");
					</script>
				</pre>
				<p> 测试Demo: <a href="../../test/JD.html" target="_blank">JD.html</a></p>
			</div>
			<div class="iframeBlog">
				<iframe src="/minicomment/index.html" frameborder="0" width="100%" height="550"></iframe>
			</div>
		</div>
	
    </div>
</div>
<?php
	require("../../page_footer.php");
?>