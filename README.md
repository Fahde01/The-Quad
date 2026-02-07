# The Quad - Service Marketplace

A modern, responsive web application that connects service providers with service seekers. Built with vanilla JavaScript, HTML5, and CSS3.

## Features

### User Authentication
- **Sign Up**: Create an account as either a Service Provider or Service Seeker
- **Login**: Secure login with email and password
- **Session Management**: Persistent login using browser localStorage
- **Logout**: Clean logout functionality

### For Service Providers
- **Business Profile Creation**
  - Business name and category selection
  - Detailed bio/description
  - Contact information (phone, location)
  - Edit profile anytime
  
- **Advertisement Management**
  - Create service advertisements
  - Add title, description, and pricing
  - View all your posted advertisements
  - Advertisements displayed on your profile

- **Reviews & Ratings**
  - Receive 5-star ratings from customers
  - View all reviews on your profile
  - Average rating calculation
  - Review count display

### For Service Seekers
- **Browse Services**
  - View all available service providers
  - See business profiles with ratings
  - Browse by categories
  
- **Search Functionality**
  - Search by business name
  - Search by category
  - Search by location
  - Search by keywords in descriptions

- **Service Details**
  - View complete business profiles
  - See contact information
  - Browse service advertisements
  - Read customer reviews

- **Review System**
  - Rate services with 1-5 stars
  - Write detailed reviews
  - One review per business per user
  - Reviews include timestamp

### 5-Star Review System
- **Interactive Star Rating**: Click to select 1-5 stars
- **Review Comments**: Write detailed feedback
- **Rating Display**: Visual star representation (★)
- **Average Ratings**: Calculated and displayed on all listings
- **Review History**: All reviews visible on business profiles
- **Duplicate Prevention**: Users can only review each business once

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Storage**: Browser localStorage (client-side persistence)
- **Icons**: Font Awesome 6.0
- **Design**: Modern gradient design with responsive layout

## File Structure

```
The-Quad/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and responsive design
├── app.js             # Application logic and functionality
└── README.md          # Documentation
```

## Getting Started

### Running Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/Fahde01/The-Quad.git
   cd The-Quad
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server:
   ```bash
   # Using Python 3
   python3 -m http.server 8080
   
   # Using Node.js (http-server)
   npx http-server -p 8080
   ```

3. **Access the application**
   - Open your browser and navigate to `http://localhost:8080`

### Demo Accounts

The application comes with demo data pre-loaded:

**Service Provider:**
- Email: john@example.com
- Password: demo123

**Service Seeker:**
- Email: jane@example.com
- Password: demo123

## How to Use

### As a Service Provider

1. **Sign Up**
   - Click "Sign Up" button
   - Fill in your details
   - Select "Service Provider" as account type

2. **Create Your Profile**
   - Click "Edit Profile" on your dashboard
   - Add business name, category, bio, phone, and location
   - Save your profile

3. **Post Advertisements**
   - Click "+ New Advertisement"
   - Add title, description, and optional pricing
   - Submit to make it visible to users

4. **Monitor Reviews**
   - View ratings and reviews on your dashboard
   - Your average rating is calculated automatically

### As a Service Seeker

1. **Sign Up**
   - Click "Sign Up" button
   - Fill in your details
   - Select "Service Seeker" as account type

2. **Browse Services**
   - View all available services on your dashboard
   - Use the search bar to filter services

3. **View Business Details**
   - Click on any service card
   - View complete profile, contact info, and advertisements
   - Read existing reviews

4. **Leave Reviews**
   - Click on a service to view details
   - Select star rating (1-5 stars)
   - Write your review
   - Submit (one review per business)

## Design Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean gradient design with smooth animations
- **User-Friendly**: Intuitive navigation and clear call-to-actions
- **Attractive Layout**: Card-based design for easy browsing
- **Modal Dialogs**: Clean popup forms for actions
- **Visual Feedback**: Success/error messages for user actions

## Data Storage

All data is stored in browser localStorage:
- User accounts
- Business profiles
- Advertisements/posts
- Reviews and ratings

**Note**: Data persists across sessions but is specific to each browser. Clearing browser data will reset the application.

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Any modern browser with localStorage support

## Future Enhancements

Potential features for future development:
- Backend API integration
- Image upload for business profiles
- Direct messaging between users
- Payment integration
- Email notifications
- Advanced filtering and sorting
- Business categories with icons
- Favorite/bookmark services
- Report inappropriate content

## License

This project is open source and available for educational purposes.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## Support

For questions or issues, please open an issue on GitHub.

---

Built with ❤️ for SparkHacks
