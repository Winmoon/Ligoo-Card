define(['jquery', 'underscore', 'backbone', 'text!templates/alerts/alertNoCardsTemplate.html'], function($, _, Backbone, alertNoCardsTemplate) {

	var AlertNoCardsView = Backbone.View.extend({
		el : $("#page"),

		render : function() {
			this.$el.html(alertNoCardsTemplate);
		}
	});
	return AlertNoCardsView;
});