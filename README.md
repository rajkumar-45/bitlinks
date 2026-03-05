This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Advanced Features

### 🌐 Custom Domain Support
To use a custom domain with Bitlinks (e.g., `link.yourbrand.com`):
1. **DNS Setup**: Point a CNAME record from your subdomain to the Bitlinks production URL (e.g., `bitlinks.vercel.app`).
2. **Server Configuration**: In a production environment, you would use a middleware or a reverse proxy to detect the incoming hostname and map it to the corresponding user account in the database.
3. **Database Mapping**: Add a `customDomain` field to the user profile and check for it during the redirection logic to serve links specifically for that domain.

### 🛡️ Spam Protection
Bitlinks includes a built-in domain blacklist to prevent the creation of links pointing to known malicious or phishing sites. This list can be dynamically updated in `app/api/generate/route.js`.

### 📊 Real-time Analytics
Every link click captures detailed visitor data, including:
- **Country**: Geolocation based on IP.
- **Device**: Desktop, Mobile, or Tablet detection via User-Agent.
- **History**: Click counts over the last 7 days visualized in the dashboard.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
