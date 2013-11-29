define(['jquery', 'underscore', 'mustache', 'backbone', 'text!templates/profile/profileTemplate.html'], function($, _, Mustache, Backbone, profileTemplate) {

	var ProfileView = Backbone.View.extend({
		el : $("#page .page-wrapper"),
		$headerTitle : $("#page .header > .title"),
		model : {},
		templateOutput : "",

		initialize : function() {
			loader('show');
			this.$el.html("");
			this.$el.unbind();
		},

		render : function() {
			this.$headerTitle.html("Meu perfil");

			_this = this;

			get_profile(function(data) {
				_this.model = data;

				console.log(data);

				if (_this.model.birth_date != null)
					_this.model.birth_date = _this.model.birth_date;
					
				//_this.model.birth_date = parseDate(_this.model.birth_date);

				_this.model.maleCheck = _this.model.gender == "M" ? "checked" : "";
				_this.model.femCheck = _this.model.gender == "F" ? "checked" : "";

				_this.templateOutput = app.loadTemplate("me", profileTemplate)(_this.model);
				_this.$el.html(_this.templateOutput);
				loader('hide');
			});

		},

		close : function() {
			this.$headerTitle.parent().remove('btn-fazer-logout');
		},

		events : {
			"click .btn-atualizar-profile" : 'profile_update',
			"click .btn-fazer-logout" : 'logout'
		},

		profile_update : function() {
			update_profile("#profile-form");
		},

		logout : function() {

			var cb = function() {
				$.post(url("/user/users/sign_out.json"), {
					_method : "delete"
				}).complete(function() {
					Backbone.Router.prototype.navigate("login", {
						trigger : true,
						replace : true
					});
				});
			}
			
			navigator.notification.confirm("Tem certeza que deseja sair?", function(b) {
				if (b == 1)
					cb();
			}, "Sair do Ligoocard");
			
		}
	});
	return ProfileView;
});
