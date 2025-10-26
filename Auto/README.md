# Task Management

Task management system that enables users to create, organize, and track tasks efficiently. The platform supports user authentication, file attachments, collaboration features, and analytics for task completion tracking.

---

# Features 
## User Routes
### User Registration
 - Allows new users to create accounts
- Validates required fields such as name, email, and password
- Hashes passwords using bcrypt before persistence
- Ensures unique email constraint 

 ### User Login
- Authenticates users based on valid credentials
- Generates a signed JWT access token
- Stores token in HTTP-only cookie to prevent XSS attacks
- Invalid login attempts result in generic error responses to avoid enumeration

### User Profile Retrieval
- Provides authenticated users access to their own profile data
- Authorization middleware validates JWT and fetches user based on token payload
- Sensitive information such as password never included in response

## Task Route

 ### Create Task
- Validates required fields such as title and assigned user email.
- Validates due date.
- Finds assigned user using email.
- Links assigned user and creator to the task using ObjectId.

 ### Fetch All Tasks with Filtering and Pagination
- Pagination
- Filtering by status, priority
- Searching by text
- Sorting by fields like due_date
- Populate assigned and creator info

### Fetch Single Task Assigned to Logged-In User
- Only returns tasks with status: todo or in-progress
- Excludes soft-deleted tasks

### Update Task
- Fields allowed for update:
   Title
   Description
   Status (validated: todo, in-progress, completed, archived)

 ### Soft Delete Task
- Marks a task as isDeleted: true and changes status to archived.
- The logged-in (assigned) user can only delete their own task
- Does not permanently remove task record

## Task File Routes

### Upload Files to Task
- Uses Multer for file handling
- Stores file metadata in MongoDB
- File saved in local storage under uploads/
- Links file to user and task using ObjectId

### Get All Files for a Specific Task
- Uploaded user info populated
- Security: Only authenticated users can access

### Download a File
- Allows authenticated users to download a stored file.

### Soft Delete a File
- Marks file as deleted without removing from disk.

## Comment Routes

### Add Comment to a Task
- Adds a new comment to a specific task using task title.

### Get All Comments for a Task
- Fetches comments related to a specific task ordered by newest first.

### Update Comment
- Allows a user to update only their own comments.

### Soft Delete Comment
- Soft deletes a comment only if it belongs to the logged-in user.

## Analytics Routes

### Task Overview Statistics
- Returns counts of tasks based on their status for the authenticated user.

### User Performance Metrics
#### Metrics Returned:
- Total tasks
- Completed tasks
- Overdue tasks
- Completion percentage
- Average completion time

### Task Trend Insights Over Time
- Daily trend line graphs for productivity monitoring.

### Export Tasks in CSV Format
- Downloads the complete task dataset in CSV format for reporting or migration.
---

## Tech Stack

- *Runtime*: Node.js  
- *Framework*: Express.js  
- *Database*: mongodb 
- *Validation*: Custom middleware, node.js validitior function  



---

## Setup Instructions

### Option 1: Using Docker (Recommended)

Run complete project in single command. No manual npm install required.
```bash
git clone https://github.com/codervega/Task_Management_Platform
cd auto

# create .env folder in Backend
DATABASE_URL="mongodb://localhost:27017/"
PORT = 5000;
JWT_SECRET=Abhi@8970;

# Build and start containers
docker-compose up --build
```

- The backend server installs all npm dependencies automatically.

- monogodb database starts.

- The API will be available at: http://localhost:5000/api
- Press Ctrl+C to stop the containers.
- To run in detached mode: docker-compose up -d
-To stop and remove containers: docker-compose down
---


## Option 2: Manual Setup (Without Docker)
```bash
git clone https://github.com/Ashutosh-Shukla-036/Event_Management.git
cd Event_Management/backend

# Install dependencies
npm install 
bcrypt 
cookie-parser
cors express  
json2csv 
jsonwebtoken 
jsonwebtoken 
mongoose 
multer 
validator

# Ensure monogo is running locally in .env
DATABASE_URL="mongodb://localhost:27017/"
PORT = 5000;
JWT_SECRET=Abhi@8970;

# Then start the server
npm start
```                               

#The API will be available at:

http://localhost:5000/api


---

