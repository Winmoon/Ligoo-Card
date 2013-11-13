define(['jquery', 'underscore', 'backbone', 'views/login/LoginView', 
		'views/sign_up/SignUpView',
		'views/news/NewsView',
		'views/mycards/MyCardsView',
		'views/establishments/EstablishmentsView',
		'views/welcome/WelcomeView',
		'views/profile/ProfileView'
		], function($, _, Backbone, LoginView, SignUpView, NewsView, MyCardsView, EstablishmentsView, WelcomeView, ProfileView) {

	var AppRouter = Backbone.Router.extend({
		routes : {
			'home' : 'home',
			'login' : 'login',
			'sign_in' : 'sign_in',
			'news' : 'news',
			'establishments' : 'establishments_list',
			'establishments/show/:id' : 'establishments_show',
			'mycards' : 'mycards',
			'welcome' : 'welcome',
			'me' : 'me',
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
			else {
				app_router.navigate("welcome", {
				trigger : true,
				replace : true
			});
			}
		});
		
		app_router.on('route:me', function() {

			profileView = new ProfileView();
			profileView.render();
		});
		
		app_router.on('route:welcome', function() {

			welcomeView = new WelcomeView();
			welcomeView.render();
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

		app_router.on('route:login', function(action) {

			loginView = new LoginView(action);
			loginView.render();
		});

		app_router.on('route:sign_in', function() {

			signUpView = new SignUpView();
			signUpView.render();
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
