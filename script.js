const bookingForm = document.getElementById("bookingForm");
const seats = document.querySelectorAll(".seat");
const maxSeatsInput = document.getElementById("seat");
const bookingStatusTable = document.getElementById("bookingStatusTable");
const errorContainer = document.getElementById("errorContainer"); // Container for error messages
let selectedSeats = [];
let isBooked = false;

// Define seat ranges for different ranks
const seatRanges = {
  "CPL & BELOW/DSC/NC(E)": [
    ...Array.from({ length: 20 }, (_, i) => `H${i + 1}`), // H1 to H20
    ...Array.from({ length: 26 }, (_, i) => `J${i + 1}`), // J1 to J26
    ...Array.from({ length: 26 }, (_, i) => `K${i + 1}`), // K1 to K26
    ...Array.from({ length: 26 }, (_, i) => `L${i + 1}`), // L1 to L26
    ...Array.from({ length: 26 }, (_, i) => `M${i + 1}`), // M1 to M26
    ...Array.from({ length: 10 }, (_, i) => `N${i + 1}`)  // N1 to N10
  ],
  "SGT": [
    ...Array.from({ length: 20 }, (_, i) => `F${i + 1}`), // F1 to F20
    ...Array.from({ length: 20 }, (_, i) => `G${i + 1}`), // G1 to G20
    ...Array.from({ length: 12 }, (_, i) => `D${i + 13}`), // D13 to D24
    ...Array.from({ length: 12 }, (_, i) => `E${i + 13}`)  // E13 to E24
  ],
  "OFFICERS": [
    ...Array.from({ length: 12 }, (_, i) => `A${i + 1}`),  // A1 to A12
    ...Array.from({ length: 11 }, (_, i) => `B${i + 1}`),  // B1 to B11
    ...Array.from({ length: 12 }, (_, i) => `C${i + 1}`),  // C1 to C12
    ...Array.from({ length: 12 }, (_, i) => `D${i + 1}`),  // D1 to D12
    ...Array.from({ length: 12 }, (_, i) => `E${i + 1}`)   // E1 to E12
  ],
  "WARRANT RANK": [
    ...Array.from({ length: 12 }, (_, i) => `A${i + 13}`), // A13 to A24
    ...Array.from({ length: 11 }, (_, i) => `B${i + 12}`), // B12 to B22
    ...Array.from({ length: 12 }, (_, i) => `C${i + 13}`)  // C13 to C24
  ]
};

seats.forEach((seat) => {
  seat.addEventListener("click", () => handleSeatSelection(seat));
});


// Event listener for rank selection
const rankInput = document.getElementById("rank");
rankInput.addEventListener("change", () => {
  const selectedRank = rankInput.value;
  toggleSeatAvailability(selectedRank);
  clearSelectedSeats(); // Clear previous selections
});

// Function to enable/disable seats based on the selected rank
function toggleSeatAvailability(rank) {
  seats.forEach(seat => {
    const seatId = seat.id;

    if (["AC", "LAC", "CPL", "AGV", "DSC", "NCE(E)"].includes(rank)) {
      if (seatRanges["CPL & BELOW/DSC/NC(E)"].includes(seatId)) {
        seat.style.pointerEvents = "auto"; // Enable
        seat.style.opacity = "1"; // Make it visible
      } else {
        seat.style.pointerEvents = "none"; // Disable
        seat.style.opacity = "0.5"; // Dim it to indicate it's unclickable
        seat.classList.remove("selected"); // Deselect if it's not clickable
      }
    } else if (rank === "SGT") {
      if (seatRanges["SGT"].includes(seatId)) {
        seat.style.pointerEvents = "auto"; // Enable
        seat.style.opacity = "1"; // Make it visible
      } else {
        seat.style.pointerEvents = "none"; // Disable
        seat.style.opacity = "0.5"; // Dim it to indicate it's unclickable
        seat.classList.remove("selected"); // Deselect if it's not clickable
      }
    } else if (["FG-OFFR", "FLT-IT", "SQN-LDR", "WG CDR"].includes(rank)) {
      if (seatRanges["OFFICERS"].includes(seatId)) {
        seat.style.pointerEvents = "auto"; // Enable
        seat.style.opacity = "1"; // Make it visible
      } else {
        seat.style.pointerEvents = "none"; // Disable
        seat.style.opacity = "0.5"; // Dim it to indicate it's unclickable
        seat.classList.remove("selected"); // Deselect if it's not clickable
      }
    } else if (["JWO", "WO", "MWO"].includes(rank)) {
      if (seatRanges["WARRANT RANK"].includes(seatId)) {
        seat.style.pointerEvents = "auto"; // Enable
        seat.style.opacity = "1"; // Make it visible
      } else {
        seat.style.pointerEvents = "none"; // Disable
        seat.style.opacity = "0.5"; // Dim it to indicate it's unclickable
        seat.classList.remove("selected"); // Deselect if it's not clickable
      }
    } else {
      seat.style.pointerEvents = "auto"; // Enable all other seats
      seat.style.opacity = "1"; // Reset opacity
    }
  });
}


