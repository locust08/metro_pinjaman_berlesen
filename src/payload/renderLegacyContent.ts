import { parse } from 'node-html-parser';
import type { PublicPayloadContent, SitePageId } from './content';

type Binding = { id: string; path: string; page: string | null };

const bindings: Binding[] = [
  {
    "id": "site-header-logo",
    "path": "siteSettings.header.websiteLogo",
    "page": null
  },
  {
    "id": "site-header-mobile-drawer-primary-logo",
    "path": "siteSettings.header.mobileDrawerLogo",
    "page": null
  },
  {
    "id": "site-header-mobile-drawer-secondary-logo",
    "path": "siteSettings.header.mobileDrawerLogo",
    "page": null
  },
  {
    "id": "site-header-nav-about-us",
    "path": "siteSettings.header.aboutUsMenuLabel",
    "page": null
  },
  {
    "id": "site-header-mobile-drawer-primary-nav-about-us",
    "path": "siteSettings.header.aboutUsMenuLabel",
    "page": null
  },
  {
    "id": "site-header-mobile-drawer-secondary-nav-about-us",
    "path": "siteSettings.header.aboutUsMenuLabel",
    "page": null
  },
  {
    "id": "site-header-nav-loan",
    "path": "siteSettings.header.loanMenuLabel",
    "page": null
  },
  {
    "id": "site-header-mobile-drawer-primary-nav-loan",
    "path": "siteSettings.header.loanMenuLabel",
    "page": null
  },
  {
    "id": "site-header-mobile-drawer-secondary-nav-loan",
    "path": "siteSettings.header.loanMenuLabel",
    "page": null
  },
  {
    "id": "site-header-nav-how-to-apply",
    "path": "siteSettings.header.howToApplyMenuLabel",
    "page": null
  },
  {
    "id": "site-header-mobile-drawer-primary-nav-how-to-apply",
    "path": "siteSettings.header.howToApplyMenuLabel",
    "page": null
  },
  {
    "id": "site-header-mobile-drawer-secondary-nav-how-to-apply",
    "path": "siteSettings.header.howToApplyMenuLabel",
    "page": null
  },
  {
    "id": "site-header-nav-contact-us",
    "path": "siteSettings.header.contactUsMenuLabel",
    "page": null
  },
  {
    "id": "site-header-mobile-drawer-primary-nav-contact-us",
    "path": "siteSettings.header.contactUsMenuLabel",
    "page": null
  },
  {
    "id": "site-header-mobile-drawer-secondary-nav-contact-us",
    "path": "siteSettings.header.contactUsMenuLabel",
    "page": null
  },
  {
    "id": "site-header-apply-now-label",
    "path": "siteSettings.header.applyNowButtonLabel",
    "page": null
  },
  {
    "id": "site-header-mobile-drawer-primary-apply-now-label",
    "path": "siteSettings.header.applyNowButtonLabel",
    "page": null
  },
  {
    "id": "site-header-mobile-drawer-primary-login-label",
    "path": "siteSettings.header.loginButtonLabel",
    "page": null
  },
  {
    "id": "site-header-mobile-drawer-secondary-login-label",
    "path": "siteSettings.header.loginButtonLabel",
    "page": null
  },
  {
    "id": "site-header-mobile-drawer-primary-newsletter-label",
    "path": "siteSettings.header.newsletterLabel",
    "page": null
  },
  {
    "id": "site-header-mobile-drawer-secondary-newsletter-label",
    "path": "siteSettings.header.newsletterLabel",
    "page": null
  },
  {
    "id": "site-footer-logo",
    "path": "siteSettings.footer.footerLogo",
    "page": null
  },
  {
    "id": "site-footer-pages-heading",
    "path": "siteSettings.footer.pagesColumnHeading",
    "page": null
  },
  {
    "id": "site-footer-link-home",
    "path": "siteSettings.footer.homeLinkLabel",
    "page": null
  },
  {
    "id": "site-footer-link-about-us",
    "path": "siteSettings.footer.aboutUsLinkLabel",
    "page": null
  },
  {
    "id": "site-footer-link-loan",
    "path": "siteSettings.footer.loanLinkLabel",
    "page": null
  },
  {
    "id": "site-footer-help-heading",
    "path": "siteSettings.footer.helpColumnHeading",
    "page": null
  },
  {
    "id": "site-footer-link-how-to-apply",
    "path": "siteSettings.footer.howToApplyLinkLabel",
    "page": null
  },
  {
    "id": "site-footer-link-contact-us",
    "path": "siteSettings.footer.contactUsLinkLabel",
    "page": null
  },
  {
    "id": "site-footer-copyright",
    "path": "siteSettings.footer.copyrightText",
    "page": null
  },
  {
    "id": "site-contact-support-email",
    "path": "siteSettings.contactDetails.supportEmail",
    "page": null
  },
  {
    "id": "site-contact-phone-number",
    "path": "siteSettings.contactDetails.displayPhoneNumber",
    "page": null
  },
  {
    "id": "site-contact-phone-link",
    "path": "siteSettings.contactDetails.telephoneLinkNumber",
    "page": null
  },
  {
    "id": "site-contact-whatsapp-link",
    "path": "siteSettings.contactDetails.whatsappNumber",
    "page": null
  },
  {
    "id": "site-contact-whatsapp-message",
    "path": "siteSettings.contactDetails.defaultWhatsappMessage",
    "page": null
  },
  {
    "id": "site-contact-business-hours",
    "path": "siteSettings.contactDetails.businessHours",
    "page": null
  },
  {
    "id": "site-contact-office-name",
    "path": "siteSettings.contactDetails.officeName",
    "page": null
  },
  {
    "id": "site-contact-office-address",
    "path": "siteSettings.contactDetails.officeAddress",
    "page": null
  },
  {
    "id": "site-contact-waze-link",
    "path": "siteSettings.contactDetails.wazeUrl",
    "page": null
  },
  {
    "id": "site-contact-google-maps-link",
    "path": "siteSettings.contactDetails.googleMapsUrl",
    "page": null
  },
  {
    "id": "site-form-sending-message",
    "path": "siteSettings.formMessages.sendingMessage",
    "page": null
  },
  {
    "id": "site-form-success-message",
    "path": "siteSettings.formMessages.successfulSubmissionMessage",
    "page": null
  },
  {
    "id": "site-form-failure-message",
    "path": "siteSettings.formMessages.failedSubmissionMessage",
    "page": null
  },
  {
    "id": "site-form-validation-message",
    "path": "siteSettings.formMessages.validationSummaryMessage",
    "page": null
  },
  {
    "id": "home-seo-title",
    "path": "homePage.seo.title",
    "page": "index.html"
  },
  {
    "id": "home-seo-description",
    "path": "homePage.seo.description",
    "page": "index.html"
  },
  {
    "id": "home-hero-eyebrow",
    "path": "homePage.hero.eyebrow",
    "page": "index.html"
  },
  {
    "id": "home-hero-main-heading",
    "path": "homePage.hero.mainHeading",
    "page": "index.html"
  },
  {
    "id": "home-hero-description",
    "path": "homePage.hero.description",
    "page": "index.html"
  },
  {
    "id": "home-hero-primary-button-label",
    "path": "homePage.hero.primaryButtonLabel",
    "page": "index.html"
  },
  {
    "id": "home-hero-secondary-button-label",
    "path": "homePage.hero.secondaryButtonLabel",
    "page": "index.html"
  },
  {
    "id": "home-hero-left-top-image",
    "path": "homePage.hero.leftTopImage",
    "page": "index.html"
  },
  {
    "id": "home-hero-right-top-image",
    "path": "homePage.hero.rightTopImage",
    "page": "index.html"
  },
  {
    "id": "home-hero-bottom-left-image",
    "path": "homePage.hero.bottomLeftImage",
    "page": "index.html"
  },
  {
    "id": "home-hero-bottom-right-image",
    "path": "homePage.hero.bottomRightImage",
    "page": "index.html"
  },
  {
    "id": "home-how-it-works-heading",
    "path": "homePage.howItWorks.heading",
    "page": "index.html"
  },
  {
    "id": "home-how-it-works-description",
    "path": "homePage.howItWorks.description",
    "page": "index.html"
  },
  {
    "id": "home-how-it-works-step-1-title",
    "path": "homePage.howItWorks.steps[0].title",
    "page": "index.html"
  },
  {
    "id": "home-how-it-works-step-1-description",
    "path": "homePage.howItWorks.steps[0].description",
    "page": "index.html"
  },
  {
    "id": "home-how-it-works-step-2-title",
    "path": "homePage.howItWorks.steps[1].title",
    "page": "index.html"
  },
  {
    "id": "home-how-it-works-step-2-description",
    "path": "homePage.howItWorks.steps[1].description",
    "page": "index.html"
  },
  {
    "id": "home-how-it-works-step-3-title",
    "path": "homePage.howItWorks.steps[2].title",
    "page": "index.html"
  },
  {
    "id": "home-how-it-works-step-3-description",
    "path": "homePage.howItWorks.steps[2].description",
    "page": "index.html"
  },
  {
    "id": "home-how-it-works-step-4-title",
    "path": "homePage.howItWorks.steps[3].title",
    "page": "index.html"
  },
  {
    "id": "home-how-it-works-step-4-description",
    "path": "homePage.howItWorks.steps[3].description",
    "page": "index.html"
  },
  {
    "id": "home-statistic-1-value",
    "path": "homePage.statistics.items[0].value",
    "page": "index.html"
  },
  {
    "id": "home-statistic-1-label",
    "path": "homePage.statistics.items[0].label",
    "page": "index.html"
  },
  {
    "id": "home-statistic-2-value",
    "path": "homePage.statistics.items[1].value",
    "page": "index.html"
  },
  {
    "id": "home-statistic-2-label",
    "path": "homePage.statistics.items[1].label",
    "page": "index.html"
  },
  {
    "id": "home-statistic-3-value",
    "path": "homePage.statistics.items[2].value",
    "page": "index.html"
  },
  {
    "id": "home-statistic-3-label",
    "path": "homePage.statistics.items[2].label",
    "page": "index.html"
  },
  {
    "id": "home-statistic-4-value",
    "path": "homePage.statistics.items[3].value",
    "page": "index.html"
  },
  {
    "id": "home-statistic-4-label",
    "path": "homePage.statistics.items[3].label",
    "page": "index.html"
  },
  {
    "id": "home-loan-options-heading",
    "path": "homePage.loanOptions.heading",
    "page": "index.html"
  },
  {
    "id": "home-loan-options-description",
    "path": "homePage.loanOptions.description",
    "page": "index.html"
  },
  {
    "id": "home-loan-option-1-image",
    "path": "homePage.loanOptions.cards[0].image",
    "page": "index.html"
  },
  {
    "id": "home-loan-option-1-title",
    "path": "homePage.loanOptions.cards[0].title",
    "page": "index.html"
  },
  {
    "id": "home-loan-option-1-description",
    "path": "homePage.loanOptions.cards[0].description",
    "page": "index.html"
  },
  {
    "id": "home-loan-option-1-link-label",
    "path": "homePage.loanOptions.cards[0].linkLabel",
    "page": "index.html"
  },
  {
    "id": "home-loan-option-2-image",
    "path": "homePage.loanOptions.cards[1].image",
    "page": "index.html"
  },
  {
    "id": "home-loan-option-2-title",
    "path": "homePage.loanOptions.cards[1].title",
    "page": "index.html"
  },
  {
    "id": "home-loan-option-2-description",
    "path": "homePage.loanOptions.cards[1].description",
    "page": "index.html"
  },
  {
    "id": "home-loan-option-2-link-label",
    "path": "homePage.loanOptions.cards[1].linkLabel",
    "page": "index.html"
  },
  {
    "id": "home-why-choose-us-image",
    "path": "homePage.whyChooseUs.image",
    "page": "index.html"
  },
  {
    "id": "home-why-choose-us-heading",
    "path": "homePage.whyChooseUs.heading",
    "page": "index.html"
  },
  {
    "id": "home-why-choose-us-feature-1-title",
    "path": "homePage.whyChooseUs.features[0].title",
    "page": "index.html"
  },
  {
    "id": "home-why-choose-us-feature-1-description",
    "path": "homePage.whyChooseUs.features[0].description",
    "page": "index.html"
  },
  {
    "id": "home-why-choose-us-feature-2-title",
    "path": "homePage.whyChooseUs.features[1].title",
    "page": "index.html"
  },
  {
    "id": "home-why-choose-us-feature-2-description",
    "path": "homePage.whyChooseUs.features[1].description",
    "page": "index.html"
  },
  {
    "id": "home-why-choose-us-feature-3-title",
    "path": "homePage.whyChooseUs.features[2].title",
    "page": "index.html"
  },
  {
    "id": "home-why-choose-us-feature-3-description",
    "path": "homePage.whyChooseUs.features[2].description",
    "page": "index.html"
  },
  {
    "id": "home-ready-to-get-started-heading",
    "path": "homePage.readyToGetStarted.heading",
    "page": "index.html"
  },
  {
    "id": "home-ready-to-get-started-description",
    "path": "homePage.readyToGetStarted.description",
    "page": "index.html"
  },
  {
    "id": "home-ready-to-get-started-apply-label",
    "path": "homePage.readyToGetStarted.applyButtonLabel",
    "page": "index.html"
  },
  {
    "id": "home-ready-to-get-started-whatsapp-label",
    "path": "homePage.readyToGetStarted.whatsappButtonLabel",
    "page": "index.html"
  },
  {
    "id": "about-us-seo-title",
    "path": "aboutUsPage.seo.title",
    "page": "about_us.html"
  },
  {
    "id": "about-us-seo-description",
    "path": "aboutUsPage.seo.description",
    "page": "about_us.html"
  },
  {
    "id": "about-us-hero-background-image",
    "path": "aboutUsPage.hero.backgroundImage",
    "page": "about_us.html"
  },
  {
    "id": "about-us-hero-main-heading",
    "path": "aboutUsPage.hero.mainHeading",
    "page": "about_us.html"
  },
  {
    "id": "about-us-hero-description",
    "path": "aboutUsPage.hero.description",
    "page": "about_us.html"
  },
  {
    "id": "about-us-who-we-are-image",
    "path": "aboutUsPage.whoWeAre.image",
    "page": "about_us.html"
  },
  {
    "id": "about-us-who-we-are-heading",
    "path": "aboutUsPage.whoWeAre.heading",
    "page": "about_us.html"
  },
  {
    "id": "about-us-who-we-are-paragraph-1",
    "path": "aboutUsPage.whoWeAre.paragraphs[0]",
    "page": "about_us.html"
  },
  {
    "id": "about-us-who-we-are-paragraph-2",
    "path": "aboutUsPage.whoWeAre.paragraphs[1]",
    "page": "about_us.html"
  },
  {
    "id": "about-us-statistic-1-value",
    "path": "aboutUsPage.whoWeAre.statistics[0].value",
    "page": "about_us.html"
  },
  {
    "id": "about-us-statistic-1-label",
    "path": "aboutUsPage.whoWeAre.statistics[0].label",
    "page": "about_us.html"
  },
  {
    "id": "about-us-statistic-2-value",
    "path": "aboutUsPage.whoWeAre.statistics[1].value",
    "page": "about_us.html"
  },
  {
    "id": "about-us-statistic-2-label",
    "path": "aboutUsPage.whoWeAre.statistics[1].label",
    "page": "about_us.html"
  },
  {
    "id": "about-us-statistic-3-value",
    "path": "aboutUsPage.whoWeAre.statistics[2].value",
    "page": "about_us.html"
  },
  {
    "id": "about-us-statistic-3-label",
    "path": "aboutUsPage.whoWeAre.statistics[2].label",
    "page": "about_us.html"
  },
  {
    "id": "about-us-why-choose-us-heading",
    "path": "aboutUsPage.whyChooseUs.heading",
    "page": "about_us.html"
  },
  {
    "id": "about-us-why-choose-us-description",
    "path": "aboutUsPage.whyChooseUs.description",
    "page": "about_us.html"
  },
  {
    "id": "about-us-why-choose-us-feature-1-title",
    "path": "aboutUsPage.whyChooseUs.features[0].title",
    "page": "about_us.html"
  },
  {
    "id": "about-us-why-choose-us-feature-1-description",
    "path": "aboutUsPage.whyChooseUs.features[0].description",
    "page": "about_us.html"
  },
  {
    "id": "about-us-why-choose-us-feature-2-title",
    "path": "aboutUsPage.whyChooseUs.features[1].title",
    "page": "about_us.html"
  },
  {
    "id": "about-us-why-choose-us-feature-2-description",
    "path": "aboutUsPage.whyChooseUs.features[1].description",
    "page": "about_us.html"
  },
  {
    "id": "about-us-why-choose-us-feature-3-title",
    "path": "aboutUsPage.whyChooseUs.features[2].title",
    "page": "about_us.html"
  },
  {
    "id": "about-us-why-choose-us-feature-3-description",
    "path": "aboutUsPage.whyChooseUs.features[2].description",
    "page": "about_us.html"
  },
  {
    "id": "about-us-why-choose-us-feature-4-title",
    "path": "aboutUsPage.whyChooseUs.features[3].title",
    "page": "about_us.html"
  },
  {
    "id": "about-us-why-choose-us-feature-4-description",
    "path": "aboutUsPage.whyChooseUs.features[3].description",
    "page": "about_us.html"
  },
  {
    "id": "about-us-why-choose-us-feature-5-title",
    "path": "aboutUsPage.whyChooseUs.features[4].title",
    "page": "about_us.html"
  },
  {
    "id": "about-us-why-choose-us-feature-5-description",
    "path": "aboutUsPage.whyChooseUs.features[4].description",
    "page": "about_us.html"
  },
  {
    "id": "about-us-why-choose-us-feature-6-title",
    "path": "aboutUsPage.whyChooseUs.features[5].title",
    "page": "about_us.html"
  },
  {
    "id": "about-us-why-choose-us-feature-6-description",
    "path": "aboutUsPage.whyChooseUs.features[5].description",
    "page": "about_us.html"
  },
  {
    "id": "about-us-trust-and-security-heading",
    "path": "aboutUsPage.trustAndSecurity.heading",
    "page": "about_us.html"
  },
  {
    "id": "about-us-trust-and-security-description",
    "path": "aboutUsPage.trustAndSecurity.description",
    "page": "about_us.html"
  },
  {
    "id": "about-us-trust-and-security-item-1-title",
    "path": "aboutUsPage.trustAndSecurity.items[0].title",
    "page": "about_us.html"
  },
  {
    "id": "about-us-trust-and-security-item-1-description",
    "path": "aboutUsPage.trustAndSecurity.items[0].description",
    "page": "about_us.html"
  },
  {
    "id": "about-us-trust-and-security-item-2-title",
    "path": "aboutUsPage.trustAndSecurity.items[1].title",
    "page": "about_us.html"
  },
  {
    "id": "about-us-trust-and-security-item-2-description",
    "path": "aboutUsPage.trustAndSecurity.items[1].description",
    "page": "about_us.html"
  },
  {
    "id": "about-us-trust-and-security-item-3-title",
    "path": "aboutUsPage.trustAndSecurity.items[2].title",
    "page": "about_us.html"
  },
  {
    "id": "about-us-trust-and-security-item-3-description",
    "path": "aboutUsPage.trustAndSecurity.items[2].description",
    "page": "about_us.html"
  },
  {
    "id": "about-us-trust-and-security-image",
    "path": "aboutUsPage.trustAndSecurity.image",
    "page": "about_us.html"
  },
  {
    "id": "about-us-who-we-help-heading",
    "path": "aboutUsPage.whoWeHelp.heading",
    "page": "about_us.html"
  },
  {
    "id": "about-us-who-we-help-description",
    "path": "aboutUsPage.whoWeHelp.description",
    "page": "about_us.html"
  },
  {
    "id": "about-us-who-we-help-card-1-image",
    "path": "aboutUsPage.whoWeHelp.cards[0].image",
    "page": "about_us.html"
  },
  {
    "id": "about-us-who-we-help-card-1-title",
    "path": "aboutUsPage.whoWeHelp.cards[0].title",
    "page": "about_us.html"
  },
  {
    "id": "about-us-who-we-help-card-1-description",
    "path": "aboutUsPage.whoWeHelp.cards[0].description",
    "page": "about_us.html"
  },
  {
    "id": "about-us-who-we-help-card-2-image",
    "path": "aboutUsPage.whoWeHelp.cards[1].image",
    "page": "about_us.html"
  },
  {
    "id": "about-us-who-we-help-card-2-title",
    "path": "aboutUsPage.whoWeHelp.cards[1].title",
    "page": "about_us.html"
  },
  {
    "id": "about-us-who-we-help-card-2-description",
    "path": "aboutUsPage.whoWeHelp.cards[1].description",
    "page": "about_us.html"
  },
  {
    "id": "about-us-who-we-help-card-3-image",
    "path": "aboutUsPage.whoWeHelp.cards[2].image",
    "page": "about_us.html"
  },
  {
    "id": "about-us-who-we-help-card-3-title",
    "path": "aboutUsPage.whoWeHelp.cards[2].title",
    "page": "about_us.html"
  },
  {
    "id": "about-us-who-we-help-card-3-description",
    "path": "aboutUsPage.whoWeHelp.cards[2].description",
    "page": "about_us.html"
  },
  {
    "id": "about-us-who-we-help-card-4-image",
    "path": "aboutUsPage.whoWeHelp.cards[3].image",
    "page": "about_us.html"
  },
  {
    "id": "about-us-who-we-help-card-4-title",
    "path": "aboutUsPage.whoWeHelp.cards[3].title",
    "page": "about_us.html"
  },
  {
    "id": "about-us-who-we-help-card-4-description",
    "path": "aboutUsPage.whoWeHelp.cards[3].description",
    "page": "about_us.html"
  },
  {
    "id": "about-us-ready-to-get-started-heading",
    "path": "aboutUsPage.readyToGetStarted.heading",
    "page": "about_us.html"
  },
  {
    "id": "about-us-ready-to-get-started-description",
    "path": "aboutUsPage.readyToGetStarted.description",
    "page": "about_us.html"
  },
  {
    "id": "about-us-ready-to-get-started-apply-label",
    "path": "aboutUsPage.readyToGetStarted.applyButtonLabel",
    "page": "about_us.html"
  },
  {
    "id": "about-us-ready-to-get-started-advisor-label",
    "path": "aboutUsPage.readyToGetStarted.advisorButtonLabel",
    "page": "about_us.html"
  },
  {
    "id": "loan-seo-title",
    "path": "loanPage.seo.title",
    "page": "loan.html"
  },
  {
    "id": "loan-seo-description",
    "path": "loanPage.seo.description",
    "page": "loan.html"
  },
  {
    "id": "loan-hero-main-heading",
    "path": "loanPage.hero.mainHeading",
    "page": "loan.html"
  },
  {
    "id": "loan-hero-description",
    "path": "loanPage.hero.description",
    "page": "loan.html"
  },
  {
    "id": "loan-hero-primary-button-label",
    "path": "loanPage.hero.primaryButtonLabel",
    "page": "loan.html"
  },
  {
    "id": "loan-hero-secondary-button-label",
    "path": "loanPage.hero.secondaryButtonLabel",
    "page": "loan.html"
  },
  {
    "id": "loan-hero-image",
    "path": "loanPage.hero.image",
    "page": "loan.html"
  },
  {
    "id": "loan-personal-heading",
    "path": "loanPage.personalLoan.heading",
    "page": "loan.html"
  },
  {
    "id": "loan-personal-description",
    "path": "loanPage.personalLoan.description",
    "page": "loan.html"
  },
  {
    "id": "loan-personal-apply-label",
    "path": "loanPage.personalLoan.applyButtonLabel",
    "page": "loan.html"
  },
  {
    "id": "loan-personal-whatsapp-label",
    "path": "loanPage.personalLoan.whatsappButtonLabel",
    "page": "loan.html"
  },
  {
    "id": "loan-personal-feature-1-image",
    "path": "loanPage.personalLoan.features[0].image",
    "page": "loan.html"
  },
  {
    "id": "loan-personal-feature-1-title",
    "path": "loanPage.personalLoan.features[0].title",
    "page": "loan.html"
  },
  {
    "id": "loan-personal-feature-1-description",
    "path": "loanPage.personalLoan.features[0].description",
    "page": "loan.html"
  },
  {
    "id": "loan-personal-feature-2-image",
    "path": "loanPage.personalLoan.features[1].image",
    "page": "loan.html"
  },
  {
    "id": "loan-personal-feature-2-title",
    "path": "loanPage.personalLoan.features[1].title",
    "page": "loan.html"
  },
  {
    "id": "loan-personal-feature-2-description",
    "path": "loanPage.personalLoan.features[1].description",
    "page": "loan.html"
  },
  {
    "id": "loan-personal-requirements-image",
    "path": "loanPage.personalLoan.requirements.image",
    "page": "loan.html"
  },
  {
    "id": "loan-personal-requirements-heading",
    "path": "loanPage.personalLoan.requirements.heading",
    "page": "loan.html"
  },
  {
    "id": "loan-personal-requirement-1",
    "path": "loanPage.personalLoan.requirements.items[0]",
    "page": "loan.html"
  },
  {
    "id": "loan-personal-requirement-2",
    "path": "loanPage.personalLoan.requirements.items[1]",
    "page": "loan.html"
  },
  {
    "id": "loan-personal-requirement-3",
    "path": "loanPage.personalLoan.requirements.items[2]",
    "page": "loan.html"
  },
  {
    "id": "loan-business-heading",
    "path": "loanPage.businessLoan.heading",
    "page": "loan.html"
  },
  {
    "id": "loan-business-description",
    "path": "loanPage.businessLoan.description",
    "page": "loan.html"
  },
  {
    "id": "loan-business-apply-label",
    "path": "loanPage.businessLoan.applyButtonLabel",
    "page": "loan.html"
  },
  {
    "id": "loan-business-whatsapp-label",
    "path": "loanPage.businessLoan.whatsappButtonLabel",
    "page": "loan.html"
  },
  {
    "id": "loan-business-feature-1-image",
    "path": "loanPage.businessLoan.features[0].image",
    "page": "loan.html"
  },
  {
    "id": "loan-business-feature-1-title",
    "path": "loanPage.businessLoan.features[0].title",
    "page": "loan.html"
  },
  {
    "id": "loan-business-feature-1-description",
    "path": "loanPage.businessLoan.features[0].description",
    "page": "loan.html"
  },
  {
    "id": "loan-business-feature-2-image",
    "path": "loanPage.businessLoan.features[1].image",
    "page": "loan.html"
  },
  {
    "id": "loan-business-feature-2-title",
    "path": "loanPage.businessLoan.features[1].title",
    "page": "loan.html"
  },
  {
    "id": "loan-business-feature-2-description",
    "path": "loanPage.businessLoan.features[1].description",
    "page": "loan.html"
  },
  {
    "id": "loan-business-requirements-image",
    "path": "loanPage.businessLoan.requirements.image",
    "page": "loan.html"
  },
  {
    "id": "loan-business-requirements-heading",
    "path": "loanPage.businessLoan.requirements.heading",
    "page": "loan.html"
  },
  {
    "id": "loan-business-requirement-1",
    "path": "loanPage.businessLoan.requirements.items[0]",
    "page": "loan.html"
  },
  {
    "id": "loan-business-requirement-2",
    "path": "loanPage.businessLoan.requirements.items[1]",
    "page": "loan.html"
  },
  {
    "id": "loan-business-requirement-3",
    "path": "loanPage.businessLoan.requirements.items[2]",
    "page": "loan.html"
  },
  {
    "id": "loan-business-requirement-4",
    "path": "loanPage.businessLoan.requirements.items[3]",
    "page": "loan.html"
  },
  {
    "id": "loan-business-requirement-5",
    "path": "loanPage.businessLoan.requirements.items[4]",
    "page": "loan.html"
  },
  {
    "id": "loan-comparison-heading",
    "path": "loanPage.comparison.heading",
    "page": "loan.html"
  },
  {
    "id": "loan-comparison-description",
    "path": "loanPage.comparison.description",
    "page": "loan.html"
  },
  {
    "id": "loan-comparison-table-heading",
    "path": "loanPage.comparison.tableHeading",
    "page": "loan.html"
  },
  {
    "id": "loan-comparison-personal-title",
    "path": "loanPage.comparison.personalColumn.title",
    "page": "loan.html"
  },
  {
    "id": "loan-comparison-personal-subtitle",
    "path": "loanPage.comparison.personalColumn.subtitle",
    "page": "loan.html"
  },
  {
    "id": "loan-comparison-business-title",
    "path": "loanPage.comparison.businessColumn.title",
    "page": "loan.html"
  },
  {
    "id": "loan-comparison-business-subtitle",
    "path": "loanPage.comparison.businessColumn.subtitle",
    "page": "loan.html"
  },
  {
    "id": "loan-comparison-row-1-label",
    "path": "loanPage.comparison.rows[0].label",
    "page": "loan.html"
  },
  {
    "id": "loan-comparison-row-1-personal",
    "path": "loanPage.comparison.rows[0].personalValue",
    "page": "loan.html"
  },
  {
    "id": "loan-comparison-row-1-business",
    "path": "loanPage.comparison.rows[0].businessValue",
    "page": "loan.html"
  },
  {
    "id": "loan-comparison-row-2-label",
    "path": "loanPage.comparison.rows[1].label",
    "page": "loan.html"
  },
  {
    "id": "loan-comparison-row-2-personal",
    "path": "loanPage.comparison.rows[1].personalValue",
    "page": "loan.html"
  },
  {
    "id": "loan-comparison-row-2-business",
    "path": "loanPage.comparison.rows[1].businessValue",
    "page": "loan.html"
  },
  {
    "id": "loan-comparison-row-3-label",
    "path": "loanPage.comparison.rows[2].label",
    "page": "loan.html"
  },
  {
    "id": "loan-comparison-row-3-personal",
    "path": "loanPage.comparison.rows[2].personalValue",
    "page": "loan.html"
  },
  {
    "id": "loan-comparison-row-3-business",
    "path": "loanPage.comparison.rows[2].businessValue",
    "page": "loan.html"
  },
  {
    "id": "loan-comparison-row-4-label",
    "path": "loanPage.comparison.rows[3].label",
    "page": "loan.html"
  },
  {
    "id": "loan-comparison-row-4-personal",
    "path": "loanPage.comparison.rows[3].personalValue",
    "page": "loan.html"
  },
  {
    "id": "loan-comparison-row-4-business",
    "path": "loanPage.comparison.rows[3].businessValue",
    "page": "loan.html"
  },
  {
    "id": "loan-comparison-row-5-label",
    "path": "loanPage.comparison.rows[4].label",
    "page": "loan.html"
  },
  {
    "id": "loan-comparison-row-5-personal",
    "path": "loanPage.comparison.rows[4].personalValue",
    "page": "loan.html"
  },
  {
    "id": "loan-comparison-row-5-business",
    "path": "loanPage.comparison.rows[4].businessValue",
    "page": "loan.html"
  },
  {
    "id": "loan-comparison-row-6-label",
    "path": "loanPage.comparison.rows[5].label",
    "page": "loan.html"
  },
  {
    "id": "loan-comparison-row-6-personal",
    "path": "loanPage.comparison.rows[5].personalValue",
    "page": "loan.html"
  },
  {
    "id": "loan-comparison-row-6-business",
    "path": "loanPage.comparison.rows[5].businessValue",
    "page": "loan.html"
  },
  {
    "id": "loan-comparison-row-7-label",
    "path": "loanPage.comparison.rows[6].label",
    "page": "loan.html"
  },
  {
    "id": "loan-comparison-row-7-personal",
    "path": "loanPage.comparison.rows[6].personalValue",
    "page": "loan.html"
  },
  {
    "id": "loan-comparison-row-7-business",
    "path": "loanPage.comparison.rows[6].businessValue",
    "page": "loan.html"
  },
  {
    "id": "loan-comparison-loan-details-heading",
    "path": "loanPage.comparison.loanDetailsHeading",
    "page": "loan.html"
  },
  {
    "id": "loan-comparison-application-needs-heading",
    "path": "loanPage.comparison.applicationNeedsHeading",
    "page": "loan.html"
  },
  {
    "id": "loan-interest-rates-heading",
    "path": "loanPage.interestRates.heading",
    "page": "loan.html"
  },
  {
    "id": "loan-interest-rates-description",
    "path": "loanPage.interestRates.description",
    "page": "loan.html"
  },
  {
    "id": "loan-interest-rates-feature-1-title",
    "path": "loanPage.interestRates.features[0].title",
    "page": "loan.html"
  },
  {
    "id": "loan-interest-rates-feature-1-description",
    "path": "loanPage.interestRates.features[0].description",
    "page": "loan.html"
  },
  {
    "id": "loan-interest-rates-feature-2-title",
    "path": "loanPage.interestRates.features[1].title",
    "page": "loan.html"
  },
  {
    "id": "loan-interest-rates-feature-2-description",
    "path": "loanPage.interestRates.features[1].description",
    "page": "loan.html"
  },
  {
    "id": "loan-interest-rates-feature-3-title",
    "path": "loanPage.interestRates.features[2].title",
    "page": "loan.html"
  },
  {
    "id": "loan-interest-rates-feature-3-description",
    "path": "loanPage.interestRates.features[2].description",
    "page": "loan.html"
  },
  {
    "id": "loan-estimator-heading",
    "path": "loanPage.estimator.heading",
    "page": "loan.html"
  },
  {
    "id": "loan-estimator-disclaimer",
    "path": "loanPage.estimator.disclaimer",
    "page": "loan.html"
  },
  {
    "id": "how-to-apply-seo-title",
    "path": "howToApplyPage.seo.title",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-seo-description",
    "path": "howToApplyPage.seo.description",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-hero-main-heading",
    "path": "howToApplyPage.hero.mainHeading",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-hero-description",
    "path": "howToApplyPage.hero.description",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-hero-primary-button-label",
    "path": "howToApplyPage.hero.primaryButtonLabel",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-steps-heading",
    "path": "howToApplyPage.steps.heading",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-steps-description",
    "path": "howToApplyPage.steps.description",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-step-1-title",
    "path": "howToApplyPage.steps.items[0].title",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-step-1-description",
    "path": "howToApplyPage.steps.items[0].description",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-step-2-title",
    "path": "howToApplyPage.steps.items[1].title",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-step-2-description",
    "path": "howToApplyPage.steps.items[1].description",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-step-3-title",
    "path": "howToApplyPage.steps.items[2].title",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-step-3-description",
    "path": "howToApplyPage.steps.items[2].description",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-step-4-title",
    "path": "howToApplyPage.steps.items[3].title",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-step-4-description",
    "path": "howToApplyPage.steps.items[3].description",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-required-documents-image",
    "path": "howToApplyPage.requiredDocuments.image",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-required-documents-heading",
    "path": "howToApplyPage.requiredDocuments.heading",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-required-documents-description",
    "path": "howToApplyPage.requiredDocuments.description",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-document-1-title",
    "path": "howToApplyPage.requiredDocuments.items[0].title",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-document-1-description",
    "path": "howToApplyPage.requiredDocuments.items[0].description",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-document-2-title",
    "path": "howToApplyPage.requiredDocuments.items[1].title",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-document-2-description",
    "path": "howToApplyPage.requiredDocuments.items[1].description",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-document-3-title",
    "path": "howToApplyPage.requiredDocuments.items[2].title",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-document-3-description",
    "path": "howToApplyPage.requiredDocuments.items[2].description",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-document-4-title",
    "path": "howToApplyPage.requiredDocuments.items[3].title",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-document-4-description",
    "path": "howToApplyPage.requiredDocuments.items[3].description",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-eligibility-heading",
    "path": "howToApplyPage.eligibility.heading",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-eligibility-description",
    "path": "howToApplyPage.eligibility.description",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-eligibility-1",
    "path": "howToApplyPage.eligibility.items[0]",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-eligibility-2",
    "path": "howToApplyPage.eligibility.items[1]",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-eligibility-3",
    "path": "howToApplyPage.eligibility.items[2]",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-eligibility-4",
    "path": "howToApplyPage.eligibility.items[3]",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-ready-heading",
    "path": "howToApplyPage.readyToApply.heading",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-ready-description",
    "path": "howToApplyPage.readyToApply.description",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-ready-whatsapp-label",
    "path": "howToApplyPage.readyToApply.whatsappButtonLabel",
    "page": "how_to_apply.html"
  },
  {
    "id": "how-to-apply-ready-submit-label",
    "path": "howToApplyPage.readyToApply.submitButtonLabel",
    "page": "how_to_apply.html"
  },
  {
    "id": "contact-seo-title",
    "path": "contactUsPage.seo.title",
    "page": "contact.html"
  },
  {
    "id": "contact-seo-description",
    "path": "contactUsPage.seo.description",
    "page": "contact.html"
  },
  {
    "id": "contact-form-heading",
    "path": "contactUsPage.contactForm.heading",
    "page": "contact.html"
  },
  {
    "id": "contact-form-description",
    "path": "contactUsPage.contactForm.description",
    "page": "contact.html"
  },
  {
    "id": "contact-form-submit-label",
    "path": "contactUsPage.contactForm.submitButtonLabel",
    "page": "contact.html"
  },
  {
    "id": "contact-form-image",
    "path": "contactUsPage.contactForm.image",
    "page": "contact.html"
  },
  {
    "id": "contact-method-email-heading",
    "path": "contactUsPage.contactMethods.email.heading",
    "page": "contact.html"
  },
  {
    "id": "contact-method-email-description",
    "path": "contactUsPage.contactMethods.email.description",
    "page": "contact.html"
  },
  {
    "id": "contact-method-phone-heading",
    "path": "contactUsPage.contactMethods.phone.heading",
    "page": "contact.html"
  },
  {
    "id": "contact-method-phone-description",
    "path": "contactUsPage.contactMethods.phone.description",
    "page": "contact.html"
  },
  {
    "id": "contact-method-office-heading",
    "path": "contactUsPage.contactMethods.office.heading",
    "page": "contact.html"
  },
  {
    "id": "contact-method-office-description",
    "path": "contactUsPage.contactMethods.office.description",
    "page": "contact.html"
  },
  {
    "id": "contact-faq-heading",
    "path": "contactUsPage.faq.heading",
    "page": "contact.html"
  },
  {
    "id": "contact-faq-description",
    "path": "contactUsPage.faq.description",
    "page": "contact.html"
  },
  {
    "id": "contact-faq-1-question",
    "path": "contactUsPage.faq.items[0].question",
    "page": "contact.html"
  },
  {
    "id": "contact-faq-1-answer",
    "path": "contactUsPage.faq.items[0].answer",
    "page": "contact.html"
  },
  {
    "id": "contact-faq-2-question",
    "path": "contactUsPage.faq.items[1].question",
    "page": "contact.html"
  },
  {
    "id": "contact-faq-2-answer",
    "path": "contactUsPage.faq.items[1].answer",
    "page": "contact.html"
  },
  {
    "id": "contact-faq-3-question",
    "path": "contactUsPage.faq.items[2].question",
    "page": "contact.html"
  },
  {
    "id": "contact-faq-3-answer",
    "path": "contactUsPage.faq.items[2].answer",
    "page": "contact.html"
  },
  {
    "id": "contact-faq-4-question",
    "path": "contactUsPage.faq.items[3].question",
    "page": "contact.html"
  },
  {
    "id": "contact-faq-4-answer",
    "path": "contactUsPage.faq.items[3].answer",
    "page": "contact.html"
  },
  {
    "id": "contact-faq-5-question",
    "path": "contactUsPage.faq.items[4].question",
    "page": "contact.html"
  },
  {
    "id": "contact-faq-5-answer",
    "path": "contactUsPage.faq.items[4].answer",
    "page": "contact.html"
  },
  {
    "id": "contact-still-have-questions-heading",
    "path": "contactUsPage.stillHaveQuestions.heading",
    "page": "contact.html"
  },
  {
    "id": "contact-still-have-questions-description",
    "path": "contactUsPage.stillHaveQuestions.description",
    "page": "contact.html"
  }
];

