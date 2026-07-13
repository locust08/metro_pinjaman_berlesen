# Payload Frontend Mapping

## Mapping Contract

This is the stable identifier inventory for the fixed-layout frontend. Each row is
one Payload field and one explicit frontend identifier. Task 2 adds the IDs to the
legacy HTML and uses a server-side HTML parser to target these identifiers; it must
not infer targets from CSS classes, text order, DOM order, or `data-cms-*`
attributes.

The frontend owns the element, route, link destination, layout, styles, icon,
animation, form behavior, calculator behavior, and tracking. Payload owns only the
field values in this inventory. Array indices are fixed to the existing visible
cards, steps, list items, and FAQ items; editors cannot add, remove, or reorder
them. The canonical defaults for every fallback value will live in
`src/payload/content.ts`, which both the frontend fallback and Payload seed use.

Desktop and mobile header markup is separate in the legacy templates. Each
visible variant therefore receives its own stable identifier row, but desktop
and mobile variants of the same value intentionally share one Payload field
path. The fixed frontend component/template applies that one value to every
mapped variant; it must not introduce a second CMS field for a breakpoint.

## Site Settings

| Payload Global | Field path | Stable frontend identifier | Frontend file | Frontend section | Visible element | Shared | Fallback value |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Site Settings | header.websiteLogo | #site-header-logo | src/legacy-pages/*.html | Header | Desktop header logo image | Yes | flow-assets/logos/flow-logo.svg |
| Site Settings | header.websiteLogo | #site-header-mobile-logo | src/legacy-pages/*.html | Header | Mobile drawer logo image | Yes | flow-assets/logos/sign-logo-flow.svg |
| Site Settings | header.aboutUsMenuLabel | #site-header-nav-about-us | src/legacy-pages/*.html | Header | Desktop About us nav label | Yes | About us |
| Site Settings | header.aboutUsMenuLabel | #site-header-mobile-nav-about-us | src/legacy-pages/*.html | Header | Mobile About us nav label | Yes | About us |
| Site Settings | header.loanMenuLabel | #site-header-nav-loan | src/legacy-pages/*.html | Header | Desktop Loan nav label | Yes | Loan |
| Site Settings | header.loanMenuLabel | #site-header-mobile-nav-loan | src/legacy-pages/*.html | Header | Mobile Loan nav label | Yes | Loan |
| Site Settings | header.howToApplyMenuLabel | #site-header-nav-how-to-apply | src/legacy-pages/*.html | Header | Desktop How to apply nav label | Yes | How to apply |
| Site Settings | header.howToApplyMenuLabel | #site-header-mobile-nav-how-to-apply | src/legacy-pages/*.html | Header | Mobile How to apply nav label | Yes | How to apply |
| Site Settings | header.contactUsMenuLabel | #site-header-nav-contact-us | src/legacy-pages/*.html | Header | Desktop Contact us nav label | Yes | Contact us |
| Site Settings | header.contactUsMenuLabel | #site-header-mobile-nav-contact-us | src/legacy-pages/*.html | Header | Mobile Contact us nav label | Yes | Contact us |
| Site Settings | header.applyNowButtonLabel | #site-header-apply-now-label | src/legacy-pages/*.html | Header | Desktop Apply now button label | Yes | Apply now |
| Site Settings | header.applyNowButtonLabel | #site-header-mobile-apply-now-label | src/legacy-pages/about_us.html | Header | Mobile drawer Apply now button label | Yes | Apply now |
| Site Settings | header.loginButtonLabel | #site-header-mobile-login-label | src/legacy-pages/index.html, src/legacy-pages/contact.html, src/legacy-pages/how_to_apply.html, src/legacy-pages/loan.html | Header | Mobile drawer Login button label | Yes | Login |
| Site Settings | header.newsletterLabel | #site-header-mobile-newsletter-label | src/legacy-pages/index.html, src/legacy-pages/contact.html, src/legacy-pages/how_to_apply.html, src/legacy-pages/loan.html | Header | Mobile drawer Newsletter label | Yes | Newsletter |
| Site Settings | footer.footerLogo | #site-footer-logo | src/legacy-pages/*.html | Footer | Footer logo image | Yes | flow-assets/logos/flow-logo.svg |
| Site Settings | footer.pagesColumnHeading | #site-footer-pages-heading | src/legacy-pages/*.html | Footer | Pages column heading | Yes | Pages |
| Site Settings | footer.homeLinkLabel | #site-footer-link-home | src/legacy-pages/*.html | Footer | Home link label | Yes | Home |
| Site Settings | footer.aboutUsLinkLabel | #site-footer-link-about-us | src/legacy-pages/*.html | Footer | About us link label | Yes | About us |
| Site Settings | footer.loanLinkLabel | #site-footer-link-loan | src/legacy-pages/*.html | Footer | Loan link label | Yes | Loan |
| Site Settings | footer.helpColumnHeading | #site-footer-help-heading | src/legacy-pages/*.html | Footer | Help column heading | Yes | Help |
| Site Settings | footer.howToApplyLinkLabel | #site-footer-link-how-to-apply | src/legacy-pages/*.html | Footer | How to apply link label | Yes | How to apply |
| Site Settings | footer.contactUsLinkLabel | #site-footer-link-contact-us | src/legacy-pages/*.html | Footer | Contact us link label | Yes | Contact us |
| Site Settings | footer.copyrightText | #site-footer-copyright | src/legacy-pages/*.html | Footer | Copyright text | Yes | (c) 2026 Flow. All rights reserved. |
| Site Settings | contactDetails.supportEmail | #site-contact-support-email | src/legacy-pages/contact.html | Contact Details Section | Support email | Yes | metropinjamanberlesan@gmail.com |
| Site Settings | contactDetails.displayPhoneNumber | #site-contact-phone-number | src/legacy-pages/contact.html | Contact Details Section | Display phone number | Yes | +60 11-7007 3191 |
| Site Settings | contactDetails.telephoneLinkNumber | #site-contact-phone-link | src/legacy-pages/contact.html | Contact Details Section | Telephone link number | Yes | +601170073191 |
| Site Settings | contactDetails.whatsappNumber | #site-contact-whatsapp-link | src/legacy-pages/contact.html | Contact Details Section | WhatsApp destination number | Yes | 601170073191 |
| Site Settings | contactDetails.defaultWhatsappMessage | #site-contact-whatsapp-message | src/legacy-pages/contact.html | Contact Details Section | WhatsApp prefilled message | Yes | Hi Metro Pinjaman Berlesen, I would like to enquire about a loan appointment. |
| Site Settings | contactDetails.businessHours | #site-contact-business-hours | src/legacy-pages/contact.html | Contact Details Section | Availability text | Yes | 24/7 |
| Site Settings | contactDetails.officeName | #site-contact-office-name | src/legacy-pages/contact.html | Contact Details Section | Office name | Yes | Metro Pinjaman Berlesen |
| Site Settings | contactDetails.officeAddress | #site-contact-office-address | src/legacy-pages/contact.html | Contact Details Section | Office address | Yes | Jalan Metro 1, Metro Prima, 52100 Kuala Lumpur, Federal Territory of Kuala Lumpur |
| Site Settings | contactDetails.wazeUrl | #site-contact-waze-link | src/legacy-pages/contact.html | Contact Details Section | Waze map link | Yes | Current Jalan Metro 1 Waze URL |
| Site Settings | contactDetails.googleMapsUrl | #site-contact-google-maps-link | src/legacy-pages/contact.html | Contact Details Section | Google Maps link | Yes | Current Jalan Metro 1 Google Maps URL |
| Site Settings | formMessages.sendingMessage | #site-form-sending-message | src/legacy-pages/contact.html, src/legacy-pages/how_to_apply.html | Appointment Form | Submitting state label | Yes | Submitting... |
| Site Settings | formMessages.successfulSubmissionMessage | #site-form-success-message | src/legacy-pages/contact.html, src/legacy-pages/how_to_apply.html | Appointment Form | Success message | Yes | Booking submitted. |
| Site Settings | formMessages.failedSubmissionMessage | #site-form-failure-message | src/legacy-pages/contact.html, src/legacy-pages/how_to_apply.html | Appointment Form | Submission failure message | Yes | Sorry, we could not submit your appointment right now. Please try again or contact us on WhatsApp. |
| Site Settings | formMessages.validationSummaryMessage | #site-form-validation-message | src/legacy-pages/contact.html, src/legacy-pages/how_to_apply.html | Appointment Form | Validation summary | Yes | Please complete all required fields. |

