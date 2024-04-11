let numBlocks;
let numProcesses;
let blockSizes = [];
let processSizes = [];

function inputBlockAndProcessSizes() {
    numBlocks = parseInt(document.getElementById('numBlocks').value);
    numProcesses = parseInt(document.getElementById('numProcesses').value);

    let inputSection = document.getElementById('blockProcessInput');
    inputSection.innerHTML = "<h2>Enter Block and Process Sizes</h2>";

    for (let i = 0; i < numBlocks; i++) {
        inputSection.innerHTML += `<label for="blockSize${i}">Block ${i + 1} Size:</label>`;
        inputSection.innerHTML += `<input type="number" id="blockSize${i}">`;
    }

    for (let i = 0; i < numProcesses; i++) {
        inputSection.innerHTML += `<label for="processSize${i}">Process ${i + 1} Size:</label>`;
        inputSection.innerHTML += `<input type="number" id="processSize${i}">`;
    }

    inputSection.innerHTML += `<button onclick="allocateMemory()">Allocate Memory</button>`;
    inputSection.style.display = 'block';
}

function allocateMemory() {
    blockSizes = [];
    processSizes = [];

    for (let i = 0; i < numBlocks; i++) {
        let blockSize = parseInt(document.getElementById(`blockSize${i}`).value);
        blockSizes.push(blockSize);
    }

    for (let i = 0; i < numProcesses; i++) {
        let processSize = parseInt(document.getElementById(`processSize${i}`).value);
        processSizes.push(processSize);
    }

    const m = blockSizes.length;
    const n = processSizes.length;

    bestFit(blockSizes, m, processSizes, n);
}

function bestFit(blockSize, m, processSize, n) {
    // Stores block id of the block allocated to a process
    let allocation = new Array(n).fill(-1);

    // Pick each process and find suitable blocks according to its size and assign to it
    for (let i = 0; i < n; i++) {
        // Find the best fit block for current process
        let bestIdx = -1;

        for (let j = 0; j < m; j++) {
            if (blockSize[j] >= processSize[i]) {
                if (bestIdx === -1) {
                    bestIdx = j;
                } else if (blockSize[bestIdx] > blockSize[j]) {
                    bestIdx = j;
                }
            }
        }

        // If we could find a block for current process
        if (bestIdx !== -1) {
            // Allocate block j to p[i] process
            allocation[i] = bestIdx;
            // Reduce available memory in this block.
            blockSize[bestIdx] -= processSize[i];
        }
    }

    let resultHtml = "<h2>Allocation Result:</h2><table>";
    resultHtml += "<tr><th>Process No.</th><th>Process Size</th><th>Block No.</th></tr>";

    for (let i = 0; i < n; i++) {
        resultHtml += "<tr>";
        if (allocation[i] > -1) {
            resultHtml += `<td>${i + 1}</td><td>${processSize[i]}</td><td>${allocation[i] + 1}</td>`;
        } else {
            resultHtml += `<td>${i + 1}</td><td>${processSize[i]}</td><td>Not Allocated</td>`;
        }
        resultHtml += "</tr>";
    }

    resultHtml += "</table>";
    document.getElementById('result').innerHTML = resultHtml;
    document.getElementById('result').style.display = 'block';
}