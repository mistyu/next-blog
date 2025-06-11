Next.js+Hono+Prisma开发,并运行在vercel与supabase之上

## Getting Started

First, run the development server:

1. redis
```bash
 docker run -d --name redis -p 6379:6379 redis
```
2. postgres
```bash
docker run -d \            
  --name postgres-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=12345678 \
  -e POSTGRES_DB=nhblog \
  -p 5432:5432 \
  postgres
```
3. start
```bash
pnpm i
pnpm dev
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
