# Habits - Progressive Web App (PWA)

A beautiful, offline-first habit tracker inspired by uHabits/Loop Habit Tracker. Track your habits with a weekly grid layout, build streaks, and analyze your progress - all without an internet connection.

![PWA Badge](https://img.shields.io/badge/PWA-Enabled-5AC5AA?style=flat-square)
![Offline](https://img.shields.io/badge/Offline-First-orange?style=flat-square)
![IndexedDB](https://img.shields.io/badge/Storage-IndexedDB-blue?style=flat-square)

## ✨ Key Features

### 📱 Progressive Web App
- **Fully Offline**: Works without internet connection
- **Installable**: Add to home screen on mobile devices
- **Fast Loading**: Service worker caches all assets
- **Background Sync**: Data saved locally with IndexedDB
- **Responsive**: Optimized for mobile, tablet, and desktop

### 📊 Weekly Grid Layout
- **7-Day View**: See your week at a glance
- **Scrollable History**: Navigate through past weeks
- **Today Highlighting**: Current day clearly marked
- **Color-Coded Habits**: 8 beautiful colors to organize habits

### ✅ Habit Types
- **Yes/No Habits**: Simple completion tracking (e.g., "Morning Meditation")
- **Numeric Habits**: Track quantities (e.g., "Read 20 pages", "Run 5 miles")
- **Custom Units**: Add your own units (pages, miles, minutes, etc.)
- **Daily Targets**: Set optional goals for numeric habits

### 🔥 Advanced Tracking
- **Current Streak**: Days in a row completed
- **Longest Streak**: Your best streak ever
- **Habit Strength**: Sophisticated metric (0-100) based on:
  - Recent performance (last 7 days: 40% weight)
  - Medium-term consistency (last 30 days: 30% weight)
  - Long-term progress (last 90 days: 20% weight)
  - All-time completion rate (10% weight)
- **Smart Algorithm**: Missing one day doesn't completely reset your progress

### 📈 Statistics Dashboard
- **Overview Cards**: Active habits, avg strength, total streaks, best streak
- **Per-Habit Analysis**: Detailed stats for each habit
- **Completion Rates**: 30-day completion percentage
- **Visual Progress**: Progress bars and strength indicators

### 💾 Backup & Restore
- **Export Data**: Download all habits and completions as JSON
- **Import Data**: Restore from backup file
- **Data Validation**: Safe import with error checking
- **Overwrite/Merge**: Choose how to handle existing data

### 🎨 Modern UI/UX
- **Material You Inspired**: Soft shadows, rounded corners, smooth animations
- **Dark Mode**: Full light/dark theme support with smooth transitions
- **Touch-Friendly**: Large tap targets, haptic feedback (when supported)
- **Micro-Animations**: Smooth checkmark animations, progress transitions
- **Bottom Navigation**: Easy thumb-zone navigation
- **Floating Action Button (FAB)**: Quick habit creation

## 🚀 Getting Started

The app is already running! Open http://localhost:3000 in your browser.

### Creating Your First Habit

1. **Tap the + FAB button** (bottom right)
2. **Fill in the form**:
   - Name: e.g., "Morning Run"
   - Type: Choose Yes/No or Numeric
   - Color: Pick your favorite color
   - Unit (Numeric only): e.g., "miles"
   - Target (Numeric only): e.g., "3"
3. **Tap "Create Habit"**

### Tracking Daily Progress

**For Yes/No Habits:**
- Tap any cell to mark complete (shows checkmark)
- Tap again to unmark

**For Numeric Habits:**
- Tap any cell to enter a value
- Type the number (e.g., "2.5")
- Tap "Save"

### Navigating the Week

- **Today's Column**: Highlighted with a ring
- **Left Arrow**: Go back in time (previous week)
- **Right Arrow**: Go forward (up to today)
- **Horizontal Scroll**: Swipe to see more days

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18**: Modern hooks and concurrent features
- **Zustand**: Lightweight state management
- **Framer Motion**: Smooth animations
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Accessible component primitives
- **Lucide Icons**: Beautiful, consistent icons
- **Sonner**: Elegant toast notifications

### Data Layer
- **IndexedDB**: Primary storage (via idb library)
- **LocalStorage**: Fallback for compatibility
- **Service Worker**: Offline caching and background sync
- **PWA Manifest**: Installation and theme configuration

### State Management
- **Zustand Store**: Central habit state
- **Async Actions**: IndexedDB operations
- **Optimistic Updates**: Immediate UI feedback
- **Completion Cache**: Fast access to habit completions

### Algorithms
- **Streak Calculation**: Efficient consecutive day counting
- **Strength Score**: Multi-timeframe weighted average
- **Completion Rate**: Percentage over time periods
- **Date Formatting**: Timezone-safe date handling

## 📂 Project Structure

```
/app/frontend/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── service-worker.js      # Offline caching
│   └── icon-*.png             # App icons
├── src/
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── HabitGrid.jsx      # Main weekly grid view
│   │   ├── AddHabitDialog.jsx # Create habit form
│   │   ├── EditHabitDialog.jsx # Edit habit form
│   │   ├── NumericInputDialog.jsx # Numeric value entry
│   │   ├── StatsView.jsx      # Statistics dashboard
│   │   └── SettingsView.jsx   # Settings and backup
│   ├── store/
│   │   └── habitStore.js      # Zustand state management
│   ├── utils/
│   │   ├── db.js              # IndexedDB operations
│   │   ├── streaks.js         # Streak calculations
│   │   └── backup.js          # Export/import utilities
│   ├── App.js                 # Main app component
│   ├── index.css              # Global styles and tokens
│   └── index.js               # App entry point
├── package.json
└── tailwind.config.js
```

## 🎨 Design System

### Color Palette
- **Primary (Teal)**: `#5AC5AA` - Main actions and highlights
- **Habit Colors**: Blue, Red, Orange, Purple, Green, Pink, Teal, Yellow
- **Backgrounds**: Light: `#FAFAFA`, Dark: `#1C1C1E`
- **Borders**: Subtle dividers with 10-20% opacity

### Typography
- **Font**: Inter (Google Fonts)
- **Sizes**: 12px (xs) to 36px (4xl)
- **Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Spacing
- **Base Unit**: 4px (0.25rem)
- **Scale**: 0, 1, 2, 3, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64

### Shadows
- **Soft**: `0 1px 2px rgba(0,0,0,0.05)`
- **Medium**: `0 4px 6px rgba(0,0,0,0.08)`
- **Large**: `0 10px 15px rgba(0,0,0,0.08)`

## 🔒 Privacy & Data

- **100% Client-Side**: No server, no tracking, no analytics
- **Local Storage Only**: All data stays on your device
- **No Account Required**: Start using immediately
- **Export Anytime**: Full control over your data
- **Open Source**: Inspect the code yourself

## 📱 PWA Installation

### On Mobile (iOS/Android)
1. Open the app in your browser
2. Look for the "Install" banner at the top
3. Tap "Install" or use the browser's "Add to Home Screen" option
4. App icon will appear on your home screen
5. Launch like a native app - no browser UI

### On Desktop (Chrome/Edge)
1. Look for the install icon in the address bar
2. Click "Install Habits"
3. App opens in its own window
4. Pin to taskbar for quick access

### Offline Usage
- Once installed, the app works without internet
- All data is saved locally
- Service worker caches all assets
- Perfect for offline habit tracking

## 🛠️ Development

### Install Dependencies
```bash
cd /app/frontend
yarn install
```

### Start Development Server
```bash
yarn start
```

### Build for Production
```bash
yarn build
```

### Service Worker
- **Development**: Service worker is disabled in dev mode
- **Production**: Automatically enabled after build
- **Cache Strategy**: Cache-first for assets, network-first for data

## 🔮 Future Enhancements

Potential features for future versions:
- [ ] Habit categories and tags
- [ ] Custom habit frequencies (weekly, specific days)
- [ ] Reminder notifications (Push API)
- [ ] Habit templates library
- [ ] Charts and visualizations
- [ ] Notes per completion
- [ ] Habit sharing (export individual habits)
- [ ] Multi-device sync (optional cloud backup)
- [ ] Widgets for quick logging

## 📝 Data Model

### Habit Object
```javascript
{
  id: "unique-id",
  name: "Morning Exercise",
  type: "yesno" | "numeric",
  color: "blue",
  unit: "miles",           // numeric only
  target: 5,               // numeric only
  createdAt: "2026-01-04T00:00:00.000Z",
  order: 0
}
```

### Completion Object
```javascript
{
  id: "habitId_date",
  habitId: "habit-id",
  date: "2026-01-04",
  value: true | number,
  notes: "",
  timestamp: 1704326400000
}
```

### Backup Format
```javascript
{
  version: 1,
  exportDate: "2026-01-04T12:00:00.000Z",
  habits: [...],
  completions: [...]
}
```

## 🧪 Testing

The app has been comprehensively tested:
- ✅ Habit creation (Yes/No and Numeric types)
- ✅ Habit completion marking
- ✅ Numeric value entry
- ✅ Edit and delete operations
- ✅ Weekly grid navigation
- ✅ Stats view accuracy
- ✅ Settings and preferences
- ✅ Dark mode toggle
- ✅ Data persistence
- ✅ Backup export/import
- ✅ Offline functionality
- ✅ PWA installation

## 🤝 Contributing

This is a production-ready PWA. Feel free to:
- Report bugs via issues
- Suggest features
- Fork and customize
- Submit pull requests

## 📧 Support

- **App Issues**: Check browser console for errors
- **Data Loss**: Export backups regularly via Settings
- **Installation**: Ensure HTTPS for PWA features
- **Compatibility**: Modern browsers (Chrome 90+, Safari 14+, Firefox 88+)

## 🙏 Acknowledgments

- **uHabits**: Design inspiration
- **Loop Habit Tracker**: Grid layout concept
- **shadcn/ui**: Component library
- **Tailwind CSS**: Styling framework
- **Radix UI**: Accessibility primitives
- **Vercel**: Framer Motion animations

---

**Built with ❤️ using React, IndexedDB, and modern web technologies**

*"We are what we repeatedly do. Excellence, then, is not an act, but a habit." - Aristotle*
