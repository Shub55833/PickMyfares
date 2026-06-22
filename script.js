// ==========================
// 🎞️ AUTO SLIDER (SMOOTH FADE)
// ==========================
(function () {
  emailjs.init("hC8SvAaZuHDuGVoTs");
})();

document.getElementById("submitForm").addEventListener("click", function (e) {
  e.preventDefault();

  let isValid = true;

  const fields = [
    { id: "firstName", msg: "Enter first name" },
    { id: "lastName", msg: "Enter last name" },
    { id: "email", msg: "Enter email" },
    { id: "phone", msg: "Enter phone number" },
  ];

  fields.forEach((field) => {
    const input = document.getElementById(field.id);

    // remove old error
    input.classList.remove("input-error");

    let oldTooltip = input.parentElement.querySelector(".tooltip-error");
    if (oldTooltip) oldTooltip.remove();

    if (!input.value.trim()) {
      isValid = false;

      input.classList.add("input-error");

      let tooltip = document.createElement("div");
      tooltip.className = "tooltip-error";
      tooltip.innerText = field.msg;

      input.parentElement.style.position = "relative";
      input.parentElement.appendChild(tooltip);
    }
  });

  // 🔥 Email validation
  const email = document.getElementById("email");
  if (email.value && !/^\S+@\S+\.\S+$/.test(email.value)) {
    isValid = false;

    email.classList.add("input-error");

    let tooltip = document.createElement("div");
    tooltip.className = "tooltip-error";
    tooltip.innerText = "Invalid email";

    email.parentElement.appendChild(tooltip);
  }

  // 🔥 Phone validation
  const phone = document.getElementById("phone");
  if (phone.value && !/^[0-9]{7,15}$/.test(phone.value)) {
    isValid = false;

    phone.classList.add("input-error");

    let tooltip = document.createElement("div");
    tooltip.className = "tooltip-error";
    tooltip.innerText = "Invalid phone";

    phone.parentElement.appendChild(tooltip);
  }

  // ❌ STOP if invalid
  if (!isValid) return;

  // ✅ EMAIL SEND (same tera code)
  const data = {
    title: document.getElementById("title").value,
    first_name: document.getElementById("firstName").value,
    last_name: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    from: document.getElementById("popupFrom").value,
    to: document.getElementById("popupTo").value,
    departure: document.getElementById("popupDate").value,
    return_date: document.getElementById("popupReturnDate").value,
    travellers: document.getElementById("popupPeople").value,
  };

  emailjs
    .send("service_4y4rbds", "template_f9mp94a", data)
    .then(() => {
      document.getElementById("successPopup").style.display = "flex";
      document.getElementById("popup").style.display = "none";
      document.getElementById("bookingForm").reset();
    })
    .catch((error) => {
      console.log(error);
      alert("❌ Failed to send booking");
    });
});

function closePopup() {
  document.getElementById("successPopup").style.display = "none";
}

// Email sending code
const slides = document.querySelectorAll(".slide");
let current = 0;
// loader
window.addEventListener("load", function () {
  const loader = document.getElementById("loader");
  loader.style.opacity = "0";

  setTimeout(() => {
    loader.style.display = "none";
    document.querySelector(".content").style.display = "block";
  }, 500);
});

if (slides.length > 0) {
  let current = 0;

  function changeSlide() {
    slides[current].classList.remove("active");

    current = (current + 1) % slides.length;

    slides[current].classList.add("active");
  }

  setInterval(changeSlide, 3000);
}
// ==========================
// 🔍 SEARCH
// ==========================

async function fetchAirports(keyword) {
  const res = await fetch(
    `https://airlabs.co/api/v9/suggest?q=${keyword}&api_key=961c7869-af0f-49a9-8b90-13b6ae56ab22`,
  );
  const data = await res.json();

  const airports = data.response.airports || [];

  // 🔥 sab city sources merge kar
  const allCities = [
    ...(data.response.cities || []),
    ...(data.response.cities_by_airports || []),
  ];

  let result = [];

  airports.forEach((a) => {
    // 🔥 direct match (rare case)
    let cityMatch = allCities.find((c) => c.city_code === a.iata_code);

    // 🔥 fallback 1: same country (IMPORTANT)
    if (!cityMatch) {
      cityMatch = allCities.find((c) => c.country_code === a.country_code);
    }

    // 🔥 fallback 2: first city (safe fallback)
    if (!cityMatch && allCities.length > 0) {
      cityMatch = allCities[0];
    }

    let finalCity = cityMatch ? cityMatch.name : "";

    result.push({
      code: a.iata_code,
      city: finalCity,
      airport: a.name,
      country: a.country_code,
    });
  });

  return result;
}
function setupSearch(inputId, suggestId) {
  const input = document.getElementById(inputId);
  const box = document.getElementById(suggestId);

  input.addEventListener(
    "input",
    debounce(async () => {
      let val = input.value.trim();
      box.innerHTML = "";

      if (!val) {
        box.style.display = "none";
        return;
      }

      let airports = await fetchAirports(val);

      if (airports.length === 0) {
        box.style.display = "none";
        return;
      }

      box.style.display = "block";

      airports.forEach((item) => {
        let div = document.createElement("div");

        div.innerHTML = `
                      <div style="font-size:14px;">
                        <strong>${item.code}</strong> - ${item.city}
                      </div>
                      <div style="font-size:11px; color:gray;">
                        ${item.airport}, ${item.country}
                      </div>
                    `;
        div.onclick = () => {
          input.value = `${item.code} - ${item.city || item.airport}`;
          box.innerHTML = "";
          box.style.display = "none";
        };

        box.appendChild(div);
      });
    }, 400),
  ); // 🔥 yaha delay set kar (300–500 best)
}

