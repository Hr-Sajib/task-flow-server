Task Flow Chat Application
==========================

Overview
--------

Task Flow is a collaborative platform designed to manage teams, projects, and real-time communication. It enables users to create and manage teams, assign projects, chat in real-time, handle payments, and manage user accounts. Built with a modern tech stack, the application integrates MongoDB for data persistence, Socket.IO for real-time messaging, and Stripe for payment processing, alongside a React-based frontend for a seamless user experience.

- https://taskflow-smt.up.railway.app

- Admin[admin@taskflow.com | pass: admin@taskflow]

Features
--------

-   **Team Management**: Create teams, assign leaders and co-leaders, move members, and update team details.
-   **Project Management**: Create, update, and cancel projects, assign them to teams, and track project status.
-   **Real-Time Chat**: Join team chat rooms and send messages that are stored and broadcasted in real-time.
-   **User Management**: Create and update user profiles, change passwords, and retrieve user details.
-   **Authentication**: Secure login with JWT tokens and refresh token functionality.
-   **Payment Integration**: Process payments via Stripe for projects, confirm payments, and retrieve payment history.
-   **Role-Based Access**: Supports roles like admin, team leader, team member, and client.

Tech Stack
----------

-   **Backend**: Node.js, Express, Socket.IO, Mongoose
-   **Database**: MongoDB
-   **Frontend**: React, Axios
-   **Authentication**: JWT
-   **Payment**: Stripe
-   **Other**: TypeScript

Prerequisites
-------------

-   Node.js (v14.x or later)
-   MongoDB (local or remote instance)
-   npm or yarn
-   Stripe account for payment integration (optional for local testing)

Installation
------------

### Backend Setup

1.  Clone the repository:

    ```
    git clone https://github.com/yourusername/task-flow.git
    cd task-flow/server

    ```

2.  Install dependencies:

    ```
    npm install

    ```

3.  Configure environment variables:
    -   Create a `.env` file in the `server` directory.
    -   Add the following:

        ```
        PORT=5100
        MONGODB_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret
        STRIPE_SECRET_KEY=your_stripe_secret_key

        ```

4.  Start the server:

    ```
    npm start

    ```

Usage
-----

1.  **Login**: Authenticate using `/api/auth/login` with your credentials to obtain an `accessToken`.
2.  **Create a Team**: Use `/api/team` to create a team and automatically set up a chat room.
3.  **Join a Team Chat**: Enter a team name in the frontend and click "Join Team" to create or join a chat room.
4.  **Send Messages**: Type a message and click "Send" to broadcast it to all team members in real-time.
5.  **Manage Projects**: Create, update, or cancel projects and assign them to teams using the project APIs.
6.  **Process Payments**: Use the payment endpoints to initiate and confirm transactions for projects.
7.  **Logout**: Click "Logout" in the frontend to clear the session and return to the login page.

Postman Collection
------------------

🚀 **Test APIs with Postman!** 🚀\
A comprehensive Postman collection is included in the root of this project as `Postman-collection.json`. Import it into Postman to easily test all API endpoints.

