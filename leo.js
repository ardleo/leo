/**
 * Azure Remote VM Switcher
 * server.js
 *
 * Copyright 2014 Ring2 Communications LTD. All rights reserved.
 */


/**
* @namespace leo
*/
leo = {
	init : function(){
		if ( !String.prototype.contains ) {
			String.prototype.contains = function() {
				return String.prototype.indexOf.apply( this, arguments ) !== -1;
			};
		}
	},
	/**
	* @namespace config
	* @property {numeric} EXPIRATION_DATE - Expiration date for cookie only, in day unit.
	* @property {boolean} FORCE_USE_COOKIE - By default, this library will try to use local storage and fallback to cookie if the browser doesn't support. Set it to true, to force using cookie.
    */
	config: {
		EXPIRATION_DATE : 30,
		FORCE_USE_COOKIE : true,
		COOKIE_KEY_TO_MOVE_TO_LS : ['number']
	},
	util : {
		cookie : {},
		ls : {},		
		storage : {}
	}	
}

leo.init();

/* general storage helper */
leo.util.storage = {
	read : function( key ){
		if ( typeof localStorage !== "undefined" && !leo.config.FORCE_USE_COOKIE){
			return leo.util.ls.read( key );
		} else {
			return leo.util.cookie.read( key );
		}
	},
	readAll : function(){
		if ( typeof localStorage !== "undefined" && !leo.config.FORCE_USE_COOKIE ){
			return leo.util.ls.readAll();
		} else {
			return leo.util.cookie.readAll();
		}		
	},
	write : function( key, value ){
		if ( typeof localStorage !== "undefined" && !leo.config.FORCE_USE_COOKIE ){
			leo.util.ls.write( key, value );
		} else {
			leo.util.cookie.write( key, value );
		}
	},
	remove : function( key ){
		if ( typeof localStorage !== "undefined" && !leo.config.FORCE_USE_COOKIE ){
			leo.util.ls.remove( key, value );
		} else {
			leo.util.cookie.remove( key, value );
		}
	},
	removeAll : function(){
		if ( typeof localStorage !== "undefined" && !leo.config.FORCE_USE_COOKIE ){
			leo.util.ls.removeAll();
		} else {
			leo.util.cookie.removeAll();
		}
	},
	// this method is for moving whatever keys in cookie that we want to move to local storage. 
	// any keys that we want to move have to be declared in COOKIE_KEY_TO_MOVE_TO_LS.
	sync : function(){		
		var cookies = leo.util.cookie.readAll();
		for ( cookie in cookies ){
			console.log( cookie );
			var theCookie = $.grep( leo.config.COOKIE_KEY_TO_MOVE_TO_LS, function( str ){
				return cookie.contains( str );
			})
			var theCookieLength = theCookie.length;
			if ( theCookieLength > 0 ){		
				var i;
				for( i=0;i < theCookieLength; i++ ){
					console.log( cookie );
					leo.util.ls.write( cookie, cookies[cookie] );
					leo.util.cookie.remove( cookie, cookies[cookie] );
				}
			}
		}
	}
}

/* local storage handler */
leo.util.ls = {
	read : function(key){
		if(typeof(localStorage[key]) !== "undefined") {
			return localStorage[key];
		} 
		return null;
	},
	readAll : function(){
		var i = 0;
		var data = {};
		var keys = Object.keys(localStorage);
		
		for (; i < keys.length; i++) {
			data[ keys[i] ] = localStorage.getItem( keys[i] );
		}

		return data;
		
	},
	write : function(key,value){
		localStorage[key] = value;
	},
	remove : function( key ){
		localStorage.removeItem( key );
	},
	removeAll : function(){
		localStorage.clear();
	}
}


/* local cookie handler */
leo.util.cookie = {
	read : function( key ){
		return $.cookie( key );		
	},
	readAll : function(){
		var objectCookie = {};
		$.each(document.cookie.split(/; */), function()  {
			var splitCookie = this.split('=');
			
			objectCookie[ splitCookie[0] ] = splitCookie[1];				
		});
		return objectCookie;
	},
	write : function( key, value ){
		 $.cookie( key, value, { expires: leo.config.EXPIRATION_DATE, path: '/', secure: true });
	},
	remove : function( key ){
		$.cookie( key, "", { expires: -1, path: '/', secure: true });
	},
	removeAll : function(){
		$.each(document.cookie.split(/; */), function()  {
			var splitCookie = this.split('=');		
			$.cookie( splitCookie[0] , "", { expires: -1, path: '/', secure: true });			
		});
	}
}