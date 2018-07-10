timeoutID = null, dateStart = new Date(), start = dateStart.getTime(), time = -100;

function getDateTime() {
	time += 100;
	var n = new Date();
	v = n.getTime();
	postMessage(v);
	var diff = v - start - time;
	clearTimeout(timeoutID);
	timeoutID = setTimeout(function() {getDateTime()}, 100 - diff);
} // end function getDateTime()

getDateTime();