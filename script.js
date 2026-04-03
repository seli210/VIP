document.addEventListener('DOMContentLoaded', async () => {
    const attendBtn = document.getElementById('attendBtn');
    const urlParams = new URLSearchParams(window.location.search);
    const vipId = urlParams.get('id');
    
    const ticketElement = document.getElementById('vipTicket');
    const errorMsg = document.getElementById('errorMsg');
    
    if(!vipId) {
        errorMsg.style.display = 'block';
        errorMsg.innerText = 'يرجى توفير رابط التذكرة الصحيح (مثال: ?id=1)';
        return;
    }

    errorMsg.style.display = 'block';
    errorMsg.style.color = '#fff';
    errorMsg.innerText = 'جاري التحميل...';

    const vips = await getVIPs();
    const vipData = vips.find(v => v.id == vipId);

    if(!vipData) {
        errorMsg.style.color = '#ff4d4d';
        errorMsg.innerText = 'هذه التذكرة غير موجودة.';
        return;
    }

    errorMsg.style.display = 'none';

    // Populate data
    document.getElementById('vipName').innerText = vipData.name;
    document.getElementById('vipType').innerText = vipData.type;
    ticketElement.style.display = 'block';

    if (vipData.attended) {
        attendBtn.classList.add('attended');
        attendBtn.innerHTML = '✔ تم الحضور';
    }

    attendBtn.addEventListener('click', async function() {
        if (!this.classList.contains('attended')) {
            // Optimistic UI update
            this.classList.add('attended');
            this.innerHTML = '✔ جاري التسجيل...';
            
            const success = await updateVIPAttendance(vipId, true);
            if(success) {
                this.innerHTML = '✔ تم الحضور';
                createConfetti(this);
            } else {
                this.classList.remove('attended');
                this.innerHTML = 'تسجيل الحضور';
                alert('حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى.');
            }
        }
    });

    function createConfetti(element) {
        for (let i = 0; i < 20; i++) {
            let confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '8px';
            confetti.style.height = '8px';
            confetti.style.backgroundColor = Math.random() > 0.5 ? '#D4AF37' : '#27ae60';
            confetti.style.left = element.getBoundingClientRect().left + (element.offsetWidth / 2) + 'px';
            confetti.style.top = element.getBoundingClientRect().top + 'px';
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            document.body.appendChild(confetti);

            let angle = Math.random() * Math.PI * 2;
            let velocity = 50 + Math.random() * 50;
            let x = Math.cos(angle) * velocity;
            let y = Math.sin(angle) * velocity;

            confetti.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${x}px, ${y - 50}px) scale(0)`, opacity: 0 }
            ], {
                duration: 1000 + Math.random() * 500,
                easing: 'cubic-bezier(0, .9, .57, 1)'
            }).onfinish = () => confetti.remove();
        }
    }
});
