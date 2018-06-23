// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require_tree .

paymentRequestSent = false;
formcheck = [];
for (var i = 0; i < 4; i++) formcheck.push(false);
letterBoardsEmpty = false;
inputData = null;
cycleTopDataAt = 0;
cycleTopDataCounter = 0;
gameOver = false;
missedCorrect = 0;
numXs = 0;
points = 0;
linesDrawnSoFar = {};
numberOfLinesDrawnOnCanvas = 0;
currentAnswerColor = 0;
cycledThroughAnswerColors = false;
numberCorrect = 0;
divColors = {"div0" : "", "div1" :"", "answer" : ""};
gameData = null;
topData = null;
selectedDiv = null;
selectedUnderscore = null;
selectedLetters = [];
webWorker = null;
startTime = null;
lastTime = 0;
intervalID = null;
timeoutID = null;
borderIntervalID = null;
pointsIntervalID = null;
showLettersTimeoutID = null;
getNextColorsTimeoutID = null;
previousMinute = 0;
xhttp = new XMLHttpRequest();
counterU = 0;
correctLetters = [];
canvas = null, ctx = null, gc = null;
imageData = null;
similarLettersLowerCase = {"a": "egqdDQGB", "b": "hdgopqPFLK", "c": "eouvhyQEDO", "d": "bpqghPRBD", "e": "agqdEFKRP", "f": "ktjiFLKR", "g":"abdopqGQO", "h":"bdkrvHLRK", "i":"ljtILJT", "j":"iltTKRL", "k":"bdepxMWFE", "l": "ijtLPKH", "m": "nwuveWNRHE", "n": "muwvWRMK", "o":"bqpcdQBP", "p": "bdgceBRDE", "q": "pbdeBPDR", "r":"nuhHJLK", "s":"czg", "t": "ijlfk", "u": "vnyhc", "v": "unyc", "w": "mnhuvEM", "x": "kwmyz", "y": "zvukh", "z":"snum"};
similarLettersUpperCase = {"A": "VYUHegqd", "B": "KEPRFXhdgopq", "C": "GOQDeouvhy", "D": "CGOQbpqgh", "E": "KBPRFXMagqd", "F" : "KBEPRXktji", "G":"COQDabdopq", "H":"ITLJAbdkrv", "I":"HTLJljt", "J":"HITLilt", "K":"BEPRFXbdepx", "L":"HITJijt", "M":"NWUHEnwuv", "N": "MWUHEmuwv", "O": "CGQDbqpcd", "P": "KBERFXbdgce", "Q":"GCDOpbde", "R": "KBEPFXnuh", "S" : "ZCBE", "T": "HILJ", "U": "AVYH", "V" : "AYUN", "W" : "YMNEm", "X" : "BEKZS", "Y":"VUNH", "Z" : "SNMUXK"};
allLetters = {"a": 1, "b": 1, "c": 1, "d": 1, "e": 1, "f": "ktji", "g":"abdopq", "h":"bdkrv", "i":"ljt", "j":"ilt", "k":"bdepx", "l": "ijt", "m": "nwuv", "n": "muwv", "o":"bqpcd", "p": "bdgce", "q": "pbde", "r":"nuh", "s":"czg", "t": "ijlfk", "u": "vnyhc", "v": "unyc", "w": "mnhuv", "x": "kwmyz", "y": "zvukh", "z": 1, "A": 1, "B": 1, "C": 1, "D": 1, "E": 1, "F" : 1, "G": 1, "H": 1, "I": 1, "J": 1, "K": 1, "L": 1, "M": 1, "N": 1, "O": 1, "P": 1, "Q": 1, "R": 1, "S" : 1, "T": 1, "U": 1, "V" : 1, "W" : 1, "X" : 1, "Y": 1, "Z" : 1};

function getTitleBarHeight() {
	if (document && document.getElementById('KOJITitle')) {
		return document.getElementById('KOJITitle').offsetHeight;
	} else {
		return 0;
	}
} // end function getTitleBarHeight()

function setGameContentHeight() {
	if (document && document.getElementById('gameContent')) {
		var ht = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		document.getElementById('gameContent').style.height = ht - getTitleBarHeight() + 'px';
	}
} // end function setGameContentHeight()

function setCanvasParentHeight() {
	var c = document.getElementById("canvas1");
	c.parentNode.style.height = c.offsetHeight + "px";
	console.log("set");
} // end function setCanvasParentHeight()

function setButtonColorOnTouch(element) {
	if (document && document.getElementById(element)){
		document.getElementById(element).classList.add('touched');
	}
} // end function setButtonColorOnTouch(element)

function removeButtonColorOnTouchEnd(element) {
	if (document && document.getElementById(element)){
		document.getElementById(element).classList.remove('touched');
	}
} // end function removeButtonColorOnTouchEnd(element)

function expandGoalContainer() {
	var body = document.getElementsByTagName("body")[0];
	gc.parentNode.removeChild(gc);
	gc.style.position = "absolute";
	var pandx = document.getElementById("pointsandxsContainer");
	var totalht = document.getElementById("KOJITitle").offsetHeight + pandx.offsetHeight;
	gc.style.top = totalht + "px";
	body.appendChild(gc);
	canvas.style.height = canvas.offsetHeight + "px";
	document.getElementById("goal").style.height = canvas.offsetHeight + "px";
	gc.style.marginTop = (0 - pandx.offsetHeight) + "px";
	gc.style.height = document.getElementById('gameContent').offsetHeight + "px";
	gc.onclick = function() {shrinkGoalContainer();};
} // end function expandGoalContainer()

function shrinkGoalContainer() {
	var body = document.getElementsByTagName("body")[0];
	var go = document.getElementById("guessOuter");
	gc.style.marginTop = "0px";
	gc.style.height = canvas.offsetHeight + "px";
	setTimeout(function() {gc.parentNode.removeChild(gc); gc.style.position = "relative"; gc.style.top = "0px"; gc.style.height = (gc.offsetHeight - (gc.offsetHeight - canvas.offsetHeight)) + "px"; go.parentNode.insertBefore(gc,go.previousSibling.previousSibling);}, 1650);
} // end function shrinkGoalContainer()

function setupNewGame() {
	letterBoardsEmpty = false;
	inputData = null;
	cycleTopDataAt = 0;
	cycleTopDataCounter = 0;
	gameOver = false;
	missedCorrect = 0;
	numXs = 0;
	points = 0;
	linesDrawnSoFar = {};
	numberOfLinesDrawnOnCanvas = 0;	
	currentAnswerColor = 0;
	cycledThroughAnswerColors = false;
	numberCorrect = 0;
	divColors = {"div0" : "", "div1" :"", "answer" : ""};
	gameData = null;
	topData = null;
	selectedDiv = null;
	selectedUnderscore = null;
	selectedLetters = [];
	if (!!webWorker) webWorker.terminate();
	webWorker = null;
	startTime = null;
	lastTime = 0;
	clearInterval(intervalID);
	intervalID = null;
	clearTimeout(timeoutID);
	timeoutID = null;
	clearInterval(borderIntervalID);
	borderIntervalID = null;
	clearInterval(pointsIntervalID);
	pointsIntervalID = null;
	clearTimeout(showLettersTimeoutID);
	showLettersTimeoutID = null;
	clearTimeout(getNextColorsTimeoutID);
	getNextColorsTimeoutID = null;
	previousMinute = 0;
	xhttp.abort();
	counterU = 0;
	correctLetters = [];
	if (!!ctx) ctx.clearRect(0,0,canvas.width,canvas.height);
	canvas = null;
	ctx = null;
	imageData = null;
	gc = document.getElementById("goalContainer");
	document.getElementById("letterChoicesCont").style.display = "none";
	document.getElementById("pointsSpan").innerHTML = points;
	document.getElementById("gameMessage").innerHTML = "";
	var gameLD = document.getElementById("gameLettersDiv");
	while (gameLD.firstChild) gameLD.removeChild(gameLD.firstChild);
	gameLD.innerHTML = "";
	var box = document.getElementById("xbox1");
	var first = box.firstChild;
	while (first) {first.style.color = "#3a3a3a"; first.style.textShadow = "none"; first = first.nextSibling;}
	box = document.getElementById("xbox2");
	first = box.firstChild;
	while (first) {first.style.color = "#3a3a3a"; first.style.textShadow = "none"; first = first.nextSibling;}
	var goal = document.getElementById("goal");
	goal.innerHTML = "";
	goal.style.backgroundImage = "<%= asset_path 'transparent_background.jpg' %>";
	switchButtonsAndLetters(1);
	closeMenu(document.getElementById("menuDiv"));
	getGame();
	setGameContentHeight();
	return true;
}// function setupNewGame()

function getGame() {
	var csrfTok = document.querySelector("meta[name='csrf-token']").getAttribute("content");
	xhttp.abort();
	xhttp.open("POST", "/games");
	xhttp.setRequestHeader("Content-type", "");
	xhttp.setRequestHeader('X-CSRF-Token', csrfTok)
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			inputData = JSON.parse(this.responseText);
			localStorage.setItem("gameID", inputData.gameID);
			topData = inputData["colors"];
			cycleTopDataAt = Math.floor(Math.random() * 4) + 4;
			gameData = topData[0];
			colorGoalDiv();
			createColorDivs();
			createCanvasWithLetters();
			setCanvasParentHeight();
			return true;
		} // end if
	} // end onreadystatechange
	xhttp.send();
	return true;
} // function getGame()

// color mixing part of game functions ...

function colorGoalDiv() {
	var goalDiv = document.getElementById("goal");
	var v = document.getElementById("guessOuter");
	goalDiv.style.display = "none";
	goalDiv.style.backgroundImage = "none";
	goalDiv.style.backgroundColor = gameData.goalColor;
	goalDiv.style.display = "block";
	v.style.backgroundColor = gameData.goalColor;
	return true;
} // end function colorGoalDiv()


