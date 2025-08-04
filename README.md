# Collab Board

**Collab Board** is a Trello-like collaborative task management application with real-time syncing, user authentication, and AI-assisted board generation.

Users can log in, view all boards they are a member of from the **dashboard** (`/dashboard`), and navigate into individual **boards** (`/boards/[id]`).
A board consists of **categories** (columns), which in turn contain **tasks**. Both categories and tasks support drag-and-drop reordering via **dnd-kit**.

Board creation supports two flows:

* **Blank board** — manually create a board with a title.
* **AI-generated board** — generate a board structure from a natural language prompt using **OpenRouter Mistral LLM**.

Real-time updates and presence are powered by a dedicated [WebSocket server](LINK_TO_WEBSOCKET_REPO), which syncs changes between clients via Redis pub/sub.

---

## Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Folder Structure](#folder-structure)
* [Challenges Faced](#challenges-faced)
* [Future Improvements](#future-improvements)

---

## Features

* **User Authentication**

  * Email/password login with email verification
  * OAuth via Google & GitHub
  * Session storage in Redis cache
  * Password reset via Nodemailer
* **Dashboard**

  * Displays all boards the user is a member of
  * Create boards via blank form or AI prompt
* **Board Page**

  * Drag-and-drop categories & tasks (via dnd-kit)
  * Real-time updates for all connected users
  * User presence indicators per board
* **AI-Assisted Board Creation**

  * Board templates generated using OpenRouter Mistral LLM
* **Real-Time Sync**

  * Changes are broadcast via Socket.IO
  * Backed by Redis pub/sub for scalability
* **Responsive UI**

  * Built with TailwindCSS and shadcn/ui

---

## Tech Stack

| Area             | Tech                                                                                      |
| ---------------- | ----------------------------------------------------------------------------------------- |
| **Frontend**     | Next.js, React, TypeScript, TailwindCSS, shadcn/ui                                        |
| **State & Data** | React Query, Zod, React Hook Form                                                         |
| **Backend**      | API Routes (Next.js), OpenRouter (Mistral), Prisma ORM                                    |
| **Database**     | PostgreSQL                                                                                |
| **Auth**         | better-auth (Email + OAuth), Nodemailer                                                   |
| **Real-Time**    | Socket.IO client, Redis pub/sub (via separate [WebSocket server](https://github.com/milljo3/collab-board-websocket-server)) |
| **Deployment**   | Vercel (frontend), Render (WebSocket server)                                              |

---

## Folder Structure

```
/app                # Next.js app directory
/app/dashboard      # Dashboard page and board creation
/app/boards         # Board page with drag-and-drop UI
/app/api            # API routes (auth, boards, AI generation)
/components         # Shared UI components
/hooks              # Custom React hooks (queries, sockets)
/lib                # Utilities (auth, prisma, redis, socket setup)
/prisma             # Prisma schema
/types              # Shared TypeScript types
```

---

## Challenges Faced

* **Redis Integration** — first time using Redis for caching and pub/sub.
* **dnd-kit Implementation** — ensuring smooth drag-and-drop for nested structures (categories and tasks) without breaking state.
* **Real-Time Presence** — designing WebSocket events to sync both board changes and user presence.
* **Multiple Deployments** — separating and connecting a Vercel-deployed frontend with a Render-deployed WebSocket server.

---

## Future Improvements

* Task modal w/ more content such as comments and attachments
* Offline support with optimistic updates
* Board log / history
* Weekly / daily AI summary of a board the summzarizes what a user did that week / day w/ Redis to cache LLM response
* Test coverage (unit + integration)

---

## Related Repository

This project relies on a separate [WebSocket server](https://github.com/milljo3/collab-board-websocket-server) for real-time syncing and presence, built with Express, Socket.IO, and Redis.

---

## Conclusion

Collab Board was a fullstack exploration into **real-time collaboration**, **Redis caching**, and **scalable WebSocket infrastructure**.
It combines a modern, responsive UI with AI-assisted workflows, making it a strong foundation for future collaborative productivity tools.
