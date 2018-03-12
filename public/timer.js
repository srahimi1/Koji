intervalID = null;

function getDateTime() {
	var n = new Date();
	v = n.getTime();
	postMessage(v);
} // end function getDateTime()

clearInterval(intervalID);
intervalID = setInterval(function(){getDateTime()},333);