setupSearch("from", "fromSuggest");
setupSearch("to", "toSuggest");

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Date set

const departureInput = document.getElementById("date");
const returnInput = document.getElementById("returnDate");
const today = new Date().toISOString().split("T")[0];
departureInput.min = today;
returnInput.min = today;

departureInput.addEventListener("change", function () {
  // return date ka minimum set kar do
  returnInput.min = this.value;

  // agar return date already chhota hai to clear kar do
  if (returnInput.value < this.value) {
    returnInput.value = "";
  }
});
// ==========================
// 📦 POPUP
// ==========================

const popup = document.getElementById("popup");

document.getElementById("close").onclick = () => {
  popup.style.display = "none";
};

// ==========================
// 📧 POPUP PRELOADED DATA
// ==========================

function openPopup() {
  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;
  const date = document.getElementById("date").value;
  const returnDate = document.getElementById("returnDate").value;
  const people = document.getElementById("passengerInput").value;

  const tripType = document.querySelector('input[name="trip"]:checked').value;

  document.getElementById("popupFrom").value = from;
  document.getElementById("popupTo").value = to;
  document.getElementById("popupDate").value = date;
  document.getElementById("popupPeople").value = people;

  if (tripType === "round") {
    document.getElementById("popupReturnDate").value = returnDate;
  }

  document.getElementById("popup").style.display = "block";
}
// CLOSE
document.getElementById("close").onclick = () => {
  popup.style.display = "none";
};

// ==========================
// 📧 PESSANGER COUNT
// ==========================

let adult = 1;
let child = 0;
let infant = 0;

const input = document.getElementById("passengerInput");
const dropdown = document.getElementById("passengerDropdown");

// OPEN DROPDOWN
input.addEventListener("click", () => {
  dropdown.style.display = "block";
});

// CHANGE COUNT
function changeCount(type, value) {
  if (type === "adult") {
    adult = Math.max(1, adult + value);
    document.getElementById("adultCount").innerText = adult;
  }

  if (type === "child") {
    child = Math.max(0, child + value);
    document.getElementById("childCount").innerText = child;
  }

  if (type === "infant") {
    infant = Math.max(0, infant + value);
    document.getElementById("infantCount").innerText = infant;
  }
}

// CLOSE + UPDATE TEXT
function closePassenger() {
  dropdown.style.display = "none";

  let total = adult + child + infant;
  input.value = total + " Traveller(s)";
}

// OUTSIDE CLICK CLOSE
document.addEventListener("click", (e) => {
  if (!input.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.style.display = "none";
  }
});

// ==========================
// 📧 ROUNDWAY LOGIC
// ==========================

const tripRadios = document.querySelectorAll('input[name="trip"]');
const returnGroup = document.getElementById("returnGroup");
const popupReturn = document.getElementById("popupReturnDate");

// DEFAULT → Round Trip visible
returnGroup.classList.remove("hidden");

tripRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    const selected = document.querySelector('input[name="trip"]:checked').value;

    if (selected === "oneway") {
      returnGroup.classList.add("hidden");
      popupReturn.classList.add("hidden");
    } else {
      returnGroup.classList.remove("hidden");
      popupReturn.classList.remove("hidden");
    }
  });
});
document.querySelectorAll('input[type="date"]').forEach((input) => {
  input.addEventListener("click", function () {
    this.showPicker(); // ye line date picker open kar degi
  });
});

// ERROR HANDELING

document.getElementById("quoteBtn").addEventListener("click", function () {
  let isValid = true;

  let tripType = document.querySelector('input[name="trip"]:checked').value;

  // 🔥 fields dynamic banao
  let fields = [
    { id: "from", msg: "Please enter departure city" },
    { id: "to", msg: "Please enter destination city" },
    { id: "date", msg: "Select departure date" },
  ];

  // ✅ sirf round trip me return date add karo
  if (tripType === "round") {
    fields.push({ id: "returnDate", msg: "Select return date" });
  }

  fields.forEach((field) => {
    const input = document.getElementById(field.id);

    input.classList.remove("input-error");

    fields.forEach((field) => {
      const input = document.getElementById(field.id);
      const tooltip = input.parentElement.querySelector(".tooltip-error");

      // reset
      input.classList.remove("input-error");
      tooltip.style.display = "none";

      if (!input.value.trim()) {
        isValid = false;

        input.classList.add("input-error"); // 🔴 border
        tooltip.innerText = field.msg; // 📍 message
        tooltip.style.display = "block";
      }
    });
  });

  // ❌ agar invalid hai → STOP
  if (!isValid) return;

  // ✅ popup open
  openPopup();
});
document.addEventListener("DOMContentLoaded", () => {
  ["from", "to", "date", "returnDate"].forEach((id) => {
    const input = document.getElementById(id);
    const tooltip = input.parentElement.querySelector(".tooltip-error");

    input.addEventListener("input", () => {
      input.classList.remove("input-error");
      tooltip.style.display = "none";
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  ["firstName", "lastName", "email", "phone"].forEach((id) => {
    const input = document.getElementById(id);
    const tooltip = input.parentElement.querySelector(".tooltip-error");

    input.addEventListener("input", () => {
      input.classList.remove("input-error");
      tooltip.style.display = "none";
    });
  });
});
 const words = ["Travel.", "Explore.", "Fly.", "Discover."];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingElement = document.querySelector(".typing-text");

  function typeEffect() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      typingElement.textContent = currentWord.substring(0, charIndex--);
    } else {
      typingElement.textContent = currentWord.substring(0, charIndex++);
    }

    let speed = isDeleting ? 80 : 150;

    if (!isDeleting && charIndex === currentWord.length + 1) {
      speed = 1200;
      isDeleting = true;
    }

    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }

    setTimeout(typeEffect, speed);
  }

  typeEffect();


