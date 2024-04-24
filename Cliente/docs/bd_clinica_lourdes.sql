-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 27-03-2024 a las 00:37:38
-- Versión del servidor: 8.0.34
-- Versión de PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bd_clinica_lourdes`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cita`
--

CREATE TABLE `cita` (
  `idCita` int NOT NULL,
  `fechaCita` date NOT NULL,
  `horaCita` time NOT NULL,
  `estadoCita` varchar(85) NOT NULL DEFAULT 'Pendiente',
  `paciente_cedulaPaciente` bigint NOT NULL,
  `medico_cedulaMedico` bigint NOT NULL
) 

--
-- Volcado de datos para la tabla `cita`
--

INSERT INTO `cita` (`idCita`, `fechaCita`, `horaCita`, `estadoCita`, `paciente_cedulaPaciente`, `medico_cedulaMedico`) VALUES
(1, '2024-03-23', '10:29:42', 'Pendiente', 322, 1006),
(2, '2024-03-31', '05:29:42', 'Pendiente', 322, 1006);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalleformula`
--

CREATE TABLE `detalleformula` (
  `idDetalle` int NOT NULL,
  `cantidadDetalle` int DEFAULT NULL,
  `posologiaDetalle` varchar(200) DEFAULT NULL,
  `item_idItem` int NOT NULL,
  `formula_idFormula` int NOT NULL
) 

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `formula`
--

CREATE TABLE `formula` (
  `idFormula` int NOT NULL,
  `fechaFormula` date NOT NULL,
  `paciente_cedulaPaciente` bigint NOT NULL,
  `medico_cedulaMedico` bigint NOT NULL
) 

--
-- Volcado de datos para la tabla `formula`
--

INSERT INTO `formula` (`idFormula`, `fechaFormula`, `paciente_cedulaPaciente`, `medico_cedulaMedico`) VALUES
(1, '2024-03-19', 322, 1006);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial`
--

CREATE TABLE `historial` (
  `idHistorial` int NOT NULL,
  `sintomas` varchar(300) NOT NULL,
  `descripcion` varchar(300) DEFAULT NULL,
  `formula_idFormula` int DEFAULT NULL
) 

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `item`
--

CREATE TABLE `item` (
  `idItem` int NOT NULL,
  `descripcionItem` varchar(250) DEFAULT NULL,
  `existenciaItem` int NOT NULL
) 

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medico`
--

CREATE TABLE `medico` (
  `cedulaMedico` bigint NOT NULL,
  `nombreMedico` varchar(200) NOT NULL,
  `apellidoMedico` varchar(200) NOT NULL,
  `emailMedico` varchar(250) NOT NULL,
  `especialidadMedico` varchar(150) NOT NULL,
  `usuarioMedico` varchar(200) NOT NULL,
  `password` varchar(85) NOT NULL
) 

--
-- Volcado de datos para la tabla `medico`
--

INSERT INTO `medico` (`cedulaMedico`, `nombreMedico`, `apellidoMedico`, `emailMedico`, `especialidadMedico`, `usuarioMedico`, `password`) VALUES
(1006, 'Hector Fabio', 'Restrepo', 'hector@gmail.com', 'Odontólogo', 'hector1388', '12345');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paciente`
--

CREATE TABLE `paciente` (
  `cedulaPaciente` bigint NOT NULL,
  `nombrePaciente` varchar(200) NOT NULL,
  `apellidoPaciente` varchar(200) NOT NULL,
  `emailPaciente` varchar(150) NOT NULL,
  `telefonoPaciente` varchar(50) DEFAULT NULL,
  `movilPaciente` varchar(105) DEFAULT NULL,
  `fechaNacimientoPqciente` date NOT NULL,
  `epsPaciente` varchar(250) NOT NULL,
  `usuarioPaciente` varchar(200) NOT NULL,
  `passwordPaciente` varchar(200) NOT NULL
) 

--
-- Volcado de datos para la tabla `paciente`
--

