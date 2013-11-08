define(['jquery', 'underscore', 'backbone', 'mustache', 'text!templates/establishments/listViewTemplate.html', 'text!templates/establishments/showViewTemplate.html'], function($, _, Backbone, Mustache, listViewTemplate, showViewTemplate) {

	var establishmentView = Backbone.View.extend({
		el : $("#page .page-wrapper"),
		$headerTitle : $("#page .header > .title"),
		model : {},
		templateOutput : "",
		coupons : {},

		initialize : function() {
			showAppHeaderFooter(true, true);
			loader('show');
			this.$el.html("");
		},

		showView : function(id) {
			this.$headerTitle.html("Estabelecimento");

			_this = this;

			setTimeout(function() {

				get_coupons(function(data) {

					_this.coupons = JSON.parse(data.responseText);

					get_establishment(_this.options.id, function(data) {

						_this.model = {
							establishment : JSON.parse(data.responseText)
						};

						img_url_prefix = root_url.substring(0, root_url.length - 1);

						_this.model.establishment.logo = img_url_prefix + _this.model.establishment.logo_urls.thumb;
						_this.model.establishment.cover = img_url_prefix + _this.model.establishment.cover;
						_this.model.establishment.noTotalPoints = true;
						_this.model.establishment.totalPoints = 0;

						$(_this.coupons[0].points).each(function() {
							_this.model.establishment.totalPoints+=1;
						});
						
						_this.model.establishment.totalPoints=10;
						
						if(_this.model.establishment.totalPoints > 0){
							_this.model.establishment.noTotalPoints = false;
							_this.model.establishment.remove_icon = "remove-icon";
						}
						else _this.model.establishment.totalPoints = false;

						$(_this.model.establishment.promotions).each(function() {
							this.valid_until = parseDate(this.valid_until);
							this.percentage = (_this.model.establishment.totalPoints * 100) / this.points+"%";
							
							if(this.percentage == "100%"){
								
							}
							
						});

						_this.templateOutput = app.loadTemplate("establishments_show", showViewTemplate)(_this.model.establishment);
						_this.$el.html(_this.templateOutput);
						loader('hide');

					});
				});

			}, 2000);

		},

		events : {
			"click .item" : "open",
			"click .like-counter" : "like_counter"
		},

		like_counter : function() {

			loader('show');

			var cb = function(data) {

				var response = JSON.parse(data.responseText);

				if(response.user_id)
					popup("Obrigado por gostar de nosso estabelecimento!");
				else
					popup("Muito obrigado por gostar tanto de nós, porém, você pode curtir apenas uma vez.");

				loader('hide');
			};

			like_establishment(this.options.id, cb);
			//mobile.js
		},

		open : function(d) {

			var id = $(d.currentTarget).data("establishment-id");

			Backbone.Router.prototype.navigate("establishments/show/" + id, {
				trigger : true,
				replace : true
			});

		},

		list : function() {

			this.$headerTitle.html("Próximos a mim");

			_this = this;

			setTimeout(function() {

				var cb = function() {

					get_near_establishments(app.userCoord, function(data) {

						_this.model = {
							establishments : JSON.parse(data.responseText),
							noHaveEstablishments : JSON.parse(data.responseText).length <= 0 ? true : false
						};

						img_url_prefix = root_url.substring(0, root_url.length - 1);

						$(_this.model.establishments).each(function() {
							this.logo = img_url_prefix + this.logo_urls.thumb;

							this.distance = Math.round(this.distance) + "Km";

						});

						_this.templateOutput = app.loadTemplate("establishments", listViewTemplate)(_this.model);
						_this.$el.html(_this.templateOutput);
						loader('hide');

					});
				}
				getCoords(cb);

			}, 2000);

		}
	});
	return establishmentView;
});
