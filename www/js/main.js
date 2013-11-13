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
		lollipop: 'libs/jquery/lollipop',
		base64: 'libs/base64',
		mobile: 'libs/mobile', //TODO verificar se será retirado
		animate_loader: 'libs/animate_loader',
		facebook: 'libs/fb',
		FB: 'libs/facebook'
	},
	shim : {
		FB : {
			deps: ['jquery', 'facebook']
		},
		facebook : {
			deps: ['jquery']
		},
		base64 : {
			deps: ['jquery']
		},
		mobile : {
			deps: ['base64','jquery']
		},
		mustache : {
			deps: ['jquery']
		},
		blockui : {
			deps: ['jquery']
		},
		lollipop: {
			deps: ['jquery']
		}
	}	
});

require([
// Load our app module and pass it to our definition function
'app', 'jquery', 'fastclick', 'mustache', 'blockui', 'lollipop', 'base64', 'mobile', 'animate_loader' , 'facebook', 'FB'], function(App) {
	// The "app" dependency is passed in as "App"
	// Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
	App.initialize();
});
