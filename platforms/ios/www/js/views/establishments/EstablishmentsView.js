define(['jquery', 'underscore', 'backbone', 'mustache', 'text!templates/establishments/listViewTemplate.html', 'text!templates/establishments/showViewTemplate.html'], function($, _, Backbone, Mustache, listViewTemplate, showViewTemplate) {

	var establishmentView = Backbone.View.extend({
		el : $("#page .page-wrapper"),
		$headerTitle : $("#page .header > .title"),
		model : {},
		templateOutput : "",
		coupons : {},
		points : {},
		viewing : "",

		initialize : function() {
			showAppHeaderFooter(true, true);
			loader('show');
			this.$el.html("");
			this.$el.unbind();
		},

		showView : function(id) {
			this.viewing = "showview";
			
			this.$headerTitle.html("Estabelecimento");

			_this = this;

			setTimeout(function() {

				get_points(function(data) {
					_this.points = JSON.parse(data.responseText);

					_this.pointsEarned = 0;
					$(_this.points).each(function() {

						if (this.establishment_id == _this.options.id)
							_this.pointsEarned++;
					});

					//GEt establishments
					get_establishment(_this.options.id, function(data) {

						_this.model = {
							establishment : JSON.parse(data.responseText)
						};

						img_url_prefix = root_url.substring(0, root_url.length - 1);

						_this.model.establishment.logo = img_url_prefix + _this.model.establishment.logo_urls.thumb;
						_this.model.establishment.cover = img_url_prefix + _this.model.establishment.cover;
						_this.model.establishment.totalPoints = _this.pointsEarned;

						havePremiuns = false;
						$(_this.model.establishment.promotions).each(function() {

							this.valid_until = parseDate(this.valid_until);
							this.percentage = (_this.model.establishment.totalPoints * 100) / this.points + "%";

							if (parseInt(this.percentage) >= 100) {
								havePremiuns = true;
								this.wonPremiumClass = "won-premium";
							}
						});

						_this.model.establishment.liked = "Curtir";
						// padrao usuario ainda nao gostou do estabelecimento

						$(_this.model.establishment.likes).each(function() {
							if (app.userData.id === this.user_id)
								_this.model.establishment.liked = "Já curti!";
						});

						_this.templateOutput = app.loadTemplate("establishments_show", showViewTemplate)(_this.model.establishment);
						_this.$el.html(_this.templateOutput);
						loader('hide');

						if (havePremiuns === true)
							popup(messages.premiumWon);

					});

				});

			}, 2000);

		},

		events : {
			"click .item" : "open",
			"click .like-counter" : "like_counter",
			"click .ofertas-item.won-premium" : "won_coupon_create_coupon",
			"click .refresh" : "refresh"
		},

		refresh : function() {
			establishmentsView.initialize();
			establishmentsView.showView(this.options.id);
		},

		won_coupon_create_coupon : function(d) {
			var id = $(d.currentTarget).data("promotion-id");
			var el = $(d.currentTarget);

			var _this = this;

			if (confirm("Esta operação deve ser realizada no estabelecimento, caso contrário, poderá perder seus pontos. Deseja prosseguir?")) {

				barcodeScanner.scan(function(r) {

					var establishment_qrcode = r.text;

					create_coupon(id, function(data) {
						var response = JSON.parse(data.responseText);

						check_coupon(response.id, establishment_qrcode, function(data) {
							popup(messages.premiumConsumed + "<br><br> Código do cupom/prêmio: " + response.id);
							el.find(".points-to-win.won-premium").animate({
								width : "0%"
							}, 750);
							el.removeClass("won-premium");
							el.unbind();
							_this.refresh();
						});

					});

				});

			}
		},

		like_counter : function() {

			loader('show');

			var cb = function(data) {

				var response = JSON.parse(data.responseText);

				if (response.user_id) {
					popup("Obrigado por gostar de nosso estabelecimento!");
					$(".like-counter .counter").text(parseInt($(".like-counter .counter").text()) + 1);
				} else
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
			
			this.viewing = "listview";

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
