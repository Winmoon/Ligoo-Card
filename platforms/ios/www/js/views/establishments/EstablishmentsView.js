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
		},

		showView : function(id) {
			this.viewing = "showview";

			this.$headerTitle.html("Estabelecimento");

			_this = this;

			setTimeout(function() {

				get_points(_this.options.id, function(data) {
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

						_this.model.establishment.id = _this.options.id;

						img_url_prefix = root_url.substring(0, root_url.length - 1);

						_this.model.establishment.logo = _this.model.establishment.logo_urls.thumb;
						_this.model.establishment.cover = _this.model.establishment.cover;

						_this.model.establishment.noTotalPoints = true;
						_this.model.establishment.totalPoints = _this.pointsEarned;

						_this.model.establishment.pointsLabel = "pontos";

						if (_this.model.establishment.totalPoints > 0) {
							_this.model.establishment.noTotalPoints = false;
							_this.model.establishment.remove_icon = "remove-icon";
							_this.model.establishment.haveTotalPoints = true;

							if (_this.model.establishment.totalPoints == 1)
								_this.model.establishment.pointsLabel = "ponto";
							else
								_this.model.establishment.pointsLabel = "pontos";

						} else if (_this.model.establishment.totalPoints <= 0) {
							_this.model.establishment.add_card = "add_card_mycards";
							_this.model.establishment.haveTotalPoints = false;
							_this.model.establishment.pointsLabel = "";
						}

						havePremiuns = false;
						$(_this.model.establishment.promotions).each(function() {

							this.valid_until = parseDate(this.valid_until);
							this.percentage = (_this.model.establishment.totalPoints * 100) / this.points + "%";

							if (parseInt(this.percentage) >= 100) {
								this.percentage = "100%";
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

						_this.model.establishment.lovelly = "";
						if (_this.model.establishment.likes_count > 1)
							_this.model.establishment.lovelly = "gostaram";
						else
							_this.model.establishment.lovelly = "gostou";

						get_cards(function(data) {

							data = JSON.parse(data.responseText);

							$(data).each(function(i) {

								if (this.establishment_id == _this.options.id) {
									_this.model.establishment.add_card = "";
									_this.model.establishment.haveTotalPoints = true;
									_this.model.establishment.remove_icon = "remove-icon";
									_this.model.establishment.add_card = "";
									_this.model.establishment.noTotalPoints = false;
									if (_this.model.establishment.totalPoints == 1)
										_this.model.establishment.pointsLabel = "ponto";
									else
										_this.model.establishment.pointsLabel = "pontos";
									return;
								}
							});

							_this.templateOutput = app.loadTemplate("establishments_show", showViewTemplate)(_this.model.establishment);
							_this.$el.html(_this.templateOutput);

						});

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
			"click .refresh" : "refresh",
			"click .add_card_mycards" : "add_card_mycards"
		},

		add_card_mycards : function(e) {
			create_card(this.options.id, $(e.currentTarget));
		},

		refresh : function() {
			establishmentsView.initialize();
			establishmentsView.showView(this.options.id);
		},

		updateBarPremiuns : function(points) {
			havePremiuns = false;

			establishmentsView.model.establishment.totalPoints += points;

			$(establishmentsView.model.establishment.promotions).each(function() {

				this.percentage = (establishmentsView.model.establishment.totalPoints * 100) / this.points + "%";

				establishmentsView.$el.find("#establishments-show-view .ofertas-item[data-promotion-id=" + this.id + "] .points-to-win").css("width", this.percentage);

				if (parseInt(this.percentage) >= 100) {
					havePremiuns = true;
					this.wonPremiumClass = "won-premium";

					establishmentsView.$el.find("#establishments-show-view .ofertas-item[data-promotion-id=" + this.id + "]").addClass(this.wonPremiumClass);
					establishmentsView.$el.find("#establishments-show-view .ofertas-item[data-promotion-id=" + this.id + "] .points-to-win").addClass(this.wonPremiumClass);

				}
			});

			if (havePremiuns)
				popup(messages.premiumWon);
		},

		won_coupon_create_coupon : function(d) {
			var id = $(d.currentTarget).data("promotion-id");
			var el = $(d.currentTarget);

			var _this = this;

			var cb = function() {
				barcodeScanner.scan(function(r) {

					if (!r.cancelled) {
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
					}

				});
			};

			navigator.notification.confirm("Esta operação deve ser realizada no estabelecimento, caso contrário, poderá perder seus pontos. Deseja prosseguir?", function(b) {
				if (b == 1)
					cb();

			}, "Atenção!");

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
							this.logo = this.logo_urls.thumb;
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
