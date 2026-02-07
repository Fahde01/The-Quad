// Data Storage (LocalStorage)
const storage = {
    getUsers: () => JSON.parse(localStorage.getItem('users') || '[]'),
    saveUsers: (users) => localStorage.setItem('users', JSON.stringify(users)),
    getCurrentUser: () => JSON.parse(localStorage.getItem('currentUser') || 'null'),
    setCurrentUser: (user) => localStorage.setItem('currentUser', JSON.stringify(user)),
    logout: () => localStorage.removeItem('currentUser'),
    getBusinesses: () => JSON.parse(localStorage.getItem('businesses') || '[]'),
    saveBusinesses: (businesses) => localStorage.setItem('businesses', JSON.stringify(businesses)),
    getPosts: () => JSON.parse(localStorage.getItem('posts') || '[]'),
    savePosts: (posts) => localStorage.setItem('posts', JSON.stringify(posts)),
    getReviews: () => JSON.parse(localStorage.getItem('reviews') || '[]'),
    saveReviews: (reviews) => localStorage.setItem('reviews', JSON.stringify(reviews))
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = storage.getCurrentUser();
    if (currentUser) {
        showDashboard(currentUser);
    }
    
    // Initialize demo data if first time
    if (storage.getUsers().length === 0) {
        initializeDemoData();
    }
});

// Initialize demo data
function initializeDemoData() {
    const demoUsers = [
        {
            id: 1,
            name: 'John Smith',
            email: 'john@example.com',
            password: 'demo123',
            type: 'renderer'
        },
        {
            id: 2,
            name: 'Jane Doe',
            email: 'jane@example.com',
            password: 'demo123',
            type: 'user'
        }
    ];
    
    const demoBusinesses = [
        {
            id: 1,
            userId: 1,
            name: 'Smith Home Services',
            category: 'Home Services',
            bio: 'Professional home repair and maintenance services with 10+ years of experience. We specialize in plumbing, electrical work, and general repairs.',
            phone: '(555) 123-4567',
            location: 'New York, NY'
        }
    ];
    
    const demoPosts = [
        {
            id: 1,
            businessId: 1,
            title: 'Professional Plumbing Services',
            description: 'Expert plumbing repairs and installations. Available 24/7 for emergencies.',
            price: '$75/hour',
            date: new Date().toISOString()
        },
        {
            id: 2,
            businessId: 1,
            title: 'Electrical Repairs',
            description: 'Licensed electrician available for all your electrical needs.',
            price: '$90/hour',
            date: new Date().toISOString()
        }
    ];
    
    const demoReviews = [
        {
            id: 1,
            businessId: 1,
            userId: 2,
            userName: 'Jane Doe',
            rating: 5,
            comment: 'Excellent service! Very professional and timely.',
            date: new Date().toISOString()
        }
    ];
    
    storage.saveUsers(demoUsers);
    storage.saveBusinesses(demoBusinesses);
    storage.savePosts(demoPosts);
    storage.saveReviews(demoReviews);
}

// Modal Functions
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function switchToSignup() {
    closeModal('loginModal');
    showModal('signupModal');
}

function switchToLogin() {
    closeModal('signupModal');
    showModal('loginModal');
}

// Button event listeners
document.getElementById('loginBtn').addEventListener('click', () => showModal('loginModal'));
document.getElementById('signupBtn').addEventListener('click', () => showModal('signupModal'));

// Close modal when clicking outside
window.onclick = (event) => {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};

// Authentication
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const users = storage.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        storage.setCurrentUser(user);
        closeModal('loginModal');
        showDashboard(user);
        showAlert('Login successful!', 'success');
    } else {
        showAlert('Invalid email or password', 'error');
    }
}

function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const type = document.getElementById('accountType').value;
    
    const users = storage.getUsers();
    
    if (users.find(u => u.email === email)) {
        showAlert('Email already registered', 'error');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        type
    };
    
    users.push(newUser);
    storage.saveUsers(users);
    
    // If renderer, create empty business profile
    if (type === 'renderer') {
        const businesses = storage.getBusinesses();
        businesses.push({
            id: Date.now(),
            userId: newUser.id,
            name: '',
            category: '',
            bio: '',
            phone: '',
            location: ''
        });
        storage.saveBusinesses(businesses);
    }
    
    storage.setCurrentUser(newUser);
    closeModal('signupModal');
    showDashboard(newUser);
    showAlert('Account created successfully!', 'success');
}

