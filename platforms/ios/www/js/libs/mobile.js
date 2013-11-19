var create_coupon, create_point, get_coupons, get_establishment, get_establishments, get_near_establishments, get_news, get_points, get_profile, like_establishment, make_base_auth, root_url, sign_in, sign_up, update_profile, url;

// root_url = "http://192.168.2.9:3000/";
// root_url = "http://localhost:3000/";
root_url="http://ligoo-card.herokuapp.com/";

url = function(url) {
	return root_url + url;
};

make_base_auth = function(user, password) {
	var hash, tok;
	tok = user + ":" + password;
	hash = $.base64.encode(tok);
	return "Basic " + hash;
};

signin_with_facebook = function() {

	loader("show");

	FB.login((function(response) {

		if (response.authResponse) {

			var login_response = response.authResponse;

			FB.api('/me', {
				fields : 'birthday'
			}, function(response) {

				$.getJSON(url("users/auth/facebook/callback") + "?" + $.param({
					access_token : login_response.accessToken
				}), {
					dataType : "json",
					crossDomain : true,
					xhrFields : {
						withCredentials : true
					},
					birth_date : response.birthday.substr(3, 2) + "/" + response.birthday.substr(0, 2) + "/" + response.birthday.substr(6, 4)
				}, function(json) {

					localStorage.setItem("userData", JSON.stringify(json));
					app.userData = JSON.parse(localStorage.getItem("userData"));
					app.userLoggedIn = true;

				});

			});

			Backbone.Router.prototype.navigate("welcome", {
				trigger : true,
				replace : true
			});

		}

		loader("hide");

	}), {
		scope : "email"
	});
}
sign_in = function(user, pass) {
	loader('show');

	$.post(url("user/users/sign_in.json"), {
		user : {
			remember_me : 1,
			email : user,
			password : pass
		}
	}, function(data) {
		if (data.id) {

			localStorage.setItem("userData", JSON.stringify(data));
			app.userData = JSON.parse(localStorage.getItem("userData"));
			app.userLoggedIn = true;

			Backbone.Router.prototype.navigate("welcome", {
				trigger : true,
				replace : true
			});

		} else {
			popup(data.error);
		}

		loader('hide');

	});
};

sign_up = function(form) {

	if (!checkMandatories(form)) {

		var userDataArray = $("input", form).serializeArray();

		var userData = {};

		$(userDataArray).each(function(i, k) {
			userData[k.name] = k.value;
		});

		$.post(url("user/users.json"), {
			user : userData
		}, function(data) {
			if (data.id) {

				localStorage.setItem("userData", JSON.stringify(data));
				app.userData = JSON.parse(localStorage.getItem("userData"));

				Backbone.Router.prototype.navigate("welcome", {
					trigger : true,
					replace : true
				});

			}
		});
	}
};

update_profile = function(form) {

	loader("show");

	if (!checkMandatories(form)) {

		var userDataArray = $("input", form).serializeArray();

		var userData = {};

		$(userDataArray).each(function(i, k) {
			userData[k.name] = k.value;
		});

		$.post(url("user/api/update_profile.json"), {
			user : userData,
		}, function(data) {
			if (data.id)
				localStorage.setItem("userData", JSON.stringify(data));

			alert("Dados atualizados com sucesso");

			loader("hide");

		}).fail(function() {
			loader("hide");
		});
	}

};

create_point = function() {

	if ( typeof establishmentsView != "undefined" && establishmentsView.viewing == "showview") {
		barcodeScanner.scan(function(r) {

			$.get(url("user/api/" + r.text + "/point.json"), {
				point_type : "qrcode"
			}, function(data) {
				popup(messages.pointAdded);
				$(".establishment-total-points").text(parseInt($(".establishment-total-points").text()) + 1);
			});

		});
	}

};

get_points = function(cb) {
	$.get(url("user/api/points.json")).complete(function(data) {
		cb(data);
	});
};

get_establishments = function() {
	return $.get(url("user/api/establishments.json"), function(data) {
		return console.log(data);
	});
};

get_near_establishments = function(latlon, cb) {
	$.get(url("user/api/near_establishments.json"), {
		latitude : latlon[0],
		longitude : latlon[1]
	}).complete(function(data) {
		cb(data);
	}).fail(function(data) {
		loader("hide");
	});
};

get_news = function(cb) {
	$.get(url("user/api/news.json")).complete(function(data) {
		cb(data);
	});
};

get_establishment = function(establishment, cb) {

	$.get(url("user/api/" + establishment + "/establishment.json")).complete(function(data) {
		cb(data);
	});

};

create_coupon = function(promotion, cb) {
	$.get(url("user/api/" + promotion + "/coupon.json")).complete(function(data) {
		cb(data);
	});
};

check_coupon = function(coupon, establishment, cb) {
	$.get(url("user/api/" + establishment + "/check_coupon.json"), {
		coupon_id : coupon
	}).complete(function(data) {
		cb(data);
	});
};

like_establishment = function(establishment, cb) {

	$.get(url("user/api/" + establishment + "/like.json")).complete(function(data) {

		if (cb)
			cb(data);
	});
};

get_profile = function(cb) {
	$.get(url("user/api/profile.json"), function(data) {
		cb(data);
	});
};

// $(function() {
	// $.ajaxSetup({
		// dataType : "json",
		// crossDomain : true,
		// xhrFields : {
			// withCredentials : true
		// },
		// statusCode : {
			// 403 : function(d) {
// 
				// var data = JSON.parse(d.responseText);
// 
				// alert(data.error);
// 
				// Backbone.Router.prototype.navigate("login", {
					// trigger : true,
					// replace : true
				// });
// 
				// loader('hide');
			// },
			// 400 : function(error) {
				// return alert("Não passou na validação: " + error.responseText);
			// },
			// 422 : function(error) {
				// return alert("Não passou na validação: " + error.responseText);
			// }
		// }
	// });
// 
	// // get_news();
	// // get_profile();
	// // update_profile();
	// // return get_profile();
// });
