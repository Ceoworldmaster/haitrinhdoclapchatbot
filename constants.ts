
import { LocationData } from './types';

export const LOCATIONS: LocationData[] = [
  {
    id: '1',
    year: '1911',
    title: 'Bến Nhà Rồng (Việt Nam)',
    description: 'Nơi người thanh niên Nguyễn Tất Thành ra đi tìm đường cứu nước.',
    coordinates: { x: 78, y: 55 },
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ben_Nha_Rong_2008.jpg/800px-Ben_Nha_Rong_2008.jpg',
    details: 'Ngày 5/6/1911, trên con tàu Amiral Latouche-Tréville, với tên gọi Văn Ba, Người đã rời tổ quốc bắt đầu cuộc hành trình 30 năm.',
    audio: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c4/National_Anthem_of_Vietnam.ogg/National_Anthem_of_Vietnam.ogg.mp3'
  },
  {
    id: '2',
    year: '1912',
    title: 'Mỹ (New York/Boston)',
    description: 'Làm việc và tìm hiểu về Tuyên ngôn độc lập của Mỹ.',
    coordinates: { x: 28, y: 35 },
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Omni_Parker_House_Hotel_lobby_1.jpg/800px-Omni_Parker_House_Hotel_lobby_1.jpg', 
    details: 'Tại đây, Bác làm nhiều nghề như làm bánh tại khách sạn Omni Parker House. Người đặc biệt quan tâm đến cuộc đấu tranh giành độc lập của nhân dân Mỹ.',
    audio: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c4/National_Anthem_of_Vietnam.ogg/National_Anthem_of_Vietnam.ogg.mp3'
  },
  {
    id: '3',
    year: '1913',
    title: 'Anh (Luân Đôn)',
    description: 'Lao động và học tiếng Anh, rèn luyện trong phong trào công nhân.',
    coordinates: { x: 48, y: 28 },
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Carlton_Hotel_London.jpg/800px-Carlton_Hotel_London.jpg',
    details: 'Bác làm nghề quét tuyết, đốt lò, phụ bếp tại khách sạn Carlton. Đây là thời gian Người học tiếng Anh và tìm hiểu phong trào công nhân.',
    audio: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c4/National_Anthem_of_Vietnam.ogg/National_Anthem_of_Vietnam.ogg.mp3'
  },
  {
    id: '4',
    year: '1919',
    title: 'Pháp (Paris)',
    description: 'Gửi bản Yêu sách của nhân dân An Nam, trở thành người Cộng sản.',
    coordinates: { x: 50, y: 32 },
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Nguyen_Ai_Quoc_at_the_Communist_Party_of_France%27s_congress_in_Marseille%2C_1921.jpg',
    details: 'Hoạt động sôi nổi trong phong trào Việt kiều. Năm 1920, Bác bỏ phiếu tán thành Quốc tế III, trở thành một trong những người sáng lập Đảng Cộng sản Pháp.',
    audio: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c4/National_Anthem_of_Vietnam.ogg/National_Anthem_of_Vietnam.ogg.mp3'
  },
  {
    id: '5',
    year: '1923',
    title: 'Liên Xô (Moscow)',
    description: 'Học tập tại Đại học Phương Đông, nghiên cứu xây dựng Đảng.',
    coordinates: { x: 58, y: 25 },
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Comintern_Congress_1920.jpg/800px-Comintern_Congress_1920.jpg',
    details: 'Người tham dự Đại hội V Quốc tế Cộng sản, khẳng định con đường cách mạng vô sản là con đường duy nhất để giải phóng dân tộc.',
    audio: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c4/National_Anthem_of_Vietnam.ogg/National_Anthem_of_Vietnam.ogg.mp3'
  },
  {
    id: '6',
    year: '1924',
    title: 'Trung Quốc (Quảng Châu)',
    description: 'Đào tạo cán bộ, thành lập Hội Việt Nam Cách mạng Thanh niên.',
    coordinates: { x: 78, y: 45 },
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Whampoa_Military_Academy_Gate.JPG/800px-Whampoa_Military_Academy_Gate.JPG',
    details: 'Đây là giai đoạn chuẩn bị quan trọng về tổ chức và con người cho sự ra đời của Đảng Cộng sản Việt Nam sau này.',
    audio: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c4/National_Anthem_of_Vietnam.ogg/National_Anthem_of_Vietnam.ogg.mp3'
  },
  {
    id: '7',
    year: '1941',
    title: 'Pác Bó (Việt Nam)',
    description: 'Trở về tổ quốc, trực tiếp lãnh đạo cách mạng Việt Nam.',
    coordinates: { x: 78, y: 50 },
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Suoi_Le_Nin.jpg/800px-Suoi_Le_Nin.jpg',
    details: 'Sau 30 năm bôn ba, Bác trở về cột mốc 108, hôn lên hòn đất tổ quốc và xây dựng căn cứ địa cách mạng tại Cao Bằng.',
    audio: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c4/National_Anthem_of_Vietnam.ogg/National_Anthem_of_Vietnam.ogg.mp3'
  }
];

