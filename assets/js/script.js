// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Initialize counters
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start counter animation when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
    
    // Check if we're on the booking page to initialize booking-specific functionality
    if (document.getElementById('search-form')) {
        initializeBookingProcess();
    }
    
    // Initialize URL parameter handling
    handleUrlParameters();
});

// Handle URL parameters to pre-fill form fields
function handleUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // If vehicle type is specified in URL, set it in the dropdown
    const vehicleType = urlParams.get('vehicle-type');
    if (vehicleType && document.getElementById('vehicle-type')) {
        document.getElementById('vehicle-type').value = vehicleType;
    }
    
    // Handle other parameters like location, date, etc.
    const location = urlParams.get('location');
    if (location && document.getElementById('pickup-location')) {
        document.getElementById('pickup-location').value = location;
    }
    
    const date = urlParams.get('date');
    if (date && document.getElementById('pickup-date')) {
        document.getElementById('pickup-date').value = date;
    }
}

// Booking Process Management
function initializeBookingProcess() {
    // Set today's date as the minimum date for the pickup date input
    const today = new Date().toISOString().split('T')[0];
    const pickupDateInput = document.getElementById('pickup-date');
    if (pickupDateInput) {
        pickupDateInput.min = today;
    }
}

// Step 1 to Step 2: Show vehicle results
function showVehicleResults() {
    // Hide step 1
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.classList.add('hidden');
    }
    
    // Show step 2
    const vehicleResults = document.getElementById('vehicle-results');
    if (vehicleResults) {
        vehicleResults.classList.remove('hidden');
    }
    
    // Hide step 3 and 4 (just in case they were visible)
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.classList.add('hidden');
    }
    
    const bookingConfirmation = document.getElementById('booking-confirmation');
    if (bookingConfirmation) {
        bookingConfirmation.classList.add('hidden');
    }
    
    // Update progress indicator
    const step2Circle = document.getElementById('step-2-circle');
    if (step2Circle) {
        step2Circle.classList.remove('bg-green-200');
        step2Circle.classList.add('bg-white', 'border-4', 'border-green-200');
    }
    
    // Get form values for summary
    const pickupLocation = document.getElementById('pickup-location')?.value || 'New York City, NY';
    const dropoffLocation = document.getElementById('dropoff-location')?.value || 'New York City, NY';
    const pickupDate = document.getElementById('pickup-date')?.value;
    const pickupTime = document.getElementById('pickup-time')?.value;
    
    // Format date for display
    let formattedDate = 'Aug 10, 2023';
    let formattedTime = '10:00 AM';
    
    if (pickupDate) {
        const dateObj = new Date(pickupDate);
        formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    
    if (pickupTime) {
        const timeObj = new Date(`2000-01-01T${pickupTime}`);
        formattedTime = timeObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    
    // Store these values for later use
    window.pickupLocation = pickupLocation;
    window.dropoffLocation = dropoffLocation;
    window.formattedDateTime = `${formattedDate} at ${formattedTime}`;
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Step 2 to Step 1: Go back to search form
function showSearchForm() {
    // Show step 1
    document.getElementById('search-form').classList.remove('hidden');
    
    // Hide step 2
    document.getElementById('vehicle-results').classList.add('hidden');
    
    // Reset progress indicator
    document.getElementById('step-2-circle').classList.remove('bg-white', 'border-4', 'border-green-200');
    document.getElementById('step-2-circle').classList.add('bg-green-200');
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Step 2 to Step 3: Select vehicle and go to seat selection
function selectVehicle(vehicleName) {
    // Store selected vehicle name
    window.selectedVehicle = vehicleName;
    
    // Set vehicle price based on selection
    let vehiclePrice = '$45.00';
    let basePrice = 45;
    let totalPrice = 72;
    let vehicleType = 'car';
    
    switch(vehicleName) {
        case 'Standard Sedan':
            vehiclePrice = '$45/day';
            basePrice = 45;
            totalPrice = 72;
            vehicleType = 'car';
            break;
        case 'Luxury SUV':
            vehiclePrice = '$89/day';
            basePrice = 89;
            totalPrice = 116;
            vehicleType = 'car';
            break;
        case 'Economy Compact':
            vehiclePrice = '$32/day';
            basePrice = 32;
            totalPrice = 59;
            vehicleType = 'car';
            break;
        case 'Mini Van':
            vehiclePrice = '$75/day';
            basePrice = 75;
            totalPrice = 102;
            vehicleType = 'car';
            break;
        case 'Luxury Bus':
            vehiclePrice = '$120/day';
            basePrice = 120;
            totalPrice = 150;
            vehicleType = 'bus';
            break;
        case 'City Bike':
            vehiclePrice = '$15/day';
            basePrice = 15;
            totalPrice = 20;
            vehicleType = 'bike';
            break;
    }
    
    // Store the vehicle details in session storage for use in seat selection page
    sessionStorage.setItem('vehicleName', vehicleName);
    sessionStorage.setItem('vehicleType', vehicleType);
    sessionStorage.setItem('vehicleBasePrice', basePrice);
    sessionStorage.setItem('vehicleTotalPrice', totalPrice);
    
    // Store pickup/dropoff details
    sessionStorage.setItem('pickupLocation', window.pickupLocation || 'New York City, NY');
    sessionStorage.setItem('dropoffLocation', window.dropoffLocation || 'New York City, NY');
    sessionStorage.setItem('tripDatetime', window.formattedDateTime || 'Aug 10, 2023 at 10:00 AM');
    
    // Build the URL for the seat selection page
    const seatSelectionUrl = `seat-selection.html?vehicle-type=${vehicleType}&vehicle-name=${encodeURIComponent(vehicleName)}&from=${encodeURIComponent(window.pickupLocation || 'New York City')}&to=${encodeURIComponent(window.dropoffLocation || 'Boston')}&trip-date=${encodeURIComponent(window.formattedDate || 'Aug 10, 2023')}&trip-time=${encodeURIComponent(window.formattedTime || '10:00 AM')}`;
    
    // Redirect to seat selection page
    window.location.href = seatSelectionUrl;
}

// Step 3 to Step 4: Complete booking and show confirmation
function completeBooking() {
    // Hide step 3
    document.getElementById('payment-form').classList.add('hidden');
    
    // Show step 4
    document.getElementById('booking-confirmation').classList.remove('hidden');
    
    // Update progress indicator
    document.getElementById('step-4-circle').classList.remove('bg-green-200');
    document.getElementById('step-4-circle').classList.add('bg-white', 'border-4', 'border-green-200');
    
    // Generate a random booking reference number
    const bookingReference = 'RB-' + Math.floor(10000 + Math.random() * 90000);
    document.getElementById('booking-reference').textContent = bookingReference;
    
    // Update confirmation details
    document.getElementById('confirmation-vehicle-name').textContent = window.selectedVehicle || 'Standard Sedan';
    document.getElementById('confirmation-pickup').textContent = window.pickupLocation || 'New York City, NY';
    document.getElementById('confirmation-dropoff').textContent = window.dropoffLocation || 'New York City, NY';
    document.getElementById('confirmation-pickup-datetime').textContent = window.formattedDateTime || 'Aug 10, 2023 at 10:00 AM';
    
    // Get total price from payment form
    const totalPrice = document.getElementById('total-price').textContent;
    document.getElementById('confirmation-total').textContent = totalPrice;
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Attractions slider
var swiper = new Swiper(".testimonials-slider", {
    slidesPerView: 3,
    spaceBetween: 20,
    speed: 800,
    loop: true,

    navigation: {
        nextEl: ".testimonials-arrow.swiper-button-next",
        prevEl: ".testimonials-arrow.swiper-button-prev",
    },
    breakpoints: {
        1200: { slidesPerView: 3 },
        768: { slidesPerView: 2 },
        576: { slidesPerView: 2 },
        0: { slidesPerView: 1 },
    },
});

// Attractions slider
var swiper = new Swiper(".categories-slider", {
    slidesPerView: 5,
    spaceBetween: 20,
    speed: 800,
    loop: true,

    navigation: {
        nextEl: ".categories-arrow.swiper-button-next",
        prevEl: ".categories-arrow.swiper-button-prev",
    },
    breakpoints: {
        1200: { slidesPerView: 5 },
        768: { slidesPerView: 3 },
        576: { slidesPerView: 2 },
        0: { slidesPerView: 1 },
    },
});


