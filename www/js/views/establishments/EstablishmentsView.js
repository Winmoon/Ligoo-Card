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

						$(_this.model.establishments).each(function() {
							this.logo = img_url_prefix + this.logo_urls.thumb;
						});

						_this.templateOutput = app.loadTemplate("establishments_show", showViewTemplate)(_this.model.establishment);
						_this.$el.html(_this.templateOutput);
						loader('hide');

					});
				});

			}, 2000);

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
