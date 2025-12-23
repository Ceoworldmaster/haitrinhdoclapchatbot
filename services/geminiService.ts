
import { GoogleGenAI, Content, Part } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { ChatMessage, Role } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Creates a chat session and sends a message to the Gemini Model.
 * Supports Text, Images, Google Search Grounding.
 */
export const sendMessageToGemini = async (
  history: ChatMessage[],
  newMessage: string,
  imageBase64?: string,
  useThinkingMode: boolean = false,
  language: 'vi' | 'en' = 'vi'
): Promise<string> => {
  try {
    // Transform internal history format to Gemini API format
    const historyContents: Content[] = history.map((msg) => ({
      role: msg.role === Role.USER ? "user" : "model",
      parts: [{ text: msg.text } as Part],
    }));

    // Determine Model
    const modelName = "gemini-2.5-flash";

    // Base System Instruction
    let currentSystemInstruction = SYSTEM_INSTRUCTION;
    
    // STRICT BILINGUAL REQUIREMENT
    currentSystemInstruction += `\n\n**QUAN TRỌNG: ĐỊNH DẠNG SONG NGỮ BẮT BUỘC**
    Bạn là một chuyên gia song ngữ. Mọi câu trả lời PHẢI tuân thủ cấu trúc sau, không được phép sai lệch:

    :::VI:::
    (Nội dung trả lời bằng Tiếng Việt)
    :::EN:::
    (Content answer in English)

    **QUY TẮC TUYỆT ĐỐI:**
    1. Luôn bắt đầu bằng ":::VI:::".
    2. Luôn có ":::EN:::" ngăn cách.
    3. Nếu không dịch được, hãy để trống phần EN, ĐỪNG tự ý bỏ tag.
    4. Giữ nguyên danh từ riêng (Ví dụ: "Pác Bó", "Nguyễn Ái Quốc") trong cả hai phần.
    5. KHÔNG thêm bất kỳ lời dẫn nào bên ngoài hai khối này.
    `;

    // Thinking Mode Instruction
    if (useThinkingMode) {
        currentSystemInstruction += `\n\n**CHẾ ĐỘ TƯ DUY SÂU (DEEP THINKING):**
        - Phân tích chuyên sâu, đa chiều.
        - Trích dẫn nguồn gốc lịch sử cụ thể.
        - Giọng văn học thuật.
        - Áp dụng logic này cho cả phần Tiếng Việt và Tiếng Anh.`;
    }

    const config: any = {
        systemInstruction: currentSystemInstruction,
        temperature: useThinkingMode ? 0.8 : 0.7, 
        tools: [{ googleSearch: {} }],
    };

    // Prepare the current message parts
    const currentParts: Part[] = [];
    
    // Add Image if present
    if (imageBase64) {
        const base64Data = imageBase64.split(',')[1] || imageBase64;
        currentParts.push({
            inlineData: {
                mimeType: "image/jpeg",
                data: base64Data
            }
        });
    }

    // Add Text if present
    if (newMessage && newMessage.trim().length > 0) {
        currentParts.push({ text: newMessage });
    } else if (currentParts.length === 0) {
        currentParts.push({ text: "..." });
    }

    const chat = ai.chats.create({
      model: modelName,
      config: config,
      history: historyContents
    });

    const result = await chat.sendMessage({
      message: {
          role: 'user',
          parts: currentParts
      }
    });

    let finalText = result.text || "";
    
    // Fallback: If AI fails to add markers, wrap the text manually based on detection
    if (!finalText.includes(":::VI:::") && !finalText.includes(":::EN:::")) {
        // Assume default is VI if no markers found
        finalText = `:::VI:::${finalText}:::EN::: `; 
    }
    
    return finalText;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return ":::VI:::Xin lỗi, hiện tại tôi không thể phản hồi.:::EN:::Sorry, I cannot respond right now.";
  }
};

/**
 * Generates a concise title for the chat session based on the first user message and AI response.
 */
export const generateSessionTitle = async (firstUserMessage: string, firstAiResponse: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Dựa vào cuộc hội thoại sau, hãy đặt một tiêu đề cực ngắn (3-6 từ) bằng Tiếng Việt. Chỉ trả về text tiêu đề.\n\nUser: ${firstUserMessage}\nAI: ${firstAiResponse}`
        });
        return response.text?.trim() || firstUserMessage.slice(0, 30);
    } catch (e) {
        return firstUserMessage.slice(0, 30);
    }
};

/**
 * Generates a concise summary of the provided chat history.
 */
export const summarizeHistory = async (history: ChatMessage[]): Promise<string> => {
  try {
    if (history.length === 0) return "Cuộc hội thoại chưa có nội dung.";

    const conversationText = history.map(msg => 
      `${msg.role === Role.USER ? 'Người dùng' : 'Trợ lý'}: ${msg.text}`
    ).join('\n');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Tóm tắt ngắn gọn (3-4 câu) bằng Tiếng Việt về nội dung cuộc trò chuyện:\n\n${conversationText}`
    });

    return response.text || "Không thể tạo tóm tắt vào lúc này.";
  } catch (error) {
    console.error("Summary API Error:", error);
    return "Đã xảy ra lỗi khi tạo bản tóm tắt.";
  }
};
