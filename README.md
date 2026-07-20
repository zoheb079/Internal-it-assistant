# AI-Powered Internal IT Assistant

An intelligent serverless Internal IT Assistant built using **Cloudflare Workers**, **Cloudflare KV**, and **Cloudflare Workers AI**.

The application enables employees to ask IT-related questions in natural language while retrieving answers from an organization's internal knowledge base using a Retrieval-Augmented Generation (RAG) approach.

---

# Project Overview

Organizations typically maintain hundreds of IT support documents covering topics such as:

- Password Reset
- VPN Access
- Software Installation
- ServiceNow Requests
- Multi-Factor Authentication
- Help Desk Information
- Employee Onboarding

Employees often spend unnecessary time searching through documentation or creating support tickets for information that already exists.

This project demonstrates how Large Language Models (LLMs) can be combined with an internal knowledge base to provide fast, accurate, and context-aware responses while minimizing AI hallucinations.

---

# Solution Architecture

```
                           Employee

                               │
                               │
                               ▼

                  Web Chat Interface
                    (HTML / CSS / JS)

                               │
                               │ HTTPS
                               ▼

                  Cloudflare Worker
                 (Serverless Backend)

        ┌──────────────────────────────────┐
        │                                  │
        │                                  │
        ▼                                  ▼

 Cloudflare KV                    Cloudflare Workers AI
Knowledge Base                      (Llama 3.2)

        │                                  │
        └──────────────┬───────────────────┘
                       │

                       ▼

            Context-Aware AI Response

                       │

                       ▼

                  Employee
```

---

# Current Features

## Employee Portal

The Employee Portal provides a simple conversational interface for interacting with the IT Assistant.

Current capabilities include:

- Natural language question answering
- AI-generated responses
- Internal knowledge retrieval
- Source attribution
- Multi-turn conversation interface
- Responsive UI

Example questions:

- How do I reset my password?
- How can I request VPN access?
- How do I create a ServiceNow ticket?
- What are the IT Help Desk hours?

---

## Admin Portal

The Admin Portal allows administrators to inspect the current knowledge repository.

Current capabilities:

- View all knowledge articles
- Display article category
- Display keywords
- Display article content
- View total number of articles

Current implementation is read-only.

Future versions will include:

- Add Articles
- Edit Articles
- Delete Articles
- Authentication
- Role Based Access Control

---

# Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Cloudflare Workers |
| AI | Cloudflare Workers AI (Llama 3.2) |
| Knowledge Base | Cloudflare KV |
| Runtime | JavaScript (Serverless) |
| Deployment | Cloudflare Global Edge Network |

---

# Project Structure

```
internal-it-assistant/

│
├── data/
│     knowledge.json
│
├── scripts/
│     seed-kv.js
│
├── src/
│     index.js
│
├── package.json
│
├── wrangler.jsonc
│
└── README.md
```

---

# How the Application Works

The application follows a Retrieval-Augmented Generation (RAG) workflow.

Instead of allowing the LLM to answer from its general knowledge, the application first retrieves relevant information from the organization's knowledge base.

Workflow:

```
User asks a question

        │

        ▼

Cloudflare Worker receives request

        │

        ▼

Search Cloudflare KV

        │

        ▼

Find the most relevant article

        │

        ▼

Pass article as context to Workers AI

        │

        ▼

Generate grounded response

        │

        ▼

Return response to user
```

This significantly reduces hallucinations because the model answers only using retrieved internal documentation.

---

# Knowledge Base Design

Knowledge articles are stored as JSON documents.

Example:

```json
{
  "key": "vpn-access",
  "title": "VPN Access Request",
  "category": "Access",
  "keywords": [
    "vpn",
    "remote access",
    "manager approval"
  ],
  "content": "Employees can request VPN access through the IT Service Portal...",
  "updatedAt": "2026-07-20"
}
```

Each article contains:

- Unique Key
- Title
- Category
- Keywords
- Content
- Timestamp

---

# REST APIs

## Health Check

```
GET /health
```

Returns service status.

---

## Retrieve Knowledge Article

```
GET /api/knowledge/{key}
```

Example:

```
/api/knowledge/vpn-access
```

---

## Search Knowledge Base

```
GET /api/search?q=vpn
```

Returns matching articles.

---

## AI Question Answering

```
GET /api/ask?question=How can I request VPN access
```

Returns an AI-generated answer using the retrieved article as context.

---

## List Knowledge Articles

```
GET /api/articles
```

Returns all articles stored in Cloudflare KV.

---

# Current Knowledge Base

The project currently contains sample documentation for:

- Password Reset
- VPN Access
- ServiceNow Ticket Creation
- Help Desk Hours
- Multi-Factor Authentication
- New Employee Access

Additional enterprise knowledge articles can be added without changing application code.

---

# Current User Interface

## Employee Portal

Functions:

- Ask IT questions
- View AI-generated responses
- Source attribution
- Conversation history

---

## Admin Portal

Functions:

- View knowledge articles
- Browse categories
- Browse keywords

---

# Why Retrieval-Augmented Generation?

Traditional AI Chatbots answer from their training data.

This solution first retrieves internal documentation before generating a response.

Benefits include:

- Improved accuracy
- Reduced hallucinations
- Responses based on company documentation
- Easier knowledge updates
- No model retraining required

---

# Deployment

The application is deployed on Cloudflare Workers.

Deployment process:

```
Developer

     │

     ▼

Cloudflare Worker

     │

     ▼

Global Edge Network

     │

     ▼

Employees
```

Advantages:

- Serverless
- Auto Scaling
- Low Latency
- Minimal Infrastructure Management

---

# Future Enhancements

The following capabilities are planned:

- Authentication
- Role-Based Access Control
- CRUD Operations for Knowledge Articles
- Conversation Memory
- Analytics Dashboard
- Feedback System
- Audit Logging
- Multi-document Retrieval
- Improved RAG Ranking
- Semantic Search
- Enterprise Search Integration

---

# Learning Outcomes

This project demonstrates practical implementation of:

- Serverless Computing
- Retrieval-Augmented Generation (RAG)
- Cloudflare Workers
- Cloudflare KV
- Cloudflare Workers AI
- REST API Design
- Knowledge Base Management
- AI-powered Internal Support Systems

---

# Author

Zoheb

Senior Cloud Engineer | DevOps | AI | Cloud | Automation
