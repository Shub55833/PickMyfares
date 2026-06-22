var Tawk_API = Tawk_API || {},
  Tawk_LoadStart = new Date();

(function () {
  var s1 = document.createElement("script"),
    s0 = document.getElementsByTagName("script")[0];
  s1.async = true;
  s1.src = "https://embed.tawk.to/69d5e698204ea01c36250f5a/1jllophkh";
  s1.charset = "UTF-8";
  s1.setAttribute("crossorigin", "*");
  s0.parentNode.insertBefore(s1, s0);
})();

document.getElementById("subscribeBtn").onclick = function () {
  const email = document.getElementById("emailInput").value;
  const msg = document.getElementById("subscribeMsg");

  // email validation regex
  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

  if (!email.match(emailPattern)) {
    msg.innerText = "Please enter a valid email!";
    msg.style.background = "red";
    msg.style.display = "block";

    setTimeout(() => {
      msg.style.display = "none";
    }, 3000);

    return;
  }

  // success
  msg.innerText = "Thanks for subscribing!";
  msg.style.background = "#00b67a";
  msg.style.display = "block";

  setTimeout(() => {
    msg.style.display = "none";
  }, 3000);

  document.getElementById("emailInput").value = "";
};