function handleSeatSelection(seat) {
  const seatCount = parseInt(maxSeatsInput.value) || 0;
  const seatId = seat.id;

  // Check if the seat is already booked or selected
  if (seat.classList.contains("booked")) {
    return; // Ignore clicks on booked seats
  }

  // Toggle selection based on seat count
  if (selectedSeats.includes(seatId)) {
    // Deselect the seat
    seat.classList.remove("selected");
    selectedSeats = selectedSeats.filter((id) => id !== seatId);
  } else if (selectedSeats.length < seatCount) {
    // Select the seat if the limit is not reached
    seat.classList.add("selected");
    selectedSeats.push(seatId); // Add seat ID to selection
  } else {
    alert(`You can only select ${seatCount} seat(s).`);
  }
}

function clearSelectedSeats() {
  selectedSeats.forEach(seatId => {
    const seat = document.getElementById(seatId);
    if (seat) {
      seat.classList.remove("selected"); // Remove selected class
    }
  });
  selectedSeats = []; // Clear selected seats
}

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent default form submission

  // Get user input
  const rank = document.getElementById("rank").value;
  const name = document.getElementById("name").value.trim();
  const seatCount = parseInt(maxSeatsInput.value);
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  // Validate form inputs
  const errorMessage = validateBookingForm(rank, name, seatCount, date, time);
  if (errorMessage) {
    displayErrorMessage(errorMessage);
    return;
  }

  // Check if the selected seats match the required seat count
  if (selectedSeats.length !== seatCount) {
    alert(`You must select exactly ${seatCount} seat(s).`);
    return;
  }

  // Book the selected seats
  bookSelectedSeats();

  // Update booking status
  updateBookingStatus(rank, selectedSeats.length);
  warningTableUpdate();
  // Display a success message
  alert(`Booking confirmed for seats: ${selectedSeats.join(", ")}`);
  saveTicketData(rank, name, seatCount, date, time);
  isBooked = true;
  // Clear selected seats and reset form
  clearBookingForm();
});

function validateBookingForm(rank, name, seatCount, date, time) {
  if (!rank) return "Please select your rank.";
  if (!name) return "Please enter your name.";
  if (!seatCount || seatCount <= 0) return "Please enter a valid seat number.";
  if (!date) return "Please select a date.";
  if (!time) return "Please select a time.";
  return null; // No error
}
function bookSelectedSeats() {
  selectedSeats.forEach((seatId) => {
    const seat = document.getElementById(seatId);
    seat.classList.add("booked");
    seat.classList.remove("selected");
  });
  updateBookedSeatsInSession(selectedSeats);
}
function updateBookedSeatsInSession(seats) {
  let bookedSeats = JSON.parse(sessionStorage.getItem("bookedSeats")) || [];
  bookedSeats = [...new Set([...bookedSeats, ...seats])]; // Avoid duplicates
  sessionStorage.setItem("bookedSeats", JSON.stringify(bookedSeats));
}

