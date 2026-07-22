import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "~/styles/app.css?url";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Global Mobilis — Simplify Your Global Journey" },
      {
        name: "description",
        content:
          "Global Mobilis is your all-in-one platform for international migration, expat communities, and global networking. Discover destinations, connect with expats, and simplify your move abroad.",
      },
      { name: "theme-color", content: "#0E4F8B" },
      { property: "og:title", content: "Global Mobilis" },
      {
        property: "og:description",
        content:
          "Your all-in-one platform for global migration, expat communities, and international networking.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="text-center">
        <h1 className="mb-2 text-4xl font-bold text-gray-900">404</h1>
        <p className="text-gray-600">Page not found</p>
      </div>
    </div>
  ),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-white antialiased">
        <Header />
        <main className="min-h-dvh pt-16">{children}</main>
        <Footer />
        <Scripts />
      </body>
    </html>
  );
}