INSERT INTO `paciente` (`cedulaPaciente`, `nombrePaciente`, `apellidoPaciente`, `emailPaciente`, `telefonoPaciente`, `movilPaciente`, `fechaNacimientoPqciente`, `epsPaciente`, `usuarioPaciente`, `passwordPaciente`) VALUES
(322, 'narva', 'perez', 'narva@gmail.com', '32199', '2514', '2003-03-04', 'sanitas', 'narva123', '12345');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `idRol` int NOT NULL,
  `nombreRol` varchar(200) NOT NULL
) 

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `cedulaUser` bigint NOT NULL,
  `emailUser` varchar(200) NOT NULL,
  `userName` varchar(200) NOT NULL,
  `password` varchar(250) NOT NULL,
  `rol_idRol` int NOT NULL
) 

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cita`
--
ALTER TABLE `cita`
  ADD PRIMARY KEY (`idCita`,`paciente_cedulaPaciente`,`medico_cedulaMedico`),
  ADD KEY `fk_cita_paciente1_idx` (`paciente_cedulaPaciente`),
  ADD KEY `fk_cita_medico1_idx` (`medico_cedulaMedico`);

--
-- Indices de la tabla `detalleformula`
--
ALTER TABLE `detalleformula`
  ADD PRIMARY KEY (`idDetalle`,`item_idItem`,`formula_idFormula`),
  ADD KEY `fk_detalleformula_item_idx` (`item_idItem`),
  ADD KEY `fk_detalleformula_formula1_idx` (`formula_idFormula`);

--
-- Indices de la tabla `formula`
--
ALTER TABLE `formula`
  ADD PRIMARY KEY (`idFormula`,`paciente_cedulaPaciente`,`medico_cedulaMedico`),
  ADD KEY `fk_formula_paciente1_idx` (`paciente_cedulaPaciente`),
  ADD KEY `fk_formula_medico1_idx` (`medico_cedulaMedico`);

--
-- Indices de la tabla `historial`
--
ALTER TABLE `historial`
  ADD PRIMARY KEY (`idHistorial`),
  ADD KEY `formula_idFormula` (`formula_idFormula`);

--
-- Indices de la tabla `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`idItem`);

--
-- Indices de la tabla `medico`
--
ALTER TABLE `medico`
  ADD PRIMARY KEY (`cedulaMedico`);

--
-- Indices de la tabla `paciente`
--
ALTER TABLE `paciente`
  ADD PRIMARY KEY (`cedulaPaciente`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`idRol`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`cedulaUser`,`rol_idRol`),
  ADD KEY `fk_users_rol1_idx` (`rol_idRol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cita`
--
ALTER TABLE `cita`
  MODIFY `idCita` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `detalleformula`
--
ALTER TABLE `detalleformula`
  MODIFY `idDetalle` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `formula`
--
ALTER TABLE `formula`
  MODIFY `idFormula` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `historial`
--
ALTER TABLE `historial`
  MODIFY `idHistorial` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `item`
--
ALTER TABLE `item`
  MODIFY `idItem` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `idRol` int NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cita`
--
ALTER TABLE `cita`
  ADD CONSTRAINT `fk_cita_medico1` FOREIGN KEY (`medico_cedulaMedico`) REFERENCES `medico` (`cedulaMedico`),
  ADD CONSTRAINT `fk_cita_paciente1` FOREIGN KEY (`paciente_cedulaPaciente`) REFERENCES `paciente` (`cedulaPaciente`);

--
-- Filtros para la tabla `detalleformula`
--
ALTER TABLE `detalleformula`
  ADD CONSTRAINT `fk_detalleformula_formula1` FOREIGN KEY (`formula_idFormula`) REFERENCES `formula` (`idFormula`),
  ADD CONSTRAINT `fk_detalleformula_item` FOREIGN KEY (`item_idItem`) REFERENCES `item` (`idItem`);

--
-- Filtros para la tabla `formula`
--
ALTER TABLE `formula`
  ADD CONSTRAINT `fk_formula_medico1` FOREIGN KEY (`medico_cedulaMedico`) REFERENCES `medico` (`cedulaMedico`),
  ADD CONSTRAINT `fk_formula_paciente1` FOREIGN KEY (`paciente_cedulaPaciente`) REFERENCES `paciente` (`cedulaPaciente`);

--
-- Filtros para la tabla `historial`
--
ALTER TABLE `historial`
  ADD CONSTRAINT `historial_ibfk_1` FOREIGN KEY (`formula_idFormula`) REFERENCES `formula` (`idFormula`);

--
-- Filtros para la tabla `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_rol1` FOREIGN KEY (`rol_idRol`) REFERENCES `rol` (`idRol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
