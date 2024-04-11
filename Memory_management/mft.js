
var noOfPartitions = 0;
var memsize;
var currProcessId = 0;
var partitionOccupied = [];
var partition_size = [];
var partition_process_id = [];
var ttmsize;
var total_mem_size = 0;

//Variables Defining Canvas
var xstart = 10
var ystart = 10
var canvasWidth = 150
var canvasHeight = 500

//Partition Canvas
var partitionStart=[]
var partitionEnd=[]

//Ready Input Queue
var input_queue_process_size= []
var input_queue_process_id= []
var input_queue_size = 0

//Calculating Fragmentation
var internalFragments=0;
var externalFragments=0;
var processMap = new Map();

$(document).ready(function () {
  $("#noOfPartitionsBtn").click(function () {
    noOfPartitions = Number($("#noOfPartitions").val());
    memsize = Number($("#MemorySize").val());
    processController();
  });
});


function processController() {
  var htmlText =
    `
  <h2 class = "mt-5"> Process Controller </h2>
  <button type="submit" class="btn btn-primary" id="addProcessButton">Add process</button>
  <button type="submit" class="btn btn-primary" id="endProcessButton">End process</button>
  `;
  $("#processControllerBtns").html(htmlText);
  var htmlText =
    `<h3>RAM</h3>
  <canvas id="myCanvas" width="170" height="520" style="border:2px solid red;"></canvas>
  `;
  $("#canvas").html(htmlText);
  drawMemory();
  $(document).ready(function () {
    $("#addProcessButton").click(function () {
      addProcessSize();
    });
    $("#endProcessButton").click(function () {
      endProcessId();
    });
  });
}

function addProcessSize() {
  var htmlText =
    `
  <div class="form-group">
      <label>Enter the Size of process to be added: </label>
      <input type="text" class="form-control" id="processSize" placeholder="Enter size of process to be added">      
  </div>
  <button type="submit" class="btn btn-primary mt-3" id="add-btn">Add</button>
  `;
  $("#processDetailsForm").html(htmlText);
  $(document).ready(function () {
    $("#add-btn").click(function () {
      var process_size = Number($("#processSize").val());
      currProcessId += 1;
      $("#processSize").val("");
      addProcess(process_size, currProcessId, 0);
    });
  });
}

function addProcess(process_size, currProcessId, fromQ) {
  var i;
  var found = 0;
  for (i = 0; i < noOfPartitions; i++) {
    if (partitionOccupied[i] == 0 && found == 0) {
      if (process_size <= partition_size[i]) {
        //Indicating the it is Occupied
        partitionOccupied[i] = 1;
        partition_process_id[i] = currProcessId;
        found = 1;
        processMap.set(currProcessId,process_size)
        drawProcess(process_size, currProcessId, i);
        internalFragments+=partition_size[i]-process_size
        externalFragments-=partition_size[i]
      }
    }
  }
  if (found == 0 && fromQ == 0) {
    alert('New process could not be added. Process added to Input Queue');
    addToQueue(process_size, currProcessId);
  }
  if (found == 1 && fromQ == 1) {
    removeFromQueue(currProcessId);
    alert('Process ' + currProcessId + ' of size ' + process_size + ' added to memory.');
  }
  drawInputQTable();
  drawFragmentations();
}


function endProcessId() {
  var htmlText =
    `
  <div class="form-group">
      <label>Id of process to be removed: </label>
      <input type="text" class="form-control" id="endProcessId" placeholder="Enter id of process to be removed">      
  </div>
  <button type="submit" class="btn btn-primary mt-3" id="rem-btn">End</button>
  `;
  $("#processDetailsForm").html(htmlText);
  $(document).ready(function () {
    $("#rem-btn").click(function () {
      var process_id = Number($("#endProcessId").val());
      $("#endProcessId").val("");
      endProcess(process_id);
    });
  });
}

function endProcess(process_id) {
  var i;
  var found = 0;
  for (i = 0; i < noOfPartitions; i++) {
    if (partition_process_id[i] == process_id && found == 0) {

      //Deallocating the Process Making Occupied as 0
      partitionOccupied[i] = 0;
      partition_process_id[i] = -1;
      internalFragments-=(partition_size[i]-processMap.get(process_id))
      externalFragments+=(partition_size[i])
      processMap.delete(process_id)
      found = 1;
      var ctx = document.getElementById("myCanvas").getContext("2d");
      ctx.beginPath();
      ctx.rect(xstart, partitionStart[i], canvasWidth, partition_size[i] * (500 / total_mem_size));
      ctx.fillStyle = "white";
      ctx.fill();

      ctx.rect(xstart, partitionStart[i], canvasWidth, partition_size[i] * (500 / total_mem_size))
      ctx.stroke();
      break;
    }
  }
  if (found == 1) {
    var i;
    for (i = 0; i < input_queue_size; i++) {
      addProcess(input_queue_process_size[i], input_queue_process_id[i], 1);
    }
  }
  drawInputQTable();
  drawFragmentations();
  //drawLegend();
}

//Drawing the Main Memory Partitions

