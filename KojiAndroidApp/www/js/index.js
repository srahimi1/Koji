/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        showBeginningModal();
        checkForStartupMessage();
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};

app.initialize();

rootURL = "http://arsr-app1.herokuapp.com";
csrfVar = "";
timerTime = 6;
yesnoButtonEnabled = true;
gameContentHTML = null;
gameC = null;
gameCHeight = 0;
numModalsOpen = 0;
demoShowing = false;
timerPaused = false;
correctLimit = 6;
dateStart = null;
timeAdd = null;
guessTop = null;
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
canvas = null, ctx = null, canvas2 = null, ctx2 = null, gc = null, gcheight = 0, gsheight = 0;
imageData = null;
similarLettersLowerCase = {"a": "egqdDQGB", "b": "hdgopqPFLK", "c": "eouvhyQEDO", "d": "bpqghPRBD", "e": "agqdEFKRP", "f": "ktjiFLKR", "g":"abdopqGQO", "h":"bdkrvHLRK", "i":"ljtILJT", "j":"iltTKRL", "k":"bdepxMWFE", "l": "ijtLPKH", "m": "nwuveWNRHE", "n": "muwvWRMK", "o":"bqpcdQBP", "p": "bdgceBRDE", "q": "pbdeBPDR", "r":"nuhHJLK", "s":"czgoCZGO", "t": "ijlfk", "u": "vnyhc", "v": "unyc", "w": "mnhuvzEMZ", "x": "kwmyz", "y": "zvukh", "z":"snum"};
similarLettersUpperCase = {"A": "VYUHegqd", "B": "KEPRFXhdgopq", "C": "GOQDeouvhy", "D": "CGOQbpqgh", "E": "KBPRFXMagqd", "F" : "KBEPRXktji", "G":"COQDabdopq", "H":"ITLJAbdkrv", "I":"HTLJljt", "J":"HITLilt", "K":"BEPRFXbdepx", "L":"HITJijt", "M":"NWUHEnwuv", "N": "MWUHEmuwv", "O": "CGQDbqpcd", "P": "KBERFXbdgce", "Q":"GCDOpbde", "R": "KBEPFXnuh", "S" : "ZCBEOzcbeo", "T": "HILJ", "U": "AVYH", "V" : "AYUN", "W" : "YMNEZmz", "X" : "BEKZS", "Y":"VUNH", "Z" : "SNMUXK"};
allLetters = {"a": 1, "b": 1, "c": 1, "d": 1, "e": 1, "f": "ktji", "g":"abdopq", "h":"bdkrv", "i":"ljt", "j":"ilt", "k":"bdepx", "l": "ijt", "m": "nwuv", "n": "muwv", "o":"bqpcd", "p": "bdgce", "q": "pbde", "r":"nuh", "s":"czg", "t": "ijlfk", "u": "vnyhc", "v": "unyc", "w": "mnhuv", "x": "kwmyz", "y": "zvukh", "z": 1, "A": 1, "B": 1, "C": 1, "D": 1, "E": 1, "F" : 1, "G": 1, "H": 1, "I": 1, "J": 1, "K": 1, "L": 1, "M": 1, "N": 1, "O": 1, "P": 1, "Q": 1, "R": 1, "S" : 1, "T": 1, "U": 1, "V" : 1, "W" : 1, "X" : 1, "Y": 1, "Z" : 1};

function getTitleBarHeight() {
    if (document && document.getElementById('KOJITitle')) {
        return document.getElementById('KOJITitle').offsetHeight;
    } else {
        return 0;
    }
} // end function getTitleBarHeight()

function setGameContentHeightWidth() {
    if (document && document.getElementById('gameContent')) {
        var ht = window.innerHeight || document.documentElement.clientHeight;
        document.getElementById('gameContent').style.height = ht - getTitleBarHeight() + 'px';
        gameCHeight = ht - getTitleBarHeight();
        document.getElementById('gameContent').style.width = (window.innerWidth - 20 || document.documentElement.clientWidth - 20);
    }
} // end function setGameContentHeightWidth()

function setCanvasParentHeight() {
    var c = document.getElementById("goalContainer");
    var c2 = document.getElementById("guessContainer");
    var ht = document.getElementById('gameContent').offsetHeight;
    c.style.height =  Math.floor(ht*.35) + "px";
    c2.style.height =  Math.floor(ht*.35) + "px";
} // end function setCanvasParentHeight()

function positionYesNoButtons() {
    var b = document.getElementById("buttonsDiv");
    var ht1 = document.getElementById("gameContent").offsetHeight;
    var ht2 = document.getElementById("pointsandxsContainer").offsetHeight;
    var ht3 = document.getElementById("goalContainer").offsetHeight;
    var ht4 = document.getElementById("timerBar").offsetHeight;
    var ht5 = document.getElementById("guessContainer").offsetHeight;
    var ht6 = document.getElementById("instruction1").offsetHeight;
    b.style.height = (ht1 - ht2 - ht3 - ht4 - ht5 - ht6) + "px";
}

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
    timerPaused = true;
    remove_bars();
    var body = document.getElementsByTagName("body")[0];
    //var gameContentHeight = document.getElementById('gameContent').offsetHeight;
    gc.parentNode.removeChild(gc);
    gc.style.position = "absolute";
    var pandx = document.getElementById("pointsandxsContainer");
    var totalht = document.getElementById("KOJITitle").offsetHeight + pandx.offsetHeight;
    gc.style.top = totalht + "px";
    body.appendChild(gc);
    canvas.style.height = gcheight + "px";
    canvas2.style.height = gcheight + "px";
    gc.style.marginTop = (0 - pandx.offsetHeight) + "px";
    gc.style.height = gameCHeight + "px";
    document.getElementById("letterChoicesCont").style.height = Math.floor(gameCHeight/5) + "px";
    document.getElementById("gameLettersContainer").style.height = Math.floor(gameCHeight/5) + "px";
/*  gc.onclick = function() {shrinkGoalContainer();};*/
    return false;
} // end function expandGoalContainer()

function shrinkGoalContainer() {
    if (gameOver) { gc.setAttribute("class", "goal-container-pre"); gc.style.display = "none"; gc.style.display = "block"; }
    var body = document.getElementsByTagName("body")[0];
    var go = document.getElementById("guessContainer");
    if (!gameOver) setCanvasParentHeight();
    gc.style.marginTop = "0px";
    gc.parentNode.removeChild(gc);
    gc.style.position = "relative";
    gc.style.top = "0px";
    go.parentNode.insertBefore(gc,go.previousSibling.previousSibling);
    startTime = null;
    timerPaused = false;
    setupTimer();
    return false;
} // end function shrinkGoalContainer()

function clearLines() {
    linesDrawnSoFar = {};
    numberOfLinesDrawnOnCanvas = 0;
    numberCorrect = 0;
    colorGoalDiv();
    return false;
}

