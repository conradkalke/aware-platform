# AWARE Platform

A modern web application for connecting medical research labs with supporters through transparent funding and educational content.

## Features

- **Lab Discovery**: Browse and explore medical research labs
- **Transparent Donations**: Direct funding with milestone-based donations
- **Research Updates**: Feed of latest research stories and updates
- **Stripe Integration**: Secure payment processing
- **Responsive Design**: Modern UI built with Tailwind CSS and shadcn/ui

## Tech Stack

- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui with Radix UI primitives
- **Payments**: Stripe
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Stripe account (for payment processing)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd aware-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values (or copy from `.env.example` if present):
```
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
aware-platform/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── api/               # API routes
│   ├── contact/           # Contact page
│   ├── donate/            # Donation pages
│   ├── labs/              # Lab pages
│   ├── privacy/           # Privacy policy
│   └── terms/             # Terms of service
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions
└── public/               # Static assets
```

## Key Pages

- **Home** (`/`): Landing page with hero section and value propositions
- **Labs** (`/labs`): Browse and search research labs
- **Lab Detail** (`/labs/[id]`): Detailed lab profile with milestones and team
- **Donate** (`/donate/[labId]`): Donation flow with Stripe integration
- **About** (`/about`): Mission and team information
- **Contact** (`/contact`): Contact form and information

## API Routes

- **POST** `/api/create-checkout-session`: Creates Stripe checkout session for donations

## Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

### Adding New Labs

Labs are centralized in `lib/labs.ts`.

1. Open `lib/labs.ts`
2. Add a new object to the exported `labs` array (ensure `id` is URL-safe)
3. Optional: include `longDescription`, `impact`, `team`, and `budget` fields for richer lab pages
4. The pages `'/labs'`, `'/labs/[id]'`, and `'/donate/[labId]'` will automatically reflect the new lab

### Styling

The project uses Tailwind CSS with a custom color scheme centered around rose/pink tones. Key colors:
- Primary: `rose-600`
- Hover: `rose-700`
- Background: `rose-50`
- Text: Various gray shades

## Deployment

The application is ready for deployment on platforms like Vercel, Netlify, or any Node.js hosting service.

1. Build the application: `npm run build`
2. Set environment variables on your hosting platform
3. Deploy the built files

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary.

## Support

For questions or support, please contact:
- Email: conradjulian18@gmail.com
- Phone: +1 (860) 372-8039

