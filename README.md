# Car Rental System - Frontend

Modern Angular 19 frontend for the Car Rental System with Bootstrap 5 and professional animations.

## Features

- **Modern UI/UX**: Professional design with gradient backgrounds and smooth animations
- **Responsive Design**: Mobile-first approach with Bootstrap 5
- **Authentication**: JWT-based login and registration
- **Car Search**: Advanced filtering with brand, type, city, and price filters
- **Booking Management**: Create, view, and cancel bookings
- **Real-time Updates**: Dynamic content loading and updates

## Technology Stack

- Angular 19
- TypeScript 5.4+
- Bootstrap 5.3
- SCSS for styling
- RxJS for reactive programming
- Angular Router for navigation
- HTTP Client for API communication

## Prerequisites

- Node.js 18+ and npm
- Angular CLI 19

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Angular CLI globally (if not already installed):
   ```bash
   npm install -g @angular/cli@19
   ```

## Development

1. Start the development server:
   ```bash
   ng serve
   ```

2. Navigate to `http://localhost:4200`

3. The application will automatically reload on file changes

## Build

### Development Build
```bash
ng build
```

### Production Build
```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/frontend` directory.

## Project Structure

```
src/
├── app/
│   ├── components/          # Angular components
│   │   ├── home/           # Home page component
│   │   ├── login/          # Login component
│   │   ├── register/       # Registration component
│   │   ├── car-search/     # Car search component
│   │   ├── booking/        # Booking management
│   │   └── navbar/         # Navigation component
│   ├── models/             # TypeScript interfaces
│   ├── services/           # Angular services
│   ├── guards/             # Route guards
│   └── interceptors/       # HTTP interceptors
├── assets/                 # Static assets
└── styles.scss            # Global styles
```

## Components

### Home Component
- Hero section with call-to-action
- Feature showcase with icons
- Statistics section
- Responsive design

### Authentication Components
- Login form with validation
- Registration form with password strength
- JWT token management
- Route protection

### Car Search Component
- Advanced filtering options
- Grid and list view modes
- Booking modal integration
- Responsive car cards

### Booking Component
- User booking history
- Status filtering
- Booking cancellation
- Detailed booking information

## Services

### AuthService
- User authentication
- JWT token management
- User session handling

### CarService
- Car search and filtering
- Car details retrieval
- Available cars listing

### BookingService
- Booking creation
- Booking management
- Booking history

## Styling

The application uses a modern design system with:
- Custom CSS variables for theming
- Bootstrap 5 components
- Custom animations and transitions
- Responsive breakpoints
- Professional color palette

## API Integration

The frontend communicates with the Spring Boot backend through:
- HTTP interceptors for authentication
- RESTful API calls
- Error handling
- Loading states

## Deployment

1. Build the application for production
2. Deploy the `dist/frontend` folder to a web server
3. Configure the web server to serve the Angular app
4. Ensure proper routing configuration for SPA

## Environment Configuration

Update `src/environments/environment.ts` for different environments:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is licensed under the MIT License.
