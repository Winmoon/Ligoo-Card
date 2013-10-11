var app = {};

function alert(msg) {
	navigator.notification.alert(msg, null, "Alert", "OK");
}

function blockUI(msg, timeout) {
	$.blockUI({
		message : "<img src='imgs/loading.gif' /> <br> " + msg,
		css : {
			"padding" : "10px"
		},
		timeout : timeout || 0,
		allowBodyStretch : true
	});
}

function confirm(message, confirmCallback, title, buttonLabels, dismissCallback) {
	navigator.notification.confirm(message, function(b) {
		if(b == 1) {
			if(confirmCallback)
				confirmCallback();
		} else {
			if(dismissCallback)
				dismissCallback();
		}
	}, title || "Confirm", buttonLabels || ["Yes", "No"]);
}

function prompt(message, cb, title, buttons, defaultTxt) {
	navigator.notification.prompt(message || "No message", cb || function(){}, title || "Defaul prompt title", buttons || ['Ok','Cancelar'], defaultText || ' ');
}

compiledTemplates = {};
function renderTemplate(tmpl, cb) {

	$.get(tmpl + ".html", function(data) {
		respond = data;
		compiledTemplates[tmpl] = Mustache.compile(respond);
		if (cb)
			cb();
	}, "html");

}

// Filename: app.js
define(['jquery', 'fastclick', 'underscore', 'backbone', 'router' // Request router.js
], function($, FastClick, _, Backbone, Router) {
	var initialize = function() {
		// Pass in our Router module and call it's initialize function

		new FastClick(document.body);

		Backbone.View.prototype.close = function() {
			if(this.beforeClose) {
				this.beforeClose();
			}
			this.unbind();
			this.remove();
		};

		Router.initialize();
	};

	return {
		initialize : initialize
	};
});