var create_coupon, create_point, get_coupons, get_establishment, get_establishments, get_near_establishments, get_news, get_points, get_profile, like_establishment, make_base_auth, root_url, sign_in, sign_up, update_profile, url;

root_url = "http://localhost:3000/";

url = function(url) {
	return root_url + url;
};

make_base_auth = function(user, password) {
	var hash, tok;
	tok = user + ":" + password;
	hash = $.base64.encode(tok);
	return "Basic " + hash;
};

sign_in = function() {
	return $.post(url("user/users/sign_in.json"), {
		user : {
			remember_me : 1,
			email : "admin3@winmoon.com",
			password : "123321321"
		}
	}, function(data) {
		if(data.id)
			app.userLoggedIn = true;

		return console.log(data);
	});
};

sign_up = function() {
	return $.post(url("user/users.json"), {
		user : {
			name : 'Usuario Teste 2',
			email : "admin3@winmoon.com",
			password : "123321321",
			password_confirmation : "123321321",
			gender : "M",
			birth_date : "23/10/1986",
			remember_me : 1
		}
	}, function(data) {
		return console.log(data);
	});
};

create_point = function(establishment) {
	return $.get(url("user/api/" + establishment + "/point.json"), {
		point_type : "qrcode"
	}, function(data) {
		return console.log(data);
	});
};

get_points = function() {
	return $.get(url("user/api/points.json"), function(data) {
		return console.log(data);
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

create_coupon = function(promotion) {
	return $.get(url("user/api/" + promotion + "/coupon.json"), function(data) {
		return console.log(data);
	});
};

get_coupons = function(cb) {

	$.get(url("user/api/coupons.json")).complete(function(data) {
		cb(data);
	});

};

like_establishment = function(establishment, cb) {

	$.get(url("user/api/" + establishment + "/like.json")).complete(function(data) {

		if(cb)
			cb(data);
	});
};

get_profile = function() {
	return $.get(url("user/api/profile.json"), {
		latitude : -16.6896407,
		longitude : -49.2511995
	}, function(data) {
		return console.log(data);
	});
};

update_profile = function() {
	return $.post(url("user/api/update_profile.json"), {
		user : {
			name : "Usuário com nome atualizado",
			birth_date : '23/11/2013',
			gender : 'M'
		}
	}, function(data) {
		return console.log(data);
	});
};

$(function() {
	$.ajaxSetup({
		dataType : "json",
		crossDomain : true,
		xhrFields : {
			withCredentials : true
		},
		statusCode : {
			401 : function() {
				if(confirm("Usuário não autenticado. Deseja fazer o Login?")) {
					return sign_in();
				}
			},
			400 : function(error) {
				return alert("Não passou na validação: " + error.responseText);
			},
			422 : function(error) {
				return alert("Não passou na validação: " + error.responseText);
			}
		}
	});
	$("#facebook_sign_in").click(function(e) {
		e.preventDefault();
		return FB.login((function(response) {
			if(response.authResponse) {
				console.log(response.authResponse);
				console.log("Connected! Hitting OmniAuth callback (GET users/auth/facebook/callback)...");
				return $.getJSON(url("users/auth/facebook/callback") + "?" + $.param({
					signed_request : response.authResponse.signedRequest
				}), {
					dataType : "json",
					crossDomain : true,
					xhrFields : {
						withCredentials : true
					}
				}, function(json) {
					return console.log(JSON.stringify(json));
				});
			}
		}), {
			scope : "email,read_stream"
		});
	});
	// get_news();
	// get_profile();
	// update_profile();
	// return get_profile();
});
