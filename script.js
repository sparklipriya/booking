const bookingForm = document.getElementById('bookingForm');
const seats = document.querySelectorAll('.seat');
const maxSeatsInput = document.getElementById('seat');
const bookingStatusTable = document.getElementById('bookingStatusTable');
const errorContainer = document.getElementById('errorContainer'); // Container for error messages
let selectedSeats = [];
seats.forEach(seat => {
    seat.addEventListener('click', () => handleSeatSelection(seat));
  });

  function handleSeatSelection(seat) {
    const seatCount = parseInt(maxSeatsInput.value) || 0;
    const seatId = seat.id;
  
    // Check if the seat is already booked or selected
    if (seat.classList.contains('booked')) {
      return; // Ignore clicks on booked seats
    }
  
    // Toggle selection based on seat count
    if (selectedSeats.includes(seatId)) {
      // Deselect the seat
      seat.classList.remove('selected');
      selectedSeats = selectedSeats.filter(id => id !== seatId);
    } else if (selectedSeats.length < seatCount) {
      // Select the seat if the limit is not reached
      seat.classList.add('selected');
      selectedSeats.push(seatId); // Add seat ID to selection
    } else {
      alert(`You can only select ${seatCount} seat(s).`);
    }
  }  

  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission
  
    // Get user input
    const rank = document.getElementById('rank').value;
    const name = document.getElementById('name').value.trim();
    const seatCount = parseInt(maxSeatsInput.value);
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
  
    // Validate form inputs
    const errorMessage = validateBookingForm(rank, name, seatCount, date, time);
    if (errorMessage) {
      displayErrorMessage(errorMessage);
      return;
    }
  
    // Check if the selected seats match the required seat count
    if (selectedSeats.length !== seatCount) {
      displayErrorMessage(`You must select exactly ${seatCount} seat(s).`);
      return;
    }
  
    // Book the selected seats
    bookSelectedSeats();
  
    // Update booking status
    updateBookingStatus(rank, selectedSeats.length);
  
    // Display a success message
    alert(`Booking confirmed for seats: ${selectedSeats.join(', ')}`);
  
    // Clear selected seats and reset form
    clearBookingForm();
  });

  function validateBookingForm(rank, name, seatCount, date, time) {
    if (!rank) return 'Please select your rank.';
    if (!name) return 'Please enter your name.';
    if (!seatCount || seatCount <= 0) return 'Please enter a valid seat number.';
    if (!date) return 'Please select a date.';
    if (!time) return 'Please select a time.';
    return null; // No error
  }
  function bookSelectedSeats() {
    selectedSeats.forEach(seatId => {
      const seat = document.getElementById(seatId);
      seat.classList.add('booked');
      seat.classList.remove('selected');
    });
  }
  function updateBookingStatus(rank, seatCount) {
    const rankRows = document.querySelectorAll('.status-table tbody tr');
  
    rankRows.forEach(row => {
      const statusCell = row.querySelector('td:first-child');
  
      if (statusCell.textContent === rank) {
        const bookedCell = row.querySelector('.bookeds');
        const remainingCell = row.querySelector('.remaining');
  
        bookedCell.textContent = parseInt(bookedCell.textContent) + seatCount;
        remainingCell.textContent = parseInt(remainingCell.textContent) - seatCount;
      }
    });
  }  
  function clearBookingForm() {
    bookingForm.reset(); // Reset form fields
    selectedSeats = []; // Clear selected seats
    errorContainer.textContent = ''; // Clear error messages
  }
  function displayErrorMessage(message) {
    errorContainer.textContent = message; // Display error message
  }