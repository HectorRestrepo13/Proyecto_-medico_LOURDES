let btnDoctor = document.getElementById("btnDoctor");
let btnUsuario = document.getElementById("btnUsuario");
let rolSelecionado = document.getElementById("rolSelecionado");

let btnIniciarSession = document.getElementById("btnIniciarSession");

btnDoctor.addEventListener("click", () => {
  btnDoctor.style.backgroundColor = "#46D7F3";
  btnDoctor.style.color = "black";
  rolSelecionado.innerText = "doctor";

  btnUsuario.style.backgroundColor = "white";
  btnUsuario.style.color = "#46D7F3";
});

btnUsuario.addEventListener("click", () => {
  btnUsuario.style.backgroundColor = "#46D7F3";
  btnUsuario.style.color = "black";
  rolSelecionado.innerText = "usuario";

  btnDoctor.style.backgroundColor = "white";
  btnDoctor.style.color = "#46D7F3";
});