### API Endpoints
```bash
# Create user
POST http://localhost:5000/api/users 
  {
  "username": "JohnDoe",
  "email": "varun@gmail.com",
  "password": "123456",
  "role": "user"
}



# Success: 201 Created
{
    "message": "User registered successfully",
    "user": {
        "username": "JohnDoe",
        "email": "varun@gmail.com",
        "password": "$2b$10$oC5YbzSqxQY.IlnKWU86DedXO.CL0h7UM7hQGnMO7C2jFG6xr6N3q",
        "role": "user",
        "isDeleted": false,
        "_id": "68fe46e348f25aba67a40118",
        "createdAt": "2025-10-26T16:05:55.290Z",
        "updatedAt": "2025-10-26T16:05:55.290Z",
        "__v": 0
    }
}


#SIGNIN  All Users
POST http://localhost:5000/api/signin
  {
  "email": "varun@gmail.com",
  "password": "123456"
}


# Success Response: 200 ok
{
"email": "varun@gmail.com",
 "token": "xbvgvv................."
}



# Get User by email 
GET http://localhost:5000/api/profile?email=varun@gmail.com
#Success: 200 OK
{
    "_id": "68fe46e348f25aba67a40118",
    "username": "JohnDoe",
    "email": "varun@gmail.com",
    "role": "user",
    "isDeleted": false,
    "createdAt": "2025-10-26T16:05:55.290Z",
    "updatedAt": "2025-10-26T16:05:55.290Z",
    "__v": 0
}

# Create Task

POST http://localhost:3000/api/newtask 
{
  "title": "Finish Dashboard UI",
  "description": "Complete the frontend for the analytics dashboard",
  "status": "todo",
  "priority": "high",
  "tags": ["frontend", "urgent"],
  "due_date": "2025-11-05",
  "email": "raju@gmail.com"
}

#Success: 201 Created
{
    "message": "Task created",
    "task": {
        "title": "Finish Dashboard UI",
        "description": "Complete the frontend for the analytics dashboard",
        "status": "todo",
        "priority": "high",
        "due_date": "2025-11-05T00:00:00.000Z",
        "tags": [
            "frontend",
            "urgent"
        ],
        "assigned_to": "68fddcd9a83ff671a97b2e2b",
        "created_by": "68fe46e348f25aba67a40118",
        "isDeleted": false,
        "_id": "68fe49df48f25aba67a40124",
        "createdAt": "2025-10-26T16:18:39.701Z",
        "updatedAt": "2025-10-26T16:18:39.701Z",
        "__v": 0
    }
}

# Get pagination filer sortinf searching Details
GET GET http://localhost:5000
/api/task/getalltask?page=1&limit=5&
status=Pending&priority=High&search=UI&sortBy
=createdAt&order=
desc


# Success: 200 OK

{
  "total": 25,
  "page": 1,
  "limit": 5,
  "tasks": [
    {
      "_id": "671cd8f87a6735c8f9e718bc",
      "title": "Finish Dashboard UI",
      "description": "Complete the analytics screen",
      "status": "Pending",
      "priority": "High",
      "due_date": "2025-11-05",
      "assigned_to": {
        "_id": "671ccfd12d88e2b6c3c4ab99",
        "username": "John Doe",
        "email": "john@example.com"
      },
      "created_by": {
        "_id": "671ccfd12d88e2b6c3c4ab11",
        "username": "Admin User",
        "email": "admin@example.com"
      }
    }
  ]
}

# GET most recent task assigned 
GET http://localhost:5000/api/singletask

# SUCCESS OK
{
    "_id": "68fe2595aa67f4260537e22d",
    "title": "submit a video",
    "description": "work on it yr",
    "status": "in-progress",
    "priority": "low",
    "due_date": "2025-11-08T00:00:00.000Z",
    "tags": [
        "work"
    ],
    "assigned_to": {
        "_id": "68fddcd9a83ff671a97b2e2b",
        "username": "raju",
        "email": "raju@gmail.com"
    },
    "created_by": {
        "_id": "68fddcd9a83ff671a97b2e2b",
        "username": "raju",
        "email": "raju@gmail.com"
    },
    "isDeleted": false,
    "createdAt": "2025-10-26T13:43:49.392Z",
    "updatedAt": "2025-10-26T13:43:49.392Z",
    "__v": 0
}

#UPDATE THE TASK
PUT http://localhost:5000/api/update-task
{
     "title": "submit a video",
    "status": "todo"
}

# SUCCESS OK 200
{
    "message": "Task updated successfully",
    "updatedTask": {
        "_id": "68fe2595aa67f4260537e22d",
        "title": "submit a video",
        "description": "work on it yr",
        "status": "todo",
        "priority": "low",
        "due_date": "2025-11-08T00:00:00.000Z",
        "tags": [
            "work"
        ],
        "assigned_to": "68fddcd9a83ff671a97b2e2b",
        "created_by": "68fddcd9a83ff671a97b2e2b",
        "isDeleted": false,
        "createdAt": "2025-10-26T13:43:49.392Z",
        "updatedAt": "2025-10-26T16:29:43.887Z",
        "__v": 0
    }
}

# SOFT DELETE
DELETE http://localhost:5000/api/delete-task

# SUCCESS 200 ok
{
    "message": "Task deleted",
    "deletedTask": {
        "_id": "68fe2595aa67f4260537e22d",
        "title": "submit a video",
        "description": "work on it yr",
        "status": "archived",
        "priority": "low",
        "due_date": "2025-11-08T00:00:00.000Z",
        "tags": [
            "work"
        ],
        "assigned_to": "68fddcd9a83ff671a97b2e2b",
        "created_by": "68fddcd9a83ff671a97b2e2b",
        "isDeleted": true,
        "createdAt": "2025-10-26T13:43:49.392Z",
        "updatedAt": "2025-10-26T16:33:36.041Z",
        "__v": 0
    }
}

# view all the comment on task
GET http://localhost:5000/api/get-all-comments?taskTitle=Fix Production Bug

SUCCESS 200 OK
{
    "comments": [
        {
            "_id": "68fe4e1e48f25aba67a40162",
            "task": "68fd0cb0a69823dfefff3855",
            "user": {
                "_id": "68fddcd9a83ff671a97b2e2b",
                "username": "raju",
                "email": "raju@gmail.com"
            },
            "content": "we are currently working on it",
            "isDeleted": false,
            "createdAt": "2025-10-26T16:36:46.632Z",
            "updatedAt": "2025-10-26T16:36:46.632Z",
            "__v": 0
        }
    ]
}

# UPDATE THE COMMENT
PUT http://localhost:5000/api/update-comment
{
     "commentId": "68fe4e1e48f25aba67a40162",
     "content":"IT BE DONE BY ME"
}
SUCCESS OK 200
{
    "message": "Comment updated",
    "comment": {
        "_id": "68fe4e1e48f25aba67a40162",
        "task": "68fd0cb0a69823dfefff3855",
        "user": "68fddcd9a83ff671a97b2e2b",
        "content": "IT BE DONE BY ME",
        "isDeleted": false,
        "createdAt": "2025-10-26T16:36:46.632Z",
        "updatedAt": "2025-10-26T16:42:07.051Z",
        "__v": 0
    }
}

# DELETE THE COMMENT
DELETE http://localhost:5000/api/delete-comment
{
     "commentId": "68fe4e1e48f25aba67a40162"     
}
# SUCEESS OK 200
{
    "message": "Comment deleted successfully",
    "deletedComment": {
        "_id": "68fe4e1e48f25aba67a40162",
        "task": "68fd0cb0a69823dfefff3855",
        "user": "68fddcd9a83ff671a97b2e2b",
        "content": "IT BE DONE BY ME",
        "isDeleted": true,
        "createdAt": "2025-10-26T16:36:46.632Z",
        "updatedAt": "2025-10-26T16:44:47.547Z",
        "__v": 0
    }
}

# UPDATING THE FILE
POST http://localhost:5000/api/upload
# WE HAVE TO UPLAOD THE FILE IN THE POSTMAN AND THEN BASICALLY GIVE TITLE 
# SUCCESS CREATED 201
{
    "message": "Files uploaded successfully",
    "savedFiles": [
        {
            "task": "68fd0cb0a69823dfefff3855",
            "user": "68fddcd9a83ff671a97b2e2b",
            "filename": "Screenshot 2025-10-18 123202.png",
            "filePath": "uploads\\1761497369970-Screenshot 2025-10-18 123202.png",
            "fileType": "image/png",
            "fileSize": 32201,
            "isDeleted": false,
            "_id": "68fe511a48f25aba67a40171",
            "__v": 0,
            "createdAt": "2025-10-26T16:49:30.015Z",
            "updatedAt": "2025-10-26T16:49:30.015Z"
        }
    ]
}

# GETS ALL THE FILES TO SPECIFIC TASK
GET http://localhost:5000/api/task-files/68fd0cb0a69823dfefff3855
# SUCCESS 200 OK
[
    {
        "_id": "68fd0daca69823dfefff385e",
        "task": "68fd0cb0a69823dfefff3855",
        "user": {
            "_id": "68fd0baea69823dfefff384e",
            "username": "AdminUser",
            "email": "admin123@example.com"
        },
        "filename": "Screenshot 2025-10-25 184417.png",
        "filePath": "uploads\\1761414572818-Screenshot 2025-10-25 184417.png",
        "fileType": "image/png",
        "fileSize": 26375,
        "isDeleted": false,
        "__v": 0,
        "createdAt": "2025-10-25T17:49:32.834Z",
        "updatedAt": "2025-10-25T17:49:32.834Z"
    },
    {
        "_id": "68fe511a48f25aba67a40171",
        "task": "68fd0cb0a69823dfefff3855",
        "user": {
            "_id": "68fddcd9a83ff671a97b2e2b",
            "username": "raju",
            "email": "raju@gmail.com"
        },
        "filename": "Screenshot 2025-10-18 123202.png",
        "filePath": "uploads\\1761497369970-Screenshot 2025-10-18 123202.png",
        "fileType": "image/png",
        "fileSize": 32201,
        "isDeleted": false,
        "__v": 0,
        "createdAt": "2025-10-26T16:49:30.015Z",
        "updatedAt": "2025-10-26T16:49:30.015Z"
    }
]

# DOWNLOAD SPECIFIC TASK
GET http://localhost:5000/api/download/68fd0daca69823dfefff385e

# SUCCESS 200 OK 
HERE WILL DOWNLOAD THE FILE

# DELETE THE FILE
GET http://localhost:5000/api/delete/68fd0daca69823dfefff385e
# SUCCESS 200 OK

# GET OVERVIEW 
GET http://localhost:5000/api/analytics/overview
# SUCCESS 200 OK
{
    "statusCounts": [
        {
            "_id": "todo",
            "count": 1
        },
        {
            "_id": "completed",
            "count": 2
        }
    ]
}

# Get user performance metrics
GET http://localhost:5000/api/analytics/user-performance
# SUCCESS 200 OK
{
    "userId": "68fddcd9a83ff671a97b2e2b",
    "totalTasks": 3,
    "completedTasks": 2,
    "overdueTasks": 0,
    "completionRate": "66.67%",
    "avgCompletionTime": "0.09 days"
}

# Get task trends over time
GET http://localhost:5000/api/analytics/task-trends
# SUCCESS 200 OK
{
    "trends": [
        {
            "totalTasks": 3,
            "completedTasks": 2,
            "date": "2025-10-26"
        }
    ]
}

# Export tasks data
GET http://localhost:5000/api/export-tasks
# SUCCESS 200 OK
WILL GET THE DATA IN THE CSV FORM
```



