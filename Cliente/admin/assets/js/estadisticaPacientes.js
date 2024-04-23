document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('myChart');
    const downloadBtn = document.getElementById('downloadExcel');

    let chartData = null; // Variable para almacenar los datos de la gráfica

    fetch('http://localhost:3000/paciente/traerEstadisticasPaciente')
        .then(response => response.json())
        .then(data => {
            chartData = data; // Almacena los datos de la gráfica
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
        // Crea un nuevo workbook
        const workbook = new ExcelJS.Workbook();

        // Agrega una nueva hoja al workbook
        const worksheet = workbook.addWorksheet('Cantidad de pacientes atendidos por mes');
// Estilo para los bordes
const borderStyle = {
    top: { style: 'thin', color: { argb: '000000' } }, // Borde superior
    bottom: { style: 'thin', color: { argb: '000000' } }, // Borde inferior
    left: { style: 'thin', color: { argb: '000000' } }, // Borde izquierdo
    right: { style: 'thin', color: { argb: '000000' } }, // Borde derecho
};
        // Agrega los datos de la gráfica a la hoja Excel
        if (chartData) {
            worksheet.columns = [
                { header: 'Mes', key: 'mes', width: 20 },
                { header: 'Pacientes Atendidos', key: 'pacientes', width: 20 }
            ];
        
            chartData.forEach(item => {
                worksheet.addRow({ mes: item.year + '-' + item.month.toString().padStart(2, '0'), pacientes: item.totalPacientesAtendidos });
            });
        
            // Estilo para el encabezado
            worksheet.getRow(1).eachCell(cell => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFF00' }, // Color de fondo amarillo
                };
                cell.font = {
                    bold: true,
                    color: { argb: '000000' },
                };
                cell.alignment = { horizontal: 'center' };
             
            });
        
            // Estilo para las celdas de datos
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {
                    row.eachCell(cell => {
                        cell.border = borderStyle;
                    });
                }
            });
        }
        // Crea un archivo Excel
        workbook.xlsx.writeBuffer().then(function(buffer) {
            // Crea un blob desde el buffer
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);

            // Crea un enlace para descargar el archivo
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Cantidad de pacientes atendidos por mes.xlsx';
            link.click();

            // Limpia el enlace y libera la URL del blob
            window.URL.revokeObjectURL(url);
        });
    });
});