function setupNewGame(demoInstructionsCode) {
    localStorage.removeItem("gameID");
    yesnoButtonEnabled = true;
    timerTime = 6;
    gameC.removeAttribute("class");
    gameC.style.display = "none";
    gameC.innerHTML = gameContentHTML;
    gameC.setAttribute("class", "game-content flex-col");
    gameC.style.display = "";
    gc = document.getElementById("goalContainer");
    var a = document.getElementById("cantguessletteryetButton");
    a.innerHTML = "CAN'T GUESS A LETTER YET";
    a.onclick = function() {selectLetter(-1);};
    document.getElementById("extra").style.visibility = "hidden";
    timerPaused = false;
    dateStart = null;
    timeAdd = null;
    guessTop = document.getElementById("guess");
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
    if (!!ctx2) ctx2.clearRect(0,0,canvas2.width,canvas2.height);
    canvas2 = null;
    ctx2 = null;    
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
    switchButtonsAndLetters(1);
    closeMenu(document.getElementById("menuDiv"));
    createAndGetGameData(demoInstructionsCode);
    return true;
}// function setupNewGame()

function createAndGetGameData(demoInstructionsCode) {
   // var csrfTok = document.querySelector("meta[name='csrf-token']").getAttribute("content");
    var sess = ( !localStorage.getItem("session_token") ? 0 : localStorage.getItem("session_token") );
    xhttp.abort();
    xhttp.open("POST", rootURL+"/games");
    xhttp.setRequestHeader('X-CSRF-Token', csrfVar);
    console.log(csrfVar);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            inputData = JSON.parse(this.responseText);
            localStorage.setItem("gameID", inputData.gameID);
            topData = inputData["colors"];
            cycleTopDataAt = 1;
            //cycleTopDataAt = Math.floor(Math.random() * 4) + 4;
            gameData = topData[0];
            finishSettingUpGame(demoInstructionsCode);
            return true;
        } // end if 
    } // end onreadystatechange
    xhttp.send("session_token=" + sess);
    xhttp.send();
    return false;
} // function createAndGetGameData()

function finishSettingUpGame(demoInstructionsCode) {
    setGameContentHeightWidth();
    setCanvasParentHeight();
    createColorDivs();
    createCanvasWithLetters();
    colorGoalDiv();
    positionYesNoButtons();
    gcheight = gc.offsetHeight;
    gsheight = (document.getElementById("guessContainer").offsetHeight * .35) + "px";
    gc.style.height = document.getElementById("gameContent").offsetHeight;
    gc.setAttribute("class", "goal-container-post");
    gameC.style.visibility = "visible";
    setupTimer();
    if (demoInstructionsCode == 1) {timerTime = 6000; doDemoInstructions();}
    return false;
} // end function finishSettingUpGame()

// color mixing part of game functions ...

function colorGoalDiv() {
    test1A(1);
    return true;
} // end function colorGoalDiv()

function test1A(num) {
    canvas2 = document.getElementById("canvas2");
    ctx2 = canvas2.getContext('2d');
    canvas2.style.display = "none";
    for (var i = 0; i < num; i++) {
        ctx2.fillStyle = (i == 0) ? gameData.goalColor : "yellow";
        ctx2.fillRect(i*(canvas2.width/num), 0, canvas2.width/num, canvas2.height);
    }
    canvas2.style.display = "block";
    return true;
} // end function test1A()


function cycleThroughTopData() {
    var prev = gameData.goalColor;
    gameData = topData[Math.floor(Math.random() * topData.length)];
    cycleTopDataAt = 1;
    //cycleTopDataAt = Math.floor(Math.random() * 4) + 4;
    cycleTopDataCounter = 0;
    colorGoalDiv();
    redrawLines();
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
    yesnoButtonEnabled = true;
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
                shift = 50; //0;
            else if (factor < 70)
                shift = 50; //25;
            else 
                shift = 50; //30;

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
    if (yesnoButtonEnabled) {
        yesnoButtonEnabled = false;
        var par = guessTop.firstChild;
        var cn = par.childNodes;
        cn[0].innerHTML = "";
        cn[1].innerHTML = "";
        cn[0].style.zIndex = "10";
        cn[1].style.zIndex = "11";
        cn[0].style.width = "100%";
        cn[1].style.width = "100%";
        cn[1].style.marginLeft = "-100%";
        cn[0].style.opacity = "0";
        cn[1].style.opacity = "0";
        var sendID = par.id + "";
        setTimeout(function() {determineResultOfChoice(sendID, opt);}, 200);
    }
    return true;
} // end function showUnderneathDiv(opt)

