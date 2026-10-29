/**
 * The ASTAMALL Privacy Policy, in English and Bahasa Malaysia.
 *
 * The legal text lives here and nowhere else: the page component only lays it out. Keep both languages in step.
 * Section and subsection numbers drive the anchor IDs (#section-3, #section-3-2), so a reader who switches
 * language lands on the matching section; the same number must mean the same section in both languages.
 *
 * Text conventions: **bold** marks emphasis or a label, and the contact email address and website address become
 * links wherever they appear.
 */

export type PolicyLocale = 'en' | 'ms';

/** A paragraph, a list of points, or a short table of labelled details. */
export type PolicyBlock = string | { list: string[] } | { title: string; facts: [string, string][] };

export type PolicySubsection = { number: string; title: string; blocks: PolicyBlock[] };

/** `closing` holds text that follows a section's subsections. */
export type PolicySection = { number: number; title: string; blocks: PolicyBlock[]; subsections?: PolicySubsection[]; closing?: PolicyBlock[] };

export type PrivacyPolicy = {
  /** BCP 47 language tag, used for the lang attribute. */
  lang: string;
  /** Open Graph locale. */
  ogLocale: string;
  path: string;
  title: string;
  description: string;
  updatedLabel: string;
  updated: string;
  /** Operator and contact details shown under the heading. */
  meta: [string, string][];
  contentsLabel: string;
  languageLabel: string;
  languageName: string;
  sections: PolicySection[];
  /** Closing lines after the last section. */
  colophon: string[];
};

export const company = {
  legalName: 'ASTA MALL PLT',
  registration: '202604002255',
  website: 'https://www.astamall.com.my',
  email: 'astamall92@gmail.com',
  /** ISO date of the last update, for machine-readable metadata. */
  updated: '2026-10-01',
};

export const POLICY_SECTION_COUNT = 21;

