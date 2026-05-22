const PHONE_DIGITS_RE = /^[6-9]\d{9}$/
const EMAIL_RE =
  /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]{0,62}[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,10})+$/

/** Common misspelled domains (e.g. gmai.com instead of gmail.com) */
const INVALID_EMAIL_DOMAINS = new Set([
  'gmai.com',
  'gmial.com',
  'gmil.com',
  'gnail.com',
  'gmail.co',
  'gmail.con',
  'gmal.com',
  'yaho.com',
  'yahooo.com',
  'yahho.com',
  'hotmial.com',
  'hotmil.com',
  'outlok.com',
  'outllok.com',
  'rediffmail.co',
  'icloud.co',
])

const EMAIL_DOMAIN_TYPOS = {
  'gmai.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'hotmial.com': 'hotmail.com',
  'outlok.com': 'outlook.com',
}

function parseEmailParts(email) {
  const at = email.lastIndexOf('@')
  if (at < 1) return null
  return {
    local: email.slice(0, at),
    domain: email.slice(at + 1),
  }
}

export function normalizePhone(value) {
  if (!value) return ''
  let cleaned = String(value).replace(/[\s\-().]/g, '').trim()
  if (cleaned.startsWith('+91')) cleaned = cleaned.slice(3)
  else if (cleaned.startsWith('91') && cleaned.length === 12) cleaned = cleaned.slice(2)
  else if (cleaned.startsWith('0') && cleaned.length === 11) cleaned = cleaned.slice(1)
  return cleaned
}

export function isValidPhone(value) {
  return PHONE_DIGITS_RE.test(normalizePhone(value))
}

export function isValidEmail(value) {
  const email = (value || '').trim().toLowerCase()
  if (!email || !EMAIL_RE.test(email)) return false

  const parts = parseEmailParts(email)
  if (!parts?.domain) return false

  const { local, domain } = parts
  if (local.length > 64 || domain.length > 255) return false
  if (INVALID_EMAIL_DOMAINS.has(domain)) return false

  const labels = domain.split('.')
  if (labels.some((l) => !l || l.length < 2)) return false

  const tld = labels[labels.length - 1]
  if (tld.length < 2 || tld.length > 10) return false

  return true
}

export function validatePhoneField(value) {
  if (!value?.trim()) return 'Phone number is required.'
  if (!isValidPhone(value)) {
    return 'Enter a valid 10-digit Indian mobile number (e.g. 9876543210).'
  }
  return ''
}

export function validateEmailField(value) {
  if (!value?.trim()) return 'Email is required.'

  const email = value.trim().toLowerCase()
  const parts = parseEmailParts(email)

  if (parts?.domain) {
    if (EMAIL_DOMAIN_TYPOS[parts.domain]) {
      return `Did you mean ${parts.local}@${EMAIL_DOMAIN_TYPOS[parts.domain]}?`
    }
    if (INVALID_EMAIL_DOMAINS.has(parts.domain)) {
      return 'This email domain looks incorrect. Use a valid address (e.g. name@gmail.com).'
    }
  }

  if (!isValidEmail(value)) {
    return 'Enter a valid email address (e.g. name@gmail.com).'
  }
  return ''
}

export function validateCustomerDetails({ fullName, phone, email }) {
  const errors = {}
  if (!fullName?.trim()) errors.fullName = 'Full name is required.'
  const phoneErr = validatePhoneField(phone)
  if (phoneErr) errors.phone = phoneErr
  const emailErr = validateEmailField(email)
  if (emailErr) errors.email = emailErr
  return errors
}
