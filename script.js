const remote_buttons = document.querySelectorAll(".remote-buttons");
console.log(remote_buttons);
const tvIp = "192.168.0.0";
remote_buttons.forEach(button => {
    button.addEventListener("click", sendCommand);
    console.log("1");
})


async function sendCommand(event) {
    const url = "http://192.168.0.148:8060/keypress/"+event.target.id;
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