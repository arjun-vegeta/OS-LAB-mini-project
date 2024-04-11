let chartInstance = null;

// Helper function to calculate the absolute difference between the request and the head
function calculateDifference(request, head, diff, n) {
    for (let i = 0; i < n; i++) {
        diff[i][0] = Math.abs(head - request[i]);
    }
}

// Function to find the unaccessed track at minimum distance from head
function findMin(diff, n) {
    let index = -1;
    let minimum = Number.MAX_VALUE;

    for (let i = 0; i < n; i++) {
        if (!diff[i][1] && minimum > diff[i][0]) {
            minimum = diff[i][0];
            index = i;
        }
    }
    return index;
}

// Shortest Seek Time First (SSTF) algorithm implementation
function shortestSeekTimeFirst(request, head, n) {
    if (n === 0) {
        return;
    }

    // Create an array to hold the differences and access flags
    let diff = Array.from({ length: n }, () => Array(2).fill(0));

    // Count total number of seek operations
    let seekCount = 0;

    // Stores the sequence of disk accesses
    let seekSequence = Array(n + 1);
    seekSequence[0] = head;

    for (let i = 0; i < n; i++) {
        // Calculate the absolute differences
        calculateDifference(request, head, diff, n);

        // Find the index of the minimum difference
        let index = findMin(diff, n);
        
        // Mark the request at this index as accessed
        diff[index][1] = 1;

        // Increase the total count of seek operations
        seekCount += diff[index][0];

        // Update the head position
        head = request[index];
        seekSequence[i + 1] = head;
    }

    // Display results in the result div
    let resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "Total number of seek operations: <span class='seek-count'>" + seekCount + "</span><br>";
    resultDiv.innerHTML += "Seek Sequence: <span class='seek-sequence'>" + seekSequence.join(", ") + "</span><br>";

    plotSeekSequence(seekSequence);

}

// Function to plot the seek sequence graph using Chart.js
function plotSeekSequence(seekSequence) {
    const ctx = document.getElementById("seekChart").getContext("2d");

    // Destroy the previous chart instance if it exists
    if (chartInstance) {
        chartInstance.destroy();
    }

    const data = {
        labels: Array.from({ length: seekSequence.length }, (_, i) => i + 1),
        datasets: [
            {
                label: "Disk Head Movement",
                data: seekSequence,
                borderColor: "#ADD8E6",
                backgroundColor: "transparent",
                pointBackgroundColor: "#ADD8E6",
                pointBorderColor: "#ADD8E6",
                pointRadius: 3,
                fill: false,
            },
        ],
    };

    // Define the animation options
    const totalDuration = 8000;
    const delayBetweenPoints = totalDuration / data.datasets[0].data.length;

    const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(0) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;

    const animation = {
        x: {
            type: 'number',
            easing: 'linear',
            duration: delayBetweenPoints,
            from: NaN,
            delay(ctx) {
                if (ctx.type !== 'data' || ctx.xStarted) {
                    return 0;
                }
                ctx.xStarted = true;
                return ctx.index * delayBetweenPoints;
            }
        },
        y: {
            type: 'number',
            easing: 'linear',
            duration: delayBetweenPoints,
            from: previousY,
            delay(ctx) {
                if (ctx.type !== 'data' || ctx.yStarted) {
                    return 0;
                }
                ctx.yStarted = true;
                return ctx.index * delayBetweenPoints;
            }
        }
    };

    const config = {
        type: "line",
        data: data,
        options: {
            responsive: true,
            animation: animation, // Add the animation configuration here
            layout: {
                padding: {
                    top: 20, // Increase top padding to give space for the top left element
                    left: 20, // Increase left padding to give space for the top left element
                    right: 20, // Increase right padding to give space for the last data label
                    bottom: 10, 
                },
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Movement of Disk Head',
                    font: {
                        size: 28, // Adjust the size as needed
                        color: '#fff', // Set title color to light grey
                    },
                    padding: {
                        top: 10, // Add padding around the title
                    },
                },
                datalabels: {
                    display: true,
                    anchor: 'end', // Anchors the label to the end of the point
                    align: 'start', // Aligns the label above the point
                    color: '#ccc', // Color of the label text
                    formatter: function(value) {
                        return value; // Return the value as the label
                    },
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Requests",
                        font: {
                            color: '#fff', // Set X-axis title color to light grey
                        },
                    },
                    ticks: {
                        padding: 10, // Add padding for x-axis ticks
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: "Track Position",
                        font: {
                            color: '#fff', // Set Y-axis title color to light grey
                        },
                    },
                },
            },
        },
        plugins: [ChartDataLabels],
    };

    // Create a new Chart instance and store the reference
    chartInstance = new Chart(ctx, config);
}

// Shortest Seek Time First (SSTF) algorithm implementation
function shortestSeekTimeFirst(request, head, n) {
    if (n === 0) {
        return;
    }

    // Create an array to hold the differences and access flags
    let diff = Array.from({ length: n }, () => Array(2).fill(0));

    // Count total number of seek operations
    let seekCount = 0;

    // Stores the sequence of disk accesses
    let seekSequence = Array(n + 1);
    seekSequence[0] = head;

    for (let i = 0; i < n; i++) {
        // Calculate the absolute differences
        calculateDifference(request, head, diff, n);

        // Find the index of the minimum difference
        let index = findMin(diff, n);
        
        // Mark the request at this index as accessed
        diff[index][1] = 1;

        // Increase the total count of seek operations
        seekCount += diff[index][0];

        // Update the head position
        head = request[index];
        seekSequence[i + 1] = head;
    }

    // Display results in the result div
    let resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "Total number of seek operations: <span class='seek-count'>" + seekCount + "</span><br>";
    resultDiv.innerHTML += "Seek Sequence: <span class='seek-sequence'>" + seekSequence.join(", ") + "</span><br>";

    // Plot the seek sequence graph using Chart.js
    plotSeekSequence(seekSequence);
}

// Form submission handler
document.getElementById("sstfForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Get user inputs from the form
    let requestArrayInput = document.getElementById("requestArray").value;
    let headPositionInput = document.getElementById("headPosition").value;

    // Convert the input to appropriate data types
    let requestArray = requestArrayInput.split(",").map(Number);
    let headPosition = Number(headPositionInput);

    // Call the SSTF function with the user inputs
    shortestSeekTimeFirst(requestArray, headPosition, requestArray.length);
});


