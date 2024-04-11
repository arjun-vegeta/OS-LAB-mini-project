// Inner class to store lower and upper bounds of the allocated memory
class Pair {
    constructor(a, b) {
        this.lb = a;
        this.ub = b;
    }
}

let size;
let arr;
let numProcesses;
let processSizes = [];

function inputProcessSizes() {
    size = parseInt(document.getElementById('memorySize').value);
    numProcesses = parseInt(document.getElementById('numProcesses').value);

    let inputSection = document.getElementById('processInput');
    inputSection.innerHTML = "<h2>Enter Process Sizes</h2>";

    for (let i = 0; i < numProcesses; i++) {
        inputSection.innerHTML += `<label for="processSize${i}">Process ${i + 1} Size:</label>`;
        inputSection.innerHTML += `<input type="number" id="processSize${i}">`;
    }

    inputSection.innerHTML += `<button onclick="allocateMemory()">Allocate Memory</button>`;
    inputSection.style.display = 'block';
}

function allocateMemory() {
    processSizes = [];

    for (let i = 0; i < numProcesses; i++) {
        let processSize = parseInt(document.getElementById(`processSize${i}`).value);
        processSizes.push(processSize);
    }

    const n = processSizes.length;
    Buddy(size);

    for (let i = 0; i < n; i++) {
        allocate(processSizes[i]);
    }
}

function Buddy(s) {
    size = s;
    // Gives us all possible powers of 2
    let x = Math.ceil(Math.log(s) / Math.log(2));
    // One extra element is added to simplify arithmetic calculations
    arr = new Array(x + 1);
    for (let i = 0; i <= x; i++)
        arr[i] = [];

    // Initially, only the largest block is free and hence is on the free list
    arr[x].push(new Pair(0, size - 1));
}

function allocate(s) {
    // Calculate which free list to search to get the smallest block large enough to fit the request
    let x = Math.floor(Math.ceil(Math.log(s) / Math.log(2)));
    let i;
    let temp = null;

    // We already have such a block
    if (arr[x].length > 0) {
        // Remove from free list as it will be allocated now
        temp = arr[x].shift();
        displayResult(`Memory from ${temp.lb} to ${temp.ub} allocated`);
        return;
    }

    // If not, search for a larger block
    for (i = x + 1; i < arr.length; i++) {
        if (arr[i].length == 0)
            continue;

        // Found a larger block, so break
        break;
    }

    // This would be true if no such block was found and array was exhausted
    if (i == arr.length) {
        displayResult(`Sorry, failed to allocate memory`);
        return;
    }

    // Remove the first block
    temp = arr[i].shift(0);
    i--;

    // Traverse down the list
    for (; i >= x; i--) {
        // Divide the block in two halves
        // lower index to half-1
        let newPair = new Pair(temp.lb, temp.lb + Math.floor((temp.ub - temp.lb) / 2));
        // half to upper index
        let newPair2 = new Pair(temp.lb + Math.floor((temp.ub - temp.lb + 1) / 2), temp.ub);

        // Add them to next list which is tracking blocks of smaller size
        arr[i].push(newPair);
        arr[i].push(newPair2);

        // Remove a block to continue the downward pass
        temp = arr[i].shift(0);
    }

    // Finally inform the user of the allocated location in memory
    displayResult(`Memory from ${temp.lb} to ${temp.ub} allocated`);
}

function displayResult(message) {
    let resultHtml = document.getElementById('result').innerHTML;
    resultHtml += `${message}<br>`;
    document.getElementById('result').innerHTML = resultHtml;
    document.getElementById('result').style.display = 'block';
}