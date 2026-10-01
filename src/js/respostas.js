document.addEventListener("DOMContentLoaded", function () {

    const faqQuestions = document.querySelectorAll("#duvidas .faq-question");

    faqQuestions.forEach(function (question) {

        question.addEventListener("click", function () {

            const currentItem = this.parentElement;

            document.querySelectorAll("#duvidas .faq-item").forEach(function (item) {

                if (item !== currentItem) {
                    item.classList.remove("active");

                    const icon = item.querySelector(".faq-icon");

                    if (icon) {
                        icon.textContent = "+";
                    }
                }

            });

            currentItem.classList.toggle("active");

            const icon = currentItem.querySelector(".faq-icon");

            if (currentItem.classList.contains("active")) {
                icon.textContent = "-";
            } else {
                icon.textContent = "+";
            }

        });

    });

});