---

# Error Handling
bash
200 → Success (GET, DELETE)

201 → Created (POST)

400 → Bad Request (validation errors)

404 → Not Found

409 → Conflict (duplicate entries)

500 → Internal Server Error

---
# Database Schema

userSchema :  username, email, password, role , isDeleted 

taskSchema: title, DESCRIPTION, status , priority , due_date,tags, assigned_to ,created_by,isDeleted

fileSchema :  task , user ,  filename,  filePath,  filetype,   fileSize,isDeleted

commentSchema: task, user , content, isDeleted

# Project Structure

backend/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── UserController.js
│   │   ├── TaskController.js
│   │   ├── CommentController.js
│   │   └── FileController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Task.js
│   │   ├── Comment.js
│   │   └── File.js
│   ├── routes/
│   │   ├── UserRoutes.js
│   │   ├── TaskRoutes.js
│   │   ├── CommentRoutes.js
│   │   └── FileRoutes.js
│   ├── middleware/
│   │   ├── Authentication.js
│   │   └── validate.js
│   ├── utils/
│   │   ├── response.js
│   │   └── helper.js
│   ├── uploads/     # Uploaded files stored here
│   └── server.js    # Main entry point
│
├── .env
├── .gitignore
├── Dockerfile
├── package.json
└── README.md

frontend/
├── public/
│   └── favicon.ico
│
├── src/
│   ├── assets/               # Images, icons, fonts, etc.
│   ├── components/           # Reusable UI components (e.g. Navbar, Button, etc.)
│   ├── context/              # Context API (e.g. AuthContext, ThemeContext)
│   ├── pages/                # Page components (e.g. Login.jsx, Dashboard.jsx)
│   ├── style/                # CSS / SCSS files (global or modular styles)
│   ├── utils/                # Helper functions (e.g. fetchWrapper.js, formatDate.js)
│   ├── App.jsx               # Root component
│   ├── App.css               # Global app-level styles
│   ├── index.css             # Entry point styles
│   ├── main.jsx              # React entry file (renders App)
│
├── .gitignore
├── Dockerfile
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.js
├── docker-compose.yml
└── README.md




---

