/* import { jsPDF } from 'jspdf'; */

// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('myChart');
    const downloadBtn = document.getElementById('downloadPdf');

    fetch('http://localhost:3000/paciente/traerEstadisticasPaciente')
        .then(response => response.json())
        .then(data => {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.map(item => `${item.year}-${item.month.toString().padStart(2, '0')}`),
                    datasets: [{
                        label: 'Pacientes atendidos por mes',
                        data: data.map(item => item.totalPacientesAtendidos),
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error al obtener los datos de la API:', error));

    // Agrega un evento de escucha al botón de descarga
    downloadBtn.addEventListener('click', function() {
        const doc = new jsPDF();
        const imgData = ctx.toDataURL("image/png", 1.0);
        doc.addImage(imgData, "JPEG", 0, 0);
        doc.save("graf01.pdf");
    });
});
