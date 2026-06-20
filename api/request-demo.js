const FORM_SUBMIT_BASE = 'https://formsubmit.co/ajax/';

function parseBody(req) {
  const contentType = req.headers['content-type'] || '';

  if (contentType.includes('application/json')) {
    return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  }

  if (typeof req.body === 'object' && req.body !== null) {
    return req.body;
  }

  return Object.fromEntries(new URLSearchParams(req.body || ''));
}

function clean(value, maxLength = 1200) {
  return String(value || '').trim().slice(0, maxLength);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const inbox = process.env.DEMO_INBOX_EMAIL;

  if (!inbox) {
    return res.status(500).json({
      ok: false,
      error: 'Demo inbox is not configured.'
    });
  }

  let body;

  try {
    body = parseBody(req);
  } catch (error) {
    return res.status(400).json({ ok: false, error: 'Invalid form submission.' });
  }

  if (clean(body.website, 120)) {
    return res.status(200).json({ ok: true });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 180);
  const company = clean(body.company, 160);
  const trustPath = clean(body.trust_path, 160);
  const message = clean(body.message, 2000);
  const source = clean(body.source, 120) || 'unknown';
  const reference = clean(body.reference, 120) || `AP-${Date.now()}`;

  if (!name || !email || !message) {
    return res.status(400).json({
      ok: false,
      error: 'Name, email, and message are required.'
    });
  }

  const payload = new URLSearchParams({
    name,
    email,
    company,
    trust_path: trustPath,
    message,
    source,
    reference,
    _subject: `ArchePersona demo request — ${name}`,
    _template: 'table',
    _captcha: 'false'
  });

  try {
    const response = await fetch(`${FORM_SUBMIT_BASE}${encodeURIComponent(inbox)}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: payload.toString()
    });

    if (!response.ok) {
      return res.status(502).json({
        ok: false,
        error: 'The demo request could not be sent.'
      });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(502).json({
      ok: false,
      error: 'The demo request could not be sent.'
    });
  }
};
