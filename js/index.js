let counter = -1;
let startStick = 0;
let EndStick = 0;
let movesRecord = [];
document.getElementById("display").innerText =  `Moves: ${counter}` ;
let sticks = document.getElementsByClassName("stick");
let dragPicBlank = document.createElement("img");
let startIndex = 0;
let resetDraggable = () => {
  for (var x of sticks) {
    for (var y = 0; y < x.children.length; y++) {
      if (y === 0) {
        x.children[y].setAttribute("draggable", "true");    
      }
      else {
        x.children[y].setAttribute("draggable", "false");     
      }
    }
  } 
  counter ++;
  document.getElementById("display").innerText =  `Moves: ${counter}` ;
}
let winChecker = () => {
  var stickCount = 0;
  for (var x of sticks) {  
    var winCheckArray = [];
    for (var y = 0; y < x.children.length; y++) {
      winCheckArray.push(x.children[y].id);  
    }
    if (winCheckArray.join("") === "disk1disk2disk3disk4" && startIndex !== stickCount) {
      x.classList.add("winStick");
      document.getElementById("reset").classList.add("winButton");
      document.getElementById("reset-text").classList.add("winText");
      for(var z = 0; z < x.nextElementSibling.children.length; z++) {
        x.nextElementSibling.children[z].classList.add("winStick");
      }
      startIndex = stickCount;
    }
    stickCount++;
  }  
}
resetDraggable();
let startDragDisc = (event) =>{
  event.dataTransfer.setData("text", event.target.id);
  event.dataTransfer.setDragImage(dragPicBlank, 0, 0);
  var startStickEl = event.target.parentElement;
  for (var x = 0; x < sticks.length; x ++) {
    if (sticks[x] === startStickEl) {
      startStick = x;
    }
  }
}
let dragDisc = (event) =>{
}
let dropDisc = (event) => {
  var sourceID = event.dataTransfer.getData("text");
  event.preventDefault();
  if (event.target.classList[0].match(/disk/) !== null) {
    return;
  }

  if (event.target.children.length === 0) {
    for (var x = 0; x < sticks.length; x ++) {
    if (sticks[x] === event.target) {
      endStick = x;
      movesRecord.push({"disk": sourceID,"from": startStick, "to": endStick, "move": counter+1});
      }
    }
    var xCoord = ((event.pageY - event.target.getBoundingClientRect().top)/event.target.getBoundingClientRect().height)*100;
    event.target.appendChild(document.getElementById(sourceID));
    document.getElementById(sourceID).style.position = "absolute";
    var fallingRing = setInterval(()=>{
      document.getElementById(sourceID).style.top = `${xCoord}%`;
      xCoord += 1;
      if (xCoord >= 90) {
        document.getElementById(sourceID).style.position = "relative";
        document.getElementById(sourceID).style.top = "";
        clearInterval(fallingRing);
      }
    }, 10);
    resetDraggable();
    winChecker();
  }
  else {
    for (var x = 0; x < sticks.length; x ++) {
    if (sticks[x] === event.target && sourceID.length > 0) {
      endStick = x;
      movesRecord.push({"disk": sourceID,"from": startStick, "to": endStick, "move":counter+1});
      }
    }
    var sourceIDNum = Number(sourceID[4]);
    var destID = event.target.children[0].id;
    var destIDNum = Number(destID[4]);
    if (sourceIDNum < destIDNum) {
      var xCoord = ((event.pageY - event.target.getBoundingClientRect().top)/event.target.getBoundingClientRect().height)*100;
      event.target.insertBefore(document.getElementById(sourceID), event.target.children[0]);
      document.getElementById(sourceID).style.position = "absolute";
      var xCoordLimit = 90 - (10*(event.target.children.length-1));
      var fallingRing = setInterval(()=>{
        document.getElementById(sourceID).style.top = `${xCoord}%`;
        xCoord += 1;
        if (xCoord >= xCoordLimit) {
          document.getElementById(sourceID).style.position = "relative";
          document.getElementById(sourceID).style.top = "";
          clearInterval(fallingRing);
        }
      }, 10);
      resetDraggable();
      winChecker();
    }  
  }  
}
let dragDiscOver = (event) =>{
  event.preventDefault();
}
document.getElementById("reset").addEventListener("click", event=>{
  counter = -1;
  movesRecord = [];
  resetDraggable();
  sticks[startIndex].appendChild(document.getElementById("disk1"));
  sticks[startIndex].appendChild(document.getElementById("disk2"));
  sticks[startIndex].appendChild(document.getElementById("disk3"));
  sticks[startIndex].appendChild(document.getElementById("disk4"));
  document.getElementById("reset").classList.remove("winButton");
  document.getElementById("reset-text").classList.remove("winText");
  sticks[startIndex].classList.remove("winStick")
  for(var y = 0; y < sticks[startIndex].nextElementSibling.children.length; y++) {
    sticks[startIndex].nextElementSibling.children[y].classList.remove("winStick");
  }
});
document.getElementById("rewind").addEventListener("click", event=>{
  if (movesRecord.length > 0) {
    var movesRecordRewind = movesRecord.reverse();
    var moveIndex = 0
    var rewinding = setInterval(()=>{
      console.log(movesRecordRewind[moveIndex]);
      document.getElementById("display").innerText =  `Moves: ${movesRecordRewind[moveIndex].move-1}` ;
      sticks[movesRecordRewind[moveIndex].from].insertBefore(document.getElementById(movesRecordRewind[moveIndex].disk),sticks[movesRecordRewind[moveIndex].from].children[0]);
      moveIndex++;
      if (moveIndex > movesRecordRewind.length-1) { 
        clearInterval(rewinding);
        document.getElementById("reset").click();
      }
    },500);
  }
});  
