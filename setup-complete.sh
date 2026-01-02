#!/bin/bash
# Complete Micro-SaaS Marketplace Setup Script
# Run this in your Codespace terminal: bash <(curl -sSL https://pastebin.com/raw/XXXXX)

set -e

echo "🚀 Setting up Micro-SaaS Marketplace..."

# Create directories
mkdir -p app components lib

# Create all files
cat > package.json << 'EOF'
{
  "name": "micro-saas-marketplace",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@supabase/supabase-js": "^2.39.0",
    "lucide-react": "^0.344.0",
    "date-fns": "^3.3.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.56.0",
    "eslint-config-next": "14.2.0"
  }
}
EOF

cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{"name": "next"}],
    "paths": {"@/*": ["./*"]}
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

cat > tailwind.config.ts << 'EOF'
import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}','./components/**/*.{js,ts,jsx,tsx,mdx}','./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'mono': {50: '#fafafa',100: '#f5f5f5',200: '#e5e5e5',300: '#d4d4d4',400: '#a3a3a3',500: '#737373',600: '#525252',700: '#404040',800: '#262626',900: '#171717',950: '#0a0a0a'},
        'accent': {50: '#eff6ff',100: '#dbeafe',200: '#bfdbfe',300: '#93c5fd',400: '#60a5fa',500: '#3b82f6',600: '#2563eb',700: '#1d4ed8',800: '#1e40af',900: '#1e3a8a',950: '#172554'},
      },
      fontFamily: {sans: ['var(--font-inter)', 'system-ui', 'sans-serif']},
    },
  },
  plugins: [],
}
export default config
EOF

cat > next.config.js << 'EOF'
const nextConfig = {reactStrictMode: true, images: {domains: []}}
module.exports = nextConfig
EOF

cat > postcss.config.js << 'EOF'
module.exports = {plugins: {tailwindcss: {}, autoprefixer: {}}}
EOF

cat > .gitignore << 'EOF'
/node_modules
/.next
/out
/build
.DS_Store
*.pem
.env*.local
.env
.vercel
*.tsbuildinfo
next-env.d.ts
EOF

cat > app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
:root {--font-inter: 'Inter', system-ui, sans-serif;}
@layer base {
  * {@apply border-mono-200;}
  body {@apply bg-mono-50 text-mono-900 antialiased;}
  h1, h2, h3, h4, h5, h6 {@apply font-semibold text-mono-950;}
}
@layer utilities {.text-balance {text-wrap: balance;}}
EOF

echo "✅ All configuration files created!"
echo "📦 Next step: npm install"


