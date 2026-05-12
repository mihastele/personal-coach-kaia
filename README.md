# kAIa - Your Personal AI Coach

A private, browser-based AI coach that runs entirely on your device using WebLLM and small language models.

## Features

- 🧠 **Local AI Inference** - Runs entirely in your browser using WebGPU
- 🔒 **100% Private** - All data stored locally in IndexedDB
- 📱 **Mobile Friendly** - Optimized for mobile devices
- ⚡ **Fast & Efficient** - Uses Phi-3-mini, a small but capable model
- 💾 **Persistent History** - Chat history saved locally
- 🎨 **Modern UI** - Beautiful, sleek interface with TailwindCSS

## Tech Stack

- **Frontend**: React + Vite
- **AI Engine**: WebLLM (MLC LLM)
- **Model**: Phi-3-mini-4k-instruct (quantized for efficiency)
- **Styling**: TailwindCSS
- **Storage**: IndexedDB (via idb library)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- A browser with WebGPU support (Chrome 113+, Edge 113+, Firefox Nightly)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open your browser to `http://localhost:5173`

### Build

```bash
npm run build
```

## First Launch

On first launch, the app will download the AI model (~2GB). This happens only once - the model is cached in your browser's storage. Subsequent launches will use the cached model.

## Privacy

- All chat history is stored in your browser's IndexedDB
- The AI model runs entirely on your device
- No data is sent to external servers
- Works offline after initial model download

## Browser Compatibility & Mobile Support

**Desktop:**
- Chrome/Edge 90+ ✅
- Firefox 90+ ✅
- Safari 15+ ✅

**Mobile:**
- iOS Safari 15+ ✅
- Android Chrome 90+ ✅
- Other modern mobile browsers ✅

**Performance Notes:**
- Uses WebAssembly CPU inference (works on all devices)
- Model is cached in IndexedDB after first download (~2.3GB)
- Inference speed depends on device CPU performance
- Mobile devices may have slower response times
- Downloads only once per browser

**Model Caching:**
- Transformers.js automatically caches models in IndexedDB
- First visit: Downloads model (~2.3GB on WiFi recommended)
- Subsequent visits: Uses cached model (instant load)
- Cache persists across browser sessions

## License

MIT
# personal-coach-kaia
