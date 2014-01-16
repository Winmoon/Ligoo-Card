app = {};
var pushNotification;
var facebookConnect;

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

	$("[rel*='mandatory radio']", "#signup-form").each(function() {
		var el = $(this);

		var radiusCount = $(this).find("[type='radio']").length;

		var countUncheckeds = 0;

		$(this).find("[type='radio']").each(function() {
			if (!this.checked)
				countUncheckeds++;
		});

		if (countUncheckeds > radiusCount - 1)
			el.addClass("mandatory");
		else
			el.removeClass("mandatory");
	});

	if (haveMandatories > 0) {
		alert('Campos obrigatórios não podem estar em branco', null, "Erro");
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

function prompt(message, cb, title, buttons, defaultTxt) {
	navigator.notification.prompt(message || "No message", cb ||
	function() {
	}, title || "Defaul prompt title", buttons || ['Ok', 'Cancelar'], defaultText || ' ');
}

function getCoords(cb) {

	app.userCoord = false;

	var _cb = cb;

	var success = function(s) {
		app.userCoord = [s.coords.latitude, s.coords.longitude];

		if (_cb)
			_cb();

	};
	//Notification.confirm(string, function, string, string) is deprecated.  Use Notification.confirm(string, function, string, array).
	var error = function(e) {
		navigator.notification.confirm("Não consegui pegar sua localização, por favor verifique: \n\n - Se está permitido o aplicativo a usar dados de localização. \n - Se está ativado o serviço de localização", function(b) {
			if (b == 2)
				getCoords(_cb);
		}, "Erro", ["Ok", "Tentar novamente"]);
		loader("hide");
	};

	navigator.geolocation.getCurrentPosition(success, error, {
		// enableHighAccuracy : true,
		// timeout : 10000
	});
}

// Filename: app.js
define(['jquery', 'fastclick', 'underscore', 'backbone', 'router', 'mustache' // Request router.js
], function($, FastClick, _, Backbone, Router, Mustache) {
	var initialize = function() {
		// Pass in our Router module and call it's initialize function

		$(".tab-icons a").css("width", $("body").width() / 5 - 20 + "px");
		$(".tab-icons a:eq(2)").css("width", $("body").width() / 5 + 46 + "px");

		new FastClick(document.body);

		Backbone.View.prototype.close = function() {
			this.remove();
			this.unbind();
			this.$el.unbind();
			this.el.unbind();
			if (this.onClose) {
				this.onClose();
			}
		}
		app = {
			userLoggedIn : false,
			compiledTemplates : {},
			loadTemplate : function(templName, tmpl) {

				if (!app.compiledTemplates[templName])
					app.compiledTemplates[templName] = Mustache.compile(tmpl);

				return app.compiledTemplates[templName];
			}
		};

		$.ajaxSetup({
			dataType : "json",
			crossDomain : true,
			xhrFields : {
				withCredentials : true
			},
			statusCode : {
				403 : function(d) {
					var data = JSON.parse(d.responseText);

					if (data.error)
						alert(data.error, null, "Erro");

					Backbone.Router.prototype.navigate("login", {
						trigger : true,
						replace : true
					});
					loader('hide');
				},

				401 : function(d) {
					var data = JSON.parse(d.responseText);

					if (data.error)
						alert(data.error, null, "Erro");

					Backbone.Router.prototype.navigate("login", {
						trigger : true,
						replace : true
					});
					loader('hide');
				},

				400 : function(error) {
					var data = JSON.parse(d.responseText);

					if (data.error)
						alert(data.error, null, "Erro");

					Backbone.Router.prototype.navigate("login", {
						trigger : true,
						replace : true
					});
					loader('hide');
				}
				// 422 : function(error) {
				// var data = JSON.parse(error.responseText);
				//
				// if (data.point_type)
				// alert(data.point_type, null, "Erro");
				// else if (data.error)
				// alert(data.error, null, "Erro");
				//
				// }
			}
		});

		FB.init({
			appId : "183318471871083",
			nativeInterface : CDV.FB,
			status : true,
			cookie : true,
			xfbml : true,
			oauth : true
		});

		if (localStorage.getItem("userData") != "" || typeof localStorage.getItem("userData") != "undefined")
			app.userData = JSON.parse(localStorage.getItem("userData"));
			
			
		onNotificationGCM = function(e) {
				
				alert("notify");
				console.log(e);
				$("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');

				switch( e.event ) {
					case 'registered':
						if (e.regid.length > 0) {
							$("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
							// Your GCM push server needs to know the regID before it can push to this device
							// here is where you might want to send it the regID for later use.
							console.log("regID = " + e.regid);
						}
						break;

					case 'message':
						// if this flag is set, this notification happened while we were in the foreground.
						// you might want to play a sound to get the user's attention, throw up a dialog, etc.
						if (e.foreground) {
							$("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');

							// if the notification contains a soundname, play it.
							var my_media = new Media("/android_asset/www/" + e.soundname);
							my_media.play();
						} else {// otherwise we were launched because the user touched a notification in the notification tray.
							if (e.coldstart)
								$("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
							else
								$("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
						}

						$("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
						$("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
						break;

					case 'error':
						$("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
						break;

					default:
						$("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
						break;
				}
			}

			tokenHandler = function(result) {
				$("#app-status-ul").append('<li>token: ' + result + '</li>');
				// Your iOS push server needs to know the token before it can push to this device
				// here is where you might want to send it the token for later use.
			}

			successHandler = function(result) {
				$("#app-status-ul").append('<li>success:' + result + '</li>');
			}

			errorHandler= function(error) {
				$("#app-status-ul").append('<li>error:' + error + '</li>');
			}
			

		document.addEventListener("deviceready", function(e) {

			// get_cards(function(data) {
			//
			// var _data = JSON.parse(data.status);
			//
			// if (_data.status == 401)
			// Backbone.Router.prototype.navigate("login", {
			// trigger : true,
			// replace : true
			// });
			// else
			// app.userLoggedIn = true;
			//
			navigator.splashscreen.hide();

			console.log("Device info");
			console.log(device.uuid);
			
			// handle GCM notifications for Android
			try {
				pushNotification = window.plugins.pushNotification;
				if (device.platform == 'android' || device.platform == 'Android') {
					$("#app-status-ul").append('<li>registering android</li>');
					pushNotification.register(successHandler, errorHandler, {
						"senderID" : "299520347793",
						"ecb" : "onNotificationGCM"
					});
					// required!
				} else {
					$("#app-status-ul").append('<li>registering iOS</li>');
					pushNotification.register(tokenHandler, errorHandler, {
						"badge" : "true",
						"sound" : "true",
						"alert" : "true",
						"ecb" : "onNotificationAPN"
					});
					// required!
				}
			} catch(err) {
				txt = "There was an error on this page.\n\n";
				txt += "Error description: " + err.message + "\n\n";
				alert(txt);
			}

			// facebookConnect = window.plugins.facebookConnect;
			//
			// });

			window.alert = navigator.notification.alert;

		}, "false");

		Router.initialize();

	};

	return {
		initialize : initialize
	};
});
