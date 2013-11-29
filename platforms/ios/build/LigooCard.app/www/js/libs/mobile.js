var create_coupon, create_point, get_coupons, get_establishment, get_establishments, get_near_establishments, get_news, get_points, get_profile, like_establishment, make_base_auth, root_url, sign_in, sign_up, update_profile, url;

//root_url = "http://192.168.2.19:3000/";
// root_url = "http://localhost:3000/";
// root_url = "http://10.0.0.102:3000/";
// root_url = "http://10.0.0.100:3000/";
root_url = "http://ligoo-card.herokuapp.com/";

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

	FB.getLoginStatus(function(responseStatus) {
		console.log(responseStatus);
		
		var accessToken = responseStatus.authResponse.accessToken;
		
		if (responseStatus.status == 'connected') {
			FB.api('/me', {
				fields : 'birthday, gender'
			}, function(responseMe) {

				if (!responseMe.id)
					return false;

				var birthday = responseMe.birthday.substr(3, 2) + "/" + responseMe.birthday.substr(0, 2) + "/" + responseMe.birthday.substr(6, 4);

				var gender = responseMe.gender == "male" ? "M" : "F";

				$.getJSON(url("users/auth/facebook/callback") + "?" + $.param({
					access_token : accessToken
				}), {
					dataType : "json",
					crossDomain : true,
					xhrFields : {
						withCredentials : true
					}
				}, function(json) {

					localStorage.setItem("userData", JSON.stringify(json));
					app.userData = JSON.parse(localStorage.getItem("userData"));
					app.userLoggedIn = true;

					$.post(url("user/api/update_profile.json"), {
						user : {
							birth_date : birthday,
							gender : gender
						}
					}, function(data) {

						if (data.id) {
							localStorage.setItem("userData", JSON.stringify(data));

							Backbone.Router.prototype.navigate("welcome", {
								trigger : true,
								replace : true
							});

						}

					}).fail(function() {
						loader("hide");
					});

				});

			});
		} else if (responseStatus.status == 'not_authorized' || responseStatus.status == 'unknown') {

			FB.login(function(responseLogin) {
				
				var accessToken = responseStatus.authResponse.accessToken;
				
				FB.api('/me', function(responseMe) {
					if (!responseMe.id)
						return false;

					$.getJSON(url("users/auth/facebook/callback") + "?" + $.param({
						access_token : accessToken
					}), {
						dataType : "json",
						crossDomain : true,
						xhrFields : {
							withCredentials : true
						}
					}, function(json) {

						localStorage.setItem("userData", JSON.stringify(json));
						app.userData = JSON.parse(localStorage.getItem("userData"));
						app.userLoggedIn = true;

						Backbone.Router.prototype.navigate("welcome", {
							trigger : true,
							replace : true
						});

						$.post(url("user/api/update_profile.json"), {
							user : {
								birth_date : birthday,
								gender : gender
							}
						}, function(data) {

							if (data.id)
								localStorage.setItem("userData", JSON.stringify(data));

						}).fail(function(e) {
							console.log(e);
							loader("hide");
						});

					});

				});
			}, {
				scope : 'email, publish_stream, publish_actions'
			});

		} else {
			console.log(responseStatus);
			loader("hide");
			alert("ERROR");
		}

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

		console.log(data.error);

		if (data.id) {
			localStorage.setItem("userData", JSON.stringify(data));
			app.userData = JSON.parse(localStorage.getItem("userData"));
			app.userLoggedIn = true;

			Backbone.Router.prototype.navigate("welcome", {
				trigger : true,
				replace : true
			});
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

	barcodeScanner.scan(function(r) {

		loader("show");

		$.get(url("user/api/" + r.text + "/point.json"), {
			point_type : "qrcode"
		}, function(data) {

			establishmentsView.updateBarPremiuns(1);

			popup(messages.pointAdded);
			$(".establishment-total-points").text(parseInt($(".establishment-total-points").text()) + 1);

			if (establishmentsView.model.establishment.share_points > 0) {
				navigator.notification.confirm("Compartihe no facebook e ganhe " + establishmentsView.model.establishment.share_points + " ponto(s) a mais", function(d) {
					if (d == 1)
						share_point("Acabei de ganhar mais " + establishmentsView.model.establishment.share_points + " ponto(s) no " + establishmentsView.model.establishment.name, establishmentsView.model.establishment.share_points, establishmentsView.model.establishment.id);
				}, "Ganhe mais pontos!");
			}
		});

		loader("hide");

	});

};

share_point = function(message, points, id) {

	var establishment_id = id;

	var point = points;

	FB.api('/me/feed', 'post', {
		message : message
	}, function(response) {
		if (!response || response.error) {
			alert('Algum erro ao compartilhar seu ponto no facebook');
		} else {

			$.get(url("user/api/" + establishment_id + "/point.json"), {
				point_type : "share"
			}, function(data) {
				alert("OK, seu compartilhamento foi efetuado e você ganhou mais " + points + " ponto(s)", null, "Parabéns!");

				$(".establishment-total-points").text(parseInt($(".establishment-total-points").text()) + points);

				establishmentsView.updateBarPremiuns(points);

			});

		}
	});
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
