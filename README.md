TaskFlow : Project Requirement Document
---------------------------------------

Objective
---------

TaskFlow is a collaborative project management platform designed to streamline freelance team workflows. It supports structured team roles, project tracking, group chat, and minimal client interaction (login and payment).

Scope
-----

The platform focuses on:

-   Managing software development and freelance projects.

-   Assigning and tracking roles and responsibilities.

-   Ensuring structured team communication.

-   Providing basic client involvement.

Stakeholders
------------

-   Admin

-   Team Leader

-   Team Co-Leader

-   Team Member

-   Client

Functional Requirements
-----------------------

### Admin

-   Manage Users

-   Register user (email & password)

-   Update user (email, password, role)

-   Delete user

-   Manage Projects

-   Create, update, cancel project with note

-   Manage Teams

-   Create teams using registered emails

-   Assign team leader

### Team Leader

-   Assign project roles:

-   frontendRoleAssignedTo

-   backendRoleAssignedTo

-   uiRoleAssignedTo

-   Update project details:

-   lastUpdate

-   lastMeeting

-   projectStatus

-   estimatedDelivery

-   rating

-   clientStatus

-   figmaLink

-   backendLink

-   liveLink

-   deliveryDate

-   requirementDoc

-   notes

### Team Co-Leader

-   Update limited project details:

-   lastUpdate

-   lastMeeting

-   projectStatus

-   estimatedDelivery

-   rating

-   clientStatus

-   figmaLink

-   backendLink

-   liveLink

-   deliveryDate

-   requirementDoc

-   notes

### Team Member

-   Based on assignment:

-   Frontend: update liveLink

-   Backend: update backendLink

-   UI: update figmaLink

### Client

-   Basic login

-   View project status

-   Basic payment (placeholder for future implementation)

Non-Functional Requirements
---------------------------

-   Responsive design for desktop and mobile.

-   Real-time communication via WebSockets.

-   Secure authentication and authorization.

-   Scalable microservice architecture.

-   Modular and maintainable codebase.

Error Handling
--------------

-   API should consistently return structured error responses:

-   401 Unauthorized for unauthenticated access.

-   403 Forbidden for unauthorized access.

-   400 Bad Request for validation and input errors.

-   404 Not Found for missing resources.

-   500 Internal Server Error for server-side failures.

-   Log all server-side errors with request metadata for debugging.

-   Frontend should handle errors gracefully:

-   Validate all required inputs before API calls.

-   Display error messages clearly near form fields.

-   Handle failed API responses with retry mechanisms and alerts.

-   WebSocket errors:

-   Detect disconnections and auto-reconnect with exponential backoff.

-   Notify users of delivery failures in group chat.

-   Admin Dashboard Error Logging:

-   Show system-level logs only to Admin.

-   Provide actionable logs for project failures.

Main Modules
------------

### 1\. Project

-   projectId

-   projectName

-   station

-   clientId

-   deadline

-   isCanceled

-   cancellationNote

-   teamName

-   frontendRoleAssignedTo

-   backendRoleAssignedTo

-   uiRoleAssignedTo

-   lastUpdate

-   lastMeeting

-   projectStatus

-   estimatedDelivery

-   rating

-   clientStatus

-   figmaLink

-   backendLink

-   liveLink

-   deliveryDate

-   requirementDoc

-   notes

### 2\. Team

-   teamId

-   teamName

-   teamLeaderId

-   teamColeaderId

-   teamMembersIds

### 3\. User

-   userEmail

-   userPassword

-   userRole (admin, teamLeader, teamColeader, teamMember, client)

### 4\. Chats

-   Group chat based on teams

-   Members of a team can chat with each other

-   Built using WebSockets (e.g., Socket.IO or Firebase)

Technology Stack
----------------

Backend: Node.js, Express.js, TypeScript, MongoDB, Mongoose, JWT, REST API, MVC, Modular Architecture\
Frontend: React, Redux, Next.js, Tailwind CSS\
Tools & Platforms: Git, GitHub, Vercel, Postman, Nodemailer, Socket.IO

Assumptions and Constraints
---------------------------

-   Users must be pre-registered by Admin.

-   A user cannot belong to multiple teams.

-   Clients interact minimally with limited access.

-   Ratings are internal, not public.

Future Enhancements
-------------------

-   File upload and storage system for deliverables.

-   Integrated client feedback and revision tracking.

-   Advanced analytics dashboard for Admin and Leaders.

-   Payment gateway integration for clients.

Dedicated Error Handling Section
--------------------------------

-   Centralized error handler for backend with categorized logging (auth, database, validation, etc.).

-   Use middleware in Express.js to handle and forward errors.

-   Monitoring tools like Sentry or LogRocket for real-time error tracking.

-   Custom error classes for structured server-side logic.

-   Track frontend errors using browser APIs and report to backend.

-   Retry mechanisms with fallback UI and clear messaging for users.

-   Critical error reporting system to alert Admins of failures immediately.