# 🎯 IntelliTask Frontend

[![Angular](https://img.shields.io/badge/Angular-17-red.svg)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000.svg)](https://vercel.com)

> 🚀 **Live Demo**: [https://intelli-task-frontend.vercel.app](https://intelli-task-frontend.vercel.app)

A modern Angular 17 application with Tailwind CSS styling for intelligent task management with AI-powered priority suggestions.

## 📋 Table of Contents

- [🚀 Features](#-features)
- [📁 Project Structure](#-project-structure)
- [🛠️ Setup Instructions](#️-setup-instructions)
- [🎨 Styling & Theme](#-styling--theme)
- [🔧 Key Components](#-key-components)
- [🌐 API Integration](#-api-integration)
- [📱 Responsive Design](#-responsive-design)
- [🔒 Security Features](#-security-features)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🚀 Features

- **Modern Angular 17** with standalone components
- **Tailwind CSS** responsive design with custom IntelliTask theme
- **JWT Authentication** for secure user sessions
- **Task Management** with full CRUD operations
- **AI Priority Suggestions** with real-time feedback
- **Responsive Design** optimized for mobile and desktop
- **Reactive Forms** with validation
- **RxJS** state management

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── auth/               # Authentication components
│   │   │   ├── login.component.ts
│   │   │   └── register.component.ts
│   │   ├── components/
│   │   │   ├── tasks/          # Task-related components
│   │   │   ├── tasks-item/     # Individual task item
│   │   │   └── ...
│   │   ├── dashboard/          # KPI dashboard
│   │   ├── services/           # Angular services
│   │   │   ├── auth.service.ts
│   │   │   └── task.service.ts
│   │   ├── guards/             # Route guards
│   │   ├── models/             # TypeScript interfaces
│   │   ├── interceptors/       # HTTP interceptors
│   │   └── config/             # Environment configuration
│   ├── assets/                 # Static assets
│   ├── index.html             # Main HTML file
│   └── styles.css             # Global styles
├── angular.json               # Angular CLI config
├── tailwind.config.js         # Tailwind configuration
├── tsconfig.json             # TypeScript config
└── package.json              # Dependencies
```

## 🛠️ Setup Instructions

### Prerequisites

- **Node.js** 18+ and npm
- **Angular CLI** 17+ (`npm install -g @angular/cli`)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm start
   ```

3. **Open browser**:
   Navigate to `http://localhost:4200`

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 🎨 Styling & Theme

### IntelliTask Theme Colors

- **Primary Accent**: `#f8e9a8` (yellow)
- **Background**: `#f6f2f1` (soft cream)
- **Cards**: `#ffffff` (white)
- **Text**: Grayscale palette

### Tailwind Configuration

Custom theme extensions in `tailwind.config.js`:
- Extended border radius
- Custom color palette
- Responsive breakpoints

### Component Styling

All components use Tailwind utility classes:
- Mobile-first responsive design
- Consistent spacing and typography
- Hover states and animations
- Color-coded priority badges

## 🔧 Key Components

### Authentication
- **LoginComponent**: Two-column design with form validation
- **RegisterComponent**: User registration with password confirmation

### Task Management
- **TaskFormComponent**: Create/edit tasks with AI suggestions
- **TaskListComponent**: Grid layout with task cards
- **TaskDetailsComponent**: Modal dialog for task details

### Dashboard
- **DashboardComponent**: KPI metrics and statistics
- **AppComponent**: Main layout with sidebar navigation

## 🌐 API Integration

### Environment Configuration

The app dynamically determines API URLs:

```typescript
// Development: localhost
if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
  return 'http://localhost:3000/api';
}

// Production: relative path
return '/api';
```

### Services

- **AuthService**: Login, register, logout, token management
- **TaskService**: CRUD operations with localStorage fallback
- **HTTP Interceptor**: Automatic JWT token attachment

## 📱 Responsive Design

- **Mobile**: Single column, hamburger menu, stacked layouts
- **Tablet**: Two-column grids, collapsed sidebar
- **Desktop**: Multi-column grids, persistent sidebar

## 🔒 Security Features

- JWT token storage in localStorage
- Automatic token attachment to requests
- Route guards for protected pages
- Form validation and sanitization

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run e2e tests
npm run e2e
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

### Other Platforms

- **Netlify**: Set build command to `npm run build`
- **GitHub Pages**: Use `angular-cli-ghpages`

## 📋 Scripts

```json
{
  "start": "ng serve",
  "build": "ng build",
  "test": "ng test",
  "lint": "ng lint"
}
```

## 🤝 Contributing

1. Follow Angular style guide
2. Use Tailwind utility classes for styling
3. Test components before committing
4. Update this README for new features

## 📄 License

MIT License
