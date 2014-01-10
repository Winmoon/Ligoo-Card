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

signin_with_facebook = function(cb) {

	loader("show");

	setTimeout(function() {
		if (FB._userStatus == "unknown" || FB._userStatus == "connected")
			FB.logout();

		FB.login((function(response) {

			if (!response || response.error) {
				console.log("response LOGIN", response);
			} else if (response.cancelled) {
			} else {

				setTimeout(function() {

					FB.api('/me/permissions', function(r) {
						
						if(!r.data[0].publish_stream == 1)
						FB.login(null, {
							scope : 'publish_actions'
						});

					});
				}, 1000);

				var login_response = response.authResponse;

				FB.api('/me', {
					fields : 'birthday, gender'
				}, function(response) {

					var birthday = response.birthday.substr(3, 2) + "/" + response.birthday.substr(0, 2) + "/" + response.birthday.substr(6, 4);

					var gender = response.gender == "male" ? "M" : "F";

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

						loader("hide");

						Backbone.Router.prototype.navigate("welcome", {
							trigger : true,
							replace : true
						});

						$.post(url("user/api/update_profile.json"), {
							user : {
								birth_date : birthday,
								gender : gender
							},
						}, function(data) {
							if (data.id)
								localStorage.setItem("userData", JSON.stringify(data));

						}).fail(function() {
							loader("hide");
						});

					}).fail(function() {
						loader("hide");
					});

				});

			}

		}), {
			scope : "email,user_birthday"
		});
	}, 2000);

};

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
		}).fail(function(e) {

			var _e = JSON.parse(e.responseText);

			if (e.status == 422)
				alert("Este email já está em uso");
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

			alert("Dados atualizados com sucesso", null, "Atualização de dados");

			loader("hide");

		}).fail(function() {
			loader("hide");
		});
	}

};

function calculateDistance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1 / 180;
	var radlat2 = Math.PI * lat2 / 180;
	var radlon1 = Math.PI * lon1 / 180;
	var radlon2 = Math.PI * lon2 / 180;
	var theta = lon1 - lon2;
	var radtheta = Math.PI * theta / 180;
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist);
	dist = dist * 180 / Math.PI;
	dist = dist * 60 * 1.1515;
	if (unit == "K" || unit == "") {
		dist = dist * 1.609344;
	}
	if (unit == "N") {
		dist = dist * 0.8684;
	}
	if (unit == "M") {
		dist = dist * 1.609344 * 1000;
	}
	return dist;
}

//abrir estabelecimento de forma externa
openViaExternal = function(id) {

	var id = id;

	Backbone.Router.prototype.navigate("establishments/show/" + id, {
		trigger : true,
		replace : true
	});

};

create_point = function() {

	loader("show");

	barcodeScanner.scan(function(r) {

		// var r = {
		// text : "1,ligoocard",
		// cancelled : false
		// };

		if (!r.cancelled) {

			var ligooValidator = r.text.split(",");

			if (ligooValidator[1] != "" && ligooValidator[1] != "ligoocard") {
				loader("hide");
				alert("Este QRCode não faz parte do Ligoocard", null, "Erro");
				return;
			} else if (ligooValidator[1] == "") {
				loader("hide");
				alert("Este QRCode não faz parte do Ligoocard", null, "Erro");
				return;
			}
			//
			var cb = function() {

				get_establishment(ligooValidator[0], function(data) {
					var establishment = JSON.parse(data.responseText);

					//Verifica se a distancia em metros da pessoa do estabelecimento é menor que o valor desejado, caso seja é pq esta perto do estabelecimento
					if (calculateDistance(app.userCoord[0], app.userCoord[1], establishment.latitude, establishment.longitude, "M") <= 1000) {

						var establishmentID = parseInt(ligooValidator[0]);

						// setTimeout(function() {
						$.get(url("user/api/" + establishmentID + "/point.json"), {
							point_type : "qrcode"
						}, function(data) {

							if ( typeof establishmentsView != "undefined") {
								establishmentsView.updateBarPremiuns(1);
								if ($.isNumeric(parseInt($(".establishment-total-points").text())))
									$(".establishment-total-points").text(parseInt($(".establishment-total-points").text()) + 1);
								else {
									$(".establishment-total-points").parent().addClass("remove-icon").removeClass("add_card_mycards");
									$(".establishment-total-points").parent().html('<div class="establishment-total-points">1</div> ponto');
								}
							} else
								openViaExternal(ligooValidator[0]);

							popup(messages.pointAdded);

							if ( typeof app.userData.provider != "undefined" && app.userData.provider == "facebook") {

								if (establishment.share_points > 0) {

									var nDate = new Date();
									nDate = nDate.getDay() + "/" + nDate.getMonth() + "/" + nDate.getFullYear() + " - " + nDate.getHours() + ":" + nDate.getMinutes() + ":" + nDate.getSeconds();

									navigator.notification.confirm("Compartihe no facebook e ganhe " + establishment.share_points + " ponto(s) a mais", function(d) {
										if (d == 1) {
											loader("show");
											Lollipop.close();
											share_point("" + nDate + " - Acabei de ganhar mais " + establishment.share_points + " ponto(s) no " + establishment.name + "", establishment.share_points, establishmentID);
										}

									}, "Ganhe mais pontos!", ["Compartilhar", "Cancelar"]);
								}
							}

							loader("hide");

						}).fail(function(a, b, c) {

							if (c == "Unprocessable Entity")
								alert("Você só pode ganhar um ponto por dia neste estabelecimento.", null, "Oppss...");

							loader("hide");

						});

					} else {
						alert("Você deve estar no estabelecimento para pontuar.", null, "Atenção");
						loader("hide");
					}

				});

			};

			getCoords(cb);

		} else {
			loader("hide");
		}

	});

};

create_card = function(establishment, el) {
	$.get(url("user/api/" + establishment + "/card.json"), function(data) {
		el.html('<div class="establishment-total-points">0</div> pontos');
		el.addClass("remove-icon").removeClass("add_card_mycards");
		alert("Adicionado com sucesso!", null, "Adicionando cartão");
	});

};

share_point = function(message, points, id) {

	var establishment_id = id;

	var point = points;

	FB.api('/me/feed', 'post', {
		message : message
	}, function(response) {
		if (!response || response.error) {
			alert('Algum erro ao compartilhar seu ponto no facebook', null, "Erro ao compartilhar");
			loader("hide");
		} else {
			$.get(url("user/api/" + establishment_id + "/point.json"), {
				point_type : "share"
			}, function(data) {
				alert("OK, seu compartilhamento foi efetuado e você ganhou mais " + point + " ponto(s)", null, "Parabéns!");
				loader("hide");
				$(".establishment-total-points").text(parseInt($(".establishment-total-points").text()) + point);
				establishmentsView.updateBarPremiuns(point);
			});
		}
	});

};

get_points = function(establishment, cb) {
	$.get(url("user/api/" + establishment + "/points.json")).complete(function(data) {
		cb(data);
	});
};

get_cards = function(cb) {
	$.get(url("user/api/cards.json")).complete(function(data) {
		cb(data);
	});
};

get_establishments = function() {
	$.get(url("user/api/establishments.json"), function(data) {
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