function cycleThroughTopData() {
	var prev = gameData.goalColor;
	gameData = topData[Math.floor(Math.random() * topData.length)];
	cycleTopDataAt = Math.floor(Math.random() * 4) + 4;
	cycleTopDataCounter = 0;
	colorGoalDiv();
	createColorDivs();
	changeColorOfSelectCanvasPixels(prev);
	return true;
} // function cycleThroughTopData()

function createColorDivs() {
	getColorsForHalfDivs();
	var frag = document.createDocumentFragment();
	for (var i = 0; i < 1; i++) {
		var divTempA = document.createElement("div");
		divTempA.setAttribute("class","guess-middle flex");
		divTempA.id = "bkcolor:div"+i;
		divTempA.style.backgroundColor = divColors["answer"];
		for (var j = 0; j < 2; j++) {
			var divTemp = createMixColorDivs();
			divTemp.style.backgroundColor = divColors["div"+j];
			divTemp.innerHTML = j+1;
			divTempA.appendChild(divTemp);
		} // end (var j = 0; j < 2; j++)
		frag.appendChild(divTempA);
	} // end for (var i = 0; i < 2; i++)
	guess.style.display = "none";
	while(!!guess.firstChild) guess.removeChild(guess.firstChild);
	guess.appendChild(frag);
	guess.style.display = "block";
	return true;
} // function createColorDivs()

function getNextColors(par, did) {
	cycleTopDataCounter++;
	if (cycleTopDataCounter == cycleTopDataAt) cycleThroughTopData();
	else if (!gameOver) {
		createColorDivs();
	} // if (!gameOver)
	return true;
} // function getNextColors(par, did)

function getColorsForHalfDivs() {
	var color1 = [], color2 = [], answer = [];
	var temp = gameData.goalColor;
	for (var i = 1; i < 6; i+=2) answer.push( parseInt(temp[i]+""+temp[i+1],16) )
	var opt = Math.floor(Math.random() * 5);
	var opt2 = null;
	for (var i = 0; i < 3; i++) {
		if (answer[i] < 40)
			factor = 0;
		else if (answer[i] < 120)
			factor = 30 + Math.floor(Math.random() * (answer[i]-30));
		else if ((answer[i] >= 120) && (answer[i] <= 150))
			factor = 30 + Math.floor(Math.random() * 51);
		else if (answer[i] > 150)
			factor = 30 + Math.floor(Math.random() * (210-answer[i]));
		
		if (opt == 0) { 
			color1[i] = answer[i] - factor; 
			color2[i] = answer[i] + factor;
		} else if (opt == 1) {
			color1[i] = answer[i] + factor;
			color2[i] = answer[i] - factor;
		} else if ((opt == 2) || (opt == 3) || (opt == 4)) {
			var shift = 0;
			if (factor < 30)
				shift = 0;
			else if (factor < 70)
				shift = 25;
			else 
				shift = 30;

			if (opt2 == null) opt2 = Math.floor(Math.random() * 12);
			if (opt2 == 0) {
				color1[i] = answer[i] + (factor + shift);
				color2[i] = answer[i] - (factor - shift);
			} else if (opt2 == 1) {
				color1[i] = answer[i] + (factor + shift);
				color2[i] = answer[i] - (factor - shift);
			} else if (opt2 == 2) {
				color1[i] = answer[i] - (factor - shift);
				color2[i] = answer[i] + (factor + shift);
			} else if (opt2 == 3) {
				color1[i] = answer[i] - (factor + shift);
				color2[i] = answer[i] + (factor - shift);
			} else if ((opt2 == 4) || (opt2 == 5)) {
				color1[i] = answer[i] - (factor + shift);
				color2[i] = answer[i] + factor;
			} else if ((opt2 == 6) || (opt2 == 7)) {
				color1[i] = answer[i] - factor;
				color2[i] = answer[i] + (factor - shift);
			} else if ((opt2 == 8) || (opt2 == 9)) {
				color1[i] = answer[i] + (factor - shift);
				color2[i] = answer[i] - factor;
			} else if ((opt2 == 10) || (opt2 == 11)) {
				color1[i] = answer[i] + factor;
				color2[i] = answer[i] - (factor + shift);
			}
		
			if (color1[i] > 255) color1[i] = 255;
			else if (color1[i] < 0 ) color1[i] = 0;

			if (color2[i] > 255) color2[i] = 255;
			else if (color2[i] < 0 ) color2[i] = 0;
		} // else if ((opt == 2) || (opt == 3) || (opt == 4))

	} // for (var i = 0; i < 3; i++)
	hex1 = getHexFromRGB(color1);
	hex2 = getHexFromRGB(color2);
	if ((opt == 0) || (opt == 1)) {
		divColors["div0"] = hex1;
		divColors["div1"] = hex2;
		divColors["answer"] = gameData.goalColor;
	} else if ((opt == 2) || (opt == 3) || (opt == 4)) {
		divColors["div0"] = hex1;
		divColors["div1"] = hex2;
		divColors["answer"] = createInBetweenColor(color1,color2);
	}
	return true;
} // function getColorsForHalfDivs()

// this creates the mini-half divs that combine
function createMixColorDivs() {
	var divTemp = document.createElement('div');
	divTemp.setAttribute("class","color-divs flex-center");
	return divTemp;
} // function createMixColorDivs()

function showUnderneathDiv(opt) {
	var par = document.getElementById("guess").firstChild;
	var cn = par.childNodes;
	cn[0].innerHTML = "";
	cn[1].innerHTML = "";
	cn[0].style.zIndex = "100";
	cn[1].style.zIndex = "101";
	cn[0].style.width = "100%";
	cn[1].style.width = "100%";
	cn[1].style.marginLeft = "-100%";
	cn[0].style.opacity = "0";
	cn[1].style.opacity = "0";
	var sendID = par.id + "";
	setTimeout(function() {determineResultOfChoice(sendID, opt);}, 500);
	if (numberCorrect != 4) 
		getNextColorsTimeoutID = setTimeout(function() {getNextColors(par, sendID);},2000);
	return true;
} // end function showUnderneathDiv(opt)

function determineResultOfChoice(sendID, opt) {
	var points = 0;
	code = null;
	if (divColors["answer"].toUpperCase() == gameData.goalColor.toUpperCase()) {
		var inner = "";
		if (opt == 0) {
			var inner1 = document.getElementById("itmatchessvg");
			var inner2 = document.getElementById("plus15svg");
			inner = inner1.innerHTML + "<br/>" + inner2.innerHTML;
			code = 0;
			missedCorrect = 0; 
			points = 15;
			numberCorrect++;
			drawLine();
		}
		else if (opt == 1) {
			inner = document.getElementById("youmissedthisonesvg").innerHTML;
			points = -15;
			code = 1;
			missedCorrect++; 
		}
		var main = document.getElementById(sendID);
		main.style.display = "none";
		main.innerHTML = inner;
		main.style.display = "block";
		var svg = null;
		if (points == 15) {
			svg = document.getElementById("plus15svg2");
			svg.style.left = "50%";
			svg.style.marginLeft = -(svg.getBoundingClientRect().width/2) + "px";
		}
	} // if (bkDivColors[key].toUpperCase() == gameData.goalColor.toUpperCase()) 
	else if (opt == 0) {
		var inner = document.getElementById("nodoesntmatchsvg").innerHTML;
		points = -15;
		code = 1;
		missedCorrect++; 
		var main = document.getElementById(sendID);
		main.style.display = "none";
		main.innerHTML = inner;
		main.style.display = "block";
	} // else if (opt == 0)
	else if (opt == 1) {
		points = 5;
		code = 2;
		var inner1 = document.getElementById("goodcallsvg");
		var inner2 = document.getElementById("plus5svg");
		inner = inner1.innerHTML + "<br/>" + inner2.innerHTML;
		var main = document.getElementById(sendID);
		main.style.display = "none";
		main.innerHTML = inner;
		main.style.display = "block";
		var svg = main.firstChild;
		svg = document.getElementById("plus5svg2");
		svg.style.left = "50%";
		svg.style.marginLeft = -(svg.getBoundingClientRect().width/2) + "px";
		missedCorrect = 0;		
	}
	
	if (missedCorrect == 3) {
		missedCorrect = 0; 
		isGameLost();
	}
	
	if ((points != 0) && (!gameOver)) {
		updatePoints(points, code);  
		if ((code == 0) || (code == 2))
			setTimeout(function() {animatePoints(points, code);},300);
	}
	return true;
} // function determineResultOfChoice(sendID, opt)

function createInBetweenColor(color1, color2) {
	var color1hex = "", color2hex = "";
	var hex;
	alpha = 0.5;
	var slice = [];
	slice[0] = Math.floor(color1[0] * alpha + (1-alpha) * color2[0]);
	slice[1] = Math.floor(color1[1] * alpha + (1-alpha) * color2[1]);
	slice[2] = Math.floor(color1[2] * alpha + (1-alpha) * color2[2]);
	hex = getHexFromRGB([slice[0],slice[1],slice[2]])
	return hex;
} // end function createInBetweenColor(color1, color2)

function getHexFromRGB(rgb) {
	var slice = [];
	slice.push(parseInt(rgb[0]));
	slice.push(parseInt(rgb[1]));
	slice.push(parseInt(rgb[2]));
	slice[0] = parseInt(slice[0]).toString(16);
	if (slice[0].length == 1) slice[0] = "0" + slice[0];
	slice[1] = parseInt(slice[1]).toString(16);
	if (slice[1].length == 1) slice[1] = "0" + slice[1];
	slice[2] = parseInt(slice[2]).toString(16);
	if (slice[2].length == 1) slice[2] = "0" + slice[2];
	var hex = "#" +  slice[0] + slice[1] + slice[2];
	return hex
} // end function getHexFromRGB(rgb)


// canvas and letter guessing part of game functions ...

function letterObj(letter, cs, font, size, rotation, correct) {
	this.letter = letter;
	this.cs = cs;
	this.font = font;
	this.size = size;
	this.rotation = rotation;
	this.correct = (!!correct) ? correct : false;
	this.index = null;
} // end function letterObj(letter, cs, font, size, rotation, correct)

