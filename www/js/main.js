require.config({
	paths : {
		jquery : 'libs/jquery/jquery-min',
		serializeObj : 'libs/jquery/jquery-serialize',
		underscore : 'libs/underscore/underscore-min',
		backbone : 'libs/backbone/backbone-min',
		templates : '../templates',
		blockui : 'libs/jquery/blockui',
		mustache : 'libs/jquery/mustache',
		fastclick : 'libs/fastclick',
	},
	shim : {
		mustache : {
			req : 'jquery'
		},
		blockui : {
			req : 'jquery'
		}
	}
});

require([
// Load our app module and pass it to our definition function
'app', 'jquery', 'fastclick', 'mustache', 'blockui'], function(App) {
	// The "app" dependency is passed in as "App"
	// Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
	App.initialize();
});