function logout() {
    storage.logout();
    location.reload();
}

// Dashboard
function showDashboard(user) {
    // Hide hero and about sections
    document.querySelector('.hero').style.display = 'none';
    document.querySelector('.about').style.display = 'none';
    
    // Show dashboard
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('userName').textContent = user.name;
    
    // Update nav buttons
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('signupBtn').style.display = 'none';
    
    if (user.type === 'renderer') {
        document.getElementById('rendererDashboard').style.display = 'block';
        document.getElementById('userDashboard').style.display = 'none';
        loadRendererDashboard(user);
    } else {
        document.getElementById('userDashboard').style.display = 'block';
        document.getElementById('rendererDashboard').style.display = 'none';
        loadUserDashboard();
    }
}

function loadRendererDashboard(user) {
    const businesses = storage.getBusinesses();
    const business = businesses.find(b => b.userId === user.id);
    
    if (business && business.name) {
        displayBusinessProfile(business);
    } else {
        document.getElementById('businessProfile').innerHTML = `
            <p style="color: var(--gray-color);">You haven't set up your business profile yet. Click "Edit Profile" to get started.</p>
        `;
    }
    
    loadUserPosts(business.id);
}

function displayBusinessProfile(business) {
    const reviews = storage.getReviews().filter(r => r.businessId === business.id);
    const avgRating = reviews.length > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 'No ratings yet';
    
    document.getElementById('businessProfile').innerHTML = `
        <div class="business-profile-card">
            <h4>${business.name}</h4>
            <span class="service-category">${business.category}</span>
            <div class="service-rating">
                <span class="stars">${getStars(avgRating)}</span>
                <span>${avgRating} (${reviews.length} reviews)</span>
            </div>
            <p class="service-bio">${business.bio}</p>
            <div class="profile-info">
                <div class="profile-info-item">
                    <i class="fas fa-phone"></i>
                    <span>${business.phone}</span>
                </div>
                <div class="profile-info-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${business.location}</span>
                </div>
            </div>
        </div>
    `;
}

function loadUserPosts(businessId) {
    const posts = storage.getPosts().filter(p => p.businessId === businessId);
    const postsContainer = document.getElementById('userPosts');
    
    if (posts.length === 0) {
        postsContainer.innerHTML = '<p style="color: var(--gray-color);">No advertisements yet. Create your first one!</p>';
        return;
    }
    
    postsContainer.innerHTML = posts.map(post => `
        <div class="post-card">
            <h4>${post.title}</h4>
            ${post.price ? `<div class="post-price">${post.price}</div>` : ''}
            <p style="color: var(--gray-color);">${post.description}</p>
            <small style="color: var(--gray-color);">Posted ${formatDate(post.date)}</small>
        </div>
    `).join('');
}

function loadUserDashboard() {
    displayAllServices('dashboardServicesList');
}

// Browse Services
function showBrowseServices() {
    document.querySelector('.hero').style.display = 'none';
    document.querySelector('.about').style.display = 'none';
    document.getElementById('services').style.display = 'block';
    displayAllServices('servicesList');
}

function displayAllServices(containerId) {
    const businesses = storage.getBusinesses().filter(b => b.name);
    const container = document.getElementById(containerId);
    
    if (businesses.length === 0) {
        container.innerHTML = '<p class="text-center" style="color: var(--gray-color);">No services available yet.</p>';
        return;
    }
    
    container.innerHTML = businesses.map(business => {
        const reviews = storage.getReviews().filter(r => r.businessId === business.id);
        const avgRating = reviews.length > 0 
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : 0;
        
        return `
            <div class="service-card" onclick="showServiceDetail(${business.id})">
                <h3>${business.name}</h3>
                <span class="service-category">${business.category}</span>
                <div class="service-rating">
                    <span class="stars">${getStars(avgRating)}</span>
                    <span>${avgRating > 0 ? avgRating : 'New'} (${reviews.length} reviews)</span>
                </div>
                <p class="service-bio">${truncateText(business.bio, 100)}</p>
                <div class="service-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${business.location}
                </div>
            </div>
        `;
    }).join('');
}

