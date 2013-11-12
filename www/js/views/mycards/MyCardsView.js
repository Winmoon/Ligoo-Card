define(['jquery', 'underscore', 'backbone', 'text!templates/mycards/myCardsViewTemplate.html'], function($, _, Backbone, myCardsViewTemplate) {

	var myCardsView = Backbone.View.extend({
		el : $("#page .page-wrapper"),
		$headerTitle : $("#page .header > .title"),
		model : {},
		templateOutput : "",

		initialize : function() {
			showAppHeaderFooter(true, true);
			loader('show');
			this.$el.html("");
		},
		
		events : {
			"click .item" : "open"
		},
		
		open : function(d) {

			var id = $(d.currentTarget).data("establishment-id");

			Backbone.Router.prototype.navigate("establishments/show/" + id, {
				trigger : true,
				replace : true
			});

		},

		render : function() {
			_this = this;
			this.$headerTitle.html("Meus Cartões");

			sign_in();

			setTimeout(function() {
				get_points(function(data) {

					_this.model = {
						mycards : JSON.parse(data.responseText),
						noHaveCards : JSON.parse(data.responseText).length <= 0 ? true : false
					};

					img_url_prefix = root_url.substring(0, root_url.length - 1);

					mycardsAdded = {};
					
					mycards = [];
					
					$(_this.model.mycards).each(function(i) {
						if(typeof mycardsAdded[this.establishment_id] == "undefined"){
							mycards.push({
								id: this.establishment_id,
								name: this.name,
								logo: img_url_prefix + this.logo_urls.thumb,
								pointsEarned: 0
							});
							
							mycardsAdded[this.establishment_id] = 1;
						}
						else{
							mycardsAdded[this.establishment_id] += 1;
						}
					});
					
					$(mycards).each(function(i, k) {
						
						k.pointsEarned = mycardsAdded[k.id];						
							
					});
					
					_this.model.mycards = mycards;
					
					_this.templateOutput = app.loadTemplate("mycards", myCardsViewTemplate)(_this.model);
					_this.$el.html(_this.templateOutput);
					loader('hide');

				});
			}, 2000);

		}
	});
	return myCardsView;
});
