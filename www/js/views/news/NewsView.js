define(['jquery', 'underscore', 'backbone', 'text!templates/news/newsViewTemplate.html'], function($, _, Backbone, newsViewTemplate) {

	var NewsView = Backbone.View.extend({
		el : $("#page"),

		render : function() {
			this.$el.html(newsViewTemplate);
		}
	});
	return NewsView;
});