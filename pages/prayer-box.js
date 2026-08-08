// Taeafi Prayer Box v1.0 - Fixed (No Emoji)

function renderPrayerBoxPage() {
    var mainContent = document.getElementById('main-content');
    var prayers = StorageManager.get('my_prayers') || [];
    
    mainContent.innerHTML = `
        <div class="animate-fade-in">
            <h1 class="heading-underline">
                <i class="fas fa-hands-praying" style="margin-left: 8px; color: #4A148C;"></i>
                صندوق دعائي
            </h1>
            <p class="text-secondary mb-4">أدعيتك الخاصة - اكتبها وعد إليها كلما أردت</p>
            
            <button class="btn btn-primary w-full mb-4" onclick="showAddPrayerDialog()" style="width:100%;">
                <i class="fas fa-plus"></i> أضف دعاء جديد
            </button>
            
            ${prayers.length === 0 ? `
                <div class="card" style="text-align:center;padding:40px;">
                    <i class="fas fa-pray" style="font-size:48px;color:var(--text-disabled);margin-bottom:16px;display:block;"></i>
                    <p style="color:var(--text-tertiary);">لا توجد أدعية محفوظة بعد</p>
                    <p style="font-size:12px;color:var(--text-disabled);"><i class="fas fa-star"></i> أضف دعاءك الأول</p>
                </div>
            ` : prayers.map(function(p, index) {
                return `
                    <div class="card prayer-card" style="margin-bottom:12px;position:relative;">
                        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px;">
                            <span style="font-size:11px;color:var(--text-tertiary);">
                                <i class="fas fa-calendar" style="margin-left:4px;"></i> ${p.date}
                            </span>
                            <button class="btn btn-sm" onclick="deletePrayer(${index})" style="color:#F44336;padding:2px 6px;font-size:11px;">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        <p style="line-height:2.2;font-family:var(--font-quran);font-size:16px;white-space:pre-wrap;">${p.text}</p>
                        ${p.note ? '<p style="font-size:11px;color:var(--text-tertiary);margin-top:8px;border-top:1px solid var(--border-light);padding-top:8px;"><i class="fas fa-pen"></i> ' + p.note + '</p>' : ''}
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function showAddPrayerDialog() {
    var oldModal = document.querySelector('.modal-overlay');
    if (oldModal) oldModal.remove();
    
    var modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.zIndex = '200';
    modal.innerHTML = `
        <div class="modal-container" style="max-width:450px;">
            <h3 style="margin-bottom:12px;">
                <i class="fas fa-plus-circle" style="color:#4A148C;margin-left:6px;"></i> أضف دعاء
            </h3>
            
            <label style="display:block;margin-bottom:4px;font-weight:600;">الدعاء</label>
            <textarea id="prayer-text" placeholder="اكتب دعاءك هنا..." style="width:100%;min-height:100px;padding:12px;border-radius:12px;border:1px solid var(--border);resize:vertical;font-family:var(--font-quran);font-size:15px;line-height:2;background:var(--input-bg);color:var(--text-primary);margin-bottom:12px;"></textarea>
            
            <label style="display:block;margin-bottom:4px;font-weight:600;">ملاحظة (اختياري)</label>
            <input type="text" id="prayer-note" placeholder="سبب الدعاء أو مناسبة..." style="width:100%;padding:12px;border-radius:12px;border:1px solid var(--border);background:var(--input-bg);color:var(--text-primary);margin-bottom:12px;">
            
            <button class="btn btn-primary w-full" onclick="savePrayer()" style="width:100%;">
                <i class="fas fa-save"></i> حفظ الدعاء
            </button>
            <button class="btn btn-outline w-full mt-2" onclick="this.closest('.modal-overlay').remove()" style="width:100%;">
                إلغاء
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}

function savePrayer() {
    var textEl = document.getElementById('prayer-text');
    var noteEl = document.getElementById('prayer-note');
    
    if (!textEl) return;
    
    var text = textEl.value.trim();
    var note = noteEl ? noteEl.value.trim() : '';
    
    if (!text) { 
        if (typeof showToast === 'function') showToast('<i class="fas fa-exclamation-triangle"></i> اكتب الدعاء أولا'); 
        return; 
    }
    
    var prayers = StorageManager.get('my_prayers') || [];
    prayers.push({
        text: text,
        note: note,
        date: new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })
    });
    StorageManager.set('my_prayers', prayers);
    
    var modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(function(m) { m.remove(); });
    
    if (typeof showToast === 'function') {
        showToast('<i class="fas fa-check-circle"></i> تم حفظ الدعاء بنجاح');
    }
    
    renderPrayerBoxPage();
    document.getElementById('main-content').scrollTop = 0;
}

function deletePrayer(index) {
    if (confirm('هل أنت متأكد من حذف هذا الدعاء؟')) {
        var prayers = StorageManager.get('my_prayers') || [];
        prayers.splice(index, 1);
        StorageManager.set('my_prayers', prayers);
        renderPrayerBoxPage();
        if (typeof showToast === 'function') {
            showToast('<i class="fas fa-trash"></i> تم حذف الدعاء');
        }
    }
}