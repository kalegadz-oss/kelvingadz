import type { WarningSign, RiskLevel, ToolType } from '@/types';

export const WARNING_ICON_MAP: Record<string, string> = {
  urgency: 'Clock',
  upfront_payment: 'CreditCard',
  personal_info: 'UserX',
  unexpected_prize: 'Gift',
  unusual_link: 'Link',
  impersonation: 'Copy',
  request_otp: 'KeyRound',
  request_password: 'Lock',
  generic_greeting: 'UserMinus',
  poor_grammar: 'Type',
  payment_outside: 'Wallet',
  unusual_low_price: 'BadgeDollarSign',
  pressure_quick: 'Timer',
  no_protection: 'ShieldOff',
  no_history: 'History',
  no_company_info: 'Building2',
  vague_description: 'AlignLeft',
  unofficial_account: 'AtSign',
  high_earnings: 'TrendingUp',
  sensitive_early: 'FileWarning',
  unverified_organizer: 'SearchX',
  http_protocol: 'Globe',
  suspicious_subdomain: 'Network',
  excessive_length: 'Ruler',
  unusual_chars: 'AsteriskSquare',
  misleading_domain: 'Fingerprint',
  suspicious_keywords: 'Flag',
  spelling_domain: 'SpellCheck',
};

export function createWarning(id: string, title: string, explanation: string): WarningSign {
  return { id, icon: WARNING_ICON_MAP[id] || 'AlertTriangle', title, explanation };
}

export function determineRisk(warningCount: number): RiskLevel {
  if (warningCount <= 1) return 'low';
  if (warningCount <= 4) return 'moderate';
  return 'high';
}

export const TYPE_LABELS: Record<ToolType, string> = {
  message: 'Message',
  link: 'Link',
  shopping: 'Shopping',
  job: 'Job',
  prize: 'Prize',
};

const URGENCY_PATTERNS = [
  'immediately', 'urgent', 'act now', 'limited time', 'expires', 'deadline',
  'last chance', 'before', 'within hours', 'within minutes', 'account will be closed',
  'act quickly', 'don\'t delay', 'right away', 'today only', 'hurry',
];

const PAYMENT_PATTERNS = [
  'payment', 'fee', 'transfer', 'wire', 'send money', 'processing fee',
  'registration fee', 'shipping fee', 'clearance fee', 'tax fee',
  'upfront', 'advance', 'deposit', 'bitcoin', 'cryptocurrency', 'gift card',
  'wire transfer', 'western union', 'moneygram',
];

const PERSONAL_INFO_PATTERNS = [
  'password', 'otp', 'verification code', 'pin', 'social security',
  'bank account', 'credit card', 'date of birth', 'address', 'full name',
  'mother\'s maiden name', 'driver\'s license', 'passport',
  'login details', 'cvv', 'card number',
];

const PRIZE_PATTERNS = [
  'congratulations', 'you won', 'winner', 'prize', 'lottery', 'sweepstake',
  'raffle', 'selected', 'lucky winner', 'you have been chosen',
  'inheritance', 'fund released', 'unclaimed',
];

const IMPERSONATION_PATTERNS = [
  'bank', 'government', 'tax', 'irs', 'official', 'officer', 'agent',
  'customer service', 'support team', 'security alert', 'verify your account',
  'suspended', 'locked', 'compromised', 'unusual activity',
];

const GENERIC_GREETING_PATTERNS = [
  'dear customer', 'dear user', 'dear sir', 'dear madam',
  'valued customer', 'account holder',
];

const SENSITIVE_PATTERNS = [
  'password', 'otp', 'verification code', 'pin', 'cvv', 'card number',
  'bank account', 'social security', 'credit card number',
  'debit card', 'authentication code',
];

export function containsSensitiveInfo(text: string): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];
  for (const p of SENSITIVE_PATTERNS) {
    if (lower.includes(p)) found.push(p);
  }
  return found;
}

