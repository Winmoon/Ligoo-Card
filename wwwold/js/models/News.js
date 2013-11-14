define(function(require) {"use strict";

	var $ = require('jquery'), Backbone = require('backbone'), News = Backbone.Model.extend({

		defaults : {
			noHaveNews : true,
			news : false
		}

	}), NewsCollection = Backbone.Collection.extend({
		model : News
	});

	return {
		News: News,
		NewsCollection : NewsCollection
	};

});
