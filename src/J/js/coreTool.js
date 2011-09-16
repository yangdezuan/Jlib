void function(window,undefined){
	coreTool=function(){
		var indicator=arguments.callee,doc=document,that=this;	
		
		indicator.prototype={
			slice:([]).slice,
			is:function(o){
				return ({}).toString.call(o).slice(8,-1);
			},
			each:function(object,callback){
				var index,i=0,len=object.length,isO=len===undefined && ({}).toString.call(object).slice(8,-1)==='Object';
				if (isO) {
					for (index in object) {
					  if (callback.call(object[index], index, object[index]) === false) {
						break;
					  }
					}
				} else {
					for (; i < len;) {
					  if (callback.call(object[i], i, object[i++]) === false) {
						break;
					  }
					}
				}
			},
			toArray:function(o){
				return that.slice.call(o);
			},
			getHtmlElement:function(O){
				this.element || (this.element={});
				this.element[O] || (this.element[O]=doc.createElement(O));
				return this.element[O].cloneNode(true);
			},
			getEvent:function(e){
				return e || window.event; 
			},
			getTarget:function(e){
				return e.srcElement || e.target; 
			},
			stopEvent:function(e){
				e.returnValue=false;e.preventDefault();
				e.cancelBubble=false; e.stopPropagation();
			},
			getViewportSize:function(){
				var value=[0,0];
				undefined!==window.innerWidth ? value=[window.innerWidth,window.innerHeight] : value=[document.documentElement.clientWidth,document.documentElement.clientHeight];
				return value;
			},
			getClinetRect:function (f){
				var d=f.getBoundingClientRect(),e=(e={left:d.left,right:d.right,top:d.top,bottom:d.bottom,height:(d.height?d.height:(d.bottom-d.top)),width:(d.width?d.width:(d.right-d.left))});return e
			},
			addEvent:function(elem,evType,fn,capture){
				var indicator=arguments.callee;
				elem.attachEvent && (indicator=function(elem,evType,fn){
					elem.attachEvent('on'+evType,fn) 
				}).apply(this,arguments)
				elem.addEventListener && (indicator=function(elem,evType,fn){
					elem.addEventListener(evType,fn,capture || false);
				}).apply(this,arguments);
				elem['on'+evType] && (indicator=function(elem,evType,fn){
					elem['on'+evType]=function(){
						fn();
					};
				}).apply(this,arguments);
				/*elem.attachEvent && (indicator=function(elem,evType,fn){
					elem.attachEvent('on'+evType,fn) 
				}).apply(this,arguments)
				elem.addEventListener(evType,fn,capture || false);*/
			},
			removeEvent:function (elem,evType,fn,capture){
				var indicator=arguments.callee;
				elem.detachEvent && (indicator=function(elem,evType,fn){
					elem.detachEvent('on'+evType,fn) 
				}).apply(this,arguments)
				elem.removeEventListener && (indicator=function(elem,evType,fn){
					elem.removeEventListener(evType,fn,capture || false);
				}).apply(this,arguments);
				elem['on'+evType] && (indicator=function(elem,evType,fn){
					elem['on'+evType]=null;
				}).apply(this,arguments);
			},
			currentStyle:function(element,property){
				var computedStyle=null;
				return undefined!==element.currentStyle ? element.currentStyle[property] : document.defaultView.getComputedStyle(element,null)[property];
			},
			getEId: function(name){
				return document.getElementById(name);
			},
			getElementByClassName: function(ele,className) {
				//获取所有子节点
				if(document.all){
					var children = ele.all;
				}else{
					var children = ele.getElementsByTagName('*');
				}
				//遍历子节点并检查className属性
				
				var elements = [];
				for (var i = 0; i < children.length; i++) {
					var child = children[i];
					var classNames = child.className.split(' ');
					for (var j = 0; j < classNames.length; j++) {
						if (classNames[j] == className) {
							elements[elements.length] = child;
							break;
						}
					}
				}				
				return elements;
				
			} ,
			deleteBR: function(str){
				s = str.replace(/^\n/, "");
				return s;
			},
			htmlEncode: function(str){
				var s = "";   
				if (str.length == 0) return "";   
				s = str.replace(/&/g, "&gt;")
					.replace(/</g, "&lt;")
					.replace(/>/g, "&gt;")
					.replace(/ /g, "&nbsp;")
					.replace(/\'/g, "&#39;")
					.replace(/\"/g, "&quot;")
					.replace(/\n/g, "</br>"); 
				return s;   
			},
			htmlDecode: function(str){
				var s = "";   
				if (str.length == 0) return "";   
				s = str.replace(/&gt;/g, "&")
					.replace(/&lt;/g, "<")   
					.replace(/&gt;/g, ">")   
					.replace(/&nbsp;/g, " ") 
					.replace(/&#39;/g, "\'")  
					.replace(/&quot;/g, "\"")   
					.replace(/<br>/g, "\n");   
				return s;   
			},
			domReady:(function(){
			  var dom = [],doc=document;
			  dom.isReady = false;
			  dom.isFunction = function(obj){
				return Object.prototype.toString.call(obj) === "[object Function]";
			  }
			  dom.Ready = function(fn){
				dom.initReady();//如果没有建成DOM树，则走第二步，存储起来一起杀
				if(dom.isFunction(fn)){
				  if(dom.isReady){
					fn();//如果已经建成DOM，则来一个杀一个
				  }else{
					dom.push(fn);//存储加载事件
				  }
				}
			  }
			  dom.fireReady =function(){
				if (dom.isReady)  return;
				dom.isReady = true;
				for(var i=0,n=dom.length;i<n;i++){
				  var fn = dom[i];
				  fn();
				}
				dom.length = 0;//清空事件
			  }
			  dom.initReady = function(){
				if (doc.addEventListener) {
				  doc.addEventListener( "DOMContentLoaded", function(){
					doc.removeEventListener( "DOMContentLoaded", arguments.callee, false );//清除加载函数
					dom.fireReady();
				  }, false );
				}else{
				  if (doc.getElementById) {
					doc.write("<script id=\"ie-domReady\" defer='defer'src=\"//:\"><\/script>");
					doc.getElementById("ie-domReady").onreadystatechange = function() {
					  if (this.readyState === "complete") {
						dom.fireReady();
						this.onreadystatechange = null;
						this.parentNode.removeChild(this)
					  }
					};
				  }
				}
			  };
			  return dom.Ready;
			})()
		};
		if(window===this || 'indicator' in this) { return new indicator};
	}();
}(window)