function updateBookingStatus(rank, seatCount) {
  console.log(`Updating booking status for rank: ${rank} with seatCount: ${seatCount}`);
  const rankRows = document.querySelectorAll("#bookingStatusTable tbody tr");
  let ranksToUpdate = [];

  // Determine which ranks to update based on the selected rank
  const trimmedRank = rank.trim();
  
  if (["AC", "LAC", "CPL", "AGV", "DSC", "NCE(E)"].includes(trimmedRank)) {
    ranksToUpdate = ["CPL & BELOW/DSC/NC(E)"]; // Update CPL & Below row
  } else if (trimmedRank === "SGT") {
    ranksToUpdate = ["SGT"]; // Only update SGT row
  } else if (["JWO", "WO", "MWO"].includes(trimmedRank)) {
    ranksToUpdate = ["WARRANT RANK"]; // Update Warrant ranks row
  } else {
    ranksToUpdate = ["OFFICERS"]; // Update Officers row
  }

  let foundMatch = false;

  ranksToUpdate.forEach((rankToUpdate) => {
    rankRows.forEach((row) => {
      const statusCell = row.querySelector("td:first-child").textContent.trim(); // Get the rank from the row

      // Check if the row corresponds to the rank to update
      if (statusCell === rankToUpdate) {
        foundMatch = true; // Match found
        const bookedCell = row.querySelector(".bookeds");
        const remainingCell = row.querySelector(".remaining");
      
        // Check if bookedCell and remainingCell are found
        if (!bookedCell || !remainingCell) {
          console.error("Booked or remaining cell not found for rank:", rankToUpdate);
          return; // Exit if elements are not found
        }
      
        const bookedSeats = parseInt(bookedCell.textContent) || 0;
        const remainingSeats = parseInt(remainingCell.textContent) || 0;
      
        // Check if enough seats are available
        if (remainingSeats < seatCount) {
          displayErrorMessage("Not enough remaining seats available.");
          return;
        }
      
        // Update the booked and remaining seats
        bookedCell.textContent = bookedSeats + seatCount;
        remainingCell.textContent = remainingSeats - seatCount;
      
        alert(`Booking confirmed for ${seatCount} seats in ${rankToUpdate}.`);
        updateWarningStatusTable(rankToUpdate, remainingSeats - seatCount);
        saveBookingStatusToSession();
        saveTableState();
      }
      
    });
  });

  if (!foundMatch) {
    displayErrorMessage("Rank not found in the table.");
  }
}



function saveTableState() {
  const statusData = [];
  const rankRows = document.querySelectorAll("#bookingStatusTable tbody tr");

  rankRows.forEach((row) => {
    const rank = row.querySelector("td:first-child").textContent.trim();
    const bookedSeats = row.querySelector(".bookeds").textContent.trim();
    const remainingSeats = row.querySelector(".remaining").textContent.trim();
    statusData.push({ rank, bookedSeats, remainingSeats });
  });

  sessionStorage.setItem("bookingStatus", JSON.stringify(statusData));
}
function saveBookingStatusToSession() {
  const statusData = [];
  const rankRows = document.querySelectorAll("#bookingStatusTable tbody tr");

  rankRows.forEach((row) => {
    const rank = row.querySelector("td:first-child").textContent.trim();
    const bookedSeats = row.querySelector(".bookeds").textContent.trim();
    const remainingSeats = row.querySelector(".remaining").textContent.trim();
    statusData.push({ rank, bookedSeats, remainingSeats });
  });

  sessionStorage.setItem("bookingStatus", JSON.stringify(statusData));
}

function updateWarningStatusTable(rank, remainingSeats) {
  const warningRows = document.querySelectorAll("#warningStatusTable tbody tr");
  let foundMatch = false;

  warningRows.forEach((row) => {
    const statusCell = row.querySelector("td:first-child").textContent.trim();

    // Compare the rank from the booking status table with the rank in the warning table
    if (statusCell.includes(rank) || rank.includes(statusCell)) {
      foundMatch = true;

      // Update the warning status based on remaining seats
      const warningCell = row.querySelector(".warning");

      if (remainingSeats <= 0) {
        warningCell.textContent = "Housefull";
        warningCell.style.color = "red"; // Set text color to red
      } else {
        warningCell.textContent = ""; // Clear warning if seats are available
      }
    }
  });

  // If no match is found, you may want to add a new row for that rank with "Housefull"
  if (!foundMatch && remainingSeats <= 0) {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `<td>${rank}</td><td class="warning" style="color: red;">Housefull</td>`;
    document.querySelector("#warningStatusTable tbody").appendChild(newRow);
  }
  saveWarningStatusToSession();
}
function saveWarningStatusToSession() {
  const warningData = [];
  const warningRows = document.querySelectorAll("#warningStatusTable tbody tr");

  warningRows.forEach((row) => {
    const rank = row.querySelector("td:first-child").textContent.trim();
    const warningText = row.querySelector(".warning").textContent.trim();
    warningData.push({ rank, warningText });
  });

  sessionStorage.setItem("warningStatus", JSON.stringify(warningData));
}

