# Gario Project

Proceso de Instalación:

1. Instalar NodeJS
2. Clonar el Proyecto
3. Abrir una terminal dentro del proyecto
    - Escribir los comandos
        - npm install
        - npm install express cors multer path fs uuid jsonwebtoken bcryptjs mysql2 Joi
4. En la ruta /DATABASE/Connect.js
    - Agregar los datos correspondientes
5. Abrir el Puerto 3000
    - Windows
        - Powershell Admin Escribir el comando
            - New-NetFirewallRule -DisplayName "Abrir Puerto 3000" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow


Funcionamiento de la API

1. Dentro de la terminal escribir el comando
    - node server.js