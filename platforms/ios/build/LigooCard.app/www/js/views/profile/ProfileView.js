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

				_this.model.birth_date = parseDate(_this.model.birth_date);

				_this.templateOutput = app.loadTemplate("me", profileTemplate)(_this.model);
				_this.$el.html(_this.templateOutput);
				loader('hide');
			});

		},
		
		close: function(){
			console.log("cllo");
		},
		
		events : {
			"click .btn-atualizar-profile" : 'profile_update'
		},

		profile_update : function() {
			update_profile("#profile-form");
		}

	});
	return ProfileView;
});
