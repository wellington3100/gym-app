-- Script para configurar la base de datos del gimnasio
-- Ejecutar este script en phpMyAdmin

-- Usar la base de datos gymapp
USE gymapp;

-- Crear tabla de usuarios si no existe
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(255) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

-- Crear tabla de membresías
CREATE TABLE IF NOT EXISTS membresias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    tipo_membresia VARCHAR(50) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    activa BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Verificar si existe la tabla maquinas y modificarla si es necesario
-- Si ya tienes datos en la tabla maquinas, esto los preservará
ALTER TABLE maquinas 
ADD COLUMN IF NOT EXISTS estado ENUM('disponible', 'en_uso', 'mantenimiento') DEFAULT 'disponible',
ADD COLUMN IF NOT EXISTS descripcion TEXT,
ADD COLUMN IF NOT EXISTS fecha_mantenimiento TIMESTAMP NULL;

-- Insertar usuario administrador por defecto (solo si no existe)
INSERT IGNORE INTO usuarios (nombre_completo, username, password) 
VALUES ('Administrador del Sistema', 'admin', SHA2('123', 256));

-- Insertar algunas máquinas de ejemplo (opcional)
INSERT IGNORE INTO maquinas (nombre, tipo, estado, descripcion) VALUES
('Cinta de Correr 1', 'Cardio', 'disponible', 'Cinta de correr profesional con inclinación automática'),
('Bicicleta Estática 1', 'Cardio', 'disponible', 'Bicicleta estática con monitor de frecuencia cardíaca'),
('Press de Banca', 'Pesas', 'disponible', 'Press de banca olímpico con barra y discos'),
('Máquina de Remo', 'Cardio', 'disponible', 'Máquina de remo con resistencia hidráulica'),
('Rack de Sentadillas', 'Pesas', 'mantenimiento', 'Rack para sentadillas con barra olímpica'),
('Elíptica 1', 'Cardio', 'disponible', 'Máquina elíptica con programas preestablecidos'),
('Multipower', 'Pesas', 'disponible', 'Sistema multipower para ejercicios seguros'),
('Cinta de Correr 2', 'Cardio', 'en_uso', 'Segunda cinta de correr con pantalla táctil');

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_usuarios_username ON usuarios(username);
CREATE INDEX idx_usuarios_activo ON usuarios(activo);
CREATE INDEX idx_maquinas_estado ON maquinas(estado);
CREATE INDEX idx_membresias_usuario ON membresias(usuario_id);
CREATE INDEX idx_membresias_activa ON membresias(activa);

-- Vista para obtener información completa de membresías
CREATE OR REPLACE VIEW vista_membresias AS
SELECT 
    m.id as membresia_id,
    u.nombre_completo,
    u.username,
    m.tipo_membresia,
    m.fecha_inicio,
    m.fecha_fin,
    m.precio,
    m.activa,
    CASE 
        WHEN m.fecha_fin < CURDATE() THEN 'Vencida'
        WHEN m.fecha_fin >= CURDATE() AND m.activa = 1 THEN 'Activa'
        ELSE 'Inactiva'
    END as estado_membresia
FROM membresias m
JOIN usuarios u ON m.usuario_id = u.id;

-- Procedimiento almacenado para obtener estadísticas del gimnasio
DELIMITER //
CREATE PROCEDURE ObtenerEstadisticasGym()
BEGIN
    SELECT 
        'Usuarios Totales' as concepto,
        COUNT(*) as cantidad
    FROM usuarios 
    WHERE activo = TRUE
    
    UNION ALL
    
    SELECT 
        'Máquinas Disponibles' as concepto,
        COUNT(*) as cantidad
    FROM maquinas 
    WHERE estado = 'disponible'
    
    UNION ALL
    
    SELECT 
        'Máquinas en Uso' as concepto,
        COUNT(*) as cantidad
    FROM maquinas 
    WHERE estado = 'en_uso'
    
    UNION ALL
    
    SELECT 
        'Máquinas en Mantenimiento' as concepto,
        COUNT(*) as cantidad
    FROM maquinas 
    WHERE estado = 'mantenimiento'
    
    UNION ALL
    
    SELECT 
        'Membresías Activas' as concepto,
        COUNT(*) as cantidad
    FROM membresias 
    WHERE activa = TRUE AND fecha_fin >= CURDATE();
END //
DELIMITER ;

-- Función para verificar si un usuario tiene membresía activa
DELIMITER //
CREATE FUNCTION TieneMembresiaActiva(usuario_id INT) 
RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE tiene_membresia BOOLEAN DEFAULT FALSE;
    
    SELECT COUNT(*) > 0 INTO tiene_membresia
    FROM membresias 
    WHERE usuario_id = usuario_id 
      AND activa = TRUE 
      AND fecha_fin >= CURDATE();
    
    RETURN tiene_membresia;
END //
DELIMITER ;

-- Insertar datos de ejemplo para membresías (opcional)
-- Esto creará membresías para el usuario admin
SET @admin_id = (SELECT id FROM usuarios WHERE username = 'admin');

INSERT IGNORE INTO membresias (usuario_id, tipo_membresia, fecha_inicio, fecha_fin, precio, activa)
VALUES 
(@admin_id, 'Premium', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 12 MONTH), 1200.00, TRUE);

-- Mostrar resumen de la configuración
SELECT 'CONFIGURACIÓN COMPLETADA' as status;
SELECT COUNT(*) as total_usuarios FROM usuarios;
SELECT COUNT(*) as total_maquinas FROM maquinas;
SELECT COUNT(*) as total_membresias FROM membresias;
