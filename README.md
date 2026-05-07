# ScreenCity · AI Preview Engine

## Deploy su Vercel (5 minuti, gratuito)

### 1. Carica su GitHub
- Vai su github.com → New repository → chiamalo `screencity`
- Carica tutti i file di questa cartella (index.html, vercel.json, api/generate.js)

### 2. Connetti a Vercel
- Vai su vercel.com → Sign up with GitHub (gratuito)
- "Add New Project" → seleziona il repo `screencity`
- Clicca Deploy (lascia tutto di default)

### 3. Aggiungi la API key Anthropic
- Nel progetto Vercel → Settings → Environment Variables
- Aggiungi:
  - Nome: `ANTHROPIC_API_KEY`
  - Valore: la tua chiave da console.anthropic.com
- Salva e fai Redeploy

### 4. Pronto
Il tuo URL sarà tipo: `https://screencity.vercel.app`

## Struttura file
```
screencity/
├── index.html          ← frontend
├── vercel.json         ← config Vercel
└── api/
    └── generate.js     ← backend serverless (chiama Anthropic)
```

## API key Anthropic
- Registrati su console.anthropic.com
- Vai su API Keys → Create Key
- I nuovi account ricevono $5 di credito gratuito (~2500 generazioni)
