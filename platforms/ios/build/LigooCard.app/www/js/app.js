app = {};

function alert(msg) {

	if ( typeof navigator.notification != "undefined")
		navigator.notification.alert(msg, null, "Alert", "OK");
	else
		console.log(msg);
}

function checkMandatories(form) {

	var haveMandatories = 0;

	$("[rel*='mandatory']", form).each(function() {
		if (this.value == "") {
			if (this.tagName == "INPUT")
				$(this).addClass("mandatory");
			else
				$(this).addClass("mandatory");

			haveMandatories++;
		} else {
			if (this.tagName == "INPUT")
				$(this).removeClass("mandatory");
			else
				$(this).removeClass("mandatory");
		}
	});

	if (haveMandatories > 0) {
		if ( typeof navigator.notification != "undefined")
			navigator.notification.alert('Campos obrigatórios não podem estar em branco', null, 'Erro', 'OK');
		else
			alert('Campos obrigatórios não podem estar em branco');

		return true;
	}

	return false;
}

function popup(msg, options) {

	var defaults = {
		showHeader : true,
		title : 'LIGOOCARD',
		content : msg,
		showCancelButton : false,
		animate : true,
		buttons : [{
			title : 'Ok',
			click : function() {
				Lollipop.close();
			}
		}],
		onOpen : function() {
			$("#lollipop-block-layer").click(function() {
				Lollipop.close();
			});
		}
	};

	var extend = $.extend(true, defaults, options);

	Lollipop.open(extend);
}

function showAppHeaderFooter(h, f) {

	if (h === true)
		$("#page .header").show();

	if (f === true)
		$("#page #footer").show();

	$(".page-wrapper").removeClass("remove-footer");

}

function hideAppHeaderFooter(h, f) {

	if (h === true)
		$("#page .header").hide();

	if (f === true) {
		$("#page #footer").hide();
		$(".page-wrapper").addClass("remove-footer");
	}

}

function loader(visibility) {

	new imageLoader(cImageSrc, 'startAnimation()');

	if (visibility == "hide") {
		$.unblockUI();
		stopAnimation();
	} else if (visibility == "show") {
		$.blockUI({
			message : "<div id='loaderImage'></div>",
			css : {
				"padding" : "10px",
				"border-radius" : "78px",
				"-webkit-border-radius" : "78px"
			},
			timeout : 0
		});
	}

}

function blockUI(msg, timeout) {

	if (!msg)
		msg = "";

	$.blockUI({
		message : "<div id='loaderImage'></div>" + msg,
		css : {
			"padding" : "10px",
		},
		timeout : timeout || 0,
		allowBodyStretch : true,
		onBlock : function() {
			new imageLoader(cImageSrc, 'startAnimation()');
		}
	});

}

// function confirm(message, confirmCallback, title, buttonLabels, dismissCallback) {
// navigator.notification.confirm(message, function(b) {
// if(b == 1) {
// if(confirmCallback)
// confirmCallback();
// } else {
// if(dismissCallback)
// dismissCallback();
// }
// }, title || "Confirm", buttonLabels || ["Yes", "No"]);
// } //TODO ativar quando usar o phonegap

function prompt(message, cb, title, buttons, defaultTxt) {
	navigator.notification.prompt(message || "No message", cb ||
	function() {
	}, title || "Defaul prompt title", buttons || ['Ok', 'Cancelar'], defaultText || ' ');
}

function getCoords(cb) {

	app.userCoord = false;

	var success = function(s) {
		console.log("s");
		console.log(s);
		app.userCoord = [s.coords.latitude, s.coords.longitude];

		if (cb)
			cb();

	};

	var error = function(e) {
		console.log("E");
		alert("No getCoords");
		loader("hide");
	};

	navigator.geolocation.getCurrentPosition(success, error);
}

// Filename: app.js
define(['jquery', 'fastclick', 'underscore', 'backbone', 'router', 'mustache' // Request router.js
], function($, FastClick, _, Backbone, Router, Mustache) {
	var initialize = function() {
		// Pass in our Router module and call it's initialize function

		new FastClick(document.body);

		Backbone.View.prototype.close = function() {
			if (this.beforeClose) {
				this.beforeClose();
			}
			this.unbind();
			this.remove();
		};

		app = {
			userLoggedIn : false,
			compiledTemplates : {},
			loadTemplate : function(templName, tmpl) {

				if (!app.compiledTemplates[templName])
					app.compiledTemplates[templName] = Mustache.compile(tmpl);

				return app.compiledTemplates[templName];
			}
		};

		get_points(function(data) {

			var _data = JSON.parse(data.status);

			if (_data.status == 401)
				Backbone.Router.prototype.navigate("login", {
					trigger : true,
					replace : true
				});
			else
				app.userLoggedIn = true;

		});

		FB.init({
			appId : "183318471871083",
			nativeInterface : CDV.FB,
			status : true,
			cookie : true,
			xfbml : true,
			frictionlessRequests : true,
			useCachedDialogs : true,
			oauth : true
		});

		Router.initialize();

	};

	return {
		initialize : initialize
	};
});
