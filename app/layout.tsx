import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JOBSI – Find Opportunities. Build Your Future.",
  description: "Discover the latest government, banking, private and IT job opportunities with JOBSI."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
