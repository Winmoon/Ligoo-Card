define(['jquery', 'underscore', 'mustache', 'backbone', 'text!templates/profile/profileTemplate.html'], function($, _, Mustache, Backbone, profileTemplate) {

	var ProfileView = Backbone.View.extend({
		el : $("#page .page-wrapper"),
		$headerTitle : $("#page .header > .title"),
		model : {},
		templateOutput : "",

		initialize : function() {
			loader('show');
			this.$el.html("");
			this.undelegateEvents();
			_.bindAll(this);
		},
		
		prepareToDie : function() {
			this.undelegateEvents();
			return this;
		},

		render : function() {
			this.$headerTitle.html("Meu perfil");

			_this = this;

			get_profile(function(data) {
				_this.model = data;

				_this.model.maleCheck = _this.model.gender == "M" ? "checked" : "";
				_this.model.femCheck = _this.model.gender == "F" ? "checked" : "";
				
				_this.model.showPassword = true;
				
				if(typeof app.userData.provider !="undefined" && app.userData.provider == "facebook")
					_this.model.showPassword = false;

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
				
				FB.logout();
				app.userLoggedIn = false;
			}

			navigator.notification.confirm("Tem certeza que deseja sair?", function(b) {
				if (b == 1)
					cb();
			}, "Sair do Ligoocard");

		}
	});
	return ProfileView;
});
