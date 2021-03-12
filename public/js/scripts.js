document.addEventListener('DOMContentLoaded', bindButtons);

const baseUrl = "http://flip3.engr.oregonstate.edu:6950/";

function bindButtons(){
    document.getElementById("submitNewExercise").addEventListener('click', addEntry);
    document.getElementById("resetTable").addEventListener('click', resetTable);
}

function buildTable(rows) {
    var table = document.getElementById("table");
    for (var i = 0; i < rows.length; i++) {
        var newRow = document.createElement("tr");
        var col = 0;
        for (key in rows[i]) {
            // create input element to populate the <td>
            newInput = document.createElement("input");
            newInput.value = rows[i][key];
            newInput.className = "form-control"
            newInput.readOnly = true;

            // change type of input depending on column
            if (key == "name") {
                newInput.setAttribute("type", "text");
            }
            else if (key == "reps" || key == "weight" || key == "id") {
                newInput.setAttribute("type", "number");
            }
            else if (key == "date") {
                newInput.setAttribute("type", "date");
            }
            else {
                newInput.setAttribute("type", "text");
            }

            //hide id column
            newData = document.createElement("td");
            if (key == "id") {
                newData.className = "d-none";
            }

            newData.appendChild(newInput);
            newRow.appendChild(newData);
            col++;
        }
        // add edit/delete buttons to each row
        newData = document.createElement("td");
        newButton = document.createElement("button");
        newButton.textContent = "Edit";
        newButton.className = "btn btn-primary";
        newData.appendChild(newButton);
        newRow.appendChild(newData);
        newData = document.createElement("td");
        newButton = document.createElement("button");
        newButton.textContent = "Delete";
        newButton.className = "btn btn-primary";
        newData.appendChild(newButton);
        newRow.appendChild(newData);
        table.appendChild(newRow);
    }
}

function resetTable(event) {
    event.preventDefault();
    var req = new XMLHttpRequest();
    req.open('GET', 'http://flip3.engr.oregonstate.edu:6950/reset-table', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load',function(){
        if (req.status >= 200 && req.status < 400) {
            var response = JSON.parse(req.responseText);
            document.getElementById("table").innerHTML = "";
            buildTable(response);
        }
        else {
            console.log("Error in network request: " + req.statusText);
        }
    });
    req.send(null);
}

function addEntry() {
    event.preventDefault();
    var req = new XMLHttpRequest();
    var payload = {
        name: null,
        reps: null,
        weight: null,
        date: null,
        unit: null
    };
    //assign user input to payload input
    payload.name = document.getElementById('name').value;
    payload.reps = document.getElementById('reps').value;
    payload.weight = document.getElementById('weight').value;
    payload.unit = document.getElementById('unit').value;
    payload.date = document.getElementById('date').value;
    //open new post request and set request header
    req.open('POST', 'http://flip3.engr.oregonstate.edu:6950/',true);
    req.setRequestHeader('Content-Type', 'application/json');
    //if post response received post to window, else log error
    req.addEventListener('load',function(){
        if (req.status >= 200 && req.status < 400) {
            var response = JSON.parse(req.responseText);
            document.getElementById("table").innerHTML = "";
            buildTable(response);
        }
        else {
            console.log("Error in network request: " + req.statusText);
        }
    });
    //send request
    req.send(JSON.stringify(payload));
}