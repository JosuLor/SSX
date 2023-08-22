# SSX

Segunda parte del TFG. 
Este repositorio es el analizador Cross-Site Scripting (XSS) como programa independiente.
Se puede ejecutar de dos modos; como una aplicación web (con interfaz grafica) o como un programa desde la terminal (es decir, como un script)
Ambas formas de ejecución se encuentran en la misma imagen; comparten ficheros. Es por esto que, la versión de terminal está en la carpeta /webapp también.
En ambos casos, se genera un fichero .json con las vulnerabilidades encontradas. El fichero estará vacío ( {} ) si no se encuentra ninguna.

Para compilar la imagen, navegando hasta el directorio raíz:

    -> docker build -t xss .
    -> docker run -p 3000:3000 -it xss

Para salir del contenedor:

    -> exit

\==============================/
 ::: Versión aplicación web :::
/==============================\

Una vez levantado y esté corriendo el container, en el directorio /webapp (está por defecto, no hace falta navegar):

    -> npm start

Ahora la aplicación web está corriendo, y solamente queda acceder al puerto 3000 de la máquina local mediante un navegador web:

    -> (desde edge/chrome/safari/etc en la url) localhost:3000

Para detener el servidor web y salir de la consola de Nodejs:

    -> ctrl+c

Si se quiere cancelar un análisis, se tiene que detener el servidor y salir de la consola de Nodejs.
Para hacer otro análisis, levantar otra vez el servidor web:

    -> npm start

\========================/
 ::: Versión terminal :::
/========================\

Una vez levantado y esté corriendo el container, navegar hasta el directorio /webapp/analyzer:

    -> cd /analyzer

En ese directorio, se puede lanzar la versión terminal del programa, tanto para análisis de dominio como para análisis de url individual.
Para análisis de dominio completo:

    -> ./launcher.sh -d <dominio>

Para análisis de url individual:

    -> ./launcher.sh -u <url>