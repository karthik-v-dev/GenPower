# GenPower - Generator Business Management Platform

A comprehensive web application for managing generator leasing, sales, service, and spare parts. Built with modern technologies for optimal performance and user experience.

## 🚀 Features

- **Generator Catalog**: Browse and search extensive generator inventory
- **Leasing System**: Request short-term and long-term generator leases
- **Purchase Management**: Buy generators with multiple payment options
- **Service Requests**: Schedule maintenance, repairs, and inspections
- **Spare Parts Store**: Order genuine OEM parts and accessories
- **User Authentication**: Secure login with role-based access (Owner/Customer)
- **Responsive Design**: Fully mobile-optimized interface
- **Real-time Updates**: Firebase integration for live data

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript 6
- **Build Tool**: Vite 8
- **State Management**: Redux Toolkit with Redux Thunk
- **UI Framework**: Material-UI (MUI)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Yup validation
- **Backend**: Firebase (Auth + Realtime Database)
- **Styling**: Emotion (CSS-in-JS)

## 📁 Project Structure

```
GenPower/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── UI/          # Base UI components (Button, Card, etc.)
│   │   └── Layout/      # Layout components (Header, Footer)
│   ├── features/        # Feature modules
│   │   ├── auth/        # Authentication
│   │   ├── generators/  # Generator management
│   │   ├── lease/       # Lease management
│   │   ├── purchase/    # Purchase management
│   │   ├── service/     # Service requests
│   │   └── spareParts/  # Spare parts management
│   ├── store/           # Redux store and slices
│   ├── services/        # API and business logic
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript type definitions
│   ├── constants/       # Application constants
│   └── assets/          # Static assets
├── docs/                # Documentation
│   ├── ARCHITECTURE.md  # Architecture details
│   └── SETUP.md        # Setup instructions
└── public/             # Public assets
```

## 🎯 Design Principles

1. **Type Safety**: 100% TypeScript with no `any` types
2. **Reusability**: Modular, composable components
3. **Clean Code**: SOLID principles, DRY, clear naming
4. **Performance**: Optimized rendering, lazy loading
5. **Accessibility**: WCAG compliant components
6. **Mobile First**: Responsive design for all devices

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment file:
   ```bash
   copy .env.example .env
   ```

4. Add your Firebase configuration to `.env`

5. Start development server:
   ```bash
   npm run dev
   ```

6. Open http://localhost:5173

For detailed setup instructions, see [docs/SETUP.md](docs/SETUP.md)

## 📚 Documentation

- [Architecture Documentation](docs/ARCHITECTURE.md) - System design and structure
- [Setup Guide](docs/SETUP.md) - Detailed installation and configuration

## 🎨 Features Overview

### For Customers
- Browse generator catalog with advanced filters
- Request generator leases (daily, weekly, monthly)
- Purchase generators with multiple payment methods
- Request service and maintenance
- Order spare parts with shopping cart
- Track orders and service requests

### For Owners
- Manage generator inventory
- View and process lease requests
- Process purchase orders
- Schedule service appointments
- Manage spare parts catalog
- View analytics and reports

## 🔐 Authentication

Two user roles:
- **Customer**: Can browse, request, and purchase
- **Owner**: Full management capabilities

## 📱 Mobile Support

- Fully responsive design
- Touch-optimized interface
- Mobile navigation
- Optimized images for mobile devices

## 🎨 UI Components

All UI components are:
- Fully typed with TypeScript
- Reusable and composable
- Consistent with Material Design
- Accessible (ARIA compliant)
- Mobile-responsive

## 🔄 State Management

Redux Toolkit with:
- Async thunks for API calls
- Typed hooks (useAppSelector, useAppDispatch)
- Normalized state structure
- Optimistic updates

## 🔥 Firebase Integration

- **Authentication**: Email/password
- **Realtime Database**: Live data sync
- **Security Rules**: Role-based access
- **Scalability**: Ready for production

## 📊 Mock Data

The application includes comprehensive mock data:
- 20 generators with realistic specs
- 30 spare parts across categories
- Copyright-free images from Unsplash

## 🚧 Future Enhancements

- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] PDF quote generation
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Image upload for generators
- [ ] Real-time chat support
- [ ] Mobile app (React Native)

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributing

Contributions are welcome! Please follow the existing code style and structure.

## 📞 Support

For support, email info@genpower.com or create an issue in the repository.

## 🙏 Acknowledgments

- Images from [Unsplash](https://unsplash.com) (copyright-free)
- Icons from Material-UI
- Built with modern React best practices

---

**GenPower** - Powering Your Business Forward 🔌⚡
