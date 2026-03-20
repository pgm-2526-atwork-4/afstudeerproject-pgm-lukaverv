# 🎵 Beatstack

<div align="center">

**A Modern Beat Marketplace Platform**

[![Nuxt 3](https://img.shields.io/badge/Nuxt-3-00DC82?logo=nuxt.js)](https://nuxt.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 📖 About

**Beatstack** is a full-stack web application for music producers to upload, sell, and manage their beats, while allowing users to discover, purchase, and download high-quality instrumental tracks. Built as a graduation project at **Arteveldehogeschool** by **Lukas Vervaet**, this platform combines modern web technologies with a seamless user experience.

### 🎯 Key Features

#### For Producers

- **Beat Management** - Upload beats with customizable metadata (title, genre, BPM, key, tags)
- **Licensing System** - Offer three licensing tiers (Basic, Premium, Exclusive) with custom pricing
- **Analytics Dashboard** - Track plays, likes, comments, sales, and fan engagement with interactive charts
- **Profile Customization** - Build your producer brand with custom profiles and track preferences

#### For Listeners

- **Discovery** - Advanced search and filtering by genre, BPM, key, tags, and price range
- **Social Features** - Like tracks, comment on beats, and follow your favorite producers
- **Shopping** - Add beats to cart, purchase through Stripe, and download purchased files
- **Authentication** - Email/password, Google, and GitHub OAuth sign-in

#### Platform Features

- **Real-time Notifications** - Get notified of likes, comments, follows, and sales
- **Audio Player** - Custom waveform visualizer with scrubbing and playback controls
- **Responsive Design** - Fully optimized for desktop, tablet, and mobile
- **Secure Payments** - Stripe integration with webhook-based order processing
- **Email System** - Automated emails for verification, password resets, and account deletion

---

## 🛠️ Technology Stack

### Frontend

- **Framework**: [Nuxt 3](https://nuxt.com) + [Vue 3](https://vuejs.org/) + TypeScript
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Forms**: [VeeValidate](https://vee-validate.logaretm.com/)
- **Charts**: [Chart.js](https://www.chartjs.org/) + [vue-chartjs](https://vue-chartjs.org/)
- **Audio**: [Howler.js](https://howlerjs.com/) + [Wavesurfer.js](https://wavesurfer-js.org/)

### Backend

- **Database**: [PostgreSQL](https://www.postgresql.org/) on [Neon](https://neon.tech/) (serverless)
- **ORM**: [Prisma](https://www.prisma.io/)
- **API Framework**: [H3](https://h3.unjs.io/)

### Authentication

- **OAuth**: [@sidebase/nuxt-auth](https://sidebase.io/nuxt-auth) (NextAuth.js)
- **JWT**: [jsonwebtoken](https://jwt.io/)
- **Password Hashing**: [bcrypt](https://github.com/kelektiv/node.bcrypt.js)

### Payments

- **Payment Gateway**: [Stripe](https://stripe.com/)
- **Webhooks**: Stripe Webhook fulfillment

### File Management

- **Storage**: [Cloudinary](https://cloudinary.com/)
- **Metadata Parsing**: [Music Metadata](https://github.com/Borewit/music-metadata)

### Email

- **SMTP**: [Nodemailer](https://nodemailer.com/)

### Deployment

- **Hosting**: [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **PostgreSQL** database ([Neon](https://neon.tech/) recommended)
- **Stripe** account
- **Cloudinary** account
- **Google/GitHub OAuth apps** (optional)

### Installation

1. **Clone the repository**

```bash
   git clone https://github.com/pgm-2526-atwork-4/afstudeerproject-pgm-lukaverv.git
   cd afstudeerproject-pgm-lukaverv
```

2. **Install dependencies**

```bash
   npm install
```

3. **Set up environment variables**

```bash
   cp .env.example .env
```

Fill in your `.env` with database URL, JWT secrets, Cloudinary credentials, Stripe keys, and OAuth secrets.

4. **Set up the database**

```bash
   npx prisma generate
   npx prisma db push
```

5. **Start the development server**

```bash
   npm run dev
```

App runs at `http://localhost:3000`

---

## 📂 Project Structure

```
beatstack/
├── app/
│   ├── components/       # Vue components (buttons, charts, inputs, modals, etc.)
│   ├── composables/      # Reusable composition functions (e.g., useAudioPlayer, useNotifications)
│   ├── layouts/          # App layouts (default, mobile menu, navbar)
│   ├── middleware/       # Route protection and global middleware
│   ├── pages/            # File-based routing
│   │   ├── auth/         # Login, register, verify
│   │   ├── beat/         # Beat details, create, edit
│   │   ├── dashboard/    # Producer analytics
│   │   ├── discover/     # Beat discovery
│   │   ├── shop/         # Cart, checkout, downloads
│   │   └── profile/      # User profiles
│   ├── stores/           # Pinia stores (e.g., cart, audio)
│   ├── plugins/          # Nuxt plugins (e.g., vee-validate)
│   ├── data/             # Static or dynamic data (e.g., filterData)
│   └── utils/            # Client-side utilities (e.g., notifications)
├── server/
│   ├── api/              # API endpoints
│   │   ├── auth/         # Authentication routes
│   │   ├── beats/        # Beat CRUD operations
│   │   ├── interactions/ # Likes, comments, follows
│   │   ├── dashboard/    # Analytics endpoints
│   │   ├── checkout/     # Stripe checkout
│   │   └── notifications/# Notification system
│   └── utils/            # Shared server utilities (e.g., auth helpers, formatters)
├── prisma/
│   └── schema.prisma     # Database schema
├── public/               # Static assets
└── nuxt.config.ts        # Nuxt configuration
```

---

## 🔧 Configuration

### Stripe Webhooks

For local development:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

For production, add `https://yourdomain.com/api/webhooks/stripe` in the Stripe Dashboard and select the `checkout.session.completed` event.

### OAuth Setup

**Google:** Google Cloud Console → Credentials → OAuth 2.0 Client → add `http://localhost:3000/api/auth/callback/google` as redirect URI.

**GitHub:** GitHub Settings → Developer Settings → OAuth Apps → add `http://localhost:3000/api/auth/callback/github` as callback URL.

---

## 🏗️ Building for Production

```bash
npm run build
npm run preview
```

---

## 👨‍💻 Author

**Lukas Vervaet**
Graduation Project — Arteveldehogeschool (2026)
Program: Web Development

---

## 📄 License

Created for educational purposes as part of a graduation project at Arteveldehogeschool.

---

<div align="center">

**Made with ❤️ by Lukas Vervaet**

</div>
