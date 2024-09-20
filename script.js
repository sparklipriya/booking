document.addEventListener('DOMContentLoaded', function () {
    const seats = document.querySelectorAll('.seat');
    const seatsInput = document.getElementById('seats');
    const form = document.getElementById('booking-form');
    const submitButton = document.querySelector('.btn-ok');
    
    // Initialize an object to track booked seats per rank
    const bookedSeatsCountPerRank = {
        'NC(E)/CIV': 0,
        'CPL & BELOW': 0,
        'SGT': 0,
        'WARRANT RANK': 0,
        'OFFICERS': 0
    };

    // Handle seat click
    seats.forEach(seat => {
        seat.addEventListener('click', function () {
            if (!seat.classList.contains('booked')) {
                seat.classList.toggle('selected');
                updateSeatsInput();
            }
        });
    });

    // Function to update input field with selected seats
    function updateSeatsInput() {
        const selectedSeats = Array.from(seats)
            .filter(seat => seat.classList.contains('selected') && !seat.classList.contains('booked'))
            .map(seat => seat.dataset.seat);
        
        const seatCount = selectedSeats.length;
        const seatList = selectedSeats.join(' '); // Join without commas
        
        seatsInput.value = ` seat(s) selected: ${seatList}`;
    }

    // Function to update booking status table
    function updateBookingStatusTable(rank, bookedSeatsCount) {
        // Select all rows from the booking status table
        const tableRows = document.querySelectorAll('.table-container.booking-status tbody tr');

        tableRows.forEach(row => {
            const statusCell = row.cells[0]; // The first cell contains the rank
            const totalSeatsCell = row.cells[1]; // The second cell contains the total seats
            const bookedSeatsCell = row.cells[2]; // The third cell contains the booked seats
            const remainingSeatsCell = row.cells[3]; // The fourth cell contains the remaining seats

            if (statusCell.textContent.trim() === rank) {
                const totalSeats = parseInt(totalSeatsCell.textContent, 10);
                const currentBookedSeats = bookedSeatsCountPerRank[rank] || 0; // Get the current booked seats count for the rank
                
                // Update the booked and remaining seats
                bookedSeatsCell.textContent = currentBookedSeats;
                remainingSeatsCell.textContent = totalSeats - currentBookedSeats;
                
                // Add visual indicator if near full
                if (totalSeats - currentBookedSeats <= 5) {
                    row.classList.add('status-near-full');
                } else {
                    row.classList.remove('status-near-full');
                }
            }
        });
    }

    // Validate form fields
    function validateForm() {
        const formFields = form.querySelectorAll('input, select');
        let isValid = true;

        formFields.forEach(field => {
            if (field.required && !field.value.trim()) {
                isValid = false;
                return false; // Exit loop early
            }
        });

        return isValid;
    }

    // Handle form submission
    function handleSubmit() {
        const selectedSeats = Array.from(seats)
            .filter(seat => seat.classList.contains('selected'))
            .map(seat => seat.dataset.seat);

        if (validateForm()) {
            if (selectedSeats.length > 0) {
                const booker = document.getElementById('name').value;
                const date = document.getElementById('date').value;
                const time = document.getElementById('time').value;
                const rank = document.getElementById('rank').value.trim(); // Get selected rank from the form and trim any extra spaces
                
                // Mark the selected seats as booked
                selectedSeats.forEach(seat => {
                    const seatElement = document.querySelector(`.seat[data-seat="${seat}"]`);
                    if (seatElement) {
                        seatElement.classList.add('booked');
                        seatElement.classList.remove('selected'); // Remove 'selected' class
                    }
                });

                // Update booked seats count for the rank
                bookedSeatsCountPerRank[rank] = (bookedSeatsCountPerRank[rank] || 0) + selectedSeats.length;

                // Update booking status table
                updateBookingStatusTable(rank, bookedSeatsCountPerRank[rank]);

                // Show success message
                alert(`Seats ${selectedSeats.join(' ')} booked successfully!`);

                // Clear form fields
                form.reset();
                seatsInput.value = ''; // Clear selected seats input field

            } else {
                alert('No seats selected. Please select seats and try again.');
            }
        } else {
            alert('Incomplete details. Please fill out all required fields.');
        }
    }

    // Handle "Okay" button click
    submitButton.addEventListener('click', function () {
        handleSubmit();
    });
});