## Home Page

Current section order: Header, Hero Section, How It Works Section, Statistics
Strip, Loan Options Section, Why Choose Us Section, Ready To Get Started Section,
Footer.

| Payload Global | Field path | Stable frontend identifier | Frontend file | Frontend section | Visible element | Shared | Fallback value |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Home Page | seo.title | #home-seo-title | src/legacy-pages/index.html | Document metadata | HTML title | No | Page title |
| Home Page | seo.description | #home-seo-description | src/legacy-pages/index.html | Document metadata | Meta description | No | Empty (not present in current HTML) |
| Home Page | hero.eyebrow | #home-hero-eyebrow | src/legacy-pages/index.html | Hero Section | Eyebrow label | No | Powering Tomorrow |
| Home Page | hero.mainHeading | #home-hero-main-heading | src/legacy-pages/index.html | Hero Section | Main h1 | No | Simple Loans, |
| Home Page | hero.description | #home-hero-description | src/legacy-pages/index.html | Hero Section | Hero paragraph | No | Get the funds you need with competitive rates and a streamlined application. No hidden fees, no surprises — just straightforward lending. |
| Home Page | hero.primaryButtonLabel | #home-hero-primary-button-label | src/legacy-pages/index.html | Hero Section | Primary CTA label | No | Check Your Rate |
| Home Page | hero.secondaryButtonLabel | #home-hero-secondary-button-label | src/legacy-pages/index.html | Hero Section | Secondary CTA label | No | Learn More |
| Home Page | hero.leftTopImage | #home-hero-left-top-image | src/legacy-pages/index.html | Hero Section | Decorative left-top image | No | flow-assets/headers/header-4-left-top.png |
| Home Page | hero.rightTopImage | #home-hero-right-top-image | src/legacy-pages/index.html | Hero Section | Decorative right-top image | No | flow-assets/headers/header-4-right-top.png |
| Home Page | hero.bottomLeftImage | #home-hero-bottom-left-image | src/legacy-pages/index.html | Hero Section | Decorative bottom-left image | No | flow-assets/headers/header-4-bottom-lleft.png |
| Home Page | hero.bottomRightImage | #home-hero-bottom-right-image | src/legacy-pages/index.html | Hero Section | Decorative bottom-right image | No | flow-assets/headers/header-4-bottom-right.png |
| Home Page | howItWorks.heading | #home-how-it-works-heading | src/legacy-pages/index.html | How It Works Section | Section heading | No | How It Works |
| Home Page | howItWorks.description | #home-how-it-works-description | src/legacy-pages/index.html | How It Works Section | Section description | No | Get your loan in four simple steps. |
| Home Page | howItWorks.steps[0].title | #home-how-it-works-step-1-title | src/legacy-pages/index.html | How It Works Section | Step 1 title | No | Select Loan |
| Home Page | howItWorks.steps[0].description | #home-how-it-works-step-1-description | src/legacy-pages/index.html | How It Works Section | Step 1 description | No | Choose the loan type that fits your needs. |
| Home Page | howItWorks.steps[1].title | #home-how-it-works-step-2-title | src/legacy-pages/index.html | How It Works Section | Step 2 title | No | Apply Online |
| Home Page | howItWorks.steps[1].description | #home-how-it-works-step-2-description | src/legacy-pages/index.html | How It Works Section | Step 2 description | No | Fill in our simple form in just minutes. |
| Home Page | howItWorks.steps[2].title | #home-how-it-works-step-3-title | src/legacy-pages/index.html | How It Works Section | Step 3 title | No | Get Approved |
| Home Page | howItWorks.steps[2].description | #home-how-it-works-step-3-description | src/legacy-pages/index.html | How It Works Section | Step 3 description | No | Receive fast approval with no guarantor. |
| Home Page | howItWorks.steps[3].title | #home-how-it-works-step-4-title | src/legacy-pages/index.html | How It Works Section | Step 4 title | No | Receive Money |
| Home Page | howItWorks.steps[3].description | #home-how-it-works-step-4-description | src/legacy-pages/index.html | How It Works Section | Step 4 description | No | Money is sent directly to your account. |
| Home Page | statistics.items[0].value | #home-statistic-1-value | src/legacy-pages/index.html | Statistics Strip | Statistic 1 value | No | 4 |
| Home Page | statistics.items[0].label | #home-statistic-1-label | src/legacy-pages/index.html | Statistics Strip | Statistic 1 label | No | Simple Application Steps |
| Home Page | statistics.items[1].value | #home-statistic-2-value | src/legacy-pages/index.html | Statistics Strip | Statistic 2 value | No | 2 |
| Home Page | statistics.items[1].label | #home-statistic-2-label | src/legacy-pages/index.html | Statistics Strip | Statistic 2 label | No | Loan Options Available |
| Home Page | statistics.items[2].value | #home-statistic-3-value | src/legacy-pages/index.html | Statistics Strip | Statistic 3 value | No | 24h |
| Home Page | statistics.items[2].label | #home-statistic-3-label | src/legacy-pages/index.html | Statistics Strip | Statistic 3 label | No | Response Time Target |
| Home Page | statistics.items[3].value | #home-statistic-4-value | src/legacy-pages/index.html | Statistics Strip | Statistic 4 value | No | 100% |
| Home Page | statistics.items[3].label | #home-statistic-4-label | src/legacy-pages/index.html | Statistics Strip | Statistic 4 label | No | Transparent Terms |
| Home Page | loanOptions.heading | #home-loan-options-heading | src/legacy-pages/index.html | Loan Options Section | Section heading | No | Loan Options |
| Home Page | loanOptions.description | #home-loan-options-description | src/legacy-pages/index.html | Loan Options Section | Section description | No | Choose the perfect loan to match your goals. |
| Home Page | loanOptions.cards[0].image | #home-loan-option-1-image | src/legacy-pages/index.html | Loan Options Section | Personal loan card image | No | https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80 |
| Home Page | loanOptions.cards[0].title | #home-loan-option-1-title | src/legacy-pages/index.html | Loan Options Section | Personal loan card title | No | Personal Loan |
| Home Page | loanOptions.cards[0].description | #home-loan-option-1-description | src/legacy-pages/index.html | Loan Options Section | Personal loan card description | No | Get flexible funding for personal needs, from emergencies to dreams. |
| Home Page | loanOptions.cards[0].linkLabel | #home-loan-option-1-link-label | src/legacy-pages/index.html | Loan Options Section | Personal loan card link label | No | Learn more |
| Home Page | loanOptions.cards[1].image | #home-loan-option-2-image | src/legacy-pages/index.html | Loan Options Section | Business loan card image | No | https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80 |
| Home Page | loanOptions.cards[1].title | #home-loan-option-2-title | src/legacy-pages/index.html | Loan Options Section | Business loan card title | No | Business Loan |
| Home Page | loanOptions.cards[1].description | #home-loan-option-2-description | src/legacy-pages/index.html | Loan Options Section | Business loan card description | No | Grow your business with funding tailored for entrepreneurs. |
| Home Page | loanOptions.cards[1].linkLabel | #home-loan-option-2-link-label | src/legacy-pages/index.html | Loan Options Section | Business loan card link label | No | Learn more |
| Home Page | whyChooseUs.image | #home-why-choose-us-image | src/legacy-pages/index.html | Why Choose Us Section | Section image | No | https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80 |
| Home Page | whyChooseUs.heading | #home-why-choose-us-heading | src/legacy-pages/index.html | Why Choose Us Section | Section heading | No | Why Choose Us |
| Home Page | whyChooseUs.features[0].title | #home-why-choose-us-feature-1-title | src/legacy-pages/index.html | Why Choose Us Section | Feature 1 title | No | Simple Process |
| Home Page | whyChooseUs.features[0].description | #home-why-choose-us-feature-1-description | src/legacy-pages/index.html | Why Choose Us Section | Feature 1 description | No | Apply easily online with minimal paperwork. |
| Home Page | whyChooseUs.features[1].title | #home-why-choose-us-feature-2-title | src/legacy-pages/index.html | Why Choose Us Section | Feature 2 title | No | Trusted by Thousands |
| Home Page | whyChooseUs.features[1].description | #home-why-choose-us-feature-2-description | src/legacy-pages/index.html | Why Choose Us Section | Feature 2 description | No | Thousands of happy customers rely on us. |
| Home Page | whyChooseUs.features[2].title | #home-why-choose-us-feature-3-title | src/legacy-pages/index.html | Why Choose Us Section | Feature 3 title | No | Transparent Terms |
| Home Page | whyChooseUs.features[2].description | #home-why-choose-us-feature-3-description | src/legacy-pages/index.html | Why Choose Us Section | Feature 3 description | No | No hidden fees, clear and honest pricing. |
| Home Page | readyToGetStarted.heading | #home-ready-to-get-started-heading | src/legacy-pages/index.html | Ready To Get Started Section | CTA heading | No | Ready to get started? |
| Home Page | readyToGetStarted.description | #home-ready-to-get-started-description | src/legacy-pages/index.html | Ready To Get Started Section | CTA description | No | Apply now and get the funds you need in no time. |
| Home Page | readyToGetStarted.applyButtonLabel | #home-ready-to-get-started-apply-label | src/legacy-pages/index.html | Ready To Get Started Section | Apply CTA label | No | APPLY NOW |
| Home Page | readyToGetStarted.whatsappButtonLabel | #home-ready-to-get-started-whatsapp-label | src/legacy-pages/index.html | Ready To Get Started Section | WhatsApp CTA label | No | WHATSAPP US |

