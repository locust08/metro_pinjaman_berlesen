export type SitePageId = 'home' | 'aboutUs' | 'loan' | 'howToApply' | 'contactUs';

export type ImageValue = { src: string; alt: string };
export type LabeledText = { title: string; description: string };

export type PublicPayloadContent = {
  siteSettings: {
    header: { websiteLogo: ImageValue; mobileDrawerLogo: ImageValue; aboutUsMenuLabel: string; loanMenuLabel: string; howToApplyMenuLabel: string; contactUsMenuLabel: string; applyNowButtonLabel: string; loginButtonLabel: string; newsletterLabel: string; };
    footer: { footerLogo: ImageValue; pagesColumnHeading: string; homeLinkLabel: string; aboutUsLinkLabel: string; loanLinkLabel: string; helpColumnHeading: string; howToApplyLinkLabel: string; contactUsLinkLabel: string; copyrightText: string; };
    contactDetails: { supportEmail: string; displayPhoneNumber: string; officeName: string; officeAddress: string; wazeUrl: string; googleMapsUrl: string; };
  };
  homePage: Record<string, unknown>; aboutUsPage: Record<string, unknown>; loanPage: Record<string, unknown>; howToApplyPage: Record<string, unknown>; contactUsPage: Record<string, unknown>;
};

