<div align="center">

# Sync

A full-stack real-time chat application built with React, Node.js, WebSockets, and PostgreSQL.

</div>

---

## Features

| Category | Details |
|---|---|
| Authentication | Email/password signup and login, JWT with HTTP-only cookies, protected routes, session persistence |
| Messaging | One-to-one real-time chat, message persistence in PostgreSQL, message history retrieval |
| Real-Time | WebSocket-powered instant delivery, typing indicators (start/stop), read receipts with timestamps |
| Presence | Online/offline status tracking, live online users list, broadcast status changes |
| Tracking | Unread message count per conversation, per-sender grouping, delivery status indicators |
| UI/UX | Minimal Notion-inspired interface, Inter typography, responsive layout, loading states |
| Security | Bcrypt password hashing (10 salt rounds), Zod input validation on all endpoints, cookie-based auth for WebSocket |
| Infrastructure | Docker Compose for full-stack deployment, PostgreSQL containerization, Nginx reverse proxy for client |

---

## Tech Stack

### Frontend

| Technology | Purpose | Version |
|---|---|---|
| [React](https://react.dev/) | UI library | 19.x |
| [TypeScript](https://www.typescriptlang.org/) | Type safety | 6.x |
| [TailwindCSS](https://tailwindcss.com/) | Utility-first CSS | 4.x |
| [Vite](https://vite.dev/) | Build tool and dev server | 8.x |
| [React Router](https://reactrouter.com/) | Client-side routing | 7.x |
| [Axios](https://axios-http.com/) | HTTP client | 1.x |
| WebSocket API | Real-time communication | Native |

### Backend

| Technology | Purpose | Version |
|---|---|---|
| [Node.js](https://nodejs.org/) | Runtime environment | 20+ |
| [Express](https://expressjs.com/) | HTTP framework | 5.x |
| [ws](https://github.com/websockets/ws) | WebSocket server | 8.x |
| [Prisma](https://www.prisma.io/) | ORM and database toolkit | 7.x |
| [PostgreSQL](https://www.postgresql.org/) | Relational database | 17 |
| [Zod](https://zod.dev/) | Schema validation | 4.x |
| [JSON Web Token](https://github.com/auth0/node-jsonwebtoken) | Authentication tokens | 9.x |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | Password hashing | 6.x |

### Infrastructure

| Technology | Purpose |
|---|---|
| [Docker](https://www.docker.com/) | Containerization |
| [Docker Compose](https://docs.docker.com/compose/) | Multi-container orchestration |
| [Nginx](https://nginx.org/) | Static file serving and reverse proxy for client |

---

## Architecture

```mermaid
graph TB
    subgraph Client["Client - React + Vite"]
        UI["Pages and Components"]
        CTX["AuthContext"]
        HOOKS["Custom Hooks"]
        SERVICES["Services"]
        ROUTER["React Router"]
    end

    subgraph Server["Server - Node.js + Express"]
        subgraph HTTP["REST API Layer"]
            MW["Auth Middleware"]
            CTRL["Controllers"]
            SVC["Services"]
            SCHEMA["Zod Schemas"]
        end

        subgraph WS["WebSocket Layer"]
            WSS["WebSocket Server"]
            SM["Socket Manager"]
            HANDLERS["Handlers"]
            WS_SCHEMA["WS Schemas"]
            EXTRACT["Extract User"]
        end
    end

    subgraph DB["Database"]
        PG["PostgreSQL"]
        PRISMA["Prisma ORM"]
    end

    UI --> CTX
    UI --> HOOKS
    HOOKS --> SERVICES
    SERVICES -->|"HTTP"| MW
    SERVICES -->|"WebSocket"| EXTRACT
    MW --> CTRL
    CTRL --> SCHEMA
    CTRL --> SVC
    EXTRACT --> WSS
    WSS --> SM
    WSS --> HANDLERS
    HANDLERS --> WS_SCHEMA
    SVC --> PRISMA
    HANDLERS --> PRISMA
    PRISMA --> PG
    SM -->|"Broadcast"| SERVICES

    style Client fill:#f7f6f3,stroke:#e3e2de,color:#37352f
    style Server fill:#f7f6f3,stroke:#e3e2de,color:#37352f
    style DB fill:#f7f6f3,stroke:#e3e2de,color:#37352f
    style HTTP fill:#ffffff,stroke:#e3e2de,color:#37352f
    style WS fill:#ffffff,stroke:#e3e2de,color:#37352f
```

---

## Project Structure

```
sync/
|
|-- client/                          # React frontend (Vite)
|   |-- public/
|   |   |-- favicon.svg             # App favicon
|   |   +-- icons.svg               # SVG icon sprites
|   |-- src/
|   |   |-- components/
|   |   |   |-- MessageInput.tsx     # Chat input with typing indicator logic
|   |   |   |-- MessageList.tsx      # Scrollable message list with read status
|   |   |   |-- Navbar.tsx           # Top navigation bar with user info and logout
|   |   |   |-- Sidebar.tsx          # User list with online status and unread counts
|   |   |   +-- Spinner.tsx          # Loading spinner component
|   |   |-- context/
|   |   |   +-- AuthContext.tsx      # Authentication state provider
|   |   |-- hooks/
|   |   |   |-- useAuth.ts           # Auth context consumer hook
|   |   |   |-- useMessage.ts        # Message fetching and state management
|   |   |   +-- useSocket.ts         # WebSocket connection and event handling
|   |   |-- pages/
|   |   |   |-- Chat.tsx             # Main chat page (sidebar + conversation)
|   |   |   |-- NotFound.tsx         # 404 page
|   |   |   |-- SignIn.tsx           # Login page
|   |   |   +-- SignUp.tsx           # Registration page
|   |   |-- routes/
|   |   |   |-- ProtectedRoute.tsx   # Auth-gated route wrapper
|   |   |   +-- PublicRoute.tsx      # Redirects authenticated users
|   |   |-- services/
|   |   |   |-- api.ts               # Axios instance and REST API calls
|   |   |   +-- websocket.ts         # WebSocket connection manager
|   |   |-- types/
|   |   |   |-- auth.types.ts        # Auth-related TypeScript types
|   |   |   +-- message.types.ts     # Message and WebSocket event types
|   |   |-- App.tsx                  # Root component with route definitions
|   |   |-- App.css                  # Spinner animation styles
|   |   |-- main.tsx                 # Application entry point
|   |   +-- index.css                # Tailwind CSS config and base styles
|   |-- Dockerfile                   # Multi-stage build (Node + Nginx)
|   |-- nginx.conf                   # Nginx configuration for SPA routing
|   |-- index.html                   # HTML entry point
|   |-- vite.config.ts               # Vite configuration
|   |-- tsconfig.json                # TypeScript config (references)
|   |-- tsconfig.app.json            # App-specific TS config
|   |-- tsconfig.node.json           # Node-specific TS config
|   |-- eslint.config.js             # ESLint configuration
|   +-- package.json
|
|-- server/                          # Node.js backend
|   |-- prisma/
|   |   |-- schema.prisma            # Database schema (User, Message)
|   |   +-- migrations/              # Prisma migration history
|   |-- src/
|   |   |-- api/
|   |   |   |-- api.ts               # Express app setup (CORS, middleware, routes)
|   |   |   |-- controller/
|   |   |   |   |-- auth.controller.ts         # Signup, signin, me, logout handlers
|   |   |   |   +-- conversation.controller.ts # Users, messages, unread count handlers
|   |   |   |-- middleware/
|   |   |   |   +-- auth.middleware.ts          # JWT cookie verification middleware
|   |   |   |-- routes/
|   |   |   |   |-- auth.routes.ts             # /signup, /signin, /me, /logout
|   |   |   |   +-- conversation.router.ts     # /users, /messages/:id, /messages/unreadCount
|   |   |   |-- schema/
|   |   |   |   |-- auth.schema.ts             # Zod schemas for auth payloads
|   |   |   |   +-- conversation.schema.ts     # Zod schema for userId params
|   |   |   +-- services/
|   |   |       |-- auth.services.ts           # Auth business logic (bcrypt, JWT)
|   |   |       +-- conversation.services.ts   # Message and user query services
|   |   |-- ws/
|   |   |   |-- ws.ts                # WebSocket server initialization and event routing
|   |   |   |-- socket-manager.ts    # In-memory socket registry
|   |   |   |-- handlers/
|   |   |   |   |-- send-message.handler.ts    # Persist message + forward to receiver
|   |   |   |   |-- typing.handler.ts          # Start/stop typing relay
|   |   |   |   +-- read-receipts.handler.ts   # Mark messages read + notify sender
|   |   |   |-- routes/
|   |   |   |   +-- message.routes.ts          # Handler dispatch map
|   |   |   |-- schemas/
|   |   |   |   |-- client-message.schema.ts   # Client to server event schemas
|   |   |   |   +-- server-message.schema.ts   # Server to client event schemas
|   |   |   +-- utils/
|   |   |       +-- extract-user.ts            # Parse cookie, verify JWT, extract userId
|   |   |-- lib/
|   |   |   |-- env.ts               # Zod-validated environment variables
|   |   |   +-- prisma.ts            # Prisma client singleton (pg adapter)
|   |   |-- types/
|   |   |   +-- express.d.ts         # Express Request augmentation (req.id)
|   |   +-- index.ts                 # Server entry: start HTTP + init WebSockets
|   |-- Dockerfile                   # Server container build
|   |-- prisma.config.ts             # Prisma CLI configuration
|   |-- tsconfig.json                # TypeScript configuration
|   |-- .env                         # Environment variables (not committed)
|   +-- package.json
|
|-- docker-compose.yml               # Full-stack orchestration (postgres + backend + frontend)
+-- README.md
```

---

## Database Schema

```mermaid
erDiagram
    USER {
        String id PK "cuid()"
        String email UK "unique"
        String password "bcrypt hashed"
        DateTime createdAt "default: now()"
        DateTime updatedAt "auto-updated"
    }

    MESSAGE {
        String id PK "cuid()"
        String content "message body"
        String senderId FK "references User.id"
        String receiverId FK "references User.id"
        DateTime readAt "nullable (null = unread)"
        DateTime createdAt "default: now()"
    }

    USER ||--o{ MESSAGE : "sends (Sender)"
    USER ||--o{ MESSAGE : "receives (Receiver)"
```

### Design Decisions

- **readAt as nullable DateTime** -- A nullable timestamp instead of a boolean flag. Enables "read at (time)" display and supports future analytics. null = unread, a timestamp = read.
- **CUID identifiers** -- Collision-resistant, URL-safe, and sortable unique identifiers.
- **Dual foreign keys** -- The Message model has two foreign keys to User, distinguished by Prisma named relations (Sender and Receiver).

---

## API Documentation

All REST endpoints are prefixed with `/api/v1`. Every response follows a standard envelope format:

```json
{
  "success": true,
  "message": "Human-readable status message"
}
```

Authentication is cookie-based. Successful calls to `/signup` or `/signin` set an HttpOnly cookie named `token` containing a signed JWT. Protected endpoints read this cookie via the auth middleware and inject the authenticated user ID into the request.

### Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/signup` | Register a new user account |
| POST | `/api/v1/signin` | Authenticate with email and password |
| GET | `/api/v1/me` | Retrieve the current user profile |
| POST | `/api/v1/logout` | Clear the authentication cookie |
| GET | `/api/v1/users` | List all registered users except the caller |
| GET | `/api/v1/messages/:id` | Fetch message history with a specific user |
| GET | `/api/v1/messages/unreadCount` | Get unread message counts grouped by sender |

---

### POST /api/v1/signup

Register a new user. On success, a JWT is issued as an HTTP-only cookie.

**Request Body**

| Field | Type | Constraints |
|---|---|---|
| email | string | Valid email format, trimmed |
| password | string | Min 4 characters, max 100 characters |

```json
{
  "email": "alice@example.com",
  "password": "securepassword"
}
```

**Responses**

<details>
<summary><code>200 OK</code> -- Account created</summary>

Sets cookie: `token=<jwt>; HttpOnly; SameSite=Lax; Secure=false`

```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": "cm5abc123def456",
    "email": "alice@example.com"
  }
}
```

</details>

<details>
<summary><code>400 Bad Request</code> -- Validation failed</summary>

```json
{
  "success": false,
  "message": "Invalid input"
}
```

</details>

<details>
<summary><code>400 Bad Request</code> -- Email already registered</summary>

```json
{
  "success": false,
  "message": "email already registered"
}
```

</details>

---

### POST /api/v1/signin

Authenticate an existing user. On success, a JWT is issued as an HTTP-only cookie.

**Request Body**

| Field | Type | Constraints |
|---|---|---|
| email | string | Valid email format, trimmed |
| password | string | Min 4 characters, max 100 characters |

```json
{
  "email": "alice@example.com",
  "password": "securepassword"
}
```

**Responses**

<details>
<summary><code>200 OK</code> -- Login successful</summary>

Sets cookie: `token=<jwt>; HttpOnly; SameSite=Lax; Secure=false`

```json
{
  "success": true,
  "message": "User loggedin successfully",
  "user": {
    "id": "cm5abc123def456",
    "email": "alice@example.com"
  }
}
```

</details>

<details>
<summary><code>400 Bad Request</code> -- Validation failed</summary>

```json
{
  "success": false,
  "message": "Invalid input"
}
```

</details>

<details>
<summary><code>400 Bad Request</code> -- User not found</summary>

```json
{
  "success": false,
  "message": "User doesn't exist"
}
```

</details>

<details>
<summary><code>400 Bad Request</code> -- Wrong password</summary>

```json
{
  "success": false,
  "message": "Wrong Credentials entered"
}
```

</details>

---

### GET /api/v1/me

Retrieve the authenticated user profile. Requires the `token` cookie.

**Responses**

<details>
<summary><code>200 OK</code> -- Profile retrieved</summary>

```json
{
  "success": true,
  "message": "User fetched successfully",
  "user": {
    "id": "cm5abc123def456",
    "email": "alice@example.com"
  }
}
```

</details>

<details>
<summary><code>400 Bad Request</code> -- Missing or invalid token</summary>

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

</details>

---

### POST /api/v1/logout

Clear the authentication cookie, ending the current session.

**Responses**

<details>
<summary><code>200 OK</code> -- Logged out</summary>

Clears cookie: `token`

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

</details>

---

### GET /api/v1/users

List all registered users except the authenticated caller. Requires the `token` cookie.

**Responses**

<details>
<summary><code>200 OK</code> -- Users retrieved</summary>

```json
{
  "success": true,
  "message": "Successfully fetched the users list",
  "users": [
    {
      "id": "cm5def456ghi789",
      "email": "bob@example.com"
    }
  ]
}
```

</details>

---

### GET /api/v1/messages/:id

Fetch the full message history between the authenticated user and the user specified by `:id`. Messages are returned in ascending chronological order. Requires the `token` cookie.

**Path Parameters**

| Parameter | Type | Constraints |
|---|---|---|
| id | string | Must be a valid CUID |

**Responses**

<details>
<summary><code>200 OK</code> -- Messages retrieved</summary>

```json
{
  "success": true,
  "message": "Messages fetched successfully",
  "messages": [
    {
      "id": "cm5msg001abc",
      "content": "Hey, how are you?",
      "senderId": "cm5abc123def456",
      "receiverId": "cm5def456ghi789",
      "readAt": "2025-07-01T10:30:00.000Z",
      "createdAt": "2025-07-01T10:25:00.000Z"
    },
    {
      "id": "cm5msg002def",
      "content": "Doing great, thanks!",
      "senderId": "cm5def456ghi789",
      "receiverId": "cm5abc123def456",
      "readAt": null,
      "createdAt": "2025-07-01T10:26:00.000Z"
    }
  ]
}
```

The readAt field is null for unread messages and an ISO 8601 timestamp for read messages.

</details>

<details>
<summary><code>400 Bad Request</code> -- Invalid user ID format</summary>

```json
{
  "success": false,
  "message": "Invalid user params"
}
```

</details>

---

### GET /api/v1/messages/unreadCount

Get the count of unread messages received by the authenticated user, grouped by sender. Requires the `token` cookie.

**Responses**

<details>
<summary><code>200 OK</code> -- Unread counts retrieved</summary>

```json
{
  "success": true,
  "message": "successfully fetched the unread count",
  "unread": {
    "cm5def456ghi789": 3,
    "cm5jkl012mno345": 1
  }
}
```

The unread field is a map of senderId to the number of unread messages from that sender. Empty if there are no unread messages.

</details>

---

## WebSocket Events

The WebSocket server runs on the same port as the HTTP server (ws://localhost:3000). Authentication is handled by parsing the `token` cookie from the upgrade request headers.

### Client to Server

| Event Type | Payload | Description |
|---|---|---|
| send_message | `{ to: string, content: string }` | Send a message to a user |
| start_typing | `{ to: string }` | Notify a user you started typing |
| stop_typing | `{ to: string }` | Notify a user you stopped typing |
| send_read_receipt | `{ to: string }` | Mark all messages from a user as read |

### Server to Client

| Event Type | Payload | Description |
|---|---|---|
| recieve_message | `{ id, content, senderId, receiverId, createdAt }` | Incoming message from another user |
| status_indicator | `{ from: string, content: "ONLINE" or "OFFLINE" }` | User presence change notification |
| online_list | `string[]` | Full list of online user IDs (sent on connect) |
| start_typing | `{ from: string }` | A user started typing to you |
| stop_typing | `{ from: string }` | A user stopped typing to you |
| recieve_read_receipt | `{ from: string, readAt: Date }` | Your messages were read by a user |

### Validation

All WebSocket messages are validated using Zod discriminated unions:

```typescript
// Client to Server (4 event types)
const clientMessageSchema = z.discriminatedUnion("type", [
  sendMessageSchema,
  clientStartTypingSchema,
  clientStopTypingSchema,
  readMessageSchema,
]);

// Server to Client (6 event types)
const serverMessageSchema = z.discriminatedUnion("type", [
  serverReceiveMessageSchema,
  sendStatusSchema,
  sendOnlineListSchema,
  serverStartTypingSchema,
  serverStopTypingSchema,
  readMessageSchema,
]);
```

---

## Environment Variables

### Server (server/.env)

| Variable | Description | Example |
|---|---|---|
| DATABASE_URL | PostgreSQL connection string | `postgresql://postgres:password@localhost:5433/mydb` |
| TOKEN_SECRET | JWT signing secret | `your-super-secret-key-here` |
| PORT | Server port | `3000` |

### Client

The client uses environment-based configuration:

| File | Variable | Development | Production |
|---|---|---|---|
| .env.development | VITE_API_URL | `http://localhost:3000` | -- |
| .env.production | VITE_API_URL | -- | `/` (relative, proxied by Nginx) |

---

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm 10 or later
- PostgreSQL 16+ (or use Docker)
- Git

---

### Option A: Docker Compose (recommended)

This is the simplest way to run the entire stack. Docker Compose will start PostgreSQL, the backend server, and the frontend Nginx container.

**1. Clone the repository**

```bash
git clone https://github.com/Abhishek8841/realtime-chat-app.git
cd realtime-chat-app
```

**2. Start all services**

```bash
docker compose up --build
```

This starts three containers:

| Service | Container | Port | Description |
|---|---|---|---|
| postgres | postgres-db | 5433:5432 | PostgreSQL 17 database with health checks |
| backend | sync-backend | 3000:3000 | Node.js API and WebSocket server |
| frontend | sync-frontend | 8080:80 | Nginx serving the built React app |

**3. Open the app**

- Frontend: http://localhost:8080
- Backend API: http://localhost:3000/api/v1
- WebSocket: ws://localhost:3000

**4. Stop all services**

```bash
docker compose down
```

To also remove the database volume:

```bash
docker compose down -v
```

---

### Option B: Local Development

Run each service individually for development with hot reload.

**1. Clone the repository**

```bash
git clone https://github.com/Abhishek8841/realtime-chat-app.git
cd realtime-chat-app
```

**2. Set up the database**

Using Docker (recommended):

```bash
docker run -d \
  --name sync-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=mydb \
  -p 5433:5432 \
  postgres:17
```

Or use a local PostgreSQL instance on port 5433.

**3. Configure environment**

Create `server/.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5433/mydb"
TOKEN_SECRET="your-super-secret-key-here"
PORT=3000
```

**4. Install dependencies**

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

**5. Run database migrations**

```bash
cd server
npx prisma migrate dev --name init
```

**6. Generate Prisma client**

```bash
npx prisma generate
```

**7. Start the application**

Open two terminals:

```bash
# Terminal 1 -- Start the server
cd server
npx tsx src/index.ts

# Terminal 2 -- Start the client
cd client
npm run dev
```

**8. Open the app**

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api/v1
- WebSocket: ws://localhost:3000

---

## Docker Compose Reference

The `docker-compose.yml` at the project root defines three services:

```yaml
services:
  postgres:      # PostgreSQL 17, port 5433, with health check
  backend:       # Node.js server, port 3000, depends on healthy postgres
  frontend:      # Nginx + React build, port 8080, depends on backend
```

Key details:

- The **postgres** service uses a named volume (`postgres-data`) for persistence across restarts.
- The **backend** service waits for postgres to pass its health check before starting. Prisma migrations run as part of the server Dockerfile build step.
- The **frontend** service uses a multi-stage Dockerfile: Node.js builds the React app, then Nginx serves the static files. The `MODE` build arg defaults to `production` but can be set to `development` for dev API URLs.
- The client Nginx config handles SPA routing by falling back to `index.html` for all routes.

---

## Future Improvements

| Feature | Description | Complexity |
|---|---|---|
| Group Chats | Multi-user chat rooms with member management and admin roles | Medium |
| File Sharing | Image, document, and media uploads with preview support | Medium |
| Video/Audio Calls | WebRTC-based peer-to-peer calling with signaling server | High |
| End-to-End Encryption | Signal Protocol implementation for client-side message encryption | High |
| Redis Pub/Sub | Horizontal scaling with Redis as a message broker between server instances | Medium |
| Kubernetes Deployment | Container orchestration with Helm charts, HPA, and ingress configuration | High |
| CI/CD Pipelines | GitHub Actions for automated testing, linting, building, and deployment | Low |
| Prometheus/Grafana | Metrics collection, dashboards for WebSocket connections and message throughput | Medium |
| Message Search | Full-text search across conversation history using PostgreSQL tsvector | Medium |
| Push Notifications | Service Worker and Web Push API for offline message notifications | Medium |

---

<div align="center">

Built by [Abhishek](https://github.com/Abhishek8841)

</div>