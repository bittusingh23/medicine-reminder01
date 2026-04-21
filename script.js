/** @format */

function setReminder() {
  console.log("clicked");

  let medicine = document.getElementById("medicine").value;
  let time = document.getElementById("time").value;

  if (!medicine || !time) {
    alert("Fill all fields");
    return;
  }

  // 👇 UI pe turant show karega
  document.getElementById("output").innerText =
    "Reminder set for " + medicine + " at " + time;

  // 👇 server ko bhej
  fetch("http://localhost:3000/set-reminder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      medicine: medicine,
      time: time,
    }),
  })
    .then((res) => res.text())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
}
