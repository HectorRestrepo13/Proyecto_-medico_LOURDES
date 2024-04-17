const ctx = document.getElementById('myChart');
							
fetch('http://localhost:3000/paciente/traerEstadisticascitasFacturadas')
    .then(response => response.json())
    .then(data => {
         // Preparar arreglos para cada conjunto de datos
         const labels = data.map(item => `${item.year}-${item.month.toString().padStart(2, '0')}`);
         const totalCitas = data.map(item => item.totalCitas);
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Citas facturadas por mes',
                    data: data.map(item => item.totalCitas),
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