function createCanvasWithLetters() {
	canvas = document.getElementById("canvas1");
	canvas.style.display = "none";
	ctx = canvas.getContext('2d');
	var width = Math.floor(canvas.width);
	var height = Math.floor(canvas.height);
	var fontSz = Math.floor(width*(1/inputData.letters.length));
	if (fontSz < 16) fontSz = 16;
	ctx.font = fontSz+"px Arial";
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";
	ctx.fillStyle = gameData.goalColor;
	var letters = inputData.letters;
	var tempfs = document.getElementById("goalContainer").offsetWidth / 23;
	for (var i = 0; i < letters.length; i++) {
		selectedLetters.push(null);
		var breakpoint;
		if (letters.length % 2 == 0) breakpoint = null;
		else if (letters.length %2 != 0) breakpoint = Math.ceil(letters.length/2);
		var angle = Math.random() * (Math.PI/4);
		if (Math.random() < 0.5) angle = 0-angle;
		ctx.translate(canvas.width/2, canvas.height/2);
		yShift = Math.floor(Math.random() * 3);
		if (yShift == 0) yShift = -0.5;
		else if (yShift == 1) yShift = 0;
		else if (yShift == 2) yShift = 0.5;
		if ( !breakpoint ) ctx.translate(-(letters.length/2-i)*fontSz*.75, yShift*fontSz);
		else if (!!breakpoint && (((i+1) < breakpoint) || ((i+1) > breakpoint))) ctx.translate(-(breakpoint-1-i)*fontSz*.75, yShift*fontSz);
		else if (!!breakpoint && ((i+1) == breakpoint)) ctx.translate(0, yShift*fontSz);
		var charCode = letters[i].charCodeAt(0);
		var cs = "";
		if ( (charCode >= 65) && (charCode <= 90) ) cs = "upper";
		else if ( (charCode >= 97) && (charCode <= 122) ) cs = "lower";
		//correctLetters.push(new letterObj(letters[i], cs, "Arial", tempfs, angle, true));
		correctLetters.push(new letterObj(letters[i], cs, "Arial", "2em", angle, true));
		ctx.rotate(angle);
		ctx.fillText(letters[i],0.5,0.5);
		ctx.setTransform(1,0,0,1,0,0);
	} // end for (var i = 0; i < letters.length; i++)
	canvas.style.display = "block";
	var direction = ["vertical", "horizontal"];
	var lineList = [];
	for (var i = 0; i < 100; i++) {
		var numOfLines = Math.floor( Math.random() * 2 ) + 2;
		numOfLines = 1;
		var tempArray = [];
		tempArray.push(numOfLines);
		if (i < 50 ) directionTemp = "vertical";
		else if (i >=50 ) directionTemp = "horizontal";
		for (var j = 0; j < numOfLines; j++) {
			var pos;
			if (directionTemp == "vertical") pos = i*(Math.floor(width/50)); 
			else if (directionTemp == "horizontal") pos = (i-50)*(Math.floor(height/50)); 
			tempArray.push([directionTemp, pos]);
		} // for (var j = 0; j < numOfLines; j++)
		lineList.push(tempArray);
	} // for (var i = 0; i < 100; i++)
	imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
	putLettersOntoPanels(letters, tempfs);
	return true;
} // end function createCanvasWithLetters()

function popUpALetter(letter) {
	clearInterval(borderIntervalID);
	var values = [0,0];
	var width = letter.clientWidth;
	var height = letter.clientHeight;
	var moved = 0;
	borderIntervalID = setInterval(
		function() {
			if (values[1] == -1) {
				clearInterval(borderIntervalID);
				numberCorrect = 0;
				letter.style.width = width + "px";
				letter.style.height = height + "px";
				letter.style.lineHeight = height + "px";					
				letter.style.padding = "0";
				letter.style.margin = "0";
				letter.parentNode.style.width = (width + 10) + "px";
				letter.parentNode.style.padding = "0";
				var ind = selectedUnderscore.id.split(":")[1];
				isChosenLetterCorrect(letter, ind);
				document.getElementById("letterChoicesCont").style.display = "none";
				selectedUnderscore = null;
				var par = document.getElementById("guess").firstChild;
				var cn = par.childNodes;
				var sendID = cn[0].id + "";
				if (!gameOver) setTimeout(function() {switchButtonsAndLetters(1);},3500);
				getNextColors(par, sendID);
			} else {					
				values[1] += 0.05;
				values = animateOriginalSmallOriginal(0, 100, values[1]);  
				values[0] = Math.floor(values[0]);
				if (((100 - values[0]) > 5)  && ((100 - values[0]) < 90)) {
					letter.style.padding = "0";
					letter.style.width = (width * ((100 - values[0])/100)) + "px";
					letter.style.height = (height * ((100 - values[0])/100)) + "px";				
					letter.style.top = -(height - (height * ((100 - values[0])/100)))/2 + "px";
				}
				if (((100 - values[0]) < 10) && (moved == 0)) {					
					letter.style.visibility = "hidden";
					letter.firstChild.style.fontSize = "2em";
					letter.style.padding = "0";
					if (!!selectedUnderscore.childNodes[0]) selectedUnderscore.removeChild(selectedUnderscore.childNodes[0]);
					selectedUnderscore.style.backgroundColor = "white";
					selectedUnderscore.appendChild(letter);	
					moved = 1;
				} else if (((100 - values[0]) > 1) && (moved == 1)) {					
					letter.style.visibility = "visible";
					moved = 2;
				} // if (((100 - values[0]) < 10) && (moved == 0)) 
			}
		},22);
	return true;
} // function popUpALetter(letter)

function isChosenLetterCorrect(letter, ind) {
	var ind2 = letter.id + "";
	ind2 = ind2.split(":")[1];
	if (correctLetters[ind].index == ind2) letterBorderAnimation(letter, 0);
	else letterBorderAnimation(letter, 1);
	if (isGameWon()) {document.getElementById("letterChoicesCont").style.display = "none"; var PandaThumbsUpSVG = document.getElementById("pandathumbsupsvg").innerHTML; var el = document.getElementById("gameMessage"); el.style.color = "#3ecf8e"; el.innerHTML = "You" + PandaThumbsUpSVG + "Won!"; showMenu(document.getElementById('gameMessageDiv')); el.parentNode.style.marginTop = -(el.offsetHeight/2) + "px"; setTimeout(function() {closeMenu(document.getElementById('gameMessageDiv'))},2000); showLetters(); } // if
	else if (isLetterBoardsEmpty()) {isGameLost();}
} // function isChosenLetterCorrect(letter, ind)

function putLettersOntoPanels(letters, fontSz) {
	var gameLD = document.getElementById("gameLettersDiv");
	var frag = document.createDocumentFragment();
	for (var i = 0; i < letters.length; i++) {
		var tempLetterChoicesDiv = document.createElement("div");
		tempLetterChoicesDiv.id = "letterChoices" + i;
		tempLetterChoicesDiv.style.width = "100%";
		tempLetterChoicesDiv.style.height = "100%";
		tempLetterChoicesDiv.style.background = "#363636";
		tempLetterChoicesDiv.style.display = "none";
		var container = document.getElementById("letterChoicesCont");
		container.appendChild(tempLetterChoicesDiv);
		var tempDivOuter = document.createElement("div");
		tempDivOuter.setAttribute("class","underscores");
		tempDivOuter.innerHTML = (i+1);
		tempDivOuter.id = "letterBox:"+i;
		tempDivOuter.onclick = function() {selectUnderscore(this, letters);}
		frag.appendChild(tempDivOuter);
		makeLetterDivs(i);
	} // for (var i = 0; i < letters.length; i++)
	gameLD.appendChild(frag);
	gameLD.style.display = "block";
} // function putLettersOntoPanels(letters) 

function changeColorOfSelectCanvasPixels(hexC) {
	var hexColor = hexC;
	var prevR = parseInt(hexColor[1]+""+hexColor[2], 16);
	var prevG = parseInt(hexColor[3]+""+hexColor[4], 16);
	var prevB = parseInt(hexColor[5]+""+hexColor[6], 16);

	hexColor = gameData.goalColor;

	var newR = parseInt(hexColor[1]+""+hexColor[2], 16);
	var newG = parseInt(hexColor[3]+""+hexColor[4], 16);
	var newB = parseInt(hexColor[5]+""+hexColor[6], 16);

	imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
	var pixArr = imageData.data;
	var len = pixArr.length;

	for (var i = 0; i < len; i = i + 4) {
		var r = pixArr[i];
		var g = pixArr[i+1];
		var b = pixArr[i+2];
		var a = pixArr[i+3];

		if (((r+5 >= prevR) && (r-5 <= prevR))  && ((g+5 >= prevG) && (g-5 <= prevG)) && ((b+5 >= prevB) && (b-5 <= prevB))) { pixArr[i] = newR; pixArr[i+1] = newG; pixArr[i+2] = newB;}
	}// for (var i = 0; i < len; i = i + 4)
	canvas.style.display = "none";
	ctx.putImageData(imageData, 0, 0);
	canvas.style.display = "block";
} // end function changeColorOfSelectCanvasPixels(hexColor)

function selectUnderscore(el, letters) {
	if (!gameOver && (numberCorrect == 4) ) {
		var repeat = false;
		if (!!selectedUnderscore && (selectedUnderscore == el)) {
			for (var i = 0; i < letters.length; i++) document.getElementById("letterChoices"+i).style.display = "none";
			document.getElementById("letterChoicesCont").style.display = "none";
			if (!selectedUnderscore.childNodes[0]) selectedUnderscore.style.borderBottom = "2px solid gray"; 
			else if (!!selectedUnderscore.childNodes[0]) selectedUnderscore.style.borderBottom = "";
			selectedUnderscore = null;
			repeat = true;
		} // if (!!selectedUnderscore && (selectedUnderscore == el))
		else if (!!selectedUnderscore && !selectedUnderscore.childNodes[0]) selectedUnderscore.style.borderBottom = "2px solid gray"; 
		else if (!!selectedUnderscore && !!selectedUnderscore.childNodes[0]) selectedUnderscore.style.borderBottom = ""; 
		
		if (!repeat) {
			selectedUnderscore = el;
			el.style.borderBottom="5px solid gray"; 
			showLetterChoices(el.id.split(":")[1], letters.length);
		} // if (!repeat) 
	} // end if (!gameOver && (numberCorrect == 4) ) {
	return true;
} // end function selectUnderscore(el, letters)

