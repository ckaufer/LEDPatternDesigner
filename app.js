//Layout Variables
var container;
var blank;
var mainBoard;
var bin;
var binBoards;
var timeline;
var cursor;
var sceneCursor;
var playButton;
var editButton;
var addButton;
var deleteButton;
var duplicateButton;
var properties;

function setupLayout() {
	 container = Rect(1920, 1080, 0, 0, "blue", "container");
	 blank = "&nbsp;";
	 mainBoard = Board(2, 0, 0, 4, "green", "MainBoard");
	 bin = Rect(400, 400, 450, 0, "black", "bin");
	 binBoards = [];
	 timeline = Rect(900, 300, 0, 500, "black", "timeline");
	// sceneTimeline = new Rect(900, 300, 0, 500, "black", "sceneTimeline");
	 cursor = new Rect(10, 200, 0, 60, "red", "cursor");
	 sceneCursor = new Rect(10, 200, 0, 60, "red", "sceneCursor");
	 playButton = new Button(75, 50, 25, 425, "play()", "Play");
	 editButton = new Button(75, 50, 100, 425, "edit()", "Edit");
	 addButton = new Button(125, 50, 175, 425, "addNewFrameToScene()", "Add Blank Frame");
	 deleteButton = new Button(150, 50, 325, 425, "deleteCurrentFrame()", "Delete Current Frame");
	 duplicateButton = new Button(200, 50, 500, 425, "duplicateFrameAtEnd()", "Duplicate Current Frame");
	 properties = new Properties(450, 0, 400, 400);
	//var timelineSwitch = new Button(75, 50, 25, 450, "swapTimeline()", "View Sequence");
}
function setupEventListeners() {
dragAndDrop();
  $(function() {
    $('.mainLed' ).draggable({
	containment: "parent" ,
	drag: function(event) {
		
		changeLedRatios();
		$(this).css("cursor","move");
	},
	
	});
	$(".draggable").hover(function() {
		$(this).css( 'cursor', 'pointer' );
	});

	

    $( document ).on( "click", ".clickable", function(event) {
      if($(this).parent().attr("name") == "slot") {
    var n = $(this).attr("name");
        console.log(n);
    var nn = n.replace("frameBoard", "");
    var s = $(this).parent().attr("id").replace("slot", "");
    setFrame(nn);
setSelector(s);
console.log(s);
    } else if($(this).parent().attr("name") == "sceneSlot") {
          var n = $(this).attr("name");
    var nn = n.replace("sceneBlock", "");
    var s = $(this).parent().attr("id").replace("sceneSlot", "");
      console.log(s);
    setScene(parseInt(nn));
      setSceneSelector(nn);
      swapTimeline();
//setSelector(s);

    }
      changeLedRatios();
});
    $('[name="sceneCursor"]').draggable({axis:"x", drag: function() {
      checkCursorPosition();
    }});
    
    	$('.droppable' ).draggable({
		revert: true,
		drag: function(event) {
			$(this).css("cursor","move");
          changeLedRatios();
		}
	});
    
      		    $( ".droppable" ).droppable({
                  
      drop: function( event, ui ) {
        if($(this).attr("name") == "slot") {
        var startId = parseInt($(this).attr("id").replace("slot",""));
        var endId = parseInt($(ui.draggable).attr("id").replace("slot",""));
		console.log(endId);
	    console.log(startId);	
        moveFrame(startId, endId);
        } 
      }
    });
	
		for(var k = 0; k < 13; k++) {
		var t = k;
	    $(mainBoard.children[k]).bind("click", {val: k}, function(e) {
          
		 if( frames[currentFrameId].ledStates[e.data.val] == 1) {
		 frames[currentFrameId].ledStates[e.data.val] = 0;
		 } else {
		 frames[currentFrameId].ledStates[e.data.val] = 1;
		 }
		 updateLedStates();
		 
		 updateTimeline();
         changeLedRatios();
		});
	}

  });
}

function changeLeds(num) {
  colors[num] = document.getElementsByClassName("ledColorInput")[num].value;
  updateLedStates();
}

function updateLedProperties() {
  for(var i = 0; i < 13; i++) {
    mainBoard.children[i].style.background=colors[i];
  }
}



