import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter:400,500,600,700,800,900|Plus+Jakarta+Sans:400,500,600,700,800,900&amp;subset=latin" />
                <link href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet" />
                <link rel="stylesheet" href="/css/tailwind/tailwind.min.css" />
                <link rel="stylesheet" href="/css/main.css" />
                <link rel="icon" type="image/png" sizes="32x32" href="/metro-favicon.png" />
                <script src="https://cdn.jsdelivr.net/npm/alpinejs@3.13.3/dist/cdn.min.js" defer />
            </Head>
            <body className="antialiased bg-body text-body font-body">
                <Main />
                <NextScript />
                
            </body>
        </Html>
    )
}