export const privacyPolicy: Record<PolicyLocale, PrivacyPolicy> = {
  en: {
    lang: 'en-MY',
    ogLocale: 'en_MY',
    path: '/privacy-policy',
    title: 'Privacy Policy',
    description: 'How ASTA MALL PLT collects, uses, discloses and protects personal data when you use ASTAMALL.',
    updatedLabel: 'Last updated',
    updated: '1 October 2026',
    meta: [
      ['Operated by', company.legalName],
      ['Business Registration Number', company.registration],
      ['Website', company.website],
      ['Contact Email', company.email],
    ],
    contentsLabel: 'Contents',
    languageLabel: 'Language',
    languageName: 'English',
    sections: [
      {
        "number": 1,
        "title": "Introduction",
        "blocks": [
          "Welcome to ASTAMALL (\"ASTAMALL\", \"we\", \"us\", or \"our\").",
          "ASTAMALL is a beauty and wellness brand offering skincare, cosmetics, beauty products, health foods, wellness products and related merchandise.",
          "We respect your privacy and are committed to protecting the personal data you share with us.",
          "This Privacy Policy explains how ASTAMALL, operated by ASTA MALL PLT (Business Registration Number: 202604002255) (the \"Company\"), collects, uses, processes, stores, discloses and protects your personal data when you visit our website, purchase our products, create an account, subscribe to marketing communications, participate in promotions or otherwise interact with us.",
          "This Policy is prepared with reference to Malaysia's Personal Data Protection Act 2010 (Act 709), as amended, and other applicable laws and regulations.",
          "By providing your personal data to us, you acknowledge that you have been informed of the practices described in this Privacy Policy. Where consent is required by law, we will seek that consent separately or through an appropriate consent mechanism.",
          "Please read this Policy carefully before using our services or providing your personal information."
        ]
      },
      {
        "number": 2,
        "title": "Scope of This Privacy Policy",
        "blocks": [
          "This Privacy Policy applies to personal data processed by ASTAMALL through:",
          {
            "list": [
              "Our official e-commerce website and associated checkout services.",
              "Customer account registration and management.",
              "Product purchases, payment processing, shipping and delivery.",
              "Customer service, enquiries and after-sales support.",
              "Email, telephone, WhatsApp and other communication channels.",
              "Social media interactions, including Instagram, Facebook and TikTok.",
              "Marketing campaigns, giveaways, promotional events and customer surveys.",
              "Product reviews, testimonials and customer-submitted content.",
              "Official third-party marketplaces where ASTAMALL acts as the seller."
            ]
          },
          "Where you use an external marketplace, payment provider, social media platform or other third-party service, that provider may also process your information independently under its own privacy policy.",
          "This Privacy Policy applies only to ASTAMALL's handling of personal data and does not replace the separate privacy policies of those third parties."
        ]
      },
      {
        "number": 3,
        "title": "Personal Data We Collect",
        "blocks": [
          "Depending on how you interact with ASTAMALL, we may collect the following categories of personal data."
        ],
        "subsections": [
          {
            "number": "3.1",
            "title": "Personal Identification and Contact Information",
            "blocks": [
              {
                "list": [
                  "Full name.",
                  "Email address.",
                  "Mobile or telephone number.",
                  "Billing and shipping addresses.",
                  "Recipient name and contact information.",
                  "Username or customer account identifier.",
                  "Other contact details voluntarily provided by you."
                ]
              },
              "We do not ordinarily require your national identification card or passport number to purchase our products. Such information will only be requested where reasonably necessary and legally permitted."
            ]
          },
          {
            "number": "3.2",
            "title": "Account Information",
            "blocks": [
              "Where customer accounts are available, we may collect:",
              {
                "list": [
                  "Account registration information.",
                  "Login credentials or securely processed authentication information.",
                  "Saved delivery addresses.",
                  "Purchase history.",
                  "Account preferences.",
                  "Wishlists and saved products.",
                  "Communication and marketing preferences."
                ]
              },
              "We will not ask you to disclose your account password through email, WhatsApp or unsolicited messages."
            ]
          },
          {
            "number": "3.3",
            "title": "Purchase and Transaction Information",
            "blocks": [
              "When you purchase products from ASTAMALL, we may collect:",
              {
                "list": [
                  "Products purchased.",
                  "Order number and transaction reference.",
                  "Order date and purchase amount.",
                  "Applicable discounts and promotional codes.",
                  "Payment method and payment status.",
                  "Billing information.",
                  "Delivery instructions and tracking details.",
                  "Refunds, cancellations and return records."
                ]
              }
            ]
          },
          {
            "number": "3.4",
            "title": "Payment Information",
            "blocks": [
              "Payments may be processed by authorised third-party payment service providers, including Billplz where integrated, and their participating banks, card networks or payment partners.",
              "Depending on the payment method, these providers may process payment-related information such as banking selections, card information, transaction identifiers and payment authentication details.",
              "ASTAMALL generally receives transaction confirmations, payment references, payment status and other details reasonably required to administer orders, reconcile payments, resolve disputes and process refunds.",
              "Where a hosted third-party payment flow is used, ASTAMALL does not intentionally collect or store full payment card numbers, card security codes (CVV/CVC) or online banking passwords on its own servers."
            ]
          },
          {
            "number": "3.5",
            "title": "Website Usage and Technical Information",
            "blocks": [
              "When you interact with our website, certain technical information may be collected automatically, including:",
              {
                "list": [
                  "IP address.",
                  "Browser type and version.",
                  "Device type and operating system.",
                  "Website pages visited.",
                  "Date and time of access.",
                  "Referral sources.",
                  "Session identifiers.",
                  "Shopping cart interactions.",
                  "General location inferred from technical information.",
                  "Website performance, diagnostic and security records."
                ]
              }
            ]
          },
          {
            "number": "3.6",
            "title": "Marketing and Preference Information",
            "blocks": [
              "Where applicable, we may collect:",
              {
                "list": [
                  "Newsletter subscription preferences.",
                  "Product interests and shopping preferences.",
                  "Responses to marketing campaigns.",
                  "Promotional participation records.",
                  "Survey responses.",
                  "Advertising interactions.",
                  "Communication preferences and consent records."
                ]
              }
            ]
          },
          {
            "number": "3.7",
            "title": "Customer Communications and User-Submitted Content",
            "blocks": [
              "We may retain information that you voluntarily provide through:",
              {
                "list": [
                  "Customer service messages.",
                  "Email or WhatsApp enquiries.",
                  "Product feedback.",
                  "Ratings and reviews.",
                  "Customer photographs or videos.",
                  "Testimonials.",
                  "Social media messages, comments or mentions.",
                  "Contest or giveaway submissions."
                ]
              },
              "Please avoid submitting sensitive personal information, including detailed medical information, unless specifically requested for a legitimate purpose.",
              "If sensitive personal data is necessary, we will process it only in accordance with applicable legal requirements, including obtaining explicit consent where required."
            ]
          }
        ]
      },
      {
        "number": 4,
        "title": "How We Collect Personal Data",
        "blocks": [
          "We may obtain your personal data from the following sources:",
          "**Directly from you:** When you place an order, create an account, submit a form, contact customer service, join a promotion or communicate with ASTAMALL.",
          "**Automatically through our website:** Through website functionality, security systems, cookies and similar technologies where implemented.",
          "**From service providers:** Through payment providers, logistics partners, customer support systems and other service providers involved in completing your transactions.",
          "**From third-party platforms:** Through marketplace orders, social media interactions or advertising platforms, subject to the relevant platform's privacy arrangements and your settings.",
          "**From other individuals:** For example, when a customer provides a recipient's delivery information for a gift order.",
          "We only seek to collect personal data that is reasonably necessary for the stated purposes."
        ]
      },
      {
        "number": 5,
        "title": "How We Use Your Personal Data",
        "blocks": [
          "ASTAMALL may process your personal data for the following purposes."
        ],
        "subsections": [
          {
            "number": "5.1",
            "title": "Processing and Fulfilling Orders",
            "blocks": [
              {
                "list": [
                  "Confirming orders and purchases.",
                  "Processing payments and verifying transactions.",
                  "Preparing invoices and receipts.",
                  "Packing and dispatching products.",
                  "Arranging delivery and tracking shipments.",
                  "Handling cancellations, exchanges, returns and refunds.",
                  "Resolving payment or delivery problems."
                ]
              }
            ]
          },
          {
            "number": "5.2",
            "title": "Customer Service and Communication",
            "blocks": [
              {
                "list": [
                  "Responding to enquiries and complaints.",
                  "Providing order and delivery updates.",
                  "Answering product-related questions.",
                  "Managing after-sales enquiries.",
                  "Communicating important service or policy changes.",
                  "Maintaining records of customer support interactions."
                ]
              }
            ]
          },
          {
            "number": "5.3",
            "title": "Website and Account Management",
            "blocks": [
              {
                "list": [
                  "Creating and maintaining customer accounts.",
                  "Managing shopping carts and checkout sessions.",
                  "Saving permitted customer preferences.",
                  "Maintaining website functionality and accessibility.",
                  "Diagnosing technical errors.",
                  "Improving website security and performance."
                ]
              }
            ]
          },
          {
            "number": "5.4",
            "title": "Marketing and Promotions",
            "blocks": [
              "Where permitted and subject to your applicable choices or consent, we may:",
              {
                "list": [
                  "Send product launches and promotional offers.",
                  "Share newsletters and beauty or wellness educational content.",
                  "Offer discounts, vouchers and seasonal promotions.",
                  "Conduct customer surveys and promotional campaigns.",
                  "Provide personalised product recommendations.",
                  "Measure advertising effectiveness.",
                  "Display relevant advertisements through advertising platforms where applicable."
                ]
              },
              "You may withdraw consent or opt out of direct marketing communications as described in Section 11."
            ]
          },
          {
            "number": "5.5",
            "title": "Business Analysis and Improvement",
            "blocks": [
              "We may analyse customer purchases, website performance, product demand and customer feedback to:",
              {
                "list": [
                  "Improve our products and shopping experience.",
                  "Understand customer preferences.",
                  "Manage inventory and product availability.",
                  "Assess campaign performance.",
                  "Improve customer support and delivery operations.",
                  "Develop new products and services."
                ]
              },
              "Where reasonably possible, we may use aggregated or anonymised information for business analytics."
            ]
          },
          {
            "number": "5.6",
            "title": "Fraud Prevention, Security and Legal Compliance",
            "blocks": [
              "We may process personal data to:",
              {
                "list": [
                  "Detect and prevent fraudulent transactions.",
                  "Prevent unauthorised access and account misuse.",
                  "Investigate suspected security incidents.",
                  "Maintain accurate business and accounting records.",
                  "Meet applicable tax, regulatory and legal obligations.",
                  "Respond to lawful requests from competent authorities.",
                  "Establish, exercise or defend legal rights."
                ]
              }
            ]
          }
        ]
      },
      {
        "number": 6,
        "title": "Consent, Processing Requirements and Customer Choices",
        "blocks": [
          "ASTAMALL processes personal data for lawful purposes connected with its business activities, subject to the requirements of applicable Malaysian data protection laws.",
          "Where consent is required, we will obtain it in an appropriate manner. Certain processing may also be permitted by law in circumstances where consent is not required.",
          "We will seek separate consent where legally necessary, including for particular marketing activities or sensitive personal data processing.",
          "You may withdraw previously provided consent by contacting us using the details in Section 20.",
          "Withdrawal of consent will not invalidate processing lawfully carried out before your withdrawal. It may also affect our ability to provide certain services, and some information may still need to be retained or processed where permitted or required by law."
        ]
      },
      {
        "number": 7,
        "title": "Mandatory and Optional Information",
        "blocks": [
          "Certain personal data is necessary to process your orders or provide requested services.",
          "For example, your name, contact information, delivery address and necessary transaction details may be required to confirm and fulfil a purchase.",
          "If you do not provide necessary information, we may be unable to:",
          {
            "list": [
              "Process or complete your order.",
              "Deliver purchased products.",
              "Verify payment.",
              "Provide requested customer support.",
              "Arrange a refund or return.",
              "Create or maintain a requested customer account."
            ]
          },
          "Other information, such as optional survey responses, product preferences and marketing subscriptions, is voluntary.",
          "Declining optional marketing activities will not prevent you from making ordinary purchases from ASTAMALL."
        ]
      },
      {
        "number": 8,
        "title": "Disclosure and Sharing of Personal Data",
        "blocks": [
          "ASTAMALL does not sell customer personal data as a standalone commercial product.",
          "We may disclose personal data to selected third parties where necessary for legitimate business purposes, permitted by law or authorised through appropriate consent.",
          "These recipients may include:"
        ],
        "subsections": [
          {
            "number": "8.1",
            "title": "Payment Service Providers",
            "blocks": [
              "Payment gateways, banks, payment networks, fraud prevention providers and other financial service partners responsible for processing or verifying payments."
            ]
          },
          {
            "number": "8.2",
            "title": "Logistics and Delivery Partners",
            "blocks": [
              "Courier companies, fulfilment services and delivery partners responsible for shipping and delivering orders.",
              "This may include SPX, DEX, Lalamove or other delivery partners actually engaged by ASTAMALL.",
              "Only information reasonably necessary for delivery, such as recipient name, delivery address, telephone number and order-related details, will be disclosed."
            ]
          },
          {
            "number": "8.3",
            "title": "Technology and Website Service Providers",
            "blocks": [
              "Website hosting providers, infrastructure and database providers, email providers, website maintenance providers, customer support systems and other technology providers supporting our operations.",
              "These may include Vercel and other providers used to operate the website."
            ]
          },
          {
            "number": "8.4",
            "title": "Analytics and Advertising Partners",
            "blocks": [
              "Where enabled and permitted, we may share relevant website usage data or technical identifiers with analytics and advertising services, such as Google Analytics, Google Ads or Meta advertising technologies.",
              "Such processing is subject to applicable consent requirements, your available privacy choices and the relevant provider's own data protection practices."
            ]
          },
          {
            "number": "8.5",
            "title": "Professional Advisers and Business Service Providers",
            "blocks": [
              "Accountants, auditors, legal advisers, insurers and professional service providers where reasonably necessary for our business administration, compliance or legal interests."
            ]
          },
          {
            "number": "8.6",
            "title": "Legal and Regulatory Authorities",
            "blocks": [
              "Government bodies, regulators, law enforcement agencies, courts or other authorised parties when disclosure is required or permitted by applicable law."
            ]
          },
          {
            "number": "8.7",
            "title": "Corporate Transactions",
            "blocks": [
              "In connection with a genuine business reorganisation, merger, acquisition, restructuring or transfer of business assets, personal data may be disclosed to relevant parties subject to applicable safeguards and legal requirements."
            ]
          }
        ],
        "closing": [
          "We require service providers processing personal data on our behalf to handle it in accordance with relevant contractual obligations and applicable law.",
          "We do not authorise service providers to use customer personal data for unrelated purposes outside their authorised processing arrangements."
        ]
      },
      {
        "number": 9,
        "title": "International Transfers of Personal Data",
        "blocks": [
          "ASTAMALL operates in Malaysia. However, some technology, hosting, payment, analytics, communication or support service providers may process or store personal data outside Malaysia.",
          "This may involve transfers of personal data to countries where those service providers or their infrastructure are located.",
          "Where personal data is transferred outside Malaysia, we will take appropriate steps to comply with applicable requirements under the PDPA, including Section 129 where relevant.",
          "Such steps may include assessing the destination's data protection standards, using appropriate contractual safeguards, relying on legally permitted transfer conditions or obtaining consent where required.",
          "We seek to ensure that overseas transfers are limited to appropriate purposes and that reasonable protections are maintained."
        ]
      },
      {
        "number": 10,
        "title": "Cookies and Similar Technologies",
        "blocks": [
          "Our website may use cookies and similar technologies to support functionality, remember preferences, improve performance, understand visitor behaviour and support marketing activities.",
          "Cookies are small files stored on your device when you visit a website.",
          "**Types of Cookies**",
          "**Essential Cookies:** Required for basic website features such as shopping carts, checkout sessions, account authentication, website security and fraud prevention.",
          "**Functional Cookies:** Help remember customer preferences such as language, session settings or other optional website features.",
          "**Analytics Cookies:** Help us understand how visitors interact with our website, including page visits, performance and shopping behaviour.",
          "**Marketing Cookies:** May be used to measure advertising performance, understand campaign interactions and deliver more relevant advertisements.",
          "Where non-essential cookies or tracking technologies require consent, we will provide appropriate consent choices before activating them.",
          "Where available, you may manage non-essential cookies through our cookie preferences interface or through your browser settings.",
          "Blocking some cookies may affect certain website functions.",
          "For further information, please refer to our Cookie Policy, where published."
        ]
      },
      {
        "number": 11,
        "title": "Marketing Communications and Advertising Preferences",
        "blocks": [
          "ASTAMALL may communicate with customers through email, SMS, WhatsApp or other channels in connection with purchases, customer service or promotional activities.",
          "Transactional communications include order confirmations, payment updates, delivery notifications and other necessary service-related messages.",
          "Marketing communications may include product announcements, seasonal promotions, discounts, newsletters, educational content and special offers.",
          "Where legally required, we will obtain your consent before sending promotional communications.",
          "You may opt out of marketing communications by:",
          {
            "list": [
              "Clicking the unsubscribe link provided in eligible marketing emails.",
              "Using available subscription preference controls.",
              "Replying with an opt-out request where supported.",
              "Contacting ASTAMALL through our official contact details."
            ]
          },
          "We will process direct marketing opt-out requests in accordance with applicable law.",
          "Opting out of promotional communications does not prevent us from sending necessary transactional or customer service messages."
        ]
      },
      {
        "number": 12,
        "title": "Data Storage and Retention",
        "blocks": [
          "ASTAMALL retains personal data only for as long as reasonably necessary to fulfil the purposes described in this Privacy Policy or as otherwise required or permitted by law.",
          "Retention periods depend on the type of information and the purposes for which it is processed.",
          "For example:",
          {
            "list": [
              "**Order and transaction records:** Retained for accounting, taxation, auditing, dispute resolution and applicable legal requirements.",
              "**Customer account information:** Retained while an account remains active and for a reasonable period thereafter where necessary.",
              "**Customer service records:** Retained for as long as reasonably necessary to resolve enquiries, maintain business records and handle disputes.",
              "**Marketing records:** Retained while necessary for authorised marketing activities, with appropriate opt-out and suppression records maintained where required.",
              "**Website and security logs:** Retained for appropriate operational, security, troubleshooting and compliance purposes."
            ]
          },
          "Certain accounting and taxation records may be subject to statutory retention requirements, including seven-year requirements where applicable.",
          "When personal data is no longer required and there is no legal or legitimate basis for further retention, we will take reasonable steps to securely delete, destroy or anonymise it."
        ]
      },
      {
        "number": 13,
        "title": "Protection and Security of Personal Data",
        "blocks": [
          "ASTAMALL takes the security of customer personal data seriously.",
          "We implement and maintain reasonable administrative, technical and organisational safeguards appropriate to the personal data we process and the risks involved.",
          "Depending on the systems and services involved, these safeguards may include:",
          {
            "list": [
              "Secure website connections and encrypted data transmission.",
              "Appropriate access controls.",
              "Secure handling of authentication credentials.",
              "Restricted access to customer information.",
              "Payment processing through appropriate payment service providers.",
              "System maintenance and security updates.",
              "Monitoring for suspicious activity.",
              "Reasonable controls for service providers handling customer information.",
              "Secure backup and recovery arrangements where appropriate."
            ]
          },
          "Although we take reasonable precautions, no internet transmission, electronic storage system or security method can be guaranteed to be completely secure.",
          "If a personal data breach occurs, we will investigate, take appropriate remedial measures and notify the relevant authorities and affected individuals where required by applicable law.",
          "Customers are encouraged to protect their account credentials and notify us promptly if they suspect unauthorised activity involving their account."
        ]
      },
      {
        "number": 14,
        "title": "Your Personal Data Rights",
        "blocks": [
          "Subject to the PDPA and other applicable laws, you may have the following rights concerning your personal data."
        ],
        "subsections": [
          {
            "number": "14.1",
            "title": "Right to Access",
            "blocks": [
              "You may request access to personal data that ASTAMALL holds about you, subject to applicable legal conditions and exceptions."
            ]
          },
          {
            "number": "14.2",
            "title": "Right to Correction",
            "blocks": [
              "You may request correction of personal data that is inaccurate, incomplete, misleading or out of date."
            ]
          },
          {
            "number": "14.3",
            "title": "Right to Withdraw Consent",
            "blocks": [
              "Where personal data processing is based on your consent, you may withdraw that consent, subject to applicable legal requirements and consequences."
            ]
          },
          {
            "number": "14.4",
            "title": "Right to Prevent Direct Marketing",
            "blocks": [
              "You may request that ASTAMALL stop processing your personal data for direct marketing purposes."
            ]
          },
          {
            "number": "14.5",
            "title": "Right to Prevent Certain Processing",
            "blocks": [
              "You may request that we cease or limit processing in circumstances recognised under the PDPA, including certain processing likely to cause unwarranted substantial damage or distress."
            ]
          },
          {
            "number": "14.6",
            "title": "Right to Data Portability",
            "blocks": [
              "Where applicable and subject to technical feasibility, compatibility of data formats and relevant legal requirements, you may request the electronic transmission of eligible personal data to another data controller of your choice."
            ]
          },
          {
            "number": "14.7",
            "title": "Requests for Account Closure or Data Deletion",
            "blocks": [
              "You may request account closure or ask us to delete personal data that is no longer necessary.",
              "We will evaluate such requests under applicable law. Some information may need to be retained for legal compliance, accounting, fraud prevention, dispute resolution or other lawful purposes."
            ]
          },
          {
            "number": "14.8",
            "title": "Exercising Your Rights",
            "blocks": [
              "To submit a request, please contact ASTAMALL using the privacy contact channel published on our official website once available.",
              "**Privacy Contact:** astamall92@gmail.com",
              "**Subject:** Personal Data Request – ASTAMALL",
              "We may request reasonable information to verify your identity before acting on your request.",
              "We will respond within the timeframes applicable under Malaysian law. Where legally permitted, an administrative fee may apply to certain access requests.",
              "If you have a privacy-related complaint, you may also contact the Personal Data Protection Commissioner of Malaysia through its official channels."
            ]
          }
        ]
      },
      {
        "number": 15,
        "title": "Children's Privacy",
        "blocks": [
          "ASTAMALL's e-commerce services are intended primarily for adults.",
          "We do not knowingly seek to collect personal data directly from children for independent commercial purchases or marketing without appropriate parental or guardian involvement where required by law.",
          "Individuals under 18 should obtain permission from a parent or legal guardian before making purchases or submitting personal information through our website.",
          "If we become aware that personal data has been collected from a child in circumstances that do not meet applicable legal requirements, we will take appropriate steps to address the matter.",
          "Parents or guardians may contact us regarding concerns about a child's personal information."
        ]
      },
      {
        "number": 16,
        "title": "Product Reviews, Testimonials and User-Generated Content",
        "blocks": [
          "ASTAMALL may allow customers to submit product reviews, testimonials, photographs, videos or other user-generated content.",
          "If you voluntarily submit content for public display, information included in that content may become visible to other website visitors.",
          "We encourage customers not to include private contact information, identification details or other sensitive information in publicly visible reviews.",
          "Where we wish to reuse identifiable customer photographs, videos or testimonials for separate promotional purposes, we will obtain appropriate permission or otherwise ensure that such use is legally authorised.",
          "Requests regarding personal information appearing in reviews or other customer content may be sent through our designated privacy contact channel."
        ]
      },
      {
        "number": 17,
        "title": "Gift Orders and Third-Party Recipient Information",
        "blocks": [
          "Where you purchase products for another person, you may provide their name, delivery address and contact information.",
          "You should ensure that you are authorised to provide those details or have otherwise lawfully obtained them for the purpose of fulfilling the order.",
          "ASTAMALL will use recipient information primarily to process and deliver the relevant purchase, manage delivery-related communications and resolve delivery problems.",
          "We will not automatically treat a gift recipient as a marketing subscriber simply because their delivery information was provided."
        ]
      },
      {
        "number": 18,
        "title": "Third-Party Websites and Social Media Platforms",
        "blocks": [
          "Our website may contain links to external websites, social media pages, marketplaces or third-party services.",
          "These services operate under their own privacy policies and terms.",
          "ASTAMALL is not responsible for the privacy or security practices of independent third-party websites that we do not control.",
          "We encourage you to review the relevant privacy policies before providing personal information to third-party platforms."
        ]
      },
      {
        "number": 19,
        "title": "Automated Processing and Personalisation",
        "blocks": [
          "ASTAMALL may use website analytics, recommendation tools or automated security systems to improve customer experience, recommend products, identify possible fraudulent activity or support website operations.",
          "Where automated processing involves personal data, we will take reasonable steps to comply with applicable data protection requirements.",
          "We will provide applicable rights and safeguards for automated decisions where required by law."
        ]
      },
      {
        "number": 20,
        "title": "Contact Information",
        "blocks": [
          "For questions, requests, complaints, or concerns relating to this Privacy Policy or the processing of your personal data, please contact us at astamall92@gmail.com.",
          {
            "title": "ASTAMALL – Privacy Enquiries",
            "facts": [
              [
                "Legal Entity",
                "ASTA MALL PLT"
              ],
              [
                "Business Registration Number",
                "202604002255"
              ],
              [
                "Website",
                "https://www.astamall.com.my"
              ],
              [
                "Contact Email",
                "astamall92@gmail.com"
              ],
              [
                "Last Updated",
                "1 October 2026"
              ]
            ]
          },
          "When submitting a personal data request, please use the subject line:",
          "**Personal Data Request – ASTAMALL**",
          "We may request reasonable information to verify your identity before processing your request. All requests will be handled in accordance with applicable Malaysian law.",
          "We will review and address privacy-related enquiries in accordance with applicable legal requirements."
        ]
      },
      {
        "number": 21,
        "title": "Updates and Language of This Privacy Policy",
        "blocks": [
          "ASTAMALL may update this Privacy Policy from time to time to reflect changes in business operations, website functionality, service providers, legal requirements or personal data processing practices.",
          "The updated version will be published on our official website with a revised \"Last Updated\" date.",
          "Where required by applicable law, we will provide additional notice or obtain fresh consent before implementing material changes to relevant personal data processing activities.",
          "This Privacy Policy will be made available in English and Bahasa Malaysia.",
          "In the event of any inconsistency between the two language versions, the English version will prevail to the extent permitted by applicable Malaysian law."
        ]
      }
    ],
    colophon: [
      '© 2026 ASTAMALL. All rights reserved.',
      'Operated by ASTA MALL PLT (Business Registration Number: 202604002255).',
      'Website: https://www.astamall.com.my',
    ],
  },
  ms: {
    lang: 'ms-MY',
    ogLocale: 'ms_MY',
    path: '/ms/privacy-policy',
    title: 'Polisi Privasi',
    description: 'Bagaimana ASTA MALL PLT mengumpul, menggunakan, mendedahkan dan melindungi data peribadi apabila anda menggunakan ASTAMALL.',
    updatedLabel: 'Tarikh kemas kini terakhir',
    updated: '1 Oktober 2026',
    meta: [
      ['Dikendalikan Oleh', company.legalName],
      ['Nombor Pendaftaran Perniagaan', company.registration],
      ['Laman Web', company.website],
      ['E-mel Perhubungan', company.email],
    ],
    contentsLabel: 'Kandungan',
    languageLabel: 'Bahasa',
    languageName: 'Bahasa Melayu',
    sections: [
      {
        "number": 1,
        "title": "Pengenalan",
        "blocks": [
          "Selamat datang ke ASTAMALL (“ASTAMALL”, “kami” atau “pihak kami”).",
          "ASTAMALL ialah jenama kecantikan dan kesejahteraan yang menawarkan produk penjagaan kulit, kosmetik, produk kecantikan, makanan kesihatan, produk kesejahteraan dan barangan berkaitan.",
          "Kami menghormati privasi anda dan komited untuk melindungi data peribadi yang anda berikan kepada kami.",
          "Polisi Privasi ini menerangkan cara ASTAMALL, yang dikendalikan oleh ASTA MALL PLT (Nombor Pendaftaran Perniagaan: 202604002255) (“Syarikat”), mengumpul, menggunakan, memproses, menyimpan, mendedahkan dan melindungi data peribadi anda apabila anda melayari laman web kami, membeli produk, mendaftar akaun, melanggan komunikasi pemasaran, menyertai promosi atau berinteraksi dengan kami.",
          "Polisi ini disediakan dengan merujuk kepada Akta Perlindungan Data Peribadi 2010 (Akta 709), sebagaimana yang dipinda, serta undang-undang dan peraturan lain yang terpakai di Malaysia.",
          "Dengan memberikan data peribadi kepada kami, anda mengakui bahawa anda telah dimaklumkan mengenai amalan yang diterangkan dalam Polisi ini. Kami akan mendapatkan persetujuan anda melalui mekanisme yang sesuai apabila dikehendaki oleh undang-undang.",
          "Sila baca Polisi ini dengan teliti sebelum menggunakan perkhidmatan kami."
        ]
      },
      {
        "number": 2,
        "title": "Skop Polisi Privasi",
        "blocks": [
          "Polisi ini terpakai kepada data peribadi yang diproses oleh ASTAMALL melalui:",
          {
            "list": [
              "Laman web e-dagang rasmi dan perkhidmatan pembayaran.",
              "Pendaftaran dan pengurusan akaun pelanggan.",
              "Pembelian produk, pembayaran, penghantaran dan penyerahan pesanan.",
              "Khidmat pelanggan dan sokongan selepas jualan.",
              "Komunikasi melalui e-mel, telefon, WhatsApp dan saluran lain.",
              "Interaksi media sosial termasuk Instagram, Facebook dan TikTok.",
              "Kempen pemasaran, hadiah, promosi dan tinjauan pelanggan.",
              "Ulasan produk, testimoni dan kandungan yang dihantar oleh pelanggan.",
              "Platform e-dagang pihak ketiga apabila ASTAMALL bertindak sebagai penjual."
            ]
          },
          "Platform pihak ketiga mungkin turut memproses maklumat anda secara berasingan mengikut polisi privasi masing-masing.",
          "Polisi ini hanya mengawal pengendalian data peribadi oleh ASTAMALL dan tidak menggantikan polisi privasi pihak ketiga."
        ]
      },
      {
        "number": 3,
        "title": "Jenis Data Peribadi yang Dikumpulkan",
        "blocks": [
          "Bergantung pada cara anda berinteraksi dengan kami, ASTAMALL mungkin mengumpul maklumat berikut."
        ],
        "subsections": [
          {
            "number": "3.1",
            "title": "Maklumat Pengenalan dan Perhubungan",
            "blocks": [
              {
                "list": [
                  "Nama penuh.",
                  "Alamat e-mel.",
                  "Nombor telefon.",
                  "Alamat pengebilan dan penghantaran.",
                  "Nama dan maklumat penerima.",
                  "Nama pengguna atau pengenal pasti akaun.",
                  "Maklumat perhubungan lain yang diberikan secara sukarela."
                ]
              },
              "Kami biasanya tidak memerlukan nombor kad pengenalan atau pasport untuk pembelian biasa, kecuali apabila maklumat tersebut benar-benar diperlukan dan dibenarkan oleh undang-undang."
            ]
          },
          {
            "number": "3.2",
            "title": "Maklumat Akaun",
            "blocks": [
              "Sekiranya fungsi akaun pelanggan disediakan, maklumat yang diproses mungkin termasuk:",
              {
                "list": [
                  "Maklumat pendaftaran.",
                  "Maklumat pengesahan identiti dan log masuk.",
                  "Alamat penghantaran tersimpan.",
                  "Sejarah pembelian.",
                  "Pilihan dan tetapan akaun.",
                  "Senarai produk kegemaran.",
                  "Pilihan komunikasi dan pemasaran."
                ]
              },
              "Kami tidak akan meminta kata laluan akaun anda melalui e-mel, WhatsApp atau mesej yang tidak diminta."
            ]
          },
          {
            "number": "3.3",
            "title": "Maklumat Pesanan dan Transaksi",
            "blocks": [
              {
                "list": [
                  "Produk yang dibeli.",
                  "Nombor pesanan dan rujukan transaksi.",
                  "Tarikh serta jumlah pembelian.",
                  "Kod promosi dan diskaun.",
                  "Kaedah dan status pembayaran.",
                  "Maklumat pengebilan.",
                  "Arahan penghantaran dan nombor penjejakan.",
                  "Rekod pemulangan, pembatalan dan bayaran balik."
                ]
              }
            ]
          },
          {
            "number": "3.4",
            "title": "Maklumat Pembayaran",
            "blocks": [
              "Pembayaran boleh diproses melalui penyedia perkhidmatan pembayaran pihak ketiga yang dibenarkan, termasuk Billplz apabila diintegrasikan, serta bank dan rakan pembayaran yang berkaitan.",
              "Penyedia tersebut mungkin memproses maklumat pembayaran seperti pilihan bank, maklumat kad, pengenal pasti transaksi dan maklumat pengesahan pembayaran.",
              "ASTAMALL biasanya menerima pengesahan transaksi, nombor rujukan, status pembayaran dan maklumat yang diperlukan untuk mengurus pesanan, menyemak transaksi, menyelesaikan pertikaian dan memproses bayaran balik.",
              "Apabila pembayaran dikendalikan melalui halaman pembayaran pihak ketiga, ASTAMALL tidak sengaja mengumpul atau menyimpan nombor kad pembayaran penuh, kod keselamatan kad (CVV/CVC) atau kata laluan perbankan dalam talian pada pelayan sendiri."
            ]
          },
          {
            "number": "3.5",
            "title": "Maklumat Teknikal dan Penggunaan Laman Web",
            "blocks": [
              "Kami mungkin mengumpul:",
              {
                "list": [
                  "Alamat IP.",
                  "Jenis dan versi pelayar.",
                  "Jenis peranti dan sistem operasi.",
                  "Halaman yang dilawati.",
                  "Tarikh dan masa akses.",
                  "Sumber rujukan pelawat.",
                  "Pengenal pasti sesi.",
                  "Aktiviti troli pembelian.",
                  "Anggaran lokasi berdasarkan maklumat teknikal.",
                  "Rekod prestasi, diagnostik dan keselamatan laman web."
                ]
              }
            ]
          },
          {
            "number": "3.6",
            "title": "Maklumat Pemasaran dan Pilihan Pelanggan",
            "blocks": [
              {
                "list": [
                  "Pilihan langganan berita.",
                  "Minat terhadap produk.",
                  "Penyertaan kempen.",
                  "Jawapan tinjauan.",
                  "Interaksi pengiklanan.",
                  "Pilihan komunikasi dan rekod persetujuan."
                ]
              }
            ]
          },
          {
            "number": "3.7",
            "title": "Komunikasi dan Kandungan Pelanggan",
            "blocks": [
              "Kami mungkin menyimpan maklumat yang anda berikan melalui pertanyaan, mesej, ulasan, penilaian, gambar, video, testimoni, komen media sosial dan penyertaan promosi.",
              "Elakkan daripada menghantar maklumat sensitif seperti maklumat perubatan terperinci melainkan diperlukan untuk tujuan yang sah.",
              "Jika pemprosesan data peribadi sensitif diperlukan, kami akan mematuhi keperluan undang-undang yang berkaitan, termasuk mendapatkan persetujuan nyata apabila diperlukan."
            ]
          }
        ]
      },
      {
        "number": 4,
        "title": "Cara Kami Mengumpul Data",
        "blocks": [
          "Kami mungkin memperoleh data peribadi:",
          "**Secara langsung daripada anda:** Melalui pesanan, pendaftaran, borang, komunikasi dan penyertaan promosi.",
          "**Secara automatik:** Melalui fungsi laman web, sistem keselamatan, kuki dan teknologi berkaitan.",
          "**Daripada penyedia perkhidmatan:** Termasuk penyedia pembayaran, kurier, sistem sokongan pelanggan dan rakan operasi.",
          "**Daripada platform pihak ketiga:** Termasuk platform e-dagang, media sosial dan pengiklanan, tertakluk kepada pengaturan privasi yang berkaitan.",
          "**Daripada individu lain:** Contohnya, apabila seseorang membeli hadiah dan memberikan maklumat penerima.",
          "Kami berusaha mengehadkan pengumpulan kepada maklumat yang munasabah dan diperlukan bagi tujuan yang dinyatakan."
        ]
      },
      {
        "number": 5,
        "title": "Tujuan Penggunaan Data Peribadi",
        "blocks": [],
        "subsections": [
          {
            "number": "5.1",
            "title": "Pemprosesan dan Penghantaran Pesanan",
            "blocks": [
              "Kami menggunakan maklumat anda untuk mengesahkan pembelian, memproses pembayaran, menyediakan invois, membungkus produk, mengatur penghantaran, mengesan pesanan serta mengurus pembatalan, pemulangan dan bayaran balik."
            ]
          },
          {
            "number": "5.2",
            "title": "Khidmat Pelanggan",
            "blocks": [
              "Kami menggunakan data untuk menjawab pertanyaan, mengendalikan aduan, memberikan kemas kini pesanan, menjawab soalan produk dan menyediakan sokongan selepas jualan."
            ]
          },
          {
            "number": "5.3",
            "title": "Pengurusan Laman Web dan Akaun",
            "blocks": [
              "Kami mungkin memproses maklumat untuk menyediakan akaun pelanggan, mengurus troli pembelian, menyimpan pilihan yang dibenarkan, menyelesaikan masalah teknikal serta mengekalkan fungsi dan keselamatan laman web."
            ]
          },
          {
            "number": "5.4",
            "title": "Pemasaran dan Promosi",
            "blocks": [
              "Tertakluk kepada undang-undang dan pilihan atau persetujuan anda, kami mungkin menggunakan data untuk:",
              {
                "list": [
                  "Memaklumkan pelancaran produk.",
                  "Menghantar tawaran dan promosi.",
                  "Berkongsi berita serta kandungan pendidikan.",
                  "Mengurus baucar dan kempen.",
                  "Menjalankan tinjauan pelanggan.",
                  "Memberikan cadangan produk.",
                  "Mengukur keberkesanan pengiklanan."
                ]
              },
              "Anda boleh menarik balik persetujuan atau menghentikan komunikasi pemasaran mengikut Seksyen 11."
            ]
          },
          {
            "number": "5.5",
            "title": "Analisis dan Penambahbaikan Perniagaan",
            "blocks": [
              "Kami mungkin menganalisis maklumat pembelian, penggunaan laman web dan maklum balas untuk meningkatkan produk, pengalaman pelanggan, pengurusan stok, perkhidmatan penghantaran dan prestasi pemasaran.",
              "Maklumat tanpa pengenalan diri atau maklumat agregat boleh digunakan apabila bersesuaian."
            ]
          },
          {
            "number": "5.6",
            "title": "Keselamatan dan Pematuhan Undang-Undang",
            "blocks": [
              "Kami mungkin memproses maklumat untuk mencegah penipuan, menyiasat aktiviti mencurigakan, melindungi sistem, menyimpan rekod kewangan, memenuhi kewajipan undang-undang dan mempertahankan hak di sisi undang-undang."
            ]
          }
        ]
      },
      {
        "number": 6,
        "title": "Persetujuan dan Pilihan Pelanggan",
        "blocks": [
          "ASTAMALL memproses data peribadi untuk tujuan sah yang berkaitan dengan aktiviti perniagaan, tertakluk kepada undang-undang Malaysia.",
          "Kami akan mendapatkan persetujuan apabila diperlukan. Pemprosesan tertentu juga boleh dibenarkan oleh undang-undang dalam keadaan yang tidak memerlukan persetujuan.",
          "Anda boleh menarik balik persetujuan dengan menghubungi kami melalui maklumat perhubungan dalam Seksyen 20.",
          "Penarikan balik persetujuan tidak menjejaskan pemprosesan sah yang telah dilakukan sebelumnya. Ia mungkin menjejaskan penyediaan sesetengah perkhidmatan, dan maklumat tertentu masih boleh disimpan atau diproses apabila dibenarkan atau diwajibkan oleh undang-undang."
        ]
      },
      {
        "number": 7,
        "title": "Maklumat Wajib dan Pilihan",
        "blocks": [
          "Maklumat tertentu seperti nama, nombor telefon, alamat penghantaran dan butiran transaksi diperlukan untuk melengkapkan pembelian.",
          "Jika maklumat yang diperlukan tidak diberikan, kami mungkin tidak dapat memproses pesanan, membuat penghantaran, mengesahkan pembayaran, menyediakan sokongan atau mengurus bayaran balik.",
          "Maklumat seperti pilihan pemasaran dan jawapan tinjauan adalah sukarela.",
          "Menolak langganan pemasaran tidak menghalang anda daripada membuat pembelian biasa."
        ]
      },
      {
        "number": 8,
        "title": "Perkongsian dan Pendedahan Data Peribadi",
        "blocks": [
          "ASTAMALL tidak menjual data peribadi pelanggan sebagai produk komersial yang berasingan.",
          "Kami mungkin berkongsi maklumat dengan pihak ketiga yang dipilih apabila perlu bagi tujuan perniagaan yang sah, dibenarkan oleh undang-undang atau disokong oleh persetujuan yang sewajarnya.",
          "Penerima mungkin termasuk:"
        ],
        "subsections": [
          {
            "number": "8.1",
            "title": "Penyedia Pembayaran",
            "blocks": [
              "Gerbang pembayaran, bank, rangkaian kad dan penyedia perkhidmatan kewangan yang mengurus serta mengesahkan pembayaran."
            ]
          },
          {
            "number": "8.2",
            "title": "Rakan Penghantaran",
            "blocks": [
              "Syarikat kurier dan penghantaran seperti SPX, DEX, Lalamove atau penyedia lain yang digunakan oleh ASTAMALL.",
              "Maklumat yang dikongsi akan dihadkan kepada butiran yang munasabah diperlukan untuk penghantaran."
            ]
          },
          {
            "number": "8.3",
            "title": "Penyedia Teknologi",
            "blocks": [
              "Penyedia pengehosan laman web, infrastruktur, pangkalan data, e-mel, penyelenggaraan dan perkhidmatan teknologi, termasuk Vercel dan penyedia lain yang digunakan."
            ]
          },
          {
            "number": "8.4",
            "title": "Rakan Analitik dan Pengiklanan",
            "blocks": [
              "Apabila digunakan dan dibenarkan, maklumat teknikal atau penggunaan laman web mungkin diproses melalui Google Analytics, Google Ads, teknologi pengiklanan Meta atau perkhidmatan berkaitan.",
              "Pemprosesan ini tertakluk kepada keperluan persetujuan, pilihan privasi dan polisi penyedia berkaitan."
            ]
          },
          {
            "number": "8.5",
            "title": "Penasihat Profesional",
            "blocks": [
              "Akauntan, juruaudit, penasihat undang-undang, penanggung insurans dan penyedia profesional yang diperlukan untuk urusan perniagaan."
            ]
          },
          {
            "number": "8.6",
            "title": "Pihak Berkuasa",
            "blocks": [
              "Badan kerajaan, pengawal selia, mahkamah dan pihak penguatkuasaan undang-undang apabila pendedahan diperlukan atau dibenarkan oleh undang-undang."
            ]
          },
          {
            "number": "8.7",
            "title": "Urus Niaga Korporat",
            "blocks": [
              "Maklumat mungkin didedahkan berkaitan penyusunan semula perniagaan, penggabungan, pengambilalihan atau pemindahan aset yang sebenar, tertakluk kepada perlindungan yang sesuai."
            ]
          }
        ],
        "closing": [
          "Kami menghendaki penyedia perkhidmatan yang memproses data bagi pihak kami mematuhi kewajipan kontrak dan undang-undang yang berkaitan."
        ]
      },
      {
        "number": 9,
        "title": "Pemindahan Data ke Luar Malaysia",
        "blocks": [
          "ASTAMALL beroperasi di Malaysia, tetapi sesetengah penyedia perkhidmatan teknologi, pembayaran, pengehosan, pemasaran atau komunikasi mungkin memproses maklumat di luar Malaysia.",
          "Jika pemindahan antarabangsa berlaku, kami akan mengambil langkah yang sewajarnya untuk mematuhi Akta Perlindungan Data Peribadi, termasuk Seksyen 129 apabila terpakai.",
          "Langkah tersebut mungkin melibatkan penilaian tahap perlindungan negara penerima, perlindungan kontrak, syarat pemindahan yang dibenarkan undang-undang atau persetujuan apabila diperlukan."
        ]
      },
      {
        "number": 10,
        "title": "Kuki dan Teknologi Berkaitan",
        "blocks": [
          "Laman web kami mungkin menggunakan kuki dan teknologi berkaitan untuk memastikan fungsi laman web, mengingati pilihan pelanggan, memahami penggunaan laman web dan menyokong pemasaran.",
          "Jenis kuki termasuk:",
          "**Kuki Penting:** Untuk troli pembelian, pembayaran, pengesahan akaun dan keselamatan.",
          "**Kuki Fungsi:** Untuk mengingati pilihan pelanggan dan tetapan laman web.",
          "**Kuki Analitik:** Untuk memahami kunjungan, prestasi laman web dan tingkah laku pembelian.",
          "**Kuki Pemasaran:** Untuk mengukur keberkesanan iklan dan membantu memaparkan iklan yang lebih berkaitan.",
          "Apabila persetujuan diperlukan untuk teknologi penjejakan yang tidak penting, kami akan menyediakan pilihan yang sesuai sebelum mengaktifkannya.",
          "Anda boleh mengurus kuki melalui tetapan yang tersedia atau pelayar anda.",
          "Menyekat sesetengah kuki mungkin menjejaskan fungsi laman web.",
          "Sila rujuk Polisi Kuki kami sekiranya diterbitkan."
        ]
      },
      {
        "number": 11,
        "title": "Komunikasi Pemasaran",
        "blocks": [
          "ASTAMALL mungkin berkomunikasi melalui e-mel, SMS, WhatsApp atau saluran lain.",
          "Komunikasi transaksi termasuk pengesahan pesanan, status pembayaran dan makluman penghantaran.",
          "Komunikasi pemasaran termasuk promosi, pelancaran produk, baucar, berita dan kandungan pendidikan.",
          "Kami akan mendapatkan persetujuan untuk komunikasi promosi apabila diwajibkan oleh undang-undang.",
          "Anda boleh berhenti menerima pemasaran melalui pautan berhenti melanggan, tetapan komunikasi yang disediakan atau dengan menghubungi kami.",
          "Kami akan mengendalikan permintaan untuk menghentikan pemasaran langsung mengikut undang-undang yang terpakai.",
          "Menghentikan pemasaran tidak bermaksud komunikasi penting berkaitan pesanan juga akan dihentikan."
        ]
      },
      {
        "number": 12,
        "title": "Penyimpanan dan Tempoh Pengekalan Data",
        "blocks": [
          "ASTAMALL menyimpan data peribadi hanya selama tempoh yang munasabah diperlukan untuk memenuhi tujuan pengumpulan atau apabila diwajibkan atau dibenarkan oleh undang-undang.",
          "Tempoh penyimpanan bergantung pada jenis data.",
          {
            "list": [
              "**Rekod pesanan dan pembayaran:** Untuk perakaunan, percukaian, audit dan pertikaian.",
              "**Maklumat akaun:** Sepanjang akaun aktif dan tempoh munasabah yang diperlukan selepas itu.",
              "**Rekod khidmat pelanggan:** Untuk menyelesaikan pertanyaan dan mengekalkan rekod berkaitan.",
              "**Rekod pemasaran:** Selama diperlukan untuk aktiviti pemasaran yang dibenarkan, termasuk rekod pilihan berhenti melanggan apabila sesuai.",
              "**Log keselamatan:** Untuk operasi, penyelesaian masalah dan pematuhan."
            ]
          },
          "Rekod perakaunan dan percukaian tertentu mungkin tertakluk kepada tempoh penyimpanan statutori, termasuk keperluan tujuh tahun apabila terpakai.",
          "Apabila data tidak lagi diperlukan dan tiada asas sah untuk terus menyimpannya, kami akan mengambil langkah munasabah untuk memadam, memusnahkan atau menjadikannya tanpa pengenalan diri."
        ]
      },
      {
        "number": 13,
        "title": "Keselamatan Data Peribadi",
        "blocks": [
          "ASTAMALL mengambil langkah pentadbiran, teknikal dan organisasi yang munasabah untuk melindungi data peribadi.",
          "Bergantung pada sistem yang digunakan, langkah ini mungkin merangkumi:",
          {
            "list": [
              "Sambungan laman web yang selamat.",
              "Penyulitan penghantaran data.",
              "Kawalan akses yang sesuai.",
              "Pengurusan maklumat log masuk yang selamat.",
              "Akses terhad kepada maklumat pelanggan.",
              "Pemprosesan pembayaran melalui penyedia yang sesuai.",
              "Kemas kini keselamatan sistem.",
              "Pemantauan aktiviti mencurigakan.",
              "Kawalan keselamatan bagi penyedia perkhidmatan.",
              "Sandaran dan pemulihan data yang bersesuaian."
            ]
          },
          "Walau bagaimanapun, tiada sistem elektronik atau penghantaran internet dapat dijamin selamat sepenuhnya.",
          "Sekiranya berlaku pelanggaran data peribadi, kami akan menyiasat, mengambil tindakan pembetulan dan membuat pemberitahuan kepada pihak berkuasa serta individu yang terjejas apabila diwajibkan oleh undang-undang."
        ]
      },
      {
        "number": 14,
        "title": "Hak Anda terhadap Data Peribadi",
        "blocks": [
          "Tertakluk kepada undang-undang yang terpakai, anda mempunyai hak tertentu termasuk:"
        ],
        "subsections": [
          {
            "number": "14.1",
            "title": "Hak Akses",
            "blocks": [
              "Memohon akses kepada data peribadi yang disimpan oleh ASTAMALL."
            ]
          },
          {
            "number": "14.2",
            "title": "Hak Pembetulan",
            "blocks": [
              "Meminta pembetulan maklumat yang tidak tepat, tidak lengkap, mengelirukan atau tidak terkini."
            ]
          },
          {
            "number": "14.3",
            "title": "Hak Menarik Balik Persetujuan",
            "blocks": [
              "Menarik balik persetujuan yang diberikan, tertakluk kepada syarat dan akibat yang dibenarkan undang-undang."
            ]
          },
          {
            "number": "14.4",
            "title": "Hak Menghentikan Pemasaran Langsung",
            "blocks": [
              "Meminta ASTAMALL menghentikan pemprosesan data bagi tujuan pemasaran langsung."
            ]
          },
          {
            "number": "14.5",
            "title": "Hak Menghalang Pemprosesan Tertentu",
            "blocks": [
              "Memohon supaya pemprosesan tertentu dihentikan atau dihadkan dalam keadaan yang diiktiraf oleh Akta Perlindungan Data Peribadi, termasuk pemprosesan yang berkemungkinan menyebabkan kerosakan atau kesusahan besar yang tidak wajar."
            ]
          },
          {
            "number": "14.6",
            "title": "Hak Kemudahalihan Data",
            "blocks": [
              "Memohon pemindahan elektronik data peribadi yang layak kepada pengawal data lain, tertakluk kepada kebolehlaksanaan teknikal, keserasian format dan undang-undang berkaitan."
            ]
          },
          {
            "number": "14.7",
            "title": "Permintaan Penutupan Akaun atau Pemadaman Data",
            "blocks": [
              "Anda boleh meminta penutupan akaun atau pemadaman data yang tidak lagi diperlukan.",
              "Kami akan menilai permintaan tersebut mengikut undang-undang. Data tertentu mungkin perlu disimpan untuk tujuan perakaunan, pematuhan, pencegahan penipuan atau penyelesaian pertikaian."
            ]
          },
          {
            "number": "14.8",
            "title": "Cara Mengemukakan Permintaan",
            "blocks": [
              "Untuk mengemukakan permintaan, sila hubungi ASTAMALL melalui saluran perhubungan privasi rasmi yang akan diterbitkan di laman web kami.",
              "**Saluran Perhubungan Privasi:** astamall92@gmail.com",
              "**Subjek:** Permintaan Data Peribadi – ASTAMALL",
              "Kami mungkin memerlukan maklumat yang munasabah untuk mengesahkan identiti anda.",
              "Kami akan memberi maklum balas mengikut tempoh yang ditetapkan undang-undang. Fi pentadbiran mungkin dikenakan bagi permintaan akses tertentu apabila dibenarkan.",
              "Anda juga boleh mengemukakan aduan kepada Pesuruhjaya Perlindungan Data Peribadi Malaysia melalui saluran rasmi."
            ]
          }
        ]
      },
      {
        "number": 15,
        "title": "Privasi Kanak-Kanak",
        "blocks": [
          "Perkhidmatan e-dagang ASTAMALL ditujukan terutamanya kepada golongan dewasa.",
          "Kami tidak sengaja mendapatkan data peribadi secara langsung daripada kanak-kanak bagi pembelian bebas atau pemasaran tanpa penglibatan ibu bapa atau penjaga yang sesuai apabila diperlukan oleh undang-undang.",
          "Individu di bawah umur 18 tahun hendaklah mendapatkan kebenaran ibu bapa atau penjaga sebelum membeli produk atau memberikan maklumat peribadi.",
          "Jika kami mendapati data kanak-kanak telah dikumpulkan tanpa memenuhi keperluan undang-undang, kami akan mengambil langkah yang sesuai."
        ]
      },
      {
        "number": 16,
        "title": "Ulasan Produk dan Kandungan Pelanggan",
        "blocks": [
          "Pelanggan mungkin boleh menghantar ulasan, testimoni, gambar, video dan kandungan lain.",
          "Kandungan yang diserahkan untuk paparan umum mungkin dapat dilihat oleh pengguna laman web lain.",
          "Kami menggalakkan pelanggan supaya tidak memasukkan nombor telefon, alamat, maklumat pengenalan atau maklumat sensitif dalam ulasan awam.",
          "Jika kami ingin menggunakan semula gambar, video atau testimoni pelanggan yang boleh dikenal pasti untuk tujuan promosi berasingan, kami akan mendapatkan kebenaran yang sesuai atau memastikan penggunaan tersebut dibenarkan oleh undang-undang."
        ]
      },
      {
        "number": 17,
        "title": "Pesanan Hadiah dan Maklumat Penerima",
        "blocks": [
          "Jika anda membeli hadiah untuk orang lain, anda mungkin memberikan nama, alamat dan nombor telefon penerima.",
          "Anda hendaklah memastikan bahawa anda dibenarkan atau mempunyai asas sah untuk memberikan maklumat tersebut.",
          "ASTAMALL akan menggunakan maklumat penerima terutamanya untuk penghantaran, komunikasi berkaitan penghantaran dan penyelesaian masalah pesanan.",
          "Penerima hadiah tidak akan dianggap secara automatik sebagai pelanggan yang melanggan pemasaran."
        ]
      },
      {
        "number": 18,
        "title": "Laman Web dan Platform Pihak Ketiga",
        "blocks": [
          "Laman web ASTAMALL mungkin mengandungi pautan kepada platform media sosial, platform e-dagang atau perkhidmatan lain.",
          "Pihak ketiga tersebut mempunyai polisi privasi dan syarat penggunaan masing-masing.",
          "ASTAMALL tidak bertanggungjawab terhadap amalan privasi atau keselamatan laman web bebas yang tidak berada di bawah kawalan kami.",
          "Kami menggalakkan anda menyemak polisi pihak berkenaan sebelum memberikan maklumat peribadi."
        ]
      },
      {
        "number": 19,
        "title": "Pemprosesan Automatik dan Pemperibadian",
        "blocks": [
          "ASTAMALL mungkin menggunakan analitik laman web, sistem cadangan produk atau sistem keselamatan automatik untuk meningkatkan pengalaman membeli-belah dan mengesan aktiviti mencurigakan.",
          "Apabila pemprosesan tersebut melibatkan data peribadi, kami akan mengambil langkah munasabah untuk mematuhi undang-undang.",
          "Kami akan menyediakan hak dan perlindungan yang berkenaan bagi keputusan automatik apabila diwajibkan oleh undang-undang."
        ]
      },
      {
        "number": 20,
        "title": "Maklumat Perhubungan",
        "blocks": [
          "Untuk sebarang pertanyaan, permintaan, aduan atau kebimbangan berkaitan Polisi Privasi ini atau pemprosesan data peribadi anda, sila hubungi kami melalui astamall92@gmail.com.",
          {
            "title": "ASTAMALL – Pertanyaan Privasi",
            "facts": [
              [
                "Entiti Undang-Undang",
                "ASTA MALL PLT"
              ],
              [
                "Nombor Pendaftaran Perniagaan",
                "202604002255"
              ],
              [
                "Laman Web",
                "https://www.astamall.com.my"
              ],
              [
                "E-mel Perhubungan",
                "astamall92@gmail.com"
              ],
              [
                "Tarikh Kemas Kini Terakhir",
                "1 Oktober 2026"
              ]
            ]
          },
          "Semasa mengemukakan permintaan berkaitan data peribadi, sila gunakan tajuk e-mel berikut:",
          "**Permintaan Data Peribadi – ASTAMALL**",
          "Kami mungkin memerlukan maklumat yang munasabah untuk mengesahkan identiti anda sebelum memproses permintaan tersebut. Semua permintaan akan dikendalikan mengikut undang-undang Malaysia yang terpakai.",
          "Kami akan meneliti dan mengendalikan pertanyaan privasi mengikut keperluan undang-undang yang terpakai."
        ]
      },
      {
        "number": 21,
        "title": "Pindaan dan Bahasa Polisi",
        "blocks": [
          "ASTAMALL boleh mengemas kini Polisi Privasi ini dari semasa ke semasa untuk mencerminkan perubahan operasi, fungsi laman web, penyedia perkhidmatan, undang-undang atau amalan pemprosesan data.",
          "Versi terkini akan diterbitkan di laman web rasmi bersama tarikh kemas kini.",
          "Sekiranya diwajibkan oleh undang-undang, kami akan memberikan notis tambahan atau mendapatkan persetujuan baharu sebelum melaksanakan perubahan penting kepada pemprosesan data.",
          "Polisi ini disediakan dalam Bahasa Malaysia dan Bahasa Inggeris.",
          "Sekiranya terdapat percanggahan antara kedua-dua versi, versi Bahasa Inggeris akan diguna pakai setakat yang dibenarkan oleh undang-undang Malaysia."
        ]
      }
    ],
    colophon: [
      '© 2026 ASTAMALL. Hak cipta terpelihara.',
      'Dikendalikan oleh ASTA MALL PLT (Nombor Pendaftaran Perniagaan: 202604002255).',
      'Laman Web: https://www.astamall.com.my',
    ],
  },
};

