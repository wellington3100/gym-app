import mysql.connector
from mysql.connector import Error
from datetime import datetime
import hashlib

class GymMySQLDatabase:
    def __init__(self, host='localhost', username='root', password='', database='gymapp'):
        self.host = host
        self.username = username
        self.password = password
        self.database = database
        self.connection = None
        self.connect()
    
    def connect(self):
        """Establece conexión con la base de datos MySQL"""
        try:
            self.connection = mysql.connector.connect(
                host=self.host,
                user=self.username,
                password=self.password,
                database=self.database,
                charset='utf8mb4'
            )
            
            if self.connection.is_connected():
                print(f"Conexión exitosa a la base de datos {self.database}")
                self.create_tables_if_not_exist()
                return True
                
        except Error as e:
            print(f"Error al conectar con MySQL: {e}")
            return False
    
    def create_tables_if_not_exist(self):
        """Crea las tablas necesarias si no existen"""
        try:
            cursor = self.connection.cursor()
            
            # Crear tabla usuarios si no existe
            create_users_table = """
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre_completo VARCHAR(255) NOT NULL,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                activo BOOLEAN DEFAULT TRUE
            )
            """
            cursor.execute(create_users_table)
            
            # Crear tabla membresías si no existe
            create_memberships_table = """
            CREATE TABLE IF NOT EXISTS membresias (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT,
                tipo_membresia VARCHAR(50) NOT NULL,
                fecha_inicio DATE NOT NULL,
                fecha_fin DATE NOT NULL,
                precio DECIMAL(10,2) NOT NULL,
                activa BOOLEAN DEFAULT TRUE,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
            )
            """
            cursor.execute(create_memberships_table)
            
            # Verificar si la tabla maquinas existe, si no, crearla
            create_machines_table = """
            CREATE TABLE IF NOT EXISTS maquinas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(255) NOT NULL,
                tipo VARCHAR(100) NOT NULL,
                estado ENUM('disponible', 'en_uso', 'mantenimiento') DEFAULT 'disponible',
                descripcion TEXT,
                fecha_mantenimiento TIMESTAMP NULL
            )
            """
            cursor.execute(create_machines_table)
            
            self.connection.commit()
            cursor.close()
            print("Tablas verificadas/creadas correctamente")
            
        except Error as e:
            print(f"Error al crear tablas: {e}")
    
    def hash_password(self, password):
        """Hashea la contraseña para seguridad"""
        return hashlib.sha256(password.encode()).hexdigest()
    
    def create_user(self, nombre_completo, username, password):
        """Crear un nuevo usuario en la base de datos"""
        try:
            cursor = self.connection.cursor()
            hashed_password = self.hash_password(password)
            
            query = """
            INSERT INTO usuarios (nombre_completo, username, password) 
            VALUES (%s, %s, %s)
            """
            
            cursor.execute(query, (nombre_completo, username, hashed_password))
            self.connection.commit()
            cursor.close()
            
            return True, "Usuario creado exitosamente"
            
        except mysql.connector.IntegrityError:
            return False, "El nombre de usuario ya existe"
        except Error as e:
            return False, f"Error al crear usuario: {e}"
    
    def verify_user(self, username, password):
        """Verificar credenciales del usuario"""
        try:
            cursor = self.connection.cursor()
            hashed_password = self.hash_password(password)
            
            query = """
            SELECT id, nombre_completo, username 
            FROM usuarios 
            WHERE username = %s AND password = %s AND activo = TRUE
            """
            
            cursor.execute(query, (username, hashed_password))
            result = cursor.fetchone()
            cursor.close()
            
            if result:
                return True, {
                    'id': result[0],
                    'nombre_completo': result[1],
                    'username': result[2]
                }
            else:
                return False, "Credenciales incorrectas"
                
        except Error as e:
            return False, f"Error al verificar usuario: {e}"
    
    def get_all_users(self):
        """Obtener todos los usuarios"""
        try:
            cursor = self.connection.cursor()
            query = "SELECT id, nombre_completo, username, fecha_registro FROM usuarios WHERE activo = TRUE"
            cursor.execute(query)
            results = cursor.fetchall()
            cursor.close()
            return results
            
        except Error as e:
            print(f"Error al obtener usuarios: {e}")
            return []
    
    def get_machines(self):
        """Obtener todas las máquinas"""
        try:
            cursor = self.connection.cursor()
            query = "SELECT id, nombre, tipo, estado, descripcion FROM maquinas"
            cursor.execute(query)
            results = cursor.fetchall()
            cursor.close()
            return results
            
        except Error as e:
            print(f"Error al obtener máquinas: {e}")
            return []
    
    def add_machine(self, nombre, tipo, descripcion=""):
        """Agregar una nueva máquina"""
        try:
            cursor = self.connection.cursor()
            query = """
            INSERT INTO maquinas (nombre, tipo, descripcion) 
            VALUES (%s, %s, %s)
            """
            
            cursor.execute(query, (nombre, tipo, descripcion))
            self.connection.commit()
            cursor.close()
            
            return True, "Máquina agregada exitosamente"
            
        except Error as e:
            return False, f"Error al agregar máquina: {e}"
    
    def update_machine_status(self, machine_id, nuevo_estado):
        """Actualizar el estado de una máquina"""
        try:
            cursor = self.connection.cursor()
            query = "UPDATE maquinas SET estado = %s WHERE id = %s"
            cursor.execute(query, (nuevo_estado, machine_id))
            self.connection.commit()
            cursor.close()
            
            return True, "Estado actualizado exitosamente"
            
        except Error as e:
            return False, f"Error al actualizar estado: {e}"
    
    def close_connection(self):
        """Cerrar la conexión a la base de datos"""
        if self.connection and self.connection.is_connected():
            self.connection.close()
            print("Conexión cerrada")
    
    def __del__(self):
        """Destructor para cerrar conexión automáticamente"""
        self.close_connection()
