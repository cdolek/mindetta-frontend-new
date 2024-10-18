import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { Theme } from "@radix-ui/themes";
import LoadingIndicator from "~/app/_components/LoadingIndicator";

export const metadata: Metadata = {
  title: "Mindetta",
  description: "...",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable}`}
      style={{ background: "red" }}
    >
      <body suppressHydrationWarning={true}>
        <Theme
          appearance="dark"
          scaling="110%"
          radius="medium"
          panelBackground="solid"
        >
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <LoadingIndicator />
        </Theme>
      </body>
    </html>
  );
}
