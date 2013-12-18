define(['jquery', 'underscore', 'backbone', 'mustache', 'text!templates/news/newsViewTemplate.html'], function($, _, Backbone, Mustache, newsViewTemplate) {

	var NewsView = Backbone.View.extend({
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
			"click .news-post-box" : "open"
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
			
			this.$headerTitle.html("Novidades");
			
			setTimeout(function() {
				get_news(function(data){
					
					_this.model = {news: JSON.parse(data.responseText), noHaveNews: JSON.parse(data.responseText).length <= 0 ? true : false };
					
					img_url_prefix = root_url.substring(0,root_url.length-1);
					
					$(_this.model.news).each(function(){
						
						if(root_url == "http://localhost:3000/")
							this.establishment.logo_urls.thumb = img_url_prefix + this.establishment.logo_urls.thumb;
						else 
							this.establishment.logo_urls.thumb = this.establishment.logo_urls.thumb;
					});
					
					_this.templateOutput = app.loadTemplate("news", newsViewTemplate)(_this.model);
					_this.$el.html(_this.templateOutput);
					loader('hide');
					
				});
			    
			}, 2000);

		}
	});
	return NewsView;
});