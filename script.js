document.addEventListener('DOMContentLoaded', () => {
    // เลือกทุกหน้าและปุ่มสำหรับเปลี่ยนหน้า
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');
    const allButtons = document.querySelectorAll('.btn[data-page]');
    
    // ฟังก์ชันสำหรับแสดงหน้า
    function showPage(pageId) {
        pages.forEach(page => {
            page.classList.remove('active');
        });
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            window.scrollTo(0, 0);
        }
    }

    // ฟังก์ชันสำหรับกำหนด active link
    function setActiveLink(pageId) {
        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active-link');
            }
        });
    }

    // เพิ่ม Event Listener สำหรับการเปลี่ยนหน้า
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = e.target.getAttribute('data-page');
            showPage(pageId);
            setActiveLink(pageId);
        });
    });

    allButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = e.target.closest('a').getAttribute('data-page');
            showPage(pageId);
            setActiveLink(pageId);
        });
    });

    // --- ฟังก์ชันสำหรับหน้า Service (จำลอง) ---
    const commentForm = document.querySelector('.comment-form');
    const commentsList = document.querySelector('.comments-list');
    
    let commentIdCounter = 2; // เริ่มต้นที่ 2 เพราะมีคอมเมนต์จำลองอยู่แล้ว 1 อัน

    if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = e.target.querySelector('input').value;
            const commentText = e.target.querySelector('textarea').value;
            
            if (name && commentText) {
                const newComment = createCommentElement(commentIdCounter++, name, commentText);
                commentsList.appendChild(newComment);
                e.target.reset();
            }
        });
    }

    function createCommentElement(id, name, text) {
        const commentItem = document.createElement('div');
        commentItem.classList.add('comment-item');
        commentItem.dataset.id = id;
        commentItem.innerHTML = `
            <div class="comment-header">
                <p class="comment-name">${name}</p>
                <button class="btn-delete">ลบ</button>
            </div>
            <p class="comment-text">${text}</p>
            <button class="btn-reply">ตอบกลับ</button>
            <div class="reply-container"></div>
        `;

        // เพิ่ม Event Listener ให้กับปุ่มภายในคอมเมนต์ที่สร้างขึ้นใหม่
        addCommentEventListeners(commentItem);
        return commentItem;
    }
    
    function createReplyElement(name, text) {
        const replyItem = document.createElement('div');
        replyItem.classList.add('reply-item');
        replyItem.innerHTML = `
            <div class="reply-header">
                <p class="reply-name">${name}</p>
                <button class="btn-delete-reply">ลบ</button>
            </div>
            <p class="reply-text">${text}</p>
        `;
        // เพิ่ม Event Listener สำหรับปุ่มลบของคอมเมนต์ตอบกลับ
        replyItem.querySelector('.btn-delete-reply').addEventListener('click', () => {
            replyItem.remove();
        });
        return replyItem;
    }

    function addCommentEventListeners(commentItem) {
        const btnReply = commentItem.querySelector('.btn-reply');
        const btnDelete = commentItem.querySelector('.btn-delete');
        const replyContainer = commentItem.querySelector('.reply-container');
        
        btnReply.addEventListener('click', () => {
            let replyForm = replyContainer.querySelector('.reply-form');
            if (replyForm) {
                replyForm.remove();
            } else {
                replyForm = document.createElement('form');
                replyForm.classList.add('reply-form');
                replyForm.innerHTML = `
                    <input type="text" placeholder="ชื่อของคุณ" required>
                    <textarea placeholder="คำตอบของคุณ" rows="2" required></textarea>
                    <button type="submit" class="btn-submit-reply">ส่งคำตอบ</button>
                `;
                replyContainer.appendChild(replyForm);
                
                replyForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const replyName = replyForm.querySelector('input').value;
                    const replyText = replyForm.querySelector('textarea').value;
                    
                    if (replyName && replyText) {
                        const newReply = createReplyElement(replyName, replyText);
                        replyContainer.appendChild(newReply);
                        replyForm.remove();
                    }
                });
            }
        });

        btnDelete.addEventListener('click', () => {
            commentItem.remove();
        });
    }
    
    // ตั้งค่า Event Listener สำหรับคอมเมนต์ที่มีอยู่แล้วเมื่อหน้าเว็บโหลด
    document.querySelectorAll('.comment-item').forEach(addCommentEventListeners);

    // --- ฟังก์ชันสำหรับหน้า Quiz (จำลอง) ---
    const quizForm = document.querySelector('.quiz-form');
    const quizResultSection = document.getElementById('quiz-result');
    const resultDetails = document.querySelector('.result-details');
    
    if (quizForm) {
        quizForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const answers = {};
            const questions = document.querySelectorAll('.quiz-question');
            questions.forEach(q => {
                const name = q.querySelector('input').name;
                const value = q.querySelector('input:checked')?.value;
                if (value) {
                    answers[name] = value;
                }
            });
            
            // ประมวลผลผลลัพธ์
            const scores = { A: 0, B: 0, C: 0, D: 0 };
            for (const key in answers) {
                if (answers[key]) {
                    scores[answers[key]]++;
                }
            }
            
            let recommendedMajors = [];
            const maxScore = Math.max(...Object.values(scores));
            
            if (scores.A === maxScore) {
                recommendedMajors.push({
                    title: 'กลุ่มคณะมนุษยศาสตร์และสังคมศาสตร์',
                    details: ['อักษรศาสตร์', 'วารสารศาสตร์', 'นิติศาสตร์', 'นิเทศศาสตร์']
                });
            }
            if (scores.B === maxScore) {
                recommendedMajors.push({
                    title: 'กลุ่มคณะวิทยาศาสตร์และวิศวกรรมศาสตร์',
                    details: ['แพทยศาสตร์', 'วิศวกรรมศาสตร์', 'วิทยาศาสตร์', 'สัตวแพทยศาสตร์', 'เภสัชศาสตร์']
                });
            }
            if (scores.C === maxScore) {
                recommendedMajors.push({
                    title: 'กลุ่มคณะบริหารธุรกิจและเศรษฐศาสตร์',
                    details: ['บริหารธุรกิจ', 'เศรษฐศาสตร์', 'บัญชี', 'การตลาด']
                });
            }
            if (scores.D === maxScore) {
                recommendedMajors.push({
                    title: 'กลุ่มคณะสถาปัตยกรรมศาสตร์และศิลปกรรมศาสตร์',
                    details: ['สถาปัตยกรรมศาสตร์', 'มัณฑนศิลป์', 'ศิลปกรรมศาสตร์', 'นิเทศศิลป์']
                });
            }
            
            // แสดงผลลัพธ์
            resultDetails.innerHTML = '';
            if (recommendedMajors.length > 0) {
                recommendedMajors.forEach(rec => {
                    const resultDiv = document.createElement('div');
                    resultDiv.innerHTML = `
                        <h3>${rec.title}</h3>
                        <ul>
                            ${rec.details.map(d => `<li>${d}</li>`).join('')}
                        </ul>
                    `;
                    resultDetails.appendChild(resultDiv);
                });
            } else {
                resultDetails.innerHTML = `<p>ขออภัยค่ะ ไม่สามารถประมวลผลได้ กรุณาลองใหม่อีกครั้ง</p>`;
            }

            showResult();
        });
    }
    
    function showResult() {
        quizResultSection.style.display = 'block';
        quizResultSection.scrollIntoView({ behavior: 'smooth' });
    }

    // กำหนดหน้าเริ่มต้นและลิงก์ที่ active เมื่อโหลดครั้งแรก
    const initialPageId = 'home-page';
    showPage(initialPageId);
    setActiveLink(initialPageId);
});