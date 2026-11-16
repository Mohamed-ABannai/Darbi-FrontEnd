# DARBI Frontend

## Overview

**DARBI** is a driving school management application that connects learners, driving instructors, examiners, and administrators. Learners can find instructors, request training plans, book driving lessons after a training plan is accepted, track completed hours, manage payments, submit reviews, and request driving tests.

Instructors manage training requests and lessons, examiners handle assigned driving tests, and administrators manage users, approvals, training records, reviews, and driving tests. The interface provides separate pages and navigation for each role.

To get started, a user creates an account or signs in. After signing in, they are directed to their role's dashboard and can access the features available to that role through the sidebar.

## Live Application

- **Frontend:** To be added after deployment
- **Backend API:** To be added after deployment
- **Backend Repository:** [DARBI Backend](https://github.com/Mohamed-ABannai/Darbi-Backend)

## Screenshots

### Home Page

![homePage](src/assets/ReadmeImages/home-page.png)

### SignUp (learner,Instructor)

![Learner](src/assets/ReadmeImages/learner-sign-up.png) - ![instructor](src/assets/ReadmeImages/instructor-sign-up.png)

### SignIn

![SignIn](src/assets/ReadmeImages/sign-in.png)

### Learner Dashboard

![LearnerDashboard](src/assets/ReadmeImages/learner-dashboard.png)

### Find Instructor

![findInstructor](src/assets/ReadmeImages/find-instructor.png)

### Instructor Details

![InstructorDetials](src/assets/ReadmeImages/instructor-details.png)

### My Training Plan
![MyTrainingPlan](src/assets/ReadmeImages/my-training-plan.png)

### My Lessons
![MyLesson](src/assets/ReadmeImages/my-lessons.png)

### Driving Test

![DrivingTest](src/assets/ReadmeImages/driving-test.png)

### Payment:

![Payment](src/assets/ReadmeImages/learner-payment.png)

### Reviews Instructor

![Reviews Instructor](src/assets/ReadmeImages/instructor-reviews.png)


### Instructor Side

### Instructor Dashboard

![InstructorDashboard](src/assets/ReadmeImages/instructor-dashboard.png)

### TrainingRequest

![TrainingRequest](src/assets/ReadmeImages/training-requests.png)

### Manage My Learner 

![ManageMyLearner](src/assets/ReadmeImages/manage-my-learners.png)

### ManageLesson

![ManageLesson](src/assets/ReadmeImages/manage-lessons.png)

### Payment 

![InstrcutorPaymentRecieve](src/assets/ReadmeImages/instructor-payments.png)

### Examiner Dashboard

![ExaminerDashboard](src/assets/ReadmeImages/examiner-dashboard.png)

### assignedTest

![assignedTest](src/assets/ReadmeImages/assigned-tests.png)


### Admin Side

### Admin Dashboard

![adminDashboard](src/assets/ReadmeImages/admin-dashboard.png)

### manage User

![ManageUser](src/assets/ReadmeImages/manage-users.png)

### Manage Examiner

![manageExaminer](src/assets/ReadmeImages/manage-examiners.png)

### instructor approval

![instructorApproval](src/assets/ReadmeImages/instructor-approval.png)

### Manage Training 

![manageTraining](src/assets/ReadmeImages/manage-training.png)

### manageReviews

![manageReviews](src/assets/ReadmeImages/manage-reviews.png)

### manage Driving

![manageDrivingTest](src/assets/ReadmeImages/manage-driving-tests.png)

### manage Admins

![manageAdmins](src/assets/ReadmeImages/manage-admins.png)

### Profile for whole sides

![Profile](src/assets/ReadmeImages/profile.png)

## Technologies Used

- React
- Vite
- React Router
- Axios
- CSS

## Features

- Learner and instructor registration, sign-in, and sign-out
- Protected routes and role-specific dashboards
- Responsive public navigation and signed-in sidebar
- Profile management and profile picture display
- Instructor search, details, and reviews
- Training plan requests, instructor acceptance, and rejection
- Lesson booking, status tracking, cancellation, and completion
- Completed training-hour progress toward the 22-hour target
- Lesson payment tracking, payment-method selection, and invoice PDF downloads
- Driving test requests, eligibility display, and test history
- Examiner dashboard, assigned tests, and result submission
- Admin management of users, instructors, training plans, reviews, and driving tests
- Examiner account creation and status management
- SuperAdmin management of admin accounts

## Project Structure

```text
src/
├── assets/                        # Images and DARBI logo
├── components/
│   ├── Navbar.jsx                 # Public navigation
│   └── Sidebar.jsx                # Role-based navigation
├── pages/
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── InstructorApprovals.jsx
│   │   ├── ManageAdmins.jsx
│   │   ├── ManageDrivingTests.jsx
│   │   ├── ManageExaminers.jsx
│   │   ├── ManageReviews.jsx
│   │   ├── ManageTraining.jsx
│   │   └── ManageUsers.jsx
│   ├── examiner/
│   │   ├── AssignedTests.jsx
│   │   └── ExaminerDashboard.jsx
│   ├── instructor/
│   │   ├── InstructorDashboard.jsx
│   │   ├── InstructorLessons.jsx
│   │   ├── InstructorPayments.jsx
│   │   ├── MyLearners.jsx
│   │   └── TrainingRequests.jsx
│   ├── learner/
│   │   ├── FindInstructors.jsx
│   │   ├── InstructorDetails.jsx
│   │   ├── LearnerDashboard.jsx
│   │   ├── LearnerDrivingTests.jsx
│   │   ├── LearnerLessons.jsx
│   │   ├── LearnerPayments.jsx
│   │   ├── LearnerReviews.jsx
│   │   └── MyTrainingPlans.jsx
│   ├── shared/
│   │   └── Profile.jsx
│   ├── Dashboard.jsx
│   ├── Homepage.jsx
│   ├── SigninPage.jsx
│   └── SignupPage.jsx
├── services/
│   ├── api.js                      # Axios client and token handling
│   ├── authService.js
│   ├── drivingTestService.js
│   ├── lessonService.js
│   ├── paymentService.js
│   ├── reviewService.js
│   ├── trainingPlanService.js
│   └── userService.js
├── App.css
├── App.jsx                        # Routes and application layout
├── index.css
└── main.jsx                       # Application entry point
```

## Getting Started

### Prerequisites

Install the following before running the project:

- Node.js and npm

The DARBI backend API must be running. See the [backend repository](https://github.com/Mohamed-ABannai/Darbi-Backend) for its setup instructions.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Mohamed-ABannai/Darbi-FrontEnd.git
cd Darbi-FrontEnd
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the environment file

Create a `.env` file in the root directory:

```env
VITE_BACK_END_SERVER_URL=http://localhost:3000
```

Use the URL and port on which your DARBI backend is actually running.

### 4. Start the development server

```bash
npm run dev
```

Go to:

```text
http://localhost:5173
```

## Application Routes

| Route | Page | Access |
| --- | --- | --- |
| `/` | Home page | Public (signed-in users are redirected) |
| `/sign-up` | Registration | Public |
| `/sign-in` | Sign in | Public |
| `/dashboard` | Role-specific dashboard | Authenticated |
| `/find-instructors` | Find instructors | Learner |
| `/instructors/:id` | Instructor details | Learner |
| `/my-plans` | My training plans | Learner |
| `/learner/my-training-plans` | Redirect to `/my-plans` | Redirect |
| `/lessons` | My lessons | Learner |
| `/payments` | Payments | Learner |
| `/reviews` | Instructor reviews | Learner |
| `/driving-tests` | Driving tests | Learner |
| `/instructor/requests` | Training requests | Instructor |
| `/instructor/learners` | My learners | Instructor |
| `/instructor/lessons` | Manage lessons | Instructor |
| `/instructor/payments` | Instructor payments | Instructor |
| `/examiner/assigned-tests` | Assigned driving tests | Examiner |
| `/admin/users` | Manage users | Admin / SuperAdmin |
| `/admin/instructor-approvals` | Instructor approvals | Admin / SuperAdmin |
| `/admin/training` | Manage training | Admin / SuperAdmin |
| `/admin/reviews` | Manage reviews | Admin / SuperAdmin |
| `/admin/driving-tests` | Manage driving tests | Admin / SuperAdmin |
| `/admin/examiners` | Manage examiners | Admin / SuperAdmin |
| `/admin/manage-admins` | Manage admins | SuperAdmin |
| `/profile` | My profile | Authenticated |
| `*` | Redirect to an available page | Depends on sign-in status |

## User Stories

- **As a learner**, I want to find an instructor and request a training plan so I can begin driving lessons.
- **As a learner**, I want to book and view individual lessons, monitor my completed hours, and manage payments so I can follow my progress.
- **As a learner**, I want to review my instructor and request a driving test when eligible.
- **As an instructor**, I want to accept training requests and manage learners and lessons so I can deliver training.
- **As an instructor**, I want to view lesson payments and update their status.
- **As an examiner**, I want to see my assigned tests and submit results.
- **As an admin**, I want to manage user accounts, instructor approvals, examiner accounts, training, reviews, and tests.
- **As a SuperAdmin**, I want to manage administrator accounts.

## Future Enhancements

- Improve scheduling with clearer instructor availability and conflict prevention.
- Add in-app notifications when training requests, lesson bookings, or driving-test results change.
- Integrate secure online payment processing while keeping payment records and invoices accurate.
- Improve examiner assignment based on availability and workload.
- Expand learner progress summaries and administrative reports.
- Add automated frontend tests for protected routes and important user workflows.

## Team Members

| Name | GitHub |
| --- | --- |
| Mohamed Al Bannai | [Mohamed-ABannai](https://github.com/Mohamed-ABannai) |
| Amir | [amirAlsharabi](https://github.com/amirAlsharabi) |
| Yusuf | [YHM9205](https://github.com/YHM9205) |

## Credits

Developed by the DARBI project team using React and the MERN stack. See the [backend repository](https://github.com/Mohamed-ABannai/Darbi-Backend) for the server-side implementation.