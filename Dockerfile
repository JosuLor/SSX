# Utiliza la imagen base de Alpine Linux
FROM alpine:3.16

RUN apk add --no-cache build-base

# Establece el directorio de trabajo en /app
WORKDIR /webapp

# Copia los archivos de la aplicación en el contenedor
COPY Web-app/ /webapp

RUN apk add --update nodejs npm

# instalar dependencias y utilidades
RUN apk add --no-cache \
    bash \
    nano \
    bind-tools \
    curl \
    py3-curl \
    py3-beautifulsoup4

# Actualizar repositorios e instalar dependencias necesarias
RUN apk update && \
    apk add --no-cache python3 git && \
    git clone https://github.com/epsylon/xsser.git /xsser && \
    ln -s /usr/bin/python3 /usr/bin/python

RUN cp -r /xsser/* /webapp/analyzer/

# Configurar el directorio de trabajo
WORKDIR /xsser

# Configurar variables de entorno
ENV PATH="/xsser:${PATH}"
