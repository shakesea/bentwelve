import { Providers } from "./providers";
import "@/app/ui/globals.css";

export const metadata = {
  title: "FlowerScotch",
  description: "A flower shop application",
};

import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}