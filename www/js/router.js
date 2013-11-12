define(['jquery', 'underscore', 'backbone', 'views/login/LoginView', 
		'views/sign_in/SignInView',
		'views/news/NewsView',
		'views/mycards/MyCardsView',
		'views/establishments/EstablishmentsView'
		], function($, _, Backbone, LoginView, SignInView, NewsView, MyCardsView, EstablishmentsView) {

	var AppRouter = Backbone.Router.extend({
		routes : {
			'home' : 'home',
			'login' : 'login',
			'sign_in' : 'sign_in',
			'news' : 'news',
			'establishments' : 'establishments_list',
			'establishments/show/:id' : 'establishments_show',
			'mycards' : 'mycards',
			'*actions' : 'defaultAction'
		}
	});

	var initialize = function() {

		var app_router = new AppRouter;

		app_router.on('route:defaultAction', function(actions) {
			
			if(app.userLoggedIn === false)
			app_router.navigate("login", {
				trigger : true,
				replace : true
			});
		});

		app_router.on('route:establishments_show', function(id) {

			establishmentsView = new EstablishmentsView({id: id});
			establishmentsView.showView();
		});
		
		
		app_router.on('route:establishments_list', function(action) {

			establishmentsView = new EstablishmentsView();
			establishmentsView.list();
		});
		
		app_router.on('route:news', function() {

			newsView = new NewsView();
			newsView.render();
		});

		app_router.on('route:home', function() {

			homeView = new HomeView();
			homeView.render();
		});
		
		app_router.on('route:mycards', function() {

			mycardsView = new MyCardsView();
			mycardsView.render();
		});

		app_router.on('route:login', function() {

			loginView = new LoginView();
			loginView.render();
		});

		app_router.on('route:sign_in', function() {

			signInView = new SignInView();
			signInView.render();
		});

		app_router.on('route:alertview', function(type) {

			alertView = new AlertView({
				type : type
			});
			alertView.render();

		});

		Backbone.history.start();
	};
	return {
		initialize : initialize
	};
});
