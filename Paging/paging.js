document.addEventListener('DOMContentLoaded', function() {
    // Code that interacts with DOM elements
    const simulateButton = document.getElementById('simulateButton');
    if (simulateButton) {
        simulateButton.addEventListener('click', simulate);
    } else {
        console.error('Simulate button not found.');
    }
});

function simulate() {
    const memorySize = parseInt(document.getElementById('memorySize').value);
    const pageSize = parseInt(document.getElementById('pageSize').value);
    const numProcesses = parseInt(document.getElementById('numProcesses').value);
  
    let remPages = memorySize / pageSize;
    let output = '';
  
    for (let i = 1; i <= numProcesses; i++) {
        const pagesRequired = parseInt(document.getElementById(`pagesRequired${i}`).value);
  
      if (pagesRequired > remPages) {
        output += `Memory is Full for process p[${i}]\n`;
        break;
      }
  
      remPages -= pagesRequired;
  
      const pageTable = [];
      for (let j = 0; j < pagesRequired; j++) {
        const pageEntry = document.getElementById(`pageEntry${i}_${j}`);
        pageTable.push(pageEntry);
      }
  
      output += `Process p[${i}] requires ${pagesRequired} pages.\n`;
      output += `Number of pages remaining : ${remPages}\n\n`;
    }

    const outputElement = document.getElementById('output');
    if (outputElement) {
      outputElement.innerText = output;
    } else {
      console.error('Output element not found.');
    }
}

  function createProcessInputs() {
    const numProcesses = parseInt(document.getElementById('numProcesses').value);
    const processInputsDiv = document.getElementById('processInputs');
    processInputsDiv.innerHTML = '';
  
    for (let i = 1; i <= numProcesses; i++) {
      const pagesInput = document.createElement('input');
      pagesInput.type = 'number';
      pagesInput.id = `pagesRequired${i}`;
      pagesInput.placeholder = `Enter no. of pages required for p[${i}]`;
  
      const pageTableDiv = document.createElement('div');
      pageTableDiv.id = `pageTable${i}`;
  
      processInputsDiv.appendChild(pagesInput);
      processInputsDiv.appendChild(br);
      processInputsDiv.appendChild(pageTableDiv);
      processInputsDiv.appendChild(document.createElement('hr'));
  
      createPageInputs(i);
    }
  }
  
  // Function to create input boxes for pages based on the number of processes
function createPageInputs() {
  const numProcesses = parseInt(document.getElementById('numProcesses').value);
  const pageInputsDiv = document.getElementById('pageInputs');
  pageInputsDiv.innerHTML = ''; // Clear existing inputs

  for (let i = 1; i <= numProcesses; i++) {
    const pagesInput = document.createElement('input');
    pagesInput.type = 'number';
    pagesInput.id = `pagesRequired${i}`;
    pagesInput.placeholder = `Enter no. of pages required for p[${i}]`;

    pageInputsDiv.appendChild(pagesInput);
    pageInputsDiv.appendChild(document.createElement('br')); // Add line break
  }
}

// Event listener for changes in the number of processes input
document.getElementById('numProcesses').addEventListener('input', createPageInputs);

  