function clearBookingForm() {
  bookingForm.reset(); // Reset form fields
  selectedSeats = []; // Clear selected seats
  errorContainer.textContent = ""; // Clear error messages
}
function displayErrorMessage(message) {
  errorContainer.textContent = message; // Display error message
}

function saveTicketData(rank, name, seatCount, date, time) {
  const ticketData = {
    rank,
    name,
    seats: selectedSeats,
    date,
    time,
  };
  const bookingHistory =
    JSON.parse(sessionStorage.getItem("bookingHistory")) || [];
  bookingHistory.push(ticketData);
  sessionStorage.setItem("bookingHistory", JSON.stringify(bookingHistory));

  // Store data in session storage
  sessionStorage.setItem("ticketData", JSON.stringify(ticketData));
  console.log("Saving ticket data:", ticketData);
}

function warningTableUpdate() {
  // Get unsold value
  // If unsold value is < 10, Show X tickets left inside warning table
  // If unsold value is === 0, Show House-Full inside warning table
  // Else Show dash in warning table

  let unsoldElements = document.getElementsByClassName("remaining");
  let warningElements = document.getElementsByClassName("warning");


  for (let i = 0; i < unsoldElements.length; i++) {
    let unsold = parseInt(unsoldElements[i].innerHTML); 

    if (unsold < 10 && unsold > 0) {
      warningElements[i].innerHTML = `${unsold} tickets left`;
    } else if (unsold === 0) {
      warningElements[i].innerHTML = "House-Full";
    } else {
      warningElements[i].innerHTML = "-";
    }
  }
}

// This will ensure the function runs when the page fully loads
window.addEventListener('load',function(){
  warningTableUpdate() // Call the function when the page loads
});


function displayTickets() {
  // Collect form data
  if (!isBooked) {
    alert("Please book your tickets first.");
    return;
  }

  // Redirect to the tickets page
  window.location.href = "tickets.html"; // Ensure this file exists
}
document.addEventListener("DOMContentLoaded", () => {
  // Get booked seats from sessionStorage
  const bookedSeats = JSON.parse(sessionStorage.getItem("bookedSeats")) || [];

  // Apply booked class to each booked seat
  bookedSeats.forEach((seatId) => {
    const seat = document.getElementById(seatId);
    if (seat) {
      seat.classList.add("booked");
    }
  });
  bookedSeats.forEach((seatId) => {
    const seat = document.getElementById(seatId);
    if (seat) {
      seat.style.pointerEvents = "none"; // Make booked seats unclickable
    }
  });
});
document.addEventListener("DOMContentLoaded", function () {
  loadTableState();
});

function loadTableState() {
  const statusData = JSON.parse(sessionStorage.getItem("bookingStatus")) || [];

  const rankRows = document.querySelectorAll("#bookingStatusTable tbody tr");

  rankRows.forEach((row) => {
    const rank = row.querySelector("td:first-child").textContent.trim();
    const matchedData = statusData.find((data) => data.rank === rank);

    if (matchedData) {
      row.querySelector(".bookeds").textContent = matchedData.bookedSeats;
      row.querySelector(".remaining").textContent = matchedData.remainingSeats;
    }
  });
}
document.addEventListener("DOMContentLoaded", function () {
  loadWarningStatus();
});

function loadWarningStatus() {
  const warningData = JSON.parse(sessionStorage.getItem("warningStatus")) || [];
  const warningRows = document.querySelectorAll("#warningStatusTable tbody tr");

  warningRows.forEach((row) => {
    const rank = row.querySelector("td:first-child").textContent.trim();
    const matchedData = warningData.find((data) => data.rank === rank);

    if (matchedData) {
      const warningCell = row.querySelector(".warning");
      warningCell.textContent = matchedData.warningText;
      if (matchedData.warningText === "Housefull") {
        warningCell.style.color = "red"; // Ensure text is red for "Housefull"
      } else {
        warningCell.style.color = ""; // Reset color if not housefull
      }
    }
  });
}