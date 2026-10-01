// Data e hora do evento
const dataEvento = new Date("2026-11-11T09:00:00-03:00").getTime();
 
let intervalo;
 
function atualizarContagem() {
    const agora = new Date().getTime();
    const diferenca = dataEvento - agora;
    const contagem = document.querySelector(".barra-contagem");
 
    if (diferenca <= 0) {
        if (contagem) {
            contagem.replaceChildren();

            const mensagem = document.createElement("div");
            mensagem.className = "item item-texto";
            mensagem.style.width = "100%";
            mensagem.style.justifyContent = "center";
            mensagem.style.textAlign = "center";

            const texto = document.createElement("span");
            texto.textContent = "O evento já começou!";
            mensagem.appendChild(texto);
            contagem.appendChild(mensagem);
        }

        clearInterval(intervalo);
        return;
    }
 
    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);
 
    document.getElementById("dias").textContent = String(dias).padStart(2, "0");
    document.getElementById("horas").textContent = String(horas).padStart(2, "0");
    document.getElementById("minutos").textContent = String(minutos).padStart(2, "0");
    document.getElementById("segundos").textContent = String(segundos).padStart(2, "0");
}
 
atualizarContagem();
intervalo = setInterval(atualizarContagem, 1000);