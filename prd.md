# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Web Application – Flatmates Platform for India

---

## 1. Product Overview

**Product Name:** Roommates India (Working Title)  
**Platform:** Web Application (Responsive – Desktop & Mobile)  
**Product Type:** Two-sided marketplace (Seekers & Listers)

**Target Users:**
- University students
- Young professionals
- Migrants in metro & tier-1 Indian cities

---

## 2. Problem Statement

- Flatmate search relies on Facebook/WhatsApp groups
- High risk of scams & fake listings
- No structured filtering or compatibility matching
- Poor communication and safety

---

## 3. Product Vision

Build India’s most trusted, simple, and safe platform to find rooms and compatible flatmates.

---

## 4. Goals & Success Metrics

### Business Goals
- Become the #1 flatmate platform in metro cities
- Monetize via subscriptions and featured listings

### KPIs
| Metric | Target |
|------|--------|
| User Signups | 50,000 in 6 months |
| Active Listings | 10,000 |
| Premium Conversion | 15% |
| Scam Reports | <2% |

---

## 5. User Personas

### Seeker
- Looking for room / flatmate
- Filters by budget, gender, lifestyle

### Lister
- Has vacant room / flat
- Wants verified, quality leads

### Admin
- Moderates platform
- Handles safety & payments

---

## 6. Scope

### Included
- Responsive web app
- Authentication & profiles
- Listings & search
- Messaging
- Payments
- Admin dashboard

### Excluded (Future)
- Native mobile apps
- Rent payment handling
- Background verification

---

## 7. Functional Requirements

---

### 7.1 Authentication & Accounts

**Features:**
- Signup via email/password
- Phone OTP login
- Email & phone verification
- Password reset

**Acceptance Criteria:**
- Verified users only can message
- One account per phone number

---

### 7.2 User Profile

**Fields:**
- Name
- Profile photo
- Age
- Gender (optional visibility)
- Occupation / Student
- Bio
- Lifestyle preferences
- Budget range
- Move-in date

**Features:**
- Edit profile
- Privacy controls

---

### 7.3 Listings

**Listing Types:**
- Private room
- Shared room
- Entire flat
- PG / Hostel

**Fields:**
- Title
- Rent
- Deposit
- Location (city, locality, landmark)
- Photos (max 10)
- Amenities
- Availability date
- Gender preference
- House rules

**Actions:**
- Create / edit / delete listing
- Pause or mark as filled

---

### 7.4 Search & Discovery

**Filters:**
- City & locality
- Budget
- Room type
- Gender preference
- Move-in date
- Amenities

**Views:**
- List view
- Map view (Google Maps)

**Extras:**
- Save search
- Email alerts

---

### 7.5 Messaging System

**Features:**
- 1-to-1 in-app chat
- Text & image support
- Message timestamps

**Limits:**
- Free users: limited messages/day
- Premium users: unlimited

**Safety:**
- Hide phone numbers
- Block/report users

---

### 7.6 Premium & Monetization

**Plans:**
- Weekly
- Monthly

**Premium Benefits:**
- Unlimited messages
- Featured listings
- Profile boost
- Early access to new listings

**Payments:**
- UPI
- Debit/Credit Cards
- Razorpay integration

---

### 7.7 Admin Panel

**Features:**
- User management
- Listing moderation
- Report handling
- Subscription management
- Refunds
- Analytics dashboard

---

## 8. Non-Functional Requirements

| Category | Requirement |
|--------|-------------|
| Performance | <2s page load |
| Scalability | 100k+ users |
| Security | Encrypted credentials |
| Uptime | 99.5% |
| Responsiveness | Mobile-first |

---

## 9. User Flows

### Seeker Flow
Home → Signup → Profile → Search → Message → Visit → Move-in

### Lister Flow
Signup → Create Listing → Receive Messages → Upgrade → Close Listing

---

## 10. Tech Stack (Suggested)

**Frontend:** React / Next.js, Tailwind CSS  
**Backend:** Node.js + Express  
**Database:** PostgreSQL or MongoDB  
**Hosting:** AWS / GCP  
**Maps:** Google Maps API  
**Payments:** Razorpay  

---

## 11. MVP Definition

### Must-Have
- Auth
- Profiles
- Listings
- Search
- Messaging
- Admin moderation

### Nice-to-Have
- Map view
- Save search
- Featured listings

---

## 12. Future Enhancements

- Mobile apps
- AI flatmate matching
- Reviews & ratings
- Rent split calculator
- Regional language support

---

## 13. Risks & Mitigation

| Risk | Mitigation |
|-----|-----------|
| Fake listings | Manual moderation + reports |
| Low trust | Verification badges |
| Low revenue | Freemium model |

---

## 14. Launch Strategy

- Launch in one metro city
- Target universities & IT hubs
- Social media & referral marketing