📥 **Download the Postman Collection**:\
[Download Postman-collection.json](https://github.com/Hr-Sajib/task-flow-serverraw/main/Postman-collection.json)

This collection includes all API routes with pre-configured headers, bodies, and sample data to get you started quickly.

API Routes
----------

### Authentication

-   **Login**: `POST /api/auth/login`
    -   Body: `{ "userEmail": "string", "userPassword": "string" }`
    -   Response: `{ "accessToken": "string" }`
-   **Refresh Token**: `POST /api/auth/refresh`
    -   Response: `{ "accessToken": "string" }`

### User Management

-   **Create User**: `POST /api/user`
    -   Body: `{ "userName": "string", "userEmail": "string", "userPassword": "string", "userRole": "string", "userJoiningDate": "string", "userEmployeeId": "string", "address": "string", "userPhone": "string", "photo": "string" }`
    -   Headers: `Authorization: Bearer <accessToken>`
-   **Get Specific User**: `GET /api/user/:userEmployeeId`
    -   Headers: `Authorization: Bearer <accessToken>`
-   **Update User**: `PATCH /api/user/update-user`
    -   Body: `{ "userName": "string" }`
    -   Headers: `Authorization: Bearer <accessToken>`
-   **Change Password**: `PATCH /api/user/change-password`
    -   Body: `{ "oldPassword": "string", "newPassword": "string" }`
    -   Headers: `Authorization: Bearer <accessToken>`

### Team Management

-   **Create Team**: `POST /api/team`
    -   Body: `{ "teamName": "string", "teamID": "string", "teamLeaderEmail": "string", "teamColeaderEmail": "string", "teamMembersEmails": ["string"] }`
    -   Headers: `Authorization: Bearer <accessToken>`
-   **Get All Teams**: `GET /api/team`
    -   Headers: `Authorization: Bearer <accessToken>`
-   **Get Specific Team**: `GET /api/team/:teamId`
    -   Headers: `Authorization: Bearer <accessToken>`
-   **Move Member**: `PATCH /api/team/move-member`
    -   Body: `{ "memberEmail": "string", "toTeamName": "string" }`
    -   Headers: `Authorization: Bearer <accessToken>`
-   **Update Team**: `PATCH /api/team`
    -   Body: `{ "currentTeamID": "string", "teamName": "string", "teamID": "string" }`
    -   Headers: `Authorization: Bearer <accessToken>`
-   **Change Leader**: `PATCH /api/team/change-leader`
    -   Body: `{ "teamID": "string", "newLeaderEmail": "string" }`
    -   Headers: `Authorization: Bearer <accessToken>`
-   **Change Co-Leader**: `PATCH /api/team/change-coleader`
    -   Body: `{ "teamID": "string", "newCoLeaderEmail": "string" }`
    -   Headers: `Authorization: Bearer <accessToken>`
-   **Delete Team**: `DELETE /api/team/:id`
    -   Headers: `Authorization: Bearer <accessToken>`
-   **Assign Project to Team**: `PATCH /api/team/assign-project`
    -   Body: `{ "teamName": "string", "projectId": "string" }`
    -   Headers: `Authorization: Bearer <accessToken>`
-   **Find My Team**: `GET /api/team/findMyTeam`
    -   Headers: `Authorization: Bearer <accessToken>`

### Project Management

-   **Create Project**: `POST /api/project`
    -   Body: `{ "projectId": "string", "projectName": "string", "station": "string", "clientId": "string", "deadline": "string", "projectValue": number, "requirementDoc": "string", "projectDescription": "string", "teamName": "string", "frontendRoleAssignedTo": "string", "backendRoleAssignedTo": "string", "uiRoleAssignedTo": "string", "lastUpdate": "string", "lastMeeting": "string", "projectStatus": "string", "estimatedDelivery": "string", "rating": "string", "clientStatus": "string", "figmaLink": "string", "backendLink": "string", "liveLink": "string", "deliveryDate": "string" }`
    -   Headers: `Authorization: Bearer <accessToken>`
-   **Get All Projects**: `GET /api/project`
-   **Get Specific Project**: `GET /api/project/:projectId`
    -   Headers: `Authorization: Bearer <accessToken>`
-   **Update Project**: `PATCH /api/project/:projectId`
    -   Body: `{ "teamName": "string" }` (and other fields as needed)
    -   Headers: `Authorization: Bearer <accessToken>`
-   **Cancel Project**: `PATCH /api/project/:projectId/cancel`
    -   Body: `{ "cancellationNote": "string" }`

### Chat

-   **Socket handled chat initializations and messaging**
-   **Get Specific Team Chat**: `GET /api/chat/team/:teamId`

### Payment

-   **Create Checkout Session**: `POST /api/payment/create-checkout-session`
    -   Body: `{ "projectId": "string", "amount": number, "clientId": "string" }`
    -   Headers: `Authorization: Bearer <accessToken>`
-   **Confirm Payment**: `GET /api/payment/confirm?sessionId=<sessionId>`
-   **Get Payment History**: `GET /api/payment/:clientId`
    -   Headers: `Authorization: Bearer <accessToken>`

Contact
-------

For issues or questions, please open an issue on the GitHub repository or contact the maintainers at `hrsajib001@gmail.com`.

Acknowledgments
---------------

-   Thanks to the open-source community for tools like Socket.IO, Mongoose, React, and Stripe.
-   Inspired by collaborative team and project management needs.