function determineResultOfChoice(sendID, opt) {
    var points = 0, time = 0, code = null, inner = "", inner1 = null, inner2 = null;
    if (divColors["answer"].toUpperCase() == gameData.goalColor.toUpperCase()) {
        if (opt == 0) {
            inner1 = document.getElementById("itmatchessvg");
            inner2 = document.getElementById("plus5svg");
            inner = inner1.innerHTML + "" + inner2.innerHTML;
            code = 0;
            missedCorrect = 0; 
            points = 5;
            numberCorrect++;
            time = 1350;
            drawLine();
        }
        else if (opt == 1) {
            inner = document.getElementById("missedthisonesvg").innerHTML;
            points = 0;
            code = 1;
            time = 600;
            missedCorrect++; 
        }
        var main = document.getElementById(sendID);
        main.style.display = "none";
        main.innerHTML = inner;
        main.style.display = "block";
        if (!!inner1) {
            inner1 = main.childNodes[1];
            inner1.style.height = Math.floor(inner1.parentNode.offsetHeight/3.5) + "px"
            inner1.style.width = Math.floor(inner1.parentNode.offsetWidth) + "px"
            inner1.style.marginTop = Math.floor(inner1.parentNode.offsetHeight/8) + "px"
        } else {
            inner1 = main.childNodes[1];
            inner1.style.height = Math.floor(inner1.parentNode.offsetHeight/1.8) + "px"
            inner1.style.width = Math.floor(inner1.parentNode.offsetWidth/1.5) + "px"
            inner1.style.marginTop = Math.floor(inner1.parentNode.offsetHeight/8) + "px"
        }
        var svg = null;
        if (points == 5) {
            svg = document.getElementById("plus5svg2");
            //svg.style.left = "50%";
            //svg.style.marginLeft = -(svg.getBoundingClientRect().width/2) + "px";
        }
    } // if (bkDivColors[key].toUpperCase() == gameData.goalColor.toUpperCase()) 
    else if (opt == 0) {
        var inner = document.getElementById("nodoesntmatchsvg").innerHTML;
        points = 0;
        code = 1;
        time = 600;
        missedCorrect++; 
        var main = document.getElementById(sendID);
        main.style.display = "none";
        main.innerHTML = inner;
        main.style.display = "block";
        inner = main.childNodes[1];
        inner.style.height = Math.floor(inner.parentNode.offsetHeight/1.8) + "px"
        inner.style.width = Math.floor(inner.parentNode.offsetWidth/1.5) + "px"
        inner.style.marginTop = Math.floor(inner.parentNode.offsetHeight/8) + "px"
    } // else if (opt == 0)
    else if (opt == 1) {
        points = 1;
        code = 2;
        time = 1350;
        numberCorrect++;
        var inner1 = document.getElementById("goodcallsvg");
        var inner2 = document.getElementById("plus1svg");
        inner = inner1.innerHTML + "" + inner2.innerHTML;
        var main = document.getElementById(sendID);
        main.style.display = "none";
        main.innerHTML = inner;
        main.style.display = "block";
        inner = main.childNodes[1];
        inner.style.height = Math.floor(inner.parentNode.offsetHeight/4) + "px"
        inner.style.marginTop = Math.floor(inner.parentNode.offsetHeight/8) + "px"
        var svg = document.getElementById("plus1svg2");
        //svg.style.left = "50%";
        //svg.style.marginLeft = -(svg.getBoundingClientRect().width/2) + "px";
        missedCorrect = 0;      
        drawLine();
    }
    
    if (missedCorrect == 1) {
        missedCorrect = 0;
        isGameLost();
    }
    
    if ((points != 0) && (!gameOver)) {
        updatePoints(points, code);  
        if ((code == 0) || (code == 2))
            setTimeout(function() {animatePoints(points, code);},100);
    }
    var par = guessTop.firstChild;
    var sendID = par.id + "";
    if (numberCorrect != correctLimit)
        getNextColorsTimeoutID = setTimeout(function() {startTime = null;timerPaused = false;setupTimer();getNextColors(par, sendID);},time);
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
    var width = letter.offsetWidth;
    var height = letter.offsetHeight;
    var moved = 0;
    borderIntervalID = setInterval(
        function() {
            if (values[1] == -1) {
                clearInterval(borderIntervalID);
                numberCorrect = 0;
                letter.style.width = (width + 2) + "px";
                letter.style.height = height + "px";
                letter.style.lineHeight = height + "px";                    
                letter.style.padding = "0";
                letter.style.margin = "0";
                letter.parentNode.style.width = (width + 6) + "px";
                letter.parentNode.style.padding = "0";
                letter.childNodes[0].style.fontSize = "1.5em";
                var ind = selectedUnderscore.id.split(":")[1];
                isChosenLetterCorrect(letter, ind);
                //document.getElementById("letterChoicesCont").style.display = "none";
                selectedUnderscore = null;
                var par = guessTop.firstChild;
                var cn = par.childNodes;
                var sendID = cn[0].id + "";
                if (!gameOver) setTimeout(function() {switchButtonsAndLetters(1); getNextColors(par, sendID); shrinkGoalContainer();},2000);
            } else {                    
                values[1] += 0.05;
                values = animateOriginalSmallOriginal(0, 100, values[1]);  
                values[0] = Math.floor(values[0]);
                if (((100 - values[0]) > 5)  && ((100 - values[0]) < 90)) {
                    letter.style.padding = "0";
                    letter.style.webkitTransform = "scale("+ ((100 - values[0])/100) +")";
                    letter.style.mozTransform = "scale("+ ((100 - values[0])/100) +")";
                    letter.style.msTransform = "scale("+ ((100 - values[0])/100) +")";
                    letter.style.oTransform = "scale("+ ((100 - values[0])/100) +")";
                    letter.style.transform = "scale("+ ((100 - values[0])/100) +")";
                    //letter.style.width = (width * ((100 - values[0])/100)) + "px";
                    //letter.style.height = (height * ((100 - values[0])/100)) + "px";                
                    //letter.style.top = -(height - (height * ((100 - values[0])/100)))/2 + "px";
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
        },17);
    return true;
} // function popUpALetter(letter)

function isChosenLetterCorrect(letter, ind) {
    var ind2 = letter.id + "";
    ind2 = ind2.split(":")[1];
    if (correctLetters[ind].index == ind2) letterBorderAnimation(letter, 0);
    else letterBorderAnimation(letter, 1);
    if (isGameWon()) {document.getElementById("letterChoicesCont").style.visibility = "hidden"; var PandaThumbsUpSVG = document.getElementById("pandathumbsupsvg").innerHTML; var el = document.getElementById("gameMessage"); el.style.color = "#3ecf8e"; el.innerHTML = "<p style='margin: 20px auto; font-size: 2.1em;'>You</p>" + PandaThumbsUpSVG + "<p style='margin: 20px auto; font-size: 2.1em;'>Won!</p>"; showMenu(document.getElementById('gameMessageDiv')); el.parentNode.style.marginTop = -(el.parentNode.offsetHeight/2) + "px"; setTimeout(function() {closeMenu(document.getElementById('gameMessageDiv'))},2000); showLetters(); } // if
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
        tempLetterChoicesDiv.style.backgroundColor = "#E4ECFF";
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

    imageData = ctx2.getImageData(0,0,canvas2.width,canvas2.height);
    var pixArr = imageData.data;
    var len = pixArr.length;

    for (var i = 0; i < len; i = i + 4) {
        var r = pixArr[i];
        var g = pixArr[i+1];
        var b = pixArr[i+2];
        var a = pixArr[i+3];

        if (((r+5 >= prevR) && (r-5 <= prevR))  && ((g+5 >= prevG) && (g-5 <= prevG)) && ((b+5 >= prevB) && (b-5 <= prevB))) { pixArr[i] = newR; pixArr[i+1] = newG; pixArr[i+2] = newB;}
    }// for (var i = 0; i < len; i = i + 4)
    canvas2.style.display = "none";
    ctx2.putImageData(imageData, 0, 0);
    canvas2.style.display = "block";
} // end function changeColorOfSelectCanvasPixels(hexColor)

function selectUnderscore(el, letters) {
    if (!gameOver && (numberCorrect == correctLimit) ) {
        var repeat = false;
        if (!!selectedUnderscore && (selectedUnderscore == el)) {
            for (var i = 0; i < letters.length; i++) document.getElementById("letterChoices"+i).style.display = "none";
            document.getElementById("letterChoicesCont").style.visibility = "hidden";
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
    } // end if (!gameOver && (numberCorrect == correctLimit) ) {
    return true;
} // end function selectUnderscore(el, letters)

function drawLine() {
    var width = canvas2.width;
    var ind = 0; 
    var vpos = Math.floor(Math.random() * 3);
    var combinedIndex;
    if (numberOfLinesDrawnOnCanvas < Math.floor((width * 3) * .70)) {
        ind = Math.floor(Math.random() * (width+1));
        combinedIndex = ind + "," + vpos;
        while (linesDrawnSoFar[combinedIndex]) {
            ind = Math.floor(Math.random() * (width+1));
            vpos = Math.floor(Math.random() * 3);
            combinedIndex = ind + "," + vpos;
        } // while (linesDrawnSoFar[combinedIndex])
    } else {
        for (var i = 0; i < Math.floor(width); i++) {
            var a = i + ",0";
            var b = i + ",1";
            var c = i + ",2";
            if (!linesDrawnSoFar[a]) {combinedIndex = a; ind = i; vpos = 0; break;}
            else if (!linesDrawnSoFar[b]) {combinedIndex = b; ind = i; vpos = 1;  break;}
            else if (!linesDrawnSoFar[c]) {combinedIndex = c; ind = i; vpos = 2;  break;}
        } // end for (var i = 0; i < Math.floor(width); i++)                
    } // end if...else
    canvas2.style.display = "none";
    var len = Math.floor(canvas2.height/3);
    switch(vpos) {
        case 0:
            ctx2.clearRect(ind,0,1,len);
            break;
        case 1:
            ctx2.clearRect(ind,len,1,len);
            break;
        case 2:
            ctx2.clearRect(ind,2*len,1,len);
            break;
    }
    canvas2.style.display = "block";
    linesDrawnSoFar[combinedIndex] = true;
    numberOfLinesDrawnOnCanvas++;
    return true;
} // end function drawLine()


function redrawLines() {
    canvas2.style.display = "none";
    var vpos, ind, len = Math.floor(canvas2.height/3);
    for (var index in linesDrawnSoFar) {
        if (linesDrawnSoFar.hasOwnProperty(index)) {
            vpos = parseInt(index.split(",")[1]);
            ind = parseInt(index.split(",")[0]);
            switch(vpos) {
                case 0:
                    ctx2.clearRect(ind,0,1,len);
                    break;
                case 1:
                    ctx2.clearRect(ind,len,1,len);
                    break;
                case 2:
                    ctx2.clearRect(ind,2*len,1,len);
                    break;
            } // end switch(vpos)
        } // end if (linesDrawnSoFar.hasOwnProperty(index))
    } // end for (var index in linesDrawnSoFar)
    canvas2.style.display = "block";
} // end function redrawLines()


function showLetterChoices(ind,len) {
    for (var i = 0; i < len; i++) document.getElementById("letterChoices"+i).style.display = "none";
    var el = document.getElementById("letterChoices"+ind);
    var letCC = document.getElementById("letterChoicesCont");
    el.style.verticalAlign = "middle";
    letCC.style.visibility = "visible";
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
    var el = document.getElementById("letterChoices"+ind);
    var pad = Math.floor((document.getElementById("gameContent").offsetHeight * .3)/16);
    for (var i = 0; i  < useTheseLetters.length; i++) {
        angle = useTheseLetters[i].rotation * (180/Math.PI);
        var elP = document.createElement("p"); 
        elP.setAttribute("class","letter-p");
        elP.style.fontFamily = useTheseLetters[i].font;
        elP.style.webkitTransform = "rotate("+angle+"deg)";
        elP.style.mozTransform = "rotate("+angle+"deg)";
        elP.style.msTransform = "rotate("+angle+"deg)";
        elP.style.oTransform = "rotate("+angle+"deg)";
        elP.style.transform = "rotate("+angle+"deg)";
        var t = document.createTextNode(useTheseLetters[i].letter);
        elP.appendChild(t);
        var div = document.createElement("div");
        div.id = "hoopla"+i+":"+i;
        div.setAttribute("class","letter-div");
        div.style.padding = pad + "px";
        div.style.margin = pad + "px";
        div.onclick = function(){selectLetter(this);}
        div.appendChild(elP);
        div.style.overflow = "hidden"; 
        frag.appendChild(div);
    }
    while (!!el.lastChild) el.removeChild(el.lastChild);
    el.appendChild(frag);
    return true;
} // end function makeLetterDivs(ind) 

function selectLetter(letter){
    if (!gameOver && (numberCorrect == correctLimit) ) {
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
            selectUnderscore(selectedUnderscore, inputData.letters);
            var par = guessTop.firstChild;
            var cn = par.childNodes;
            var sendID = cn[0].id + "";
            switchButtonsAndLetters(1);
            getNextColors(par, sendID);
            shrinkGoalContainer();
        } // if (letter != -1)
    } // if (!gameOver && (numberCorrect == correctLimit) ) {
    return true;
} // end function selectLetter(letter)

function switchButtonsAndLetters(code) {
    switch(code) {
        case 1:
            document.getElementById("gameLettersContainer").style.display = "none";
            document.getElementById("extra").style.visibility = "hidden";
/*          document.getElementById("instruction1").innerHTML = "Will mixing the colors in boxes 1 and 2 make the color shown above them?";
            document.getElementById("buttonsDiv").style.display = "flex";*/
            break;
        case 2:
            expandGoalContainer();
            document.getElementById("gameLettersContainer").style.display = "block";
            document.getElementById("letterChoicesCont").style.marginTop = (gcheight + 1) + "px";
            document.getElementById("extra").style.visibility = "visible";
            /*document.getElementById("instruction1").innerHTML = "Can you figure out what letters are being revealed in the top panel? Select a spot below to see the available letters for it.";*/
            /*document.getElementById("buttonsDiv").style.display = "none";*/
            break;
    }// end switch(code)
}

function doDemoInstructions() {
    resetDemoInstructions();
    setTimeout(function() {demoShowing = true; setGameContentHeightWidth(); showDemoInstructions();},1000);
}

function resetDemoInstructions() {
    closeMenu(document.getElementById('demoAnimatedInstructionsDiv1'));
    closeMenu(document.getElementById('demoAnimatedInstructionsDiv2'));
    closeMenu(document.getElementById('demoAnimatedInstructionsDiv3'));
    closeMenu(document.getElementById('demoAnimatedInstructionsDiv4'));
    closeMenu(document.getElementById('demoAnimatedInstructionsDiv5')); 
    document.getElementById("demoInstructions1").style.opacity = 0;
    document.getElementById("demoInstructions2").style.opacity = 0;
    document.getElementById("demoInstructions3").style.opacity = 0;
    document.getElementById("demoInstructions4").style.opacity = 0;
    document.getElementById("demoInstructions5").style.opacity = 0;
    document.getElementById("demoInstructions6").style.opacity = 0;
    document.getElementById("demoInstructions7").style.opacity = 0;
    document.getElementById("demoInstructions8").style.opacity = 0;
    document.getElementById("demoInstructions9").style.opacity = 0;
    document.getElementById("demoInstructions10").style.opacity = 0;
    document.getElementById("demoInstructions11").style.opacity = 0;
    document.getElementById("demoInstructions12").style.opacity = 0;
    document.getElementById("demoInstructions13").style.opacity = 0;
    document.getElementById("zaa1").style.fontSize = "0.5em";
    document.getElementById("zaa1").style.marginTop = "2em";
}

function showDemoInstructions() {
    var ht1 = document.getElementById("KOJITitle").offsetHeight + document.getElementById("pointsandxsContainer").offsetHeight;
    var ht2 = document.getElementById("goalContainer").offsetHeight;
    var ht3 = document.getElementById("guessContainer").offsetHeight
    showMenu(document.getElementById('demoAnimatedInstructionsDiv1'));
    document.getElementById("demoInstructions0A").style.opacity = 1;
    document.getElementById("demoInstructions0A").style.height = ht1 + "px";
    document.getElementById("demoInstructions3").style.opacity = 1;
    setTimeout(function() {document.getElementById("demoInstructions1").style.opacity = 1;}, 1000);
    setTimeout(function() {document.getElementById("demoInstructions2").style.opacity = 1;}, 2500);
    setTimeout(function() {closeMenu(document.getElementById('demoAnimatedInstructionsDiv1'));}, 6500);
    
    setTimeout(function() {showMenu(document.getElementById('demoAnimatedInstructionsDiv2'));}, 7000);
    setTimeout(function() {document.getElementById("demoInstructions0B").style.height = ht1 + "px"; document.getElementById("demoInstructions0B").style.opacity = 1;}, 7500);
    setTimeout(function() {document.getElementById("demoInstructions4").style.opacity = 1;}, 8000);
    setTimeout(function() {document.getElementById("demoInstructions5").style.opacity = 1;}, 10000);
    setTimeout(function() {document.getElementById("demoInstructions6").style.opacity = 1;}, 12000);
    setTimeout(function() {closeMenu(document.getElementById('demoAnimatedInstructionsDiv2'));}, 15500);

    setTimeout(function() {showMenu(document.getElementById('demoAnimatedInstructionsDiv3'));}, 16000);
    setTimeout(function() {document.getElementById("demoInstructions0C").style.height = ht1 + "px"; document.getElementById("demoInstructions0C").style.opacity = 1;}, 16500);
    setTimeout(function() {document.getElementById("demoInstructions7").style.opacity = 1;}, 17000);
    setTimeout(function() {drawLine(); drawLine();}, 19000);
    setTimeout(function() {document.getElementById("demoInstructions8").style.opacity = 1;}, 22000);
    setTimeout(function() {numberCorrect = 6; selectUnderscore(document.getElementById("letterBox:0"), inputData.letters); switchButtonsAndLetters(2);}, 26000);
    setTimeout(function() {selectUnderscore(document.getElementById("letterBox:1"), inputData.letters); }, 27000);
    setTimeout(function() {selectUnderscore(document.getElementById("letterBox:2"), inputData.letters); }, 28000);
    setTimeout(function() {selectUnderscore(document.getElementById("letterBox:1"), inputData.letters); }, 29000);
    setTimeout(function() {selectLetter(document.getElementById("letterChoices1").firstChild);}, 30000);
    setTimeout(function() {document.getElementById("demoInstructions9").style.opacity = 1;}, 32000);
    setTimeout(function() {closeMenu(document.getElementById("demoAnimatedInstructionsDiv3"));}, 35000);
    
    setTimeout(function() {showMenu(document.getElementById("demoAnimatedInstructionsDiv4"));}, 35500);
    setTimeout(function() {timerPaused = true; gameOver = true; }, 36000);
    setTimeout(function() {document.getElementById("demoInstructions0D").style.height = ht1 + "px"; document.getElementById("demoInstructions0D").style.opacity = 1;}, 36000);
    setTimeout(function() {document.getElementById("zaa1").style.fontSize = "2em"; document.getElementById("zaa1").style.marginTop = "-0.7em"; },37000); 
    setTimeout(function() {document.getElementById("demoInstructions10").style.opacity = 1;}, 38000);
    setTimeout(function() {document.getElementById("demoInstructions11").style.opacity = 1;}, 39000);
    setTimeout(function() {document.getElementById("demoInstructions12").style.opacity = 1;}, 42000);
    setTimeout(function() {closeMenu(document.getElementById("demoAnimatedInstructionsDiv4"));}, 47000);
    
    setTimeout(function() {showMenu(document.getElementById("demoAnimatedInstructionsDiv5"));}, 48000);
    setTimeout(function() {document.getElementById("demoInstructions0E").style.height = ht1 + "px"; document.getElementById("demoInstructions0E").style.opacity = 1;}, 48000);
    setTimeout(function() {document.getElementById("demoInstructions13").style.opacity = 1;}, 48000);
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
            document.getElementById("letterChoicesCont").style.visibility = "hidden"; 
            var el = document.getElementById("gameMessage"); 
            el.style.color = "red"; 
            el.innerHTML = "<p style='margin: 0 auto 5px auto; font-size: 2.5em;'>Game Over</p><p style='font-size: 1em; margin-top: 0;'>(...wait for answer)</p>"; 
            showMenu(document.getElementById('gameMessageDiv')); 
            el.parentNode.style.marginTop = -(el.parentNode.offsetHeight/2) + "px";
            setTimeout(function() {closeMenu(document.getElementById('gameMessageDiv')); document.getElementById("cantguessletteryetButton").style.visibility = "hidden"; switchButtonsAndLetters(2); showLetters();},2000);  
            return true; 
        } // if (numXs == 4)
    } // if (!gameOver)
    return false;
} // end function isGameLost()

