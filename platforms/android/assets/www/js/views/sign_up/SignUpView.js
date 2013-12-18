define(['jquery', 'underscore', 'backbone', 'text!templates/sign_up/signUpTemplate.html'], function($, _, Backbone, signUpTemplate) {

	var SignUpView = Backbone.View.extend({
		el : $("#page .page-wrapper"),

		$headerTitle : $("#page .header > .title"),
		
		events : {
			"click .btn-cancelar" : 'cancel_sign_up',
			"click .sign_up_submit" : 'sign_up_submit',
		},

		cancel_sign_up: function(){
			Backbone.Router.prototype.navigate("login", {
				trigger : true,
				replace : true
			}); 	
		},
		
		prepareToDie : function() {
			this.undelegateEvents();
			return this;
		},
		
		sign_up_submit: function(){
			sign_up("#signup-form"); 	
		},
		
		initialize: function(){
			showAppHeaderFooter(true);
			hideAppHeaderFooter(false,true);
		},

		render : function() {
			this.$headerTitle.html("Cadastre-se");
			this.$el.html(signUpTemplate);
		}
	});
	return SignUpView;
});
