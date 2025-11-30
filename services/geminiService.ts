import { GoogleGenAI, Content, Part } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { ChatMessage, Role } from "../types";

// Initialize Gemini Client
// IMPORTANT: API key is handled via process.env.API_KEY as per runtime instructions
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Creates a chat session and sends a message to the Gemini Model.
 * Returns a stream of text chunks.
 */
export const sendMessageToGemini = async (
  history: ChatMessage[],
  newMessage: string
): Promise<string> => {
  try {
    // Transform internal history format to Gemini API format
    const contents: Content[] = history.map((msg) => ({
      role: msg.role === Role.USER ? "user" : "model",
      parts: [{ text: msg.text } as Part],
    }));

    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Balance between creativity and accuracy
      },
      history: contents
    });

    const result = await chat.sendMessage({
      message: newMessage
    });

    return result.text || "Xin lỗi, tôi đang gặp chút trục trặc khi kết nối với máy chủ.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Xin lỗi, hiện tại tôi không thể phản hồi. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.";
  }
};

/**
 * Generates a concise summary of the provided chat history.
 */
export const summarizeHistory = async (history: ChatMessage[]): Promise<string> => {
  try {
    if (history.length === 0) return "Cuộc hội thoại chưa có nội dung.";

    // Convert history to a text block for the prompt
    const conversationText = history.map(msg => 
      `${msg.role === Role.USER ? 'Người dùng' : 'Trợ lý'}: ${msg.text}`
    ).join('\n');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Dựa trên nội dung cuộc trò chuyện dưới đây, hãy viết một bản tóm tắt ngắn gọn (khoảng 3-4 câu) về các chủ đề chính đã thảo luận. Giọng văn khách quan, súc tích.\n\n${conversationText}`
    });

    return response.text || "Không thể tạo tóm tắt vào lúc này.";
  } catch (error) {
    console.error("Summary API Error:", error);
    return "Đã xảy ra lỗi khi tạo bản tóm tắt.";
  }
};