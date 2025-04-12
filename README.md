# Hochustul - Furniture Store

Modern furniture store built with Next.js, Prisma, and Tailwind CSS.

## Features

- 🛋️ Browse furniture catalog
- 🔍 Filter by categories and materials
- 👤 Admin panel for product management
- 📱 Responsive design
- 🖼️ Image upload support
- 🔒 Authentication

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hochustul.git
cd hochustul
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Then edit `.env` with your values.

4. Set up the database:
```bash
npx prisma migrate dev
npx prisma db seed
```

5. Run the development server:
```bash
npm run dev
```

## Deployment

### Deploy on Vercel

The easiest way to deploy this app is to use [Vercel](https://vercel.com):

1. Create an account on Vercel
2. Install Vercel CLI: `npm i -g vercel`
3. Run `vercel` in the project directory
4. Follow the prompts to deploy

### Required Environment Variables

Make sure to set these environment variables in your Vercel project:

- `DATABASE_URL`: Your database connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `NEXTAUTH_SECRET`: Secret key for NextAuth.js
- `NEXTAUTH_URL`: Your deployment URL

## Database

This project uses Prisma with PostgreSQL. For production, we recommend using:
- [Vercel Postgres](https://vercel.com/storage/postgres)
- [Supabase](https://supabase.com)
- [Railway](https://railway.app)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
