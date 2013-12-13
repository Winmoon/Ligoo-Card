define(['jquery', 'underscore', 'backbone', 'views/login/LoginView', 'views/sign_up/SignUpView', 'views/news/NewsView', 'views/mycards/MyCardsView', 'views/establishments/EstablishmentsView', 'views/welcome/WelcomeView', 'views/profile/ProfileView'], function($, _, Backbone, LoginView, SignUpView, NewsView, MyCardsView, EstablishmentsView, WelcomeView, ProfileView) {

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

			if (app.userLoggedIn === false)
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

			if(typeof profileView !="undefined"){
				profileView.prepareToDie();
				delete profileView;
			}
			
			profileView = new ProfileView();
			
			profileView.render();
		});

		app_router.on('route:welcome', function() {

			welcomeView = new WelcomeView();
			welcomeView.render();
		});

		app_router.on('route:establishments_show', function(id) {

			if(typeof establishmentsView !="undefined"){
				establishmentsView.prepareToDie();
				delete establishmentsView;
			}
			
			establishmentsView = new EstablishmentsView({
				id : id
			});
			
			establishmentsView.showView();
		});

		app_router.on('route:establishments_list', function(action) {

			if(typeof establishmentsView !="undefined"){
				establishmentsView.prepareToDie();
				delete establishmentsView;
			}
			
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

			if(typeof loginView !="undefined"){
				loginView.prepareToDie();
				delete loginView;
			}
			
			loginView = new LoginView(action);
			loginView.render();
		});

		app_router.on('route:sign_in', function() {

			if(typeof signUpView !="undefined"){
				signUpView.prepareToDie();
				delete signUpView;
			}
			
			signUpView = new SignUpView();
			signUpView.render();
		});

		Backbone.history.start();
	};
	return {
		initialize : initialize
	};
});
