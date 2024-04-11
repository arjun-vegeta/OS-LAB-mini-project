// JavaScript implementation of LOOK Disk Scheduling
let chartInstance = null;
// Function to perform LOOK on the request array starting from the given head
function LOOK(arr, head, direction) {
    let seek_count = 0;
    let distance, cur_track;

    let left = [];
    let right = [];
    let seek_sequence = [];

    // Separate requests into left and right arrays based on the head position
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < head) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }

    // Sort left and right arrays
    left.sort((a, b) => a - b);
    right.sort((a, b) => a - b);

    // Run the LOOK algorithm twice, first in the initial direction, then in the opposite direction
    let run = 2;
    while (run-- > 0) {
        if (direction === "left") {
            // Service the left side of the head
            for (let i = left.length - 1; i >= 0; i--) {
                cur_track = left[i];

                // Append current track to seek sequence
                seek_sequence.push(cur_track);

                // Calculate distance and increment seek count
                distance = Math.abs(cur_track - head);
                seek_count += distance;

                // Update head position
                head = cur_track;
            }
            // Reverse the direction for the next run
            direction = "right";
        } else if (direction === "right") {
            // Service the right side of the head
            for (let i = 0; i < right.length; i++) {
                cur_track = right[i];

                // Append current track to seek sequence
                seek_sequence.push(cur_track);

                // Calculate distance and increment seek count
                distance = Math.abs(cur_track - head);
                seek_count += distance;

                // Update head position
                head = cur_track;
            }
            // Reverse the direction for the next run
            direction = "left";
        }
    }

    // Display the results in the result div
    let resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `Total number of seek operations: <span class="seek-count">${seek_count}</span><br>`;
    resultDiv.innerHTML += `Seek Sequence: <span class="seek-sequence">${seek_sequence.join(", ")}</span>`;

    plotSeekSequence(seek_sequence);
}

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


// Form submission handler
document.getElementById("lookForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Get the user input from the form
    let requestArrayInput = document.getElementById("requestArray").value;
    let headPositionInput = document.getElementById("headPosition").value;
    let directionInput = document.getElementById("direction").value;

    // Convert the input to appropriate data types
    let requestArray = requestArrayInput.split(",").map(Number);
    let headPosition = Number(headPositionInput);
    let direction = directionInput.trim().toLowerCase();

    // Call the LOOK function with the user input
    LOOK(requestArray, headPosition, direction);
});