function drawLine() {
	var width = canvas.width;
	if (numberOfLinesDrawnOnCanvas < Math.floor(width * .75)) {
		var ind = Math.floor(Math.random() * (width+1));
		while (!!linesDrawnSoFar[ind]) ind = Math.floor(Math.random() * (width+1));
		linesDrawnSoFar[ind] = 1;
		numberOfLinesDrawnOnCanvas++;
	} else {
		var ind;
		for (var i = 0; i < Math.floor(width); i++) {
			if (!linesDrawnSoFar[i]) {ind = i; break;}
		}
		linesDrawnSoFar[ind] = 1;
		numberOfLinesDrawnOnCanvas++;				
	}
	canvas.style.display = "none";
	ctx.globalCompositeOperation = "xor";
	ctx.fillStyle = "white";
	ctx.setTransform(1,0,0,1,0,0);
	end = Math.floor(canvas.height);
	ctx.fillRect(ind,0,1,end);
	canvas.style.display = "block";
	return true;
} // end function drawLine()

function showLetterChoices(ind,len) {
	for (var i = 0; i < len; i++) document.getElementById("letterChoices"+i).style.display = "none";
	var el = document.getElementById("letterChoices"+ind);
	var letCC = document.getElementById("letterChoicesCont");
	el.style.verticalAlign = "middle";
	letCC.style.display = "block";
	el.style.display = "block";
	return true;
} // end function showLetterChoices(ind,len)

function makeLetterDivs(ind) {
	var frag = document.createDocumentFragment();
	var useTheseLetters = [];
	var orderedLetters = [];
	var cl = correctLetters[ind];
	var letterBlock = "";
	if (cl.cs == "upper") letterBlock = similarLettersUpperCase[cl.letter];
	else if (cl.cs == "lower") letterBlock = similarLettersLowerCase[cl.letter];
	letterBlock += cl.letter;
	orderedLetters.push(cl);
	var rotation, usedRotations = {};
	for (var i = 0; i < 5; i++) {
		rotation = parseFloat((Math.random() * (Math.PI/2)).toFixed(2));
		while (!!usedRotations[rotation] || ((rotation < cl.rotation + 0.5) && (rotation > cl.rotation - 0.5))) rotation = parseFloat((Math.random() * (Math.PI/2)).toFixed(2));
		usedRotations[rotation] = 1;
		if ( cl.rotation < 0 ) rotation = -rotation;
		//orderedLetters.push(new letterObj(letterBlock[Math.floor(Math.random()*letterBlock.length)], cl.cs, cl.font, cl.size, rotation ,false));
		orderedLetters.push(new letterObj(letterBlock[Math.floor(Math.random()*letterBlock.length)], cl.cs, cl.font, "2em", rotation ,false));
	}
	for (var i = 0; i < orderedLetters.length; i++) useTheseLetters.push(null);
	for (var i = 0; i < orderedLetters.length; i++) {
		var newInd = Math.floor(Math.random() * useTheseLetters.length);
		while (useTheseLetters[newInd] != null) newInd = Math.floor(Math.random() * useTheseLetters.length);
		useTheseLetters[newInd] = orderedLetters[i];
		if (i == 0) correctLetters[ind].index = newInd + "";
	}
	for (var i = 0; i  < useTheseLetters.length; i++) {
		angle = useTheseLetters[i].rotation * (180/Math.PI);
		var elP = document.createElement("p"); 
		elP.setAttribute("class","letter-p");
		elP.style.fontFamily = useTheseLetters[i].font;
		elP.style.webkitTransform = "rotate("+angle+"deg)";
		elP.style.WebkitTransform = "rotate("+angle+"deg)";
		elP.style.mozTransform = "rotate("+angle+"deg)";
		elP.style.MozTransform = "rotate("+angle+"deg)";
		elP.style.msTransform = "rotate("+angle+"deg)";
		elP.style.MsTransform = "rotate("+angle+"deg)";
		elP.style.oTransform = "rotate("+angle+"deg)";
		elP.style.OTransform = "rotate("+angle+"deg)";
		elP.style.transform = "rotate("+angle+"deg)";
		var t = document.createTextNode(useTheseLetters[i].letter);
		elP.appendChild(t);
		var div = document.createElement("div");
		div.id = "hoopla"+i+":"+i;
		div.setAttribute("class","letter-div");
		div.onclick = function(){selectLetter(this);}
		div.appendChild(elP);
		div.style.overflow = "hidden"; 
		frag.appendChild(div);
	}
	var el = document.getElementById("letterChoices"+ind);
	while (!!el.lastChild) el.removeChild(el.lastChild);

	el.appendChild(frag);
	var p = document.createElement("p");
	p.style.fontSize = "1.5em";
	p.style.color = "white";
	p.innerHTML = "- or -";
	el.appendChild(p);
	p = document.createElement("p");
	var a = document.createElement("a");
	a.href = "javascript:void(0);";
	a.innerHTML = "Not Yet";
	a.setAttribute("onclick", "selectLetter(-1)");
	a.style.color = "wheat";
	p.style.fontSize = "2em";
	p.appendChild(a);
	el.appendChild(p);
	return true;
} // end function makeLetterDivs(ind) 

function selectLetter(letter){
	if (!gameOver && (numberCorrect == 4) ) {
		numberCorrect = 0;
		if (letter != -1) {
			var par = selectedUnderscore;
			var ind = par.id.split(":")[1];
			//if (!!par.childNodes[0]) par.removeChild(par.childNodes[0]);
			popUpALetter(letter);
			par.style.borderBottom = "";
			selectedLetters[ind] = letter;
			letter.onclick = null;
		} else if (letter == -1){
			numberCorrect = 4;
			selectUnderscore(selectedUnderscore, inputData.letters);
			numberCorrect = 0;
			var par = document.getElementById("guess").firstChild;
			var cn = par.childNodes;
			var sendID = cn[0].id + "";
			switchButtonsAndLetters(1);
			getNextColors(par, sendID);
		} // if (letter != -1)
	} // if (!gameOver && (numberCorrect == 4) ) {
	return true;
} // end function selectLetter(letter)

function switchButtonsAndLetters(code) {
	switch(code) {
		case 1:
			document.getElementById("gameLettersContainer").style.display = "none";
			document.getElementById("instruction1").innerHTML = "Will mixing the colors in boxes 1 and 2 make the color shown above them?";
			document.getElementById("buttonsDiv").style.display = "flex";
			break;
		case 2:
			expandGoalContainer();
			/*document.getElementById("gameLettersContainer").style.display = "block";
			document.getElementById("instruction1").innerHTML = "Can you figure out what letters are being revealed in the top panel? Select a spot below to see the available letters for it.";
			document.getElementById("buttonsDiv").style.display = "none";*/
			break;
	}// end switch(code)
}


// end of game functions ...

function isGameWon() {
	if (!gameOver) {
		var par = document.getElementById("gameLettersDiv");
		var first = par.firstChild;
		var numLetts = 0;
		while(!!first) {
			if (!!first.firstChild && !!first.firstChild.id) {
				var id = first.firstChild.id + ""; 
				if (id[0]=="h") numLetts++;
			} 
			first = first.nextSibling;
		}
		if (numLetts == correctLetters.length) {
			first = par.firstChild;
			var ind = 0;
			var numCorr = 0;
			while(!!first) {
				var id = first.firstChild.id + ""; 
				if ( parseInt(id.split(":")[1]) == correctLetters[ind].index ) 
					numCorr++; 
				first = first.nextSibling; 
				ind++;
			}
			if (numCorr == correctLetters.length) {
				updateGameDataOnServer(1);
				gameOver = true; 
				return true;
			}
		} // if (numLetts == correctLetters.length)
	} // if (!gameOver)
	return false;
} // end function isGameWon() 

function isGameLost() {
	if (!gameOver) {
		numXs++;
		var par, ind;
		if (numXs < 3) {par = document.getElementById("xbox1"); ind = numXs;}
		else if (numXs >= 3) {par = document.getElementById("xbox2"); ind = numXs - 2;}
		var first = par.firstChild;
		for (var i = 0; i < ind-1; i++) first = first.nextSibling;
		first.style.color = "#F00000";
		if ((numXs == 4) || (letterBoardsEmpty)) {
			updateGameDataOnServer(2); 
			gameOver = true; 
			document.getElementById("letterChoicesCont").style.display = "none"; 
			var el = document.getElementById("gameMessage"); 
			el.style.color = "red"; 
			el.innerHTML = "Game Over"; 
			showMenu(document.getElementById('gameMessageDiv')); 
			el.parentNode.style.marginTop = -(el.offsetHeight/2) + "px";
			setTimeout(function() {closeMenu(document.getElementById('gameMessageDiv'))},2000); 
			showLetters(); 
			return true; 
		} // if (numXs == 4)
	} // if (!gameOver)
	return false;
} // end function isGameLost()

function showLetters() {
	drawLine();
	if (numberOfLinesDrawnOnCanvas < canvas.width) showLettersTimeoutID = setTimeout(function() {showLetters()}, 100);
	return true;
} // end function showLetters()

function isLetterBoardsEmpty() {
	var letlen = inputData.letters.length;
	var empty = 0;
	for (var i = 0; i < letlen; i++) {
		var test = document.getElementById("letterChoices"+i);
		var clen = test.childNodes.length;
		var pass = false;
		for (var j = 0; j < clen; j++) {
			if (test.childNodes[j].className == "letter-div") {pass = true; break;}
		} // for (var j = 0; j < clen; j++) {
		if (!pass) empty++;
	} // for (var i = 0; i < letlen; i++) {
	if (empty == letlen) {letterBoardsEmpty = true; return true;}
	else {letterBoardsEmpty = false; return false;}
} // end function isLetterBoardsEmpty()



