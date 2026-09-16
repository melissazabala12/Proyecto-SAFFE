document.addEventListener("DOMContentLoaded", () => {
    
    const btnReintentar = document.getElementById("btn-reintentar");
    let segundosRestantes = 5;

    const temporizador = setInterval(() => {
        segundosRestantes--;
        btnReintentar.innerHTML = `Reintentando en ${segundosRestantes}s...`;

        if (segundosRestantes <= 0) {
            clearInterval(temporizador); 
            window.location.href = "/"; // Regresar al login
        }
    }, 1000);

    btnReintentar.addEventListener("click", () => {
        window.location.href = "/"; // Regresar al login
    });
});