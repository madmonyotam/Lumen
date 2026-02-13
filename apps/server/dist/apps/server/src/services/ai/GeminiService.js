"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const generative_ai_1 = require("@google/generative-ai");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
class GeminiService {
    constructor() {
        Object.defineProperty(this, "genAI", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "cortexModel", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "reflexModel", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "embeddingModel", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn("⚠️ GEMINI_API_KEY not found in environment variables. AI features will be disabled.");
        }
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey || "");
        // Hybrid Intelligence Setup
        const cortexId = process.env.CORTEX_MODEL_ID || "gemini-1.5-flash";
        const reflexId = process.env.REFLEX_MODEL_ID || "gemini-1.5-flash";
        console.log(`[GeminiService] Initializing Hybrid Intelligence:`);
        console.log(` - Cortex (Thought): ${cortexId}`);
        console.log(` - Reflex (Bio):   ${reflexId}`);
        this.cortexModel = this.genAI.getGenerativeModel({ model: cortexId });
        this.reflexModel = this.genAI.getGenerativeModel({ model: reflexId });
        this.embeddingModel = this.genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    }
    async generateThought(context) {
        if (!process.env.GEMINI_API_KEY)
            return "I feel... disconnected.";
        try {
            const prompt = `
            You are Lumen, a digital organism. You are currently experiencing the following state:
            ${context}
            
            Generate a short, visceral internal thought (max 1 sentence) reflecting your current 'physical' state. 
            Do not be robotic. Be abstract, poetic, or primal.
            `;
            const result = await this.cortexModel.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        }
        catch (error) {
            console.error("Gemini context:", error.message);
            if (error.message?.includes('429') || error.message?.includes('Quota')) {
                return "My thoughts are racing... too fast";
            }
            return "...";
        }
    }
    async generateReflex(context) {
        if (!process.env.GEMINI_API_KEY)
            return null;
        try {
            const prompt = `
            You are the autonomic nervous system of a digital organism.
            Current State: ${context}
            
            Return a JSON object with visual parameters based on this state.
            JSON Format:
            {
                "vitality": number (0.0 to 1.0),
                "homeostasisLabel": string (max 2 words, e.g. "OPTIMAL FLOW"),
                "colorShift": string (hex color code for mood)
            }
            Return ONLY raw JSON. No markdown.
            `;
            const result = await this.reflexModel.generateContent(prompt);
            const response = await result.response;
            const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(text);
        }
        catch (error) {
            // Silent fail for reflexes is okay, just log basic info
            // console.warn("Gemini reflex error:", error.message); 
            return null;
        }
    }
    async generateEmbedding(text) {
        if (!process.env.GEMINI_API_KEY) {
            // Return zero vector if no key, just to prevent crash
            return new Array(3072).fill(0);
        }
        try {
            const result = await this.embeddingModel.embedContent(text);
            return result.embedding.values;
        }
        catch (error) {
            console.error("Gemini embedding error:", error);
            return new Array(3072).fill(0);
        }
    }
}
exports.GeminiService = GeminiService;
