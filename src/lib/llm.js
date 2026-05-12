import { pipeline, env } from '@xenova/transformers';

// Configure Transformers.js to use local caching
env.allowLocalModels = false;
env.useBrowserCache = true;

let generator = null;
let isInitializing = false;
let selectedModel = null;

// Detect device capabilities
function detectDeviceCapabilities() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const deviceMemory = navigator.deviceMemory || 4;
  
  return {
    isMobile,
    deviceMemory,
    isLowEnd: isMobile || deviceMemory < 4
  };
}

function selectModel(capabilities) {
  // Use TinyLlama which is supported by Transformers.js
  return {
    modelId: "Xenova/TinyLlama-1.1B-Chat-v1.0",
    size: "~1.1GB",
    quantized: true
  };
}

export async function initLLM(onProgress) {
  if (generator) return generator;
  if (isInitializing) return null;

  isInitializing = true;

  const capabilities = detectDeviceCapabilities();
  const modelConfig = selectModel(capabilities);
  selectedModel = modelConfig;

  try {
    console.log('Loading model with Transformers.js:', modelConfig.modelId);
    
    // Initialize the text generation pipeline
    generator = await pipeline('text-generation', modelConfig.modelId, {
      quantized: modelConfig.quantized,
      progress_callback: (progress) => {
        if (onProgress) {
          onProgress({
            progress: progress.progress || 0,
            text: progress.status || 'Loading...',
            modelSize: modelConfig.size,
            isMobile: capabilities.isMobile
          });
        }
      }
    });
    
    console.log('Model loaded successfully');
    isInitializing = false;
    return generator;
  } catch (error) {
    console.error("Failed to initialize LLM:", error);
    isInitializing = false;
    throw error;
  }
}

export function getSelectedModelInfo() {
  return selectedModel;
}

export async function generateResponse(prompt, generator) {
  if (!generator) {
    throw new Error("LLM generator not initialized");
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

  // Format the prompt for Phi-3
  const formattedPrompt = `<|system|>\n${systemPrompt}<|end|>\n<|user|>\n${prompt}<|end|>\n<|assistant|>`;

  try {
    const output = await generator(formattedPrompt, {
      max_new_tokens: 512,
      temperature: 0.7,
      do_sample: true,
      top_p: 0.95,
      repetition_penalty: 1.2
    });

    // Extract the assistant's response
    const generatedText = output[0].generated_text;
    const response = generatedText.split('<|assistant|>')[1]?.trim() || generatedText;
    
    return response;
  } catch (error) {
    console.error("Generation error:", error);
    throw error;
  }
}

export function isEngineReady() {
  return generator !== null;
}