## About Us Page

Current section order: Header, Hero Section, Who We Are Section, Why Choose Us
Section, Trust & Security Section, Who We Help Section, Ready To Get Started
Section, Footer.

| Payload Global | Field path | Stable frontend identifier | Frontend file | Frontend section | Visible element | Shared | Fallback value |
| --- | --- | --- | --- | --- | --- | --- | --- |
| About Us Page | seo.title | #about-us-seo-title | src/legacy-pages/about_us.html | Document metadata | HTML title | No | Page title |
| About Us Page | seo.description | #about-us-seo-description | src/legacy-pages/about_us.html | Document metadata | Meta description | No | Empty (not present in current HTML) |
| About Us Page | hero.backgroundImage | #about-us-hero-background-image | src/legacy-pages/about_us.html | Hero Section | Hero background image | No | https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80 |
| About Us Page | hero.mainHeading | #about-us-hero-main-heading | src/legacy-pages/about_us.html | Hero Section | Main heading | No | Lending you trust, building your future. |
| About Us Page | hero.description | #about-us-hero-description | src/legacy-pages/about_us.html | Hero Section | Hero description | No | We help individuals and businesses access fair, fast and transparent loan solutions-so you can focus on what matters most. |
| About Us Page | whoWeAre.image | #about-us-who-we-are-image | src/legacy-pages/about_us.html | Who We Are Section | Team image | No | https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80 |
| About Us Page | whoWeAre.heading | #about-us-who-we-are-heading | src/legacy-pages/about_us.html | Who We Are Section | Section heading | No | Who we are |
| About Us Page | whoWeAre.paragraphs[0] | #about-us-who-we-are-paragraph-1 | src/legacy-pages/about_us.html | Who We Are Section | First paragraph | No | Founded with a simple mission-to make borrowing simpler, smarter and more human-we've helped thousands of customers secure the funding they need with confidence. |
| About Us Page | whoWeAre.paragraphs[1] | #about-us-who-we-are-paragraph-2 | src/legacy-pages/about_us.html | Who We Are Section | Second paragraph | No | Our team of financial experts combines years of industry experience with modern technology to deliver loan services that are transparent, secure and tailored to your goals. |
| About Us Page | whoWeAre.statistics[0].value | #about-us-statistic-1-value | src/legacy-pages/about_us.html | Who We Are Section | Loans funded value | No | 15K+ |
| About Us Page | whoWeAre.statistics[0].label | #about-us-statistic-1-label | src/legacy-pages/about_us.html | Who We Are Section | Loans funded label | No | Loans funded |
| About Us Page | whoWeAre.statistics[1].value | #about-us-statistic-2-value | src/legacy-pages/about_us.html | Who We Are Section | Capital deployed value | No | $2B+ |
| About Us Page | whoWeAre.statistics[1].label | #about-us-statistic-2-label | src/legacy-pages/about_us.html | Who We Are Section | Capital deployed label | No | Capital deployed |
| About Us Page | whoWeAre.statistics[2].value | #about-us-statistic-3-value | src/legacy-pages/about_us.html | Who We Are Section | Satisfaction rate value | No | 98% |
| About Us Page | whoWeAre.statistics[2].label | #about-us-statistic-3-label | src/legacy-pages/about_us.html | Who We Are Section | Satisfaction rate label | No | Satisfaction rate |
| About Us Page | whyChooseUs.heading | #about-us-why-choose-us-heading | src/legacy-pages/about_us.html | Why Choose Us Section | Section heading | No | Why choose us |
| About Us Page | whyChooseUs.description | #about-us-why-choose-us-description | src/legacy-pages/about_us.html | Why Choose Us Section | Section description | No | We go beyond just approving loans. Here's what sets our service apart from the rest. |
| About Us Page | whyChooseUs.features[0].title | #about-us-why-choose-us-feature-1-title | src/legacy-pages/about_us.html | Why Choose Us Section | Feature 1 title | No | Fast approvals |
| About Us Page | whyChooseUs.features[0].description | #about-us-why-choose-us-feature-1-description | src/legacy-pages/about_us.html | Why Choose Us Section | Feature 1 description | No | Get a decision in minutes, not days. Our streamlined process means funds reach you faster. |
| About Us Page | whyChooseUs.features[1].title | #about-us-why-choose-us-feature-2-title | src/legacy-pages/about_us.html | Why Choose Us Section | Feature 2 title | No | Competitive rates |
| About Us Page | whyChooseUs.features[1].description | #about-us-why-choose-us-feature-2-description | src/legacy-pages/about_us.html | Why Choose Us Section | Feature 2 description | No | Transparent pricing with no hidden fees. You always know exactly what you'll pay. |
| About Us Page | whyChooseUs.features[2].title | #about-us-why-choose-us-feature-3-title | src/legacy-pages/about_us.html | Why Choose Us Section | Feature 3 title | No | Personalized service |
| About Us Page | whyChooseUs.features[2].description | #about-us-why-choose-us-feature-3-description | src/legacy-pages/about_us.html | Why Choose Us Section | Feature 3 description | No | Real people, real support. Our advisors guide you through every step of the journey. |
| About Us Page | whyChooseUs.features[3].title | #about-us-why-choose-us-feature-4-title | src/legacy-pages/about_us.html | Why Choose Us Section | Feature 4 title | No | Flexible terms |
| About Us Page | whyChooseUs.features[3].description | #about-us-why-choose-us-feature-4-description | src/legacy-pages/about_us.html | Why Choose Us Section | Feature 4 description | No | Choose repayment plans that fit your budget and lifestyle, not the other way around. |
| About Us Page | whyChooseUs.features[4].title | #about-us-why-choose-us-feature-5-title | src/legacy-pages/about_us.html | Why Choose Us Section | Feature 5 title | No | 100% online |
| About Us Page | whyChooseUs.features[4].description | #about-us-why-choose-us-feature-5-description | src/legacy-pages/about_us.html | Why Choose Us Section | Feature 5 description | No | Apply, track and manage your loan entirely from your phone or computer-anytime. |
| About Us Page | whyChooseUs.features[5].title | #about-us-why-choose-us-feature-6-title | src/legacy-pages/about_us.html | Why Choose Us Section | Feature 6 title | No | Trusted reputation |
| About Us Page | whyChooseUs.features[5].description | #about-us-why-choose-us-feature-6-description | src/legacy-pages/about_us.html | Why Choose Us Section | Feature 6 description | No | Thousands of happy customers and top industry ratings back our commitment to you. |
| About Us Page | trustAndSecurity.heading | #about-us-trust-and-security-heading | src/legacy-pages/about_us.html | Trust & Security Section | Section heading | No | Trust & security |
| About Us Page | trustAndSecurity.description | #about-us-trust-and-security-description | src/legacy-pages/about_us.html | Trust & Security Section | Section description | No | Your data and money are protected by industry-leading standards. We treat your security as seriously as you do. |
| About Us Page | trustAndSecurity.items[0].title | #about-us-trust-and-security-item-1-title | src/legacy-pages/about_us.html | Trust & Security Section | Item 1 title | No | Bank-level encryption |
| About Us Page | trustAndSecurity.items[0].description | #about-us-trust-and-security-item-1-description | src/legacy-pages/about_us.html | Trust & Security Section | Item 1 description | No | 256-bit SSL encryption keeps every transaction safe. |
| About Us Page | trustAndSecurity.items[1].title | #about-us-trust-and-security-item-2-title | src/legacy-pages/about_us.html | Trust & Security Section | Item 2 title | No | Fully licensed & regulated |
| About Us Page | trustAndSecurity.items[1].description | #about-us-trust-and-security-item-2-description | src/legacy-pages/about_us.html | Trust & Security Section | Item 2 description | No | We operate in full compliance with financial authorities. |
| About Us Page | trustAndSecurity.items[2].title | #about-us-trust-and-security-item-3-title | src/legacy-pages/about_us.html | Trust & Security Section | Item 3 title | No | Privacy first |
| About Us Page | trustAndSecurity.items[2].description | #about-us-trust-and-security-item-3-description | src/legacy-pages/about_us.html | Trust & Security Section | Item 3 description | No | Your personal information is never sold or shared without consent. |
| About Us Page | trustAndSecurity.image | #about-us-trust-and-security-image | src/legacy-pages/about_us.html | Trust & Security Section | Security image | No | https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80 |
| About Us Page | whoWeHelp.heading | #about-us-who-we-help-heading | src/legacy-pages/about_us.html | Who We Help Section | Section heading | No | Who we help |
| About Us Page | whoWeHelp.description | #about-us-who-we-help-description | src/legacy-pages/about_us.html | Who We Help Section | Section description | No | Whatever your goal, we have a loan solution designed for you. |
| About Us Page | whoWeHelp.cards[0].image | #about-us-who-we-help-card-1-image | src/legacy-pages/about_us.html | Who We Help Section | Home buyers image | No | https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80 |
| About Us Page | whoWeHelp.cards[0].title | #about-us-who-we-help-card-1-title | src/legacy-pages/about_us.html | Who We Help Section | Home buyers title | No | Home buyers |
| About Us Page | whoWeHelp.cards[0].description | #about-us-who-we-help-card-1-description | src/legacy-pages/about_us.html | Who We Help Section | Home buyers description | No | Affordable mortgages to help you own your dream home. |
| About Us Page | whoWeHelp.cards[1].image | #about-us-who-we-help-card-2-image | src/legacy-pages/about_us.html | Who We Help Section | Small businesses image | No | https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80 |
| About Us Page | whoWeHelp.cards[1].title | #about-us-who-we-help-card-2-title | src/legacy-pages/about_us.html | Who We Help Section | Small businesses title | No | Small businesses |
| About Us Page | whoWeHelp.cards[1].description | #about-us-who-we-help-card-2-description | src/legacy-pages/about_us.html | Who We Help Section | Small businesses description | No | Working capital and growth funding for entrepreneurs. |
| About Us Page | whoWeHelp.cards[2].image | #about-us-who-we-help-card-3-image | src/legacy-pages/about_us.html | Who We Help Section | Individuals image | No | https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80 |
| About Us Page | whoWeHelp.cards[2].title | #about-us-who-we-help-card-3-title | src/legacy-pages/about_us.html | Who We Help Section | Individuals title | No | Individuals |
| About Us Page | whoWeHelp.cards[2].description | #about-us-who-we-help-card-3-description | src/legacy-pages/about_us.html | Who We Help Section | Individuals description | No | Personal loans for life's planned and unexpected moments. |
| About Us Page | whoWeHelp.cards[3].image | #about-us-who-we-help-card-4-image | src/legacy-pages/about_us.html | Who We Help Section | Students image | No | https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80 |
| About Us Page | whoWeHelp.cards[3].title | #about-us-who-we-help-card-4-title | src/legacy-pages/about_us.html | Who We Help Section | Students title | No | Students |
| About Us Page | whoWeHelp.cards[3].description | #about-us-who-we-help-card-4-description | src/legacy-pages/about_us.html | Who We Help Section | Students description | No | Education financing to invest in your future career. |
| About Us Page | readyToGetStarted.heading | #about-us-ready-to-get-started-heading | src/legacy-pages/about_us.html | Ready To Get Started Section | CTA heading | No | Ready to get started? |
| About Us Page | readyToGetStarted.description | #about-us-ready-to-get-started-description | src/legacy-pages/about_us.html | Ready To Get Started Section | CTA description | No | Join thousands of satisfied customers who trust us with their financial goals. Apply today and get a decision in minutes. |
| About Us Page | readyToGetStarted.applyButtonLabel | #about-us-ready-to-get-started-apply-label | src/legacy-pages/about_us.html | Ready To Get Started Section | Apply CTA label | No | Apply now |
| About Us Page | readyToGetStarted.advisorButtonLabel | #about-us-ready-to-get-started-advisor-label | src/legacy-pages/about_us.html | Ready To Get Started Section | Advisor CTA label | No | Talk to an advisor |

