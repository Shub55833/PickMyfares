window.addEventListener("load", function () {
  const loader = document.getElementById("loader");
  loader.style.opacity = "0";

  setTimeout(() => {
    loader.style.display = "none";
    document.querySelector(".content").style.display = "block";
  }, 500);
});


document.getElementById("cancelPolicy").onclick = function () {
  window.location.href = "/cancellation_policy";
};


document.getElementById("about-us").onclick = function () {
  window.location.href = "/about";
};
document.getElementById("terms-and-condition").onclick = function () {
  window.location.href = "/terms_and_condition";
};
document.getElementById("privacy-policy").onclick = function () {
  window.location.href = "/privacy_policy";
};