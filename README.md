# Productivity Dashboard

A Progressive Web Application (PWA) built with Svelte and Bun that allows users to view and interact with productivity metrics through dynamic charts.

## Features

- **Interactive Charts**: Line chart showing productivity over time, bar chart for detailed daily metrics
- **Real-time Updates**: Sliders and input fields modify data instantly with visual feedback
- **PWA Support**: Works offline, installable on desktop & iPhone/iPad home screen
- **Tablet-Optimized**: Designed for iPad with touch targets and tablet-friendly layout

## Tech Stack

- **Framework**: Svelte 4.x
- **Build Tool**: Vite 5.x
- **Runtime**: [Bun](https://bun.sh) 1.0+
- **Charts**: Chart.js 4.x
- **PWA**: vite-plugin-pwa
- **Styling**: CSS Variables + Custom Properties
- **Design**: iPad/tablet, Desktop

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) 1.0+ installed

### Installation

```bash
# Install Bun if you haven't already
curl -fsSL https://bun.sh/install | bash

# Navigate to project
cd productivity-dashboard

# Install dependencies
bun install

# Start development server
bun run dev
```

Open your browser to `http://localhost:5173`

### Building for Production

```bash
bun run build
```

The `dist/` folder will contain the production-ready app.

### Preview Production Build

```bash
bun run preview
```

## How to Use

1. **View Productivity Trends**: The line chart shows productivity scores across all 30 days
2. **Select a Day**: Use the dropdown to choose which day to edit
3. **Adjust Parameters**:
   - **Drag sliders**
   - **Tap +/- buttons**
   - **Type values**
   - Hours Worked: 0-16 hours
   - Break Minutes: 0-240 minutes
   - Focus Level: 1-10 scale
4. **See Results**: Charts update in real-time along with the productivity score
5. **Install as App**:
   - **iPad/iPhone**: Tap Share → "Add to Home Screen"
   - Works offline once installed

## Productivity Formula

```
Productivity Score = (Hours Worked × 10) + (Focus Level × 5) − (Break Minutes × 0.5)
```

## Key Design Decisions

1. **Svelte + Bun**: Chosen for minimal bundle size and performance, as well as a fast development workflow
2. **Chart.js**: For its simplicity and faster development time
3. **Vite PWA Plugin**: Handles service worker generation automatically with Workbox, making offline support trivial to implement
4. **CSS Variables**: Used for theming to ensure consistency and easy customization
5. **Component Architecture**:
   - Separate chart components for reusability
   - Centralized data management in `dataManager.js`
   - Event-based communication between controls and charts

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+ (for PWA installation)

## Future Enhancements

- [ ] Data export to CSV
- [ ] Multiple dataset support - save configurations in local storage
- [ ] Animation improvements for chart transitions
- [ ] Data persistence using localStorage
- [ ] Export to PDF report

---
