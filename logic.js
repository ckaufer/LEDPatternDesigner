function Frame(ledStates) {
    this.ledStates = ledStates;
}

function Scene(frameIds, max, selector) {
    this.frameIds = frameIds;
    this.max = max;
    this.selector = selector;
}

function Sequence(sceneIds, max, selector) {
    this.sceneIds = sceneIds;
this.max=max;
this.selector=selector;
}

function Led(id, x, y, color, ledState) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.color = color;
	this.ledState = ledState;
}

var colors = ["blue","blue","blue","blue","blue","blue","white","white","white","white","white","white","blue"];

var x = [200,70,70,200,329,329,243.8,156.3,112.5,156.3,243.8,287.5,200];
var y = [50,125,275,350,275,125,124,124,200,275.8,275.8,200,200];

var divLeds = [];
var leds = [];
var frames = [];
var scenes = [];
var sequences = [];
var slots = [];
var sceneSlots = [];

var ledsMax = 13;
var ledRadius = 15;
var currentFrameId = 0;
var maxFrames = 100;
var maxScenes = 50;
var binFramesMax = 5;
var binScenesMax = 5;
var currentSceneId = 1;
var currentSequenceId = 0;
var delayVal = 300;
var delayStep = 10;
var delayMax = 1000;
var curIdx = 0;
var curTime = 0;
var curX = 0;

var offColor = "gray";
var timelineMode = "frames";
var mode = "EDIT";
var binMode = "scenes"; 
var sceneMode = true;


frames[0] = new Frame([1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0]);
frames[1] = new Frame([0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1]);
frames[2] = new Frame([0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0]);

