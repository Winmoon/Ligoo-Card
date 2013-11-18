define(['jquery', 'underscore', 'backbone', 'mustache', 'text!templates/welcome/welcomeTemplate.html'], function($, _, Backbone, Mustache, welcomeTemplate) {

	var WelcomeView = Backbone.View.extend({
		el : $("#page .page-wrapper"),
		$headerTitle : $("#page .header > .title"),
		model : {},
		templateOutput : "",

		initialize : function() {
			showAppHeaderFooter(true, true);
			loader('show');
			this.$el.html("");
		},

		render : function() {

			_this = this;

			this.$headerTitle.html("Bem vindo");

			_this.templateOutput = app.loadTemplate("welcome", welcomeTemplate)();
			_this.$el.html(_this.templateOutput);
			loader('hide');

		}
	});
	return WelcomeView;
});