## Loan Page

Current section order: Header, Hero Section, Personal Loan Section, Business Loan
Section, Loan Comparison Section, Interest Rates & Repayment Section (including the
fixed calculator), Footer. Calculator inputs and results remain frontend logic.

| Payload Global | Field path | Stable frontend identifier | Frontend file | Frontend section | Visible element | Shared | Fallback value |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Loan Page | seo.title | #loan-seo-title | src/legacy-pages/loan.html | Document metadata | HTML title | No | Page title |
| Loan Page | seo.description | #loan-seo-description | src/legacy-pages/loan.html | Document metadata | Meta description | No | Empty (not present in current HTML) |
| Loan Page | hero.mainHeading | #loan-hero-main-heading | src/legacy-pages/loan.html | Hero Section | Main heading | No | The Future of Green Energy |
| Loan Page | hero.description | #loan-hero-description | src/legacy-pages/loan.html | Hero Section | Hero description | No | Our commitment to green energy is paving the way for a cleaner, healthier planet. Join us on a journey towards a future where clean, renewable energy sources transform the way we power our lives. |
| Loan Page | hero.primaryButtonLabel | #loan-hero-primary-button-label | src/legacy-pages/loan.html | Hero Section | Primary CTA label | No | See our solutions |
| Loan Page | hero.secondaryButtonLabel | #loan-hero-secondary-button-label | src/legacy-pages/loan.html | Hero Section | Secondary CTA label | No | Get in touch |
| Loan Page | hero.image | #loan-hero-image | src/legacy-pages/loan.html | Hero Section | Hero image | No | flow-assets/headers/image-hero-1.png |
| Loan Page | personalLoan.heading | #loan-personal-heading | src/legacy-pages/loan.html | Personal Loan Section | Section heading | No | Personal Loan |
| Loan Page | personalLoan.description | #loan-personal-description | src/legacy-pages/loan.html | Personal Loan Section | Section description | No | Flexible financing for big expenses, debt consolidation, short-term cash needs, or personal projects with a clear monthly repayment plan. |
| Loan Page | personalLoan.applyButtonLabel | #loan-personal-apply-label | src/legacy-pages/loan.html | Personal Loan Section | Apply CTA label | No | Apply now |
| Loan Page | personalLoan.whatsappButtonLabel | #loan-personal-whatsapp-label | src/legacy-pages/loan.html | Personal Loan Section | WhatsApp CTA label | No | WhatsApp us |
| Loan Page | personalLoan.features[0].image | #loan-personal-feature-1-image | src/legacy-pages/loan.html | Personal Loan Section | Loan amount feature image | No | https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80 |
| Loan Page | personalLoan.features[0].title | #loan-personal-feature-1-title | src/legacy-pages/loan.html | Personal Loan Section | Loan amount feature title | No | Loan from RM500 to RM100,000 |
| Loan Page | personalLoan.features[0].description | #loan-personal-feature-1-description | src/legacy-pages/loan.html | Personal Loan Section | Loan amount feature description | No | Available for applicants with a minimum monthly salary of RM3,000 and a steady source of income. |
| Loan Page | personalLoan.features[1].image | #loan-personal-feature-2-image | src/legacy-pages/loan.html | Personal Loan Section | Repayment feature image | No | https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80 |
| Loan Page | personalLoan.features[1].title | #loan-personal-feature-2-title | src/legacy-pages/loan.html | Personal Loan Section | Repayment feature title | No | Monthly repayment plan |
| Loan Page | personalLoan.features[1].description | #loan-personal-feature-2-description | src/legacy-pages/loan.html | Personal Loan Section | Repayment feature description | No | Suitable for personal expenses, big purchases, debt consolidation, or short-term cash needs. |
| Loan Page | personalLoan.requirements.image | #loan-personal-requirements-image | src/legacy-pages/loan.html | Personal Loan Section | Requirements image | No | https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=600&q=80 |
| Loan Page | personalLoan.requirements.heading | #loan-personal-requirements-heading | src/legacy-pages/loan.html | Personal Loan Section | Requirements heading | No | Required documents |
| Loan Page | personalLoan.requirements.items[0] | #loan-personal-requirement-1 | src/legacy-pages/loan.html | Personal Loan Section | Requirement 1 | No | NRIC and contact number |
| Loan Page | personalLoan.requirements.items[1] | #loan-personal-requirement-2 | src/legacy-pages/loan.html | Personal Loan Section | Requirement 2 | No | Latest 3 months payslip and bank statement |
| Loan Page | personalLoan.requirements.items[2] | #loan-personal-requirement-3 | src/legacy-pages/loan.html | Personal Loan Section | Requirement 3 | No | Utility bill, S&P, tenancy agreement, and EPF statement |
| Loan Page | businessLoan.heading | #loan-business-heading | src/legacy-pages/loan.html | Business Loan Section | Section heading | No | Business Loan |
| Loan Page | businessLoan.description | #loan-business-description | src/legacy-pages/loan.html | Business Loan Section | Section description | No | Take your business further with flexible loan tenures, high financing margins, and funding for working capital, stock, overheads, or business activities. |
| Loan Page | businessLoan.applyButtonLabel | #loan-business-apply-label | src/legacy-pages/loan.html | Business Loan Section | Apply CTA label | No | Apply now |
| Loan Page | businessLoan.whatsappButtonLabel | #loan-business-whatsapp-label | src/legacy-pages/loan.html | Business Loan Section | WhatsApp CTA label | No | WhatsApp us |
| Loan Page | businessLoan.features[0].image | #loan-business-feature-1-image | src/legacy-pages/loan.html | Business Loan Section | Working capital feature image | No | https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80 |
| Loan Page | businessLoan.features[0].title | #loan-business-feature-1-title | src/legacy-pages/loan.html | Business Loan Section | Working capital feature title | No | Working capital support |
| Loan Page | businessLoan.features[0].description | #loan-business-feature-1-description | src/legacy-pages/loan.html | Business Loan Section | Working capital feature description | No | Support cash flow, daily operations, stock purchases, overheads, and other working capital needs. |
| Loan Page | businessLoan.features[1].image | #loan-business-feature-2-image | src/legacy-pages/loan.html | Business Loan Section | Flexible funding feature image | No | https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=600&q=80 |
| Loan Page | businessLoan.features[1].title | #loan-business-feature-2-title | src/legacy-pages/loan.html | Business Loan Section | Flexible funding feature title | No | Flexible business funding |
| Loan Page | businessLoan.features[1].description | #loan-business-feature-2-description | src/legacy-pages/loan.html | Business Loan Section | Flexible funding feature description | No | Suitable for small businesses and corporate groups that need practical financing solutions. |
| Loan Page | businessLoan.requirements.image | #loan-business-requirements-image | src/legacy-pages/loan.html | Business Loan Section | Requirements image | No | https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80 |
| Loan Page | businessLoan.requirements.heading | #loan-business-requirements-heading | src/legacy-pages/loan.html | Business Loan Section | Requirements heading | No | Required documents |
| Loan Page | businessLoan.requirements.items[0] | #loan-business-requirement-1 | src/legacy-pages/loan.html | Business Loan Section | Requirement 1 | No | NRIC copy and name card |
| Loan Page | businessLoan.requirements.items[1] | #loan-business-requirement-2 | src/legacy-pages/loan.html | Business Loan Section | Requirement 2 | No | Borang B and Borang D |
| Loan Page | businessLoan.requirements.items[2] | #loan-business-requirement-3 | src/legacy-pages/loan.html | Business Loan Section | Requirement 3 | No | Latest 3 months bank statement |
| Loan Page | businessLoan.requirements.items[3] | #loan-business-requirement-4 | src/legacy-pages/loan.html | Business Loan Section | Requirement 4 | No | S&P and latest electric & water bill |
| Loan Page | businessLoan.requirements.items[4] | #loan-business-requirement-5 | src/legacy-pages/loan.html | Business Loan Section | Requirement 5 | No | Form 24/49, 42, 11A and latest EPF statement |
| Loan Page | comparison.heading | #loan-comparison-heading | src/legacy-pages/loan.html | Loan Comparison Section | Section heading | No | Loan Comparison |
| Loan Page | comparison.description | #loan-comparison-description | src/legacy-pages/loan.html | Loan Comparison Section | Section description | No | Compare personal and business loan options so you can choose the financing that fits your needs. |
| Loan Page | comparison.tableHeading | #loan-comparison-table-heading | src/legacy-pages/loan.html | Loan Comparison Section | Table heading | No | Compare loan types |
| Loan Page | comparison.personalColumn.title | #loan-comparison-personal-title | src/legacy-pages/loan.html | Loan Comparison Section | Personal column title | No | Personal Loan |
| Loan Page | comparison.personalColumn.subtitle | #loan-comparison-personal-subtitle | src/legacy-pages/loan.html | Loan Comparison Section | Personal column subtitle | No | For individual needs |
| Loan Page | comparison.businessColumn.title | #loan-comparison-business-title | src/legacy-pages/loan.html | Loan Comparison Section | Business column title | No | Business Loan |
| Loan Page | comparison.businessColumn.subtitle | #loan-comparison-business-subtitle | src/legacy-pages/loan.html | Loan Comparison Section | Business column subtitle | No | For company growth |
| Loan Page | comparison.rows[0].label | #loan-comparison-row-1-label | src/legacy-pages/loan.html | Loan Comparison Section | Best for row label | No | Best for |
| Loan Page | comparison.rows[0].personalValue | #loan-comparison-row-1-personal | src/legacy-pages/loan.html | Loan Comparison Section | Personal best-for value | No | Personal expenses, emergencies, education, or home needs |
| Loan Page | comparison.rows[0].businessValue | #loan-comparison-row-1-business | src/legacy-pages/loan.html | Loan Comparison Section | Business best-for value | No | Working capital, equipment, inventory, or business expansion |
| Loan Page | comparison.rows[1].label | #loan-comparison-row-2-label | src/legacy-pages/loan.html | Loan Comparison Section | Indicative rate row label | No | Indicative rate |
| Loan Page | comparison.rows[1].personalValue | #loan-comparison-row-2-personal | src/legacy-pages/loan.html | Loan Comparison Section | Personal rate value | No | From 6.5% p.a. |
| Loan Page | comparison.rows[1].businessValue | #loan-comparison-row-2-business | src/legacy-pages/loan.html | Loan Comparison Section | Business rate value | No | From 8.0% p.a. |
| Loan Page | comparison.rows[2].label | #loan-comparison-row-3-label | src/legacy-pages/loan.html | Loan Comparison Section | Loan amount row label | No | Loan amount |
| Loan Page | comparison.rows[2].personalValue | #loan-comparison-row-3-personal | src/legacy-pages/loan.html | Loan Comparison Section | Personal amount value | No | Smaller to medium financing needs |
| Loan Page | comparison.rows[2].businessValue | #loan-comparison-row-3-business | src/legacy-pages/loan.html | Loan Comparison Section | Business amount value | No | Higher limits based on business profile |
| Loan Page | comparison.rows[3].label | #loan-comparison-row-4-label | src/legacy-pages/loan.html | Loan Comparison Section | Repayment tenure row label | No | Repayment tenure |
| Loan Page | comparison.rows[3].personalValue | #loan-comparison-row-4-personal | src/legacy-pages/loan.html | Loan Comparison Section | Personal tenure value | No | Flexible monthly installments |
| Loan Page | comparison.rows[3].businessValue | #loan-comparison-row-4-business | src/legacy-pages/loan.html | Loan Comparison Section | Business tenure value | No | Structured around business cash flow |
| Loan Page | comparison.rows[4].label | #loan-comparison-row-5-label | src/legacy-pages/loan.html | Loan Comparison Section | Documents row label | No | Documents |
| Loan Page | comparison.rows[4].personalValue | #loan-comparison-row-5-personal | src/legacy-pages/loan.html | Loan Comparison Section | Personal documents value | No | Identity, income, and bank details |
| Loan Page | comparison.rows[4].businessValue | #loan-comparison-row-5-business | src/legacy-pages/loan.html | Loan Comparison Section | Business documents value | No | Business registration, bank statements, and company financials |
| Loan Page | comparison.rows[5].label | #loan-comparison-row-6-label | src/legacy-pages/loan.html | Loan Comparison Section | Approval focus row label | No | Approval focus |
| Loan Page | comparison.rows[5].personalValue | #loan-comparison-row-6-personal | src/legacy-pages/loan.html | Loan Comparison Section | Personal approval value | No | Personal income and repayment ability |
| Loan Page | comparison.rows[5].businessValue | #loan-comparison-row-6-business | src/legacy-pages/loan.html | Loan Comparison Section | Business approval value | No | Business revenue, operations, and cash flow |
| Loan Page | comparison.rows[6].label | #loan-comparison-row-7-label | src/legacy-pages/loan.html | Loan Comparison Section | Support row label | No | Support |
| Loan Page | comparison.rows[6].personalValue | #loan-comparison-row-7-personal | src/legacy-pages/loan.html | Loan Comparison Section | Personal support value | No | Guided application assistance |
| Loan Page | comparison.rows[6].businessValue | #loan-comparison-row-7-business | src/legacy-pages/loan.html | Loan Comparison Section | Business support value | No | Guided application assistance for business documents |
| Loan Page | comparison.loanDetailsHeading | #loan-comparison-loan-details-heading | src/legacy-pages/loan.html | Loan Comparison Section | Loan details group heading | No | Loan details |
| Loan Page | comparison.applicationNeedsHeading | #loan-comparison-application-needs-heading | src/legacy-pages/loan.html | Loan Comparison Section | Application needs group heading | No | Application needs |
| Loan Page | interestRates.heading | #loan-interest-rates-heading | src/legacy-pages/loan.html | Interest Rates & Repayment Section | Section heading | No | Interest Rates & Repayment |
| Loan Page | interestRates.description | #loan-interest-rates-description | src/legacy-pages/loan.html | Interest Rates & Repayment Section | Section description | No | Transparent pricing with flexible repayment options designed to fit your budget. |
| Loan Page | interestRates.features[0].title | #loan-interest-rates-feature-1-title | src/legacy-pages/loan.html | Interest Rates & Repayment Section | Feature 1 title | No | Competitive Rates |
| Loan Page | interestRates.features[0].description | #loan-interest-rates-feature-1-description | src/legacy-pages/loan.html | Interest Rates & Repayment Section | Feature 1 description | No | Personal loans from 6.5% p.a. and business loans from 8.0% p.a. |
| Loan Page | interestRates.features[1].title | #loan-interest-rates-feature-2-title | src/legacy-pages/loan.html | Interest Rates & Repayment Section | Feature 2 title | No | Flexible Repayment |
| Loan Page | interestRates.features[1].description | #loan-interest-rates-feature-2-description | src/legacy-pages/loan.html | Interest Rates & Repayment Section | Feature 2 description | No | Choose monthly installments that suit your cash flow, with no hidden fees or surprises. |
| Loan Page | interestRates.features[2].title | #loan-interest-rates-feature-3-title | src/legacy-pages/loan.html | Interest Rates & Repayment Section | Feature 3 title | No | Early Settlement |
| Loan Page | interestRates.features[2].description | #loan-interest-rates-feature-3-description | src/legacy-pages/loan.html | Interest Rates & Repayment Section | Feature 3 description | No | Pay off your loan early and save on interest with low or zero prepayment penalties. |
| Loan Page | estimator.heading | #loan-estimator-heading | src/legacy-pages/loan.html | Interest Rates & Repayment Section | Calculator heading | No | Estimate Your Monthly Repayment |
| Loan Page | estimator.disclaimer | #loan-estimator-disclaimer | src/legacy-pages/loan.html | Interest Rates & Repayment Section | Calculator disclaimer | No | *Estimates only. Actual rates and terms may vary upon approval. |

