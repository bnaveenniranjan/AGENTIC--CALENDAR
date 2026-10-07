Agentic AI Full-Stack Application
A production-ready full-stack agentic AI application built with Next.js, Node.js, Mastra, Descope, and PostgreSQL.

This project demonstrates how to build an AI-powered application with secure authentication, persistent conversations, tool-using agents, and a modern web interface—making it suitable for a professional portfolio or resume.

Features
Full-stack application using Next.js and Node.js
Agentic AI workflows powered by Mastra
Secure authentication and user management with Descope
PostgreSQL database for persistent application data
AI chat interface with streaming responses
Conversation history
User-specific data isolation
Extensible agent tools and workflows
API-based backend architecture
Environment-based configuration
Responsive UI for desktop and mobile devices
Technology Stack
Layer	
Technology

Frontend	Next.js, React, TypeScript
Backend	Node.js
AI framework	Mastra
Authentication	Descope
Database	PostgreSQL
Styling	Tailwind CSS
API communication	REST API or server actions
Package manager	npm, pnpm, or yarn

Application Architecture
┌───────────────────────────────┐
│          Next.js Client        │
│   Chat UI, Dashboard, Auth UI  │
└───────────────┬───────────────┘
                │
                │ HTTP/API Requests.
                ▼
┌───────────────────────────────┐
│        Node.js Backend         │
│ Routes, Services, Validation   │
└───────────────┬───────────────┘
                │
       ┌────────┴────────┐
       ▼                 ▼
┌───────────────┐ ┌───────────────┐
│ Mastra Agents │ │ PostgreSQL    │
│ Tools/Workflows│ │ User Data     │
└───────────────┘ └───────────────┘
                │
                ▼
┌───────────────────────────────┐
│           Descope             │
│ Authentication and Sessions   │
└───────────────────────────────┘

Project Structure

project-root/
├── apps/
│   ├── web/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   ├── dashboard/
│   │   │   ├── login/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   ├── lib/
│   │   ├── public/
│   │   └── package.json
│   │
│   └── server/
│       ├── src/
│       │   ├── agents/
│       │   ├── routes/
│       │   ├── services/
│       │   ├── middleware/
│       │   ├── db/
│       │   └── index.ts
│       └── package.json
│
├── packages/
│   ├── database/
│   ├── shared/
│   └── config/
│
├── .env.example
├── package.json
├── README.md
└── tsconfig.json

Chat Request Flow

1. The user enters a message in the chat interface.
2. The frontend sends the message to the backend.
3. The backend validates the user's session.
4. The message is saved to PostgreSQL.
5. The agent receives the message and conversation context.
6. The agent decides whether tools are required.
7. Tools are executed when necessary.
8. The agent generates a response.
9. The assistant response is saved to PostgreSQL.
10. The response is returned or streamed to the frontend.

Before deployment:

Configure production environment variables.
Update authentication callback URLs.
Run database migrations.
Restrict CORS to trusted domains.
Configure logging and monitoring.
Build the application.
Test authentication and agent execution in production.
