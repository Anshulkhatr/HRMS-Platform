# HRMS Platform

A scalable, multi-tenant Human Resource Management System (HRMS) built using the MERN Stack.

## Overview

HRMS is a SaaS-based platform designed to manage the complete employee lifecycle, including employee management, attendance tracking, leave management, approvals, notifications, reporting, and organizational hierarchy.

The platform supports multiple organizations (tenants) with strict data isolation and role-based access control.

---

## Features

### Authentication & Authorization

* JWT Authentication
* Refresh Tokens
* Role-Based Access Control (RBAC)
* Multi-Tenant Architecture
* Password Reset
* Account Lockout Protection
* Audit Logging

### Employee Management

* Employee Directory
* Organization Structure
* Departments
* Designations
* Locations
* Employee Lifecycle Management
* Employee Document Management

### Attendance Management

* Punch In / Punch Out
* Attendance Regularization
* Shift Management
* Attendance Reports
* Holiday Calendar
* Overtime Tracking

### Leave Management

* Leave Policies
* Leave Balances
* Leave Requests
* Multi-Level Approval Workflow
* Leave History
* Loss of Pay (LOP)

### Workflow & Approvals

* Leave Approval
* Attendance Approval
* Employee Update Approval
* Multi-Level Approval Engine

### Notifications

* Email Notifications
* In-App Notifications
* Approval Alerts
* Reminder Notifications

### Reports & Dashboard

* Headcount Reports
* Attendance Reports
* Leave Reports
* Employee Reports
* Dashboard Analytics
* Export CSV / Excel / PDF

### Security

* Tenant Isolation
* Audit Logs
* Role-Based Access
* Rate Limiting
* Data Encryption
* OWASP Best Practices

---

## Tech Stack

### Frontend

* React.js
* Redux Toolkit
* React Router DOM
* Axios
* Tailwind CSS

### Backend

* Node.js
* Express.js
* JWT Authentication
* Nodemailer

### Database

* MongoDB
* Mongoose

### Storage

* Cloudinary / AWS S3

### Optional Services

* Redis
* BullMQ
* Kafka

---

## Project Structure

```bash
HRMS/
│
├── client/
├── server/
├── database/
├── infrastructure/
├── docs/
├── shared/
│
├── docker-compose.yml
├── README.md
└── package.json
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/hrms.git
cd hrms
```

### Backend Setup

```bash
cd server

npm install
```

Create a `.env` file:

```env
PORT=5000

MONGO_URI=

JWT_SECRET=

JWT_REFRESH_SECRET=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Run backend:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd client

npm install

npm run dev
```

---

## API Modules

### Authentication

```http
POST /api/auth/login
POST /api/auth/register
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### Employee

```http
GET    /api/employees
GET    /api/employees/:id
POST   /api/employees
PUT    /api/employees/:id
DELETE /api/employees/:id
```

### Attendance

```http
POST /api/attendance/punch-in
POST /api/attendance/punch-out

GET  /api/attendance
```

### Leave

```http
POST /api/leaves

GET  /api/leaves

PUT  /api/leaves/:id/approve

PUT  /api/leaves/:id/reject
```

---

## Roles

### Employee

* Manage Profile
* Apply Leave
* View Attendance
* View Documents

### Manager

* Team Management
* Approve Requests
* Team Attendance

### HR Admin

* Employee Management
* Leave Policies
* Attendance Policies
* Reports
* Audit Logs

### Leadership

* Organization Analytics
* Reports
* Dashboards

---

## Audit Logging

Every important action is recorded:

* Login
* Employee Creation
* Employee Update
* Leave Approval
* Attendance Regularization
* Role Changes
* Sensitive Data Changes

Stored Information:

```js
{
  userId,
  tenantId,
  action,
  module,
  oldData,
  newData,
  ipAddress,
  timestamp
}
```

---

## Future Enhancements

* Payroll Management
* Recruitment ATS
* Performance Management
* LMS
* Expense Management
* Asset Management
* Mobile Application
* AI Analytics

---

## Scalability

* Multi-Tenant SaaS Architecture
* Stateless Backend
* Horizontal Scaling
* Redis Caching
* Queue-Based Processing
* Cloud Object Storage
* Microservice Ready

---

## Author

Gourav Sonecha

Built using MERN Stack and Enterprise Architecture principles.
