const ASSISTANT_API_VERSION = '2026-06-21.1';

const SITE_STATE = {
  ok: true,
  api: {
    name: 'ArchePersona Assistant API',
    version: ASSISTANT_API_VERSION,
    purpose: 'Structured read-only site map for assistant, Codex, and operator workflows.',
    visibility: 'public-read',
    methods: ['GET', 'OPTIONS']
  },
  site: {
    brand: 'ArchePersona',
    repository: 'ArchePersona/webfront',
    production_url: 'https://protoweb-gray.vercel.app/',
    stack: 'static HTML/CSS/JS with Vercel serverless API routes',
    build: 'rm -rf dist && mkdir -p dist && cp -R index.html trusda.html src dist/'
  },
  pages: [
    {
      path: '/',
      file: 'index.html',
      title: 'ArchePersona | Behavioral Trust Infrastructure',
      purpose: 'Homepage for CHIMERA, CONTROL TOWER, ARCHEngine, and demo request routing.',
      anchors: ['#top', '#chimera', '#control-tower', '#archengine', '#demo-form']
    },
    {
      path: '/trusda',
      file: 'trusda.html',
      title: 'TRUSDA System | ArchePersona',
      purpose: 'Explains CHIMERA + CONTROL TOWER = TRUSDA System.',
      anchors: ['#top']
    }
  ],
  products: [
    {
      name: 'CHIMERA',
      role: 'Character capability of ARCHEngine',
      summary: 'Persistent identity, behavioral continuity, memory structure, and persona coherence over time.',
      demo_url: 'https://www.archepersona.online/brunel/disclaimer'
    },
    {
      name: 'CONTROL TOWER',
      role: 'Consequence capability of ARCHEngine',
      summary: 'Operator oversight, action review, escalation, logging, and earned autonomy.',
      demo_url: 'https://v-hold-1.onrender.com/dashboard'
    },
    {
      name: 'TRUSDA System',
      role: 'Trust outcome produced by CHIMERA + CONTROL TOWER',
      summary: 'Stable identity and tower control combine into earned trust for AI agents.',
      demo_url: '/trusda'
    }
  ],
  editable_surfaces: [
    {
      name: 'Homepage copy and layout',
      files: ['index.html', 'src/styles.css', 'src/mobile-polish.css', 'src/card-clicks.css']
    },
    {
      name: 'TRUSDA page copy and layout',
      files: ['trusda.html', 'src/trusda.css', 'src/mobile-polish.css']
    },
    {
      name: 'Demo request form',
      files: ['index.html', 'src/demo-form.js', 'src/demo-form.css', 'api/request-demo.js']
    },
    {
      name: 'Assistant API',
      files: ['api/assistant.js']
    }
  ],
  live_routes: [
    {
      method: 'GET',
      path: '/api/assistant',
      description: 'Returns this structured site state.'
    },
    {
      method: 'POST',
      path: '/api/request-demo',
      description: 'Receives demo form submissions and forwards them to the configured private inbox.'
    }
  ],
  assistant_contract: {
    safe_to_read: true,
    safe_to_patch_repo: true,
    patch_expectation: 'Prefer small, inspectable changes. Keep product names in ALL CAPS except ArchePersona and ARCHEngine. Preserve Character + Consequence = Trust framing.',
    protected_notes: [
      'Do not expose private inbox values.',
      'Do not add architecture secrets to public pages.',
      'Do not turn this endpoint into a write API without explicit authentication.'
    ]
  },
  generated_at: new Date().toISOString()
};

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
}

module.exports = function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  return res.status(200).json(SITE_STATE);
};
