# AI Safety Incident Dashboard

This project is a frontend implementation of an AI Safety Incident Dashboard, created as a take-home assignment.

## Technology Stack

- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui

## Features

- Display a list of AI safety incidents with Title, Severity, and Reported Date
- Filter incidents by Severity (All, Low, Medium, High)
- Sort incidents by Reported Date (Newest First, Oldest First)
- View detailed descriptions of incidents
- Add new incidents through a form with validation

## How to Run the Project

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone <repository-url>
   cd ai-safety-dashboard
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Design Decisions

- Used Next.js App Router for modern React patterns
- Implemented client-side filtering and sorting for a responsive user experience
- Used shadcn/ui components for a clean, accessible UI
- Added form validation to ensure data quality
- Used responsive design to work well on both desktop and mobile devices

## Future Improvements

- Add pagination for large datasets
- Implement search functionality
- Add more detailed filtering options
- Implement data persistence with a backend API
