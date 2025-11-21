# Veryable Frontend Challenge


## Setup

1. Clone the repository
2. Install dependencies:
   npm install
3. Run the development server:
   npm run dev
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Tech Stack

- **Next.js 16** - React framework
- **React 19** - UI library
- **Material-UI (MUI)** - Component library
- **TypeScript** - Type safety
- **moment.js** - Date formatting

## Design Decisions

### Component Structure
I broke the UI into smaller components (`OpCard`, `OperatorTable`, `CheckCodeDialog`) to keep things modular and easier to maintain.

### Check-In/Check-Out System
Check-in/check-out state is stored in localStorage using a nested structure: `state[opId][operatorId]`. This lets us track each operator's status per operation. When a user clicks "Check In" or "Check Out", they enter a code that gets validated against the operation's check-in/check-out code. If valid, the timestamp is saved to localStorage and persists across page refreshes.

### State Management
Used React Context (`checkInContext`) for managing check-in state across components. This avoids prop drilling and keeps the state logic centralized.

## Bonus Features Completed

✅ **Filtering**: Search by operator name, op title, or public ID  
✅ **Sorting**: Sort operators by name, ops completed, or reliability (ascending/descending)

## If I Had More Time...

- Add unit tests for the check-in/check-out logic
- Add loading skeletons 
- Improve mobile responsiveness
