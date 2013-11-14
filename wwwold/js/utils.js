function parseDate(myDate) {
	myDate = myDate.split(/[T ]/)[0].replace("-", "").replace("-", "");
	return myDate.substr(6, 3) + "/" + myDate.substr(4, 2) + "/" + myDate.substr(0, 4);
}