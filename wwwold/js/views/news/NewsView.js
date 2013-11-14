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

		render : function() {

			_this = this;
			
			this.$headerTitle.html("Novidades");
			
			// sign_in();//TODO retirar
			
			setTimeout(function() {
				get_news(function(data){
					
					_this.model = {news: JSON.parse(data.responseText), noHaveNews: JSON.parse(data.responseText).length <= 0 ? true : false };
					
					img_url_prefix = root_url.substring(0,root_url.length-1);
					
					$(_this.model.news).each(function(){
						this.establishment.logo_urls.thumb = img_url_prefix + this.establishment.logo_urls.thumb; 
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

/*

 *
 * [

 {
 "created_at": "2013-11-05T16:18:45.862Z",
 "news": "Olha só agora na subway o sabor churrasco está R$ 6,69, não fique de fora!",
 "establishment": {
 "id": 1,
 "name": "Subway",
 "address": "Rua 9, nº 1855, Qd E-16, Lt àrea, Lojas 212/213, Setor Marista Goiânia - GO 74150-130, Brasil",
 "phone": "11 1111 1111",
 "description": "teste",
 "latitude": "-16.0",
 "longitude": "-49.0",
 "logo_urls": {
 "original": "/system/establishments/logos/000/000/001/original/logo_subway.png?1383595269",
 "medium": "/system/establishments/logos/000/000/001/medium/logo_subway.png?1383595269",
 "thumb": "/system/establishments/logos/000/000/001/thumb/logo_subway.png?1383595269"
 },
 "cover": "/system/establishments/covers/000/000/001/original/subway_topo.jpg?1383674885"
 }
 }

 ]
 * */