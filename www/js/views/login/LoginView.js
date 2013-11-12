define(['jquery', 'underscore', 'backbone', 'text!templates/login/loginTemplate.html', 'text!templates/login/loginWithAccount.html'], function($, _, Backbone, loginTemplate, loginWithAccount) {

	var LoginView = Backbone.View.extend({

		el : $("#page .page-wrapper"),

		initialize : function() {
			hideAppHeaderFooter(true, true);
			this.$el.html("");
		},

		events : {
			"click .btn-acesse-sua-conta" : 'go_login_with_account',
			"click .btn-cancelar" : 'cancel_login_with_account',
			"click .login_with_account_submit" : 'login_with_account_submit'
		},

		go_login_with_account : function() {
			this.$el.html(loginWithAccount);
		},

		cancel_login_with_account : function() {
			this.$el.html(loginTemplate);
		},

		login_with_account_submit : function() {

			var user = $("#login-with-account-form #email").val();
			var pass = $("#login-with-account-form #senha").val();

			if($.trim(user) == "" || $.trim(pass) == "") {
				alert("Email ou senha não informados, por favor verifique!");
				return;
			}
			
			loader('show');
			sign_in(user, pass);
			
		},

		render : function() {
			this.$el.html(loginTemplate);
		}
	});
	return LoginView;
});
