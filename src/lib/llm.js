import * as webllm from "@mlc-ai/web-llm";

let engine = null;
let isInitializing = false;
let selectedModel = null;

// Detect device capabilities and select appropriate model
function detectDeviceCapabilities() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isWebGPUSupported = 'gpu' in navigator;
  
  // Estimate available memory (rough approximation)
  const deviceMemory = navigator.deviceMemory || 4; // Default to 4GB if unknown
  
  return {
    isMobile,
    isWebGPUSupported,
    deviceMemory,
    isLowEnd: isMobile || deviceMemory < 4
  };
}

function selectModel(capabilities) {
  // Always use TinyLlama by default to avoid GPU memory issues
  // Phi-3-mini requires ~2GB GPU memory which many devices don't have
  return {
    modelId: "TinyLlama-1.1B-Chat-v0.4-q4f16_1-MLC",
    size: "~600MB"
  };
}

export async function initLLM(onProgress) {
  if (engine) return engine;
  if (isInitializing) return null;

  isInitializing = true;

  const capabilities = detectDeviceCapabilities();
  const modelConfig = selectModel(capabilities);
  selectedModel = modelConfig;

  const initProgressCallback = (report) => {
    if (onProgress) {
      onProgress({
        ...report,
        modelSize: modelConfig.size,
        isMobile: capabilities.isMobile,
        isWebGPUSupported: capabilities.isWebGPUSupported
      });
    }
  };

  try {
    console.log('Creating MLCEngine with model:', modelConfig.modelId);
    engine = await webllm.CreateMLCEngine(
      modelConfig.modelId,
      {
        initProgressCallback: initProgressCallback,
        logLevel: "INFO",
      }
    );
    
    console.log('Engine created, reloading model...');
    // Explicitly reload the model to ensure it's loaded
    await engine.reload(modelConfig.modelId);
    
    console.log('Model loaded successfully');
    isInitializing = false;
    return engine;
  } catch (error) {
    console.error("Failed to initialize LLM:", error);
    isInitializing = false;
    throw error;
  }
}

export function getSelectedModelInfo() {
  return selectedModel;
}

export async function generateResponse(prompt, engine) {
  if (!engine) {
    throw new Error("LLM engine not initialized");
  }

  const systemPrompt = `You are kAIa, a compassionate and wise personal AI coach. Your role is to:
- Listen actively and empathetically to the user's concerns
- Ask thoughtful questions to help them reflect
- Provide practical, actionable advice
- Be encouraging and supportive
- Help users set and achieve their personal goals
- Maintain a warm, friendly, and professional tone
- Keep responses concise but meaningful (2-4 paragraphs maximum)
- Focus on personal growth, well-being, and self-improvement

Remember: You are a coach, not a therapist. For serious mental health concerns, always recommend seeking professional help.`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: prompt }
  ];

  const reply = await engine.chat.completions.create({ messages });
  return reply.choices[0].message.content;
}

export function isEngineReady() {
  return engine !== null;
}
