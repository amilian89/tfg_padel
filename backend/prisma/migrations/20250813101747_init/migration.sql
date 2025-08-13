-- CreateTable
CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "fechaRegistro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rol" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Club" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    CONSTRAINT "Club_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Demandante" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "fechaNacimiento" DATETIME NOT NULL,
    "experiencia" TEXT NOT NULL,
    "formacion" TEXT NOT NULL,
    "nivelIngles" TEXT NOT NULL,
    "otrosIdiomas" TEXT NOT NULL,
    "disponibilidad" TEXT NOT NULL,
    "puedeViajar" BOOLEAN NOT NULL,
    "curriculumUrl" TEXT NOT NULL,
    "fotoPerfilUrl" TEXT NOT NULL,
    CONSTRAINT "Demandante_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Oferta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clubId" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fechaPublicacion" DATETIME NOT NULL,
    "fechaLimite" DATETIME NOT NULL,
    "tipoDeporte" TEXT NOT NULL,
    "tipoContrato" TEXT NOT NULL,
    "jornada" TEXT NOT NULL,
    "salario" REAL NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "requisitosExperiencia" TEXT NOT NULL,
    "requisitosFormacion" TEXT NOT NULL,
    "requisitosIdiomas" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "fechaActualizacion" DATETIME NOT NULL,
    "fechaCierre" DATETIME,
    CONSTRAINT "Oferta_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Solicitud" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ofertaId" INTEGER NOT NULL,
    "demandanteId" INTEGER NOT NULL,
    "fechaSolicitud" DATETIME NOT NULL,
    "estado" TEXT NOT NULL,
    "mensajeSolicitud" TEXT NOT NULL,
    "mensajeRespuesta" TEXT,
    "fechaRespuesta" DATETIME,
    "fechaFinalizacion" DATETIME,
    CONSTRAINT "Solicitud_ofertaId_fkey" FOREIGN KEY ("ofertaId") REFERENCES "Oferta" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Solicitud_demandanteId_fkey" FOREIGN KEY ("demandanteId") REFERENCES "Demandante" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notificacion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "fechaCreacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "urlRedireccion" TEXT NOT NULL,
    CONSTRAINT "Notificacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Club_usuarioId_key" ON "Club"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Demandante_usuarioId_key" ON "Demandante"("usuarioId");