export const sectionId = (number: number | string) => `section-${String(number).replace(/\./g, '-')}`;

export const localeForPath = (pathname: string): PolicyLocale => (pathname === '/ms' || pathname.startsWith('/ms/') ? 'ms' : 'en');

// Both languages must carry every section, numbered alike, with no unfilled placeholders, or the build stops.
{
  const blocksText = (blocks: PolicyBlock[] = []) => blocks.map(b => typeof b === 'string' ? b : 'list' in b ? b.list.join(' ') : b.facts.flat().join(' ')).join(' ');
  const outline = (locale: PolicyLocale) => privacyPolicy[locale].sections.map(s => [s.number, ...(s.subsections ?? []).map(sub => sub.number)].join(',')).join(' | ');
  for (const locale of ['en', 'ms'] as const) {
    const { sections, meta } = privacyPolicy[locale];
    if (sections.length !== POLICY_SECTION_COUNT || sections.some((s, i) => s.number !== i + 1))
      throw new Error(`Privacy Policy (${locale}): expected sections 1 to ${POLICY_SECTION_COUNT}, found ${sections.length}.`);
    const text = [meta.flat().join(' '), ...sections.map(s => [s.title, blocksText(s.blocks), ...(s.subsections ?? []).map(sub => sub.title + ' ' + blocksText(sub.blocks)), blocksText(s.closing)].join(' '))].join(' ');
    const placeholder = text.match(/\[[^\]]*\]|Not yet available|Belum tersedia/);
    if (placeholder) throw new Error(`Privacy Policy (${locale}): unfilled placeholder "${placeholder[0]}".`);
  }
  if (outline('en') !== outline('ms')) throw new Error('Privacy Policy: the English and Bahasa Malaysia section and subsection numbers differ.');
}
