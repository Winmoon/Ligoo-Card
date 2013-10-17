define(['jquery', 'underscore', 'backbone', 'text!templates/mycards/myCardsViewTemplate.html'], function($, _, Backbone, myCardsViewTemplate) {

	var myCardsView = Backbone.View.extend({
		el : $("#page .page-wrapper"),
		$headerTitle : $("#page .header > .title"),
		
		initialize : function (){
			showAppHeaderFooter(true, true);
		},
		
		render : function() {
			this.$headerTitle.html("Meus Cartões");
			this.$el.html(myCardsViewTemplate);
		}
	});
	return myCardsView;
});