## How To Apply Page

Current section order: Header, Hero Section, Step-by-Step Process, Required
Documents, Eligibility Requirements, Ready To Apply (appointment form), Footer.

| Payload Global | Field path | Stable frontend identifier | Frontend file | Frontend section | Visible element | Shared | Fallback value |
| --- | --- | --- | --- | --- | --- | --- | --- |
| How To Apply Page | seo.title | #how-to-apply-seo-title | src/legacy-pages/how_to_apply.html | Document metadata | HTML title | No | Page title |
| How To Apply Page | seo.description | #how-to-apply-seo-description | src/legacy-pages/how_to_apply.html | Document metadata | Meta description | No | Empty (not present in current HTML) |
| How To Apply Page | hero.mainHeading | #how-to-apply-hero-main-heading | src/legacy-pages/how_to_apply.html | Hero Section | Main heading | No | Get Your Loan in Simple Steps |
| How To Apply Page | hero.description | #how-to-apply-hero-description | src/legacy-pages/how_to_apply.html | Hero Section | Hero description | No | Applying for a loan with us is fast and hassle-free. Follow our easy guide below to complete your application and get the funds you need. |
| How To Apply Page | hero.primaryButtonLabel | #how-to-apply-hero-primary-button-label | src/legacy-pages/how_to_apply.html | Hero Section | Primary CTA label | No | Start Your Application |
| How To Apply Page | steps.heading | #how-to-apply-steps-heading | src/legacy-pages/how_to_apply.html | Step-by-Step Process | Section heading | No | Step-by-Step Process |
| How To Apply Page | steps.description | #how-to-apply-steps-description | src/legacy-pages/how_to_apply.html | Step-by-Step Process | Section description | No | A clear and simple path from application to approval. |
| How To Apply Page | steps.items[0].title | #how-to-apply-step-1-title | src/legacy-pages/how_to_apply.html | Step-by-Step Process | Step 1 title | No | Choose Your Loan |
| How To Apply Page | steps.items[0].description | #how-to-apply-step-1-description | src/legacy-pages/how_to_apply.html | Step-by-Step Process | Step 1 description | No | Select the loan option that best fits your needs and budget from our range of services. |
| How To Apply Page | steps.items[1].title | #how-to-apply-step-2-title | src/legacy-pages/how_to_apply.html | Step-by-Step Process | Step 2 title | No | Submit Documents |
| How To Apply Page | steps.items[1].description | #how-to-apply-step-2-description | src/legacy-pages/how_to_apply.html | Step-by-Step Process | Step 2 description | No | Prepare and upload the required documents listed below to verify your eligibility. |
| How To Apply Page | steps.items[2].title | #how-to-apply-step-3-title | src/legacy-pages/how_to_apply.html | Step-by-Step Process | Step 3 title | No | Get Reviewed |
| How To Apply Page | steps.items[2].description | #how-to-apply-step-3-description | src/legacy-pages/how_to_apply.html | Step-by-Step Process | Step 3 description | No | Our team reviews your application quickly and contacts you for any clarifications. |
| How To Apply Page | steps.items[3].title | #how-to-apply-step-4-title | src/legacy-pages/how_to_apply.html | Step-by-Step Process | Step 4 title | No | Receive Funds |
| How To Apply Page | steps.items[3].description | #how-to-apply-step-4-description | src/legacy-pages/how_to_apply.html | Step-by-Step Process | Step 4 description | No | Once approved, your loan amount is disbursed directly to your account. |
| How To Apply Page | requiredDocuments.image | #how-to-apply-required-documents-image | src/legacy-pages/how_to_apply.html | Required Documents | Section image | No | https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80 |
| How To Apply Page | requiredDocuments.heading | #how-to-apply-required-documents-heading | src/legacy-pages/how_to_apply.html | Required Documents | Section heading | No | Required Documents |
| How To Apply Page | requiredDocuments.description | #how-to-apply-required-documents-description | src/legacy-pages/how_to_apply.html | Required Documents | Section description | No | Have these documents ready before you apply to ensure a smooth and speedy process. |
| How To Apply Page | requiredDocuments.items[0].title | #how-to-apply-document-1-title | src/legacy-pages/how_to_apply.html | Required Documents | Document 1 title | No | Valid Government ID |
| How To Apply Page | requiredDocuments.items[0].description | #how-to-apply-document-1-description | src/legacy-pages/how_to_apply.html | Required Documents | Document 1 description | No | Passport, driver's license, or national ID card. |
| How To Apply Page | requiredDocuments.items[1].title | #how-to-apply-document-2-title | src/legacy-pages/how_to_apply.html | Required Documents | Document 2 title | No | Proof of Income |
| How To Apply Page | requiredDocuments.items[1].description | #how-to-apply-document-2-description | src/legacy-pages/how_to_apply.html | Required Documents | Document 2 description | No | Recent payslips, bank statements, or tax returns. |
| How To Apply Page | requiredDocuments.items[2].title | #how-to-apply-document-3-title | src/legacy-pages/how_to_apply.html | Required Documents | Document 3 title | No | Proof of Address |
| How To Apply Page | requiredDocuments.items[2].description | #how-to-apply-document-3-description | src/legacy-pages/how_to_apply.html | Required Documents | Document 3 description | No | Utility bill or lease agreement dated within 3 months. |
| How To Apply Page | requiredDocuments.items[3].title | #how-to-apply-document-4-title | src/legacy-pages/how_to_apply.html | Required Documents | Document 4 title | No | Bank Account Details |
| How To Apply Page | requiredDocuments.items[3].description | #how-to-apply-document-4-description | src/legacy-pages/how_to_apply.html | Required Documents | Document 4 description | No | Active bank account for loan disbursement. |
| How To Apply Page | eligibility.heading | #how-to-apply-eligibility-heading | src/legacy-pages/how_to_apply.html | Eligibility Requirements | Section heading | No | Eligibility Requirements |
| How To Apply Page | eligibility.description | #how-to-apply-eligibility-description | src/legacy-pages/how_to_apply.html | Eligibility Requirements | Section description | No | Make sure you meet these basic requirements before you apply. |
| How To Apply Page | eligibility.items[0] | #how-to-apply-eligibility-1 | src/legacy-pages/how_to_apply.html | Eligibility Requirements | Requirement 1 | No | You must be at least 18 years old. |
| How To Apply Page | eligibility.items[1] | #how-to-apply-eligibility-2 | src/legacy-pages/how_to_apply.html | Eligibility Requirements | Requirement 2 | No | Have a stable and verifiable source of income. |
| How To Apply Page | eligibility.items[2] | #how-to-apply-eligibility-3 | src/legacy-pages/how_to_apply.html | Eligibility Requirements | Requirement 3 | No | Be a resident or citizen with valid documents. |
| How To Apply Page | eligibility.items[3] | #how-to-apply-eligibility-4 | src/legacy-pages/how_to_apply.html | Eligibility Requirements | Requirement 4 | No | Maintain an active bank account. |
| How To Apply Page | readyToApply.heading | #how-to-apply-ready-heading | src/legacy-pages/how_to_apply.html | Ready To Apply | Section heading | No | Ready to Apply? |
| How To Apply Page | readyToApply.description | #how-to-apply-ready-description | src/legacy-pages/how_to_apply.html | Ready To Apply | Section description | No | Fill out the quick form below or chat with us instantly on WhatsApp to get started right away. |
| How To Apply Page | readyToApply.whatsappButtonLabel | #how-to-apply-ready-whatsapp-label | src/legacy-pages/how_to_apply.html | Ready To Apply | WhatsApp CTA label | No | Chat on WhatsApp |
| How To Apply Page | readyToApply.submitButtonLabel | #how-to-apply-ready-submit-label | src/legacy-pages/how_to_apply.html | Ready To Apply | Appointment submit label | No | SUBMIT APPLICATION |

