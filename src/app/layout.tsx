import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { headers } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import { Theme } from "@radix-ui/themes";
import LoadingIndicator from "~/app/_components/LoadingIndicator";
import { cloakSSROnlySecret } from "ssr-only-secrets";

export const metadata: Metadata = {
  title: "Mindetta",
  description: "...",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookie = new Headers(headers()).get("cookie");
  const encryptedCookie = await cloakSSROnlySecret(
    cookie ?? "",
    "SECRET_CLIENT_COOKIE_VAR",
  );

  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body suppressHydrationWarning={true}>
        <Theme
          appearance="dark"
          scaling="110%"
          radius="medium"
          panelBackground="solid"
        >
          <TRPCReactProvider ssrOnlySecret={encryptedCookie}>
            {children}
          </TRPCReactProvider>
          <LoadingIndicator />
        </Theme>
      </body>
    </html>
  );
}