//Layout functions
function Rect(width, height, x, y, color, id) {
    this.height = height;
    this.width = width;
    this.x = x;
    this.y = y;
    this.color = color;
    this.id = id;
	this.getX = function() {
	return this.x;
	}
    var tDiv = nDiv();
	tDiv.setAttribute("width",width);
	tDiv.setAttribute("height",height);
	tDiv.setAttribute("x",x);
	tDiv.setAttribute("y",y);
    tDiv.innerHTML = "&nbsp;";
    tDiv.setAttribute("name", id);
    tDiv.style.width = tDiv.getAttribute("width") + "px";
    tDiv.style.height = tDiv.getAttribute("height") + "px";
    tDiv.style.background = color;
    tDiv.style.position = "absolute";
    tDiv.style.left = tDiv.getAttribute("x") + "px";
    tDiv.style.top = tDiv.getAttribute("y") + "px";
	//disableSelection(tDiv);
    return tDiv;
}

function Button(width, height, x, y, handler, id) {
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	this.handler = handler;
	this.id = id;
	var t = new Rect(width, height, x, y, "", id);
	console.log(handler);
	$(t).html('<button type="button" class="buttonObj" onclick="'+handler+'" id="'+id+'_button">'+id+'</button>');
	add(container, t);
	return t;
}

function Circle(radius, x, y, color, id) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.color = color;
    this.id = id;

    var tDiv = new Rect(radius * 2, radius * 2, x, y, color, id);
	tDiv.style.background="";
	//tDiv.style.border = "5px solid black";
	tDiv.style.borderRadius = "50%";
	return tDiv;

}

function emptySlot(width, height, x, y) {
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	var k = new Rect(width, height, x, y, "gray", "slot");
    var addNew = new nDiv();

	add(k, addNew);
    k.setAttribute("class","droppable");
	k.setAttribute("frame", "none");
    k.style.background = "gray";


	return k;
}
function Board(frameNum, x, y, scale, color, id) {
    this.frameNum = frameNum;
    this.x = x;
    this.y = y;
    this.scale = scale;
    this.color = color;
    this.id = id;

    var tDiv = new Rect(100 * scale, 100 * scale, x, y, color, "frameBoard" + frameNum);
 
      setupLeds(tDiv, "m");
   
    
    updateBinLeds(tDiv, frameNum);
    return tDiv;
}

function Properties(x, y, width, height) {
  var t = new Rect(width, height, x, y, "black", "properties");
  var text = document.createElement("p");
  var delayEdit = document.createElement("div");
  delayEdit.innerHTML="<input type='text' onchange='updateDelay(this.value)' value='"+delayVal+"'></input>";
  text.innerHTML="LEDs:";
  text.setAttribute("class","mainText");
  var ledList = document.createElement("ul");
  ledList.setAttribute("class","mainText");
  for(var i = 0; i < 13; i++) {
    var led = document.createElement("li");
    led.innerHTML="led[" + (i + 3) + "] color: <input type='text' value='"+colors[i]+"' class='ledColorInput color' onchange='changeLeds("+i+")'></input>";
    ledList.appendChild(led);
  }
  add(t, delayEdit);
  add(t, text);
  add(t, ledList);
  
  add(container, t);
  return t;
}

function sceneBlock (sceneNum, x, y) { 
   var back = Rect(10 + 110 * (scenes[sceneNum].max), 110, x, y, "black", "sceneBlock"+sceneNum);
  back.style.border="2px solid red";
  back.style.position="relative";
  back.style.overflow="hidden";
   for (var k=0; k < scenes[sceneNum].max; k++) {
    
     var holder = new Board(scenes[sceneNum].frameIds[k], 5 + 110 * k, 5, 1,  "green"); 
    add(back, holder);  
    
   }
   add (container, back); 
  changeLedRatios();
    return back;
}


function updateBinLeds(tDiv, frameNum) {
    for (var j = 0; j < 13; j++) {
        if (frames[frameNum].ledStates[j] == 1) {
            setColor(tDiv.children[j], colors[j]);
        } else {
            setColor(tDiv.children[j], offColor);
        }
    }

}

function drawTimelineSlots() {
    for (var j = 0; j < 25; j++) {
		slots[j] = new emptySlot(100, 100, 110 * j, 100);
slots[j].style.display="none";
  slots[j].setAttribute("id", "slot"+j);
			slots[j].style.background = "";
      if(slots[j].innerHTML == "") {
        console.log("lol");
        slots[j].style.display = "none";
      }
        timeline.style.overflow = "scroll";
        add(timeline, slots[j]);
    }
    updateTimeline();
	add(timeline, cursor);
    add(container, timeline);
	
}

