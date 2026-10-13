# SpendWise — Student Expense Management System

SpendWise is a full-stack expense management web application built using the MERN stack. It helps users record, organize, and track their daily expenses through a simple, user-friendly dashboard.

## Features

- **Login Interface:** A simple login screen to access the application.
- **Expense Dashboard:** Displays expense summaries and transaction information.
- **Add Expenses:** Record expenses with a description, amount, category, and date.
- **View Expenses:** Display saved expense records.
- **Edit Expenses:** Update existing expense details.
- **Delete Expenses:** Remove expense records.
- **Search and Filter:** Find expenses using search and category filters.
- **Persistent Storage:** Store expense records in MongoDB Atlas so they remain available after refreshing the page.

## Technologies Used

| Technology | Purpose |
|---|---|
| React.js | Builds the frontend user interface |
| JavaScript | Handles application logic and interactions |
| HTML and CSS | Structures and styles the interface |
| Node.js | Runs the backend JavaScript environment |
| Express.js | Creates backend API endpoints |
| MongoDB Atlas | Stores expense data in the cloud |
| Mongoose | Defines the data model and communicates with MongoDB |
| Vite | Runs the frontend development server |
| Git and GitHub | Version control and project hosting |

## Project Structure

```text
BWT-Hackathon/
├── frontend/
│   ├── src/
│   └── package.json
├── backend/
│   ├── models/
│   │   └── Expense.js
│   ├── server.js
│   └── package.json
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Install the following:

- Node.js and npm
- Git
- A MongoDB Atlas account

### 1. Clone the Repository

```bash
git clone https://github.com/hamsithasri/BWT---Hackathon.git
cd BWT---Hackathon
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Replace the placeholder with your own MongoDB Atlas connection string. Never commit your actual database credentials to GitHub.

Start the backend:

```bash
node server.js
```

The backend runs on `http://localhost:5000`, provided the database connection succeeds.

### 3. Set Up the Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed in the terminal, usually `http://localhost:5173` or another available port.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/expenses` | Retrieve expenses |
| POST | `/api/expenses` | Create an expense |
| PUT | `/api/expenses/:id` | Update an expense |
| DELETE | `/api/expenses/:id` | Delete an expense |

## Database

Expense records include the title, amount, category, date, and optional notes. MongoDB Atlas stores the records, while Mongoose defines and validates the expense schema.

## Future Improvements

- Real user authentication and secure password handling
- Role-based access control where required
- User-specific expense records
- Expense charts and spending analytics
- Monthly budgets and budget alerts
- Improved validation and error handling

## Project Status

The current version supports basic expense management, including creating, viewing, editing, and deleting records, with MongoDB persistence.

**Note:** The current login screen is a demonstration interface and does not implement real authentication or role-based access control.

## Author

Developed as a Backend Web Technology hackathon project.