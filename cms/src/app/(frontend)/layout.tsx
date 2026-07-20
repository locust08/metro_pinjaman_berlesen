import React from 'react'

export const metadata = {
  description: 'Metro Pinjaman Berlesen Payload preview',
  title: 'Metro Pinjaman Berlesen Preview',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Inter:400,500,600,700,800,900|Plus+Jakarta+Sans:400,500,600,700,800,900&subset=latin"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap"
        />
        <link rel="stylesheet" href="https://metropinjamanberlesen.pages.dev/css/tailwind/tailwind.min.css" />
        <link rel="stylesheet" href="https://metropinjamanberlesen.pages.dev/css/main.css" />
      </head>
      <body className="antialiased bg-body text-body font-body">
        {children}
      </body>
    </html>
  )
}
