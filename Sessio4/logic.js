setInterval(
    () => {
        document.getElementById("time").innerHTML = new Date().toUTCString();
    }, 1000); // Calls this anonymous function every 1000 miliseconds

function show_date() {
    let d = new Date();
    alert(d.toDateString()); // Shows a pop-up window with the current date
}