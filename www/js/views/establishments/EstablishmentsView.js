define(['jquery', 'underscore', 'backbone', 
		'text!templates/establishments/listViewTemplate.html', 
		'text!templates/establishments/showViewTemplate.html'], 
		function($, _, Backbone, listViewTemplate, showViewTemplate) {

	var establishmentView = Backbone.View.extend({
		el : $("#page .page-wrapper"),
		$headerTitle : $("#page .header > .title"),
		
		initialize : function (){
			showAppHeaderFooter(true, true);
		},
		
		showView : function (id){
			this.$headerTitle.html("Estabelecimento");
			this.$el.html(showViewTemplate);
		},

		render : function() {
			
			if(this.options.id)//show establisment
				this.showView(this.options.id);
			else{ //list establishment
				this.$headerTitle.html("Próximos a mim");
				this.$el.html(listViewTemplate);
			}
			
		}
		
	});
	return establishmentView;
});