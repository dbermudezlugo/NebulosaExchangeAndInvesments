// Dark / Light mode


document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        document.body.dataset.bsTheme = savedTheme;
        document.getElementById("flexSwitchCheckChecked").checked = savedTheme === "dark";
    } else {
        document.body.dataset.bsTheme = "dark";
        document.getElementById("flexSwitchCheckChecked").checked = true;
    }
});

function myFunction() {
    let element = document.body;
    let newTheme = element.dataset.bsTheme === "light" ? "dark" : "light";
    element.dataset.bsTheme = newTheme;
    localStorage.setItem("theme", newTheme);
    document.getElementById("flexSwitchCheckChecked").checked = newTheme === "dark";
}

// Conversor de Moneda


async function obtenerTasasDeCambio() {
    const apiKey = '3e56b64e2fa04d6f02529321';
    const url = `https://v6.exchangerate-api.com/v6/3e56b64e2fa04d6f02529321/latest/COP`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error en la solicitud de tasas de cambio');
        }
        const data = await response.json();
        console.log('Tasas de cambio obtenidas:', data.conversion_rates);
        return data.conversion_rates;
    } catch (error) {
        console.error('Error al obtener las tasas de cambio:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener las tasas de cambio. Inténtelo de nuevo más tarde.'
        });
    }
}

async function convertir() {
    const divisaSelect = document.getElementById('divisa');
    const monedaSeleccionadaSimbolo = divisaSelect.value;

    const valorCOPInput = document.getElementById('valorCOP');
    const valorCOP = valorCOPInput.value.trim();

    if (valorCOP === "") {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor ingrese un valor en COP.'
        });
        return;
    }

    const valorLimpio = valorCOP.replace(/[.,]/g, '');
    if (isNaN(valorLimpio)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor ingrese un valor válido en COP.'
        });
        return;
    }

    const valore = parseInt(valorLimpio);

    const tasasDeCambio = await obtenerTasasDeCambio();
    if (!tasasDeCambio) return;

    const tasa = tasasDeCambio[monedaSeleccionadaSimbolo];
    if (!tasa) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener la tasa de cambio para la moneda seleccionada.'
        });
        return;
    }

    const resultado = (valore * tasa).toFixed(2);
    console.log(`Valor en COP: ${valore}, Tasa de cambio: ${tasa}, Resultado: ${resultado}`);
    Swal.fire({
        title: 'Resultado de la Conversión',
        text: `El cambio de COP a ${monedaSeleccionadaSimbolo} es: ${monedaSeleccionadaSimbolo} ${resultado}`,
        icon: 'success'
    });

    const conversiones = JSON.parse(localStorage.getItem('conversiones')) || {};
    conversiones[monedaSeleccionadaSimbolo] = resultado;
    localStorage.setItem('conversiones', JSON.stringify(conversiones));
}

// Calculadora de Inversion
let inversionChart = null;

async function calcularInversion() {
    if (inversionChart) {
        inversionChart.destroy();
    }

    const divisaSelect = document.getElementById('inversionDivisa');
    const monedaSeleccionadaSimbolo = divisaSelect.value;

    const valorCOPInput = document.getElementById('inversionCOP');
    const valorCOP = valorCOPInput.value.trim();

    if (valorCOP === "") {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor ingrese un valor en COP.'
        });
        return;
    }

    const valorLimpio = valorCOP.replace(/[.,]/g, '');
    if (isNaN(valorLimpio)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor ingrese un valor válido en COP.'
        });
        return;
    }

    const valore = parseInt(valorLimpio);

    const tasasDeCambio = await obtenerTasasDeCambio();
    if (!tasasDeCambio) return;

    const tasa = tasasDeCambio[monedaSeleccionadaSimbolo];
    if (!tasa) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener la tasa de cambio para la moneda seleccionada.'
        });
        return;
    }

    const resultado = (valore * tasa).toFixed(2);
    console.log(`Valor en COP: ${valore}, Tasa de cambio: ${tasa}, Resultado: ${resultado}`);
    Swal.fire({
        title: 'Resultado de la Inversión',
        text: `El cambio de COP a ${monedaSeleccionadaSimbolo} es: ${monedaSeleccionadaSimbolo} ${resultado}`,
        icon: 'success'
    });


    const resultadoInversion = document.getElementById('resultadoInversion');
    resultadoInversion.innerHTML = `<p>El cambio de COP a ${monedaSeleccionadaSimbolo} es: ${monedaSeleccionadaSimbolo} ${resultado}</p>`;


    const inversionInicial = valore;
    const crecimientoAnual = 0.05; // 5% de crecimiento anual (por ejemplo)
    const anios = 10;
    const valores = [inversionInicial];

    for (let i = 1; i <= anios; i++) {
        const nuevoValor = valores[i - 1] * (1 + crecimientoAnual);
        valores.push(nuevoValor);
    }


    const ctx = document.getElementById('graficoInversion').getContext('2d');
    inversionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: anios + 1 }, (_, i) => i),
            datasets: [{
                label: `Inversión en ${monedaSeleccionadaSimbolo}`,
                data: valores,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Años'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Valor'
                    }
                }
            }
        }
    });
}

document.getElementById('inversionDivisa').addEventListener('change', () => {
    if (inversionChart) {
        inversionChart.destroy();
    }
    document.getElementById('resultadoInversion').innerHTML = '';
});

    