function showLetters() {
    drawLine();
    if (numberOfLinesDrawnOnCanvas < Math.floor(canvas.width * 3)) showLettersTimeoutID = setTimeout(function() {showLetters()}, 10);
    else {var a = document.getElementById("cantguessletteryetButton"); a.innerHTML = "<img src='img/replayTransparent.png' style='height: 1.4em; width: 1.4em; vertical-align: sub;'> PLAY AGAIN"; a.onclick = function() {gc.style.display = "none"; shrinkGoalContainer(); setupNewGame(0);};  a.style.visibility = "visible";}
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
            if (numberOfLinesDrawnOnCanvas < Math.floor(canvas.width * 3 * .25))
                add = add;
            else if (numberOfLinesDrawnOnCanvas < Math.floor(canvas.width * 3 * .35))
                add = Math.floor(add * .90);
            else if (numberOfLinesDrawnOnCanvas < Math.floor(canvas.width * 3 * .45))
                add = Math.floor(add * .85);
            else if (numberOfLinesDrawnOnCanvas < Math.floor(canvas.width * 3 * .50))
                add = Math.floor(add * .70);
            else if (numberOfLinesDrawnOnCanvas < Math.floor(canvas.width * 3 * .55))
                add = Math.floor(add * .65);
            else if (numberOfLinesDrawnOnCanvas < Math.floor(canvas.width * 3 * .60))
                add = Math.floor(add * .50);
            else if (numberOfLinesDrawnOnCanvas < Math.floor(canvas.width * 3 * .65))
                add = Math.floor(add * .40);
            else if (numberOfLinesDrawnOnCanvas < Math.floor(canvas.width * 3 * .70))
                add = Math.floor(add * .30);
            else add = Math.floor(add * .10);
        }
        points += add;
        if (numberCorrect == correctLimit) {
            //redoXs();
        } // if (numberCorrect == correctLimit)
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
    numXs = 0;
    //numXs = ((numXs - 2) < 0) ? 0 : (numXs - 2);
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
   // var csrfTok = document.querySelector("meta[name='csrf-token']").getAttribute("content");
    var route = "/games/"+ (!localStorage.getItem("gameID") ? "0" : localStorage.getItem("gameID") );
    route += "?points="+points+"&numberOfX="+numXs+"&won="+won;
    xhttp.abort();
    xhttp.open("PUT", rootURL+route);
    xhttp.setRequestHeader('X-CSRF-Token', csrfVar);
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
    if (code == 0) {updatePoints(50,2);}
    else if (code == 1) {
        updatePoints(0,3);
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
        if (numberCorrect == correctLimit) 
            clearTimeout(getNextColorsTimeoutID);
        time=17;
    }
    else if (code == 1) 
        time=500;
    else if (code == 2) 
        time=17;
    else if (code == 3) 
        time=500;
    if (code == 0) el2 = document.getElementById("plus5svg2");
    else if (code == 2) el2 = document.getElementById("plus1svg2");
    var ht = el2.getBoundingClientRect().height;
    var mp = document.getElementById("guess").offsetWidth/2;
    /*document.getElementById("guessContainer").style.overflow = "visible";
    document.getElementById("guess").style.overflow = "visible";*/
    pointsIntervalID = setInterval(
        function() {
            if (values[1] == -1) {
                clearInterval(pointsIntervalID);
/*              document.getElementById("guessContainer").style.overflow = "hidden";
                document.getElementById("guess").style.overflow = "hidden";*/
                if (numberCorrect == correctLimit) {
                    clearTimeout(getNextColorsTimeoutID);
                    setTimeout(function() {redoXs(); selectUnderscore(document.getElementById("letterBox:0"), inputData.letters); switchButtonsAndLetters(2);},500);
                }
            }
            else {
                values[1] += 0.05;
                if ((code == 0) || (code == 2)) {
                    if (code == 0) values = animateSmallLargeMedium(1, 2, values[1], 9, null);  
                    else if (code == 2) values = animateSmallLargeMedium(1, 2, values[1], 3, null);
                    //el2.style.width = (12.5*values[0])+"%";
                    //el2.style.height = (12.5*values[0])+"%";
                    el2.style.webkitTransform = "scale("+values[0]+")";
                    el2.style.msTransform = "scale("+values[0]+")";
                    el2.style.mozTransform = "scale("+values[0]+")";
                    el2.style.oTransform = "scale("+values[0]+")";
                    el2.style.transform = "scale("+values[0]+")";
                    //el2.style.left = "50%";
                   // el2.style.marginTop = (20 - ((el2.getBoundingClientRect().height - ht)/2)) + "px"; // ((height-el2.getBoundingClientRect().height)/2) + "px";
                    //el2.style.marginLeft = (mp - (el2.getBoundingClientRect().width/2)) + "px"; //(left-((width-el2.getBoundingClientRect().width))) + "px";
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
   // var csrfTok = document.querySelector("meta[name='csrf-token']").getAttribute("content");
    var route = "/players/" + (!localStorage.getItem("session_token") ? 0 : localStorage.getItem("session_token") );
    xhttp.abort();
    xhttp.open("GET", rootURL+route);
    //xhttp.setRequestHeader('X-CSRF-Token', csrfVar);
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
    var routeFooter = "/players/" + (!localStorage.getItem("session_token") ? 0 : localStorage.getItem("session_token"));
    if (sel == 1) {
        var email = encodeURIComponent(document.getElementById("loginEmailInput").value);
        var cellphone = encodeURIComponent(returnInteger(document.getElementById("loginCellphoneInput").value));
        var password = encodeURIComponent(document.getElementById("changePasswordInput1").value);
        var cc = encodeURIComponent(document.getElementById("passwordChangeConfirmationCode").value);
        route = "/players/0";
        data = "code=1&password="+password+"&email="+email+"&cellphone="+cellphone+"&cc="+cc;
    } else if (sel == 2) {
        var email = encodeURIComponent(document.getElementById("changeEmailInput").value);
        var cellphone = encodeURIComponent(returnInteger(document.getElementById("changeCellphoneInput").value));
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
       // var csrfTok = document.querySelector("meta[name='csrf-token']").getAttribute("content");
        xhttp.abort();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var res = this.responseText + "";
                if (res.toUpperCase() == "OK") {
                    document.getElementById("changeLogin").style.height = "0";
                    document.getElementById("cancelMembership").style.height = "0";
                    if (sel == 4) {localStorage.removeItem("session_token"); clearProfile();}
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
                    setTimeout(function() {closeMenu(document.getElementById('gameMessageDiv')); closeMenu(document.getElementById('resetPasswordDiv'))},2000);
/*                  document.getElementById("changePassword").style.height = "0";
                    document.getElementById("changePassword").style.marginTop = "0";*/
                } else if ((res.toUpperCase() == "BAD") && (sel != 4)) {
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
        xhttp.open("PUT", rootURL + routeFooter, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.setRequestHeader('X-CSRF-Token', csrfVar);
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
    document.getElementById("changeCellphoneInput").value = "";
    document.getElementById("cancelMembershipInput").value = "";
/*  document.getElementById("changePassword").style.height = "0";
    document.getElementById("changePassword").style.marginTop = "0";*/
    document.getElementById("changeLogin").style.height = "0";
    document.getElementById("cancelMembership").style.height = "0";

    if (opt == 1) {
        /*document.getElementById("changePassword").style.display = "block";*/
        showMenu(document.getElementById('resetPasswordDiv'));
/*      if (document.getElementById("changePassword").offsetHeight < 5) {
            document.getElementById("changePassword").style.height = "34em";
            document.getElementById("changePassword").style.marginTop = "-34em";
        } else setTimeout(function() {document.getElementById("changePassword").style.height = "34em"; document.getElementById("changePassword").style.marginTop = "-34em";},600);*/
        document.getElementById("changePasswordInput1").value = '';
        document.getElementById("changePasswordInput2").value = '';
        document.getElementById("passwordChangeConfirmationCode").value = "";
        document.getElementById("changePasswordInput1").nextSibling.style.visibility = "hidden";
        document.getElementById("changePasswordInput2").nextSibling.style.visibility = "hidden";
        document.getElementById("changePasswordButton").disabled = true;
    } else if (opt == 2) {
        /*document.getElementById("changeLogin").style.display = "block";*/
        if (document.getElementById("changeLogin").offsetHeight < 5) document.getElementById("changeLogin").style.height = "20em";
        else setTimeout(function() {document.getElementById("changeLogin").style.height = "20em";},600);
        document.getElementById("changeEmailInput").value = '';
        document.getElementById("changeCellphoneInput").value = '';
        document.getElementById("changeEmailInput").nextSibling.style.visibility = "hidden";
        document.getElementById("changeCellphoneInput").nextSibling.style.visibility = "hidden";
        document.getElementById("changeLoginButton").disabled = true;
    } else if (opt == 3) {
        /*document.getElementById("cancelMembership").style.display = "block";*/
        if (document.getElementById("cancelMembership").offsetHeight < 5) document.getElementById("cancelMembership").style.height = "20em";
        else setTimeout(function() {document.getElementById("cancelMembership").style.height = "20em";},600);
        document.getElementById("cancelMembershipInput").value = '';
        document.getElementById("cancelMembershipButton").disabled = true;
    } else if (opt == 4) {
        document.getElementById("changePasswordInput1").value = "";
        document.getElementById("changePasswordInput2").value = "";
        document.getElementById("passwordChangeConfirmationCode").value = "";
        document.getElementById("changeEmailInput").value = "";
        document.getElementById("changeCellphoneInput").value = "";
        document.getElementById("cancelMembershipInput").value = "";
/*      document.getElementById("changePassword").style.height = "0";
        document.getElementById("changePassword").style.marginTop = "0";*/
        document.getElementById("changeLogin").style.height = "0";
        document.getElementById("cancelMembership").style.height = "0";         
        closeMenu(document.getElementById('resetPasswordDiv'));
    }
    return false;
} // function profileOption(opt)


function submitMessage() {
   // var csrfTok = document.querySelector("meta[name='csrf-token']").getAttribute("content");
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
        xhttp.open("POST", rootURL+"/messages", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.setRequestHeader('X-CSRF-Token', csrfVar);
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
    var hid = inp;
    if (sel == 1) {
        formcheck[1] = false;
        var errorEl = document.getElementById("cellphoneErrorMessage");
    } else if (sel == 2) {
        var errorEl = document.getElementById("loginCellphoneErrorMessage");
    }
    else if (sel == 3) {
        var errorEl = document.getElementById("changeLoginErrorMessage");
    }
    // inp.blur();
    // hid.focus();
    var hidValue = hid.value + "";
    var char = hidValue[hidValue.length - 1];
    var test = "";
    var temp = "";
    if ( isNaN(char) || (parseInt(char) == null) || (hidValue.length > 13) ) {
        for (var i = 0; i < hidValue.length - 1; i++)
            temp += hidValue[i];
    } else {
        for (var i = 0; i < hidValue.length; i++)
            temp += hidValue[i];
    }
    test = temp + "";

    var len = test.length;
    var number = "";
    for (var i = 0; i < len; i++) {
        if ((i == 0) && (test[i] != "(")) number = "(" + ((test[i] == "0" || test[i] == 0) ? "0" : test[i]);
        else if (i == 0) number = ((test[i] == "0" || test[i] == 0) ? "0" : test[i]);
        else if ((i == 4) && (test[i] != ")")) number = number + ")" + ((test[i] == "0" || test[i] == 0) ? "0" : test[i]);
        /*else if (i == 3) number = number + ")" + ((test[i] == "0" || test[i] == 0) ? "0" : test[i]);*/
        else if ((i == 8) && (test[i] != "-")) number = number + "-" + ((test[i] == "0" || test[i] == 0) ? "0" : test[i]);
        else number = number + ((test[i] == "0" || test[i] == 0) ? "0" : test[i]);
    } // for (var i = 0; i < 10; i++)

    var test2 = returnInteger(test);
    if ((len == 13) && (sel == 1)) {
        var success = "document.getElementById('cellphoneInput').nextSibling.style.visibility = 'visible'; document.getElementById('cellphoneErrorMessage').innerHTML = ''";
        var fail = "document.getElementById('cellphoneInput').nextSibling.style.visibility = 'hidden'; document.getElementById('cellphoneErrorMessage').innerHTML = 'cellphone number already exists'";
        checkIfExist("/checkcellphone",test2,success,fail);
    } else if ((len == 13) && (sel == 3)) {
        var success = "document.getElementById('changeCellphoneInput').nextSibling.style.visibility = 'visible'; document.getElementById('changeLoginErrorMessage').innerHTML = '';document.getElementById('changeLoginButton').disabled = false;";
        var fail = "document.getElementById('changeCellphoneInput').nextSibling.style.visibility = 'hidden'; document.getElementById('changeLoginErrorMessage').innerHTML = 'cellphone number already exists';document.getElementById('changeLoginButton').disabled = true;";
        checkIfExist("/checkcellphone",test2,success,fail);
    } else {
        inp.nextSibling.style.visibility = "hidden"; 
        errorEl.innerHTML = "";
    }
    hid.value = number;
    // hid.focus();
    isSignupFormReady();
    return false;
} // end function validateCellphone()

function returnInteger(str) {
    var test = "";
    for (var i = 0; i < str.length; i++) {
        if ((i != 0) && (i != 4) && (i != 8)) test += str[i];
    } // end for statement
    if ((test == "") || (test == " ") || (test.trim() == "") || isNaN(parseInt(test)) ) return "";
    else return parseInt(test);
} // end function returnInteger(str)

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
        xhttptemp.open("GET", rootURL+routetotal, true);
        xhttptemp.send();
    return false;
} // end function checkIfExist(route, method, data, success, fail)

function signupFormSubmit(stripeToken) {
    var button = document.getElementById("signupSubmit");
    button.disabled = true;
    var cont = false;
    if (formcheck[0] && formcheck[2] && formcheck[3]) cont = true;
    if (cont) {
      //  var csrfTok = document.querySelector("meta[name='csrf-token']").getAttribute("content");
        var email = encodeURIComponent(document.getElementById("emailInput").value);
        var cellphone = encodeURIComponent(returnInteger(document.getElementById("cellphoneInput").value));
        var displayname= encodeURIComponent(document.getElementById("displaynameInput").value);
        var password1 = encodeURIComponent(document.getElementById("password1Input").value);
        var password2 = encodeURIComponent(document.getElementById("password2Input").value);
        var version = document.getElementById("gameVersion").value;
        xhttp.abort();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var res = this.responseText + "";
                var el = document.getElementById("gameMessage");
                var res2 = res.split(":q:")[0];
                if (res2.toUpperCase() == "OK") {
                    el.style.color = "#3ecf8e";
                    el.innerHTML = "Thank you for signing up to play Koji!<br/>Enjoy!"; 
                    localStorage.setItem("session_token",res.split("OK:q:")[1]);
                    closeMenu(document.getElementById('signupDiv'));
                } else if (res.toUpperCase() == "BAD2") {
                    el.style.color = "#F00000"; 
                    el.innerHTML = "Payment processing was not succesful, we apologize.<br/>Please check your information and try again."; 
                    button.disabled = false;
                } else if (res.toUpperCase() == "BAD") { 
                    el.style.color = "#F00000"; 
                    el.innerHTML = "Sorry, sign-up was not succesful<br/>Please check your information and try again."; 
                    button.disabled = false;
                } // if (res.toUpperCase() == "OK")
                showMenu(document.getElementById('gameMessageDiv')); 
                el.parentNode.style.marginTop = -(el.offsetHeight/2) + "px";
                setTimeout(function() {closeMenu(document.getElementById('gameMessageDiv')); showMenu(document.getElementById('menuDiv')); },3500);               
                return true;
            } // if (this.readyState == 4 && this.status == 200)
        }; // xhttptemp.onreadystatechange = function()
        xhttp.open("POST", rootURL+"/players", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.setRequestHeader('X-CSRF-Token', csrfVar);
        xhttp.send("email="+email+"&cellphone="+cellphone+"&display_name="+displayname+"&password1="+password1+"&password2="+password2+"&game_version="+version+"&stripeToken="+stripeToken.id+"&stripeEmail="+stripeToken.email);
    } // end if (cont)
    return false;
} // end function signupFormSubmit()

function signinFormSubmit(code) {
    var email = encodeURIComponent(document.getElementById("loginEmailInput").value);
    var cellphone = encodeURIComponent(returnInteger(document.getElementById("loginCellphoneInput").value));
    var password = encodeURIComponent(document.getElementById("loginPasswordInput").value);
    if (((email === "") && (cellphone === "")) || ((email.trim() === "") && (cellphone.trim() === ""))) {
        return false;
    } else {
        xhttp.abort();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var res = this.responseText + "";
                var el = document.getElementById("gameMessage");
                var res2 = res.split(":q:")[0];
                if (res2.toUpperCase() == "OK") {
                    localStorage.setItem("session_token",res.split("OK:q:")[1]); 
                    el.style.color = "#3ecf8e"; 
                    el.innerHTML = "Sign in succesful.";
                    getProfileData();
                    closeMenu(document.getElementById('signinDiv'));
                } else if (res.toUpperCase() == "RESET SENT") { 
                    el.style.color = "#3ecf8e"; 
                    el.innerHTML = "Password reset confirmation code sent. Please wait up to 2 minutes to receive code."; 
                    profileOption(1);
                } else if ((res.toUpperCase() == "BAD") && (code == 0)) {
                    el.style.color = "#F00000"; 
                    el.innerHTML = "Sorry, sign-in was not succesful.<br/>Please check your information and try again."; 
                } else if ((res.toUpperCase() == "BAD") && (code == 1)) {
                    profileOption(4); 
                    el.style.color = "#F00000"; 
                    el.innerHTML = "The login information was not found.<br/>Please check your information and try again."; 
                }
                showMenu(document.getElementById('gameMessageDiv')); 
                el.parentNode.style.marginTop = -(el.offsetHeight/2) + "px";
                setTimeout(function() {closeMenu(document.getElementById('gameMessageDiv'))},3000);
                return false;
            } // if (this.readyState == 4 && this.status == 200)
        }; // xhttp.onreadystatechange = function()
        xhttp.open("POST", rootURL+"/players/login", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.setRequestHeader('X-CSRF-Token', csrfVar);
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
    if (!demoShowing) gameC.style.height = "0";
    numModalsOpen++;
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
    } else if (id == "contactusDiv") {
        document.getElementById("contactusForm").reset();
    }
    el.style.display = "";
    el.classList.add("flex");
    el.classList.add("flex-col");
    setTimeout(function() {el.style.marginTop="0em"; el.style.opacity="1";}, 100);
    if (id == "startupDiv") setTimeout(function() {document.getElementById('rainbowCover').style.marginLeft = "175%"}, 150);
    return true;
} // end function showMenu(el)

function closeMenu(el) {
    if ((el.style.opacity == "1") || (!!el.currentStyle && (el.currentStyle.display != "none")) || (!!getComputedStyle(el) && (getComputedStyle(el).display != "none")) || (!!getComputedStyle(el,null) && (getComputedStyle(el,null).display != "none")) ) numModalsOpen--;
    el.style.opacity = "0";
    el.style.marginTop = "-2em";
    setTimeout(function() {el.style.display = "none"; if (numModalsOpen == 0) {setGameContentHeightWidth();}}, 800);
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
    console.log("in checkforstartupmessage");
    var version = document.getElementById("gameVersion").value;
    //var csrfTok = document.querySelector("meta[name='csrf-token']").getAttribute("content");
    var route = "/message?version="+version;
    var newRoute = rootURL+route;
    xhttp.open("GET", newRoute);
    //xhttp.setRequestHeader('X-CSRF-Token', csrfVar);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var message = this.responseText + "";
            if (message != "") {
                var messageArr = message.split(":q:");
                if (messageArr[0] == "1") {
                    csrfVar = messageArr[1];
                    console.log("in checkForStartupMessage");
                    console.log(csrfVar);
                    localStorage.setItem("csrfToken",csrfVar);
                } else {
                    var el = document.getElementById('startupMessageSpan');
                    el.innerHTML = message;
                    el = document.getElementById('startupMessageDiv');
                    el.style.height = "100%";
                    el.style.marginTop="0em"; 
                    el.style.opacity="1";
                    numModalsOpen++; 
                    /*setTimeout(function() {showMenu(document.getElementById('menuDiv'));},500);*/
                } // if (message != "1")
            }
            return true;
        } // end if
    } // end onreadystatechange
    xhttp.send();
    return true;
} // end function checkForStartupMessage()

function showBeginningModal() {
    gameC = document.getElementById("gameContent");
    gameContentHTML = gameC.innerHTML;
    gameC.style.height = "0";
    var PandaBoxesSVG = document.getElementById("pandaboxessvg").innerHTML; 
    var el = document.getElementById("pandaboxes"); 
    var ht = window.innerHeight || document.documentElement.clientHeight;
    el.parentNode.style.height = ht + "px";
    el.style.display = "none";
    el.innerHTML += PandaBoxesSVG; 
    el.style.display = "block";
    el.childNodes[2].style.height = Math.floor(ht/2) + "px";
    el.childNodes[2].style.width = Math.floor(ht/2*.7) + "px";
    el = document.getElementById("startupTitle");
    el.style.width = Math.floor(ht/10) + "px";
    el.style.height = Math.floor(ht/10) + "px";
    el.style.verticalAlign = "bottom";
    el.style.fontSize = Math.floor(ht/10) + "px";
    el = document.getElementById("startupTitleImage");
    el.style.width = Math.floor(ht/9) + "px";
    el.style.height = Math.floor(ht/9) + "px";
    el = document.getElementById("startupButton1");
    el.style.width = Math.floor(ht/2*.7) + "px";
    el = document.getElementById("startupButton2");
    el.style.width = Math.floor(ht/2*.7) + "px";
    el = document.getElementById("sun");
    var par = document.getElementById("gameContent");
    var sz = Math.floor(par.offsetWidth/3);
    el.style.height = sz + "px";
    el.style.width = sz + "px";
    el.style.borderRadius = sz + "px";
    el.style.left = (0 - Math.floor(par.offsetWidth/10)) + "px";
    el.style.top = (0 - Math.floor(par.offsetWidth/8)) + "px";
    showMenu(document.getElementById('startupDiv'));
    /*el.parentNode.style.marginTop = -(el.offsetHeight/2) + "px";*/ 
} // end function showBeginningModal()

// timer functions ...

function setupTimer() {
    if (!!window.Worker) {
        if (!webWorker) {webWorker = new window.Worker("js/timer.js"); webWorker.onmessage = function(evt) {updateTimer(evt.data);} }
    } // end if (!!window.Worker)
    else {
        dateStart = new Date();
        dateStart = dateStart.getTime();
        timeAdd = 0;
        clearTimeout(timeoutID);
        timeoutID = setTimeout(function() {updateTimer(null)},100);
    } // end else
    return false;
} // end function setupTimer()

function updateTimer(time) {
    if (!gameOver && !timerPaused) {
        if (!startTime) {startTime = time; setTimeout(function() {remove_bars(); add_bars(); transition_bars();}, 0);}
        timerEl = document.getElementById("timer");
        var timeNow = time;
        if (!timeNow) {
            var d = new Date();
            timeNow = d.getTime();
        } // end if (!time)
        if (timeNow < lastTime) alert("Don't cheat!");
        else {
            lastTime = timeNow;
            var timeDiff = timeNow - startTime;
            var timeDiffInSec = Math.floor(timeDiff / 1000);
            var minutes = Math.floor(timeDiffInSec / 60);
            var seconds = timeDiffInSec % 60;
            var displayTime = timerTime - seconds; //minutes.toString() + ":" + ((seconds < 10) ? ("0" + seconds.toString()) : seconds.toString());
            //if (minutes != previousMinute) { previousMinute = minutes; loseStars(1);  }
            if ((displayTime == -1) || (displayTime < 0)) {displayTime = timerTime; startTime = null; clearLines(); isGameLost();}
/*          if (displayTime < 0) {displayTime = 25; startTime = null; clearLines();}
            else if ((displayTime < 1) && (startTime != -1)) { startTime = -1; isGameLost(); }*/
            timerEl.style.display = "none";
            timerEl.innerHTML = displayTime;
            timerEl.style.display = "inline-block";
        } // end else
        if (timeoutID != null) { timeAdd += 100; var dt = new Date(); var diff = dt.getTime() - dateStart - timeAdd; clearTimeout(timeoutID); timeoutID = setTimeout(function() {updateTimer(null)},100 - diff);}
    } // end if (!gameOver && !timerPaused)
    else {
        if (!!webWorker) webWorker.terminate();
        webWorker = null;
        clearTimeout(timeoutID);
    }
    return false;
} // end function updateTimer(time)

function remove_bars() {
    var par = document.getElementById("timerBar");
    var a = par.childNodes[0];
    var b = par.childNodes[1];
    if (!!a) par.removeChild(a);
    if (!!b) par.removeChild(b);
    return true;
} // end function remove_bars()

function add_bars() {
    var par = document.getElementById("timerBar");
    par.style.display = "none";
    var a = document.createElement("div");
    a.setAttribute("class","timer-inner-bar-pre");
    var b = document.createElement("div");
    b.setAttribute("class","timer-inner-bar-middle");
    par.appendChild(a);
    par.appendChild(b);
   // a.style.float = "left";
   // b.style.float = "right";
    par.style.display = "block";
    a.getBoundingClientRect();
    b.getBoundingClientRect();
    return true;
} // end function add_bars()

function transition_bars() {
    var par = document.getElementById("timerBar");
    var a = par.childNodes[0];
    var b = par.childNodes[1];
   // a.style.transform = "translateX("+ Math.floor(len/4) +"px) scaleX(" + Math.floor(len/2) + ")";
   b.style.transform = "scaleX(0.0001)";
   // a.style.width = "50%";
   // b.style.width = "50%";
    return true;
} // end function transition_bars()


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