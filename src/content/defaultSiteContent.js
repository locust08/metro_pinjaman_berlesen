export const defaultSiteContent = {
  site: {
    navbar: {
      logoAlt: 'Metro Pinjaman Berlesen',
      items: [
        { label: 'About us', href: 'about_us.html' },
        { label: 'Loan', href: 'loan.html' },
        { label: 'How to apply', href: 'how_to_apply.html' },
        { label: 'Contact us', href: 'contact.html' },
      ],
      cta: { label: 'Apply now', href: 'loan.html' },
    },
    footer: {
      copyright: '© 2026 Flow. All rights reserved.',
      columns: [
        {
          heading: 'Company',
          links: [
            { label: 'Home', href: 'index.html' },
            { label: 'About us', href: 'about_us.html' },
            { label: 'Loan', href: 'loan.html' },
          ],
        },
        {
          heading: 'Support',
          links: [
            { label: 'How to apply', href: 'how_to_apply.html' },
            { label: 'Contact us', href: 'contact.html' },
          ],
        },
      ],
      contact: {
        email: 'metropinjamanberlesan@gmail.com',
        phone: '+60 11-7007 3191',
        address: 'Jalan Metro 1, Metro Prima, 52100 Kuala Lumpur, Federal Territory of Kuala Lumpur',
      },
    },
  },
  pages: {
    home: {
      hero: {
        heading: 'Simple Loans,',
        body: 'Get the funds you need with competitive rates and a streamlined application. No hidden fees, no surprises - just straightforward lending.',
        primaryCta: { label: 'Check Your Rate', href: 'contact.html' },
        secondaryCta: { label: 'Learn More', href: 'loan.html' },
        image: { src: 'flow-assets/headers/header-4-bottom-right.png', alt: '' },
      },
      process: {
        heading: 'How it works',
        body: 'Get your loan in four simple steps.',
      },
      cta: {
        heading: 'Ready to get started?',
        body: 'Apply now and get the funds you need in no time.',
      },
    },
    about: {
      hero: {
        heading: 'About us',
        body: 'Metro Pinjaman Berlesen helps Malaysians access personal and business loans with a clear, simple application process.',
        image: { src: 'flow-assets/about-us/photo-1.png', alt: '' },
      },
    },
    loan: {
      hero: {
        heading: 'Loan',
        body: 'Choose a loan option that fits your needs and apply with simple documentation.',
        image: { src: 'flow-assets/headers/header-4-bottom-right.png', alt: '' },
      },
    },
    howToApply: {
      hero: {
        heading: 'How to apply',
        body: 'Follow a simple application process and get assistance from our team.',
        image: { src: 'flow-assets/headers/header-4-bottom-right.png', alt: '' },
      },
    },
    contact: {
      hero: {
        heading: 'Contact us',
        body: 'Contact Metro Pinjaman Berlesen for personal and business loan enquiries. Our team is ready to assist you 24/7.',
        image: { src: 'flow-assets/contact/photo-1.png', alt: '' },
      },
      faq: {
        heading: 'FAQ',
        body: 'Here you will find the answers to the frequently asked questions.',
      },
    },
  },
};
