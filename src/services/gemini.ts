import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ProductInput {
  name: string;
  features: string;
  benefits: string;
  keywords: string;
  tone: string;
}

export interface GeneratedDescription {
  version: number;
  content: string;
  html: string;
}

export async function generateProductDescriptions(input: ProductInput): Promise<GeneratedDescription[]> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Bạn là một chuyên gia viết nội dung (Copywriter) cho thương mại điện tử chuyên nghiệp.
    Hãy tạo 2 phiên bản mô tả sản phẩm hấp dẫn và chuẩn SEO dựa trên thông tin sau:
    
    - Tên sản phẩm: ${input.name}
    - Tính năng chính: ${input.features}
    - Lợi ích cho khách hàng: ${input.benefits}
    - Từ khóa SEO: ${input.keywords}
    - Tông giọng: ${input.tone}
    
    Yêu cầu cho mỗi phiên bản:
    1. Tiêu đề hấp dẫn tích hợp từ khóa.
    2. Đoạn giới thiệu ngắn gọn, thu hút.
    3. Danh sách các tính năng chính (dạng gạch đầu dòng).
    4. Đoạn văn phân tích lợi ích thực tế cho người dùng.
    5. Tích hợp các từ khóa SEO một cách tự nhiên.
    6. Định dạng bằng Markdown.
    
    Trả về kết quả dưới dạng JSON theo cấu trúc:
    {
      "descriptions": [
        {
          "version": 1,
          "content": "Nội dung markdown",
          "html": "Nội dung HTML"
        }
      ]
    }
  `;

  try {
    console.log("Generating descriptions with input:", input);
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            descriptions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  version: { type: Type.NUMBER },
                  content: { type: Type.STRING },
                  html: { type: Type.STRING }
                },
                required: ["version", "content", "html"]
              }
            }
          },
          required: ["descriptions"]
        }
      }
    });

    if (!response.text) {
      throw new Error("No text returned from Gemini");
    }

    const result = JSON.parse(response.text);
    console.log("Generation successful:", result);
    return result.descriptions || [];
  } catch (error) {
    console.error("Detailed error in generateProductDescriptions:", error);
    throw error;
  }
}
