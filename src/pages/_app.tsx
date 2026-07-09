import '../styles/globals.css'
import '../styles/main.css';
import Head from 'next/head';
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <script src="/js/global-88881.js" defer />
            </Head>
            <Component {...pageProps} />
        </>
    )
}
