function displayResults() {
    const resultsData = localStorage.getItem('quizResults');
    
    if (!resultsData) {
        document.getElementById('scoreDisplay').textContent = '0';
        document.getElementById('scoreText').textContent = 'Sonuç bulunamadı!';
        return;
    }

    const results = JSON.parse(resultsData);
    const score = results.score;
    const total = results.total;
    const percentage = Math.round((score / total) * 100);

    document.getElementById('scoreDisplay').textContent = `${score}/${total}`;
    document.getElementById('scoreText').textContent = `Başarı Oranı: %${percentage}`;

    document.getElementById('resultsDetails').innerHTML = `
        <strong>Doğru Cevap:</strong> ${score} soru<br>
        <strong>Yanlış Cevap:</strong> ${total - score} soru<br>
        <strong>Toplam Soru:</strong> ${total} soru
    `;

    displayQuestionsReview(results);
}

function displayQuestionsReview(results) {
    const container = document.getElementById('questionsReview');
    container.innerHTML = '<h2 style="margin-top: 30px; margin-bottom: 20px; color: #333;">Soruların Detaylı İncelemesi</h2>';

    results.questions.forEach((question, index) => {
        const userAnswer = results.answers[index];
        const isCorrect = userAnswer === question.correct;

        const questionDiv = document.createElement('div');
        questionDiv.style.cssText = `
            background: ${isCorrect ? '#d4edda' : '#f8d7da'};
            border-left: 4px solid ${isCorrect ? '#28a745' : '#dc3545'};
            border-radius: 10px;
            padding: 20px;
            margin: 15px 0;
            text-align: left;
        `;

        questionDiv.innerHTML = `
            <div style="font-weight: bold; color: #333; margin-bottom: 10px;">
                Soru ${index + 1}: ${question.question}
            </div>
            <div style="margin: 10px 0;">
                <strong>Seçenekler:</strong><br>
                ${question.options.map((opt, i) => {
                    let marker = '';
                    if (i === question.correct) marker = ' ✅ (Doğru)';
                    if (i === userAnswer && !isCorrect) marker = ' ❌ (Sizin Cevabınız)';
                    if (i === userAnswer && isCorrect) marker = ' ✅ (Sizin Cevabınız)';
                    return `${String.fromCharCode(65 + i)}. ${opt}${marker}`;
                }).join('<br>')}
            </div>
            <div style="margin-top: 10px; font-weight: bold; color: ${isCorrect ? '#28a745' : '#dc3545'};">
                ${isCorrect ? '✓ Doğru Cevap!' : '✗ Yanlış Cevap'}
            </div>
        `;

        container.appendChild(questionDiv);
    });
}

function restartQuiz() {
    localStorage.removeItem('quizResults');
    window.location.href = 'quiz.html';
}

function goHome() {
    localStorage.removeItem('quizResults');
    window.location.href = 'index.html';
}

window.addEventListener('DOMContentLoaded', displayResults);

