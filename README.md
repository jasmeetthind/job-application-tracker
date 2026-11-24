# JobTrack — Job Application Tracker

A job application management dashboard built with **React, TypeScript, and Vite**, designed to help job seekers organize and monitor their applications throughout the recruitment process.

**Project status:** In development  
**Project type:** Personal software engineering portfolio project  
**Current architecture:** Client-side React application  
**Long-term goal:** Full-stack web application

## 1. Project Overview

JobTrack is a web application that provides a centralized location for tracking job applications, interview progress, and hiring outcomes.

The project was created to gain practical experience with modern software engineering technologies, including frontend development, backend APIs, database design, testing, and version control.

My goal is to develop this application incrementally while applying software engineering concepts and documenting my development process.

## 2. Technologies Used

### Currently implemented

- **React** — Component-based user interface development
- **TypeScript** — Type-safe JavaScript development
- **HTML and CSS** — Responsive layout and visual styling
- **Vite** — Frontend development and build tooling
- **Git** — Version control
- **GitHub** — Source code hosting and development history
- **ESLint** — Static code analysis

### Planned technologies

- **Node.js and Express** — Backend server and REST APIs
- **PostgreSQL** — Relational database
- **Vitest and Supertest** — Automated testing
- **Docker** — Application containerization
- **GitHub Actions** — Continuous integration
- **Vercel and backend hosting** — Deployment

These technologies will be introduced as the application develops.

## 3. Current Features

- Display a dashboard of job applications.
- Add applications with a company name, position, and status.
- Track application statuses: Applied, Interview, Offer, and Rejected.
- Automatically calculate total applications, interviews, and offers.
- Display applications in a structured table.
- Use React state to update the interface without reloading the page.
- Responsive styling for different screen sizes.

**In progress:** Deleting applications and expanding application management capabilities.

**Current limitation:** Application data is stored in React state and resets when the page refreshes. Persistent storage will be implemented in a future development phase.

## 4. Getting Started

### Prerequisites

- Node.js and npm
- Git
- A code editor such as Visual Studio Code

### Installation

Clone the repository:

`git clone https://github.com/YOUR-USERNAME/job-application-tracker.git`

Navigate into the project directory:

`cd job-application-tracker`

Install dependencies:

`npm install`

Start the development server:

`npm run dev`

Open the local address displayed in Terminal, typically:

`http://localhost:5173/`

To create a production build:

`npm run build`

## 5. Development Process

I am developing JobTrack incrementally to understand how individual parts of a modern web application work together.

My workflow includes:

1. Defining a small set of application requirements.
2. Implementing functionality using React and TypeScript.
3. Testing features manually in the browser.
4. Investigating errors and improving the code.
5. Recording meaningful changes through Git commits.
6. Expanding the project to incorporate backend services and persistent storage.

Rather than attempting to implement every feature simultaneously, I am using an iterative development approach.

## 6. AI-Assisted Development and Prompts

ChatGPT has been used as a learning and development assistant throughout this project. I use AI to explore technical concepts, obtain implementation guidance, and investigate errors.

Below are representative prompts and questions from my development process, with their purpose.

| Prompt or question | Purpose |
|---|---|
| "Recommend five beginner-friendly full-stack projects that demonstrate professional software engineering skills." | Project selection and planning |
| "Let's start with the Job Application Tracker." | Initial requirements and project setup |
| "The website wasn't updated." | Investigating development server and frontend update issues |
| "FormEvent is crossed out." | Understanding TypeScript and React event types |
| "I press Delete, but it doesn't delete." | Debugging application functionality |
| "Here's my code." | Reviewing implementation and identifying a function-scope problem |
| "How do I add this to GitHub so I can keep updating it?" | Learning Git and repository management |

These prompts are examples of how AI assisted the learning and troubleshooting process, rather than a complete transcript.

### Development approach

AI-generated suggestions are reviewed alongside the project code. I work through the implementation, inspect errors, and use testing to determine whether the suggested changes solve the problem.

An important objective of this project is to develop the ability to understand, maintain, and extend the code rather than relying solely on generated solutions.

## 7. Technical Challenges and Lessons Learned

### React state management

**Challenge:** Understanding how the application updates when a new job application is submitted.

**Learning:** React's `useState` hook stores application data, and updating state causes the interface and dashboard statistics to render again.

### Function scope and event handling

**Challenge:** The Delete button did not work as expected.

**Cause identified:** The deletion handler had been declared inside the function responsible for adding applications.

**Learning:** Function scope determines where JavaScript functions can be accessed. Separating event handlers within the React component makes them accessible to the appropriate interface elements.

### TypeScript event types

**Challenge:** The editor displayed a deprecation warning for `FormEvent`.

**Learning:** React and TypeScript type definitions evolve. Development involves understanding editor diagnostics and selecting suitable event types.

### Version control

**Challenge:** Learning how to maintain a project across multiple development sessions.

**Learning:** Git commits record changes locally, while GitHub provides a remote repository for sharing code, reviewing development history, and supporting future collaboration.

## 8. Planned Improvements

### Phase 1 — Frontend functionality

- [x] Initialize the React and TypeScript project.
- [x] Create the dashboard.
- [x] Add job applications.
- [x] Display application statistics.
- [ ] Verify application deletion.
- [ ] Edit application details and status.
- [ ] Search applications.
- [ ] Filter applications by status.

### Phase 2 — Backend development

- [ ] Create a Node.js and Express server.
- [ ] Design REST API endpoints.
- [ ] Implement CRUD operations.
- [ ] Add backend validation and error handling.

### Phase 3 — Database integration

- [ ] Design PostgreSQL tables.
- [ ] Connect the backend to PostgreSQL.
- [ ] Persist job application records.
- [ ] Retrieve and update application records through APIs.

### Phase 4 — Professional development practices

- [ ] Add user authentication.
- [ ] Write frontend and backend tests.
- [ ] Add automated testing with GitHub Actions.
- [ ] Configure Docker.
- [ ] Deploy the application.
- [ ] Add screenshots and a live demo link.

## 9. Screenshots

Dashboard screenshots will be included as development progresses.

Planned screenshots include the application overview, add-application form, and application management table.

## 10. Key Skills Demonstrated

This project is intended to demonstrate practical experience in:

- React component development
- TypeScript programming
- State management
- Event handling and form validation
- Responsive interface design
- Debugging and troubleshooting
- Git version control
- Technical documentation
- Incremental software development

As the project progresses, it will also demonstrate backend API development, relational database design, automated testing, and deployment.

## 11. Project Goals

JobTrack is both a functional application and a learning project.

My objectives are to strengthen my understanding of full-stack software engineering, gain experience with industry-standard development tools, and build a maintainable project that demonstrates technical growth.

Future updates and implementation decisions will be documented through the repository's commit history