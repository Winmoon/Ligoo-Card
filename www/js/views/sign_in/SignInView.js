define(['jquery', 'underscore', 'backbone', 'text!templates/sign_in/signInTemplate.html'], function($, _, Backbone, signInTemplate) {

	var SignInView = Backbone.View.extend({
		el : $("#page .page-wrapper"),

		$headerTitle : $("#page .header > .title"),
		
		initialize: function(){
			showAppHeaderFooter(true);
			hideAppHeaderFooter(false,true);
		},

		render : function() {
			this.$headerTitle.html("Cadastre-se");
			this.$el.html(signInTemplate);
		}
	});
	return SignInView;
});
