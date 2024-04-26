function validarCorreo(correo) {
    const expresionRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return expresionRegular.test(correo);
}
// Obtener el id del usuario del localStorage
const datos = JSON.parse(window.localStorage.getItem(1));
fetch(`http://localhost:3000/Funcionario/traerFuncionarioAdminGerente`)
  .then((res) => res.json())
  .then((Programadas) => {
    const miTabla = document.getElementById("datatable");
    Programadas.forEach((Citas) => {
      let fila = `
        <tr>
          <td>${Citas.cedulaUser !== undefined ? Citas.cedulaUser : ""}</td>
        
          <td>${Citas.emailUser !== undefined ? Citas.emailUser : ""}</td>
          <td>${Citas.userName !== undefined ? Citas.userName : ""}</td>

      
          <td>${Citas.nombreRol!== undefined ? Citas.nombreRol : ""}</td>
          </tr>
      `;
      miTabla.innerHTML += fila;
    });

    // Inicializar DataTables después de insertar los datos
    $("#miTabla").DataTable({
      responsive:true,
      autoWidth: true, // Permite que las columnas se ajusten automáticamente
      lengthMenu: [5, 10, 15, 50, 100, 250, 500],
   
      columnDefs: [
        { orderable: false, targets: [2, 3] },
        { searchable: false, targets: [2, 3] },
      ],
      pageLength: 5,
      destroy: true,
      language: {
        lengthMenu: "Mostrar _MENU_ Usuarios por página",
        zeroRecords: "Ningún Usuarios encontrado",
        info: "Mostrando _START_ a _END_ Usuarios  de _TOTAL_ ",
        infoEmpty: "Ningún Usuarios encontrado",
        infoFiltered: "(filtrados desde _MAX_ Usuarios  totales)",
        search: "Buscar:",
        loadingRecords: "Cargando...",
        paginate: {
          first: "<<",
          last: ">>",
          next: ">",
          previous: "<",
        },
      },
    });
  })
  .catch((error) => console.error("Error al cargar el archivo JSON:", error));
  function verificarExistenciaUsuario(cedula) {
    return fetch(`http://localhost:3000/user/verificarUsers/${cedula}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al buscar Usuario.");
            }
            return response.json();
        })
        .then((data) => {
          
            if (data.length > 0) {
                return true; // El Usuario existe
            } else {
                return false; // El Usuario no existe
            }
        })
        .catch((error) => {
            console.error('Error al verificar la existencia del Usuario:', error);
            return false; // En caso de error, asumimos que el doctor no existe
        });
}
const btnEnviar = document.getElementById("btnEnviar");
btnEnviar.addEventListener('click', async (e) => {
    e.preventDefault(); // Evitar que la página se recargue

    // Obtener los valores de los campos
    const cedula = document.getElementById("cedulaUsers").value;
    const email = document.getElementById("emailUsers").value;
    const rolSelect = document.getElementById("RolUser").value;
  
    const usuarioNombre = document.getElementById("usuarioUsers").value;
  
   const pass=document.getElementById("password").value;
    // Verificar que todos los campos obligatorios estén llenos
    if (!cedula || !email || !rolSelect || !usuarioNombre || !pass) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Por favor, complete todos los campos obligatorios.',
        });
        return;
    }
    // Validar el correo electrónico
if (!validarCorreo(email)) {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor, ingrese un correo electrónico válido.',
    });
    return; // Detener el envío del formulario si el correo electrónico no es válido
}

    // Verificar la existencia del paciente
    try {
        const usuarioExiste= await verificarExistenciaUsuario(cedula);
        if (usuarioExiste) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El usuario existe en la base de datos. Verifique la cédula.'
            });
            return; // Detener el envío del formulario si el paciente si existe
        }
        console.log(email)

        // Si pasa todas las validaciones, enviar los datos al servidor
        const data = {
            cedulaUser: cedula,
            emailUser: email,  
            userName: usuarioNombre,      
            rol_idRol:parseInt(rolSelect) ,
            password:pass
        };
       

        const response = await fetch("http://localhost:3000/usuario/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Error al guardar los datos.");
        }

        Swal.fire({
            title: "¡Éxito!",
            text: "Se agregó correctamente.",
            icon: "success",
        }).then(() => {
            window.location.assign("http://127.0.0.1:5501/Cliente/admin/tablaAdministrador.html");
        });
    } catch (error) {
        console.error('Error al agregar el Usuario:', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Hubo un error al agregar el Usuario. Por favor, inténtelo de nuevo más tarde.'
        });
    }
});


const tabla = document.getElementById("miTabla");

tabla.addEventListener("click", (event) => {
    const fila = event.target.closest("tr"); // Obtener la fila de la tabla

    event.preventDefault();
    function generarOpcionesRol(rolActual) {
        const opciones = [
          { valor: 4, texto: 'Bodeguero' },
          { valor: 2, texto: 'Secretaria' },
          { valor: 1, texto: 'Administrador' },
          { valor: 0, texto: 'Gerente' },
        ];
      
        return opciones.map(opcion => `
          <option value="${opcion.valor}" ${rolActual === opcion.texto ? 'selected' : ''}>${opcion.texto}</option>
        `).join('');
      }
     
    // Obtener los valores de las celdas de la fila
    const cedula = fila.querySelector('td:nth-child(1)').textContent;
    const email = fila.querySelector('td:nth-child(2)').textContent;
    const usuario = fila.querySelector('td:nth-child(3)').textContent;
    const rolTabla = fila.querySelector('td:nth-child(4)').textContent.trim();
    // Generar las opciones del select con el rol actual seleccionado
const opcionesRol = generarOpcionesRol(rolTabla);
  
    


    if (fila) {
        // Crear el mensaje para el SweetAlert2
        const mensaje = `
        <div>
            <label for="passwordPaciente" style="color: black;">Cedula:</label>
            <input type="number" id="cedula" style="color: black;" value="${cedula}" disabled>
            <label for="passwordPaciente" style="color: black;">Email:</label>
            <input type="email" id="email" value="${email}" required>
            <label for="passwordPaciente" style="color: black;">Nombre de usuario:</label>
            <input type="text" id="usuario" value="${usuario}" required>
    
            <label for="rol" style="color: black;">Rol:</label>
            <select id="RolUserEditar" name="RolUserEditar">
            ${opcionesRol}
        </select>
        <label for="passwordPaciente" style="color: black;">Contraseña:</label>
        <input type="password" id="passwordd" value="" required>
        </div>
    `;   

        // Mostrar el SweetAlert2 con los valores de los campos
        Swal.fire({
            title: '¡Detalle del Medico!',
            html: mensaje,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, ¡Guardar edición!',
            cancelButtonText: 'Cancelar',
          
        }).then((result) => {
            if (result.isConfirmed) {
                const id = document.getElementById("cedula").value;
                const email = document.getElementById("email").value;
                const nombre = document.getElementById('usuario').value;
                const pass=document.getElementById("passwordd").value;
           
const rolSelect = document.getElementById("RolUserEditar").value;
        
            

                // Verificar si algún campo está vacío
                if (email == "" ||
                    nombre == "" ||
                    pass==""
                   ) {
                    // Mostrar una alerta con SweetAlert2
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Por favor, completa todos los campos.',
                    });
             console.log(email, nombre, pass);
                }  else{
                if (!validarCorreo(email)) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Por favor, ingrese un correo electrónico válido.',
                    });
                    return; // Detener el envío del formulario si el correo electrónico no es válido
                }
                    const data = {
                        cedulaUser: id, // Asegúrate de obtener el ID del paciente que deseas editar
                        emailUser: email,
                        userName: nombre,
                        rol_idRol: parseInt(rolSelect),
                    password:pass
                    };
               
                    fetch(`http://localhost:3000/usuario/editarUsuario/${data.cedulaUser}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(data),
                        })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error("Error al actualizar el dato del elemento.");
                            }

                            Swal.fire({
                                title: "¡Éxito!",
                                text: "La edición se ha completado correctamente.",
                                icon: "success",
                            }).then(() => {
                                window.location.assign("http://127.0.0.1:5501/Cliente/admin/tablaAdministrador.html");
                            });
                        })
                        .catch((error) => {
                            console.error('Error al actualizar el usuario:', error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Hubo un error al actualizar el usuario. Por favor, inténtelo de nuevo más tarde.'
                            });
                        });
                

            }
        }
        })
    }
});