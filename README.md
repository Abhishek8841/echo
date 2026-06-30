<div align="center">

# Sync — Real-Time Chat Application

**A full-stack, real-time one-to-one chat application built with React, Node.js, WebSockets, and PostgreSQL.**

[Features](#-features) · [Tech Stack](#-tech-stack) · [Architecture](#-architecture) · [Getting Started](#-getting-started) · [API Docs](#-api-documentation) · [WebSocket Events](#-websocket-events)

</div>

---

## Features

| Category | Features |
|---|---|
| **Authentication** | Email/password signup & login, JWT with HTTP-only cookies, protected routes, session persistence |
| **Messaging** | One-to-one real-time chat, message persistence in PostgreSQL, message history retrieval |
| **Real-Time** | WebSocket-powered instant delivery, typing indicators (start/stop), read receipts with timestamps |
| **Presence** | Online/offline status tracking, live online users list, broadcast status changes |
| **Tracking** | Unread message count per conversation, per-sender grouping, delivery status indicators |
| **UI/UX** | Responsive design with TailwindCSS, loading spinners, error handling states, route guards |
| **Security** | Bcrypt password hashing (10 salt rounds), Zod input validation on all endpoints, cookie-based auth for WebSocket |
| **Infrastructure** | Docker support, PostgreSQL containerization, environment-based configuration |

---

## Tech Stack

### Frontend

| Technology | Purpose | Version |
|---|---|---|
| [React](https://react.dev/) | UI library | `19.x` |
| [TypeScript](https://www.typescriptlang.org/) | Type safety | `6.x` |
| [TailwindCSS](https://tailwindcss.com/) | Utility-first CSS | `4.x` |
| [Vite](https://vite.dev/) | Build tool & dev server | `8.x` |
| [React Router](https://reactrouter.com/) | Client-side routing | `7.x` |
| [Axios](https://axios-http.com/) | HTTP client | `1.x` |
| WebSocket API | Real-time communication | Native |

### Backend

| Technology | Purpose | Version |
|---|---|---|
| [Node.js](https://nodejs.org/) | Runtime environment | `20+` |
| [Express](https://expressjs.com/) | HTTP framework | `5.x` |
| [ws](https://github.com/websockets/ws) | WebSocket server | `8.x` |
| [Prisma](https://www.prisma.io/) | ORM & database toolkit | `7.x` |
| [PostgreSQL](https://www.postgresql.org/) | Relational database | `16` |
| [Zod](https://zod.dev/) | Schema validation | `4.x` |
| [JSON Web Token](https://github.com/auth0/node-jsonwebtoken) | Authentication tokens | `9.x` |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | Password hashing | `6.x` |

---

## Architecture

### System Architecture Diagram

```mermaid
graph TB
    subgraph Client["Client (React + Vite)"]
        UI["Pages & Components"]
        CTX["AuthContext"]
        HOOKS["Custom Hooks<br/>useAuth · useSocket · useMessage"]
        SERVICES["Services<br/>api.ts · websocket.ts"]
        ROUTER["React Router<br/>ProtectedRoute · PublicRoute"]
    end

    subgraph Server["Server (Node.js + Express)"]
        subgraph HTTP["REST API Layer"]
            MW["Auth Middleware<br/>JWT Cookie Verification"]
            CTRL["Controllers<br/>Auth · Conversation"]
            SVC["Services<br/>Auth · Conversation"]
            SCHEMA["Zod Schemas<br/>Validation Layer"]
        end

        subgraph WS["WebSocket Layer"]
            WSS["WebSocket Server (ws)"]
            SM["Socket Manager<br/>Map&lt;userId, Set&lt;WebSocket&gt;&gt;"]
            HANDLERS["Handlers<br/>SendMessage · Typing · ReadReceipts"]
            WS_SCHEMA["WS Schemas<br/>Client & Server Messages"]
            EXTRACT["Extract User<br/>Cookie → JWT → userId"]
        end
    end

    subgraph DB["Database"]
        PG["PostgreSQL"]
        PRISMA["Prisma ORM<br/>@prisma/adapter-pg"]
    end

    UI --> CTX
    UI --> HOOKS
    HOOKS --> SERVICES
    SERVICES -->|"HTTP (Axios)"| MW
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
    SM -->|"Broadcast / Direct Send"| SERVICES

    style Client fill:#1a1a2e,stroke:#e94560,color:#fff
    style Server fill:#16213e,stroke:#0f3460,color:#fff
    style DB fill:#0f3460,stroke:#533483,color:#fff
    style HTTP fill:#1a1a2e,stroke:#e94560,color:#fff
    style WS fill:#1a1a2e,stroke:#00b4d8,color:#fff
```

---

##  Project Structure

```
Sync/
├── client/                          # React frontend (Vite)
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── MessageInput.tsx     # Chat input with typing indicator logic
│   │   │   ├── MessageList.tsx      # Scrollable message list with read status
│   │   │   ├── Navbar.tsx           # Top navigation bar with logout
│   │   │   ├── Sidebar.tsx          # User list with online status & unread counts
│   │   │   └── Spinner.tsx          # Loading spinner component
│   │   ├── context/
│   │   │   └── AuthContext.tsx      # Authentication state provider
│   │   ├── hooks/
│   │   │   ├── useAuth.ts           # Auth context consumer hook
│   │   │   ├── useMessage.ts        # Message fetching & state management
│   │   │   └── useSocket.ts         # WebSocket connection & event handling
│   │   ├── pages/
│   │   │   ├── Chat.tsx             # Main chat page (sidebar + conversation)
│   │   │   ├── SignIn.tsx           # Login page
│   │   │   └── SignUp.tsx           # Registration page
│   │   ├── routes/
│   │   │   ├── ProtectedRoute.tsx   # Auth-gated route wrapper
│   │   │   └── PublicRoute.tsx      # Redirects authenticated users
│   │   ├── services/
│   │   │   ├── api.ts               # Axios instance & REST API calls
│   │   │   └── websocket.ts         # WebSocket connection manager
│   │   ├── types/
│   │   │   ├── auth.types.ts        # Auth-related TypeScript types
│   │   │   └── message.types.ts     # Message & WebSocket event types
│   │   ├── App.tsx                  # Root component with route definitions
│   │   ├── App.css                  # Global styles
│   │   ├── main.tsx                 # Application entry point
│   │   └── index.css                # Tailwind CSS imports
│   ├── index.html                   # HTML entry point
│   ├── vite.config.ts               # Vite configuration
│   ├── tsconfig.json                # TypeScript config (references)
│   ├── tsconfig.app.json            # App-specific TS config
│   ├── tsconfig.node.json           # Node-specific TS config
│   ├── eslint.config.js             # ESLint configuration
│   └── package.json
│
├── server/                          # Node.js backend
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema (User, Message)
│   │   └── migrations/              # Prisma migration history
│   ├── src/
│   │   ├── api/
│   │   │   ├── api.ts               # Express app setup (CORS, middleware, routes)
│   │   │   ├── controller/
│   │   │   │   ├── auth.controller.ts         # Signup, signin, me, logout handlers
│   │   │   │   └── conversation.controller.ts # Users, messages, unread count handlers
│   │   │   ├── middleware/
│   │   │   │   └── auth.middleware.ts          # JWT cookie verification middleware
│   │   │   ├── routes/
│   │   │   │   ├── auth.routes.ts             # /signup, /signin, /me, /logout
│   │   │   │   └── conversation.router.ts     # /users, /messages/:id, /messages/unreadCount
│   │   │   ├── schema/
│   │   │   │   ├── auth.schema.ts             # Zod schemas for auth payloads
│   │   │   │   └── conversation.schema.ts     # Zod schema for userId params
│   │   │   └── services/
│   │   │       ├── auth.services.ts           # Auth business logic (bcrypt, JWT)
│   │   │       └── conversation.services.ts   # Message & user query services
│   │   ├── ws/
│   │   │   ├── ws.ts                # WebSocket server initialization & event routing
│   │   │   ├── socket-manager.ts    # In-memory socket registry (Map<id, Set<WS>>)
│   │   │   ├── handlers/
│   │   │   │   ├── send-message.handler.ts    # Persist message + forward to receiver
│   │   │   │   ├── typing.handler.ts          # Start/stop typing relay
│   │   │   │   └── read-receipts.handler.ts   # Mark messages read + notify sender
│   │   │   ├── routes/
│   │   │   │   └── message.routes.ts          # Handler dispatch map
│   │   │   ├── schemas/
│   │   │   │   ├── client-message.schema.ts   # Zod: client → server event schemas
│   │   │   │   └── server-message.schema.ts   # Zod: server → client event schemas
│   │   │   └── utils/
│   │   │       └── extract-user.ts            # Parse cookie → verify JWT → extract userId
│   │   ├── lib/
│   │   │   ├── env.ts               # Zod-validated environment variables
│   │   │   └── prisma.ts            # Prisma client singleton (pg adapter)
│   │   ├── types/
│   │   │   └── express.d.ts         # Express Request augmentation (req.id)
│   │   └── index.ts                 # Server entry: start HTTP + init WebSockets
│   ├── prisma.config.ts             # Prisma CLI configuration
│   ├── tsconfig.json                # TypeScript configuration
│   ├── .env                         # Environment variables (not committed)
│   └── package.json
│
└── README.md
```

---

## Database Schema

### ER Diagram

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
        String senderId FK "→ User.id"
        String receiverId FK "→ User.id"
        DateTime readAt "nullable (null = unread)"
        DateTime createdAt "default: now()"
    }

    USER ||--o{ MESSAGE : "sends (Sender)"
    USER ||--o{ MESSAGE : "receives (Receiver)"
```

### Key Design Decisions

- **`readAt: DateTime?`** — A nullable timestamp is used instead of a boolean flag. This enables "read at \<time>" display and supports future analytics. `null` = unread, a timestamp = read.
- **`cuid()` IDs** — Collision-resistant, URL-safe, and sortable unique identifiers.
- **Dual Relations** — The `Message` model has two foreign keys to `User`, distinguished by Prisma's named relations (`@relation("Sender")` and `@relation("Receiver")`).

---

## API Documentation

All REST endpoints are prefixed with **`/api/v1`**. Every response follows a standard envelope format:

```json
{
  "success": true | false,
  "message": "Human-readable status message",
  "...": "Endpoint-specific data fields"
}
```

Authentication is cookie-based. Successful calls to `/signup` or `/signin` set an `HttpOnly` cookie named `token` containing a signed JWT. Protected endpoints read this cookie via the `auth.middleware` and inject the authenticated user's ID into the request.

### Endpoints at a Glance

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/signup` | Register a new user account |
| `POST` | `/api/v1/signin` | Authenticate with email and password |
| `GET` | `/api/v1/me` | Retrieve the current user's profile |
| `POST` | `/api/v1/logout` | Clear the authentication cookie |
| `GET` | `/api/v1/users` | List all registered users except the caller |
| `GET` | `/api/v1/messages/:id` | Fetch message history with a specific user |
| `GET` | `/api/v1/messages/unreadCount` | Get unread message counts grouped by sender |

---

### `POST /api/v1/signup`

Register a new user. On success, a JWT is issued as an HTTP-only cookie.

**Request Body**

| Field | Type | Constraints |
|---|---|---|
| `email` | `string` | Valid email format, trimmed |
| `password` | `string` | Min 4 characters, max 100 characters |

```json
{
  "email": "alice@example.com",
  "password": "securepassword"
}
```

**Responses**

<details>
<summary><code>200 OK</code> — Account created</summary>

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
<summary><code>400 Bad Request</code> — Validation failed</summary>

```json
{
  "success": false,
  "message": "Invalid input"
}
```

</details>

<details>
<summary><code>400 Bad Request</code> — Email already registered</summary>

```json
{
  "success": false,
  "message": "email already registered"
}
```

</details>

---

### `POST /api/v1/signin`

Authenticate an existing user. On success, a JWT is issued as an HTTP-only cookie.

**Request Body**

| Field | Type | Constraints |
|---|---|---|
| `email` | `string` | Valid email format, trimmed |
| `password` | `string` | Min 4 characters, max 100 characters |

```json
{
  "email": "alice@example.com",
  "password": "securepassword"
}
```

**Responses**

<details>
<summary><code>200 OK</code> — Login successful</summary>

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
<summary><code>400 Bad Request</code> — Validation failed</summary>

```json
{
  "success": false,
  "message": "Invalid input"
}
```

</details>

<details>
<summary><code>400 Bad Request</code> — User not found</summary>

```json
{
  "success": false,
  "message": "User doesn't exist"
}
```

</details>

<details>
<summary><code>400 Bad Request</code> — Wrong password</summary>

```json
{
  "success": false,
  "message": "Wrong Credentials entered"
}
```

</details>

---

### `GET /api/v1/me`

Retrieve the authenticated user's profile. Requires the `token` cookie.

**Request Body** — None.

**Responses**

<details>
<summary><code>200 OK</code> — Profile retrieved</summary>

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
<summary><code>400 Bad Request</code> — Missing or invalid token</summary>

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

</details>

---

### `POST /api/v1/logout`

Clear the authentication cookie, ending the current session.

**Request Body** — None.

**Responses**

<details>
<summary><code>200 OK</code> — Logged out</summary>

Clears cookie: `token`; `HttpOnly; SameSite=Lax; Secure=false`

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

</details>

---

### `GET /api/v1/users`

List all registered users except the authenticated caller. Requires the `token` cookie.

**Request Body** — None.

**Responses**

<details>
<summary><code>200 OK</code> — Users retrieved</summary>

```json
{
  "success": true,
  "message": "Successfully fetched the users list",
  "users": [
    {
      "id": "cm5def456ghi789",
      "email": "bob@example.com"
    },
    {
      "id": "cm5jkl012mno345",
      "email": "carol@example.com"
    }
  ]
}
```

</details>

<details>
<summary><code>400 Bad Request</code> — Missing or invalid token</summary>

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

</details>

---

### `GET /api/v1/messages/:id`

Fetch the full message history between the authenticated user and the user specified by `:id`. Messages are returned in ascending chronological order. Requires the `token` cookie.

**Path Parameters**

| Parameter | Type | Constraints |
|---|---|---|
| `id` | `string` | Must be a valid CUID (`z.string().cuid()`) |

**Responses**

<details>
<summary><code>200 OK</code> — Messages retrieved</summary>

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

The `readAt` field is `null` for unread messages and an ISO 8601 timestamp for read messages.

</details>

<details>
<summary><code>400 Bad Request</code> — Invalid user ID format</summary>

```json
{
  "success": false,
  "message": "Invalid user params"
}
```

</details>

---

### `GET /api/v1/messages/unreadCount`

Get the count of unread messages received by the authenticated user, grouped by sender. Requires the `token` cookie. Uses a database-level `GROUP BY` aggregation for efficiency.

**Request Body** — None.

**Responses**

<details>
<summary><code>200 OK</code> — Unread counts retrieved</summary>

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

The `unread` field is a map of `senderId` to the number of messages from that sender where `readAt` is `null`. If there are no unread messages, the map is empty (`{}`).

</details>

<details>
<summary><code>400 Bad Request</code> — Missing or invalid token</summary>

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

</details>

---

##  WebSocket Events

The WebSocket server runs on the same port as the HTTP server (`ws://localhost:3000`). Authentication is handled by parsing the `token` cookie from the upgrade request headers.

### Client → Server Events

| Event Type | Payload | Description |
|---|---|---|
| `send_message` | `{ to: string, content: string }` | Send a message to a user |
| `start_typing` | `{ to: string }` | Notify a user you started typing |
| `stop_typing` | `{ to: string }` | Notify a user you stopped typing |
| `send_read_receipt` | `{ to: string }` | Mark all messages from a user as read |

### Server → Client Events

| Event Type | Payload | Description |
|---|---|---|
| `recieve_message` | `{ id, content, senderId, recieverId, createdAt }` | Incoming message from another user |
| `status_indicator` | `{ from: string, content: "ONLINE" \| "OFFLINE" }` | User presence change notification |
| `online_list` | `string[]` | Full list of online user IDs (sent on connect) |
| `start_typing` | `{ from: string }` | A user started typing to you |
| `stop_typing` | `{ from: string }` | A user stopped typing to you |
| `recieve_read_receipt` | `{ from: string, readAt: Date }` | Your messages were read by a user |

### Validation

All WebSocket messages are validated using **Zod discriminated unions**:

```typescript
// Client → Server (4 event types)
const clientMessageSchema = z.discriminatedUnion("type", [
  sendMessageSchema,
  clientStartTypingSchema,
  clientStopTypingSchema,
  readMessageSchema,
]);

// Server → Client (6 event types)
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

##  Environment Variables

### Server (`server/.env`)

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:mysupersecret@localhost:5433/postgres` |
| `TOKEN_SECRET` | JWT signing secret | `your-super-secret-key-here` |
| `PORT` | Server port | `3000` |

### Client

The client uses hardcoded URLs for development. To configure for production, update:

| File | Variable | Default |
|---|---|---|
| `services/api.ts` | `baseURL` | `http://localhost:3000/api/v1` |
| `services/websocket.ts` | WebSocket URL | `ws://localhost:3000` |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 10
- **PostgreSQL** 16 (or use Docker)
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/Abhishek8841/realtime-chat-app.git
cd realtime-chat-app
```

### 2. Set Up the Database

**Option A: Docker (Recommended)**

```bash
docker run -d \
  --name sync-postgres \
  -e POSTGRES_PASSWORD=mysupersecret \
  -p 5433:5432 \
  postgres:16-alpine
```

**Option B: Local PostgreSQL**

Ensure PostgreSQL is running on port `5433` (or update `DATABASE_URL` accordingly).

### 3. Configure Environment

```bash
cp server/.env.example server/.env
# Edit server/.env with your values
```

Or create `server/.env` manually:

```env
DATABASE_URL="postgresql://postgres:mysupersecret@localhost:5433/postgres"
TOKEN_SECRET="your-super-secret-key-here"
PORT=3000
```

### 4. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 5. Run Database Migrations

```bash
cd server
npx prisma migrate dev --name init
```

### 6. Generate Prisma Client

```bash
npx prisma generate
```

### 7. Start the Application

```bash
# Terminal 1 — Start the server
cd server
npx tsx src/index.ts

# Terminal 2 — Start the client
cd client
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000/api/v1
- **WebSocket:** ws://localhost:3000

---


##  Future Improvements

| Feature | Description | Complexity |
|---|---|---|
|  **Group Chats** | Multi-user chat rooms with member management and admin roles |  Medium |
|  **File Sharing** | Image, document, and media uploads with preview support (S3/Cloudinary) |  Medium |
|  **Video/Audio Calls** | WebRTC-based peer-to-peer calling with signaling server |  High |
|  **End-to-End Encryption** | Signal Protocol implementation for client-side message encryption |  High |
|  **Redis Pub/Sub** | Horizontal scaling with Redis as a message broker between server instances |  Medium |
|  **Kubernetes Deployment** | Container orchestration with Helm charts, HPA, and ingress configuration |  High |
|  **CI/CD Pipelines** | GitHub Actions for automated testing, linting, building, and deployment |  Low |
| **Prometheus/Grafana** | Metrics collection, dashboards for WebSocket connections, message throughput, and latency | Medium |
| **Message Search** | Full-text search across conversation history using PostgreSQL `tsvector` | Medium |
| **Push Notifications** | Service Worker + Web Push API for offline message notifications | Medium |

---

<div align="center">

**Built by [Abhishek](https://github.com/Abhishek8841)**

Star this repo if you found it helpful!

</div>