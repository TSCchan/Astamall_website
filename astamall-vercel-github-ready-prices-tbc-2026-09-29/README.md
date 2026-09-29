# ASTAMALL — Vercel release

This ZIP contains the ASTAMALL storefront as a standard Next.js project for GitHub and Vercel. It includes the same pages, products, styling, images, and client-side interactions as the current ASTAMALL site. The archive contains source files; Vercel builds the deployment after importing the repository.

## Publish through GitHub and Vercel

1. Extract the ZIP. Upload the **contents** of the extracted folder to the root of a new GitHub repository. `package.json`, `app/`, and `public/` should be at the repository root.
2. In Vercel, create a project and import that repository. Use the detected **Next.js** framework preset and leave the root directory at `./`.
3. Use Node.js 22.x or newer. Leave the default install, build, and output settings in place. Vercel will install from `package-lock.json` and run `npm run build`.
4. Deploy. After connecting a custom domain, optionally set `NEXT_PUBLIC_SITE_URL` to its full `https://` URL for site metadata. Redeploy if you set or change that variable.

To verify locally, run `npm ci` and `npm run build`. For development, run `npm run dev`.

The current storefront's cart and checkout are a preview. They do not create orders or take payments. Publishing this project on Vercel preserves that behaviour; a production commerce backend and approved shipping, returns, and privacy terms would need separate work.
