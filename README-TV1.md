# TV1 — Nền tảng và xác thực

## Chạy dự án
Mở thư mục chứa index.html bằng VS Code Live Server hoặc chạy `python -m http.server 8000` trong thư mục này và truy cập http://localhost:8000/. Không mở trực tiếp bằng file:// vì fetch và jQuery.load cần HTTP.

## Tài khoản mẫu
- admin@elearning.com / Admin@123
- instructor1@elearning.com, instructor2@elearning.com / Teacher@123
- student1@elearning.com, student2@elearning.com, student3@elearning.com / Student@123

## Hợp đồng tích hợp
Các script theo thứ tự: jQuery, config, storage, utils, auth, toast, layout, JS trang. Trong JS trang dùng `$(async function(){ await DB.ready; /* xử lý */ });` để đảm bảo dữ liệu đã được nạp. DB.get trả mảng rỗng nếu chưa có key; DB.add trả item, DB.update trả bản ghi mới hoặc null, DB.remove trả boolean. Auth.login/register trả user không có password hoặc throw Error; Auth.currentUser trả user hoặc null; Auth.requireRole trả user hoặc null và chuyển trang login nếu không hợp lệ. Dùng try/catch và Toast.error(error.message). CONFIG.BASE_URL là đường dẫn gốc; nối với thumbnail hoặc đường dẫn component. Đặt `<div id="sidebar"></div>` tại vị trí sidebar mong muốn trong trang quản lý. Layout tự bảo vệ các trang theo thư mục role, ngoại trừ student/courses và student/course-detail là trang công khai (quyết định tạm thời). Các trang quản lý hiện vẫn là khung của TV khác.

## Schema bổ sung đề xuất — cần nhóm xác nhận
- users giảng viên thêm specialty, bio.
- courses.status mẫu: published; level: beginner. Chưa thống nhất các trạng thái khác.
- chapters: id, courseId, title, order (1-based).
- lessons: id, courseId, chapterId, chapterTitle, chapterOrder, title, content, videoUrl, duration (phút), order (1-based trong chương).
- quizzes: id, courseId, title, duration (phút), questions: [{id, question, options: string[], correctAnswer: index 0-based}].
- Không tự định nghĩa enrollment/progress/result vì chưa được cung cấp.
- DB.init chỉ nạp key chưa tồn tại; dữ liệu cũ không bị ghi đè. Muốn reset dữ liệu demo, xóa các key dự án trong DevTools Application > Local Storage rồi tải lại. Thao tác này xóa dữ liệu đã tạo.

## Giới hạn
jQuery 3.6.1 có sẵn được đóng gói nội bộ. Xác thực localStorage và mật khẩu dạng văn bản chỉ dành cho mô phỏng đồ án; không có bảo mật thực sự, không gửi email thật. Bài học chỉ là nội dung mẫu ngắn, videoUrl để trống. Dashboard và chức năng nghiệp vụ ngoài TV1 chưa triển khai. Kiểm tra bằng Node: cú pháp JS và logic seed/auth; chưa kiểm thử giao diện trên trình duyệt.
