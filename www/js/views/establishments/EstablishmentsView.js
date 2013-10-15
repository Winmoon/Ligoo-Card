define(['jquery', 'underscore', 'backbone', 
		'text!templates/establishments/listViewTemplate.html', 
		'text!templates/establishments/showViewTemplate.html'], 
		function($, _, Backbone, listViewTemplate, showViewTemplate) {

	var establishmentView = Backbone.View.extend({
		el : $("#page"),
		
		showView : function (id){
			//alert("OK");
			console.log(id);
			this.$el.html(showViewTemplate);
		},

		render : function() {
			
			if(this.options.id)//show establisment
				this.showView(this.options.id);
			else //list establishment
			this.$el.html(listViewTemplate);
			
		}
		
	});
	return establishmentView;
});