function drawScenesTimeline() {
      for (var j = 0; j < 25; j++) {
		sceneSlots[j] = new emptySlot(100, 100, 210 * j, 100);
sceneSlots[j].style.display="none";
  sceneSlots[j].setAttribute("id", "sceneSlot"+j);
        sceneSlots[j].setAttribute("name", "sceneSlot");
			sceneSlots[j].style.background = "";
      if(sceneSlots[j].innerHTML == "") {
        console.log("lol");
        sceneSlots[j].style.display = "none";
      }
        sceneTimeline.style.overflow = "scroll";
        add(sceneTimeline, sceneSlots[j]);
    }
    updateSceneTimeline();
	add(sceneTimeline, sceneCursor);
    add(container, sceneTimeline);
}

function updateTimelineSlot(slotNum) {
        var kB = new Board(scenes[currentSceneId].frameIds[slotNum], 0, 0, 1, "green");
        kB.setAttribute("class", "clickable");
		slots[slotNum].appendChild(kB); 
}
function clearTimeline() {
		for(var k = 0; k < slots.length; k++) {
			slots[k].innerHTML = "";
		}
}
function updateTimeline() {
    clearTimeline();
    for (var t = 0; t < scenes[currentSceneId].max; t++) {
		updateTimelineSlot(t);
   slots[t].style.display="block";
    }
  changeLedRatios();
  updateBinLeds(mainBoard, currentFrameId);
   setFrame(scenes[currentSceneId].frameIds[getSelector()]);
  updateLedStates();
}

function updateSceneTimelineSlot(slotNum) {

        var kB = sceneBlock(sequences[currentSequenceId].sceneIds[slotNum], 0,0);
        var widthFactor = kB.style.width.replace("px","") * 1;
  
  console.log(curX);
  sceneSlots[slotNum].style.left = curX + "px";
  
  sceneSlots[slotNum].style.width = widthFactor + "px";
        kB.setAttribute("class", "clickable sceneBlock");
		sceneSlots[slotNum].appendChild(kB); 
  curX += widthFactor;
}
function updateSceneTimeline() {
      clearSceneTimeline();
    for (var t = 0; t < sequences[currentSequenceId].max; t++) {
		updateSceneTimelineSlot(t);
        sceneSlots[t].style.display="block";
    }
  changeLedRatios();
  updateBinLeds(mainBoard, currentFrameId);
  setFrame(scenes[currentSceneId].frameIds[getSelector()]);
  updateLedStates();
}

function clearSceneTimeline() {
  curX = 0;
  		for(var k = 0; k < sceneSlots.length; k++) {
			sceneSlots[k].innerHTML = "";
		}
}
function drawBinBoards() { 
    
    for (var j = 0; j < binFramesMax; j++) {
        binBoards[j] = new Board(j, 110 * j, 25, 1, "green");
        binBoards[j].style.position = "block";
		var t = new Rect(100, 100, 0, 0, "");
        t.setAttribute("class", "clickable draggable");
		binBoards[j].appendChild(t);
		console.log(t.innerHTML);
        add(bin, binBoards[j]);
		
    }
    add(container, bin);
	bin.style.zIndex = "2";
}

function setColor(obj, color) {
    obj.style.backgroundColor = color;
}

function nDiv() {
    return document.createElement("div");
}
function isShow(obj) {
  if(obj.style.display=="block") {
    return true;
  } else {
    return false;
  }
}
function isHide(obj) {
    if(obj.style.display=="none") {
    return true;
  } else {
    return false;
  }
}
function show(obj) {
  obj.style.display="block";
}
function hide(obj) {
  obj.style.display = "none";
}
function add(holder, object) {
    holder.appendChild(object);
}

function setX(obj, val) {
   obj.style.left = val + "px";
}



function getX(obj) {
   return obj.style.left;
}

function getCookie(cname)
{
var name = cname + "=";
var ca = document.cookie.split(';');
for(var i=0; i<ca.length; i++) 
  {
  var c = ca[i].trim();
  if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
return "";
}

var overlaps = (function () {
    function getPositions( elem ) {
        var pos, width, height;
        pos = $( elem ).position();
        width = $( elem ).width();
        height = $( elem ).height();
        return [ [ pos.left, pos.left + width ], [ pos.top, pos.top + height ] ];
    }

    function comparePositions( p1, p2 ) {
        var r1, r2;
        r1 = p1[0] < p2[0] ? p1 : p2;
        r2 = p1[0] < p2[0] ? p2 : p1;
        return r1[1] > r2[0] || r1[0] === r2[0];
    }

    return function ( a, b ) {
        var pos1 = getPositions( a ),
            pos2 = getPositions( b );
        return comparePositions( pos1[0], pos2[0] ) && comparePositions( pos1[1], pos2[1] );
    };
})();
