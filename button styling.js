let infoIcon = document.getElementById("info-icon");
let bigInfoDiv = document.getElementById("big-info-div");
let infoDiv = document.getElementById("info-div");

infoIcon.addEventListener("mouseover", (event) => {
    infoDiv.style.display = "grid";
});

infoIcon.addEventListener("mouseout", (event) => {
    infoDiv.style.display = "none";
});
