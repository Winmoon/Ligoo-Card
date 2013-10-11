define(['jquery',
 'underscore', 'backbone', 
 'views/login/LoginView', 
 'views/sign_in/SignInView',
 'views/alerts/AlertNoCardsView'
 ], function($, _, Backbone, LoginView, SignInView, AlertNoCardsView) {

	var AppRouter = Backbone.Router.extend({
		routes : {
			'home' : 'home',
			'login' : 'login',
			'sign_in' : 'sign_in',
			'alert_no_cards' : 'alert_no_cards',
			'*actions' : 'defaultAction'
		}
	});

	var initialize = function() {

		var app_router = new AppRouter;

		app_router.on('route:defaultAction', function(actions) {
			
			app_router.navigate("alert_no_cards", {trigger: true, replace: true});
			
			
		});

		app_router.on('route:home', function() {

				homeView = new HomeView();
				homeView.render();
		});
		
		app_router.on('route:login', function() {

			loginView = new LoginView();
			loginView.render();
		});
		
		app_router.on('route:sign_in', function() {

				signInView = new SignInView();
				signInView.render();
		});
		
		app_router.on('route:alert_no_cards', function() {

				alertNoCardsView = new AlertNoCardsView();
				alertNoCardsView.render();
		});

		Backbone.history.start();
	};
	return {
		initialize : initialize
	};
});
