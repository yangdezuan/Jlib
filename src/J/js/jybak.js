/*!
 * JY JavaScript Library v1.1.1
 * http://6yang.net
 *
 * Copyright 2011, Jackyang
 *
 * Date: Thu September 6 09:16:56 2011 -0900
 */
(function( window, undefined ) {
var document = window.document,
navigator = window.navigator,
location = window.location;
var JY = (function() {
// Define a local copy of JY
var JY = function( selector, context ) {
		// The JY object is actually just the init constructor 'enhanced'
		return new JY.fn.init( selector, context, rootJY );
	},
	_JY = window.JY,
	_$ = window.$,
	rootJY,
	readyList,
	class2type = {};
JY.fn = JY.prototype = {
		constructor: JY,
		init: function( selector, context, rootJY ) {
			var match, elem, ret, doc;
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
			// The body element only exists once, optimize finding it
			if ( selector === "body" && !context && document.body ) {
				this.context = document;
				this[0] = document.body;
				this.selector = selector;
				this.length = 1;
				return this;
			}	
			// Handle HTML strings
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
	
					// HANDLE: $(html) -> $(array)
					if ( match[1] ) {
						context = context instanceof JY ? context[0] : context;
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
							selector = (ret.cacheable ? JY.clone(ret.fragment) : ret.fragment).childNodes;
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
	
				// HANDLE: $(expr, $(...))
				} else if ( !context || context.JY ) {
					return (context || rootJY).find( selector );
	
				// HANDLE: $(expr, context)
				// (which is just equivalent to: $(context).find(expr)
				} else {
					return this.constructor( context ).find( selector );
				}
	
			// HANDLE: $(function)
			// Shortcut for document ready
			} else if ( JY.isFunction( selector ) ) {
				return rootJY.ready( selector );
			}
	
			if (selector.selector !== undefined) {
				this.selector = selector.selector;
				this.context = selector.context;
			}
			return JY.makeArray( selector, this );
		},
		selector: "",
		jy: "1.1.1",
		ready: function( fn ) {
			// Attach the listeners
			JY.bindReady();
			// Add the callback
			readyList.done( fn );
			return this;
		},		
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
}
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
	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			JY.readyWait++;
		} else {
			JY.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {
		// Either a released hold or an DOMready/load event and not yet ready
		if ( (wait === true && !--JY.readyWait) || (wait !== true && !JY.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( JY.ready, 1 );
			}

			// Remember that the DOM is ready
			JY.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --JY.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.resolveWith( document, [ JY ] );

			// Trigger any bound ready events
			if ( JY.fn.trigger ) {
				JY( document ).trigger( "ready" ).unbind( "ready" );
			}
		}
	},
	
	bindReady: function() {
		if ( readyList ) {
			return;
		}

		readyList = JY._Deferred();

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.		
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( JY.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", JY.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", JY.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return JY.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return JY.type(obj) === "array";
	},

	// A crude way of determining if an object is a window
	isWindow: function( obj ) {
		return obj && typeof obj === "object" && "setInterval" in obj;
	},

	isNaN: function( obj ) {
		return obj == null || !rdigit.test( obj ) || isNaN( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
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
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw msg;
	},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than JY in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},


	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || JY.isFunction( object );

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return object;
	},


	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// The extra typeof function check is to prevent crashes
			var type = JY.type( array );
			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || JY.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				JY.merge( ret, array );
			}
		}

		return ret;
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


	browser: {}
});
// Populate the class2type map
JY.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

// All JY objects should point back to these
rootJY = JY(document);
// Cleanup functions for the document ready method
if ( document.addEventListener ) {
		DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		JY.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			JY.ready();
		}
	};
}
return JY;
})();

var // Promise methods
	promiseMethods = "done fail isResolved isRejected promise then always pipe".split( " " ),
	// Static reference to slice
	sliceDeferred = [].slice;

JY.extend({
	// Create a simple deferred (one callbacks list)
	_Deferred: function() {
		var // callbacks list
			callbacks = [],
			// stored [ context , args ]
			fired,
			// to avoid firing when already doing so
			firing,
			// flag to know if the deferred has been cancelled
			cancelled,
			// the deferred itself
			deferred  = {

				// done( f1, f2, ...)
				done: function() {
					if ( !cancelled ) {
						var args = arguments,
							i,
							length,
							elem,
							type,
							_fired;
						if ( fired ) {
							_fired = fired;
							fired = 0;
						}
						for ( i = 0, length = args.length; i < length; i++ ) {
							elem = args[ i ];
							type = JY.type( elem );
							if ( type === "array" ) {
								deferred.done.apply( deferred, elem );
							} else if ( type === "function" ) {
								callbacks.push( elem );
							}
						}
						if ( _fired ) {
							deferred.resolveWith( _fired[ 0 ], _fired[ 1 ] );
						}
					}
					return this;
				},

				// resolve with given context and args
				resolveWith: function( context, args ) {
					if ( !cancelled && !fired && !firing ) {
						// make sure args are available (#8421)
						args = args || [];
						firing = 1;
						try {
							while( callbacks[ 0 ] ) {
								callbacks.shift().apply( context, args );
							}
						}
						finally {
							fired = [ context, args ];
							firing = 0;
						}
					}
					return this;
				},

				// resolve with this as context and given arguments
				resolve: function() {
					deferred.resolveWith( this, arguments );
					return this;
				},

				// Has this deferred been resolved?
				isResolved: function() {
					return !!( firing || fired );
				},

				// Cancel
				cancel: function() {
					cancelled = 1;
					callbacks = [];
					return this;
				}
			};

		return deferred;
	}
});
	
// Expose jy to the global object
window.JY = window.$ = JY;
})(window);