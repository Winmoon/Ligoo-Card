define(['jquery', 'underscore', 'backbone', 'views/login/LoginView'], function($, _, Backbone, LoginView) {

	var AppRouter = Backbone.Router.extend({
		routes : {
			'home' : 'home',
			'login' : 'login',
			'*actions' : 'defaultAction'
		}
	});

	var initialize = function() {

		var app_router = new AppRouter;

		app_router.on('route:defaultAction', function(actions) {
			loginView = new LoginView();
			loginView.render();
		});

		app_router.on('route:home', function() {

				homeView = new HomeView();
				homeView.render();
		});

		Backbone.history.start();
	};
	return {
		initialize : initialize
	};
});
