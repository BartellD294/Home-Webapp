const remoteButtons = document.querySelectorAll(".remote-buttons");
const keyboardInput = document.querySelector("#keyboard-input");
const clearKeyboardButton = document.querySelector("#keyboard-clear");
const scanOctets = document.querySelectorAll(".ip-input");
const scanButton = document.querySelector("#scan-button");
const rokuIpInput = document.querySelector("#roku-ip");
const scanResultsDiv = document.querySelector("#scan-results");
const scanStatusDiv = document.querySelector("#scan-status");
//var rokuUrl = "http://192.168.0.148:8060/keypress/";

var scanIsRunning = false;

console.log(scanOctets);

let rokuIpList = [];

// event listeners
remoteButtons.forEach(button => {
    button.addEventListener("click", buttonPress);
    console.log("1");
})

keyboardInput.addEventListener("keydown", keyPress);

clearKeyboardButton.addEventListener("click", () => {
    keyboardInput.value = "";
});

// scanButton.addEventListener("click", () => {
//     const subnetStart = document.querySelector("#subnet-start").value;
//     const lowIp = document.querySelector("#low-ip").value;
//     const highIp = document.querySelector("#high-ip").value;
//     scanForRokus(subnetStart, lowIp, highIp);
// });

scanButton.addEventListener("click", () => {
    let ipStart = scanOctets[0].value + "." + scanOctets[1].value + "." + scanOctets[2].value;
    scanForRokus(ipStart, scanOctets[3].value, scanOctets[4].value);
});

// functions
async function buttonPress(event) {
    console.log(event.target.id);
    const url = "http://"+rokuIpInput.value+":8060/keypress/"+event.target.id;
    sendCommand(url);
    console.log(url);
}

async function sendCommand(url) {
    console.log("sending url " + url);
    try {
        const response = await fetch(url, {
            method: "POST",
            mode: "no-cors"
        });
        console.log(response);
    }
    catch(error) {
        console.log(error);
        console.error("error");
    }

}

async function keyPress(event) {
    console.log(event.key);
    const rokuStartUrl = "http://"+rokuIpInput.value+":8060/keypress/";
    var key = event.key;
    if (key === " ") {
        const url = rokuStartUrl+"Lit_%20";
        sendCommand(url);
    }
    else if (key.length === 1 ) {
        const url = rokuStartUrl+"Lit_"+key;
        sendCommand(url);
    }
    else if (key === "Backspace") {
        const url = rokuStartUrl+"Backspace";
        sendCommand(url);
    }
}

async function scanForRokus(subnetStart, lowIp, highIp, timeout=100) {
    rokuIpList = [];
    scanIsRunning = true;
    console.log("low IP high IP", lowIp, highIp);
    for (let i = lowIp; i <= highIp; i++) {
        console.log("Scanning " + i);
        scanStatusDiv.innerHTML = "<p>Scanning: " + subnetStart + "." + String(i) + "</p>";

        try {
            const response = await fetch("http://" + subnetStart + "." + String(i) + ":8060/query/device-info", {
                method: "GET",
                priority: "low",
                mode: "no-cors",
                signal: AbortSignal.timeout(timeout)
            });
            console.log("response:", response);
            rokuIpList.push(subnetStart + "." + String(i));
            console.log(rokuIpList);
            if (document.querySelector("#autofill-checkbox").checked && rokuIpList.length > 0) {
                rokuIpInput.value = rokuIpList[0];
            }
            updateScanResults();
        }
        catch (error) {
            console.log(error);
            console.error("error");
        }
    }
    scanIsRunning = false;
    if (rokuIpList.length === 0) {
        scanResultsDiv.innerHTML = "<p>No Roku devices found.</p>";
    }
}

function updateScanResults() {
    scanResultsDiv.innerHTML = "";
    if (rokuIpList.length === 0) {
        scanResultsDiv.innerHTML = "<p>No Roku devices found.</p>";
    }
    else {
        rokuIpList.forEach(ip => {
            scanResultsDiv.innerHTML += `<p>${ip}</p>`;
        });
    }
}