// updating and saving points and Xs functions ...

function updatePoints(add, code) {
	if (!gameOver) {
		if (code == 2) {
			if (numberOfLinesDrawnOnCanvas < Math.floor(canvas.width * .05))
				add = add;
			else if (numberOfLinesDrawnOnCanvas < Math.floor(canvas.width * .10))
				add = Math.floor(add * .90);
			else if (numberOfLinesDrawnOnCanvas < Math.floor(canvas.width * .15))
				add = Math.floor(add * .85);
			else if (numberOfLinesDrawnOnCanvas < Math.floor(canvas.width * .20))
				add = Math.floor(add * .70);
			else if (numberOfLinesDrawnOnCanvas < Math.floor(canvas.width * .25))
				add = Math.floor(add * .65);
			else if (numberOfLinesDrawnOnCanvas < Math.floor(canvas.width * .30))
				add = Math.floor(add * .50);
			else if (numberOfLinesDrawnOnCanvas < Math.floor(canvas.width * .40))
				add = Math.floor(add * .40);
			else if (numberOfLinesDrawnOnCanvas < Math.floor(canvas.width * .50))
				add = Math.floor(add * .30);
			else if (numberOfLinesDrawnOnCanvas < Math.floor(canvas.width * .60))
				add = Math.floor(add * .20);
			else add = Math.floor(add * .10);
		}
		points += add;
		if (numberCorrect == 4) {
			redoXs();
		} // if (numberCorrect == 4)
		updateGameDataOnServer(0);
		var el = document.getElementById("pointsSpan");
		el.style.fontWeight = "bold";
		if (points < 0) el.style.color = "#F00000";
		else if (points == 0) el.style.color = "gray";
		else if (points > 0) el.style.color = "#3ecf8e";
		el.innerHTML = points;
	}
	return true;
} // function updatePoints(add, code)

function redoXs() {
	numXs = ((numXs - 2) < 0) ? 0 : (numXs - 2);
	for (var i = 0; i < 2; i++) {
		if (i == 0) par = document.getElementById("xbox1");
		else par = document.getElementById("xbox2");
		var first = par.firstChild;							
		while (!!first) {
			first.style.color = "#3a3a3a";
			first.style.textShadow = "none";
			first = first.nextSibling;
		}
	} // for (var i = 0; i < 4; i++)
	for (var i = 0; i < numXs; i++) {
		if (i < 2) par = document.getElementById("xbox1");
		else par = document.getElementById("xbox2");
		var first = par.firstChild;
		var end = (i < 2) ? i : (i - 2);
		for (var j = 0; j < end; j++) first = first.nextSibling;					
		first.style.color = "#F00000";
	} // for (var i = 0; i < 4; i++)	
	return false;
}// function redoXs()

function updateGameDataOnServer(won) {
	var csrfTok = document.querySelector("meta[name='csrf-token']").getAttribute("content");
	var route = "/games/"+ (!!localStorage.getItem("gameID") ? localStorage.getItem("gameID") : "0");
	route += "?points="+points+"&numberOfX="+numXs+"&won="+won;
	xhttp.abort();
	xhttp.open("PUT", route);
	xhttp.setRequestHeader('X-CSRF-Token', csrfTok)
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			return true;
		} // end if
	} // end onreadystatechange
	xhttp.send();
	return true;
} // function updateGameDataOnServer(won)


// animation functions ...

function letterBorderAnimation(letter, code) {
	if (code == 0) letter.style.borderColor = "#3ecf8e";
	else if (code == 1) letter.style.borderColor = "red";
	else if (code == 2) var blank;
	var width = letter.offsetWidth;
	var height = letter.offsetHeight;
	var values = [0,0];
	clearInterval(borderIntervalID);
	borderIntervalID = setInterval(
		function() {
			if (values[1] == -1) {clearInterval(borderIntervalID); return true;}
			else {
				values[1] += 0.04;
				values = animateSmallLargeMedium(1, 2, values[1], 3, "letterBorder");  
				letter.style.borderWidth = (values[0]/6)+"em";
				letter.style.marginLeft = -(letter.offsetWidth - width)/2 + "px";
				//letter.style.marginTop = -(letter.offsetHeight - height)/2 + "px";
			}
		},22);
	if (code == 0) {updatePoints(100,2); animatePoints(100,2);}
	else if (code == 1) {
		updatePoints(-150,3);
		isGameLost();
	}
	return true;
} // end function letterBorderAnimation(letter, code)

function animatePoints(add, code) {
	clearInterval(pointsIntervalID);
	var time;
	var values = [0,0];
	var el2 = null;
	if (code == 0) {
		if (numberCorrect == 4) 
			clearTimeout(getNextColorsTimeoutID);
		time=22;
	}
	else if (code == 1) 
		time=500;
	else if (code == 2) 
		time=22;
	else if (code == 3) 
		time=500;
	if (code == 0) el2 = document.getElementById("plus15svg2");
	else if (code == 2) el2 = document.getElementById("plus5svg2");
	var height = el2.getBoundingClientRect().height;
	document.getElementById("guessContainer").style.overflow = "visible";
	document.getElementById("guess").style.overflow = "visible";
	pointsIntervalID = setInterval(
		function() {
			if (values[1] == -1) {
				clearInterval(pointsIntervalID);
				document.getElementById("guessContainer").style.overflow = "hidden";
				document.getElementById("guess").style.overflow = "hidden";
				if (numberCorrect == 4) {
					clearTimeout(getNextColorsTimeoutID);
					setTimeout(function() {switchButtonsAndLetters(2); selectUnderscore(document.getElementById("letterBox:0"), inputData.letters);},500);
				}
			}
			else {
				values[1] += 0.05;
				if ((code == 0) || (code == 2)) {
					if (code == 0) values = animateSmallLargeMedium(1, 2, values[1], 6, null);  
					else if (code == 2) values = animateSmallLargeMedium(1, 2, values[1], 4, null);
					el2.style.width = (12.5*values[0])+"%";
					el2.style.height = (12.5*values[0])+"%";
					el2.style.left = "50%";
					el2.style.marginTop = ((height-el2.getBoundingClientRect().height)/2) + "px";
					el2.style.marginLeft = -(el2.getBoundingClientRect().width/2) + "px";
				}
				else if ((code == 1) || (code == 3)) {
					values = [-1,-1];
				}

			}
		},time);
	return true;
} // end function animatePoints(add, code)

function animateSmallLargeMedium(origVal, endVal, step, max, forWhat) {
	var sinVal = (-Math.PI/1.5) + (3 * (Math.PI/2) * step);
	var currVal = origVal * (max * Math.sin(sinVal) + (max+1));
	currVal = currVal.toFixed(2);
	if (sinVal < Math.PI) return [currVal, step];
	else if (currVal > endVal) return [currVal, step];
	else return [endVal, -1];
} // end animateSmallLargeMedium(origVal, endVal, step, max, intvlID)

function animateOriginalSmallOriginal(origVal, endVal, step) {
	var sinVal = (-Math.PI/1.5) + (2 * Math.PI * step);
	var currVal = (endVal - origVal)  * (0.5 * (Math.sin(sinVal) + 1));
	currVal = currVal.toFixed(2);
	if (sinVal < (3 * Math.PI/2)) return [currVal, step];
	else if (sinVal >= (3 * Math.PI/2)) return [endVal, -1]; // || (currVal >= endVal)
} // end animateEase(origVal, endVal, step)


// Profile and account info get and update functions ...

function getProfileData() {
	var csrfTok = document.querySelector("meta[name='csrf-token']").getAttribute("content");
	var route = "/players/0";
	xhttp.abort();
	xhttp.open("GET", route);
	xhttp.setRequestHeader('X-CSRF-Token', csrfTok)
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var res = this.responseText + "";
			if (res.split("_?*")[0].toUpperCase() == "OK") {
				if (res.split("_?*")[1] != "" ) {
					var jd = JSON.parse(res.split("_?*")[1]);
					fillInProfileDiv(jd);
				} else {
					clearProfile();
				} // if (res.split("_?*")[1] != "" ) { .. else ...
			} else if (res.split("_?*")[0].toUpperCase() == "BAD") {
				clearProfile();
			} // if (res.split("_?*")[0].toUpperCase() == "OK")
			return true;
		} // end if (this.readyState == 4 && this.status == 200)
	} // end onreadystatechange
	xhttp.send();
	return false;
} // function getProfileData()


function fillInProfileDiv(data) {
	var history = data.history;
	if (!!data.email) document.getElementById("profileEmail").innerHTML = data.email;
	var cell = data.cellphone + "";
	if (!!cell) document.getElementById("profileCellphone").innerHTML = "(" + cell[0] + "" + cell[1] + "" + cell[2] + ")" + cell[3] + "" + cell[4] + "" + cell[5] + "-" + cell[6] + "" + cell[7] + "" + cell[8] + "" + cell[9];
	var header = document.getElementById("tableHeader");
	var tableBody = document.getElementById("tableBody");
	while (!!header.nextSibling) {header.parentNode.removeChild(header.nextSibling); }
	for (var key in history) {
		if (history.hasOwnProperty(key)) {
			var tr = document.createElement("tr");
			var td1 = document.createElement("td");
			var td2 = document.createElement("td");
			var td3 = document.createElement("td");
			td1.appendChild(document.createTextNode(key));
			td2.appendChild(document.createTextNode(history[key].high_score));
			td3.appendChild(document.createTextNode(history[key].total));
			tr.appendChild(td1);
			tr.appendChild(td2);
			tr.appendChild(td3);
			tableBody.appendChild(tr);
		} // if (history.hasOwnProperty(key))
	} // for (var key in history) {
	return false;
} // function fillInProfileDiv(data)

function clearProfile() {
	document.getElementById("profileEmail").innerHTML = "";
	document.getElementById("profileCellphone").innerHTML = "";
	var header = document.getElementById("tableHeader");
	while (!!header.nextSibling) {header.parentNode.removeChild(header.nextSibling); }
} // end function clearProfile()

