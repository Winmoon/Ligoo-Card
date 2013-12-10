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
			loader("show");
			_this = this;
			this.$headerTitle.html("Meus Cartões");

			get_cards(function(data) {

				_this.model = {
					mycards : JSON.parse(data.responseText),
					noHaveCards : JSON.parse(data.responseText).length <= 0 ? true : false
				};

				mycardsAdded = {};

				mycards = [];

				$(_this.model.mycards).each(function(i) {
					mycards.push({
						id : this.establishment_id,
						name : this.name,
						logo : this.logo_urls.thumb,
						pointsEarned : this.avaliable_points,
						pointsText : this.avaliable_points == 1 ? "ponto" : "pontos"
					});
				});

				_this.model.mycards = mycards;

				_this.templateOutput = app.loadTemplate("mycards", myCardsViewTemplate)(_this.model);
				_this.$el.html(_this.templateOutput);
				loader('hide');

			});

		}
	});
	return myCardsView;
});