## Contact Us Page

Current section order: Header, Contact Us and Appointment Form, Contact Details,
FAQ, Still Have Questions CTA, Footer.

| Payload Global | Field path | Stable frontend identifier | Frontend file | Frontend section | Visible element | Shared | Fallback value |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Contact Us Page | seo.title | #contact-seo-title | src/legacy-pages/contact.html | Document metadata | HTML title | No | Page title |
| Contact Us Page | seo.description | #contact-seo-description | src/legacy-pages/contact.html | Document metadata | Meta description | No | Empty (not present in current HTML) |
| Contact Us Page | contactForm.heading | #contact-form-heading | src/legacy-pages/contact.html | Contact Us and Appointment Form | Main heading | No | Contact us |
| Contact Us Page | contactForm.description | #contact-form-description | src/legacy-pages/contact.html | Contact Us and Appointment Form | Intro paragraph | No | Contact Metro Pinjaman Berlesen for personal and business loan enquiries. Our team is ready to assist you 24/7. |
| Contact Us Page | contactForm.submitButtonLabel | #contact-form-submit-label | src/legacy-pages/contact.html | Contact Us and Appointment Form | Appointment submit label | No | Submit |
| Contact Us Page | contactForm.image | #contact-form-image | src/legacy-pages/contact.html | Contact Us and Appointment Form | Contact image | No | flow-assets/contact/photo-1.png |
| Contact Us Page | contactMethods.email.heading | #contact-method-email-heading | src/legacy-pages/contact.html | Contact Details | Email card heading | No | Email |
| Contact Us Page | contactMethods.email.description | #contact-method-email-description | src/legacy-pages/contact.html | Contact Details | Email card description | No | Email us for loan enquiries and application support. |
| Contact Us Page | contactMethods.phone.heading | #contact-method-phone-heading | src/legacy-pages/contact.html | Contact Details | Phone card heading | No | Phone |
| Contact Us Page | contactMethods.phone.description | #contact-method-phone-description | src/legacy-pages/contact.html | Contact Details | Phone card description | No | We are open 24 hours and 7 days a week |
| Contact Us Page | contactMethods.office.heading | #contact-method-office-heading | src/legacy-pages/contact.html | Contact Details | Office card heading | No | HQ Office |
| Contact Us Page | contactMethods.office.description | #contact-method-office-description | src/legacy-pages/contact.html | Contact Details | Office card description | No | Visit us at our office |
| Contact Us Page | faq.heading | #contact-faq-heading | src/legacy-pages/contact.html | FAQ Section | Section heading | No | FAQ |
| Contact Us Page | faq.description | #contact-faq-description | src/legacy-pages/contact.html | FAQ Section | Section description | No | Here you will find the answers to the frequently asked questions. |
| Contact Us Page | faq.items[0].question | #contact-faq-1-question | src/legacy-pages/contact.html | FAQ Section | First FAQ question | No | What loan services do you offer? |
| Contact Us Page | faq.items[0].answer | #contact-faq-1-answer | src/legacy-pages/contact.html | FAQ Section | First FAQ answer | No | Metro Pinjaman Berlesen offers personal loans and business loans with flexible repayment options. |
| Contact Us Page | faq.items[1].question | #contact-faq-2-question | src/legacy-pages/contact.html | FAQ Section | Second FAQ question | No | How fast can I receive the money? |
| Contact Us Page | faq.items[1].answer | #contact-faq-2-answer | src/legacy-pages/contact.html | FAQ Section | Second FAQ answer | No | Once your application is approved, you can receive your cash by bank transfer within 10 minutes. |
| Contact Us Page | faq.items[2].question | #contact-faq-3-question | src/legacy-pages/contact.html | FAQ Section | Third FAQ question | No | Who can apply? |
| Contact Us Page | faq.items[2].answer | #contact-faq-3-answer | src/legacy-pages/contact.html | FAQ Section | Third FAQ answer | No | The service is open to Malaysians. Personal loan applicants should have a source of income and a minimum monthly salary of RM3000. |
| Contact Us Page | faq.items[3].question | #contact-faq-4-question | src/legacy-pages/contact.html | FAQ Section | Fourth FAQ question | No | Do I need to provide my ATM card or a guarantor? |
| Contact Us Page | faq.items[3].answer | #contact-faq-4-answer | src/legacy-pages/contact.html | FAQ Section | Fourth FAQ answer | No | No. Metro Pinjaman Berlesen does not require your ATM card or a guarantor for your loan application. |
| Contact Us Page | faq.items[4].question | #contact-faq-5-question | src/legacy-pages/contact.html | FAQ Section | Fifth FAQ question | No | What documents do I need? |
| Contact Us Page | faq.items[4].answer | #contact-faq-5-answer | src/legacy-pages/contact.html | FAQ Section | Fifth FAQ answer | No | Required documents may include NRIC, contact number, latest 3 months pay slip, latest 3 months bank statement, latest utility bills, EPF statement, S&P, or tenancy agreement. |
| Contact Us Page | stillHaveQuestions.heading | #contact-still-have-questions-heading | src/legacy-pages/contact.html | Still Have Questions CTA | CTA heading | No | Still have questions? |
| Contact Us Page | stillHaveQuestions.description | #contact-still-have-questions-description | src/legacy-pages/contact.html | Still Have Questions CTA | CTA description | No | For assistance, please visit our Contact Us page or contact us on WhatsApp at +60 11-7007 3191. Our team is ready to help with your loan enquiry and application. |

## Maintenance Rules

- Add a mapping row, default value, Payload schema field, stable identifier, and
  focused test together for every future editable element.
- Preserve existing identifiers and field paths when moving markup. If a rename or
  removal is unavoidable, migrate the stored Payload value before deleting the old
  field.
- Never expose draft values through the public content endpoint. Never use a
  deployed content edit to alter GitHub source.
