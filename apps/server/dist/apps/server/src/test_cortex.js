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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generative_ai_1 = require("@google/generative-ai");
const dotenv = __importStar(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load .env relative to this file (src/test_cortex.ts -> ../.env)
const envPath = path_1.default.resolve(__dirname, '../.env');
console.log(`Loading .env from: ${envPath}`);
dotenv.config({ path: envPath });
const apiKey = process.env.GEMINI_API_KEY;
const modelId = process.env.CORTEX_MODEL_ID;
if (!apiKey) {
    console.error("❌ No GEMINI_API_KEY found!");
    process.exit(1);
}
if (!modelId) {
    console.error("❌ No CORTEX_MODEL_ID found!");
    process.exit(1);
}
console.log(`API Key: ${apiKey.substring(0, 5)}...`);
console.log(`Testing CORTEX_MODEL_ID: "${modelId}"`);
const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: modelId });
async function run() {
    try {
        console.log("Sending prompt...");
        const result = await model.generateContent("Hello, are you online? Reply with 'Yes'.");
        const response = await result.response;
        console.log(`✅ Success! Response: "${response.text()}"`);
    }
    catch (error) {
        console.error("❌ Failed!");
        console.error("Error Message:", error.message);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("StatusText:", error.response.statusText);
        }
        if (error.GoogleGenerativeAIError) {
            console.error("Details:", JSON.stringify(error, null, 2));
        }
    }
}
run();
