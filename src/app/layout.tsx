import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/lib/auth';
import { PadTrackerProvider } from '@/lib/padTracker';
import { NotificationsProvider } from '@/lib/notifications';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Luna's EstroPad Tracker</title>
        <meta name="description" content="Track your estrogen pad usage and get timely reminders" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <AuthProvider>
        <PadTrackerProvider>
          <NotificationsProvider>
            <Component {...pageProps} />
          </NotificationsProvider>
        </PadTrackerProvider>
      </AuthProvider>
    </>
  );
}