function getValue(content: PublicPayloadContent, path: string): unknown {
  return path.replace(/\[(\d+)\]/g, '.$1').split('.').reduce<unknown>((value, key) => (value && typeof value === 'object' ? (value as Record<string, unknown>)[key] : undefined), content);
}

function renderBinding(root: ReturnType<typeof parse>, binding: Binding, value: unknown, content: PublicPayloadContent) {
  if (value == null) return;
  const element = root.querySelector('#' + binding.id);
  if (!element) return;
  if (typeof value === 'object' && 'src' in value) {
    const image = value as { src: string; alt?: string };
    element.setAttribute('src', image.src);
    element.setAttribute('alt', image.alt || '');
    return;
  }
  if (binding.path.endsWith('.seo.description')) { element.setAttribute('content', String(value)); return; }
  if (binding.path.endsWith('.telephoneLinkNumber')) { element.setAttribute('href', 'tel:' + String(value)); return; }
  if (binding.path.endsWith('.whatsappNumber')) { element.setAttribute('href', 'https://wa.me/' + String(value)); return; }
  if (binding.path.endsWith('.defaultWhatsappMessage')) {
    const number = getValue(content, 'siteSettings.contactDetails.whatsappNumber');
    element.setAttribute('href', 'https://wa.me/' + String(number || '') + '?text=' + encodeURIComponent(String(value)));
    return;
  }
  if (binding.path.endsWith('.wazeUrl') || binding.path.endsWith('.googleMapsUrl')) { element.setAttribute('href', String(value)); return; }
  element.set_content(String(value));
}

export function renderLegacyContent(html: string, pageId: SitePageId, content: PublicPayloadContent): string {
  const root = parse(html, { blockTextElements: { script: true, style: true, pre: true, noscript: true } });
  for (const binding of bindings) {
    if (binding.page == null || binding.page === ({ home: 'index.html', aboutUs: 'about_us.html', loan: 'loan.html', howToApply: 'how_to_apply.html', contactUs: 'contact.html' } as const)[pageId]) renderBinding(root, binding, getValue(content, binding.path), content);
  }
  return root.toString();
}
