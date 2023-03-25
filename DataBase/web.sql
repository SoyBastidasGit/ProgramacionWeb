CREATE DATABASE WEB
USE WEB;

/* Definición de tabla de Usuarios */
CREATE TABLE Usuarios (
    ID_usuario INT PRIMARY KEY,
    Nombre VARCHAR(50),
    Contraseña VARCHAR(50),
    Tipo_de_usuario VARCHAR(50)
);

/* Definición de tabla de Clientes */
CREATE TABLE Clientes (
    ID_cliente INT PRIMARY KEY,
    Nombre VARCHAR(50),
    Dirección VARCHAR(100),
    Teléfono VARCHAR(20),
    Correo_electrónico VARCHAR(50)
);

/* Definición de tabla de Órdenes de Compra */
CREATE TABLE Ordenes_de_Compra (
    ID_orden INT PRIMARY KEY,
    ID_cliente INT,
    Fecha DATE,
    Total DECIMAL(10,2),
    FOREIGN KEY (ID_cliente) REFERENCES Clientes(ID_cliente)
);

/* Definición de tabla de Materia Prima */
CREATE TABLE Materia_Prima (
    ID_materia_prima INT PRIMARY KEY,
    Nombre VARCHAR(50),
    Precio DECIMAL(10,2),
    Unidad_de_medida VARCHAR(20)
);

/* Definición de tabla de Órdenes de Trabajo */
CREATE TABLE Ordenes_de_Trabajo (
    ID_orden_de_trabajo INT PRIMARY KEY,
    ID_materia_prima INT,
    Cantidad INT,
    Fecha_de_inicio DATE,
    Fecha_de_termino DATE,
    ID_usuario_de_planeación INT,
    FOREIGN KEY (ID_materia_prima) REFERENCES Materia_Prima(ID_materia_prima),
    FOREIGN KEY (ID_usuario_de_planeación) REFERENCES Usuarios(ID_usuario)
);

/* Definición de tabla de Planeación */
CREATE TABLE Planeación (
    ID_planeación INT PRIMARY KEY,
    Fecha DATE,
    ID_usuario_de_planeación INT,
    FOREIGN KEY (ID_usuario_de_planeación) REFERENCES Usuarios(ID_usuario)
);

/* Definición de tabla de Órdenes de Trabajo de Producción */
CREATE TABLE Ordenes_de_Trabajo_de_Producción (
    ID_orden_de_trabajo INT PRIMARY KEY,
    ID_usuario_de_piso_o_producción INT,
    FOREIGN KEY (ID_orden_de_trabajo) REFERENCES Ordenes_de_Trabajo(ID_orden_de_trabajo),
    FOREIGN KEY (ID_usuario_de_piso_o_producción) REFERENCES Usuarios(ID_usuario)
);

/* Definición de tabla de Impresión de Órdenes de Trabajo */
CREATE TABLE Impresión_de_Órdenes_de_Trabajo (
    ID_impresión INT PRIMARY KEY,
    ID_orden_de_trabajo INT,
    Fecha DATE,
    ID_usuario INT,
    FOREIGN KEY (ID_orden_de_trabajo) REFERENCES Ordenes_de_Trabajo(ID_orden_de_trabajo),
    FOREIGN KEY (ID_usuario) REFERENCES Usuarios(ID_usuario)
);

/* Definición de tabla de Impresión de Hojas de Planeación */
CREATE TABLE Impresión_de_Hojas_de_Planeación (
    ID_impresión INT PRIMARY KEY,
    ID_planeación INT,
    Fecha DATE,
    ID_usuario INT,
    FOREIGN KEY (ID_planeación) REFERENCES Planeación(ID_planeación),
    FOREIGN KEY (ID_usuario) REFERENCES Usuarios(ID_usuario)
);
