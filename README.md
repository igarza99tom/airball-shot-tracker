# Airball - Basketball Shot Tracker

A progressive web application for tracking shooting percentages across simple 14 court locations.

## Features

- **Interactive Court Visualization**: Track shots on 14 different court sections
- **Simple Shot Recording**: Tap to select a section, swipe right for makes and left for misses
- **Real-time Statistics**: View shooting percentages for each court section
- **Visual Performance Feedback**: Color-coded sections based on shooting percentage
- **Offline Capability**: Use the app without an internet connection
- **Install on Home Screen**: Add to your device as a standalone app

## Technical Implementation

- Built with Angular as a Progressive Web App (PWA)
- Uses SVG for the interactive basketball court
- Stores shot data locally using IndexedDB
- Touch-optimized interface for mobile use

## Development Roadmap

- [x] Initial PWA setup
- [x] Court visualization
- [x] Shot tracking functionality
- [ ] Shooting session history
- [ ] User accounts and cloud sync
- [ ] Shot analytics and trends

## Installation

Visit <https://airball-st.web.app> on your mobile device and use the browser's "Add to Home Screen" option.

## Local Development

```bash
# Clone the repository
git clone https://github.com/igarza99tom/airball.git

# Install dependencies
npm install

# Start development server
ng serve
```