function updateInfo(sel) {
	var proceed = true;
	document.getElementById("changePasswordErrorMessage").innerHTML = "";	
	document.getElementById("changeLoginErrorMessage").innerHTML = "";
	document.getElementById("cancelMembershipErrorMessage").innerHTML = "";	
	var route = "";
	var data = "";
	if (sel == 1) {
		var email = encodeURIComponent(document.getElementById("loginEmailInput").value);
		var cellphone = encodeURIComponent(document.getElementById("loginNumberInput").value);
		var password = encodeURIComponent(document.getElementById("changePasswordInput1").value);
		var cc = encodeURIComponent(document.getElementById("passwordChangeConfirmationCode").value);
		route = "/players/0";
		data = "code=1&password="+password+"&email="+email+"&cellphone="+cellphone+"&cc="+cc;
	} else if (sel == 2) {
		var email = encodeURIComponent(document.getElementById("changeEmailInput").value);
		var cellphone = encodeURIComponent(document.getElementById("changeNumberInput").value);
		route = "/players/change_login";
		data = "code=2&email="+email+"&cellphone="+cellphone;
	} else if (sel == 3) {
		var cancel = document.getElementById("cancelMembershipInput").value + "";
		route = "/players/cancel_membership";
		data = "code=3&cancel="+cancel;
	} else if (sel == 4) {
		route = "/players/logout";
		data = "code=4";
	}
	if (proceed && ((sel == 1) || (sel == 2) || ((sel == 3) && (cancel.toUpperCase() == "CANCEL")) || (sel == 4))) {
		var csrfTok = document.querySelector("meta[name='csrf-token']").getAttribute("content");
		xhttp.abort();
  		xhttp.onreadystatechange = function() {
    		if (this.readyState == 4 && this.status == 200) {
      			var res = this.responseText + "";
    			if (res.toUpperCase() == "OK") {
					document.getElementById("changeLogin").style.height = "0";
					document.getElementById("cancelMembership").style.height = "0";
					if (sel == 4) clearProfile();
					else getProfileData();
					var result = document.getElementById("profileUpdateResult");
					result.innerHTML = "profile succesfully updated!";
					result.style.opacity = "1";
					setTimeout(function() {result.style.opacity = "0";},3500);
				} else if (res.toUpperCase() == "RESET") {
					var el = document.getElementById("gameMessage"); 
					el.style.color = "#3ecf8e"; 
					el.innerHTML = "Password change succesful."; 
					showMenu(document.getElementById('gameMessageDiv')); 
					setTimeout(function() {closeMenu(document.getElementById('gameMessageDiv'))},2000);
					document.getElementById("changePassword").style.height = "0";
					document.getElementById("changePassword").style.marginTop = "0";
				} else if (res.toUpperCase() == "BAD") {
					var err;
					switch(sel) {
						case 1:
							err = document.getElementById("changePasswordErrorMessage");	
							break;
						case 2:
							err = document.getElementById("changeLoginErrorMessage");	
							break;
						case 3:
							err = document.getElementById("cancelMembershipErrorMessage");	
							break;
					} 
					err.style.color = "#F00000"; 
					err.innerHTML = "Please check the information and try again."; 
				} // else if (res.toUpperCase() == "BAD")
				return false;
    		} // if (this.readyState == 4 && this.status == 200)
  		}; // xhttp.onreadystatechange = function()
  		xhttp.open("PUT", "/players/0", true);
  		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  		xhttp.setRequestHeader('X-CSRF-Token', csrfTok);
  		xhttp.send(data);
		}
	return false;
} // end function updateInfo(sel)

function profileOption(opt) {
	document.getElementById("changeLoginErrorMessage").innerHTML = "";
	document.getElementById("cancelMembershipErrorMessage").innerHTML = "";
	document.getElementById("changePasswordInput1").value = "";
	document.getElementById("changePasswordInput2").value = "";
	document.getElementById("passwordChangeConfirmationCode").value = "";
	document.getElementById("changeEmailInput").value = "";
	document.getElementById("changeNumberInput").value = "";
	document.getElementById("changeCellphoneInput").value = "";
	document.getElementById("cancelMembershipInput").value = "";
	document.getElementById("changePassword").style.height = "0";
	document.getElementById("changePassword").style.marginTop = "0";
	document.getElementById("changeLogin").style.height = "0";
	document.getElementById("cancelMembership").style.height = "0";

	if (opt == 1) {
		/*document.getElementById("changePassword").style.display = "block";*/
		if (document.getElementById("changePassword").offsetHeight < 5) {
			document.getElementById("changePassword").style.height = "142em";
			document.getElementById("changePassword").style.marginTop = "-142em";
		} else setTimeout(function() {document.getElementById("changePassword").style.height = "142em"; document.getElementById("changePassword").style.marginTop = "-142em";},600);
		document.getElementById("changePasswordInput1").value = '';
		document.getElementById("changePasswordInput2").value = '';
		document.getElementById("passwordChangeConfirmationCode").value = "";
		document.getElementById("changePasswordInput1").nextSibling.style.visibility = "hidden";
		document.getElementById("changePasswordInput2").nextSibling.style.visibility = "hidden";
		document.getElementById("changePasswordButton").disabled = true;
	} else if (opt == 2) {
		/*document.getElementById("changeLogin").style.display = "block";*/
		if (document.getElementById("changeLogin").offsetHeight < 5) document.getElementById("changeLogin").style.height = "30em";
		else setTimeout(function() {document.getElementById("changeLogin").style.height = "30em";},600);
		document.getElementById("changeEmailInput").value = '';
		document.getElementById("changeCellphoneInput").value = '';
		document.getElementById("changeNumberInput").value = '';
		document.getElementById("changeEmailInput").nextSibling.style.visibility = "hidden";
		document.getElementById("changeCellphoneInput").nextSibling.style.visibility = "hidden";
		document.getElementById("changeLoginButton").disabled = true;
	} else if (opt == 3) {
		/*document.getElementById("cancelMembership").style.display = "block";*/
		if (document.getElementById("cancelMembership").offsetHeight < 5) document.getElementById("cancelMembership").style.height = "30em";
		else setTimeout(function() {document.getElementById("cancelMembership").style.height = "30em";},600);
		document.getElementById("cancelMembershipInput").value = '';
		document.getElementById("cancelMembershipButton").disabled = true;
	} else if (opt == 4) {
		document.getElementById("changePasswordInput1").value = "";
		document.getElementById("changePasswordInput2").value = "";
		document.getElementById("passwordChangeConfirmationCode").value = "";
		document.getElementById("changeEmailInput").value = "";
		document.getElementById("changeNumberInput").value = "";
		document.getElementById("changeCellphoneInput").value = "";
		document.getElementById("cancelMembershipInput").value = "";
		document.getElementById("changePassword").style.height = "0";
		document.getElementById("changePassword").style.marginTop = "0";
		document.getElementById("changeLogin").style.height = "0";
		document.getElementById("cancelMembership").style.height = "0";			
	}
	return false;
} // function profileOption(opt)


function submitMessage() {
	var csrfTok = document.querySelector("meta[name='csrf-token']").getAttribute("content");
	var email = encodeURIComponent(document.getElementById("contactusEmailInput").value);
	var message = encodeURIComponent(document.getElementById("contactusMessage").value);
	if (((email === "") && (message === "")) || ((email.trim() === "") && (message.trim() === ""))) {
		return false
	} else {
		xhttp.abort();
  		xhttp.onreadystatechange = function() {
    		if (this.readyState == 4 && this.status == 200) {
      			var res = this.responseText + "";
    			if (res.toUpperCase() == "OK") {
    				var el = document.getElementById("gameMessage"); 
    				el.style.color = "#3ecf8e"; 
    				el.innerHTML = "Message Sent!"; 
    				closeMenu(document.getElementById('contactusDiv'));
    				showMenu(document.getElementById('gameMessageDiv')); 
    				setTimeout(function() {closeMenu(document.getElementById('gameMessageDiv'))},2000);
    				return true;
    			}
				else return false;
    		} // if (this.readyState == 4 && this.status == 200)
  		}; // xhttp.onreadystatechange = function()
  		xhttp.open("POST", "/messages", true);
  		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  		xhttp.setRequestHeader('X-CSRF-Token', csrfTok);
  		xhttp.send("email="+email+"&message="+message);
	} // end if else
} // end function submitMessage()



// form validation and form submission functions ...

function validateEmail(inp, sel) {
	document.getElementById("signupSubmit").style.backgroundColor = "#eceded";
	document.getElementById("signupSubmit").style.boxShadow = "none";
	document.getElementById("signupSubmit").disabled = true;
	document.getElementById("changeLoginButton").disabled = true;
	formcheck[0] = false;
	var errorEl = null;
	if (sel == 1) errorEl = document.getElementById("emailErrorMessage");
	else if (sel == 2) errorEl = document.getElementById("changeLoginErrorMessage");
	var test = inp.value + "";
	var noAts = 0;
	var noWhiteSpaces = 0;
	var errorMessage = "";
	var isValid = true;
	var len = test.length;
	for (var i = 0; i < len; i++) {
		if (test[i] == "@") 
			noAts++;
		else if ((i < len-1) && ((test[i] == "\n") || (test[i] == "\r") || (test[i] == "\t") || (test[i] == "\v") || (test[i] == "\f") || (test[i] == " ")))
			{noWhiteSpaces++; errorMessage = "please remove any spaces or other whitespace characters";}
	} // for (var i = 0; i < len; i++)

	if ((noAts != 1) || (noWhiteSpaces != 0)) { 
		isValid = false; 
	} else if (test.split("@")[1].length < 2) { 
		isValid = false; 
	} else if (test.split("@")[1].length >= 2) { 
		if ( (test.split("@")[1].split(".").length < 2) || (test.split("@")[1].split(".")[1] == "") ) 
			isValid = false; 
	}
	
	if (isValid) {
		var patt = /[^A-z0-9@_.]/g;
		var val = patt.test(test);
		if (val) {
			isValid = false; 
			errorMessage = "invalid characters present";
		}
	}
	
	if ((isValid) && (sel == 1)) {
		var success = "document.getElementById('emailInput').nextSibling.style.visibility = 'visible'; document.getElementById('emailErrorMessage').innerHTML = ''";
		var fail = "document.getElementById('emailInput').nextSibling.style.visibility = 'hidden'; document.getElementById('emailErrorMessage').innerHTML = 'email already exists'";
		checkIfExist("/checkemail",test,success,fail);
	} else if ((isValid) && (sel == 2)) {
		var success = "document.getElementById('changeEmailInput').nextSibling.style.visibility = 'visible'; document.getElementById('changeLoginErrorMessage').innerHTML = '';document.getElementById('changeLoginButton').disabled = false;";
		var fail = "document.getElementById('changeEmailInput').nextSibling.style.visibility = 'hidden'; document.getElementById('changeLoginErrorMessage').innerHTML = 'email already exists';document.getElementById('changeLoginButton').disabled = true;";
		return checkIfExist("/checkemail",test,success,fail);
	} else {
		inp.nextSibling.style.visibility = "hidden"; 
		errorEl.innerHTML = errorMessage;
	}
	return false;
} // end function validateEmail()