function searchServices() {
    const searchInput = document.getElementById('searchInput') || document.getElementById('dashboardSearch');
    const query = searchInput.value.toLowerCase();
    const businesses = storage.getBusinesses().filter(b => b.name);
    
    const filtered = businesses.filter(b => 
        b.name.toLowerCase().includes(query) ||
        b.category.toLowerCase().includes(query) ||
        b.bio.toLowerCase().includes(query) ||
        b.location.toLowerCase().includes(query)
    );
    
    const currentUser = storage.getCurrentUser();
    const containerId = currentUser ? 'dashboardServicesList' : 'servicesList';
    const container = document.getElementById(containerId);
    
    if (filtered.length === 0) {
        container.innerHTML = '<p class="text-center" style="color: var(--gray-color);">No services found matching your search.</p>';
        return;
    }
    
    container.innerHTML = filtered.map(business => {
        const reviews = storage.getReviews().filter(r => r.businessId === business.id);
        const avgRating = reviews.length > 0 
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : 0;
        
        return `
            <div class="service-card" onclick="showServiceDetail(${business.id})">
                <h3>${business.name}</h3>
                <span class="service-category">${business.category}</span>
                <div class="service-rating">
                    <span class="stars">${getStars(avgRating)}</span>
                    <span>${avgRating > 0 ? avgRating : 'New'} (${reviews.length} reviews)</span>
                </div>
                <p class="service-bio">${truncateText(business.bio, 100)}</p>
                <div class="service-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${business.location}
                </div>
            </div>
        `;
    }).join('');
}

