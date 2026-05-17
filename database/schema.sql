-- =====================================================================
-- schema.sql
-- Asignatura : CIB302 Taller de Plataformas Web - AIEP
-- Unidad     : 3 - Introduccion a los sistemas de bases de datos
-- Proposito  : Crear la base de datos y la tabla 'cliente' segun el
--              modelo entregado en la actividad sumativa de la semana 9.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) CREACION DE LA BASE DE DATOS
-- ---------------------------------------------------------------------
-- Usamos utf8mb4 para soportar correctamente tildes, enie y emojis.
CREATE DATABASE IF NOT EXISTS cib302_clientes
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE cib302_clientes;

-- ---------------------------------------------------------------------
-- 2) TABLA 'cliente'
-- ---------------------------------------------------------------------
-- Implementa el modelo de datos solicitado:
--   id_cliente : INT, clave primaria, autoincremental
--   nombre     : VARCHAR
--   email      : VARCHAR, UNICO  ->  habilita el 409 Conflict de la API
--   telefono   : VARCHAR
--   created_at : DATETIME
DROP TABLE IF EXISTS cliente;

CREATE TABLE cliente (
  id_cliente  INT          NOT NULL AUTO_INCREMENT,
  nombre      VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL,
  telefono    VARCHAR(20)  NOT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id_cliente),
  UNIQUE KEY uk_cliente_email (email),   -- restriccion UNIQUE en email
  INDEX idx_cliente_created  (created_at) -- indice para ordenar por fecha
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3) DATOS DE PRUEBA (opcionales pero utiles para probar GET de inmediato)
-- ---------------------------------------------------------------------
INSERT INTO cliente (nombre, email, telefono) VALUES
  ('Juan Perez',     'juan.perez@ejemplo.cl',     '+56912345678'),
  ('Maria Gonzalez', 'maria.gonzalez@ejemplo.cl', '+56987654321'),
  ('Carlos Soto',    'carlos.soto@ejemplo.cl',    '+56923456789'),
  ('Ana Rojas',      'ana.rojas@ejemplo.cl',      '+56945678901'),
  ('Pedro Munoz',    'pedro.munoz@ejemplo.cl',    '+56956789012');

-- ---------------------------------------------------------------------
-- 4) VERIFICACION
-- ---------------------------------------------------------------------
SELECT * FROM cliente;
