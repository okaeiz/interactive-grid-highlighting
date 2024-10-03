# Interactive Grid Highlighting Project

## Overview

This project implements a grid-based React component that displays data fetched from a JSON file hosted on [Mocky](https://designer.mocky.io/). The grid features interactive row and column headers with highlight functionality.

## Features

- Displays data in a grid format with row and column headers
- Fetches data from a provided JSON API response
- Column highlight: Hovering over a column header highlights the entire column
- Row highlight: Hovering over a row header highlights the entire row
- Mutually exclusive highlighting: Row and column highlights do not occur simultaneously

## Technologies Used

- React
- TypeScript
- Shadcn UI (for Table component)
- TailwindCSS (for styling)

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start` or `npx vite`

## Usage

Import the Grid component into your React application:

```jsx
import Grid from "./components/Grid";

function App() {
  return (
    <div className="App">
      <Grid />
    </div>
  );
}
```
