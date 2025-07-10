# SOC Dashboard - Security Operations Center

A comprehensive Security Operations Center dashboard built with Next.js, featuring real-time threat monitoring, alert management, and incident response capabilities.

## Features

### 🔍 Real-time Monitoring
- Live security alerts with severity classification
- System performance monitoring
- Network traffic analysis
- Threat intelligence feeds

### 🚨 Alert Management
- **Resolve** - Mark alerts as resolved with timeline tracking
- **Snooze** - Temporarily suppress alerts for 24 hours
- **False Positive** - Mark alerts as false positives with reasoning
- Advanced filtering and search capabilities
- Real-time status updates

### 📋 Case Management
- Security incident tracking
- Investigation workflow management
- Time tracking and resource allocation
- Related alerts and logs correlation

### 📊 Analytics & Reporting
- Interactive charts and graphs
- Severity distribution analysis
- Alert trends over time
- Performance metrics dashboard

### 🔍 Log Analysis
- Centralized log management
- Advanced filtering by level, source, and time
- Real-time log streaming
- Related alerts correlation

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom dark theme
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **State Management**: React Context API

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/demo-dashboard.git
   cd demo-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages:

1. **Fork or clone this repository to your GitHub account**

2. **Enable GitHub Pages in repository settings:**
   - Go to Settings → Pages
   - Source: GitHub Actions
   - The workflow will automatically deploy on pushes to main branch

3. **Access your deployed dashboard:**
   - URL: `https://your-username.github.io/demo-dashboard/`
   - The dashboard will be automatically updated on every push to main

### Manual Deployment

You can also build and deploy manually:

```bash
# Build for production
npm run build

# The static files will be in the 'out' directory
# Upload the contents of 'out' to any static hosting service
```

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
soc-dashboard/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main dashboard page
│   └── globals.css        # Global styles
├── components/             # React components
│   ├── Dashboard.tsx      # Main dashboard view
│   ├── AlertsView.tsx     # Alert management
│   ├── LogsView.tsx       # Log analysis
│   ├── CasesView.tsx      # Case management
│   └── Navigation.tsx     # Sidebar navigation
├── lib/                   # Utilities and data
│   └── mockData.ts        # Synthetic data generation
├── types/                 # TypeScript definitions
│   └── index.ts           # Core type definitions
└── ...config files
```

## Features Overview

### Dashboard View
- **Key Metrics**: Active alerts, open cases, system uptime, log events
- **Alert Trends**: 7-day historical data with severity breakdown
- **Severity Distribution**: Visual pie chart of alert classifications
- **Recent Activity**: Latest alerts and active cases

### Alerts View
- **Comprehensive Table**: Sortable columns with real-time data
- **Advanced Filtering**: By severity, status, source, and time range
- **Action Management**: Quick actions for resolve, snooze, and false positive
- **Detailed Panel**: Full alert information with timeline and indicators
- **Related Data**: Connected logs and cases

### Logs View
- **Real-time Streaming**: Live log updates with automatic refresh
- **Multi-level Filtering**: By log level, source, and time range
- **Search Capability**: Full-text search across log messages
- **Detail Panel**: Complete log information with metadata
- **Export Functionality**: Download logs for external analysis

### Cases View
- **Visual Cards**: Grid layout with key case information
- **Status Tracking**: Open, in progress, closed, escalated
- **Priority System**: P1-P5 priority classification
- **Time Tracking**: Estimated vs actual hours
- **Related Items**: Connected alerts and logs

## Data Models

### Alerts
- Severity levels: Critical, High, Medium, Low, Info
- Status tracking: Open, Investigating, Resolved, Snoozed, False Positive
- Network information: Source/destination IPs, risk scores
- Timeline tracking: All status changes and actions

### Logs
- Log levels: Error, Warning, Info, Debug
- Event categorization: Authentication, authorization, data access, system events
- Relationship mapping: Connected to alerts and cases
- Full metadata: User sessions, IP addresses, response codes

### Cases
- Investigation workflow: Open → In Progress → Closed/Escalated
- Resource tracking: Assigned analysts, estimated/actual hours
- Related evidence: Connected alerts and logs
- Documentation: Timeline, tags, and categories

## Synthetic Data

The dashboard includes a comprehensive synthetic data generator that creates:

- **500 realistic security alerts** with varied severities and sources
- **2000 system logs** across different levels and event types
- **150 security cases** with proper workflow states
- **Realistic relationships** between alerts, logs, and cases
- **Time-based data** spanning the last 30 days

## Customization

### Adding New Alert Sources
Edit `lib/mockData.ts` to add new security tools:

```typescript
const sources = [
  'Your New Security Tool',
  // ... existing sources
];
```

### Custom Severity Colors
Modify `tailwind.config.js` for custom color schemes:

```javascript
colors: {
  alert: {
    critical: '#your-color',
    // ... other severities
  }
}
```

### Real Data Integration
Replace the mock data in `lib/mockData.ts` with API calls to your security tools:

```typescript
// Replace mockAlerts with API call
export const getAlerts = async () => {
  const response = await fetch('/api/alerts');
  return response.json();
};
```

## Performance Optimizations

- **Virtual scrolling** for large datasets
- **Memoized components** for expensive computations
- **Debounced search** to reduce API calls
- **Lazy loading** for detailed views
- **Optimized re-renders** with React.memo

## Security Considerations

- All data is client-side simulated (no real security data exposed)
- Proper input sanitization for search functionality
- XSS protection through React's built-in escaping
- No sensitive data in source control

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for demonstration purposes. Please ensure compliance with your organization's security policies before deploying in production environments. 