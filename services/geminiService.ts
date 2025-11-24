import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { InventoryItem } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize the client only if the key exists to avoid immediate errors, 
// though the app assumes the key is present.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const analyzeInventoryWithAI = async (
  inventory: InventoryItem[], 
  userQuery: string
): Promise<string> => {
  if (!ai) {
    return "API Key is missing. Please configure your environment variables.";
  }

  // We create a lightweight context of the inventory to send to the model.
  // We strictly limit fields to avoid token bloat if the list is huge, 
  // but for this app, full objects are fine.
  const inventoryContext = JSON.stringify(inventory.map(item => ({
    name: item.name,
    category: item.category,
    vendor: item.vendor,
    purchased: item.purchaseDate,
    warrantyExpires: item.warrantyExpirationDate,
    status: item.status,
    cost: item.cost
  })));

  const systemInstruction = `
    You are an expert IT Inventory Manager AI Assistant. 
    You have access to the current hardware inventory dataset provided below in JSON format.
    
    Your role is to:
    1. Answer questions about the specific data (e.g., "How many Dells?", "What is expiring soon?").
    2. Provide insights on lifecycle management, warranty risks, and vendor diversification.
    3. Suggest replacements or budget considerations based on industry standards if asked.
    
    Current Inventory Data:
    ${inventoryContext}
    
    Keep answers concise, professional, and formatted with Markdown where helpful (lists, bold text).
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userQuery,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2, // Low temperature for factual data analysis
      }
    });

    return response.text || "I couldn't generate a response based on that query.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error while processing your request. Please try again.";
  }
};