for(var k = 3; k < maxFrames; k++) {
	frames[k] = new Frame([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
}

scenes[0] = new Scene([0, 1, 2, 3, 4], 4, 0);
scenes[1] = new Scene([2, 0, 1, 5, 6, 7], 3, 0);
scenes[2] = new Scene([0, 1, 2, 8, 9, 10], 2, 0);
for(var k = 4; k < maxScenes; k++) {
	scenes[k] = new Scene([0], 1, 0);
}
sequences[0] = new Sequence([0, 1], 2, 0);

for(var i = 0; i <= ledsMax; i++) {
	leds[i] = new Led(i + 2, x[i], y[i], colors[i], frames[currentFrameId].ledStates[i]);
}	



function main() {
	setupLayout();
    add(container, mainBoard);
    add(document.body, container);
    drawTimelineSlots();
    setInterval(tickStart, 1);
	changeLedRatios();
	setupEventListeners();
	edit();
    alert("added");
}

function dragAndDrop(){}

function checkCursorPosition() {
  for(var i = 0; i < 20; i++) {
  if(overlaps(sceneCursor,$('#slot' + i)))
    {
      setFrame(scenes[currentSceneId].frameIds[i]);
    }
  }
}

function tickStart() {
  if (mode == "PLAY") {
    updateLedStates();
    //console.log("tickStart() reached");
    if (curTime < delayVal) {
        curTime += delayStep;

        //console.log("curTime is " + curTime);
        return;
    }

    
        if (curIdx < (scenes[currentSceneId].max - 1)) {
            curIdx += 1;

        } else {
            //nextScene();
            curIdx = 0;
            
        }
    setSelector (curIdx);
    curTime = 0;
  } else {
    return;
  }
}

function encodeFrame(frameNum) {
  var temp = "";
  for(var i = 0; i < frames[frameNum].ledStates.length; i++) {
    if(frames[frameNum].ledStates[i] == 0) {
      temp += 0; 
    } else {
      temp += 1;
    }
  }
  return temp;
}

function nextScene() {
  if(sequences[currentSequenceId].selector < sequences[currentSequenceId].max - 1) {
   sequences[currentSequenceId].selector++;
  } else {
    sequences[currentSequenceId].selector = 0;
  }
setScene(sequences[currentSequenceId].sceneIds[sequences[currentSequenceId].selector]);
updateSceneCursor();
}

function setSelector(num) {
   scenes [currentSceneId].selector = num;
  setFrame[scenes[currentSceneId].frameIds[getSelector]];
   updateSceneFrames();
  updateBinLeds(mainBoard, currentFrameId);
}

function setSceneSelector(num) {
   sequences [currentSequenceId].selector = num;
  setScene[sequences[currentSequenceId].sceneIds[sequences[currentSequenceId].selector]];
  updateBinLeds(mainBoard, currentFrameId);
  updateSceneCursor();
}

function updateSceneFrames() {
    currentFrameId = scenes[currentSceneId].frameIds[scenes[currentSceneId].selector];
    updateCursor();

}

function updateLedStates() {
    for (var i = 0; i < 13; i++) {
        if (frames[currentFrameId].ledStates[i] == 1) {
            ledOn(i + 2);
        } else {
            ledOff(i + 2);
        }
    }
}
function addNewFrame() {
   binFramesMax++;
   changeLedRatios();
}
var t;
function addNewFrameToScene() {
addNewFrame();
frames[binFramesMax].ledStates = [0,0,0,0,0,0,0,0,0,0,0,0,0];
scenes[currentSceneId].max++;
scenes[currentSceneId].frameIds[scenes[currentSceneId].max-1] = binFramesMax;
var kB = new Board(scenes[currentSceneId].frameIds[scenes[currentSceneId].max-1], 0, 0, 1, "green");
kB.setAttribute("class", "clickable");
slots[scenes[currentSceneId].max-1].appendChild(kB); 
  changeLedRatios();
  setSelector(scenes[currentSceneId].max - 1);
  updateTimeline();
}

function addNewScene() {
   binScenesMax++;
   //changeLedRatios();
}

function addNewSceneToSequence() {
addNewScene();
sequences[currentSequenceId].max++;
sequences[currentSequenceId].sceneIds[sequences[currentSequenceId].max-1] = binScenesMax;
  updateSceneTimeline();
}

function getSelector() {
  
  return parseInt(scenes[currentSceneId].selector);
}
function deleteFrame(seqNum) {
  scenes[currentSceneId].max -= 1;
  for(var k = seqNum; k < scenes[currentSceneId].max; k++) {
    scenes[currentSceneId].frameIds[k] = scenes[currentSceneId].frameIds[k + 1];
  }

    if(scenes[currentSceneId].selector == (scenes[currentSceneId].max)) {
  setSelector(scenes[currentSceneId].selector - 1);
    }
  updateTimeline();
  
}

function deleteCurrentFrame() {
  
  deleteFrame(getSelector());
}

function duplicateFrame(seqNum) {
  addNewFrameToScene();
  var t = scenes[currentSceneId].frameIds[seqNum];
  //moveFrame(scenes[currentSceneId].max, scenes[currentSceneId].frameIds[seqNum])
  for(var k = seqNum; k <= scenes[currentSceneId].max; k++) {
    scenes[currentSceneId].frameIds[k] = scenes[currentSceneId].frameIds[k + 1];
  }
  scenes[currentSceneId].frameIds[2] = scenes[currentSceneId].frameIds[1];
  //scenes[currentSceneId].frameIds[seqNum] = scenes[currentSceneId].frameIds[scenes[currentSceneId].ma];t;
  updateTimeline();
}

function duplicateFrameAtEnd() {
  var seqNum = getSelector();
  addNewFrameToScene();
  var t = scenes[currentSceneId].frameIds[seqNum];
  frames[binFramesMax].ledStates = frames[scenes[currentSceneId].frameIds[seqNum]].ledStates;
  //scenes[currentSceneId].frameIds[seqNum] = scenes[currentSceneId].frameIds[scenes[currentSceneId].ma];t;
  updateTimeline();
}

function swapFrames(startSeq, endSeq) {
  var s = scenes[currentSceneId].frameIds[startSeq];
  var e = scenes[currentSceneId].frameIds[endSeq]
  scenes[currentSceneId].frameIds[endSeq] = s;
  scenes[currentSceneId].frameIds[startSeq] = e;
  updateTimeline();
}

function moveFrame(startSeq, endSeq) 
{
  var s = scenes[currentSceneId].frameIds[startSeq];
  var e = scenes[currentSceneId].frameIds[endSeq];
  var f = scenes[currentSceneId].frameIds;
  if(startSeq < endSeq) 
  {
    for(var k = startSeq; k <= endSeq; k++)   
      scenes[currentSceneId].frameIds[k] = f[k + 1];
    scenes[currentSceneId].frameIds[endSeq] = s;
  } 
  else 
  {
    for(var k = endSeq; k <= startSeq; k++)
      scenes[currentSceneId].frameIds[k] = f[k + 1];
    scenes[currentSceneId].frameIds[startSeq] = e;
  }
  updateTimeline();

}

function moveScene(startSeq, endSeq) 
{
  var s = sequences[currentSequenceId].sceneIds[startSeq];
  var e = sequences[currentSequenceId].sceneIds[endSeq];
  var f = sequences[currentSequenceId].sceneIds;
  if(startSeq < endSeq) 
  {
    for(var k = startSeq; k <= endSeq; k++)   
      sequences[currentSequenceId].sceneIds[k] = f[k + 1];
    sequences[currentSequenceId].sceneIds[endSeq] = s;
  } 
  else 
  {
    for(var k = endSeq; k <= startSeq; k++)
      sequences[currentSequenceId].sceneIds[k] = f[k + 1];
    sequences[currentSequenceId].sceneIds[startSeq] = e;
  }
  updateSceneTimeline();
}

function insertFrameToScene(fNum, start) {

    for(var i = start; i <= scenes[currentSceneId].max ; i++) {
        scenes[currentSceneId].frameIds[i] = scenes[currentSceneId].framesIds[i - 1];    
    }
    scenes[currentSceneId].frameIds[start] = fNum; 
	
	updateTimeline();
}

function s() {
  return scenes[currentSceneId];
}

function changeLedRatios() {
for(var p = 0; p <= binFramesMax; p++) {
  var d = document.getElementsByName("frameBoard" + p);
       for (var j = 0; j < d.length; j++) {
    for (var k = 0; k < 13; k++) {
            d[j].children[k].style.left = (((mainBoard.children[k].style.left.replace("px","")) *  d[j].style.width.replace("px","") / mainBoard.style.width.replace("px","")) ) + "px";
            //x[k] = (((mainBoard.children[k].style.left.replace("px",""))));
            d[j].children[k].style.top = (((mainBoard.children[k].style.top.replace("px","")) *  d[j].style.width.replace("px","") / mainBoard.style.width.replace("px","")) ) + "px";
			
			d[j].children[k].style.height = (((mainBoard.children[k].style.height.replace("px","")) *  d[j].style.width.replace("px","") / mainBoard.style.width.replace("px","")) ) + "px";
			d[j].children[k].style.width = (((mainBoard.children[k].style.width.replace("px","")) *  d[j].style.width.replace("px","") / mainBoard.style.width.replace("px","")) ) + "px";
            //y[k] = (((mainBoard.children[k].style.top.replace("px","")) *  d[j].style.width.replace("px","")));
			d[j].children[k].style.borderWidth = (((mainBoard.children[k].style.borderWidth.replace("px","")) *  d[j].style.width.replace("px","") / mainBoard.style.width.replace("px","")) ) + "px";
        }
    }

}


	//updateTimeline();
}

function ratio(obj1, obj2, obj1w) {
	return (((obj1.replace("px","")) *  obj2.replace("px","") / obj1w.replace("px","")) ) + "px";
}

function setupLeds(obj, m) {
    for (var i = 0; i < 13; i++) {
        divLeds[i] = Circle(ledRadius, 0, 0, offColor, "led");
		divLeds[i].setAttribute("class", "mainLed");
        divLeds[i].setAttribute("name", "led");
		
        add(obj, divLeds[i]);
    }
	updateLedDivs()
    changeLedRatios();
}

function updateLedDivs() {
	for(var i = 0; i < ledsMax; i++) {
		divLeds[i].style.left = leds[i].x - ledRadius * 1.5 + "px";
		divLeds[i].style.top = leds[i].y - ledRadius * 1.5 + "px";
		divLeds[i].setAttribute("data-color", leds[i].color);
		divLeds[i].setAttribute("data-id", leds[i].id);
		divLeds[i].setAttribute("data-ledState", leds[i].id);
	}	
}

function updateDelay(delay) {
  delayVal=delay;
}
function setFrame(fNum) {
currentFrameId = fNum;
  
}
//Helper Functions
function swapTimeline() {
  if(isShow(timeline)) {
    hide(timeline);
    show(sceneTimeline);
    updateSceneTimeline();
  } else {
    hide(sceneTimeline);
    show(timeline);
  }
}

function ledOn(ledNum) {
     leds[ledNum - 2].color = colors[ledNum - 2];
}

function ledOff(ledNum) {
    leds[ledNum - 2].color = offColor;
}

function setScene(sceneNum) {
  currentSceneId = sceneNum;
  updateTimeline();
}

function saveAll() {
  for(var s = 0; s < scenes.length -1 ; s++) {
    for(var fi = 0; fi < scenes[s].frameIds.length; fi++) {}
    document.cookie = "scenes["+s+"].frameIds["+fi+"] = " + scenes[s].frameIds[fi];
  
  }
}

function loadAll() {
  
}


function updateCursor() {
   setX(cursor, 110 * scenes[currentSceneId].selector);
}

function updateSceneCursor() {
   setX(sceneCursor, 110 * scenes[currentSceneId].selector);
}
function play() {
	mode = "PLAY";
}
function edit() {
	mode = "EDIT";
}

