# UWH Portal RSVP Demo 🏒

A modern underwater hockey club portal mockup featuring RSVP functionality, built with React, TypeScript, and Vite. This demo showcases a mobile-first design for club members to view practice schedules and confirm attendance.

![UWH Portal Demo](https://img.shields.io/badge/Status-Demo-blue) ![React](https://img.shields.io/badge/React-19.1.1-61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue) ![Vite](https://img.shields.io/badge/Vite-7.1.3-646cff)

## ✨ Features

### 🎯 Core Functionality
- **Club Listings**: Browse underwater hockey clubs with detailed information
- **RSVP System**: Interactive star-based attendance confirmation (Yes/Maybe/No)
- **Practice Schedules**: View upcoming practices with time, location, and details
- **Mobile-First Design**: Optimized phone frame interface
- **Real-Time Updates**: Dynamic practice information and attendance tracking

### 🎨 UI/UX Highlights
- **70px Star Icons**: Prominent, easy-to-tap RSVP buttons
- **Clean Question Mark**: Simplified "maybe" option without circular border
- **Responsive Layout**: Mobile-optimized with phone frame simulation
- **Intuitive Navigation**: Tab-based interface for different views
- **Visual Feedback**: Color-coded RSVP states with smooth transitions

### 🔧 Technical Features
- **Error Boundaries**: Graceful error handling with recovery options
- **Hot Module Replacement**: Fast development with instant updates
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Modern styling with utility-first approach
- **PowerShell 7**: Enhanced development scripts and automation

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **PowerShell 7** (recommended for enhanced development experience)
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AtlantisSports/portal-rsvp-demo.git
   cd portal-rsvp-demo
   ```

2. **Navigate to web-app directory**
   ```bash
   cd web-app
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - Navigate to [http://localhost:5173/](http://localhost:5173/)
   - Or use Chrome specifically: `npm run dev:chrome`

### 🛠️ Quick Setup Script

For automated setup, run the PowerShell script:
```powershell
# From the web-app directory
.\dev-setup.ps1
```

## 📁 Project Structure

```
portal-rsvp-demo/
├── .github/
│   └── copilot-instructions.md     # GitHub Copilot configuration
├── web-app/                        # Main React application
│   ├── src/
│   │   ├── components/
│   │   │   └── ErrorBoundary.tsx   # Error handling component
│   │   ├── utils/
│   │   │   └── devUtils.tsx        # Development utilities
│   │   ├── App.tsx                 # Main application component
│   │   ├── main.tsx               # Application entry point
│   │   └── index.css              # Global styles with Tailwind
│   ├── .vscode/
│   │   └── tasks.json             # VS Code development tasks
│   ├── dev-setup.ps1              # Development environment setup
│   ├── package.json               # Project dependencies and scripts
│   ├── vite.config.ts             # Vite configuration
│   └── tailwind.config.js         # Tailwind CSS configuration
├── configure-vscode-powershell7.ps1  # VS Code PowerShell 7 setup
├── CURRENT_STATE.md               # Project status and progress
└── README.md                      # This file
```

## 🎮 Usage

### RSVP Functionality
1. **View Club Information**: Browse available clubs and their details
2. **Check Practice Schedule**: See upcoming practices with times and locations
3. **Confirm Attendance**: Click on star icons to set your RSVP status:
   - 🟢 **Green Star + Check**: Yes, I'll attend
   - 🟡 **Yellow Star + ?**: Maybe, not sure yet
   - 🔴 **Red Star + X**: No, can't make it

### Navigation
- **Clubs Tab**: Main view with club listings and RSVP options
- **Calendar**: Practice schedule overview
- **Profile**: User settings and preferences

## 🧰 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run dev:chrome` | Start dev server and open in Chrome |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues automatically |
| `npm run type-check` | Check TypeScript without building |
| `npm run backup` | Create backup of App.tsx |
| `npm run restore-backup` | Restore from working backup |

### VS Code Tasks
Press `Ctrl+Shift+P` → "Tasks: Run Task" to access:
- **Start Dev Server**: Launch development environment
- **Quick Setup**: Automated project setup
- **Create/Restore Backup**: File management utilities
- **Type Check**: TypeScript validation
- **Lint & Fix**: Code quality tools

### Development Workflow

1. **Make Changes**: Edit components in `src/` directory
2. **Hot Reload**: Changes appear instantly in browser
3. **Create Backup**: Use `npm run backup` before major changes
4. **Type Check**: Run `npm run type-check` to validate TypeScript
5. **Commit**: Use Git for version control

## 🏗️ Architecture

### Key Components
- **App.tsx**: Main application with club data and RSVP logic
- **RSVPIconButton**: Interactive star-based RSVP component
- **ErrorBoundary**: Catches and handles React errors gracefully
- **PhoneFrame**: Mobile device simulation wrapper

### State Management
- **React Hooks**: useState for component-level state
- **TypeScript Interfaces**: Strong typing for club and RSVP data
- **Local State**: No external state management needed for this demo

### Styling Approach
- **Tailwind CSS**: Utility-first styling framework
- **Custom CSS**: Minimal custom styles in index.css
- **Mobile-First**: Responsive design starting from mobile viewport
- **Component Styling**: Inline styles for dynamic properties

## 🔧 Configuration

### Vite Configuration
- **React Plugin**: Fast refresh and JSX support
- **Auto Browser Opening**: Launches browser automatically
- **Error Overlay**: Enhanced development error display
- **File Watching**: Aggressive file change detection

### Tailwind Setup
- **PostCSS Integration**: Proper CSS processing pipeline
- **Content Scanning**: Automatically scans all React files
- **Modern Configuration**: Uses latest Tailwind v4 features

### PowerShell 7 Integration
- **Enhanced Scripts**: Better error handling and performance
- **Cross-Platform**: Compatible with Windows, Mac, Linux
- **VS Code Integration**: Configured as default terminal

## 🎯 Demo Scenarios

### Club Administrator View
- View all club members' RSVP responses
- Monitor practice attendance trends
- Manage club information and schedules

### Club Member Experience
- Quick RSVP for upcoming practices
- View practice details and locations
- Track personal attendance history

### Mobile Experience
- Touch-friendly 70px star buttons
- Optimized for phone screens
- Smooth scrolling and transitions

## 🔄 Future Enhancements

### Planned Features
- [ ] User authentication and profiles
- [ ] Real-time notifications
- [ ] Calendar integration
- [ ] Multi-club support
- [ ] Attendance analytics
- [ ] Mobile app (React Native)

### Technical Improvements
- [ ] Backend API integration
- [ ] Database persistence
- [ ] Progressive Web App features
- [ ] Automated testing suite
- [ ] CI/CD pipeline
- [ ] Performance monitoring

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes**: Implement your feature or fix
4. **Create backup**: `npm run backup` before major changes
5. **Test thoroughly**: Ensure all functionality works
6. **Commit changes**: `git commit -m 'Add amazing feature'`
7. **Push to branch**: `git push origin feature/amazing-feature`
8. **Create Pull Request**: Submit for review

## 📝 Development Notes

### RSVP Star Configuration
- **Star Size**: 70px for optimal touch targets
- **Button Size**: 59px for compact layout
- **Overlay Icons**: 26px for clear visibility
- **Color Scheme**: Green (Yes), Yellow (Maybe), Red (No)

### Browser Compatibility
- **Chrome**: Recommended for development
- **Firefox**: Fully supported
- **Safari**: Compatible with minor styling differences
- **Edge**: Supported with Chromium engine

### Performance Considerations
- **Bundle Size**: Optimized with Vite tree-shaking
- **Image Assets**: SVG icons for scalability
- **CSS**: Tailwind purging removes unused styles
- **Hot Reload**: Fast development iteration

## 🐛 Troubleshooting

### Common Issues

**Development server won't start:**
```bash
# Clean and reinstall dependencies
npm run clean
npm install
npm run dev
```

**TypeScript errors:**
```bash
# Run type checking
npm run type-check
```

**Build fails:**
```bash
# Check for linting issues
npm run lint:fix
```

**Git issues:**
```bash
# Reset to last working commit
git restore src/App.tsx
# Or restore from backup
npm run restore-backup
```

### Recovery Options
- **Backup System**: Automatic timestamped backups
- **Error Boundaries**: Graceful error recovery in UI
- **Development Scripts**: Automated troubleshooting tools

## 📄 License

This project is created for demonstration purposes as part of the Atlantis Sports underwater hockey portal development.

---

## 🏒 About Underwater Hockey

This portal is designed for underwater hockey (UWH) clubs - a unique sport played underwater where teams use short sticks to maneuver a puck along the bottom of a swimming pool. The RSVP system helps clubs manage practice attendance and build stronger communities around this exciting aquatic sport.

---

**Built with ❤️ for the underwater hockey community**
