// State Management
let currentUser = null;
let trains = [];
let bookings = [];

// Initialize app on page load
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    loadTrainsData();
});

// Check if user is logged in
function checkLoginStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    }
}

// Update UI when user is logged in
function updateUIForLoggedInUser() {
    document.getElementById('logoutBtn').style.display = 'block';
    // Hide auth section if on home page
    const authContainer = document.querySelector('.auth-container');
    if (authContainer) {
        authContainer.style.display = 'none';
    }
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.innerHTML = `
            <h1>Welcome back, ${currentUser.name}!</h1>
            <p class="hero-subtitle">Ready to book your next journey?</p>
        `;
    }
}

// Load trains data from JSON (simulating backend call)
async function loadTrainsData() {
    try {
        // In production, this would be an API call to your Java backend
        // For now, we'll use hardcoded data matching your trains.json structure
        trains = [
            {
                trainId: "rats",
                trainNo: "34522",
                seats: [
                    [0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0]
                ],
                stationTimes: {
                    bangalore: "21:50:00",
                    jaipur: "22:50:00",
                    delhi: "24:35:00"
                },
                stations: ["bangalore", "jaipur", "delhi"]
            },
            {
                trainId: "bacs",
                trainNo: "12345",
                seats: [
                    [0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0]
                ],
                stationTimes: {
                    bangalore: "13:50:00",
                    jaipur: "13:50:00",
                    delhi: "13:50:00"
                },
                stations: ["bangalore", "jaipur", "delhi"]
            }
        ];
    } catch (error) {
        console.error('Error loading trains:', error);
        showAlert('error', 'Failed to load trains data');
    }
}

// Navigation Functions
function showSection(sectionName) {
    // Remove active class from all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected section
    const section = document.getElementById(`${sectionName}-section`);
    if (section) {
        section.classList.add('active');
    }
    
    // Add active class to clicked nav link
    event.target.classList.add('active');
    
    // Load data based on section
    if (sectionName === 'bookings') {
        if (!currentUser) {
            showAlert('error', 'Please login to view bookings');
            showSection('home');
            return;
        }
        loadBookings();
    }
}

// Toggle between login and signup forms
function toggleAuthForm() {
    const loginCard = document.getElementById('loginCard');
    const signupCard = document.getElementById('signupCard');
    
    if (loginCard.style.display === 'none') {
        loginCard.style.display = 'block';
        signupCard.style.display = 'none';
    } else {
        loginCard.style.display = 'none';
        signupCard.style.display = 'block';
    }
}

// Handle Signup
async function handleSignup(event) {
    event.preventDefault();
    
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    if (password !== confirmPassword) {
        showAlert('error', 'Passwords do not match!');
        return;
    }
    
    try {
        // In production, this would be an API call to your Java backend
        // POST /api/signup with username and password
        
        // Simulate backend response
        const newUser = {
            name: username,
            userId: generateUUID(),
            ticketsBooked: []
        };
        
        // Save to localStorage (in production, this would be handled by backend)
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if username already exists
        if (users.some(u => u.name === username)) {
            showAlert('error', 'Username already exists!');
            return;
        }
        
        users.push({ ...newUser, password: hashPassword(password) });
        localStorage.setItem('users', JSON.stringify(users));
        
        showAlert('success', 'Account created successfully! Please login.');
        toggleAuthForm();
        document.getElementById('signupForm').reset();
        
    } catch (error) {
        console.error('Signup error:', error);
        showAlert('error', 'Failed to create account. Please try again.');
    }
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        // In production, this would be an API call to your Java backend
        // POST /api/login with username and password
        
        // Simulate backend authentication
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.name === username && u.password === hashPassword(password));
        
        if (!user) {
            showAlert('error', 'Invalid username or password!');
            return;
        }
        
        currentUser = {
            name: user.name,
            userId: user.userId,
            ticketsBooked: user.ticketsBooked || []
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        showAlert('success', `Welcome back, ${currentUser.name}!`);
        updateUIForLoggedInUser();
        document.getElementById('loginForm').reset();
        
    } catch (error) {
        console.error('Login error:', error);
        showAlert('error', 'Login failed. Please try again.');
    }
}