export function analyzeMessage(text: string): WarningSign[] {
  const lower = text.toLowerCase();
  const signs: WarningSign[] = [];

  if (URGENCY_PATTERNS.some(p => lower.includes(p)))
    signs.push(createWarning('urgency', 'Urgency', 'The message pressures the recipient to act immediately, a common tactic to prevent careful thinking.'));

  if (PAYMENT_PATTERNS.some(p => lower.includes(p)))
    signs.push(createWarning('upfront_payment', 'Upfront Payment', 'The sender requests payment before providing the promised service or reward. Legitimate organizations rarely do this.'));

  if (PERSONAL_INFO_PATTERNS.some(p => lower.includes(p)))
    signs.push(createWarning('personal_info', 'Personal Information Request', 'The message asks for information that may be sensitive. Never share passwords, codes, or financial details via messages.'));

  if (PRIZE_PATTERNS.some(p => lower.includes(p)))
    signs.push(createWarning('unexpected_prize', 'Unexpected Prize', 'The message claims the recipient won something they did not knowingly enter. Real prizes don\'t come out of nowhere.'));

  if (IMPERSONATION_PATTERNS.some(p => lower.includes(p)))
    signs.push(createWarning('impersonation', 'Impersonation', 'The message appears to come from an official institution. Scammers often impersonate banks, government agencies, and platforms.'));

  if (GENERIC_GREETING_PATTERNS.some(p => lower.includes(p)))
    signs.push(createWarning('generic_greeting', 'Generic Greeting', 'Legitimate organizations usually address you by name. Generic greetings like "Dear Customer" are a common scam pattern.'));

  if (/https?:\/\//i.test(text) || /bit\.ly|tinyurl|t\.co|goo\.gl/i.test(text))
    signs.push(createWarning('unusual_link', 'Contains Links', 'The message contains links. Be cautious — links can lead to phishing pages designed to steal information.'));

  if (/\b(passport|ssn|social security|cvv|card number|bank account)\b/i.test(text))
    signs.push(createWarning('request_otp', 'Requests Verification Data', 'The message may be asking for authentication-related information. No legitimate service will ask for this via message.'));

  return signs;
}

export function analyzeLink(url: string): WarningSign[] {
  const signs: WarningSign[] = [];
  const lower = url.toLowerCase().trim();

  if (lower.startsWith('http://') || (!lower.startsWith('https://') && lower.startsWith('http://')))
    signs.push(createWarning('http_protocol', 'Unencrypted HTTP', 'This URL uses HTTP instead of HTTPS. Data sent over HTTP is not encrypted and can be intercepted.'));

  const suspiciousSubdomains = lower.split('.').length > 4;
  if (suspiciousSubdomains)
    signs.push(createWarning('suspicious_subdomain', 'Many Subdomain Levels', 'This URL has an unusually deep subdomain structure, which scammers use to hide the real destination.'));

  if (url.length > 100)
    signs.push(createWarning('excessive_length', 'Excessively Long URL', 'Very long URLs can hide the true destination and are often used in phishing campaigns.'));

  if (/@|\s|{|}|\^|`|\\/.test(url))
    signs.push(createWarning('unusual_chars', 'Unusual Characters', 'The URL contains special characters that are not typical in legitimate web addresses.'));

  const commonDomains = ['google', 'facebook', 'amazon', 'apple', 'microsoft', 'paypal', 'instagram', 'netflix', 'bank'];
  for (const d of commonDomains) {
    if (lower.includes(d)) {
      const legitTld = `.com/${d}.com`;
      const looksOff = /[^a-z]${d}[^a-z]/.test(lower) && !lower.includes(`${d}.com`) && !lower.includes(`${d}.org`);
      if (looksOff || new RegExp(`${d}[-0-9]`).test(lower) || /[-_0-9]${d}/.test(lower))
        signs.push(createWarning('misleading_domain', 'Misleading Domain Pattern', `The URL appears to reference "${d}" but may not be the official domain. Scammers use look-alike domains.`));
    }
  }

  if (/0|1|l|rn|vv/i.test(lower)) {
    const typosquatted = lower.includes('arnazon') || lower.includes('g00gle') || lower.includes('paypa1') || lower.includes('faceb00k') || lower.includes('rnicrosoft');
    if (typosquatted)
      signs.push(createWarning('spelling_domain', 'Unusual Domain Spelling', 'The domain uses numbers or letters that mimic a well-known brand name. This is a common phishing tactic.'));
  }

  const riskyKeywords = ['login', 'verify', 'update', 'secure', 'account', 'confirm', 'password', 'reset', 'suspend', 'unlock', 'free', 'gift', 'prize', 'claim'];
  const foundKeywords = riskyKeywords.filter(k => lower.includes(k));
  if (foundKeywords.length >= 2)
    signs.push(createWarning('suspicious_keywords', 'Suspicious Keywords', `The URL contains multiple sensitive keywords (${foundKeywords.slice(0, 3).join(', ')}). This pattern is common in phishing links.`));

  if (/bit\.ly|tinyurl|t\.co|goo\.gl|shorte\.st|ow\.ly|is\.gd/i.test(lower))
    signs.push(createWarning('unusual_link', 'URL Shortener', 'This link uses a URL shortening service, which hides the real destination. Always expand shortened links before clicking.'));

  return signs;
}

export interface ShoppingFormData {
  product: string;
  seller: string;
  price: string;
  paymentMethod: string;
  sellerAge: string;
  reviews: string;
  returnPolicy: string;
  sellerContact: string;
  productLink: string;
  flags: string[];
}

export function analyzeShopping(data: ShoppingFormData): WarningSign[] {
  const signs: WarningSign[] = [];

  if (data.flags.includes('outside_platform'))
    signs.push(createWarning('payment_outside', 'Payment Outside Platform', 'The seller asks for payment outside the marketplace platform, removing buyer protection and making disputes harder.'));

  if (data.flags.includes('low_price') || (data.price && parseFloat(data.price) > 0 && parseFloat(data.price) < 20))
    signs.push(createWarning('unusual_low_price', 'Unusually Low Price', 'The price seems significantly below market value. Scammers use unrealistic prices to attract quick buyers.'));

  if (data.flags.includes('pressure'))
    signs.push(createWarning('pressure_quick', 'Pressure to Pay Quickly', 'The seller is pressuring you to pay quickly, a tactic to prevent you from researching or reconsidering.'));

  if (data.flags.includes('no_protection'))
    signs.push(createWarning('no_protection', 'No Payment Protection', 'The seller refuses normal payment protection methods. This removes your ability to dispute fraudulent charges.'));

  if (data.flags.includes('no_history') || (data.reviews && parseInt(data.reviews) < 5))
    signs.push(createWarning('no_history', 'Little Transaction History', 'The seller has minimal or no transaction history and reviews, making it hard to verify their reliability.'));

  if (data.sellerAge && parseInt(data.sellerAge) < 30)
    signs.push(createWarning('no_history', 'New Seller Account', 'The seller account was created recently, which can indicate a disposable account set up for scams.'));

  if (data.returnPolicy && /no|none|n\/a/i.test(data.returnPolicy))
    signs.push(createWarning('no_protection', 'No Return Policy', 'The seller offers no return or refund policy, which is a risk indicator for online purchases.'));

  return signs;
}

export interface JobFormData {
  company: string;
  position: string;
  salary: string;
  description: string;
  contactMethod: string;
  applicationFee: string;
  trainingFee: string;
  requiredInfo: string;
  flags: string[];
}

export function analyzeJob(data: JobFormData): WarningSign[] {
  const signs: WarningSign[] = [];

  if (data.flags.includes('upfront_payment') || (data.applicationFee && parseFloat(data.applicationFee) > 0) || (data.trainingFee && parseFloat(data.trainingFee) > 0))
    signs.push(createWarning('upfront_payment', 'Upfront Payment Required', 'The job requires payment for application or training. Legitimate employers do not charge you to work for them.'));

  if (data.flags.includes('high_earnings') || (data.salary && /week|day|hour/i.test(data.salary) && /\d{3,}/.test(data.salary)))
    signs.push(createWarning('high_earnings', 'Unusually High Earnings', 'The salary seems unrealistically high for the role described. If it sounds too good to be true, it probably is.'));

  if (data.flags.includes('no_company_info') || !data.company)
    signs.push(createWarning('no_company_info', 'No Clear Company Information', 'There is no verifiable information about the company. Legitimate employers have a track record you can research.'));

  if (data.flags.includes('pressure'))
    signs.push(createWarning('pressure_quick', 'Pressure to Act Quickly', 'The employer pressures you to act fast, preventing you from researching the opportunity properly.'));

  if (data.flags.includes('sensitive_early') || (data.requiredInfo && /passport|ssn|social security|bank|credit card/i.test(data.requiredInfo)))
    signs.push(createWarning('sensitive_early', 'Sensitive Information Too Early', 'The employer asks for sensitive personal or financial information before a formal hiring process.'));

  if (data.flags.includes('vague_description') || (data.description && data.description.length < 30))
    signs.push(createWarning('vague_description', 'Vague Job Description', 'The job description is unclear or overly broad, which is common in fake job postings.'));

  if (data.flags.includes('unofficial_account') || (data.contactMethod && /whatsapp|telegram|personal email|gmail|yahoo|hotmail/i.test(data.contactMethod)))
    signs.push(createWarning('unofficial_account', 'Unofficial Communication', 'Communication is only through personal messaging apps or personal email rather than official company channels.'));

  return signs;
}

export interface PrizeFormData {
  prizeName: string;
  organizer: string;
  message: string;
  requiredPayment: string;
  contactMethod: string;
  officialWebsite: string;
  enteredContest: 'yes' | 'no' | '';
  hasOfficialPage: 'yes' | 'no' | '';
  askedToPay: 'yes' | 'no' | '';
}

export function analyzePrize(data: PrizeFormData): WarningSign[] {
  const signs: WarningSign[] = [];

  if (data.enteredContest === 'no')
    signs.push(createWarning('unexpected_prize', 'Unexpected Prize', 'You did not enter this contest. Real prizes come from competitions you actively participated in.'));

  if (data.askedToPay === 'yes' || (data.requiredPayment && parseFloat(data.requiredPayment) > 0))
    signs.push(createWarning('upfront_payment', 'Upfront Payment', 'You are asked to pay before receiving the prize. Legitimate prizes never require upfront fees.'));

  if (data.hasOfficialPage === 'no' || !data.organizer)
    signs.push(createWarning('unverified_organizer', 'Unverified Organizer', 'The organizer does not have a verifiable official page. Scammers create fake organizations to appear credible.'));

  if (data.message) {
    const lower = data.message.toLowerCase();
    if (/urgent|immediately|deadline|expires|act now/.test(lower))
      signs.push(createWarning('urgency', 'Urgency', 'The message pressures you to act immediately, preventing careful consideration.'));
  }

  if (data.contactMethod && /whatsapp|telegram|personal email|gmail|yahoo|hotmail|sms|text/i.test(data.contactMethod))
    signs.push(createWarning('unofficial_account', 'Unofficial Contact Method', 'The organizer contacts you only through personal messaging apps rather than official channels.'));

  return signs;
}
