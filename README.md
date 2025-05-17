# Real-Time Code Editor
The Real-Time Code Editor is a dynamic, full-stack collaborative code editing platform crafted to empower developers with live, interactive coding sessions.
Built with modern technologies like React, Socket.IO, Redis, and Docker, the application enables multiple users to connect to a shared workspace, write code together in real time, and experience instant collaboration just like they would in a physical coding environment.

## Features
- **Real-time Editing**
Real-time editing ensures that any changes made by a user on a file are immediately propagated and visible to all other connected users. This is achieved using WebSocket technology (such as Socket.io) to establish a persistent connection between the clients and the server. As a result, all participants can see live updates as they happen, enabling seamless collaboration and quick feedback.

- **Syntax Highlighting**
Syntax highlighting enhances code readability by applying different colors and styles to different components of the code based on their syntax and semantics. This feature supports multiple programming languages, ensuring that developers can easily distinguish between keywords, variables, comments, etc. This improves code comprehension and reduces errors caused by syntax mistakes.

- **Collaborative Editing**
Collaborative editing allows multiple users to work on the same file simultaneously without conflicts. The application manages changes in real time by merging edits intelligently and resolving conflicts automatically or through user interaction. This feature is crucial for teams working together on projects, enabling them to see each other's changes instantly and work together efficiently.

- **Code Formatting**
Code formatting automatically adjusts the indentation, spacing, and overall structure of code to conform to predefined style guidelines or user preferences. This helps maintain consistency across the codebase, improves readability, and reduces time spent on manual formatting. Users can customize formatting rules or choose from preset configurations to suit their coding standards.

- **Redis Caching**
When a user requests their saved code snippets, the system first checks Redis for the data.
If the data exists in the cache (a cache hit), it is returned immediately — significantly faster than querying MongoDB.
If not (a cache miss), the server queries MongoDB, returns the result, and stores it in Redis for future requests.
On code fetch, Redis is checked.
On save/update/delete, the cache is cleared to maintain accuracy.

- **Backend Integration (MongoDB + Firebase Auth)**
  	All saved code snippets are stored persistently in MongoDB.
  	Users can save, update, and delete code using secure API endpoints.
		Authentication is handled through Firebase.
		Only authenticated users can save or manage code snippets.
		Sessions are verified securely across the application.

- **Docker + Docker Compose**
  The entire backend system, including the Redis server, is containerized for reproducibility and cloud deployment.
Using Docker ensures that the application behaves identically across environments — local, staging, or production.

- **File Download Support**
Users can download their code directly from the editor in one click.
This makes it easy to export work for submission, documentation, or further local development.Download is triggered via a frontend utility
  
## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your/repository.git
2. Navigate to the project directory:
   ```bash
     cd real-time-code-editor
3. Frontend Setup:
   ```bash
    cd frontend
    npm install
    npm start
4. Backend Setup:
    ```bash
    cd backend
    npm install
    node server.js

5. Docker Setup
   ```bash
   docker-compose up --build
   
6. Open your browser and go to:
   ```bash
    http://localhost:3000 to use the application.   
