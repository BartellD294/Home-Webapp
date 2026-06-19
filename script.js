const remoteButtons = document.querySelectorAll(".remote-buttons");
const keyboardInput = document.querySelector("#keyboard-input");
const clearKeyboardButton = document.querySelector("#keyboard-clear");
const scanButton = document.querySelector("#scan-button");
//var rokuUrl = "http://192.168.0.148:8060/keypress/";
var rokuIp = "192.168.0.148";

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
    //testWebSocket();
    scanForRokus("192.168.0", 190, 215);
});

// functions
async function buttonPress(event) {
    console.log(event.target.id);
    const url = "http://"+rokuIp+":8060/keypress/"+event.target.id;
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
    const rokuStartUrl = "http://"+rokuIp+":8060/keypress/";
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

async function scanForRokus(subnetStart, lowIp, highIp) {
    rokuIpList = [];
    console.log(lowIp, highIp);
    for (let i = lowIp; i <= highIp; i++) {
        console.log("Scanning " + i);
        try {
            //const response = await fetch("http://" + subnetStart + "." + String(i) + ":8060/query/icon/1", {
            const response = await fetch("http://" + subnetStart + "." + String(i) + ":8060/query/device-info", {
                method: "GET",
                priority: "low",
                mode: "no-cors",
                signal: AbortSignal.timeout(100)
            });
            console.log("response:", response);
            rokuIpList.push(subnetStart + "." + String(i));
            console.log(rokuIpList);
        }
        catch (error) {
            console.log(error);
            console.error("error");
        }
    }
}

// function rtcPeerConnection() {
//     const pc = new RTCPeerConnection();
//     pc.onicecandidate = (event) => {
//         if (event.candidate) {
//         }
//     }
// }

// async function testWebSocket() {
//     //const wsUrl = "ws://192.168.0.148:8060/ecp-session";
//     const wsUrl = "ws://192.168.0.147:8060/ecp-session";
//     const ws = new WebSocket(wsUrl);
//     //ws.addEventListener("message", () => {
//     ws.onopen = () => {
//         console.log("WebSocket connection opened");
//     };
// }
// async function testWebSockets() {
//     let ws = null;
//     for (let i = 1; i <= 254; i++) {
//         let wsUrl = "ws://192.168.0." + String(i) + ":8060/device-info";
//         ws = new WebSocket(wsUrl);
//         ws.onopen = () => {
//             console.log("WebSocket connection opened to " + wsUrl);
//         }
//     }
// }