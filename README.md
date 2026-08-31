# Kanban Board Application

A full-stack Kanban board application that allows users to create and manage boards anonymously.
Users can create boards, manage tasks, and organize cards using drag-and-drop functionality.

## Live Demo

- Frontend / Application URL: https://kanban-board-rouge-tau.vercel.app
- Backend API URL: https://kanban-board-n4ad.onrender.com

---

## Tech Stack

### Frontend

- React
- TypeScript
- CSS Modules
- @hello-pangea/dnd (Drag & Drop)

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB (Mongoose)

## API Endpoints

### Boards

| Method | Endpoint | Description |
-----------
- POST - `/boards` - Create a new board 
- GET - `/boards/:boardId` - Get a board by ID
- PATCH - `/boards/:boardId` - Update board information
- DELETE - `/boards/:boardId` - Delete a board

### Cards

| Method | Endpoint | Description |
-----------
- POST - `/boards/:boardId/cards` - Create a new card in a board 
- GET - `/boards/:boardId/cards` - Get all cards from a board 
- PATCH - `/boards/:boardId/cards/:cardId` - Update a card 
- DELETE - `/boards/:boardId/cards/:cardId` - Delete a card 


## Features

- Anonymous Board Management: Visitors can create, update, and delete boards without requiring user authentication.
- Unique Board Identification: - Each board receives a unique hashed ID and contains three default columns: ToDo, In Progress, and Done.
- Board Loading: Users can enter an existing board ID to load and view all associated columns and cards.
- Card Operations: Create, edit, delete, and move cards between columns.
- Drag & Drop Functionality: Drag and drop cards between columns or reorder them within the same column using \`@hello-pangea/dnd.

---

## Getting Started

To run this project locally, follow these steps:

### 1. Clone the repository

```bash
git clone \<repository-url>
```

### 2. Set up the Backend

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a .env file in the backend root and add your configuration (e.g., PORT, MONGO_URI).

### 3. Start the backend development server:

```bash
npm run dev
```

**### 4. Set up the Frontend**

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

Create a .env file if needed (e.g., to configure your API base URL).

**### 5. Start the frontend development server:**

```bash
npm run dev
```

**## Preview**
<img width="1449" height="816" alt="preview" src="https://github.com/user-attachments/assets/ddaa9593-c188-44bf-9fbd-4283a5b609d2" />

