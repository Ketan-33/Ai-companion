# SaaS AI Companion with Next.js 13, React, Tailwind, Prisma, Stripe 

Features:

- Tailwind design
- Tailwind animations and effects
- Full responsiveness
- Clerk Authentication (Email, Google, 9+ Social Logins)
- Client form validation and handling using react-hook-form
- Server error handling using react-toast
- Image Generation Tool (Open AI)
- Video Generation Tool (Replicate AI)
- Conversation Generation Tool (Open AI)
- Music Generation Tool (Replicate AI)
- Page loading state
- Stripe monthly subscription
- Free tier with API limiting
- How to write POST, DELETE, and GET routes in route handlers (app/api)
- How to fetch data in server react components by directly accessing database (WITHOUT API! like Magic!)
- How to handle relations between Server and Child components!
- How to reuse layouts
- Folder structure in Next 13 App Router

### Prerequisites

**Node version 18.x.x**

### Cloning the repository

```shell
git clone https://github.com/Ketan-33/Ai-companion.git
```

### Install packages

```shell
npm i
```

### Setup .env file


```shell
copy .env.example .env
```

### Setup Prisma

Add MySQL Database (I used PlanetScale)

```shell
npx prisma db push

```

Seed categories:
```shell
node scripts/seed.ts
```

### Start the app

```shell
npm run dev
```

### Testing Subscriptions

To test the subscription functionality, use Stripe's test card details:

- Card number: `4242 4242 4242 4242`
- Expiry date: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

