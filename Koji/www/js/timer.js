timeoutID = null, start = null, time = -100;

function getDateTime() {
	time += 100;
	var n = new Date();
	v = n.getTime();
	if (!start) start = v;
	postMessage(v);
	var diff = v - start - time;
	clearTimeout(timeoutID);
	timeoutID = setTimeout(function() {getDateTime()}, 100 - diff);
} // end function getDateTime()

getDateTime();