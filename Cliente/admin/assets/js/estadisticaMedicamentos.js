const ctx = document.getElementById('myChart');

fetch('http://localhost:3000/medicamentos/traerEstadisticasMedicamentos')
    .then(response => response.json())
    .then(data => {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(item => item.medicamento),
                datasets: [{
                    label: 'Medicamentos más necesitados por mes',
                    data: data.map(item => item.totalMedicamentosVendidos),
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                },
                tooltips: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.dataset.data[context.dataIndex]} - ${data[context.dataIndex].medicamento}`;
                        }
                    }
                }
            }
        });
    })
    .catch(error => console.error('Error al obtener los datos de la API:', error));
