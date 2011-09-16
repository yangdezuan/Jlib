/*!
 * JY JavaScript Library v1.1.1
 * 88642844@qq.com
 *
 * Copyright 2011, Jackyang
 *
 * Date: Thu September 6 09:16:56 2011 -0900
 */
(function( window, undefined ) {
var $DOC = window.document,
	$WIN=window;
	
var JY = (function() {
	// Define a local copy of JY
	var JY = function( selector, context ) {
		// The JY object is actually just the init constructor 'enhanced'
		return new JY.fn.init( selector, context );
	},
	class2type = {},
	quickExpr = /^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]+)$)/,	
	that = this;
	JY.fn = JY.prototype = {
		version: {
			author : "jackyang",
			email : "88642844@qq.com",
			version : "1.0",
			date : "2011-09-05",
			lastime : "2011-9-05"
		},
		init: function(selector, context){
			// Handle $(""), $(null), or $(undefined)
			if ( !selector ) {
				return this;
			}	
			// Handle $(DOMElement)
			if ( selector.nodeType ) {
				this.context = this[0] = selector;
				this.length = 1;
				return this;
			}
			// Handle HTML strings
			if ( typeof selector === "string" ) {
				// Are we dealing with HTML string or an ID?
				match = quickExpr.exec( selector );
	
				// Verify a match, and that no context was specified for #id
				if ( match && (match[1] || !context) ) {
	
					// HANDLE: $(html) -> $(array)
					if ( match[1] ) {
						doc = (context ? context.ownerDocument || context : document);
	
						// If a single string is passed in and it's a single tag
						// just do a createElement and skip the rest
						ret = rsingleTag.exec( selector );
	
						if ( ret ) {
							if ( JY.isPlainObject( context ) ) {
								selector = [ document.createElement( ret[1] ) ];
								JY.fn.attr.call( selector, context, true );
	
							} else {
								selector = [ doc.createElement( ret[1] ) ];
							}
	
						} else {
							ret = JY.buildFragment( [ match[1] ], [ doc ] );
							selector = (ret.cacheable ? ret.fragment.cloneNode(true) : ret.fragment).childNodes;
						}
						
						return JY.merge( this, selector );
						
					// HANDLE: $("#id")
					} else {
						elem = document.getElementById( match[2] );
	
						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id !== match[2] ) {
								return rootJY.find( selector );
							}
	
							// Otherwise, we inject the element directly into the JY object
							this.length = 1;
							this[0] = elem;
						}
	
						this.context = document;
						this.selector = selector;
						return this;
					}
	
				// HANDLE: $("TAG")
				} else if ( !context && !rnonword.test( selector ) ) {
					this.selector = selector;
					this.context = document;
					selector = document.getElementsByTagName( selector );
					return JY.merge( this, selector );
	
				// HANDLE: $(expr, $(...))
				} else if ( !context || context.JY ) {
					return (context || rootJY).find( selector );
	
				// HANDLE: $(expr, context)
				// (which is just equivalent to: $(context).find(expr)
				} else {
					return JY( context ).find( selector );
				}
	
			// HANDLE: $(function)
			// Shortcut for document ready
			
			} else if ( JY.isFunction( selector ) ) {
				return this.ready( selector );
			}
	
			if (selector.selector !== undefined) {
				this.selector = selector.selector;
				this.context = selector.context;
			}
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
					if($DOC.removeEventListener){
						$DOC.removeEventListener("DOMContentLoaded",bindReady,false);
					}else if($DOC.attachEvent){
						$DOC.detachEvent("onreadystatechange", bindReady);
						if($WIN == $WIN.top){
							clearInterval(timer);
							timer = null;
						}
					}
				};
			if($DOC.addEventListener){
				$DOC.addEventListener("DOMContentLoaded", bindReady, false);
			}else if($DOC.attachEvent){
				$DOC.attachEvent("onreadystatechange", function(){
					if((/loaded|complete/).test($DOC.readyState))bindReady();
				});
				if($WIN == $WIN.top){
					timer = setInterval(function(){
						try{
							isReady||$DOC.documentElement.doScroll('left');//在IE下用能否执行doScroll判断dom是否加载完毕
						}catch(e){
							return;
						}
						bindReady();
					},5);
				}
			}
			return ready;
		}(),
		// prototype
		isFunction:function(o){
			return ({}).toString.call(o).slice(8,-1);
		}
	};
	JY.fn.init.prototype = JY.fn;
	JY.extend = JY.fn.extend = function() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;
	
		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		}
	
		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && !JY.isFunction(target) ) {
			target = {};
		}
	
		// extend JY itself if only one argument is passed
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
	
					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}
	
					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( JY.isPlainObject(copy) || (copyIsArray = JY.isArray(copy)) ) ) {
						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && JY.isArray(src) ? src : [];
	
						} else {
							clone = src && JY.isPlainObject(src) ? src : {};
						}
	
						// Never move original objects, clone them
						target[ name ] = JY.extend( deep, clone, copy );
	
					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}
	
		// Return the modified object
		return target;
	};	
	JY.extend({
		isFunction: function( obj ) {
			return typeof obj === "function";
		},
		isPlainObject: function( obj ) {
			// Must be an Object.
			// Because of IE, we also have to check the presence of the constructor property.
			// Make sure that DOM nodes and window objects don't pass through, as well
			if ( !obj || JY.type(obj) !== "object" || obj.nodeType || JY.isWindow( obj ) ) {
				return false;
			}
			
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call(obj, "constructor") &&
				!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
			
			// Own properties are enumerated firstly, so to speed up,
			// if last one is own, then all properties are own.
		
			var key;
			for ( key in obj ) {}
			
			return key === undefined || hasOwn.call( obj, key );
		}
	});
	return (window.JY = window.$ = JY);
})();


JY.fn.extend({
	html: function( value ) {
		return this[0].innerHTML;
	},
	text: function( text ) {
		return this[0].innerHTML;
	}
});
})(window);