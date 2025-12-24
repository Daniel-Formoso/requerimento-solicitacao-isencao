import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portal de Isenção e Imunidade",
  description:
    "Portal de requerimento digital para solicitação de isenção e imunidade.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/assets/logo_ico.ico" sizes="any" />
      </head>
      <body>{children}</body>
    </html>
  );
}
