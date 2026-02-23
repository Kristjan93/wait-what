# Wait What

A real-time queue management system — a digital "take a number" app. Users join a queue by entering their name and phone number, receive a ticket with a queue number, and can track their position live. An admin dashboard lets staff call the next person and manage ticket statuses.

Built with real-time WebSocket updates so all connected clients see changes instantly.

## Tech Stack

**Client:** React 19, TypeScript, Vite, Grommet UI, Socket.IO Client, React Router v6, React Hook Form

**Server:** Express, TypeScript, Socket.IO, JWT Authentication, Bun Runtime

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed

### Setup

```bash
# Install all dependencies
bun install

# Create server .env (copy and edit)
cp server/.env.example server/.env
```

### Development

```bash
# Run both server and client
bun run dev

# Or run separately
bun run dev:server   # http://localhost:4000
bun run dev:client   # http://localhost:5173
```

### Build

```bash
bun run --cwd client build
```

## Project Structure

```
wait-what/
├── client/                 # React frontend
│   ├── src/
│   │   ├── container/App/  # Root App component with Socket.IO connection
│   │   ├── pages/          # Login, Home, Admin, AdminControls, Logout
│   │   ├── providers/      # Global state management (useReducer)
│   │   ├── routes/         # Auth route guards (UserRoute, AdminRoute)
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Helper functions
│   └── vite.config.ts
├── server/                 # Express backend
│   ├── src/
│   │   ├── data/           # In-memory ticket store
│   │   ├── middleware/     # JWT auth middleware
│   │   ├── routes/         # API route handlers
│   │   └── types/          # TypeScript type definitions
│   └── .env.example
└── package.json            # Bun workspaces root
```

## How It Works

1. **Users** log in with name and phone number, then tap "Get a ticket" to join the queue
2. **Admin** logs in at `/admin` and uses the dashboard to call the next person or manage individual tickets
3. **Real-time updates** via Socket.IO — all connected browsers see ticket changes instantly
4. **In-memory store** — tickets reset on server restart (designed as a demo/portfolio piece)
