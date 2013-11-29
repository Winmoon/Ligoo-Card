function parseDate(myDate) {
	myDate = myDate.split(/[T ]/)[0].replace("-", "").replace("-", "");
	return myDate.substr(6, 3) + "/" + myDate.substr(4, 2) + "/" + myDate.substr(0, 4);
}

function parseDateAmerica(myDate) {
	myDate = myDate.replace("/", "").replace("/", "");
	return myDate.substr(4, 4) + "-" + myDate.substr(2, 2) + "-" + myDate.substr(0, 2);
}