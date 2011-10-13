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
			// The body element only exists once, optimize finding it
			if ( selector === "body" && !context && document.body ) {
				this.context = document;
				this[0] = document.body;
				this.selector = selector;
				this.length = 1;
				return this;
			}
			if ( typeof selector === "string" ) {
				// Are we dealing with HTML string or an ID?
				if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
					// Assume that strings that start and end with <> are HTML and skip the regex check
					match = [ null, selector, null ];
	
				} else {
					match = quickExpr.exec( selector );
				}
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
				} else if ( !context || context.J ) {
					// if the selector is tagName
					elem = document.getElementsByTagName(selector);
					this.length = 1;
					this[0] = elem[0];
					this.context = document;
					this.selector = selector;
					return this;
					//return (context || rootJ).find( selector );
	
				// HANDLE: $(expr, context)
				// (which is just equivalent to: $(context).find(expr)
				} else {
					return this.constructor( context ).find( selector );
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
				this[0].innerHTML = value;
			}			
			return this;
		},
		// Take an array of elements and push it onto the stack
		// (returning the new matched element set)
		pushStack: function( elems, name, selector ) {
			// Build a new J matched element set
			var ret = this.constructor();
		
			if ( J.isArray( elems ) ) {
				push.apply( ret, elems );
		
			} else {
				J.merge( ret, elems );
			}
		
			// Add the old object onto the stack (as a reference)
			ret.prevObject = this;
		
			ret.context = this.context;
		
			if ( name === "find" ) {
				ret.selector = this.selector + (this.selector ? " " : "") + selector;
			} else if ( name ) {
				ret.selector = this.selector + "." + name + "(" + selector + ")";
			}
		
			// Return the newly-formed element set
			return ret;
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
		},
		merge: function( first, second ) {
			var i = first.length,
				j = 0;
	
			if ( typeof second.length === "number" ) {
				for ( var l = second.length; j < l; j++ ) {
					first[ i++ ] = second[ j ];
				}
	
			} else {
				while ( second[j] !== undefined ) {
					first[ i++ ] = second[ j++ ];
				}
			}
	
			first.length = i;
	
			return first;
		},
		find: function(expr, context, isXML){
			var set,
				that = this,
				order = [ "ID", "NAME", "TAG" ],

				match = {
					ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
					CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
					NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
					ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
					TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
					CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
					POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
					PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
				};
					
			if ( !expr ) {
				return [];
			}
			if(match.CLASS.test(expr)){
			// if the selector is tagName
				/*if(document.all){
					var children = context.all;
				}else{
					var children = context.getElementsByTagName('*');
				}
				alert(children.className)
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
				}*/	
				var elem = document.get.getElementsByClassName(expr);			
				this.length = 1;
				this[0] = elem[0];
				this.context = document;
				this.selector = expr;
				return this;		
			}
			
		}
	});
	// Populate the class2type map
	J.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	});
	rootJ = J(document);
	//return golbal
	return (_WIN[ns] = window.$ = J);
})("Jack");


//extend all
J.fn.extend({
	find: function( selector ) {
		var self = this,
			i, l;
		if ( typeof selector !== "string" ) {
			return J( selector ).filter(function() {
				for ( i = 0, l = self.length; i < l; i++ ) {
					if ( J.contains( self[ i ], this ) ) {
						return true;
					}
				}
			});
		}

		var ret = this.pushStack( "", "find", selector ),
			length, n, r;
		
		for ( i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			J.find( selector, this[i], ret );
			
			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( n = length; n < ret.length; n++ ) {
					for ( r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	}
});

J.extend({
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
	},
	addpx: function(attr,val){
        if(/width|height|left|top|right|bottom|margin|padding/.test(attr)&&/^[\-\d.]+$/.test(val)){//数值属性
            return val+'px';//加px
        }
        return val;
    },
	rmvpx: function(attr,val){
        if(/px$/.test(val))return parseFloat(val);//去除px
        return val;
    }
});

J.fn.css = function(name, value) {
	// Setting 'undefined' is a no-op
	if ( arguments.length === 2 && value === undefined ) {
		return this;
	}
	var that = this[0];
	if(typeof value!='undefined'){
		name=name.replace(/-(\w)/g,function(_,$1){
			return $1.toUpperCase();
		});
		that.style[name]=J.addpx(name,value);
	}else if(typeof name=='object'){
		for(var key in name){
			this.css(key,name[key]);
			//that.style[key]=J.addpx(key,name[key]);
		}
	}else{
		if(name.indexOf(':')==-1){//无‘:’,比如'background:red'
			name=name.replace(/-(\w)/g,function(_,$1){
				return $1.toUpperCase();
			});
			return J.rmvpx(name,that.style&&that.style[name]||(that.currentStyle||_DOC.defaultView.getComputedStyle(that,null))[name]);
		}else{
			var cssObj=name.replace(/;$/,'').split(';'),
				cssText;
			for(var i=0,lg=cssObj.length;i<lg;i++){
				cssText=cssObj[i].split(':');
				this.css(cssText[0],cssText[1]);
				//that.style[cssText[0]]=J.addpx(cssText[0],cssText[1]);
			}
		}
	}
	return this;
};

})(window);
		
		
	