import "./globals.css";
import type { Metadata } from "next";
import {
  Cabin,
  Luckiest_Guy,
  Bebas_Neue,
  Londrina_Solid,
} from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/providers";
import fetchGames from "@/utils/server/fetchGames";
import { Analytics } from "@vercel/analytics/react";
import { locales } from "@/middleware";
import { Toaster } from "react-hot-toast";

const cabin = Cabin({ subsets: ["latin"], variable: "--font-cabin" });

const luckiestGuy = Luckiest_Guy({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-luckiest-guy",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas-neue",
});

const londrinaSolid = Londrina_Solid({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-londrina-solid",
});

const title = "Nouns Esports";
const description = "Leading the revolution in community driven esports!";

export const metadata = {
  title: {
    default: title,
    template: `${title} - %s`,
  },
  description,
  keywords: [
    "esports",
    "nouns",
    "nounsdao",
    "web3",
    "crypto",
    "community",
    "gaming",
    "blockchain",
    "nft",
    "dao",
    "governance",
  ],
  metadataBase: new URL("https://nouns.gg"),
  alternates: {
    canonical: "/",
    languages: Object.keys(locales).reduce((object, locale) => {
      object[locale] = `/${locale}`;
      return object;
    }, {} as Record<string, string>),
  },
  openGraph: {
    type: "website",
    images: ["/pokemon.webp"],
  },
  twitter: {
    site: "@NounsEsports",
    card: "summary_large_image",
    images: ["/pokemon.webp"],
  },
  themeColor: "black",
} satisfies Metadata;

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const games = await fetchGames();

  return (
    <html
      lang={props.params.locale}
      className="scroll-smooth overflow-x-hidden"
    >
      <body
        className={`cursor-crosshair ${cabin.variable} ${luckiestGuy.variable} ${bebasNeue.variable} ${londrinaSolid.variable} bg-black text-lightgrey font-cabin selection:text-white selection:bg-red w-full`}
      >
        <Providers games={games}>
          <Header locale={props.params.locale} />
          {props.children}
          <Footer locale={props.params.locale} />
        </Providers>
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
