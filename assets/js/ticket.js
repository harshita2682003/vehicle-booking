// Ticket Information Script

document.addEventListener('DOMContentLoaded', function() {
    // Get booking details from session storage
    const selectedSeats = JSON.parse(sessionStorage.getItem('selectedSeats') || '[]');
    const grandTotal = parseFloat(sessionStorage.getItem('grandTotal') || '0.00');
    const bookingReference = sessionStorage.getItem('bookingReference') || 'RB-' + Math.floor(100000 + Math.random() * 900000);
    const vehicleName = sessionStorage.getItem('vehicleName') || 'Luxury Bus';
    const vehicleDetails = sessionStorage.getItem('vehicleDetails') || '40 Seats • Air Conditioned • WiFi';
    const tripDatetime = sessionStorage.getItem('tripDatetime') || 'Aug 10, 2023 at 10:00 AM';
    const tripRoute = sessionStorage.getItem('tripRoute') || 'New York City to Boston';
    
    // Set current date
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    document.getElementById('current-date').textContent = formattedDate;
    
    // Set booking reference
    document.getElementById('booking-reference').textContent = bookingReference;
    
    // Set vehicle details
    document.getElementById('vehicle-name').textContent = vehicleName;
    document.getElementById('vehicle-details').textContent = vehicleDetails;
    
    // Set vehicle icon based on vehicle name
    const vehicleIcon = document.getElementById('vehicle-icon');
    if (vehicleName.toLowerCase().includes('car')) {
        vehicleIcon.className = 'fas fa-car text-gray-500 text-2xl';
    } else if (vehicleName.toLowerCase().includes('bike')) {
        vehicleIcon.className = 'fas fa-motorcycle text-gray-500 text-2xl';
    } else {
        vehicleIcon.className = 'fas fa-bus text-gray-500 text-2xl';
    }
    
    // Set trip details
    const tripParts = tripDatetime.split(' at ');
    const tripDate = tripParts[0];
    const tripTime = tripParts[1];
    
    // Set pickup/dropoff info
    const routeParts = tripRoute.split(' to ');
    const pickupCity = routeParts[0];
    const dropoffCity = routeParts[1];
    
    document.getElementById('pickup-location').textContent = pickupCity;
    document.getElementById('pickup-datetime').textContent = tripDatetime;
    document.getElementById('dropoff-location').textContent = dropoffCity;
    document.getElementById('dropoff-date').textContent = tripDate;
    
    // Fill in seat information
    const seatsTable = document.getElementById('seats-table');
    seatsTable.innerHTML = '';
    
    if (selectedSeats.length === 0) {
        // Add a default row if no seats were selected
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-200';
        row.innerHTML = `
            <td class="py-3 px-4 text-gray-600" colspan="3">No specific seats were selected for this booking.</td>
        `;
        seatsTable.appendChild(row);
    } else {
        // Add each selected seat
        let subtotal = 0;
        
        selectedSeats.forEach(seat => {
            const row = document.createElement('tr');
            row.className = 'border-b border-gray-200';
            row.innerHTML = `
                <td class="py-3 px-4 text-gray-900">${seat.seatLabel}</td>
                <td class="py-3 px-4 text-gray-900">${seat.seatType}</td>
                <td class="py-3 px-4 text-gray-900">$${seat.seatPrice.toFixed(2)}</td>
            `;
            seatsTable.appendChild(row);
            subtotal += parseFloat(seat.seatPrice);
        });
    }
    
    // Set total amount
    document.getElementById('total-amount').textContent = `$${grandTotal.toFixed(2)}`;
    
    // Set price breakdown
    const priceBreakdown = document.getElementById('price-breakdown');
    const subtotal = grandTotal * 0.75; // Approximate the subtotal
    const serviceFee = 5.00;
    const taxAmount = grandTotal * 0.08; // 8% tax
    
    priceBreakdown.innerHTML = `
        <div class="flex justify-between">
            <span class="text-gray-600">Seat Charges</span>
            <span class="text-gray-900">$${subtotal.toFixed(2)}</span>
        </div>
        <div class="flex justify-between">
            <span class="text-gray-600">Service Fee</span>
            <span class="text-gray-900">$${serviceFee.toFixed(2)}</span>
        </div>
        <div class="flex justify-between">
            <span class="text-gray-600">Taxes & Fees (8%)</span>
            <span class="text-gray-900">$${taxAmount.toFixed(2)}</span>
        </div>
        <div class="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold">
            <span class="text-gray-900">Total</span>
            <span class="text-green-600">$${grandTotal.toFixed(2)}</span>
        </div>
    `;
});

// Email ticket function (mock)
function emailTicket() {
    alert('Your ticket has been sent to the email address on file.');
}