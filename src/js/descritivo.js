const cards = document.querySelectorAll('.card_palestrante');
const modal = document.getElementById('modalPalestrante');
const closeBtn = document.querySelector('.modal-close');

cards.forEach(card => {
    card.addEventListener('click', function() {
        const nome = this.querySelector('h2')?.textContent;
        const cargo = this.querySelector('p')?.textContent;
        const desc = this.dataset.desc || 'Descrição em breve...';
        const imgSrc = this.querySelector('img')?.src || '';
        const note = this.querySelector('.hoc-note')?.textContent || '';
        const modalNote = document.getElementById('modalNote');

        document.getElementById('modalNome').textContent = nome;
        document.getElementById('modalCargo').textContent = cargo;
        document.getElementById('modalDescricao').textContent = desc;
        document.getElementById('modalImg').src = imgSrc;

        if (note) {
            modalNote.textContent = note;
            modalNote.classList.add('visible');
        } else {
            modalNote.textContent = '';
            modalNote.classList.remove('visible');
        }

        modal.classList.add('show');
    });
});

closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('show');
});