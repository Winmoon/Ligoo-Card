define(['jquery', 'underscore', 'backbone', 'text!templates/sign_in/signInTemplate.html'], function($, _, Backbone, signInTemplate) {

	var SignInView = Backbone.View.extend({
		el : $("#page"),

		render : function() {
			this.$el.html(signInTemplate);
		}
	});
	return SignInView;
});