// Service Detail View
function showServiceDetail(businessId) {
    const business = storage.getBusinesses().find(b => b.id === businessId);
    const posts = storage.getPosts().filter(p => p.businessId === businessId);
    const reviews = storage.getReviews().filter(r => r.businessId === businessId);
    const avgRating = reviews.length > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0;
    
    const currentUser = storage.getCurrentUser();
    const canReview = currentUser && currentUser.type === 'user' && 
                     !reviews.find(r => r.userId === currentUser.id);
    
    document.getElementById('serviceDetailContent').innerHTML = `
        <div class="service-detail">
            <div class="service-detail-header">
                <h2>${business.name}</h2>
                <span class="service-category">${business.category}</span>
                <div class="service-rating">
                    <span class="stars">${getStars(avgRating)}</span>
                    <span style="font-size: 1.2rem;">${avgRating > 0 ? avgRating : 'New'} (${reviews.length} reviews)</span>
                </div>
            </div>
            
            <div class="service-detail-bio">
                <h3>About</h3>
                <p>${business.bio}</p>
            </div>
            
            <div class="contact-info">
                <h4>Contact Information</h4>
                <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <span>${business.phone}</span>
                </div>
                <div class="contact-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${business.location}</span>
                </div>
            </div>
            
            ${posts.length > 0 ? `
                <div class="posts-section">
                    <h3>Services & Offers</h3>
                    <div class="posts-grid">
                        ${posts.map(post => `
                            <div class="post-card">
                                <h4>${post.title}</h4>
                                ${post.price ? `<div class="post-price">${post.price}</div>` : ''}
                                <p style="color: var(--gray-color);">${post.description}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div class="reviews-section">
                <h3>Reviews</h3>
                
                ${canReview ? `
                    <div class="review-form">
                        <h4>Write a Review</h4>
                        <div class="star-rating" id="ratingInput">
                            <i class="fas fa-star" onclick="setRating(1)"></i>
                            <i class="fas fa-star" onclick="setRating(2)"></i>
                            <i class="fas fa-star" onclick="setRating(3)"></i>
                            <i class="fas fa-star" onclick="setRating(4)"></i>
                            <i class="fas fa-star" onclick="setRating(5)"></i>
                        </div>
                        <textarea id="reviewComment" rows="3" placeholder="Share your experience..." style="width: 100%; padding: 0.8rem; border: 2px solid #e2e8f0; border-radius: 8px; font-family: inherit;"></textarea>
                        <button class="btn btn-primary mt-1" onclick="submitReview(${businessId})">Submit Review</button>
                    </div>
                ` : currentUser && currentUser.type === 'user' ? '<p style="color: var(--gray-color);">You have already reviewed this business.</p>' : ''}
                
                <div class="reviews-list">
                    ${reviews.length > 0 ? reviews.map(review => `
                        <div class="review-item">
                            <div class="review-header">
                                <span class="review-author">${review.userName}</span>
                                <span class="review-date">${formatDate(review.date)}</span>
                            </div>
                            <div class="review-stars">${getStars(review.rating)}</div>
                            <p class="review-text">${review.comment}</p>
                        </div>
                    `).join('') : '<p style="color: var(--gray-color);">No reviews yet. Be the first to review!</p>'}
                </div>
            </div>
        </div>
    `;
    
    showModal('serviceDetailModal');
}

// Rating System
let selectedRating = 0;

function setRating(rating) {
    selectedRating = rating;
    const stars = document.querySelectorAll('#ratingInput i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function submitReview(businessId) {
    if (selectedRating === 0) {
        showAlert('Please select a rating', 'error');
        return;
    }
    
    const comment = document.getElementById('reviewComment').value.trim();
    if (!comment) {
        showAlert('Please write a review', 'error');
        return;
    }
    
    const currentUser = storage.getCurrentUser();
    const reviews = storage.getReviews();
    
    reviews.push({
        id: Date.now(),
        businessId,
        userId: currentUser.id,
        userName: currentUser.name,
        rating: selectedRating,
        comment,
        date: new Date().toISOString()
    });
    
    storage.saveReviews(reviews);
    showAlert('Review submitted successfully!', 'success');
    
    // Refresh the service detail view
    closeModal('serviceDetailModal');
    setTimeout(() => showServiceDetail(businessId), 300);
}

// Edit Profile
function showEditProfile() {
    const currentUser = storage.getCurrentUser();
    const businesses = storage.getBusinesses();
    const business = businesses.find(b => b.userId === currentUser.id);
    
    document.getElementById('businessName').value = business.name || '';
    document.getElementById('businessCategory').value = business.category || '';
    document.getElementById('businessBio').value = business.bio || '';
    document.getElementById('businessPhone').value = business.phone || '';
    document.getElementById('businessLocation').value = business.location || '';
    
    showModal('editProfileModal');
}

function handleEditProfile(event) {
    event.preventDefault();
    const currentUser = storage.getCurrentUser();
    const businesses = storage.getBusinesses();
    const businessIndex = businesses.findIndex(b => b.userId === currentUser.id);
    
    businesses[businessIndex] = {
        ...businesses[businessIndex],
        name: document.getElementById('businessName').value,
        category: document.getElementById('businessCategory').value,
        bio: document.getElementById('businessBio').value,
        phone: document.getElementById('businessPhone').value,
        location: document.getElementById('businessLocation').value
    };
    
    storage.saveBusinesses(businesses);
    closeModal('editProfileModal');
    loadRendererDashboard(currentUser);
    showAlert('Profile updated successfully!', 'success');
}

// Add Post
function showAddPost() {
    document.getElementById('postTitle').value = '';
    document.getElementById('postDescription').value = '';
    document.getElementById('postPrice').value = '';
    showModal('addPostModal');
}

function handleAddPost(event) {
    event.preventDefault();
    const currentUser = storage.getCurrentUser();
    const businesses = storage.getBusinesses();
    const business = businesses.find(b => b.userId === currentUser.id);
    
    const posts = storage.getPosts();
    posts.push({
        id: Date.now(),
        businessId: business.id,
        title: document.getElementById('postTitle').value,
        description: document.getElementById('postDescription').value,
        price: document.getElementById('postPrice').value,
        date: new Date().toISOString()
    });
    
    storage.savePosts(posts);
    closeModal('addPostModal');
    loadUserPosts(business.id);
    showAlert('Advertisement posted successfully!', 'success');
}

function showSignup() {
    showModal('signupModal');
}

// Utility Functions
function getStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '★'.repeat(fullStars) + 
           (halfStar ? '☆' : '') + 
           '☆'.repeat(emptyStars);
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
}

function showAlert(message, type) {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.position = 'fixed';
    alert.style.top = '20px';
    alert.style.right = '20px';
    alert.style.zIndex = '3000';
    alert.style.minWidth = '300px';
    
    document.body.appendChild(alert);
    
    // Remove after 3 seconds
    setTimeout(() => {
        alert.remove();
    }, 3000);
}
