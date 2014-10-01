/**
* @namespace leo
*/
leo = {
	config: {
		EXPIRATION_DATE : 30, // in day unit
		FORCE_USE_COOKIE : true
	},
	util : {
		cookie : {},
		ls : {},		
		storage : {}
	}	
}

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