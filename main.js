// ---- Dark Mode Setup ----
const body = document.body;
const darkModeToggle = document.getElementById("darkModeToggle");
const darkModeKey = "monthProgressDarkMode";

function setDarkMode(enabled) {
  if (enabled) {
    body.classList.add("dark");
    darkModeToggle.textContent = "☀️";
    localStorage.setItem(darkModeKey, "true");
  } else {
    body.classList.remove("dark");
    darkModeToggle.textContent = "🌙";
    localStorage.setItem(darkModeKey, "false");
  }
}
// Initialize dark mode based on saved preference
const savedDarkMode = localStorage.getItem(darkModeKey);
setDarkMode(savedDarkMode === "true");

darkModeToggle.addEventListener("click", () => {
  setDarkMode(!body.classList.contains("dark"));
});

// ---- Month Progress Setup ----
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const now = new Date();
const currentMonth = now.getMonth();
const today = now.getDate();
const currentYear = now.getFullYear();

document.title = `Month Progress - ${currentYear}`;
const grid = document.getElementById("monthGrid");

// Modal elements
const modalOverlay = document.getElementById("modalOverlay");
const modalContent = document.getElementById("modalContent");
const modalTitle = document.getElementById("modalTitle");
const modalSubtitle = document.getElementById("modalSubtitle");
const monthJournal = document.getElementById("monthJournal");
const saveJournalBtn = document.getElementById("saveJournalBtn");
const closeBtn = modalContent.querySelector(".close-btn");

// Storage prefix for journals
const journalPrefix = "monthJournal_";

function openModal(monthIndex, monthName, daysSpent, daysLeft, daysInMonth) {
  modalTitle.textContent = `${monthName} ${currentYear}`;
  modalSubtitle.textContent = `Spent: ${daysSpent} days | Remaining: ${daysLeft} days | Total: ${daysInMonth} days`;
  // Load saved journal
  const savedNote = localStorage.getItem(journalPrefix + monthIndex) || "";
  monthJournal.value = savedNote;
  modalOverlay.classList.add("active");
  monthJournal.focus();

  // Save handler
  saveJournalBtn.onclick = () => {
    localStorage.setItem(journalPrefix + monthIndex, monthJournal.value.trim());
    alert("Notes saved!");
    closeModal();
  };
}

function closeModal() {
  modalOverlay.classList.remove("active");
}
closeBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

// Generate month columns
months.forEach((month, index) => {
  const column = document.createElement("div");
  column.classList.add("month-column");

  const daysInMonth = new Date(currentYear, index + 1, 0).getDate();
  let daysSpent = 0;
  let daysLeft = 0;

  if (index < currentMonth) {
    daysSpent = daysInMonth;
    daysLeft = 0;
  } else if (index === currentMonth) {
    daysSpent = today;
    daysLeft = daysInMonth - today;
  } else {
    daysSpent = 0;
    daysLeft = daysInMonth;
  }

  const wrapper = document.createElement("div");
  wrapper.classList.add("progress-wrapper");

  const spentDiv = document.createElement("div");
  spentDiv.classList.add("progress-spent");
  spentDiv.style.height = `${(daysSpent / daysInMonth) * 100}%`;

  const remainDiv = document.createElement("div");
  remainDiv.classList.add("progress-remaining");
  remainDiv.style.height = `${(daysLeft / daysInMonth) * 100}%`;

  const annotationBox = document.createElement("div");
  annotationBox.classList.add("annotation-container");

  const fillTarget = document.createElement("div");
  fillTarget.classList.add("annotation-fill");
  annotationBox.appendChild(fillTarget);

  wrapper.appendChild(spentDiv);
  wrapper.appendChild(remainDiv);
  wrapper.appendChild(annotationBox);

  const label = document.createElement("div");
  label.classList.add("month-label");
  label.textContent = month;

  const tooltip = document.createElement("div");
  tooltip.classList.add("tooltip");
  tooltip.textContent = `📅 ${daysSpent} spent / ${daysLeft} left (Total: ${daysInMonth})`;

  column.appendChild(wrapper);
  column.appendChild(label);
  column.appendChild(tooltip);
  grid.appendChild(column);

  // Rough notation box around each month container
  // const legendAnnotation = RoughNotation.annotate(legendBox, {
  //   type: "box",
  //   color: "#2c3e50",
  //   padding: 8,
  //   iterations: 2,
  //   animate: true,
  // });
  // legendAnnotation.show();

  // Click handler to open modal with journal
  column.addEventListener("click", () => {
    openModal(index, month, daysSpent, daysLeft, daysInMonth);
  });
});

// Legend rough notation
const legendAnnotation = RoughNotation.annotate(legendBox, {
  type: "box",
  color: "#2c3e50",
  padding: 8,
  iterations: 2,
  animate: true,
});
legendAnnotation.show();


// Quotes API fetching from zenquotes.io
fetch(
  "https://corsproxy.io/?" +
    encodeURIComponent("https://zenquotes.io/api/random")
)
  .then((res) => res.json())
  .then((data) => {
    const quote = data[0]; // ZenQuotes returns an array
    document.getElementById(
      "quoteOfTheDay"
    ).innerHTML = `💭 "${quote.q}"<br><em>– ${quote.a}</em>`;
  })
  .catch((err) => {
    console.error("Quote fetch error:", err);
    document.getElementById("quoteOfTheDay").textContent = "✨ Stay motivated!";
  });

// Download as PNG button functionality
downloadBtn.addEventListener("click", () => {
  // Capture whole page content (everything inside <body>)
  html2canvas(document.body, { scrollY: -window.scrollY }).then((canvas) => {
    const link = document.createElement("a");
    link.download = `month_progress_${currentYear}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});
