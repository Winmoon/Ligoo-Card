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

			setTimeout(function() {

				get_points(function(data) {

					_this.model = {
						mycards : JSON.parse(data.responseText),
						noHaveCards : JSON.parse(data.responseText).length <= 0 ? true : false
					};

					mycardsAdded = {};

					mycards = [];

					$(_this.model.mycards).each(function(i) {
						if ( typeof mycardsAdded[this.establishment_id] == "undefined") {
							mycards.push({
								id : this.establishment_id,
								name : this.name,
								logo : this.logo_urls.thumb,
								pointsEarned : 0
							});

							mycardsAdded[this.establishment_id] = 1;
						} else {
							mycardsAdded[this.establishment_id] += 1;
						}
					});

					$(mycards).each(function(i, k) {

						k.pointsEarned = mycardsAdded[k.id];

						if (mycardsAdded[k.id] == 1)
							k.pointsText = "ponto";
						else
							k.pointsText = "pontos";

					});

					_this.model.mycards = mycards;

					get_cards(function(data) {

						_this.model.myOwnedCards = JSON.parse(data.responseText);
						_this.model.noHaveOwnedCards = JSON.parse(data.responseText).length <= 0 ? true : false;

						mycardsOwnedAdded = [];

						$(_this.model.myOwnedCards).each(function(i) {
							if ( typeof mycardsOwnedAdded[this.establishment_id] == "undefined") {

								if (_this.model.mycards.length > 0) {
									if ( typeof _this.model.mycards[i] != "undefined") {
										if (_this.model.mycards[i].id != this.establishment_id) {
											mycardsOwnedAdded.push({
												id : this.establishment_id,
												name : this.name,
												logo : this.logo_urls.thumb,
												pointsEarned : 0 + " pontos"
											});
										}
									} else {
										mycardsOwnedAdded.push({
											id : this.establishment_id,
											name : this.name,
											logo : this.logo_urls.thumb,
											pointsEarned : 0 + " pontos"
										});
									}
								} else {
									mycardsOwnedAdded.push({
										id : this.establishment_id,
										name : this.name,
										logo : this.logo_urls.thumb,
										pointsEarned : 0 + " pontos"
									});
								}
							}
						});

						_this.model.myOwnedCards = mycardsOwnedAdded;

						if (_this.model.noHaveOwnedCards == false || _this.model.noHaveCards == false)
							_this.model.noHaveCards = false;

						_this.templateOutput = app.loadTemplate("mycards", myCardsViewTemplate)(_this.model);
						_this.$el.html(_this.templateOutput);
						loader('hide');
					});

				});
			}, 2000);

		}
	});
	return myCardsView;
});
