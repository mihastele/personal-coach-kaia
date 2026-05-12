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

**Desktop (Recommended):**
- Chrome 113+ ✅
- Edge 113+ ✅
- Firefox Nightly (with WebGPU enabled) ⚠️

**Mobile (Limited Support):**
- Android Chrome 113+ ⚠️ (WebGPU experimental, slow performance)
- iOS Safari ❌ (No WebGPU support)
- Other mobile browsers ❌

**Mobile Limitations:**
- WebGPU is not widely supported on mobile browsers
- iOS Safari does not support WebGPU at all
- Mobile inference is significantly slower even on supported devices
- Model download may be slow on mobile networks

**For better mobile support, consider:**
1. Using Transformers.js with WebAssembly CPU inference (slower but more compatible)
2. A service-based API with privacy guarantees
3. Building a native mobile app with on-device ML models

WebGPU is required for hardware-accelerated inference.

## License

MIT
# personal-coach-kaia
