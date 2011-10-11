(function( window, undefined ) {
//Namespace(ns) | object | constructor
var J = (function(ns){
	var _WIN = window,
		_DOC = document;
		
	var J = function(selector, context){
		return new J.fn.init( selector, context, rootJ);
	},
	// A simple way to check for HTML strings or ID strings
	quickExpr = /^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]+)$)/,
	rinlineJ = / J\d+="(?:\d+|null)"/g,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	toString = Object.prototype.toString,
	rootJ,
	// [[Class]] -> type pairs
	class2type = {};
	J.fn = J.prototype = {
		config: {
			ns: ns
		},		
		init: function( selector, context, rootJ){
			var match, elem, ret, doc;
			if ( !selector ) {
				return this;
			}
			// Handle $(DOMElement)
			
			if ( selector.nodeType ) {
				this.context = this[0] = selector;
				this.length = 1;
				return this;
			}
			if ( typeof selector === "string" ) {
				match = quickExpr.exec( selector );
				// Verify a match, and that no context was specified for #id
				if ( match && (match[1] || !context) ) {
					elem = document.getElementById( match[2] );
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootJ.find( selector );
						}
						this.length = 1;
						this[0] = elem;
					}
					this.context = document;
					this.selector = selector;
					return this;
				} 
			} else if ( this.isFun( selector ) ) {						
				return this.ready( selector );
			}
			
		},
		version: {
			author : "jackyang",
			email : "88642844@qq.com",
			version : "1.0",
			date : "2011-09-05",
			lastime : "2011-9-05"
		},
		ready: function(){
			var isReady=false, //判断onDOMReady方法是否已经被执行过
				readyList= [],//把需要执行的方法先暂存在这个数组里
				timer,//定时器句柄
				ready=function(fn) {
					if (isReady){
						fn();
					}else{
						readyList.push(fn);
					}
				},
				onDOMReady=function(){
					for(var i=0,lg=readyList.length;i<lg;i++){
						readyList[i]();
					}
					readyList = null;
				},
				bindReady = function(evt){
					if(isReady)return;
					isReady=true;
					onDOMReady();
					if(_DOC.removeEventListener){
						_DOC.removeEventListener("DOMContentLoaded",bindReady,false);
					}else if(_DOC.attachEvent){
						_DOC.detachEvent("onreadystatechange", bindReady);
						if(_WIN == _WIN.top){
							clearInterval(timer);
							timer = null;
						}
					}
				};
			if(_DOC.addEventListener){
				_DOC.addEventListener("DOMContentLoaded", bindReady, false);
			}else if(_DOC.attachEvent){
				_DOC.attachEvent("onreadystatechange", function(){
					if((/loaded|complete/).test(_DOC.readyState))bindReady();
				});
				if(_WIN == _WIN.top){
					timer = setInterval(function(){
						try{
							isReady||_DOC.documentElement.doScroll('left');//在IE下用能否执行doScroll判断dom是否加载完毕
						}catch(e){
							return;
						}
						bindReady();
					},5);
				}
			}
			return ready;
		}(),		
		html: function(value){			
			if ( value === undefined ) {
				return this[0] && this[0].nodeType === 1 ?
					this[0].innerHTML.replace(rinlineJ, "") :
					null;
			}else if( typeof value === "string"){
				value = value.replace(rxhtmlTag, "<$1></$2>");
				return this[0].innerHTML = value;
			}
			return this;
		},
		append : function (tag, idx){
			var obj,that = this[0];
			if(/^\w+$/.test(tag)){
				obj = document.createElement(tag);
			}else{
				var div = document.createElement("div");
				div.innerHTML = tag;
				obj = div.firstChild;
			}
			if(this.unset(idx)){
				 this[0].appendChild(obj);
			}else{
				that.insertBefore(obj, this.isstr(idx) ? that.childNodes[idx] : that.child(idx).node);
			}
			return J(obj);		
		},
		isstr: function(s){
			return typeof(s)=="string";
		},	
		unset: function(s){
			return s===undefined;
		},
		isobj: function(s, flag){
			var isobj = typeof(s)=="object" && s!=null;
			//判断是否空对象
			if(isobj && this.isset(flag)){
				for(var name in obj){
					return !!flag;
				}
			}
			return isobj;
		},
		isarr: function(s){
			return this.isobj(s) && (s instanceof Array);
		},
		isFun: function(s){
			return typeof(s)=="function"  && (s instanceof Function);
		}
		
	};
	J.fn.init.prototype = J.fn;
	J.extend = J.fn.extend = function() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;
		// extend J itself if only one argument is passed
		if ( length === i ) {
			target = this;
			--i;
		}
	
		for ( ; i < length; i++ ) {
			// Only deal with non-null/undefined values
			if ( (options = arguments[ i ]) != null ) {
				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];
					target[ name ] = copy;
				}
			}
		}
	
		// Return the modified object
		return target;
	};
	J.extend({
		isFunction: function( obj ) {
			return J.type(obj) === "function";
		},
		isArray: Array.isArray || function( obj ) {
			return J.type(obj) === "array";
		},
		type: function( obj ) {
			return obj == null ?
				String( obj ) :
				class2type[ toString.call(obj) ] || "object";
		},
		// args is for internal usage only
		each: function( object, callback, args ) {
			var name, i = 0,
				length = object.length,
				isObj = length === undefined || J.isFunction( object );			
			return object;
		}
	});
	// Populate the class2type map
	J.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	});
	//return golbal
	return (_WIN[ns] = window.$ = J);
})("Jack");
})(window);
		
		
	