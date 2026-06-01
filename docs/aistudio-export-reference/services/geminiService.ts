
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Flower } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCharacter = async (flower: Flower, userPrompt: string): Promise<{ name: string, description: string }> => {
  const model = ai.models.generateContent;

  const prompt = `
    You are creating a detailed character profile for a "Flower Spirit".
    This spirit is a magical transformation of a real person from an image provided by the user.
    The spirit should embody the flower's cultural significance and personality traits, while also reflecting the essence of the original person. The user has provided additional creative direction.

    **Flower Details:**
    - Name: ${flower.name}
    - Associated Country: ${flower.country}
    - Flower Language (Symbolism): ${flower.language}
    - Core Personality: ${flower.personality}

    **User's Creative Direction:**
    "${userPrompt || 'No specific direction provided, use your creativity.'}"

    Generate a response in JSON format. The JSON object should contain:
    1. "name": A fitting and imaginative name for the character (e.g., "Sakura no Hime," "Iris de Lumière").
    2. "description": A rich, 2-3 paragraph description of the character. Describe their appearance (blending original features with flower motifs), personality, powers, and a short backstory related to their flower, culture, and their transformation. The tone should be fantastical and romantic.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["name", "description"],
      },
    },
  });

  const text = response.text.trim();
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON from Gemini:", text);
    throw new Error("Received an invalid response from the AI. Please try again.");
  }
};

export const generateCharacterImage = async (
  name: string,
  description: string,
  flowerName: string,
  base64ImageData: string,
  mimeType: string
): Promise<string> => {
  const imagePart = {
    inlineData: {
      data: base64ImageData,
      mimeType: mimeType,
    },
  };

  const textPrompt = `
    Transform the person in the provided image into an anime-style "Flower Spirit" character.
    The spirit's theme is the ${flowerName}.

    **Character Name:** ${name}
    **Character Description:** ${description}

    **Transformation Instructions:**
    - Infuse the character with the essence of the ${flowerName}. This could be through colors, patterns on clothing, accessories, or a magical aura.
    - Retain the core facial features and hairstyle of the person in the original image, but adapt them to a romantic and fantastical anime art style.
    - The final image should be a high-quality, full-body portrait.
    - Place the character in a soft, magical background that complements their flower origin.
    - The lighting should be ethereal and glowing.
    - The overall mood must be whimsical and enchanting.
  `;

  const textPart = {
    text: textPrompt,
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [imagePart, textPart],
    },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
      return part.inlineData.data;
    }
  }

  throw new Error("Image transformation failed. The AI did not return an image.");
};
