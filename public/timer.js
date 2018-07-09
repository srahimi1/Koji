timeoutID = null, dateStart = new Date(), start = dateStart.getTime(), time = 0;

function getDateTime() {
	time += 100;
	var n = new Date();
	v = n.getTime();
	postMessage(v);
	var diff = (new Date.getTime()) - start - time;
	clearTimeout(timeoutID);
	timeoutID = setTimeout(getDateTime,100 - diff);
} // end function getDateTime()

getDateTime();