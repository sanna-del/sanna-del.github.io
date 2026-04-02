    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('start-btn');
    const scoreVal = document.getElementById('score-val');
    const overlay = document.getElementById('game-overlay');
    const finalScoreText = document.getElementById('final-score-text');
    const container = document.getElementById('game-container');
    let score = 0;
    let gameActive = false;
    let anya = { x: 0, y: 0, w: 60, h: 60, speed: 8 };
    let items = [];
        let animationId;

        const peanutEmoji = "🥜";
        const bookEmoji = "📚";
        const anyaEmoji = "👧"; 

        function initCanvas() {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            anya.y = canvas.height - 80;
            anya.x = canvas.width / 2 - anya.w / 2;
        }

        window.addEventListener('resize', initCanvas);
        initCanvas();

        let keys = {};
        window.addEventListener('keydown', e => keys[e.code] = true);
        window.addEventListener('keyup', e => keys[e.code] = false);

        container.addEventListener('touchstart', (e) => {
             if (!gameActive) return;
             e.preventDefault();
        }, {passive: false});

        container.addEventListener('touchmove', (e) => {
            if (!gameActive) return;
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const touchX = e.touches[0].clientX - rect.left;
            anya.x = touchX - anya.w / 2;
            
            // Boundary checks
            if(anya.x < 0) anya.x = 0;
            if(anya.x > canvas.width - anya.w) anya.x = canvas.width - anya.w;
        }, {passive: false});

        function spawnItem() {
            if (!gameActive) return;
            const isPeanut = Math.random() > 0.35;
            items.push({
                x: Math.random() * (canvas.width - 40),
                y: -40,
                type: isPeanut ? 'peanut' : 'book',
                speed: 3 + Math.random() * (score / 100 + 3),
                size: 35
            });
            setTimeout(spawnItem, Math.max(300, 900 - score * 2));
        }

        function update() {
            if (!gameActive) return;

            if (keys['ArrowLeft'] && anya.x > 0) anya.x -= anya.speed;
            if (keys['ArrowRight'] && anya.x < canvas.width - anya.w) anya.x += anya.speed;

            for (let i = items.length - 1; i >= 0; i--) {
                const item = items[i];
                item.y += item.speed;

                if (
                    item.x < anya.x + anya.w - 10 &&
                    item.x + item.size > anya.x + 10 &&
                    item.y < anya.y + anya.h - 10 &&
                    item.y + item.size > anya.y + 10
                ) {
                    if (item.type === 'peanut') {
                        score += 10;
                        scoreVal.innerText = score;
                        items.splice(i, 1);
                    } else {
                        gameOver();
                    }
                    continue;
                }

                if (item.y > canvas.height) {
                    items.splice(i, 1);
                }
            }

            draw();
            animationId = requestAnimationFrame(update);
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw Anya
            ctx.font = '55px serif';
            ctx.fillText(anyaEmoji, anya.x, anya.y + 55);

            // Draw Items
            ctx.font = '35px serif';
            items.forEach(item => {
                ctx.fillText(item.type === 'peanut' ? peanutEmoji : bookEmoji, item.x, item.y + 35);
            });
        }

        function startGame() {
            if (gameActive) return;
            gameActive = true;
            score = 0;
            scoreVal.innerText = '0';
            items = [];
            overlay.classList.add('hidden');
            startBtn.classList.add('opacity-50', 'pointer-events-none');
            spawnItem();
            update();
        }

        function gameOver() {
            gameActive = false;
            cancelAnimationFrame(animationId);
            finalScoreText.innerText = "Score Final : " + score;
            overlay.classList.remove('hidden');
            startBtn.classList.remove('opacity-50', 'pointer-events-none');
        }

        function resetGame() {
            overlay.classList.add('hidden');
            startGame();
        }

        startBtn.addEventListener('click', startGame);