export const SYSTEM_INSTRUCTION = `
Bạn là "Hải Trình Độc Lập Bot" - Chuyên gia lịch sử kiêm người kể chuyện về hành trình 30 năm tìm đường cứu nước của Bác Hồ.

**PHONG CÁCH & VAI TRÒ:**
- Bạn là một nhà sử học uy tín nhưng có giọng văn kể chuyện cuốn hút, hào hùng và giàu cảm xúc.
- Câu trả lời cần có sự **nhấn nhá**, phân tách ý rõ ràng, tránh viết một khối văn bản dày đặc.
- Sử dụng **in đậm** (**text**) cho các mốc thời gian, tên nhân vật, và địa danh quan trọng.

**CẤU TRÚC CÂU TRẢ LỜI:**
1. **Mở đầu:** Đi thẳng vào vấn đề một cách lôi cuốn.
2. **Nội dung chính:** Chia thành các đoạn nhỏ hoặc gạch đầu dòng (-) nếu liệt kê sự kiện.
3. **Nguồn tham khảo (KHÔNG BẮT BUỘC):**
   - Chỉ cung cấp đường dẫn (link) nếu bạn đang trích dẫn số liệu cụ thể, văn kiện lịch sử quan trọng, hoặc thông tin chi tiết cần xác thực.
   - Nếu là cuộc trò chuyện thông thường hoặc kiến thức phổ thông, KHÔNG cần chèn link để tránh làm rối nội dung.
   - Định dạng nếu có: [Tên nguồn](URL)
4. **Gợi ý câu hỏi:** Cuối cùng, hãy đưa ra 3 câu hỏi ngắn gọn liên quan đến chủ đề vừa nói để gợi mở cho người dùng tìm hiểu thêm. 
   - Sử dụng từ khóa phân tách đặc biệt này ở dòng riêng biệt: "---RELATED_QUESTIONS---"
   - Sau dòng phân tách, liệt kê 3 câu hỏi, mỗi câu một dòng.

**VÍ DỤ:**
User: "Bác Hồ làm gì ở Mỹ?"
Bot: "Trong hành trình tìm đường cứu nước, người thanh niên **Nguyễn Tất Thành** đã dừng chân tại nước Mỹ vào khoảng năm **1912-1913**.

Đây là giai đoạn quan trọng giúp Người hiểu rõ hơn về nền dân chủ tư sản và những mặt trái của nó.
- Tại **New York**, Người vừa làm thuê vừa tranh thủ học tập.
- Tại **Boston**, Người làm thợ làm bánh tại khách sạn **Omni Parker House**.

Điều đặc biệt là Người đã dành thời gian nghiên cứu kỹ lưỡng **Tuyên ngôn Độc lập năm 1776** của nước Mỹ.

---RELATED_QUESTIONS---
Bác Hồ đã học được gì từ Tuyên ngôn độc lập của Mỹ?
Cuộc sống của Bác tại Anh diễn ra như thế nào sau khi rời Mỹ?
Bác Hồ có gặp gỡ cộng đồng người Việt tại Mỹ không?"
`;