function drawMemory() {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#121212";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    ttmsize = memsize;
    total_mem_size = memsize;
    var bar_height = canvasHeight / noOfPartitions;
  
    for (var i = 0; i < noOfPartitions; i++) {
      partition_size[i] = Math.floor(Math.random() * (memsize / 2)) + (memsize / 4);
      ttmsize -= partition_size[i];
      partition_process_id[i] = -1;
  
      partitionOccupied[i] = 0;
      partitionStart[i] = ystart + i * bar_height;
      partitionEnd[i] = partitionStart[i] + bar_height;
  
      ctx.fillStyle = "#ffffff"; // Set the fill color to white
      ctx.fillRect(xstart, partitionStart[i], canvasWidth, bar_height);
      ctx.strokeStyle = "#000000";
      ctx.strokeRect(xstart, partitionStart[i], canvasWidth, bar_height);
    }
  
    var htmlText = `<h4>Memory Map</h4>`;
    for (var i = 0; i < noOfPartitions; i++) {
      htmlText += `<div>Partition ${i + 1}: ${partition_size[i]} KB</div>`;
    }
    $("#legend").html(htmlText);
  
    externalFragments = ttmsize;
    drawFragmentations();
    drawInputQTable();
  }

//Draw the Process

function drawProcess(process_size, currProcessId, index) {
  var ctx = document.getElementById("myCanvas").getContext("2d");

  ctx.beginPath();
  ctx.rect(xstart+1, partitionStart[index]+1, canvasWidth-2, partition_size[index] * (500 / total_mem_size)-2);
  ctx.fillStyle = "#FEFF86";
  ctx.fill();

  ctx.beginPath();
  ctx.rect(xstart+1, partitionStart[index]+1, canvasWidth-2, process_size * (500 / total_mem_size)-2);
  ctx.fillStyle = "#B0DAFF";
  ctx.fill();

  ctx.font =  "20px Arial bold";
  ctx.fillStyle = "#FF55BB";
  ctx.fillText("P-" + String(currProcessId), canvasWidth / 2, partitionStart[index] + process_size * (500 / total_mem_size) / 2);
}



function addToQueue(process_size, process_id) {
  input_queue_size += 1;
  input_queue_process_id[input_queue_size - 1] = process_id;
  input_queue_process_size[input_queue_size - 1] = process_size;
}

function removeFromQueue(process_id) {
  var i;
  for (i = 0; i < input_queue_size; i++) {
    if (input_queue_process_id[i] == process_id) {
      for (j = i + 1; j < input_queue_size; j++) {
        //Shifting After Removal
        input_queue_process_id[j - 1] = input_queue_process_id[j];
        input_queue_process_size[j - 1] = input_queue_process_size[j];
      }
    }
  }
  input_queue_size -= 1;
}

function drawInputQTable() {
  var htmlText =
    `
  <table class='table table-bordered border-primary'>
  <h2> Input Queue </h2>
  <tr>
      <th>Process Id</th>
  `;
  for (var i = 0; i < input_queue_size; i++) {
    htmlText +=
      `
      <td>` + input_queue_process_id[i] + `</td>
      `;
  }

  htmlText +=
    `
  <tr>
      <th>Process Size</th>
  `;
  for (var i = 0; i < input_queue_size; i++) {
    htmlText +=
      `
      <td>` + input_queue_process_size[i] + `</td>
      `;
  }

  htmlText +=
    `
  </tr>
  </table>
  `;
  $("#input-q-table").html(htmlText);
}

function drawInputQTable() {
  var htmlText =
    `
  <table class='table table-bordered border-primary'>
  <h2> Input Queue </h2>
  <tr>
      <th>Process Id</th>
  `;
  for (var i = 0; i < input_queue_size; i++) {
    htmlText +=
      `
      <td>` + input_queue_process_id[i] + `</td>
      `;
  }

  htmlText +=
    `
  <tr>
      <th>Process Size</th>
  `;
  for (var i = 0; i < input_queue_size; i++) {
    htmlText +=
      `
      <td>` + input_queue_process_size[i] + `</td>
      `;
  }

  htmlText +=
    `
  </tr>
  </table>
  `;
  $("#input-q-table").html(htmlText);
}

function drawFragmentations() {
  var htmlText =
    `
  <table class='table table-bordered border-primary'>
  <h2>Fragmentation</h2>
  <tr>
      <th>Internal Fragemntation</th>
  `;
  htmlText+=
      `
      <td>` + internalFragments + `</td>`
  htmlText +=
    `
  <tr>
      <th>External Fragmentation</th>
  `;

  htmlText+=
    `<td>` + externalFragments + `</td>
      `; 

  htmlText +=
    `
  </tr>
  </table>
  `;
  $("#fragmentation").html(htmlText);
}


// function drawLegend(){
//   var htmlText = '<canvas id="l" width="200" height="200"></canvas>'
//   $("#legend").html(htmlText);
//   helper();
// }
// function helper() {
//   var divElement = $("#legend");

//   var ctx = document.getElementById("l").getContext("2d");
//   ctx.beginPath();
//   ctx.rect(10, 10, 40, 40);
//   ctx.fillStyle = "#B0DAFF";
//   ctx.fill();

//   ctx.beginPath();
//   ctx.rect(10, 70, 40, 40);
//   ctx.fillStyle = "#FEFF86";
//   ctx.fill();    

//   ctx.font =  "14px Arial bold";
//   ctx.fillStyle = "#FF55BB";
//   ctx.fillText("Process Used Memory",70,20);

//   ctx.font =  "14px Arial bold";
//   ctx.fillStyle = "#FF55BB";
//   ctx.fillText("Process Unused Memory",70,80);
// }