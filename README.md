# Async Race
Garage Racing – A web application where users can add, edit, and delete cars, then race them on a virtual animated track. 

## Features

- **Garage Management**
  - Add new cars manually or generate random cars
  - Edit car names and colors
  - Delete cars
  - Pagination for car lists

- **Async Racing**
  - Start races for all cars simultaneously
  - Stop or reset any car during a race
  - Animations based on velocity and distance from backend
  - Determine winners automatically
  - Record race time and number of wins

- **Winners Display**
  - List of winners with car name, color, wins, and best time
  - Pagination and sortable table
  - Updates automatically after each race
 

## Installation

```
git clone https://github.com/dianna-paronyan/async-race.git
cd async-race
npm install
npm run dev

```

## Environment Variables

This project uses an environment variable for the base API URL. Create a `.env` file in the root of the project:
```
VITE_API_BASE_URL=api-url
```

## Tech Stack & Tools

- **React** – UI library  
- **Vite** – Fast build tool  
- **TypeScript** – Static typing  
- **Redux Toolkit** – State management  
- **Axios** – API requests  
- **SCSS** – Styling  
- **ESLint + Prettier** – Code quality and formatting  
- **Airbnb ESLint config** – Consistent coding style  
- **Vercel** – Deployment  

## Deployment

Project is deployed on **Vercel**.  
```
https://async-race-u62c.vercel.app
```
