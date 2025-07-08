-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('club', 'demandante');

-- CreateEnum
CREATE TYPE "EstadoSolicitud" AS ENUM ('pendiente', 'aceptada', 'rechazada', 'finalizada');

-- CreateEnum
CREATE TYPE "EstadoOferta" AS ENUM ('activa', 'cerrada', 'vencida');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rol" "Rol" NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Club" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "nombreClub" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "codigoPostal" TEXT NOT NULL,
    "provincia" TEXT NOT NULL,
    "pais" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "sitioWeb" TEXT NOT NULL,
    "telefonoContacto" TEXT NOT NULL,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Demandante" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "fechaNacimiento" TIMESTAMP(3) NOT NULL,
    "experiencia" TEXT NOT NULL,
    "formacion" TEXT NOT NULL,
    "nivelIngles" TEXT NOT NULL,
    "otrosIdiomas" TEXT NOT NULL,
    "disponibilidad" TEXT NOT NULL,
    "puedeViajar" BOOLEAN NOT NULL,
    "curriculumUrl" TEXT NOT NULL,
    "fotoPerfilUrl" TEXT NOT NULL,

    CONSTRAINT "Demandante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Oferta" (
    "id" SERIAL NOT NULL,
    "clubId" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fechaPublicacion" TIMESTAMP(3) NOT NULL,
    "fechaLimite" TIMESTAMP(3) NOT NULL,
    "tipoDeporte" TEXT NOT NULL,
    "tipoContrato" TEXT NOT NULL,
    "jornada" TEXT NOT NULL,
    "salario" DOUBLE PRECISION NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "requisitosExperiencia" TEXT NOT NULL,
    "requisitosFormacion" TEXT NOT NULL,
    "requisitosIdiomas" TEXT NOT NULL,
    "estado" "EstadoOferta" NOT NULL,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,
    "fechaCierre" TIMESTAMP(3),

    CONSTRAINT "Oferta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Solicitud" (
    "id" SERIAL NOT NULL,
    "ofertaId" INTEGER NOT NULL,
    "demandanteId" INTEGER NOT NULL,
    "fechaSolicitud" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoSolicitud" NOT NULL,
    "mensajeSolicitud" TEXT NOT NULL,
    "mensajeRespuesta" TEXT,
    "fechaRespuesta" TIMESTAMP(3),
    "fechaFinalizacion" TIMESTAMP(3),

    CONSTRAINT "Solicitud_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contrato" (
    "id" SERIAL NOT NULL,
    "solicitudId" INTEGER NOT NULL,
    "ofertaId" INTEGER NOT NULL,
    "demandanteId" INTEGER NOT NULL,
    "clubId" INTEGER NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "estado" TEXT NOT NULL,
    "condiciones" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contrato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mensaje" (
    "id" SERIAL NOT NULL,
    "emisorId" INTEGER NOT NULL,
    "receptorId" INTEGER NOT NULL,
    "contenido" TEXT NOT NULL,
    "fechaEnvio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leido" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Mensaje_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notificacion" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "urlRedireccion" TEXT NOT NULL,

    CONSTRAINT "Notificacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Club_usuarioId_key" ON "Club"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Demandante_usuarioId_key" ON "Demandante"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Contrato_solicitudId_key" ON "Contrato"("solicitudId");

-- AddForeignKey
ALTER TABLE "Club" ADD CONSTRAINT "Club_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Demandante" ADD CONSTRAINT "Demandante_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Oferta" ADD CONSTRAINT "Oferta_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_ofertaId_fkey" FOREIGN KEY ("ofertaId") REFERENCES "Oferta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_demandanteId_fkey" FOREIGN KEY ("demandanteId") REFERENCES "Demandante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "Solicitud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_ofertaId_fkey" FOREIGN KEY ("ofertaId") REFERENCES "Oferta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_demandanteId_fkey" FOREIGN KEY ("demandanteId") REFERENCES "Demandante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensaje" ADD CONSTRAINT "Mensaje_emisorId_fkey" FOREIGN KEY ("emisorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensaje" ADD CONSTRAINT "Mensaje_receptorId_fkey" FOREIGN KEY ("receptorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacion" ADD CONSTRAINT "Notificacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
