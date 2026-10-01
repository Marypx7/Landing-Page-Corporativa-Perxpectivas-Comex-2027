document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".card_palestrante");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const modal = document.getElementById("modalPalestrante");
    const closeBtn = document.querySelector(".modal-close");

    let currentIndex = 0;
    const totalCards = cards.length;

    function updateCarousel() {
        cards.forEach((card) => {
            card.classList.remove("active", "prev", "next");
        });

        const prevIndex = (currentIndex - 1 + totalCards) % totalCards;
        const nextIndex = (currentIndex + 1) % totalCards;

        cards[currentIndex].classList.add("active");
        cards[prevIndex].classList.add("prev");
        cards[nextIndex].classList.add("next");
    }

    function openModal(card) {
        const nome = card.querySelector("h2")?.textContent;
        const cargo = card.querySelector("p")?.textContent;
        const desc = card.dataset.desc || "Descrição em breve...";
        const imgSrc = card.querySelector("img")?.src || "";
        const note = card.querySelector(".hoc-note")?.textContent || "";
        const modalNote = document.getElementById("modalNote");

        document.getElementById("modalNome").textContent = nome;
        document.getElementById("modalCargo").textContent = cargo;
        document.getElementById("modalDescricao").textContent = desc;
        document.getElementById("modalImg").src = imgSrc;

        if (note) {
            modalNote.textContent = note;
            modalNote.classList.add("visible");
        } else {
            modalNote.textContent = "";
            modalNote.classList.remove("visible");
        }

        modal.classList.add("show");
    }

    // Eventos dos botões
    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        updateCarousel();
    });

    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % totalCards;
        updateCarousel();
    });

    // Clique nos cards: se for lateral, navega; se for o ativo, abre o modal
    cards.forEach((card, index) => {
        card.addEventListener("click", () => {
            if (card.classList.contains("next")) {
                currentIndex = (currentIndex + 1) % totalCards;
                updateCarousel();
            } else if (card.classList.contains("prev")) {
                currentIndex = (currentIndex - 1 + totalCards) % totalCards;
                updateCarousel();
            } else if (card.classList.contains("active")) {
                openModal(card);
            }
        });
    });

    // Fecha o modal
    closeBtn.addEventListener("click", () => {
        modal.classList.remove("show");
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("show");
    });

    // Inicializa o carrossel no carregamento da página
    updateCarousel();
});