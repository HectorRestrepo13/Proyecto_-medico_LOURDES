const ctx = document.getElementById('myChart');
							
fetch('http://localhost:3000/medicamentos/traerEstadisticasMedicos')
    .then(response => response.json())
    .then(data => {
         // Preparar arreglos para cada conjunto de datos
         const labels = data.map(item => `${item.year}-${item.month.toString().padStart(2, '0')}`);
         const nombresDoctores = data.map(item => item.nombreMedico);
         const totalCitas = data.map(item => item.totalCitas);
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: nombresDoctores,
                datasets: [{
                    label: 'Doctores mas solicitados por mes',
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