function validateCellphone(inp, sel) {
	document.getElementById("signupSubmit").style.backgroundColor = "#eceded";
	document.getElementById("signupSubmit").style.boxShadow = "none";
	document.getElementById("signupSubmit").disabled = true;
	if (sel == 1) {
		formcheck[1] = false;
		var errorEl = document.getElementById("cellphoneErrorMessage");
		var hid = document.getElementById("numberInput");
	} else if (sel == 2) {
		var errorEl = document.getElementById("loginCellphoneErrorMessage");
		var hid = document.getElementById("loginNumberInput");
	}
	else if (sel == 3) {
		var errorEl = document.getElementById("changeLoginErrorMessage");
		var hid = document.getElementById("changeNumberInput");
	}
	inp.blur();
	hid.focus();
	var hidValue = hid.value + "";
	var char = hidValue[hidValue.length - 1];
	var test = "";
	var temp = "";
	if ( isNaN(char) || (parseInt(char) == null) || (hidValue.length > 10) ) {
		for (var i = 0; i < hidValue.length - 1; i++)
			temp += hidValue[i];
	} else {
		for (var i = 0; i < hidValue.length; i++)
			temp += hidValue[i];
	}
	hid.value = parseInt(temp);
	test = temp + "";
	
	var len = test.length;
	var number = "";
	for (var i = 0; i < len; i++) {
		if (i == 0) number = "(" + ((test[i] == "0" || test[i] == 0) ? "0" : test[i]);
		else if (i == 3) number = number + ")" + ((test[i] == "0" || test[i] == 0) ? "0" : test[i]);
		else if (i == 6) number = number + "-" + ((test[i] == "0" || test[i] == 0) ? "0" : test[i]);
		else number = number + ((test[i] == "0" || test[i] == 0) ? "0" : test[i]);
	} // for (var i = 0; i < 10; i++)
	
	if ((len == 10) && (sel == 1)) {
		var success = "document.getElementById('cellphoneInput').nextSibling.style.visibility = 'visible'; document.getElementById('cellphoneErrorMessage').innerHTML = ''";
		var fail = "document.getElementById('cellphoneInput').nextSibling.style.visibility = 'hidden'; document.getElementById('cellphoneErrorMessage').innerHTML = 'cellphone number already exists'";
		checkIfExist("/checkcellphone",test,success,fail);
	} else if ((len == 10) && (sel == 3)) {
		var success = "document.getElementById('changeCellphoneInput').nextSibling.style.visibility = 'visible'; document.getElementById('changeLoginErrorMessage').innerHTML = '';document.getElementById('changeLoginButton').disabled = false;";
		var fail = "document.getElementById('changeCellphoneInput').nextSibling.style.visibility = 'hidden'; document.getElementById('changeLoginErrorMessage').innerHTML = 'cellphone number already exists';document.getElementById('changeLoginButton').disabled = true;";
		checkIfExist("/checkcellphone",test,success,fail);
	} else {
		inp.nextSibling.style.visibility = "hidden"; 
		errorEl.innerHTML = "";
	}
	inp.value = number;
	hid.focus();
	isSignupFormReady();
	return false;
} // end function validateCellphone()

function validateDisplayName(inp) {
	formcheck[2] = false;
	document.getElementById("signupSubmit").style.backgroundColor = "#eceded";
	document.getElementById("signupSubmit").style.boxShadow = "none";
	document.getElementById("signupSubmit").disabled = true;
	var test = inp.value + "";
	var success = "document.getElementById('displaynameInput').nextSibling.style.visibility = 'visible'; document.getElementById('displaynameErrorMessage').innerHTML = ''";
	var fail = "document.getElementById('displaynameInput').nextSibling.style.visibility = 'hidden'; document.getElementById('displaynameErrorMessage').innerHTML = 'display name already exists'";
	if ((test != "") && (test.split(" ").length < 2)) checkIfExist("/checkdisplayname",test,success,fail);
	return false;
} // end function validateDisplayName()

function validatePassword() {
	formcheck[3] = false;
	var el1 = document.getElementById("password1Input");
	var el2 = document.getElementById("password2Input");
	var errorEl1 = document.getElementById("password1ErrorMessage");
	var errorEl2 = document.getElementById("password2ErrorMessage");
	var test1 = el1.value + "";
	var test2 = el2.value + "";
	if (test1.length < 8) {
		errorEl1.innerHTML = "password length must be at least 8 characters";
		errorEl2.innerHTML = "";
		el1.nextSibling.style.visibility = "hidden";
		el2.nextSibling.style.visibility = "hidden";
	} else if (test1 != test2) {
		errorEl1.innerHTML = "passwords do not match";
		errorEl2.innerHTML = "passwords do not match";
		el1.nextSibling.style.visibility = "hidden";
		el2.nextSibling.style.visibility = "hidden";
	} else if (el1.value == el2.value) {
		formcheck[3] = true;
		errorEl1.innerHTML = "";
		errorEl2.innerHTML = "";
		el1.nextSibling.style.visibility = "visible";
		el2.nextSibling.style.visibility = "visible";
	} else {
		errorEl1.innerHTML = "";
		errorEl2.innerHTML = "";
		el1.nextSibling.style.visibility = "hidden";
		el2.nextSibling.style.visibility = "hidden";
	}

	isSignupFormReady();
	return false;
} // end function validatePassword()

function validatePassword2() {
	var el1 = document.getElementById("changePasswordInput1");
	var el2 = document.getElementById("changePasswordInput2");
	var errorEl1 = document.getElementById("changePasswordErrorMessage");
	var test1 = el1.value + "";
	var test2 = el2.value + "";
	if (test1.length < 8) {
		errorEl1.innerHTML = "password length must be at least 8 characters";
		el1.nextSibling.style.visibility = "hidden";
		el2.nextSibling.style.visibility = "hidden";
		document.getElementById("changePasswordButton").disabled = true;
	} else if (test1 != test2) {
		errorEl1.innerHTML = "passwords do not match";
		el1.nextSibling.style.visibility = "hidden";
		el2.nextSibling.style.visibility = "hidden";
		document.getElementById("changePasswordButton").disabled = true;
	} else if (el1.value == el2.value) {
		errorEl1.innerHTML = "";
		el1.nextSibling.style.visibility = "visible";
		el2.nextSibling.style.visibility = "visible";
		document.getElementById("changePasswordButton").disabled = false;
	} else {
		errorEl1.innerHTML = "";
		el1.nextSibling.style.visibility = "hidden";
		el2.nextSibling.style.visibility = "hidden";
		document.getElementById("changePasswordButton").disabled = true;
	}
	return false;
} // end function validatePassword2()

function validateCancelMembership(el) {
	document.getElementById("cancelMembershipButton").disabled = true;
	var cancel = el.value + "";
	if (cancel.toUpperCase() == "CANCEL") document.getElementById("cancelMembershipButton").disabled = false;
} // function validateCancelMembership(el)

function checkIfExist(route, data, success, fail) {
	document.getElementById("signupSubmit").style.backgroundColor = "#eceded";
	document.getElementById("signupSubmit").style.boxShadow = "none";
	var xhttptemp = new XMLHttpRequest();
		xhttptemp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
  			var res = this.responseText + "";
  			if (res.toUpperCase() == "OK") {
  				if (route == "/checkemail") formcheck[0] = true;
  				else if (route == "/checkcellphone") formcheck[1] = true;
  				else if (route == "/checkdisplayname") formcheck[2] = true;
  				eval(success);
  				isSignupFormReady();
				return true;
  			} else if (res.toUpperCase() == "DUPLICATE") {
  				eval(fail);
  				return false;
  			}
		} // if (this.readyState == 4 && this.status == 200)
		}; // xhttptemp.onreadystatechange = function()
		var routetotal = route + "?data=" + encodeURIComponent(data);
		xhttptemp.open("GET", routetotal, true);
		xhttptemp.send();
	return false;
} // end function checkIfExist(route, method, data, success, fail)

