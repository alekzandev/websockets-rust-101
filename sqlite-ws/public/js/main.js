let ws = null;
let chart = null;

const queryTemplates = {
    basic: "SELECT * FROM tracks LIMIT 5;",
    aggregate: "SELECT artist, COUNT(*) as track_count, AVG(price) as avg_price\nFROM tracks\nGROUP BY artist\nORDER BY track_count DESC;",
    chart: "SELECT artist, AVG(duration) as avg_duration\nFROM tracks\nGROUP BY artist\nORDER BY avg_duration DESC\nLIMIT 5;"
};

function initChart() {
    const ctx = document.getElementById('chartArea').getContext('2d');
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Query Results',
                data: [],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });
}

function connect() {
    ws = new WebSocket("ws://localhost:8080/ws");

    ws.onopen = function() {
        document.getElementById("status").className = "status connected";
        document.getElementById("status").textContent = "Connected 🟢";
    };

    ws.onmessage = function(evt) {
        const response = JSON.parse(evt.data);

        if (response.success && response.result) {
            const result = response.result;

            // Format table output
            let output = result.columns.join(" | ") + "\n";
            output += "-".repeat(output.length) + "\n";

            result.rows.forEach(row => {
                output += row.map(val => {
                    if (val === null) return "NULL";
                    if (typeof val === "object") return val.String || val.Int || val.Real || "NULL";
                    return val;
                }).join(" | ") + "\n";
            });

            document.getElementById("results").textContent = output;

            // Update visualization if it's a chart query
            if (document.getElementById("query").value.includes("GROUP BY")) {
                updateChart(result);
            }
        } else {
            document.getElementById("results").textContent = "Error: " + response.error;
        }
    };

    ws.onclose = function() {
        document.getElementById("status").className = "status disconnected";
        document.getElementById("status").textContent = "Disconnected 🔴";
        ws = null;
    };
}

function updateChart(result) {
    if (!chart) return;

    const labels = result.rows.map(row => row[0].String || row[0].Int || row[0]);
    const data = result.rows.map(row => row[1].Real || row[1].Int || row[1]);

    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
}

function loadTemplate(type) {
    document.getElementById("query").value = queryTemplates[type];
}

function sendQuery() {
    if (!ws) {
        alert("Not connected to server");
        return;
    }
    const query = document.getElementById("query").value;
    ws.send(JSON.stringify({ query: query }));
}

window.onload = function() {
    connect();
    initChart();
};