// Ext.Ajax.on('beforerequest', function (conn, options) {
	// console.log('test to see if running');
   // if (!(/^http:.*/.test(options.url) || /^https:.*/.test(options.url))) {
     // if (typeof(options.headers) == "undefined") {
       // options.headers = {'X-CSRFToken': Ext.util.Cookies.get('csrftoken')};
     // } else {
       // options.headers.extend({'X-CSRFToken': Ext.util.Cookies.get('csrftoken')});
     // }                        
   // }
// }, this);
// 
// Ext.Ajax.on('beforerequest', function (conn, options) {
	// console.log('test to see if running');
   // if (!(/^http:.*/.test(options.url) || /^https:.*/.test(options.url))) {
     // if (typeof(options.headers) == "undefined") {
       // options.headers = {'X-CSRF-TOKEN': Ext.util.Cookies.get('XSRF-TOKEN')};
     // } else {
       // options.headers.extend({'X-CSRF-TOKEN': Ext.util.Cookies.get('XSRF-TOKEN')});
     // }                        
   // }
// }, this);

//TODO Tried this to deal with Laravel 5 CSRF Tokens but couldn't get it to work