export const defaultPayloadContent: PublicPayloadContent = {
  "siteSettings": {
    "header": {
      "websiteLogo": {
        "src": "flow-assets/logos/flow-logo.svg",
        "alt": ""
      },
      "mobileDrawerLogo": {
        "src": "flow-assets/logos/sign-logo-flow.svg",
        "alt": ""
      },
      "aboutUsMenuLabel": "About us",
      "loanMenuLabel": "Loan",
      "howToApplyMenuLabel": "How to apply",
      "contactUsMenuLabel": "Contact us",
      "applyNowButtonLabel": "Apply now",
      "loginButtonLabel": "Login",
      "newsletterLabel": "Newsletter"
    },
    "footer": {
      "footerLogo": {
        "src": "flow-assets/logos/flow-logo.svg",
        "alt": ""
      },
      "pagesColumnHeading": "Pages",
      "homeLinkLabel": "Home",
      "aboutUsLinkLabel": "About us",
      "loanLinkLabel": "Loan",
      "helpColumnHeading": "Help",
      "howToApplyLinkLabel": "How to apply",
      "contactUsLinkLabel": "Contact us",
      "copyrightText": "© 2026 Flow. All rights reserved."
    },
    "contactDetails": {
      "supportEmail": "metropinjamanberlesan@gmail.com",
      "displayPhoneNumber": "+60 11-7007 3191",
      "officeName": "Metro Pinjaman Berlesen",
      "officeAddress": "Jalan Metro 1, Metro Prima, 52100 Kuala Lumpur, Federal Territory of Kuala Lumpur",
      "wazeUrl": "https://www.waze.com/live-map/directions/my/wilayah-persekutuan-kuala-lumpur/kuala-lumpur/jalan-metro-1?to=place.ElpKYWxhbiBNZXRybyAxLCBNZXRybyBQcmltYSwgNTIxMDAgS3VhbGEgTHVtcHVyLCBXaWxheWFoIFBlcnNla3V0dWFuIEt1YWxhIEx1bXB1ciwgTWFsYXlzaWEiLiosChQKEglr0ecfQEbMMRELOdpZeIzxyxIUChIJ35pfkUBGzDERuup-yz1DT3Y",
      "googleMapsUrl": "https://www.google.com/maps/place/Jalan+Metro+1,+Metro+Prima,+52100+Kuala+Lumpur,+Wilayah+Persekutuan+Kuala+Lumpur/data=!4m2!3m1!1s0x31cc46401fe7d16b:0xcbf18c7859da390b?sa=X&ved=1t:242&ictx=111"
    }
  },
  "homePage": {
    "seo": {
      "title": "LoanEase — Homepage",
      "description": ""
    },
    "hero": {
      "eyebrow": "Powering Tomorrow",
      "mainHeading": "Simple Loans,",
      "description": "Get the funds you need with competitive rates and a streamlined application. No hidden fees, no surprises — just straightforward lending.",
      "primaryButtonLabel": "Check Your Rate",
      "secondaryButtonLabel": "Learn More",
      "leftTopImage": {
        "src": "flow-assets/headers/header-4-left-top.png",
        "alt": ""
      },
      "rightTopImage": {
        "src": "flow-assets/headers/header-4-right-top.png",
        "alt": ""
      },
      "bottomLeftImage": {
        "src": "flow-assets/headers/header-4-bottom-lleft.png",
        "alt": ""
      },
      "bottomRightImage": {
        "src": "flow-assets/headers/header-4-bottom-right.png",
        "alt": ""
      }
    },
    "howItWorks": {
      "heading": "How It Works",
      "description": "Get your loan in four simple steps.",
      "steps": [
        {
          "title": "Select Loan",
          "description": "Choose the loan type that fits your needs."
        },
        {
          "title": "Apply Online",
          "description": "Fill in our simple form in just minutes."
        },
        {
          "title": "Get Approved",
          "description": "Receive fast approval with no guarantor."
        },
        {
          "title": "Receive Money",
          "description": "Money is sent directly to your account."
        }
      ]
    },
    "statistics": {
      "items": [
        {
          "value": "4",
          "label": "Simple Application Steps"
        },
        {
          "value": "2",
          "label": "Loan Options Available"
        },
        {
          "value": "24h",
          "label": "Response Time Target"
        },
        {
          "value": "100%",
          "label": "Transparent Terms"
        }
      ]
    },
    "loanOptions": {
      "heading": "Loan Options",
      "description": "Choose the perfect loan to match your goals.",
      "cards": [
        {
          "image": {
            "src": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80",
            "alt": ""
          },
          "title": "Personal Loan",
          "description": "Get flexible funding for personal needs, from emergencies to dreams.",
          "linkLabel": "Learn more"
        },
        {
          "image": {
            "src": "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
            "alt": ""
          },
          "title": "Business Loan",
          "description": "Grow your business with funding tailored for entrepreneurs.",
          "linkLabel": "Learn more"
        }
      ]
    },
    "whyChooseUs": {
      "image": {
        "src": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80",
        "alt": ""
      },
      "heading": "Why Choose Us",
      "features": [
        {
          "title": "Simple Process",
          "description": "Apply easily online with minimal paperwork."
        },
        {
          "title": "Trusted by Thousands",
          "description": "Thousands of happy customers rely on us."
        },
        {
          "title": "Transparent Terms",
          "description": "No hidden fees, clear and honest pricing."
        }
      ]
    },
    "readyToGetStarted": {
      "heading": "Ready to get started?",
      "description": "Apply now and get the funds you need in no time.",
      "applyButtonLabel": "APPLY NOW",
      "whatsappButtonLabel": "WHATSAPP US"
    }
  },
  "aboutUsPage": {
    "seo": {
      "title": "About Us | Metro Pinjaman Berlesen",
      "description": ""
    },
    "hero": {
      "backgroundImage": {
        "src": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80",
        "alt": ""
      },
      "mainHeading": "Lending you trust, building your future.",
      "description": "We help individuals and businesses access fair, fast and transparent loan solutions-so you can focus on what matters most."
    },
    "whoWeAre": {
      "image": {
        "src": "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80",
        "alt": ""
      },
      "heading": "Who we are",
      "paragraphs": [
        "Founded with a simple mission-to make borrowing simpler, smarter and more human-we've helped thousands of customers secure the funding they need with confidence.",
        "Our team of financial experts combines years of industry experience with modern technology to deliver loan services that are transparent, secure and tailored to your goals."
      ],
      "statistics": [
        {
          "value": "15K+",
          "label": "Loans funded"
        },
        {
          "value": "$2B+",
          "label": "Capital deployed"
        },
        {
          "value": "98%",
          "label": "Satisfaction rate"
        }
      ]
    },
    "whyChooseUs": {
      "heading": "Why choose us",
      "description": "We go beyond just approving loans. Here's what sets our service apart from the rest.",
      "features": [
        {
          "title": "Fast approvals",
          "description": "Get a decision in minutes, not days. Our streamlined process means funds reach you faster."
        },
        {
          "title": "Competitive rates",
          "description": "Transparent pricing with no hidden fees. You always know exactly what you'll pay."
        },
        {
          "title": "Personalized service",
          "description": "Real people, real support. Our advisors guide you through every step of the journey."
        },
        {
          "title": "Flexible terms",
          "description": "Choose repayment plans that fit your budget and lifestyle, not the other way around."
        },
        {
          "title": "100% online",
          "description": "Apply, track and manage your loan entirely from your phone or computer-anytime."
        },
        {
          "title": "Trusted reputation",
          "description": "Thousands of happy customers and top industry ratings back our commitment to you."
        }
      ]
    },
    "trustAndSecurity": {
      "heading": "Trust & security",
      "description": "Your data and money are protected by industry-leading standards. We treat your security as seriously as you do.",
      "items": [
        {
          "title": "Bank-level encryption",
          "description": "256-bit SSL encryption keeps every transaction safe."
        },
        {
          "title": "Fully licensed & regulated",
          "description": "We operate in full compliance with financial authorities."
        },
        {
          "title": "Privacy first",
          "description": "Your personal information is never sold or shared without consent."
        }
      ],
      "image": {
        "src": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80",
        "alt": ""
      }
    },
    "whoWeHelp": {
      "heading": "Who we help",
      "description": "Whatever your goal, we have a loan solution designed for you.",
      "cards": [
        {
          "image": {
            "src": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80",
            "alt": ""
          },
          "title": "Home buyers",
          "description": "Affordable mortgages to help you own your dream home."
        },
        {
          "image": {
            "src": "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80",
            "alt": ""
          },
          "title": "Small businesses",
          "description": "Working capital and growth funding for entrepreneurs."
        },
        {
          "image": {
            "src": "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80",
            "alt": ""
          },
          "title": "Individuals",
          "description": "Personal loans for life's planned and unexpected moments."
        },
        {
          "image": {
            "src": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80",
            "alt": ""
          },
          "title": "Students",
          "description": "Education financing to invest in your future career."
        }
      ]
    },
    "readyToGetStarted": {
      "heading": "Ready to get started?",
      "description": "Join thousands of satisfied customers who trust us with their financial goals. Apply today and get a decision in minutes.",
      "applyButtonLabel": "Apply now",
      "advisorButtonLabel": "Talk to an advisor"
    }
  },
  "loanPage": {
    "seo": {
      "title": "Loan | Metro Pinjaman Berlesen",
      "description": ""
    },
    "hero": {
      "mainHeading": "The Future of Green Energy",
      "description": "Our commitment to green energy is paving the way for a cleaner, healthier planet. Join us on a journey towards a future where clean, renewable energy sources transform the way we power our lives.",
      "primaryButtonLabel": "See our solutions",
      "secondaryButtonLabel": "Get in touch",
      "image": {
        "src": "flow-assets/headers/image-hero-1.png",
        "alt": ""
      }
    },
    "personalLoan": {
      "heading": "Personal Loan",
      "description": "Flexible financing for big expenses, debt consolidation, short-term cash needs, or personal projects with a clear monthly repayment plan.",
      "applyButtonLabel": "Apply now",
      "whatsappButtonLabel": "WhatsApp us",
      "features": [
        {
          "image": {
            "src": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80",
            "alt": ""
          },
          "title": "Loan from RM500 to RM100,000",
          "description": "Available for applicants with a minimum monthly salary of RM3,000 and a steady source of income."
        },
        {
          "image": {
            "src": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80",
            "alt": ""
          },
          "title": "Monthly repayment plan",
          "description": "Suitable for personal expenses, big purchases, debt consolidation, or short-term cash needs."
        }
      ],
      "requirements": {
        "image": {
          "src": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=600&q=80",
          "alt": ""
        },
        "heading": "Required documents",
        "items": [
          "NRIC and contact number",
          "Latest 3 months payslip and bank statement",
          "Utility bill, S&P, tenancy agreement, and EPF statement"
        ]
      }
    },
    "businessLoan": {
      "heading": "Business Loan",
      "description": "Take your business further with flexible loan tenures, high financing margins, and funding for working capital, stock, overheads, or business activities.",
      "applyButtonLabel": "Apply now",
      "whatsappButtonLabel": "WhatsApp us",
      "features": [
        {
          "image": {
            "src": "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80",
            "alt": ""
          },
          "title": "Working capital support",
          "description": "Support cash flow, daily operations, stock purchases, overheads, and other working capital needs."
        },
        {
          "image": {
            "src": "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=600&q=80",
            "alt": ""
          },
          "title": "Flexible business funding",
          "description": "Suitable for small businesses and corporate groups that need practical financing solutions."
        }
      ],
      "requirements": {
        "image": {
          "src": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80",
          "alt": ""
        },
        "heading": "Required documents",
        "items": [
          "NRIC copy and name card",
          "Borang B and Borang D",
          "Latest 3 months bank statement",
          "S&P and latest electric & water bill",
          "Form 24/49, 42, 11A and latest EPF statement"
        ]
      }
    },
    "comparison": {
      "heading": "Loan Comparison",
      "description": "Compare personal and business loan options so you can choose the financing that fits your needs.",
      "tableHeading": "Compare loan types",
      "personalColumn": {
        "title": "Personal Loan",
        "subtitle": "For individual needs"
      },
      "businessColumn": {
        "title": "Business Loan",
        "subtitle": "For company growth"
      },
      "rows": [
        {
          "label": "Best for",
          "personalValue": "Personal expenses, emergencies, education, or home needs",
          "businessValue": "Working capital, equipment, inventory, or business expansion"
        },
        {
          "label": "Indicative rate",
          "personalValue": "From 6.5% p.a.",
          "businessValue": "From 8.0% p.a."
        },
        {
          "label": "Loan amount",
          "personalValue": "Smaller to medium financing needs",
          "businessValue": "Higher limits based on business profile"
        },
        {
          "label": "Repayment tenure",
          "personalValue": "Flexible monthly installments",
          "businessValue": "Structured around business cash flow"
        },
        {
          "label": "Documents",
          "personalValue": "Identity, income, and bank details",
          "businessValue": "Business registration, bank statements, and company financials"
        },
        {
          "label": "Approval focus",
          "personalValue": "Personal income and repayment ability",
          "businessValue": "Business revenue, operations, and cash flow"
        },
        {
          "label": "Support",
          "personalValue": "Guided application assistance",
          "businessValue": "Guided application assistance for business documents"
        }
      ],
      "loanDetailsHeading": "Loan details",
      "applicationNeedsHeading": "Application needs"
    },
    "interestRates": {
      "heading": "Interest Rates & Repayment",
      "description": "Transparent pricing with flexible repayment options designed to fit your budget.",
      "features": [
        {
          "title": "Competitive Rates",
          "description": "Personal loans from 6.5% p.a. and business loans from 8.0% p.a."
        },
        {
          "title": "Flexible Repayment",
          "description": "Choose monthly installments that suit your cash flow, with no hidden fees or surprises."
        },
        {
          "title": "Early Settlement",
          "description": "Pay off your loan early and save on interest with low or zero prepayment penalties."
        }
      ]
    },
    "estimator": {
      "heading": "Estimate Your Monthly Repayment",
      "disclaimer": "*Estimates only. Actual rates and terms may vary upon approval."
    }
  },
  "howToApplyPage": {
    "seo": {
      "title": "How To Apply | Metro Pinjaman Berlesen",
      "description": ""
    },
    "hero": {
      "mainHeading": "Get Your Loan in Simple Steps",
      "description": "Applying for a loan with us is fast and hassle-free. Follow our easy guide below to complete your application and get the funds you need.",
      "primaryButtonLabel": "Start Your Application"
    },
    "steps": {
      "heading": "Step-by-Step Process",
      "description": "A clear and simple path from application to approval.",
      "items": [
        {
          "title": "Choose Your Loan",
          "description": "Select the loan option that best fits your needs and budget from our range of services."
        },
        {
          "title": "Submit Documents",
          "description": "Prepare and upload the required documents listed below to verify your eligibility."
        },
        {
          "title": "Get Reviewed",
          "description": "Our team reviews your application quickly and contacts you for any clarifications."
        },
        {
          "title": "Receive Funds",
          "description": "Once approved, your loan amount is disbursed directly to your account."
        }
      ]
    },
    "requiredDocuments": {
      "image": {
        "src": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80",
        "alt": ""
      },
      "heading": "Required Documents",
      "description": "Have these documents ready before you apply to ensure a smooth and speedy process.",
      "items": [
        {
          "title": "Valid Government ID",
          "description": "Passport, driver's license, or national ID card."
        },
        {
          "title": "Proof of Income",
          "description": "Recent payslips, bank statements, or tax returns."
        },
        {
          "title": "Proof of Address",
          "description": "Utility bill or lease agreement dated within 3 months."
        },
        {
          "title": "Bank Account Details",
          "description": "Active bank account for loan disbursement."
        }
      ]
    },
    "eligibility": {
      "heading": "Eligibility Requirements",
      "description": "Make sure you meet these basic requirements before you apply.",
      "items": [
        "You must be at least 18 years old.",
        "Have a stable and verifiable source of income.",
        "Be a resident or citizen with valid documents.",
        "Maintain an active bank account."
      ]
    },
    "readyToApply": {
      "heading": "Ready to Apply?",
      "description": "Fill out the quick form below or chat with us instantly on WhatsApp to get started right away.",
      "whatsappButtonLabel": "Chat on WhatsApp",
      "submitButtonLabel": "SUBMIT APPLICATION"
    }
  },
  "contactUsPage": {
    "seo": {
      "title": "Contact Us | Metro Pinjaman Berlesen",
      "description": ""
    },
    "contactForm": {
      "heading": "Contact us",
      "description": "Contact Metro Pinjaman Berlesen for personal and business loan enquiries. Our team is ready to assist you 24/7.",
      "submitButtonLabel": "Submit",
      "image": {
        "src": "flow-assets/contact/photo-1.png",
        "alt": ""
      }
    },
    "contactMethods": {
      "email": {
        "heading": "Email",
        "description": "Email us for loan enquiries and application support."
      },
      "phone": {
        "heading": "Phone"
      },
      "office": {
        "heading": "HQ Office",
        "description": "Visit us at our office"
      }
    },
    "faq": {
      "heading": "FAQ",
      "description": "Here you will find the answers to the frequently asked questions.",
      "items": [
        {
          "question": "What loan services do you offer?",
          "answer": "Metro Pinjaman Berlesen offers personal loans and business loans with flexible repayment options."
        },
        {
          "question": "How fast can I receive the money?",
          "answer": "Once your application is approved, you can receive your cash by bank transfer within 10 minutes."
        },
        {
          "question": "Who can apply?",
          "answer": "The service is open to Malaysians. Personal loan applicants should have a source of income and a minimum monthly salary of RM3000."
        },
        {
          "question": "Do I need to provide my ATM card or a guarantor?",
          "answer": "No. Metro Pinjaman Berlesen does not require your ATM card or a guarantor for your loan application."
        },
        {
          "question": "What documents do I need?",
          "answer": "Required documents may include NRIC, contact number, latest 3 months pay slip, latest 3 months bank statement, latest utility bills, EPF statement, S&P, or tenancy agreement."
        }
      ]
    },
    "stillHaveQuestions": {
      "heading": "Still have questions?"
    }
  }
};