function signupFormSubmit(stripeToken) {
	var button = document.getElementById("signupSubmit");
	button.disabled = true;
	var cont = false;
	if (formcheck[0] && formcheck[2] && formcheck[3]) cont = true;
	if (cont) {
		var csrfTok = document.querySelector("meta[name='csrf-token']").getAttribute("content");
		var email = encodeURIComponent(document.getElementById("emailInput").value);
		var cellphone = encodeURIComponent(document.getElementById("numberInput").value);
		var displayname= encodeURIComponent(document.getElementById("displaynameInput").value);
		var password1 = encodeURIComponent(document.getElementById("password1Input").value);
		var password2 = encodeURIComponent(document.getElementById("password2Input").value);
		var auth_token = document.getElementsByName("authenticity_token")[0].value;
		var version = document.getElementById("gameVersion").value;
		xhttp.abort();
  		xhttp.onreadystatechange = function() {
    		if (this.readyState == 4 && this.status == 200) {
      			var res = this.responseText + "";
    			if (res.toUpperCase() == "OK") {
    				var el = document.getElementById("gameMessage"); 
    				el.style.color = "#3ecf8e";
    				el.innerHTML = "Thank you for signing up to play Koji!<br/>Enjoy!"; 
    				closeMenu(document.getElementById('signupDiv'));
    			} else if (res.toUpperCase() == "BAD2") {
    				var el = document.getElementById("gameMessage"); 
    				el.style.color = "#F00000"; 
    				el.innerHTML = "Payment processing was not succesful, we apologize.<br/>Please check your information and try again."; 
    				button.disabled = false;
    			} else if (res.toUpperCase() == "BAD") {
    				var el = document.getElementById("gameMessage"); 
    				el.style.color = "#F00000"; 
    				el.innerHTML = "Sorry, sign-up was not succesful<br/>Please check your information and try again."; 
    				button.disabled = false;
    			} // if (res.toUpperCase() == "OK")
    		    showMenu(document.getElementById('gameMessageDiv')); 
    			el.parentNode.style.marginTop = -(el.offsetHeight/2) + "px";
    			setTimeout(function() {closeMenu(document.getElementById('gameMessageDiv'))},3500);
    			return true;
    		} // if (this.readyState == 4 && this.status == 200)
  		}; // xhttptemp.onreadystatechange = function()
  		xhttp.open("POST", "/players", true);
  		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  		xhttp.setRequestHeader('X-CSRF-Token', auth_token);
  		xhttp.send("email="+email+"&cellphone="+cellphone+"&display_name="+displayname+"&password1="+password1+"&password2="+password2+"&game_version="+version+"&stripeToken="+stripeToken.id+"&stripeEmail="+stripeToken.email);
	} // end if (cont)
	return false;
} // end function signupFormSubmit()

function signinFormSubmit(code) {
	var email = encodeURIComponent(document.getElementById("loginEmailInput").value);
	var cellphone = encodeURIComponent(document.getElementById("loginNumberInput").value);
	var password = encodeURIComponent(document.getElementById("loginPasswordInput").value);
	var auth_token = document.getElementsByName("authenticity_token")[0].value;
	if (((email === "") && (cellphone === "")) || ((email.trim() === "") && (cellphone.trim() === ""))) {
		return false;
	} else {
		xhttp.abort();
  		xhttp.onreadystatechange = function() {
    		if (this.readyState == 4 && this.status == 200) {
      			var res = this.responseText + "";
    			if (res.toUpperCase() == "OK") {
					getProfileData();
					var el = document.getElementById("gameMessage"); 
					el.style.color = "#3ecf8e"; 
					el.innerHTML = "Sign in succesful."; 
					closeMenu(document.getElementById('signinDiv'));
				} else if (res.toUpperCase() == "RESET SENT") {
					var el = document.getElementById("gameMessage"); 
					el.style.color = "#3ecf8e"; 
					el.innerHTML = "Password reset confirmation code sent. Please wait up to 2 minutes to receive code."; 
					profileOption(1);
				} else if ((res.toUpperCase() == "BAD") && (code == 0)) {
					var el = document.getElementById("gameMessage"); 
					el.style.color = "#F00000"; 
					el.innerHTML = "Sorry, sign-in was not succesful.<br/>Please check your information and try again."; 
				} else if ((res.toUpperCase() == "BAD") && (code == 1)) {
					profileOption(4);
					var el = document.getElementById("gameMessage"); 
					el.style.color = "#F00000"; 
					el.innerHTML = "The login information was not found.<br/>Please check your information and try again."; 
				}
				showMenu(document.getElementById('gameMessageDiv')); 
				el.parentNode.style.marginTop = -(el.offsetHeight/2) + "px";
				setTimeout(function() {closeMenu(document.getElementById('gameMessageDiv'))},3500);
				return false;
    		} // if (this.readyState == 4 && this.status == 200)
  		}; // xhttp.onreadystatechange = function()
  		xhttp.open("POST", "/players/login", true);
  		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  		xhttp.setRequestHeader('X-CSRF-Token', auth_token);
  		xhttp.send("email="+email+"&cellphone="+cellphone+"&password="+password+"&reset="+code);
		return true; 
	} // if .. else
} // end function signinFormSubmit()

function isSignupFormReady() {
	if (formcheck[0] && formcheck[2] && formcheck[3]) {
		document.getElementById("signupSubmit").style.backgroundColor = "#666666";
		document.getElementById("signupSubmit").style.boxShadow = "-1px 3px 9px #777777";
		if (!paymentRequestSent) document.getElementById("signupSubmit").disabled = false;
	} else {
		document.getElementById("signupSubmit").style.backgroundColor = "#eceded";
		document.getElementById("signupSubmit").style.boxShadow = "none";
		document.getElementById("signupSubmit").disabled = true;
	} // if...else
} // end function isSignupFormReady()

// general purpose app functions ...

function showMenu(el) {
	var id = el.id + "";
	if (id == "signupDiv") {
		document.getElementById("signupForm").reset();
		document.getElementById("signupSubmit").disabled = true;
		paymentRequestSent = false;
		document.getElementById("signupSubmit").style.backgroundColor = "#eceded";
		document.getElementById("signupSubmit").style.boxShadow = "none";
		document.getElementById("emailInput").nextSibling.style.visibility = "hidden";
		document.getElementById("cellphoneInput").nextSibling.style.visibility = "hidden";
		document.getElementById("displaynameInput").nextSibling.style.visibility = "hidden";
		document.getElementById("password1Input").nextSibling.style.visibility = "hidden";
		document.getElementById("password2Input").nextSibling.style.visibility = "hidden";
	} else if (id == "signinDiv") {
		document.getElementById("signinForm").reset();
	}
	el.style.display = "";
	el.classList.add("flex");
	el.classList.add("flex-col");
	setTimeout(function() {el.style.marginTop="0em"; el.style.opacity="1";}, 100);
	return true;
} // end function showMenu(el)

function closeMenu(el) {
	el.style.opacity = "0";
	el.style.marginTop = "-2em";
	setTimeout(function() {el.style.display = "none";}, 800);
	return true;
} // end function closeMenu(el)

function animateMenu(para, code) {
	if (code == 0) {
		para.style.backgroundColor = "#8e3ecf";
		para.style.color = "#fafffa";
		first = para.firstChild;
		while (!!first) {first.style.paddingRight = "1em"; first = first.nextSibling;}
	} // if (code == 0)
	if (code == 1) {
		para.style.backgroundColor = "";
		para.style.color = "#663399";
		first = para.firstChild;
		while (!!first) {first.style.paddingRight = "0em"; first = first.nextSibling;}
	} // if (code == 1)	
	return true;
} // end function animateMenu(para, code)

function checkForStartupMessage() {
	var version = document.getElementById("gameVersion").value;
	var csrfTok = document.querySelector("meta[name='csrf-token']").getAttribute("content");
	var route = "/message?version="+version;
	xhttp.open("GET", route);
	xhttp.setRequestHeader('X-CSRF-Token', csrfTok)
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var message = this.responseText + "";
			if (message != "") {
				if (message != "1") {
					var el = document.getElementById('startupMessageSpan');
					el.innerHTML = message;
					el = document.getElementById('startupMessageDiv');
					el.style.height = "100%";
					el.style.marginTop="0em"; 
					el.style.opacity="1"; 
				} else {
				setTimeout(function() {showMenu(document.getElementById('menuDiv')) },500);
				} // if (message != "1")
			}
			return true;
		} // end if
	} // end onreadystatechange
	xhttp.send();
	return true;
} // end function checkForStartupMessage()


// legacy functions ...

function setupTimer() {
	if (!!window.Worker) {
		if (!webWorker) {webWorker = new window.Worker("timer.js"); webWorker.onmessage = function(evt) {updateTimer(evt.data);} }
	} // end if (!!window.Worker)
	else {
		clearInterval(intervalID);
		intervalID = setInterval(function() {updateTimer(null)},333);
	} // end else
	return true;
} // end function setupTimer()

function updateTimer(time) {
	timerEl = document.getElementById("timer");
	var time = time;
	if (!time) {
		var d = new Date();
		time = d.getTime();
	} // end if (!time)
	if (!startTime) startTime = time;
	if (time < lastTime) alert("Don't cheat!");
	else {
		var timeDiff = time - startTime;
		var timeDiffInSec = Math.floor(timeDiff / 1000);
		var minutes = Math.floor(timeDiffInSec / 60);
		var seconds = timeDiffInSec % 60;
		var displayTime = minutes.toString() + ":" + ((seconds < 10) ? ("0" + seconds.toString()) : seconds.toString());
		if (minutes != previousMinute) { previousMinute = minutes; loseStars(1);  }
		timerEl.style.display = "none";
		timerEl.innerHTML = displayTime;
		timerEl.style.display = "block";
	} // end else
	return true;
} // end function updateTimer(time)



// Stripe.com functions

var handler = StripeCheckout.configure({
  key: 'pk_test_ZMMqCmUQPkC2QjqkA6ZknBg7',
  image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
  locale: 'auto',
  zipCode: true,
  token: function(token) {
    signupFormSubmit(token);
    // You can access the token ID with `token.id`.
    // Get the token ID to your server-side code for use.
  }
}); // end var handler = StripeCheckout.configure({

window.addEventListener('popstate', function() {
  handler.close();
});

function stripePopup() {
	document.getElementById("signupSubmit").disabled = true;
	var cont = false;
	if (formcheck[0] && formcheck[2] && formcheck[3]) cont = true;
	if (cont) {
		paymentRequestSent = true; 			
		handler.open({
			image: '/square-image.png',
			name: 'Koji',
			description: 'Koji recurring monthly membership fee',
			amount: 200,
			panelLabel: 'Pay {{amount}}',
			email: document.getElementById("emailInput").value
			});	
	} // end if (cont) {	
} // end function stripePopup()