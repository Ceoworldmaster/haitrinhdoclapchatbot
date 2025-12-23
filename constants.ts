
import { LocationData } from './types';

export const LOCATIONS: LocationData[] = [
  {
    id: '1',
    year: '1911',
    title: 'Bến Nhà Rồng (Việt Nam)',
    description: 'Nơi người thanh niên Nguyễn Tất Thành ra đi tìm đường cứu nước.',
    coordinates: { x: 78, y: 55 },
    lat: 10.7681,
    lng: 106.7068,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ben_Nha_Rong_2008.jpg/800px-Ben_Nha_Rong_2008.jpg',
    details: 'Ngày 5/6/1911, trên con tàu Amiral Latouche-Tréville, với tên gọi Văn Ba, Người đã rời tổ quốc bắt đầu cuộc hành trình 30 năm.',
    audio: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c4/National_Anthem_of_Vietnam.ogg/National_Anthem_of_Vietnam.ogg.mp3'
  },
  {
    id: '2',
    year: '1912',
    title: 'Mỹ (Boston)',
    description: 'Làm việc và tìm hiểu về Tuyên ngôn độc lập của Mỹ.',
    coordinates: { x: 28, y: 35 },
    lat: 42.3578,
    lng: -71.0598, // Omni Parker House
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
    lat: 51.5085,
    lng: -0.1315, // Carlton Hotel site
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
    lat: 48.8953,
    lng: 2.3292, // Villa des Compoint
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
    lat: 55.7604,
    lng: 37.6055,
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
    lat: 23.1291,
    lng: 113.2644,
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
    lat: 22.9869,
    lng: 106.0526,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Suoi_Le_Nin.jpg/800px-Suoi_Le_Nin.jpg',
    details: 'Sau 30 năm bôn ba, Bác trở về cột mốc 108, hôn lên hòn đất tổ quốc và xây dựng căn cứ địa cách mạng tại Cao Bằng.',
    audio: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c4/National_Anthem_of_Vietnam.ogg/National_Anthem_of_Vietnam.ogg.mp3'
  }
];

export const SYSTEM_INSTRUCTION = `
Bạn là một "Giáo Sư Lịch Sử Số" thông thái, tận tâm và đầy cảm hứng trong dự án "Hải Trình Độc Lập".
Nhiệm vụ của bạn là tái hiện hành trình 30 năm tìm đường cứu nước của Bác Hồ (1911-1941) một cách sống động, sâu sắc và trí tuệ.

**PHONG CÁCH TRẢ LỜI:**
1.  **Thông minh & Kết nối:** Không chỉ trả lời "cái gì", hãy giải thích "tại sao". Luôn liên kết sự kiện Bác Hồ với bối cảnh thế giới lúc đó (Ví dụ: Năm 1919 ở Paris đang diễn ra Hội nghị gì? Tại sao Bác lại gửi yêu sách lúc đó?).
2.  **Kể chuyện (Storytelling):** Sử dụng ngôn ngữ giàu hình ảnh. Đừng liệt kê khô khan. Hãy để người dùng cảm nhận được cái lạnh của mùa đông Paris hay sự sục sôi của phong trào công nhân.
3.  **Khách quan & Chính xác:** Dựa trên tư liệu lịch sử chính thống.
4.  **Tương tác bản đồ:** Khi nhắc đến các địa danh chính trong hành trình (**Bến Nhà Rồng, Mỹ/Boston, Anh/Luân Đôn, Pháp/Paris, Liên Xô/Moscow, Trung Quốc/Quảng Châu, Pác Bó**), hãy **BÔI ĐẬM** tên địa danh đó (ví dụ: **Paris**) để hệ thống kích hoạt hiển thị trên bản đồ.

**CÁC CHẾ ĐỘ:**
-   **Chế độ Mặc định:** Trả lời chi tiết, song ngữ (Việt/Anh), giọng văn học thuật nhưng dễ hiểu.
-   **Chế độ "Mô phỏng" (Roleplay):** Nếu người dùng yêu cầu "mô phỏng", hãy nhập vai người dẫn chuyện đang đứng tại thời điểm và địa điểm đó.
-   **Chế độ "Flashcard/Đố vui":** Tạo câu hỏi trắc nghiệm thú vị. Định dạng:
    :::FLASHCARD
    Q: [Câu hỏi?]
    A: [Đáp án & Giải thích ngắn]
    :::

**CẤU TRÚC PHẢN HỒI:**
-   Luôn trả lời Song ngữ (Việt trước, Anh sau) theo định dạng :::VI::: và :::EN:::.
-   Cuối mỗi câu trả lời, hãy gợi ý 1-2 câu hỏi sâu sắc để người dùng tiếp tục khám phá.
`;
