console.log("FEEDBACK JS LOADED!");

// --- DOM ELEMENTS ---
const stars = document.querySelectorAll(".star");
const ratingValueEl = document.getElementById("ratingValue");
const feedbackForm = document.getElementById("feedbackForm");
const photoInput = document.getElementById("photo");
const preview = document.getElementById("preview");
const progressRow = document.getElementById("progressRow");
const uploadFill = document.getElementById("uploadFill");
const progressPct = document.getElementById("progressPct");
const submitBtn = document.getElementById("submitBtn");
const formMsg = document.getElementById("formMsg");
const thanksCard = document.getElementById("thanks");
const feedbackCard = document.querySelector(".card");
const whatsappBtn = document.getElementById("whatsappBtn");
const instaBtn = document.getElementById("instaBtn");

// --- VARIABLES ---
let rating = 0;
let currentFile = null;

// --- RATING STARS ---
stars.forEach(btn => {
  btn.addEventListener("click", () => {
    rating = parseInt(btn.dataset.value);
    updateStars(rating);
  });

  btn.addEventListener("mouseover", () => {
    updateStars(parseInt(btn.dataset.value));
  });

  btn.addEventListener("mouseout", () => {
    updateStars(rating);
  });
});

function updateStars(val) {
  stars.forEach(s => {
    const v = parseInt(s.dataset.value);
    s.textContent = v <= val ? "★" : "☆";
    s.classList.toggle("active", v <= val);
  });

  ratingValueEl.textContent = `${val} / 5`;
}

// --- IMAGE PREVIEW ---
photoInput.addEventListener("change", () => {
  preview.innerHTML = "";
  currentFile = null;

  const file = photoInput.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    formMsg.textContent = "Only image files are allowed.";
    photoInput.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024 * 1024 * 1024 * 1024) {
    formMsg.textContent = "Image must be under 5MB.";
    photoInput.value = "";
    return;
  }

  currentFile = file;

  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);
  preview.appendChild(img);
});



// --- SUBMIT FORM ---
feedbackForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  formMsg.textContent = "";

  const name = document.getElementById("name").value.trim();
  const message = document.getElementById("message").value.trim();
  const item = document.getElementById("item").value;

  if (rating < 1) {
    formMsg.textContent = "Please give a rating (1–5 stars).";
    return;
  }

  if (message.length < 5) {
    formMsg.textContent = "Please write at least 5 characters.";
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  try {
    // Build FormData
    const fd = new FormData();
    fd.append("rating", rating);
    fd.append("message", message);
    fd.append("name", name);
    fd.append("item", item);

    const file = photoInput.files[0];
    if (file) fd.append("image", file);

    // Send to backend
    const res = await fetch("https://ishow-feedback-backend-1.onrender.com/api/feedback", {
      method: "POST",
      body: fd
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error || "Failed to submit feedback.");
    }

    // --- SUCCESS UI ---
    feedbackCard.classList.add("hidden");
    thanksCard.classList.remove("hidden");

    whatsappBtn.href = "https://wa.me/2349025000264"; "https://wa.me/2347086630193"; "https://wa.me/2348037162364";
    instaBtn.href = "https://instagram.com/ishowgarmentsworld";

    feedbackForm.reset();
    currentFile = null;
    preview.innerHTML = "";
    uploadFill.style.width = "0%";
    progressRow.hidden = true;

  } catch (err) {
    console.error("Submit Error:", err);
    formMsg.textContent = err.message || "Something went wrong. Please try again.";
  }

  submitBtn.disabled = false;
  submitBtn.textContent = "Submit Feedback";
});