// Handle Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    document.getElementById('logoutBtn').style.display = 'none';
    
    // Reset hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.innerHTML = `
            <h1>Welcome to IRCTC Railway Booking</h1>
            <p class="hero-subtitle">Book your train tickets easily and securely</p>
        `;
    }
    
    // Show auth container
    const authContainer = document.querySelector('.auth-container');
    if (authContainer) {
        authContainer.style.display = 'flex';
    }
    
    showAlert('success', 'Logged out successfully');
    showSection('home');
}

// Search Trains
async function handleSearchTrains(event) {
    event.preventDefault();
    
    const fromStation = document.getElementById('fromStation').value;
    const toStation = document.getElementById('toStation').value;
    
    if (fromStation === toStation) {
        showAlert('error', 'Source and destination cannot be the same!');
        return;
    }
    
    try {
        // In production, this would be an API call to your Java backend
        // GET /api/trains?from={fromStation}&to={toStation}
        
        // Filter trains that have both stations in their route
        const availableTrains = trains.filter(train => {
            const hasFrom = train.stations.includes(fromStation);
            const hasTo = train.stations.includes(toStation);
            const fromIndex = train.stations.indexOf(fromStation);
            const toIndex = train.stations.indexOf(toStation);
            return hasFrom && hasTo && fromIndex < toIndex;
        });
        
        displaySearchResults(availableTrains, fromStation, toStation);
        
    } catch (error) {
        console.error('Search error:', error);
        showAlert('error', 'Failed to search trains. Please try again.');
    }
}

// Display search results
function displaySearchResults(trainList, fromStation, toStation) {
    const resultsContainer = document.getElementById('searchResults');
    
    if (trainList.length === 0) {
        resultsContainer.innerHTML = `
            <div class="empty-state">
                <p>No trains found for this route</p>
            </div>
        `;
        return;
    }
    
    const resultsHTML = trainList.map(train => {
        const availableSeats = countAvailableSeats(train.seats);
        const departureTime = train.stationTimes[fromStation];
        const arrivalTime = train.stationTimes[toStation];
        
        return `
            <div class="train-card">
                <div class="train-header">
                    <div class="train-info">
                        <h3>Train ${train.trainNo}</h3>
                        <span class="train-number">ID: ${train.trainId}</span>
                    </div>
                    <button class="btn-book" onclick="openBookingModal('${train.trainId}', '${fromStation}', '${toStation}')" ${!currentUser ? 'disabled' : ''}>
                        ${currentUser ? 'Book Now' : 'Login to Book'}
                    </button>
                </div>
                <div class="train-details">
                    <div class="detail-item">
                        <span class="detail-label">From</span>
                        <span class="detail-value">${capitalizeFirst(fromStation)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">To</span>
                        <span class="detail-value">${capitalizeFirst(toStation)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Departure</span>
                        <span class="detail-value">${departureTime}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Arrival</span>
                        <span class="detail-value">${arrivalTime}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Available Seats</span>
                        <span class="detail-value seats-available">${availableSeats}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    resultsContainer.innerHTML = resultsHTML;
}

// Count available seats
function countAvailableSeats(seats) {
    let count = 0;
    seats.forEach(row => {
        row.forEach(seat => {
            if (seat === 0) count++;
        });
    });
    return count;
}

// Open booking modal
function openBookingModal(trainId, fromStation, toStation) {
    if (!currentUser) {
        showAlert('error', 'Please login to book tickets');
        return;
    }
    
    const train = trains.find(t => t.trainId === trainId);
    const modal = document.getElementById('bookingModal');
    const container = document.getElementById('bookingFormContainer');
    
    container.innerHTML = `
        <div class="booking-details">
            <div class="detail-item">
                <span class="detail-label">Train</span>
                <span class="detail-value">${train.trainNo}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">From</span>
                <span class="detail-value">${capitalizeFirst(fromStation)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">To</span>
                <span class="detail-value">${capitalizeFirst(toStation)}</span>
            </div>
        </div>
        <form onsubmit="handleBooking(event, '${trainId}', '${fromStation}', '${toStation}')">
            <div class="form-group">
                <label>Number of Seats</label>
                <input type="number" id="numSeats" min="1" max="4" value="1" required>
            </div>
            <button type="submit" class="btn-primary">Confirm Booking</button>
        </form>
    `;
    
    modal.style.display = 'block';
}

// Close booking modal
function closeBookingModal() {
    document.getElementById('bookingModal').style.display = 'none';
}

// Handle booking
async function handleBooking(event, trainId, fromStation, toStation) {
    event.preventDefault();
    
    const numSeats = parseInt(document.getElementById('numSeats').value);
    
    try {
        // In production, this would be an API call to your Java backend
        // POST /api/book with trainId, fromStation, toStation, numSeats
        
        const train = trains.find(t => t.trainId === trainId);
        const availableSeats = countAvailableSeats(train.seats);
        
        if (numSeats > availableSeats) {
            showAlert('error', 'Not enough seats available!');
            return;
        }
        
        // Book seats
        let seatsBooked = [];
        let seatsNeeded = numSeats;
        
        for (let i = 0; i < train.seats.length && seatsNeeded > 0; i++) {
            for (let j = 0; j < train.seats[i].length && seatsNeeded > 0; j++) {
                if (train.seats[i][j] === 0) {
                    train.seats[i][j] = 1;
                    seatsBooked.push(`${i + 1}-${j + 1}`);
                    seatsNeeded--;
                }
            }
        }
        
        // Create booking
        const booking = {
            bookingId: generateUUID(),
            trainId: trainId,
            trainNo: train.trainNo,
            from: fromStation,
            to: toStation,
            seats: seatsBooked,
            numSeats: numSeats,
            bookingDate: new Date().toISOString()
        };
        
        // Add to user's bookings
        currentUser.ticketsBooked.push(booking);
        
        // Update localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.userId === currentUser.userId);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ticketsBooked: currentUser.ticketsBooked };
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        closeBookingModal();
        showAlert('success', `Booking confirmed! Seats: ${seatsBooked.join(', ')}`);
        
        // Refresh search results if on search page
        const searchResults = document.getElementById('searchResults');
        if (searchResults && searchResults.innerHTML) {
            const fromStationValue = document.getElementById('fromStation').value;
            const toStationValue = document.getElementById('toStation').value;
            if (fromStationValue && toStationValue) {
                handleSearchTrains(new Event('submit'));
            }
        }
        
    } catch (error) {
        console.error('Booking error:', error);
        showAlert('error', 'Failed to complete booking. Please try again.');
    }
}

// Load bookings
function loadBookings() {
    const bookingsList = document.getElementById('bookingsList');
    
    if (!currentUser || !currentUser.ticketsBooked || currentUser.ticketsBooked.length === 0) {
        bookingsList.innerHTML = `
            <div class="empty-state">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <rect x="10" y="30" width="60" height="40" rx="4" stroke="#bdc3c7" stroke-width="2"/>
                    <rect x="16" y="36" width="48" height="28" fill="#ecf0f1"/>
                    <circle cx="24" cy="64" r="6" stroke="#bdc3c7" stroke-width="2"/>
                    <circle cx="56" cy="64" r="6" stroke="#bdc3c7" stroke-width="2"/>
                    <rect x="30" y="10" width="20" height="24" stroke="#bdc3c7" stroke-width="2"/>
                </svg>
                <p>No bookings yet</p>
                <a href="#" onclick="showSection('search')" class="btn-secondary">Book a Ticket</a>
            </div>
        `;
        return;
    }
    
    const bookingsHTML = currentUser.ticketsBooked.map(booking => `
        <div class="booking-card">
            <div class="booking-header">
                <div class="booking-info">
                    <h3>Train ${booking.trainNo}</h3>
                    <span class="booking-id">Booking ID: ${booking.bookingId.substring(0, 8)}</span>
                </div>
                <button class="btn-cancel" onclick="cancelBooking('${booking.bookingId}')">Cancel</button>
            </div>
            <div class="booking-details">
                <div class="detail-item">
                    <span class="detail-label">From</span>
                    <span class="detail-value">${capitalizeFirst(booking.from)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">To</span>
                    <span class="detail-value">${capitalizeFirst(booking.to)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Seats</span>
                    <span class="detail-value">${booking.seats.join(', ')}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Booking Date</span>
                    <span class="detail-value">${new Date(booking.bookingDate).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    bookingsList.innerHTML = bookingsHTML;
}

// Cancel booking
async function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
    }
    
    try {
        // In production, this would be an API call to your Java backend
        // POST /api/cancel with bookingId
        
        const bookingIndex = currentUser.ticketsBooked.findIndex(b => b.bookingId === bookingId);
        if (bookingIndex === -1) {
            showAlert('error', 'Booking not found');
            return;
        }
        
        const booking = currentUser.ticketsBooked[bookingIndex];
        
        // Free up the seats
        const train = trains.find(t => t.trainId === booking.trainId);
        if (train) {
            booking.seats.forEach(seatStr => {
                const [row, col] = seatStr.split('-').map(n => parseInt(n) - 1);
                if (train.seats[row] && train.seats[row][col] !== undefined) {
                    train.seats[row][col] = 0;
                }
            });
        }
        
        // Remove booking
        currentUser.ticketsBooked.splice(bookingIndex, 1);
        
        // Update localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.userId === currentUser.userId);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ticketsBooked: currentUser.ticketsBooked };
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        showAlert('success', 'Booking cancelled successfully');
        loadBookings();
        
    } catch (error) {
        console.error('Cancel error:', error);
        showAlert('error', 'Failed to cancel booking. Please try again.');
    }
}

// Utility Functions
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function hashPassword(password) {
    // Simple hash function (in production, use proper hashing on backend)
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString();
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function showAlert(type, message) {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.position = 'fixed';
    alert.style.top = '80px';
    alert.style.right = '20px';
    alert.style.zIndex = '1001';
    alert.style.minWidth = '300px';
    alert.style.maxWidth = '500px';
    
    document.body.appendChild(alert);
    
    // Remove after 4 seconds
    setTimeout(() => {
        alert.remove();
    }, 4000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('bookingModal');
    if (event.target === modal) {
        closeBookingModal();
    }
}
