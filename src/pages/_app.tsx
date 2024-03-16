import { type AppType } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Roboto } from "next/font/google"

const roboto = Roboto({ subsets: ['latin'], weight: ["400", "500", "700"], display: 'swap' });

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <SessionProvider session={pageProps.session}>
      <main className={roboto.className}>
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
};  

export default MyApp;
