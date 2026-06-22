(function(){
  emailjs.init("hC8SvAaZuHDuGVoTs");
})();


window.addEventListener("load", function () {
  const loader = document.getElementById("loader");
  loader.style.opacity = "0";

  setTimeout(() => {
    loader.style.display = "none";
    document.querySelector(".content").style.display = 'block'
  }, 500);
});
document.getElementById("cancelPolicy").onclick = function () {
  window.open("/cancellation_policy", "_blank");
};

document.getElementById("contactForm").addEventListener("submit", function(e){
  e.preventDefault();

  const data = {
    c_name: document.getElementById("c_name").value,
    c_email: document.getElementById("c_email").value,
    c_subject: document.getElementById("c_subject").value,
    c_message: document.getElementById("c_message").value
  };

  emailjs.send("service_4y4rbds","template_vqnh9wn", data)
  .then(() => {

    // ✅ SUCCESS
    document.getElementById("popupTitle").innerText = "Thank You! ✉️";
    document.getElementById("popupMessage").innerText =
      "Your message has been sent successfully. We will contact you soon.";

    document.getElementById("successPopup").style.display = "flex";

    document.getElementById("contactForm").reset();
  })
  .catch((err) => {
    console.log(err);

    // ❌ ERROR
    document.getElementById("popupTitle").innerText = "Oops!";
    document.getElementById("popupMessage").innerText =
      "Failed to send message. Please try again.";

    document.getElementById("successPopup").style.display = "flex";
  });
});
function closePopup(){
  document.getElementById("successPopup").style.display = "none";
}