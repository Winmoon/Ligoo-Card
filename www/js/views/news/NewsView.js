define(['jquery', 'underscore', 'backbone', 'text!templates/news/newsViewTemplate.html'], function($, _, Backbone, newsViewTemplate) {

	var NewsView = Backbone.View.extend({
		el : $("#page .page-wrapper"),
		$headerTitle : $("#page .header > .title"),
		
		initialize : function (){
			showAppHeaderFooter(true, true);
		},

		render : function() {
			this.$headerTitle.html("Novidades");
			this.$el.html(newsViewTemplate);
		}
	});
	return NewsView;
});