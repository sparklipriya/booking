// JavaScript to handle booking
let selectedSeats = [];
const maxSeatsInput = document.getElementById('seat');

document.querySelectorAll('.seat').forEach(seat => {
    seat.addEventListener('click', () => {
        const seatCount = parseInt(maxSeatsInput.value) || 0; // Default to 0 if invalid


        // Check if the seat is already booked
        if (seat.classList.contains('booked')) {
            alert('This seat is already booked!');
            return;
        }

        // Toggle selection
        if (seat.classList.contains('selected')) {
            seat.classList.remove('selected');
            selectedSeats = selectedSeats.filter(s => s !== seat.id); // Remove seat from selection
        } else {
            if (selectedSeats.length < seatCount) {
                seat.classList.add('selected');
                selectedSeats.push(seat.id); // Add seat to selection
            } else {
                alert(`You can only select ${seatCount} seats.`);
            }
        }
    });
});

document.getElementById('bookingForm').addEventListener('submit', function (event) {
    let valid = true;
    let errorMessage = '';

    const rank = document.getElementById('rank').value;
    const name = document.getElementById('name').value.trim();
    const seatCount = parseInt(maxSeatsInput.value);
    

    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    if (!rank) {
        valid = false;
        errorMessage += 'Please select your rank.\n';
    }
    if (!name) {
        valid = false;
        errorMessage += 'Please enter your name.\n';
    }
    if (!seatCount || seatCount <= 0) {
        valid = false;
        errorMessage += 'Please enter a valid seat number.\n';
    }
    if (!date) {
        valid = false;
        errorMessage += 'Please select a date.\n';
    }
    if (!time) {
        valid = false;
        errorMessage += 'Please select a time.\n';
    }

    if (!valid) {
        event.preventDefault(); // Prevent form submission
        alert(errorMessage); // Show error messages
    } else {
        // Mark the selected seats as booked
        selectedSeats.forEach(seatId => {
            const seat = document.getElementById(seatId);
            seat.classList.add('booked'); // Mark the seat as booked
            seat.classList.remove('selected'); // Remove selection visual
        });
        alert(`Booking confirmed for seats: ${selectedSeats.join(', ')}`);
        
        // Keep booked seats in selectedSeats for future use, if needed
        // Clear the selection array to prevent confusion
        // Call updateBookingStatus after confirming the booking
        updateBookingStatus(rank, selectedSeats.length);

        selectedSeats = [];
    }
});

function updateBookingStatus(rank, seatCount) {
    const rankRows = document.querySelectorAll('.status-table tbody tr');

    rankRows.forEach(row => {
        const statusCell = row.querySelector('td:first-child'); // Get the status cell

        // Check if the rank matches the status in the cell
        if (statusCell.textContent === rank) {
            const bookedCell = row.querySelector('.bookeds'); // Select booked cell
            const remainingCell = row.querySelector('.remaining'); // Select remaining cell
            const seatCount = parseInt(maxSeatsInput.value);
            console.log('Seat count:', seatCount);

            // Update booked and remaining counts
            bookedCell.textContent = parseInt(bookedCell.textContent) + seatCount; // Increment booked seats
            remainingCell.textContent = parseInt(remainingCell.textContent) - seatCount; // Decrement remaining seats
        }
    });
}