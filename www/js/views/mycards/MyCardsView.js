define(['jquery', 'underscore', 'backbone', 'text!templates/mycards/myCardsViewTemplate.html'], function($, _, Backbone, myCardsViewTemplate) {

	var myCardsView = Backbone.View.extend({
		el : $("#page"),

		render : function() {
			this.$el.html(myCardsViewTemplate);
		}
	});
	return myCardsView;
});