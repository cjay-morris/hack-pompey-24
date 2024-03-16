import { type AppType } from "next/app";
import { SessionProvider } from "next-auth/react";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};  

export default MyApp;
