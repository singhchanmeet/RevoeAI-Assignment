# Dashboard with Google Sheets Integration (RevoeAI Internship Assignment)

A modern web application that provides a dashboard interface with Google Sheets integration. This project consists of a Next.js frontend and a Node.js/Express backend, allowing users to visualize and manipulate data from Google Sheets with real-time updates.

## Features

### Authentication
- JWT-based authentication system
- User registration and login
- Protected routes with automatic token expiry handling

### Google Sheets Integration
- Connect to and display data from Google Sheets
- Real-time updates using Socket.io
- Data type support for text and dates

### Dynamic Table Management
- Create tables with custom columns
- Add dynamic columns to the dashboard (without affecting Google Sheets)
- Support for text and date input types
- Persistent storage of custom configurations

## Tech Stack

### Frontend
- **Next.js**: React framework for the frontend
- **Tailwind CSS**: Utility-first CSS framework
- **ShadcnUI**: UI component library
- **Socket.io Client**: Real-time communication

### Backend
- **Node.js/Express**: Server framework
- **MongoDB**: Database for storing user data and table configurations
- **Google Sheets API**: For reading sheet data
- **Socket.io**: For real-time updates
- **JWT**: For authentication

## Prerequisites

Before you begin, ensure you have:
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Google Cloud Platform account (for Google Sheets API)

## Setup Instructions

### Google Sheets API Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Google Sheets API
4. Create a service account with appropriate permissions
5. Download the service account key as JSON
6. Save the JSON file in your backend directory as `google-credentials.json`
7. Share your Google Sheets with the email address of the service account

### Backend Setup

1. Clone the repository
   ```bash
   git clone https://github.com/singhchanmeet/RevoeAI-Assignment
   ```

2. Install dependencies
   ```bash
   cd dashboard-backend
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   JWT_SECRET=your_jwt_secret_key_goes_here
   MONGO_URI=mongodb://localhost:27017/dashboard-db
   GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
   ```

4. Start the backend server
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Install dependencies
   ```bash
   cd dashboard-frontend
   npm install
   ```

2. Create a `.env.local` file in the frontend directory with the following variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

3. Start the frontend development server
   ```bash
   npm run dev
   ```

4. Access the application at `http://localhost:3000`

## Usage Guide

### Registration and Login
1. Create a new account using the registration form
2. Log in with your credentials
3. Upon successful login, you'll be redirected to the dashboard

### Creating Tables
1. Click the "Create Table" button on the dashboard
2. Enter a name for your table
3. Provide the Google Sheet URL
4. Configure the columns with names and data types
5. Submit the form to create the table

### Viewing and Manipulating Data
1. Select a table from your dashboard
2. View the data from your Google Sheet
3. To add a dynamic column, click "Add Column"
4. Enter a name and select the data type
5. The new column will be added to your view (without affecting the original Google Sheet)

## Project Structure

### Frontend
```
dashboard-frontend/
├── app/
│   ├── api/
│   ├── login/
│   ├── signup/
│   ├── dashboard/
│   ├── layout.js
│   └── page.js
├── components/
│   ├── ui/
│   ├── auth/
│   └── dashboard/
├── lib/
├── contexts/
├── hooks/
├── public/
└── package.json
```

### Backend
```
dashboard-backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── google-credentials.json
└── server.js
```

## Development

### Adding New Features

To add new features:
1. For backend changes, create appropriate routes, controllers, and models
2. For frontend changes, add components and update the UI
3. Ensure proper authentication is maintained

### Testing

1. Manual testing of all features is recommended
2. For backend API testing, use tools like Postman

## Troubleshooting

### Common Issues

1. **Google Sheets Connection Issues**:
   - Ensure your Google Sheet is shared with the service account email (test-user@revoeai-sheets-api.iam.gserviceaccount.com)
   - Verify API credentials are correct
   - Check the sheet URL format

2. **Authentication Problems**:
   - Verify JWT_SECRET is properly set
   - Check token expiration handling

3. **Database Connection Issues**:
   - Verify MongoDB connection string
   - Ensure MongoDB is running

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.