CREATE DATABASE  IF NOT EXISTS `migibi` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `migibi`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: migibi
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cat_alimento`
--

DROP TABLE IF EXISTS `cat_alimento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cat_alimento` (
  `Id_Alimento` int NOT NULL AUTO_INCREMENT,
  `Id_Tipo_Alimento` int NOT NULL,
  `Alimento` varchar(250) NOT NULL,
  `Activo` tinyint(1) NOT NULL DEFAULT '1',
  `Id_Usuario_Alta` int NOT NULL,
  `Fecha_Alta` datetime NOT NULL,
  `Id_Usuario_Modif` int DEFAULT NULL,
  `Fecha_Modif` datetime DEFAULT NULL,
  `Id_Usuario_Baja` int DEFAULT NULL,
  `Fecha_Baja` datetime DEFAULT NULL,
  `Es_Perecedero` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`Id_Alimento`),
  KEY `Id_Usuario_Alta` (`Id_Usuario_Alta`),
  KEY `Id_Usuario_Modif` (`Id_Usuario_Modif`),
  KEY `Id_Usuario_Baja` (`Id_Usuario_Baja`),
  KEY `Id_Tipo_Alimento` (`Id_Tipo_Alimento`),
  CONSTRAINT `cat_alimento_ibfk_1` FOREIGN KEY (`Id_Usuario_Alta`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `cat_alimento_ibfk_2` FOREIGN KEY (`Id_Usuario_Modif`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `cat_alimento_ibfk_3` FOREIGN KEY (`Id_Usuario_Baja`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `cat_alimento_ibfk_4` FOREIGN KEY (`Id_Tipo_Alimento`) REFERENCES `cat_tipo_alimento` (`Id_Tipo_Alimento`)
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cat_alimento`
--

LOCK TABLES `cat_alimento` WRITE;
/*!40000 ALTER TABLE `cat_alimento` DISABLE KEYS */;
INSERT INTO `cat_alimento` VALUES 
(1,5,'Huevos',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),
(2,7,'Frijoles bayos',1,2,'2024-04-28 02:34:41',2,'2025-03-27 01:47:44',NULL,NULL,1),
(3,1,'Calabacita',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),
(4,9,'Sal con ajo en polvo',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,0),
(5,9,'Sal',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,0),
(6,9,'Pimienta negra molida',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,0),
(7,6,'Harina de trigo',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,0),(8,5,'Huevos batidos',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(9,6,'Pan molido',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,0),(10,1,'Jitomate',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(11,1,'Cebolla asada',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(12,9,'Diente de ajo',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(13,9,'Concentrado de tomate con pollo',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(14,9,'Cilantro',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(15,3,'Filete de pescado',1,2,'2024-04-28 02:34:41',2,'2025-03-27 01:46:48',NULL,NULL,1),(16,10,'Aceite vegetal',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,0),(17,3,'Pechuga de pollo',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(18,1,'Espinaca',1,2,'2024-04-28 02:34:41',2,'2025-03-27 01:46:11',NULL,NULL,1),(19,1,'Champiñones',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(20,10,'Mantequilla',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(21,5,'Caldo de pollo',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(22,4,'Crema de leche',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(24,9,'Pimienta',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,0),(25,4,'Media crema',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(26,5,'Mayonesa',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(27,1,'Cebolla morada',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(28,2,'Pepino',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(29,3,'Atun',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(31,9,'Chile cerrano',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(32,6,'Paquete de galletas saladas',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(33,8,'Agua',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,0),(34,9,'Ajo en polvo',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,0),(35,10,'Aceite de maiz',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(36,3,'Carne de res molida',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(37,4,'Leche evaporada',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(38,6,'Paquete de pasta de espaguetti',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(39,9,'Sal con cebolla en polvo',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,0),(40,1,'Cebolla',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(41,5,'Manteca de cerdo',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(42,10,'Jugo de naranja',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(43,3,'Res',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(44,3,'Pechuga de pollo empanizada',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(45,1,'Zanahoria',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(46,7,'Pechuga de pavo',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(47,6,'Masa de maiz',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(48,2,'Tomates',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(49,3,'Pollo',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(50,4,'Crema',1,2,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(98,1,'Papas fritas',1,4,'2024-06-05 16:29:34',NULL,NULL,NULL,NULL,1);
/*!40000 ALTER TABLE `cat_alimento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cat_tipo_alimento`
--

DROP TABLE IF EXISTS `cat_tipo_alimento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cat_tipo_alimento` (
  `Id_Tipo_Alimento` int NOT NULL AUTO_INCREMENT,
  `Tipo_Alimento` varchar(250) NOT NULL,
  `Activo` tinyint(1) NOT NULL DEFAULT (1),
  `Id_Usuario_Alta` int NOT NULL,
  `Fecha_Alta` datetime NOT NULL,
  `Id_Usuario_Modif` int DEFAULT NULL,
  `Fecha_Modif` datetime DEFAULT NULL,
  `Id_Usuario_Baja` int DEFAULT NULL,
  PRIMARY KEY (`Id_Tipo_Alimento`),
  KEY `Id_Usuario_Alta` (`Id_Usuario_Alta`),
  KEY `Id_Usuario_Modif` (`Id_Usuario_Modif`),
  KEY `Id_Usuario_Baja` (`Id_Usuario_Baja`),
  CONSTRAINT `cat_tipo_alimento_ibfk_1` FOREIGN KEY (`Id_Usuario_Alta`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `cat_tipo_alimento_ibfk_2` FOREIGN KEY (`Id_Usuario_Modif`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `cat_tipo_alimento_ibfk_3` FOREIGN KEY (`Id_Usuario_Baja`) REFERENCES `usuario` (`Id_Usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cat_tipo_alimento`
--

LOCK TABLES `cat_tipo_alimento` WRITE;
/*!40000 ALTER TABLE `cat_tipo_alimento` DISABLE KEYS */;
INSERT INTO `cat_tipo_alimento` VALUES 
(1,'Vegetal',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL),
(2,'Fruta',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL),
(3,'Carne y pescado',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL),(4,'Lacteo',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL),(5,'Otro de origen animal',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL),(6,'Cereal',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL),(7,'Legumbre',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL),(8,'Bebida',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL),(9,'Especia',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL),(10,'Azúcares y grasas',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL),(11,'Otros',1,1,'2024-04-30 04:24:30',NULL,NULL,NULL);
/*!40000 ALTER TABLE `cat_tipo_alimento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cat_tipo_consumo`
--

DROP TABLE IF EXISTS `cat_tipo_consumo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cat_tipo_consumo` (
  `Id_Tipo_Consumo` int NOT NULL AUTO_INCREMENT,
  `Tipo_Consumo` varchar(250) NOT NULL,
  `Activo` tinyint(1) NOT NULL DEFAULT (1),
  `Id_Usuario_Alta` int NOT NULL,
  `Fecha_Alta` datetime NOT NULL,
  `Id_Usuario_Modif` int DEFAULT NULL,
  `Fecha_Modif` datetime DEFAULT NULL,
  `Id_Usuario_Baja` int DEFAULT NULL,
  `Fecha_Baja` datetime DEFAULT NULL,
  PRIMARY KEY (`Id_Tipo_Consumo`),
  KEY `Id_Usuario_Alta` (`Id_Usuario_Alta`),
  KEY `Id_Usuario_Modif` (`Id_Usuario_Modif`),
  KEY `Id_Usuario_Baja` (`Id_Usuario_Baja`),
  CONSTRAINT `cat_tipo_consumo_ibfk_1` FOREIGN KEY (`Id_Usuario_Alta`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `cat_tipo_consumo_ibfk_2` FOREIGN KEY (`Id_Usuario_Modif`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `cat_tipo_consumo_ibfk_3` FOREIGN KEY (`Id_Usuario_Baja`) REFERENCES `usuario` (`Id_Usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cat_tipo_consumo`
--

LOCK TABLES `cat_tipo_consumo` WRITE;
/*!40000 ALTER TABLE `cat_tipo_consumo` DISABLE KEYS */;
INSERT INTO `cat_tipo_consumo` VALUES 
(1,'Desayuno',1,1,'2024-04-28 02:33:38',NULL,NULL,NULL,NULL),
(2,'Comida',1,1,'2024-04-28 02:33:38',NULL,NULL,NULL,NULL),
(3,'Cena',1,1,'2024-04-28 02:33:38',NULL,NULL,NULL,NULL),
(4,'Postre',1,1,'2024-04-28 02:33:38',NULL,NULL,NULL,NULL),(5,'Bebida',1,1,'2024-04-28 02:33:38',NULL,NULL,NULL,NULL),(6,'Snack',1,1,'2024-04-28 02:33:38',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `cat_tipo_consumo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cat_unidad_medida`
--

DROP TABLE IF EXISTS `cat_unidad_medida`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cat_unidad_medida` (
  `Id_Unidad_Medida` int NOT NULL AUTO_INCREMENT,
  `Unidad_Medida` varchar(50) NOT NULL,
  `Abreviatura` varchar(5) NOT NULL,
  `Activo` tinyint(1) NOT NULL DEFAULT (1),
  `Id_Usuario_Alta` int NOT NULL,
  `Fecha_Alta` datetime NOT NULL,
  `Id_Usuario_Modif` int DEFAULT NULL,
  `Fecha_Modif` datetime DEFAULT NULL,
  `Id_Usuario_Baja` int DEFAULT NULL,
  `Fecha_Baja` datetime DEFAULT NULL,
  PRIMARY KEY (`Id_Unidad_Medida`),
  KEY `Id_Usuario_Alta` (`Id_Usuario_Alta`),
  KEY `Id_Usuario_Modif` (`Id_Usuario_Modif`),
  KEY `Id_Usuario_Baja` (`Id_Usuario_Baja`),
  CONSTRAINT `cat_unidad_medida_ibfk_1` FOREIGN KEY (`Id_Usuario_Alta`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `cat_unidad_medida_ibfk_2` FOREIGN KEY (`Id_Usuario_Modif`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `cat_unidad_medida_ibfk_3` FOREIGN KEY (`Id_Usuario_Baja`) REFERENCES `usuario` (`Id_Usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cat_unidad_medida`
--

LOCK TABLES `cat_unidad_medida` WRITE;
/*!40000 ALTER TABLE `cat_unidad_medida` DISABLE KEYS */;
INSERT INTO `cat_unidad_medida` VALUES (1,'litro','L',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL),(2,'mililitro','ml',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL),(3,'taza','tz',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL),(4,'pieza','pz',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL),(5,'cucharada','cda',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL),(6,'cucharadita','cdta',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL),(8,'pizca','pzca',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL),(9,'gramo','g',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL),(10,'lata','lt',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL),(11,'sobre','sob',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL),(12,'kilogramo','kg',1,1,'2024-06-02 18:31:20',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `cat_unidad_medida` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `compras`
--

DROP TABLE IF EXISTS `compras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `compras` (
  `Id_Compras` int NOT NULL AUTO_INCREMENT,
  `Id_Usuario_Compra` int NOT NULL,
  `Id_Unidad_Medida` int NOT NULL,
  `Fecha_Compra` datetime NOT NULL,
  `Cantidad` decimal(10,0) DEFAULT NULL,
  `Activo` tinyint(1) NOT NULL DEFAULT (1),
  `Id_Usuario_Alta` int NOT NULL,
  `Fecha_Alta` datetime NOT NULL,
  `Id_Usuario_Modif` int DEFAULT NULL,
  `Fecha_Modif` datetime DEFAULT NULL,
  `Id_Usuario_Baja` int DEFAULT NULL,
  `Fecha_Baja` datetime DEFAULT NULL,
  PRIMARY KEY (`Id_Compras`),
  KEY `Id_Usuario_Alta` (`Id_Usuario_Alta`),
  KEY `Id_Usuario_Modif` (`Id_Usuario_Modif`),
  KEY `Id_Usuario_Baja` (`Id_Usuario_Baja`),
  KEY `Id_Usuario_Compra` (`Id_Usuario_Compra`),
  KEY `Id_Unidad_Medida` (`Id_Unidad_Medida`),
  CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`Id_Usuario_Alta`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `compras_ibfk_2` FOREIGN KEY (`Id_Usuario_Modif`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `compras_ibfk_3` FOREIGN KEY (`Id_Usuario_Baja`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `compras_ibfk_4` FOREIGN KEY (`Id_Usuario_Compra`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `compras_ibfk_5` FOREIGN KEY (`Id_Unidad_Medida`) REFERENCES `cat_unidad_medida` (`Id_Unidad_Medida`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compras`
--

LOCK TABLES `compras` WRITE;
/*!40000 ALTER TABLE `compras` DISABLE KEYS */;
/*!40000 ALTER TABLE `compras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consumo`
--

DROP TABLE IF EXISTS `consumo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consumo` (
  `Id_Consumo` int NOT NULL AUTO_INCREMENT,
  `Id_Receta` int NOT NULL,
  `Id_Usuario_Receta` int NOT NULL,
  `Fecha_Consumo` datetime NOT NULL,
  `Activo` tinyint(1) NOT NULL DEFAULT (1),
  `Id_Usuario_Alta` int NOT NULL,
  `Fecha_Alta` datetime NOT NULL,
  `Id_Usuario_Modif` int DEFAULT NULL,
  `Fecha_Modif` datetime DEFAULT NULL,
  `Id_Usuario_Baja` int DEFAULT NULL,
  `Fecha_Baja` datetime DEFAULT NULL,
  PRIMARY KEY (`Id_Consumo`),
  KEY `Id_Usuario_Alta` (`Id_Usuario_Alta`),
  KEY `Id_Usuario_Modif` (`Id_Usuario_Modif`),
  KEY `Id_Usuario_Baja` (`Id_Usuario_Baja`),
  KEY `Id_Receta` (`Id_Receta`),
  CONSTRAINT `consumo_ibfk_1` FOREIGN KEY (`Id_Usuario_Alta`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `consumo_ibfk_2` FOREIGN KEY (`Id_Usuario_Modif`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `consumo_ibfk_3` FOREIGN KEY (`Id_Usuario_Baja`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `consumo_ibfk_4` FOREIGN KEY (`Id_Receta`) REFERENCES `receta` (`Id_Receta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consumo`
--

LOCK TABLES `consumo` WRITE;
/*!40000 ALTER TABLE `consumo` DISABLE KEYS */;
/*!40000 ALTER TABLE `consumo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lista_compra`
--

DROP TABLE IF EXISTS `lista_compra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lista_compra` (
  `Id_Lista_Compra` int NOT NULL AUTO_INCREMENT,
  `Id_Receta` int NOT NULL,
  `Id_Unidad_Medida` int NOT NULL,
  `Cantidad` decimal(10,0) DEFAULT NULL,
  `Activo` tinyint(1) NOT NULL DEFAULT (1),
  `Id_Alimento` int NOT NULL,
  `Id_Usuario_Alta` int NOT NULL,
  `Fecha_Alta` datetime NOT NULL,
  `Id_Usuario_Modif` int DEFAULT NULL,
  `Fecha_Modif` datetime DEFAULT NULL,
  `Id_Usuario_Baja` int DEFAULT NULL,
  `Fecha_Baja` datetime DEFAULT NULL,
  PRIMARY KEY (`Id_Lista_Compra`),
  KEY `Id_Receta` (`Id_Receta`),
  KEY `Id_Unidad_Medida` (`Id_Unidad_Medida`),
  KEY `Id_Alimento` (`Id_Alimento`),
  KEY `Id_Usuario_Alta` (`Id_Usuario_Alta`),
  KEY `Id_Usuario_Modif` (`Id_Usuario_Modif`),
  KEY `Id_Usuario_Baja` (`Id_Usuario_Baja`),
  CONSTRAINT `lista_compra_ibfk_2` FOREIGN KEY (`Id_Receta`) REFERENCES `receta` (`Id_Receta`),
  CONSTRAINT `lista_compra_ibfk_3` FOREIGN KEY (`Id_Unidad_Medida`) REFERENCES `cat_unidad_medida` (`Id_Unidad_Medida`),
  CONSTRAINT `lista_compra_ibfk_4` FOREIGN KEY (`Id_Alimento`) REFERENCES `cat_alimento` (`Id_Alimento`),
  CONSTRAINT `lista_compra_ibfk_5` FOREIGN KEY (`Id_Usuario_Alta`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `lista_compra_ibfk_6` FOREIGN KEY (`Id_Usuario_Modif`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `lista_compra_ibfk_7` FOREIGN KEY (`Id_Usuario_Baja`) REFERENCES `usuario` (`Id_Usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lista_compra`
--

LOCK TABLES `lista_compra` WRITE;
/*!40000 ALTER TABLE `lista_compra` DISABLE KEYS */;
INSERT INTO `lista_compra` VALUES 
(10,13,4,12,1,1,4,'2024-06-11 18:45:53',NULL,NULL,NULL,NULL),
(11,2,6,0,1,81,4,'2024-06-11 18:45:53',NULL,NULL,NULL,NULL),(12,1,4,3,1,3,4,'2024-06-11 18:45:53',NULL,NULL,NULL,NULL),(13,11,6,1,1,68,4,'2024-06-11 18:45:53',NULL,NULL,NULL,NULL),(14,1,6,5,1,4,4,'2024-06-11 18:45:53',NULL,NULL,NULL,NULL),(15,2,8,1,1,6,4,'2024-06-11 18:45:53',NULL,NULL,NULL,NULL),(16,2,3,0,1,7,4,'2024-06-11 18:45:53',NULL,NULL,NULL,NULL),(17,2,3,0,1,9,4,'2024-06-11 18:45:53',NULL,NULL,NULL,NULL),(18,2,4,4,1,10,4,'2024-06-11 18:45:53',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `lista_compra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receta`
--

DROP TABLE IF EXISTS `receta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `receta` (
  `Id_Receta` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(250) NOT NULL,
  `Activo` tinyint(1) NOT NULL DEFAULT (1),
  `Id_Usuario_Alta` int NOT NULL,
  `Fecha_Alta` datetime NOT NULL,
  `Id_Usuario_Modif` int DEFAULT NULL,
  `Fecha_Modif` datetime DEFAULT NULL,
  `Id_Usuario_Baja` int DEFAULT NULL,
  `Fecha_Baja` datetime DEFAULT NULL,
  `Id_Tipo_Consumo` int NOT NULL,
  `Tiempo` time NOT NULL,
  `Calorias` double NOT NULL,
  `Porciones` int NOT NULL DEFAULT '1',
  `Imagen_receta` varchar(255) NOT NULL DEFAULT '/imagenes/defIng.png',
  `Es_Default` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`Id_Receta`),
  KEY `Id_Usuario_Alta` (`Id_Usuario_Alta`),
  KEY `Id_Usuario_Modif` (`Id_Usuario_Modif`),
  KEY `Id_Usuario_Baja` (`Id_Usuario_Baja`),
  KEY `Id_Tipo_Consumo` (`Id_Tipo_Consumo`),
  CONSTRAINT `Id_Tipo_Consumo` FOREIGN KEY (`Id_Tipo_Consumo`) REFERENCES `cat_tipo_consumo` (`Id_Tipo_Consumo`),
  CONSTRAINT `receta_ibfk_1` FOREIGN KEY (`Id_Usuario_Alta`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `receta_ibfk_2` FOREIGN KEY (`Id_Usuario_Modif`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `receta_ibfk_3` FOREIGN KEY (`Id_Usuario_Baja`) REFERENCES `usuario` (`Id_Usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receta`
--

LOCK TABLES `receta` WRITE;
/*!40000 ALTER TABLE `receta` DISABLE KEYS */;
INSERT INTO `receta` VALUES (26,'Cazuela de Huevo con Calabacitas y Frijoles',0,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL,1,'00:25:00',250,1,'/imagenes/defRec.png',0),(27,'Pescado empanizado',0,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL,2,'00:30:00',300,1,'/imagenes/defRec.png',0),(28,'Pechuga con espinacas al champiñón',1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL,2,'00:35:00',350,1,'/imagenes/defRec.png',0),(29,'Ensalada de atún',1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL,2,'00:15:00',180,1,'/imagenes/defRec.png',0),(30,'Espagueti con albóndigas',1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL,2,'00:45:00',450,1,'/imagenes/defRec.png',0),(31,'Lasaña',1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL,3,'01:00:00',600,1,'/imagenes/defRec.png',0),(32,'Sopa de fideo con brócoli',1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL,2,'00:30:00',200,1,'/imagenes/defRec.png',0),(33,'Empanadas de alcachofa',1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL,2,'00:50:00',250,1,'/imagenes/defRec.png',0),(34,'Carlota de limón',1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL,4,'00:40:00',350,1,'/imagenes/defRec.png',0),(35,'Gelatina de mazapan',1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL,4,'00:10:00',120,1,'/imagenes/defRec.png',0),(36,'Agua de horchata',1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL,5,'00:05:00',150,1,'/imagenes/defRec.png',0),(37,'Piña colada',1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL,5,'00:05:00',200,1,'/imagenes/defRec.png',0),(38,'Huevos con jamón y Frijoles',1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL,1,'00:20:00',300,1,'/imagenes/defRec.png',0),(39,'Calabacitas con queso panela y Frijoles',1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL,1,'00:25:00',220,1,'/imagenes/defRec.png',0),(40,'Huevos con chorizo y Frijoles',1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL,1,'00:30:00',350,1,'/imagenes/defRec.png',0),(41,'Papas con chorizo y Frijoles',1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL,1,'00:35:00',400,1,'/imagenes/defRec.png',0),(42,'Papas con queso y Frijoles',1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL,1,'00:40:00',450,1,'/imagenes/defRec.png',0),(44,'456',0,2,'2025-03-21 21:27:33',NULL,NULL,NULL,NULL,1,'00:15:00',1500,5,'/imagenes/1742592559555-Deku background.jpg',0);
/*!40000 ALTER TABLE `receta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receta_detalle`
--

DROP TABLE IF EXISTS `receta_detalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `receta_detalle` (
  `Id_Receta_Detalle` int NOT NULL AUTO_INCREMENT,
  `Id_Receta` int NOT NULL,
  `Id_Unidad_Medida` int NOT NULL,
  `Cantidad` decimal(10,4) NOT NULL,
  `Activo` tinyint(1) NOT NULL DEFAULT (1),
  `Id_Usuario_Alta` int NOT NULL,
  `Fecha_Alta` datetime NOT NULL,
  `Id_Usuario_Modif` int DEFAULT NULL,
  `Fecha_Modif` datetime DEFAULT NULL,
  `Id_Usuario_Baja` int DEFAULT NULL,
  `Fecha_Baja` datetime DEFAULT NULL,
  `Id_Alimento` int NOT NULL,
  PRIMARY KEY (`Id_Receta_Detalle`),
  KEY `Id_Usuario_Alta` (`Id_Usuario_Alta`),
  KEY `Id_Usuario_Modif` (`Id_Usuario_Modif`),
  KEY `Id_Usuario_Baja` (`Id_Usuario_Baja`),
  KEY `Id_Receta` (`Id_Receta`),
  KEY `Id_Unidad_Medida` (`Id_Unidad_Medida`),
  KEY `Id_Alimento_2` (`Id_Alimento`),
  CONSTRAINT `Id_Alimento_2` FOREIGN KEY (`Id_Alimento`) REFERENCES `cat_alimento` (`Id_Alimento`),
  CONSTRAINT `receta_detalle_ibfk_1` FOREIGN KEY (`Id_Usuario_Alta`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `receta_detalle_ibfk_2` FOREIGN KEY (`Id_Usuario_Modif`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `receta_detalle_ibfk_3` FOREIGN KEY (`Id_Usuario_Baja`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `receta_detalle_ibfk_4` FOREIGN KEY (`Id_Receta`) REFERENCES `receta` (`Id_Receta`),
  CONSTRAINT `receta_detalle_ibfk_6` FOREIGN KEY (`Id_Unidad_Medida`) REFERENCES `cat_unidad_medida` (`Id_Unidad_Medida`)
) ENGINE=InnoDB AUTO_INCREMENT=611 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receta_detalle`
--

LOCK TABLES `receta_detalle` WRITE;
/*!40000 ALTER TABLE `receta_detalle` DISABLE KEYS */;
INSERT INTO `receta_detalle` VALUES (556,26,4,3.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,1),(557,26,9,200.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,2),(558,26,9,150.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,3),(559,27,9,200.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,4),(560,27,9,50.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,5),(561,28,9,100.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,6),(562,28,9,150.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,7),(563,28,9,200.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,8),(564,29,10,1.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,9),(565,29,9,100.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,10),(566,29,9,50.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,11),(567,29,9,50.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,12),(568,30,9,200.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,13),(569,30,9,150.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,14),(570,30,9,50.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,15),(571,30,9,50.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,16),(572,31,9,200.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,17),(573,31,9,100.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,18),(574,31,9,100.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,19),(575,31,9,50.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,20),(576,32,9,100.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,21),(577,32,9,150.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,22),(578,32,9,50.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,23),(579,33,9,200.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,24),(580,33,9,50.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,25),(581,33,9,50.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,26),(582,33,9,50.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,27),(583,34,9,100.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,28),(584,34,9,200.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,29),(585,34,9,50.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,30),(586,35,9,100.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,31),(587,35,9,50.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,32),(588,35,9,20.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,33),(589,36,9,200.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,34),(590,36,9,50.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,35),(591,36,4,1.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,36),(592,37,9,200.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,37),(593,37,9,100.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,38),(594,37,9,50.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,39),(595,38,4,3.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,1),(596,38,9,100.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,40),(597,38,9,150.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,3),(598,39,9,200.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,2),(599,39,9,100.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,41),(600,39,9,150.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,3),(601,40,4,3.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,1),(602,40,9,100.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,42),(603,40,9,150.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,3),(604,41,9,200.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,43),(605,41,9,100.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,42),(606,41,9,150.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,3),(607,42,9,200.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,43),(608,42,9,100.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,41),(609,42,9,150.0000,1,0,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,3),(610,44,2,6.0000,1,2,'2025-03-21 21:28:48',NULL,NULL,NULL,NULL,2);
/*!40000 ALTER TABLE `receta_detalle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receta_instrucciones`
--

DROP TABLE IF EXISTS `receta_instrucciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `receta_instrucciones` (
  `Id_Receta_Instrucciones` int NOT NULL AUTO_INCREMENT,
  `Id_Receta` int NOT NULL,
  `Instruccion` varchar(3000) NOT NULL,
  `Orden` int NOT NULL,
  `Activo` tinyint(1) NOT NULL DEFAULT (1),
  `Id_Usuario_Alta` int NOT NULL,
  `Fecha_Alta` datetime NOT NULL,
  `Id_Usuario_Modif` int DEFAULT NULL,
  `Fecha_Modif` datetime DEFAULT NULL,
  `Id_Usuario_Baja` int DEFAULT NULL,
  `Fecha_Baja` datetime DEFAULT NULL,
  PRIMARY KEY (`Id_Receta_Instrucciones`),
  KEY `Id_Usuario_Alta` (`Id_Usuario_Alta`),
  KEY `Id_Usuario_Modif` (`Id_Usuario_Modif`),
  KEY `Id_Usuario_Baja` (`Id_Usuario_Baja`),
  KEY `Id_Receta` (`Id_Receta`),
  CONSTRAINT `receta_instrucciones_ibfk_1` FOREIGN KEY (`Id_Usuario_Alta`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `receta_instrucciones_ibfk_2` FOREIGN KEY (`Id_Usuario_Modif`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `receta_instrucciones_ibfk_3` FOREIGN KEY (`Id_Usuario_Baja`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `receta_instrucciones_ibfk_4` FOREIGN KEY (`Id_Receta`) REFERENCES `receta` (`Id_Receta`)
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receta_instrucciones`
--

LOCK TABLES `receta_instrucciones` WRITE;
/*!40000 ALTER TABLE `receta_instrucciones` DISABLE KEYS */;
INSERT INTO `receta_instrucciones` VALUES (71,26,'Lava y corta las calabacitas en rodajas.',1,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(72,26,'Calienta una sartén con un poco de aceite.',2,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(73,26,'Agrega las calabacitas y sofríe hasta que estén suaves.',3,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(74,26,'Añade los frijoles cocidos y mezcla.',4,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(75,26,'Bate los huevos y viértelos en la sartén.',5,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(76,26,'Cocina todo junto hasta que los huevos estén bien cocidos.',6,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(77,27,'Lava y seca los filetes de pescado.',1,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(78,27,'Coloca el pan molido en un plato hondo.',2,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(79,27,'Pasa los filetes de pescado por el pan molido, asegurándote de que queden bien cubiertos.',3,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(80,27,'Calienta suficiente aceite en una sartén.',4,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(81,27,'Fríe los filetes empanizados hasta que estén dorados por ambos lados.',5,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(82,27,'Escurre sobre papel absorbente y sirve.',6,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(83,28,'Lava las espinacas y los champiñones.',1,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(84,28,'Corta los champiñones en láminas finas.',2,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(85,28,'En una sartén, saltea las espinacas y los champiñones con un poco de aceite.',3,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(86,28,'Condimenta la pechuga de pollo con sal y pimienta.',4,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(87,28,'Cocina la pechuga de pollo a la plancha hasta que esté dorada y bien cocida.',5,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(88,28,'Sirve la pechuga con las espinacas y champiñones salteados encima.',6,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(89,29,'Abre la lata de atún y escúrrelo bien.',1,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(90,29,'Corta el tomate y la lechuga en trozos pequeños.',2,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(91,29,'Mezcla todos los ingredientes en un bol.',3,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(92,29,'Añade mayonesa al gusto y mezcla bien.',4,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(93,30,'Cuece el espagueti en agua con sal según las indicaciones del paquete.',1,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(94,30,'Forma albóndigas con la carne molida y empanízalas con pan rallado.',2,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(95,30,'Fría las albóndigas hasta que estén doradas por fuera.',3,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(96,30,'Sirve las albóndigas con el espagueti y espolvorea con queso parmesano.',4,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(97,31,'Cocina la carne molida con un poco de aceite.',1,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(98,31,'Mezcla la carne cocida con la salsa de tomate.',2,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(99,31,'En un recipiente para hornear, intercala capas de carne, queso ricotta y queso mozzarella.',3,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(100,31,'Hornea la lasaña a 180°C durante 40 minutos.',4,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(101,32,'Cocina los fideos en agua con sal.',1,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(102,32,'En otra sartén, saltea el brócoli con zanahoria.',2,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(103,32,'Añade los fideos cocidos al brócoli y mezcla bien.',3,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(104,33,'Cocina la alcachofa y córtala en trozos pequeños.',1,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(105,33,'Mezcla la alcachofa con el queso y jamón.',2,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(106,33,'Forma las empanadas y fríelas en aceite caliente.',3,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(107,34,'Sumerge las galletas marías en jugo de limón.',1,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(108,34,'En un molde, coloca las galletas y una capa de leche condensada.',2,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(109,34,'Repite las capas hasta terminar los ingredientes.',3,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(110,35,'Disuelve la gelatina en agua caliente.',1,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(111,35,'Mezcla la gelatina con leche y mazapán triturado.',2,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(112,35,'Refrigera la mezcla hasta que cuaje.',3,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(113,36,'Lava el arroz y colócalo en agua con canela.',1,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(114,36,'Licúa el arroz con el agua, colando la mezcla.',2,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(115,36,'Añade azúcar al gusto y sirve fría.',3,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(116,37,'Licúa la piña con la leche de coco y ron.',1,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(117,37,'Sirve bien fría en un vaso decorado.',2,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(118,38,'Fría los huevos y el jamón.',1,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(119,38,'Sirve con los frijoles ya cocidos.',2,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(120,39,'Fría las calabacitas con el queso panela.',1,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(121,39,'Sirve con frijoles cocidos.',2,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(122,40,'Fría los huevos con el chorizo.',1,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(123,40,'Sirve con frijoles ya cocidos.',2,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(124,41,'Cocina las papas con el chorizo.',1,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(125,41,'Sirve con los frijoles ya cocidos.',2,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(126,42,'Cocina las papas con el queso.',1,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(127,42,'Sirve con los frijoles ya cocidos.',2,1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL),(128,44,'JAbón con papas',1,1,2,'2025-03-21 21:27:47',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `receta_instrucciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recetas_dia`
--

DROP TABLE IF EXISTS `recetas_dia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recetas_dia` (
  `Id_Recetas_Dia` int NOT NULL AUTO_INCREMENT,
  `Fecha` datetime NOT NULL,
  `Id_Receta_Desayuno` int DEFAULT NULL,
  `Id_Receta_Comida` int DEFAULT NULL,
  `Id_Receta_Cena` int DEFAULT NULL,
  `Activo` tinyint(1) NOT NULL DEFAULT (1),
  `Id_Usuario_Alta` int NOT NULL,
  `Fecha_Alta` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Id_Usuario_Modif` int DEFAULT NULL,
  `Fecha_Modif` datetime DEFAULT NULL,
  `Id_Usuario_Baja` int DEFAULT NULL,
  `Fecha_Baja` datetime DEFAULT NULL,
  `Desayuno_Hecho` tinyint(1) DEFAULT '0',
  `Comida_Hecho` tinyint(1) DEFAULT '0',
  `Cena_Hecho` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`Id_Recetas_Dia`),
  UNIQUE KEY `u_fecha_usuario` (`Fecha`,`Id_Usuario_Alta`),
  KEY `Id_Usuario_Alta` (`Id_Usuario_Alta`),
  KEY `Id_Usuario_Modif` (`Id_Usuario_Modif`),
  KEY `Id_Usuario_Baja` (`Id_Usuario_Baja`),
  KEY `Id_Receta_Desayuno` (`Id_Receta_Desayuno`),
  KEY `Id_Receta_Comida` (`Id_Receta_Comida`),
  KEY `Id_Receta_Cena` (`Id_Receta_Cena`),
  CONSTRAINT `recetas_dia_ibfk_1` FOREIGN KEY (`Id_Usuario_Alta`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `recetas_dia_ibfk_2` FOREIGN KEY (`Id_Usuario_Modif`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `recetas_dia_ibfk_3` FOREIGN KEY (`Id_Usuario_Baja`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `recetas_dia_ibfk_4` FOREIGN KEY (`Id_Receta_Desayuno`) REFERENCES `receta` (`Id_Receta`),
  CONSTRAINT `recetas_dia_ibfk_5` FOREIGN KEY (`Id_Receta_Comida`) REFERENCES `receta` (`Id_Receta`),
  CONSTRAINT `recetas_dia_ibfk_6` FOREIGN KEY (`Id_Receta_Cena`) REFERENCES `receta` (`Id_Receta`)
) ENGINE=InnoDB AUTO_INCREMENT=3332 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recetas_dia`
--

LOCK TABLES `recetas_dia` WRITE;
/*!40000 ALTER TABLE `recetas_dia` DISABLE KEYS */;
INSERT INTO `recetas_dia` VALUES (1,'2024-06-01 19:26:57',5,2,4,1,2,'2024-05-31 20:53:41',4,'2024-06-01 19:47:12',NULL,NULL,0,0,0),(1098,'2025-04-10 12:55:53',27,NULL,NULL,1,2,'2024-06-02 02:15:01',2,'2025-04-10 19:41:10',4,'2024-06-02 12:57:52',0,0,0),(1223,'2024-06-03 16:06:50',1,NULL,NULL,1,2,'2024-06-03 16:07:08',4,'2024-06-03 16:34:02',NULL,NULL,0,0,0),(1224,'2024-06-05 16:59:52',NULL,NULL,NULL,1,2,'2024-06-05 16:59:52',NULL,NULL,NULL,NULL,0,0,0),(1225,'2024-06-05 17:09:11',NULL,NULL,NULL,1,2,'2024-06-05 17:12:59',NULL,NULL,NULL,NULL,0,0,0),(1226,'2024-06-05 17:27:38',NULL,3,NULL,1,2,'2024-06-05 17:27:38',10,'2024-06-05 17:27:38',NULL,NULL,0,0,0),(1227,'2024-06-06 20:34:14',NULL,NULL,NULL,1,2,'2024-06-06 20:33:32',11,'2024-06-06 20:34:14',11,'2024-06-06 20:34:20',0,0,0),(1228,'2024-06-07 17:26:49',NULL,3,NULL,1,2,'2024-06-07 17:26:40',4,'2024-06-07 17:26:49',NULL,NULL,0,0,0),(2307,'2024-06-09 00:00:00',1,2,6,1,2,'2024-06-11 18:45:51',4,'2024-06-11 18:45:51',NULL,NULL,0,0,0),(2308,'2024-06-10 00:00:00',13,3,6,1,2,'2024-06-11 18:45:51',4,'2024-06-11 18:45:52',NULL,NULL,0,0,0),(2309,'2024-06-11 00:00:00',14,4,6,1,2,'2024-06-11 18:45:52',4,'2024-06-11 18:45:52',NULL,NULL,0,0,0),(2310,'2024-06-12 00:00:00',15,5,6,1,2,'2024-06-11 18:45:52',4,'2024-06-11 18:45:52',NULL,NULL,0,0,0),(2311,'2024-06-13 00:00:00',16,7,6,1,2,'2024-06-11 18:45:52',4,'2024-06-11 18:45:52',NULL,NULL,0,0,0),(2312,'2024-06-14 00:00:00',1,8,6,1,2,'2024-06-11 18:45:52',4,'2024-06-11 18:45:52',NULL,NULL,0,0,0),(2313,'2024-06-15 00:00:00',13,2,6,1,2,'2024-06-11 18:45:52',4,'2024-06-11 18:45:53',NULL,NULL,0,0,0),(2687,'2025-04-12 06:00:00',NULL,NULL,NULL,1,2,'2025-04-19 14:54:02',2,'2025-04-19 15:11:46',NULL,NULL,0,0,0),(2690,'2025-04-14 06:00:00',40,NULL,NULL,1,2,'2025-04-19 17:30:47',2,'2025-04-19 17:36:27',NULL,NULL,0,0,0),(2692,'2025-04-19 06:00:00',32,NULL,NULL,1,2,'2025-04-19 18:35:39',2,'2025-04-19 18:36:55',NULL,NULL,0,0,0),(2693,'2025-04-21 06:00:00',29,NULL,NULL,1,2,'2025-04-21 12:25:27',2,'2025-04-21 12:25:28',NULL,NULL,0,0,0),(2765,'2025-03-31 00:00:00',NULL,NULL,NULL,1,2,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,0,0,0),(2766,'2025-03-01 00:00:00',NULL,NULL,NULL,1,2,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,0,0,0),(2767,'2025-02-02 00:00:00',NULL,NULL,NULL,1,2,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,0,0,0),(2768,'2025-02-03 00:00:00',NULL,NULL,NULL,1,2,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,0,0,0),(2769,'2025-02-04 00:00:00',NULL,NULL,NULL,1,2,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,0,0,0),(2770,'2025-02-05 00:00:00',NULL,NULL,NULL,1,2,'0000-00-00 00:00:00',NULL,NULL,NULL,NULL,0,0,0),(2799,'2025-04-28 00:00:00',33,34,31,1,2,'2025-05-03 10:49:09',2,'2025-05-03 22:50:53',NULL,NULL,0,0,0),(2800,'2025-04-29 00:00:00',NULL,NULL,NULL,1,2,'2025-05-03 10:49:09',NULL,NULL,NULL,NULL,0,0,0),(2801,'2025-04-30 00:00:00',NULL,NULL,NULL,1,2,'2025-05-03 10:49:09',NULL,NULL,NULL,NULL,0,0,0),(2802,'2025-05-01 00:00:00',NULL,NULL,NULL,1,2,'2025-05-03 10:49:09',NULL,NULL,NULL,NULL,0,0,0),(2803,'2025-05-02 00:00:00',NULL,NULL,NULL,1,2,'2025-05-03 10:49:09',NULL,NULL,NULL,NULL,0,0,0),(2804,'2025-05-03 00:00:00',NULL,NULL,NULL,1,2,'2025-05-03 10:49:09',NULL,NULL,NULL,NULL,0,0,0),(2889,'2025-05-11 00:00:00',NULL,NULL,NULL,1,2,'2025-05-04 16:00:29',NULL,NULL,NULL,NULL,0,0,0),(2890,'2025-05-05 00:00:00',34,33,31,1,2,'2025-05-04 16:03:07',2,'2025-05-05 12:48:21',NULL,NULL,0,0,0),(2891,'2025-05-06 00:00:00',NULL,32,NULL,1,2,'2025-05-04 16:03:07',2,'2025-05-05 12:48:21',NULL,NULL,0,0,0),(2892,'2025-05-07 00:00:00',NULL,29,NULL,1,2,'2025-05-04 16:03:07',2,'2025-05-05 12:48:21',NULL,NULL,0,0,0),(2893,'2025-05-08 00:00:00',NULL,30,NULL,1,2,'2025-05-04 16:03:07',2,'2025-05-05 12:48:21',NULL,NULL,0,0,0),(2894,'2025-05-09 00:00:00',NULL,28,NULL,1,2,'2025-05-04 16:03:07',2,'2025-05-05 12:48:21',NULL,NULL,0,0,0),(2895,'2025-05-10 00:00:00',NULL,NULL,NULL,1,2,'2025-05-04 16:03:07',NULL,NULL,NULL,NULL,0,0,0),(3205,'2025-05-04 00:00:00',33,34,31,1,2,'2025-05-04 19:01:34',2,'2025-05-04 19:01:48',NULL,NULL,0,0,0);
/*!40000 ALTER TABLE `recetas_dia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `Id_Rol` int NOT NULL AUTO_INCREMENT,
  `Rol` varchar(250) NOT NULL,
  PRIMARY KEY (`Id_Rol`),
  UNIQUE KEY `Rol` (`Rol`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (2,'Administrador'),(1,'Cliente'),(3,'Premium');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock`
--

DROP TABLE IF EXISTS `stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock` (
  `Id_Stock` int NOT NULL AUTO_INCREMENT,
  `Activo` tinyint(1) NOT NULL DEFAULT (1),
  `Id_Usuario_Alta` int NOT NULL,
  `Fecha_Alta` datetime NOT NULL,
  `Id_Usuario_Modif` int DEFAULT NULL,
  `Fecha_Modif` datetime DEFAULT NULL,
  `Id_Usuario_Baja` int DEFAULT NULL,
  `Fecha_Baja` datetime DEFAULT NULL,
  PRIMARY KEY (`Id_Stock`),
  KEY `Id_Usuario_Alta` (`Id_Usuario_Alta`),
  KEY `Id_Usuario_Modif` (`Id_Usuario_Modif`),
  KEY `Id_Usuario_Baja` (`Id_Usuario_Baja`),
  CONSTRAINT `stock_ibfk_1` FOREIGN KEY (`Id_Usuario_Alta`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `stock_ibfk_2` FOREIGN KEY (`Id_Usuario_Modif`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `stock_ibfk_3` FOREIGN KEY (`Id_Usuario_Baja`) REFERENCES `usuario` (`Id_Usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock`
--

LOCK TABLES `stock` WRITE;
/*!40000 ALTER TABLE `stock` DISABLE KEYS */;
INSERT INTO `stock` VALUES (1,1,1,'2024-04-30 08:41:28',NULL,NULL,NULL,NULL),(2,1,1,'2024-04-30 08:41:33',NULL,NULL,NULL,NULL),(3,1,1,'2024-04-30 08:41:42',NULL,NULL,NULL,NULL),(4,1,2,'2025-04-21 12:50:00',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_detalle`
--

DROP TABLE IF EXISTS `stock_detalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_detalle` (
  `Id_Stock_Detalle` int NOT NULL AUTO_INCREMENT,
  `Id_Unidad_Medida` int NOT NULL,
  `Cantidad` decimal(10,0) DEFAULT NULL,
  `Activo` tinyint(1) NOT NULL DEFAULT (1),
  `Id_Usuario_Alta` int NOT NULL,
  `Fecha_Alta` datetime NOT NULL,
  `Id_Usuario_Modif` int DEFAULT NULL,
  `Fecha_Modif` datetime DEFAULT NULL,
  `Id_Usuario_Baja` int DEFAULT NULL,
  `Fecha_Baja` datetime DEFAULT NULL,
  `Total` decimal(10,0) NOT NULL DEFAULT (0),
  `Cantidad_Consumida` decimal(10,0) NOT NULL DEFAULT (0),
  `Fecha_Caducidad` datetime DEFAULT NULL,
  `Es_Perecedero` tinyint(1) NOT NULL DEFAULT (true),
  `Id_Alimento` int NOT NULL,
  `Id_Stock` int DEFAULT NULL,
  `Imagen_alimento` varchar(255) NOT NULL DEFAULT '/imagenes/defIng.png',
  PRIMARY KEY (`Id_Stock_Detalle`),
  KEY `Id_Usuario_Alta` (`Id_Usuario_Alta`),
  KEY `Id_Usuario_Modif` (`Id_Usuario_Modif`),
  KEY `Id_Usuario_Baja` (`Id_Usuario_Baja`),
  KEY `Id_Unidad_Medida` (`Id_Unidad_Medida`),
  KEY `Id_Alimento` (`Id_Alimento`),
  CONSTRAINT `Id_Alimento` FOREIGN KEY (`Id_Alimento`) REFERENCES `cat_alimento` (`Id_Alimento`),
  CONSTRAINT `stock_detalle_ibfk_1` FOREIGN KEY (`Id_Usuario_Alta`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `stock_detalle_ibfk_2` FOREIGN KEY (`Id_Usuario_Modif`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `stock_detalle_ibfk_3` FOREIGN KEY (`Id_Usuario_Baja`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `stock_detalle_ibfk_5` FOREIGN KEY (`Id_Unidad_Medida`) REFERENCES `cat_unidad_medida` (`Id_Unidad_Medida`)
) ENGINE=InnoDB AUTO_INCREMENT=175 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_detalle`
--

LOCK TABLES `stock_detalle` WRITE;
/*!40000 ALTER TABLE `stock_detalle` DISABLE KEYS */;
INSERT INTO `stock_detalle` VALUES (1,1,0,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,100,0,'2025-01-01 00:00:00',1,1,1,'/imagenes/defIng.png'),(2,9,30,0,2,'2025-03-21 01:17:09',2,'2025-03-27 01:47:44',NULL,NULL,150,0,'2025-06-19 00:00:00',1,2,1,'/imagenes/defIng.png'),(3,1,0,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,80,0,'2025-02-15 00:00:00',1,3,1,'/imagenes/defIng.png'),(4,1,50,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,50,0,NULL,0,4,1,'/imagenes/defIng.png'),(5,1,200,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,200,0,NULL,0,5,1,'/imagenes/defIng.png'),(6,1,75,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,75,0,NULL,0,6,1,'/imagenes/defIng.png'),(7,1,120,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,120,0,NULL,0,7,1,'/imagenes/defIng.png'),(8,1,90,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,90,0,'2025-04-10 00:00:00',1,8,1,'/imagenes/defIng.png'),(9,1,60,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,60,0,NULL,0,9,1,'/imagenes/defIng.png'),(10,1,130,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,130,0,'2025-03-20 00:00:00',1,10,1,'/imagenes/defIng.png'),(11,1,0,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,90,0,'2025-02-05 00:00:00',1,11,1,'/imagenes/defIng.png'),(12,1,0,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,70,0,'2025-01-15 00:00:00',1,12,1,'/imagenes/defIng.png'),(13,1,110,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,110,0,'2025-03-10 00:00:00',1,13,1,'/imagenes/defIng.png'),(14,1,85,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,85,0,'2025-04-01 00:00:00',1,14,1,'/imagenes/defIng.png'),(15,12,30,0,2,'2025-03-21 01:17:09',2,'2025-03-27 01:46:48',NULL,NULL,95,0,'2025-04-03 00:00:00',1,15,1,'/imagenes/defIng.png'),(16,1,150,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,150,0,NULL,0,16,1,'/imagenes/defIng.png'),(17,1,120,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,120,0,'2025-03-05 00:00:00',1,17,1,'/imagenes/defIng.png'),(18,9,50,0,2,'2025-03-21 01:17:09',2,'2025-03-27 01:46:11',NULL,NULL,110,0,'2025-04-02 00:00:00',1,18,1,'/imagenes/defIng.png'),(19,1,0,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,100,0,'2025-01-30 00:00:00',1,19,1,'/imagenes/defIng.png'),(20,1,80,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,80,0,'2025-04-15 00:00:00',1,20,1,'/imagenes/defIng.png'),(21,1,60,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,60,0,'2025-05-30 00:00:00',1,21,1,'/imagenes/defIng.png'),(22,1,40,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,40,0,'2025-05-25 00:00:00',1,22,1,'/imagenes/defIng.png'),(23,1,35,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,35,0,NULL,0,24,1,'/imagenes/defIng.png'),(24,1,50,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,50,0,'2025-06-10 00:00:00',1,25,1,'/imagenes/defIng.png'),(25,1,45,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,45,0,'2025-06-12 00:00:00',1,26,1,'/imagenes/defIng.png'),(26,1,70,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,70,0,'2025-05-29 00:00:00',1,27,1,'/imagenes/defIng.png'),(27,1,55,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,55,0,'2025-05-28 00:00:00',1,28,1,'/imagenes/defIng.png'),(28,1,65,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,65,0,'2025-05-24 00:00:00',1,29,1,'/imagenes/defIng.png'),(29,1,30,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,30,0,'2025-05-26 00:00:00',1,31,1,'/imagenes/defIng.png'),(30,1,80,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,80,0,'2025-06-01 00:00:00',1,32,1,'/imagenes/defIng.png'),(31,1,100,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,100,0,NULL,0,33,1,'/imagenes/defIng.png'),(32,1,45,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,45,0,NULL,0,34,1,'/imagenes/defIng.png'),(33,1,50,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,50,0,'2025-06-15 00:00:00',1,35,1,'/imagenes/defIng.png'),(34,1,35,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,35,0,'2025-05-27 00:00:00',1,36,1,'/imagenes/defIng.png'),(35,1,60,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,60,0,'2025-06-05 00:00:00',1,37,1,'/imagenes/defIng.png'),(36,1,70,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,70,0,'2025-06-20 00:00:00',1,38,1,'/imagenes/defIng.png'),(37,1,40,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,40,0,NULL,0,39,1,'/imagenes/defIng.png'),(38,1,85,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,85,0,'2025-06-10 00:00:00',1,40,1,'/imagenes/defIng.png'),(39,1,75,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,75,0,'2025-06-12 00:00:00',1,41,1,'/imagenes/defIng.png'),(40,1,90,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,90,0,'2025-05-25 00:00:00',1,42,1,'/imagenes/defIng.png'),(41,1,95,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,95,0,'2025-06-01 00:00:00',1,43,1,'/imagenes/defIng.png'),(42,1,110,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,110,0,'2025-06-05 00:00:00',1,44,1,'/imagenes/defIng.png'),(43,1,120,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,120,0,'2025-06-15 00:00:00',1,45,1,'/imagenes/defIng.png'),(44,1,80,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,80,0,'2025-05-29 00:00:00',1,46,1,'/imagenes/defIng.png'),(45,1,60,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,60,0,'2025-06-20 00:00:00',1,47,1,'/imagenes/defIng.png'),(46,1,100,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,100,0,'2025-06-25 00:00:00',1,48,1,'/imagenes/defIng.png'),(47,1,85,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,85,0,'2025-06-30 00:00:00',1,49,1,'/imagenes/defIng.png'),(48,1,95,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,95,0,'2025-06-18 00:00:00',1,50,1,'/imagenes/defIng.png'),(49,1,70,0,2,'2025-03-21 01:17:09',NULL,NULL,NULL,NULL,70,0,'2025-06-28 00:00:00',1,98,1,'/imagenes/defIng.png'),(157,12,10,1,2,'2025-04-21 12:53:07',NULL,NULL,NULL,NULL,10,0,'2025-05-30 12:54:24',1,6,4,'/imagenes/defIng.png'),(158,12,10,1,2,'2025-04-21 12:53:07',NULL,NULL,NULL,NULL,10,0,'2025-05-30 12:54:24',1,7,4,'/imagenes/defIng.png'),(159,12,10,1,2,'2025-04-21 12:53:07',NULL,NULL,NULL,NULL,10,0,'2025-05-30 12:54:24',1,8,4,'/imagenes/defIng.png'),(160,12,10,1,2,'2025-04-21 12:53:07',NULL,NULL,NULL,NULL,10,0,'2025-05-27 12:54:24',1,9,4,'/imagenes/defIng.png'),(161,12,10,1,2,'2025-04-21 12:53:07',NULL,NULL,NULL,NULL,10,0,'2025-05-27 12:54:24',1,10,4,'/imagenes/defIng.png'),(162,12,10,1,2,'2025-04-21 12:53:07',NULL,NULL,NULL,NULL,10,0,'2025-05-27 12:54:24',1,11,4,'/imagenes/defIng.png'),(163,12,10,1,2,'2025-04-21 12:53:07',NULL,NULL,NULL,NULL,10,0,'2025-05-23 12:54:24',1,12,4,'/imagenes/defIng.png'),(164,12,10,1,2,'2025-04-21 12:53:07',NULL,NULL,NULL,NULL,10,0,'2025-05-23 12:54:24',1,13,4,'/imagenes/defIng.png'),(165,12,10,1,2,'2025-04-21 12:53:07',NULL,NULL,NULL,NULL,10,0,'2025-05-23 12:54:24',1,14,4,'/imagenes/defIng.png'),(166,12,10,1,2,'2025-04-21 12:53:07',NULL,NULL,NULL,NULL,10,0,'2025-05-23 12:54:24',1,15,4,'/imagenes/defIng.png'),(167,12,10,1,2,'2025-04-21 12:53:07',NULL,NULL,NULL,NULL,10,0,'2025-05-23 12:54:24',1,16,4,'/imagenes/defIng.png'),(168,12,10,1,2,'2025-04-21 12:53:07',NULL,NULL,NULL,NULL,10,0,'2025-05-23 12:54:24',1,17,4,'/imagenes/defIng.png'),(169,12,10,1,2,'2025-04-21 12:53:07',NULL,NULL,NULL,NULL,10,0,'2025-05-23 12:54:24',1,18,4,'/imagenes/defIng.png'),(170,12,10,1,2,'2025-04-21 12:53:07',NULL,NULL,NULL,NULL,10,0,'2025-05-23 12:54:24',1,19,4,'/imagenes/defIng.png'),(171,12,10,1,2,'2025-04-21 12:53:07',NULL,NULL,NULL,NULL,10,0,'2025-05-20 12:54:24',1,20,4,'/imagenes/defIng.png'),(172,12,10,1,2,'2025-04-21 12:54:24',NULL,NULL,NULL,NULL,10,0,'2025-05-20 12:54:24',1,21,4,'/imagenes/defIng.png'),(173,12,10,1,2,'2025-04-21 12:54:24',NULL,NULL,NULL,NULL,10,0,'2025-05-10 12:54:24',1,24,4,'/imagenes/defIng.png'),(174,12,10,1,2,'2025-04-21 12:54:24',NULL,NULL,NULL,NULL,10,0,'2025-05-10 12:54:24',1,28,4,'/imagenes/defIng.png');
/*!40000 ALTER TABLE `stock_detalle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `Id_Usuario` int NOT NULL AUTO_INCREMENT,
  `Nombre_Usuario` varchar(250) NOT NULL,
  `Contrasena` varchar(250) NOT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `Cohabitantes` int NOT NULL DEFAULT (1),
  `Email` varchar(250) DEFAULT NULL,
  `Es_Gmail` tinyint(1) NOT NULL DEFAULT '0',
  `Id_Rol` int NOT NULL,
  PRIMARY KEY (`Id_Usuario`),
  UNIQUE KEY `Email` (`Email`),
  KEY `Id_Rol` (`Id_Rol`),
  CONSTRAINT `Id_Rol` FOREIGN KEY (`Id_Rol`) REFERENCES `roles` (`Id_Rol`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Habibi','Habibi1',NULL,1,'habi@gmail.com',0,1),(2,'Molina Castellanos Nisa Izel','$2b$10$BhrQFXPhc3LT.I6XHczgNu38vg/MIZt1J/Y85tzPyvUiQut5Y9ZlC','imagenes/1742592415494-Dokja con cuernitos.jpg',1,'molina.castellanos.nisa.izel2022@gmail.com',1,1);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_cat_alimento`
--

DROP TABLE IF EXISTS `usuario_cat_alimento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_cat_alimento` (
  `Id_Usuario_Cat_Alimento` int NOT NULL AUTO_INCREMENT,
  `Id_Usuario` int NOT NULL,
  `Id_Alimento` int NOT NULL,
  `Puede_Comer` tinyint(1) NOT NULL,
  PRIMARY KEY (`Id_Usuario_Cat_Alimento`),
  UNIQUE KEY `Id_Usuario` (`Id_Usuario`,`Id_Alimento`),
  KEY `Id_Alimento` (`Id_Alimento`),
  CONSTRAINT `usuario_cat_alimento_ibfk_1` FOREIGN KEY (`Id_Usuario`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `usuario_cat_alimento_ibfk_2` FOREIGN KEY (`Id_Alimento`) REFERENCES `cat_alimento` (`Id_Alimento`)
) ENGINE=InnoDB AUTO_INCREMENT=1992 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_cat_alimento`
--

LOCK TABLES `usuario_cat_alimento` WRITE;
/*!40000 ALTER TABLE `usuario_cat_alimento` DISABLE KEYS */;
INSERT INTO `usuario_cat_alimento` VALUES 
(94,1,1,1),(96,1,2,1),(98,1,3,1),(100,1,4,1),(102,1,5,1),(104,1,6,1),
(106,1,7,1),(108,1,8,1),(110,1,9,1),(112,1,10,1),(114,1,11,1),(116,1,12,1),
(118,1,13,1),(120,1,14,1),(122,1,15,1),(124,1,16,1),(126,1,17,1),(128,1,18,1),
(130,1,19,1),(132,1,20,1),(134,1,21,1),(136,1,22,1),(138,1,24,1),(140,1,25,1),
(142,1,26,1),(144,1,27,1),(146,1,28,1),(148,1,29,1),(150,1,31,1),(152,1,32,1),
(154,1,33,1),(156,1,34,1),(158,1,35,1),(160,1,36,1),(162,1,37,1),(164,1,38,1),
(166,1,39,1),(168,1,40,1),(170,1,41,1),(172,1,42,1),(174,1,43,1),(176,1,44,1),
(178,1,45,1),(180,1,47,1),(182,1,48,1),(184,1,49,1),(186,1,50,1),(188,1,51,1),
(190,1,52,1),(192,1,53,1),(194,1,54,1),(196,1,55,1),(198,1,56,1),(200,1,57,1),
(202,1,58,1),(204,1,59,1),(206,1,60,1),(208,1,61,1),(210,1,62,1),(212,1,63,1),
(214,1,64,1),(216,1,65,1),(218,1,66,1),(220,1,67,1),(222,1,68,1),(224,1,69,1),
(226,1,70,1),(228,1,71,1),(230,1,72,1),(232,1,73,1),(234,1,74,1),(236,1,75,1),
(238,1,76,1),(240,1,78,1),(242,1,80,1),(244,1,81,1),(246,1,82,1),(248,1,83,1),
(250,1,84,1),(252,1,85,1),(254,1,86,1),(256,1,87,1),(258,1,88,1),(260,1,89,1),
(262,1,90,1),(264,1,91,1),(266,1,92,1),(268,1,93,1),(270,1,94,1),(272,1,95,1),
(274,1,96,1),(276,1,97,1),(278,1,98,1);
/*!40000 ALTER TABLE `usuario_cat_alimento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_receta`
--

DROP TABLE IF EXISTS `usuario_receta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_receta` (
  `Id_Usuario_Receta` int NOT NULL AUTO_INCREMENT,
  `Id_Usuario` int NOT NULL,
  `Id_Receta` int NOT NULL,
  `Activo` tinyint(1) NOT NULL,
  PRIMARY KEY (`Id_Usuario_Receta`),
  UNIQUE KEY `Id_Usuario` (`Id_Usuario`,`Id_Receta`),
  KEY `Id_Receta` (`Id_Receta`),
  CONSTRAINT `usuario_receta_1` FOREIGN KEY (`Id_Usuario`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `usuario_receta_2` FOREIGN KEY (`Id_Receta`) REFERENCES `receta` (`Id_Receta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_receta`
--

LOCK TABLES `usuario_receta` WRITE;
/*!40000 ALTER TABLE `usuario_receta` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuario_receta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `vw_cat_alimento`
--

DROP TABLE IF EXISTS `vw_cat_alimento`;
/*!50001 DROP VIEW IF EXISTS `vw_cat_alimento`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_cat_alimento` AS SELECT 
 1 AS `Id_Alimento`,
 1 AS `Id_Tipo_Alimento`,
 1 AS `Alimento`,
 1 AS `Activo`,
 1 AS `Es_Perecedero`,
 1 AS `Tipo_Alimento`,
 1 AS `Id_Usuario`,
 1 AS `Puede_Comer`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_lista_compra`
--

DROP TABLE IF EXISTS `vw_lista_compra`;
/*!50001 DROP VIEW IF EXISTS `vw_lista_compra`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_lista_compra` AS SELECT 
 1 AS `Id_Receta`,
 1 AS `Nombre`,
 1 AS `Id_Lista_Compra`,
 1 AS `Id_Unidad_Medida`,
 1 AS `Unidad_Medida`,
 1 AS `Abreviatura`,
 1 AS `Cantidad`,
 1 AS `Id_Alimento`,
 1 AS `Alimento`,
 1 AS `Tipo_Alimento`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_receta`
--

DROP TABLE IF EXISTS `vw_receta`;
/*!50001 DROP VIEW IF EXISTS `vw_receta`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_receta` AS SELECT 
 1 AS `Id_Receta`,
 1 AS `Nombre`,
 1 AS `Activo`,
 1 AS `Id_Tipo_Consumo`,
 1 AS `Tipo_Consumo`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_receta_detalle`
--

DROP TABLE IF EXISTS `vw_receta_detalle`;
/*!50001 DROP VIEW IF EXISTS `vw_receta_detalle`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_receta_detalle` AS SELECT 
 1 AS `Id_Receta`,
 1 AS `Nombre`,
 1 AS `Id_Receta_Detalle`,
 1 AS `Id_Unidad_Medida`,
 1 AS `Unidad_Medida`,
 1 AS `Cantidad`,
 1 AS `Id_Alimento`,
 1 AS `Alimento`,
 1 AS `Tipo_Alimento`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_receta_detalle_disponible`
--

DROP TABLE IF EXISTS `vw_receta_detalle_disponible`;
/*!50001 DROP VIEW IF EXISTS `vw_receta_detalle_disponible`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_receta_detalle_disponible` AS SELECT 
 1 AS `Id_Receta`,
 1 AS `Id_Tipo_Consumo`,
 1 AS `Id_Unidad_Medida`,
 1 AS `Id_Alimento`,
 1 AS `Alimento`,
 1 AS `Unidad_Medida`,
 1 AS `Cantidad_Receta`,
 1 AS `Id_Usuario`,
 1 AS `Puede_Comer`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_stock_detalle`
--

DROP TABLE IF EXISTS `vw_stock_detalle`;
/*!50001 DROP VIEW IF EXISTS `vw_stock_detalle`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_stock_detalle` AS SELECT 
 1 AS `Id_Stock_Detalle`,
 1 AS `Id_Usuario`,
 1 AS `Id_Alimento`,
 1 AS `Id_Unidad_Medida`,
 1 AS `Cantidad`,
 1 AS `Activo`,
 1 AS `Total`,
 1 AS `Cantidad_Consumida`,
 1 AS `Fecha_Caducidad`,
 1 AS `Es_Perecedero`,
 1 AS `Alimento`,
 1 AS `Tipo_Alimento`,
 1 AS `Unidad_Medida`,
 1 AS `Abreviatura`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_stock_total`
--

DROP TABLE IF EXISTS `vw_stock_total`;
/*!50001 DROP VIEW IF EXISTS `vw_stock_total`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_stock_total` AS SELECT 
 1 AS `Id_Alimento`,
 1 AS `Total`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping events for database 'migibi'
--

--
-- Dumping routines for database 'migibi'
--
/*!50003 DROP PROCEDURE IF EXISTS `Generar_Lista_Compra` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Generar_Lista_Compra`(
    IN p_Id_Usuario INT
)
BEGIN
    -- Tabla temporal con stock agrupado por usuario y alimento
    CREATE TEMPORARY TABLE Temp_Stock_Usuarios AS
    SELECT Id_Usuario, Id_Alimento, SUM(Total) AS Cantidad_Stock
    FROM vw_stock_detalle
    WHERE Fecha_Caducidad > NOW()
    GROUP BY Id_Usuario, Id_Alimento;

    -- Tabla con ingredientes requeridos por usuario para sus recetas
    CREATE TEMPORARY TABLE Temp_Ingredientes_Requeridos AS
    SELECT 
        r.Id_Usuario,
        rd.Id_Alimento,
        SUM(rd.Cantidad_Receta) AS Cantidad_Necesaria
    FROM Temp_Recetas_Plan r
    INNER JOIN vw_receta_detalle_disponible rd 
        ON r.Id_Receta = rd.Id_Receta AND r.Id_Usuario = rd.Id_Usuario
    WHERE rd.Puede_Comer = 1
    GROUP BY r.Id_Usuario, rd.Id_Alimento;

    -- Resultado final: ingredientes que necesita comprar cada usuario
    SELECT 
        irr.Id_Usuario,
        irr.Id_Alimento,
        irr.Cantidad_Necesaria,
        IFNULL(su.Cantidad_Stock, 0) AS Cantidad_En_Stock,
        (irr.Cantidad_Necesaria - IFNULL(su.Cantidad_Stock, 0)) AS Cantidad_A_Comprar
    FROM Temp_Ingredientes_Requeridos irr
    LEFT JOIN Temp_Stock_Usuarios su 
        ON irr.Id_Usuario = su.Id_Usuario AND irr.Id_Alimento = su.Id_Alimento
    WHERE IFNULL(su.Cantidad_Stock, 0) < irr.Cantidad_Necesaria;

    -- Limpiar temporales
    DROP TEMPORARY TABLE IF EXISTS Temp_Stock_Usuarios;
    DROP TEMPORARY TABLE IF EXISTS Temp_Ingredientes_Requeridos;
    DROP TEMPORARY TABLE IF EXISTS Temp_Recetas_Plan;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Generar_Plan_Disponible` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Generar_Plan_Disponible`(
    IN p_Id_Usuario INT
)
BEGIN
    DECLARE v_dia INT DEFAULT 1;
    DECLARE v_momento VARCHAR(10);
    DECLARE v_receta INT;
    DECLARE done INT DEFAULT 0;

    -- Cursores
    DECLARE cur_disponibles CURSOR FOR
        SELECT r.Id_Receta, r.Id_Tipo_Consumo
        FROM (
            SELECT DISTINCT rd.Id_Receta, rd.Id_Tipo_Consumo, MIN(s.Fecha_Caducidad) AS Fecha_Cad
            FROM vw_Receta_Detalle_Disponible rd
            JOIN vw_stock_detalle s ON rd.Id_Alimento = s.Id_Alimento
            WHERE rd.Id_Usuario = p_Id_Usuario
              AND rd.Puede_Comer = 1
              AND s.Id_Usuario = p_Id_Usuario
              AND s.Fecha_Caducidad < ADDDATE(DATE(NOW()), 300)
            GROUP BY rd.Id_Receta, rd.Id_Tipo_Consumo
        ) r
        ORDER BY r.Fecha_Cad;

    DECLARE cur_restantes CURSOR FOR
        SELECT DISTINCT rd.Id_Receta, rd.Id_Tipo_Consumo
        FROM vw_Receta_Detalle_Disponible rd
        WHERE rd.Id_Usuario = p_Id_Usuario
          AND rd.Puede_Comer = 1
          AND rd.Id_Receta NOT IN (
              SELECT Id_Receta
              FROM (
                  SELECT DISTINCT rd.Id_Receta
                  FROM vw_Receta_Detalle_Disponible rd
                  JOIN vw_stock_detalle s ON rd.Id_Alimento = s.Id_Alimento
                  WHERE rd.Id_Usuario = p_Id_Usuario
                    AND rd.Puede_Comer = 1
                    AND s.Id_Usuario = p_Id_Usuario
                    AND s.Fecha_Caducidad < ADDDATE(DATE(NOW()), 300)
              ) x
          );

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    -- Tabla temporal para el plan
    CREATE TEMPORARY TABLE IF NOT EXISTS Plan_Semanal (
        Dia INT,
        Momento VARCHAR(10),
        Id_Receta INT
    );

    -- Variables internas
    CREATE TEMPORARY TABLE Temp_Disponibles (
        Id_Receta INT,
        Id_Tipo_Consumo INT
    );

    CREATE TEMPORARY TABLE Temp_Restantes (
        Id_Receta INT,
        Id_Tipo_Consumo INT
    );

    -- Cargar recetas en temporales
    OPEN cur_disponibles;
    read_disponibles: LOOP
        FETCH cur_disponibles INTO v_receta, v_momento;
        IF done THEN 
            LEAVE read_disponibles;
        END IF;
        INSERT INTO Temp_Disponibles VALUES (v_receta, v_momento);
    END LOOP;
    CLOSE cur_disponibles;

    SET done = 0;

    OPEN cur_restantes;
    read_restantes: LOOP
        FETCH cur_restantes INTO v_receta, v_momento;
        IF done THEN 
            LEAVE read_restantes;
        END IF;
        INSERT INTO Temp_Restantes VALUES (v_receta, v_momento);
    END LOOP;
    CLOSE cur_restantes;

    -- Reset para recorrer días
    WHILE v_dia <= 7 DO
        -- DESAYUNO
        SET v_momento = 'Desayuno';
        INSERT INTO Plan_Semanal (Dia, Momento, Id_Receta)
        SELECT v_dia, v_momento, Id_Receta
        FROM Temp_Disponibles
        WHERE Id_Tipo_Consumo = 1
        LIMIT 1;

        IF ROW_COUNT() = 0 THEN
            INSERT INTO Plan_Semanal (Dia, Momento, Id_Receta)
            SELECT v_dia, v_momento, Id_Receta
            FROM Temp_Restantes
            WHERE Id_Tipo_Consumo = 1
            LIMIT 1;
            
			IF ROW_COUNT() = 0 THEN
				-- Ninguna receta disponible ni restante
				INSERT INTO Plan_Semanal (Dia, Momento, Id_Receta)
				VALUES (v_dia, v_momento, NULL);
			END IF;
        END IF;

        -- COMIDA
        SET v_momento = 'Comida';
        INSERT INTO Plan_Semanal (Dia, Momento, Id_Receta)
        SELECT v_dia, v_momento, Id_Receta
        FROM Temp_Disponibles
        WHERE Id_Tipo_Consumo = 2
        LIMIT 1;

        IF ROW_COUNT() = 0 THEN
            INSERT INTO Plan_Semanal (Dia, Momento, Id_Receta)
            SELECT v_dia, v_momento, Id_Receta
            FROM Temp_Restantes
            WHERE Id_Tipo_Consumo = 2
            LIMIT 1;
            
			IF ROW_COUNT() = 0 THEN
				-- Ninguna receta disponible ni restante
				INSERT INTO Plan_Semanal (Dia, Momento, Id_Receta)
				VALUES (v_dia, v_momento, NULL);
			END IF;
        END IF;

        -- CENA
        SET v_momento = 'Cena';
        INSERT INTO Plan_Semanal (Dia, Momento, Id_Receta)
        SELECT v_dia, v_momento, Id_Receta
        FROM Temp_Disponibles
        WHERE Id_Tipo_Consumo = 3
        LIMIT 1;

        IF ROW_COUNT() = 0 THEN
            INSERT INTO Plan_Semanal (Dia, Momento, Id_Receta)
            SELECT v_dia, v_momento, Id_Receta
            FROM Temp_Restantes
            WHERE Id_Tipo_Consumo = 3
            LIMIT 1;
			IF ROW_COUNT() = 0 THEN
				-- Ninguna receta disponible ni restante
				INSERT INTO Plan_Semanal (Dia, Momento, Id_Receta)
				VALUES (v_dia, v_momento, NULL);
			END IF;
        END IF;

        -- Eliminar recetas ya usadas
        DELETE FROM Temp_Disponibles
        WHERE Id_Receta IN (
            SELECT Id_Receta FROM Plan_Semanal WHERE Dia = v_dia
        );

        DELETE FROM Temp_Restantes
        WHERE Id_Receta IN (
            SELECT Id_Receta FROM Plan_Semanal WHERE Dia = v_dia
        );

        SET v_dia = v_dia + 1;
    END WHILE;

    -- Resultado final
	SELECT
		p.Dia,
		MAX(CASE WHEN p.Momento = 'Desayuno' THEN p.Id_Receta END) AS Id_Desayuno,
		MAX(CASE WHEN p.Momento = 'Desayuno' THEN r.Nombre END) AS Desayuno,
		MAX(CASE WHEN p.Momento = 'Comida' THEN p.Id_Receta END) AS Id_Comer,
		MAX(CASE WHEN p.Momento = 'Comida' THEN r.Nombre END) AS Comer,
		MAX(CASE WHEN p.Momento = 'Cena' THEN p.Id_Receta END) AS Id_Cena,
		MAX(CASE WHEN p.Momento = 'Cena' THEN r.Nombre END) AS Cena
	FROM Plan_Semanal p
	JOIN Receta r ON p.Id_Receta = r.Id_Receta
	GROUP BY p.Dia
	ORDER BY p.Dia;

    -- Limpieza
    DROP TEMPORARY TABLE IF EXISTS Temp_Disponibles;
    DROP TEMPORARY TABLE IF EXISTS Temp_Restantes;
    DROP TEMPORARY TABLE IF EXISTS Plan_Semanal;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Generar_Plan_Disponible_Debug` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Generar_Plan_Disponible_Debug`(
    IN p_Id_Usuario INT
)
BEGIN
    DECLARE v_dia INT DEFAULT 1;
    DECLARE v_momento VARCHAR(10);
    DECLARE v_receta INT;
    DECLARE done INT DEFAULT 0;

    -- Cursores
    DECLARE cur_disponibles CURSOR FOR
        SELECT r.Id_Receta, r.Id_Tipo_Consumo
        FROM (
            SELECT DISTINCT rd.Id_Receta, rd.Id_Tipo_Consumo, MIN(s.Fecha_Caducidad) AS Fecha_Cad
            FROM vw_Receta_Detalle_Disponible rd
            JOIN vw_stock_detalle s ON rd.Id_Alimento = s.Id_Alimento
            WHERE rd.Id_Usuario = p_Id_Usuario
              AND rd.Puede_Comer = 1
              AND s.Id_Usuario = p_Id_Usuario
              AND s.Fecha_Caducidad < ADDDATE(DATE(NOW()), 300)
            GROUP BY rd.Id_Receta, rd.Id_Tipo_Consumo
        ) r
        ORDER BY r.Fecha_Cad;

    DECLARE cur_restantes CURSOR FOR
        SELECT DISTINCT rd.Id_Receta, rd.Id_Tipo_Consumo
        FROM vw_Receta_Detalle_Disponible rd
        WHERE rd.Id_Usuario = p_Id_Usuario
          AND rd.Puede_Comer = 1
          AND rd.Id_Receta NOT IN (
              SELECT Id_Receta
              FROM (
                  SELECT DISTINCT rd.Id_Receta
                  FROM vw_Receta_Detalle_Disponible rd
                  JOIN vw_stock_detalle s ON rd.Id_Alimento = s.Id_Alimento
                  WHERE rd.Id_Usuario = p_Id_Usuario
                    AND rd.Puede_Comer = 1
                    AND s.Id_Usuario = p_Id_Usuario
                    AND s.Fecha_Caducidad < ADDDATE(DATE(NOW()), 300)
              ) x
          );

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    -- Tabla temporal para el plan
    CREATE TEMPORARY TABLE IF NOT EXISTS Plan_Semanal (
        Dia INT,
        Momento VARCHAR(10),
        Id_Receta INT
    );

    -- Variables internas
    CREATE TEMPORARY TABLE Temp_Disponibles (
        Id_Receta INT,
        Id_Tipo_Consumo INT
    );

    CREATE TEMPORARY TABLE Temp_Restantes (
        Id_Receta INT,
        Id_Tipo_Consumo INT
    );

    -- Cargar recetas en temporales
    OPEN cur_disponibles;
    read_disponibles: LOOP
        FETCH cur_disponibles INTO v_receta, v_momento;
        IF done THEN 
            LEAVE read_disponibles;
        END IF;
        INSERT INTO Temp_Disponibles VALUES (v_receta, v_momento);
    END LOOP;
    CLOSE cur_disponibles;

    SET done = 0;

    OPEN cur_restantes;
    read_restantes: LOOP
        FETCH cur_restantes INTO v_receta, v_momento;
        IF done THEN 
            LEAVE read_restantes;
        END IF;
        INSERT INTO Temp_Restantes VALUES (v_receta, v_momento);
    END LOOP;
    CLOSE cur_restantes;

    -- Reset para recorrer días
    WHILE v_dia <= 7 DO
        -- DESAYUNO
        SET v_momento = 'Desayuno';
        INSERT INTO Plan_Semanal (Dia, Momento, Id_Receta)
        SELECT v_dia, v_momento, Id_Receta
        FROM Temp_Disponibles
        WHERE Id_Tipo_Consumo = 1
        LIMIT 1;

        IF ROW_COUNT() = 0 THEN
            INSERT INTO Plan_Semanal (Dia, Momento, Id_Receta)
            SELECT v_dia, v_momento, Id_Receta
            FROM Temp_Restantes
            WHERE Id_Tipo_Consumo = 1
            LIMIT 1;
        END IF;

        -- COMIDA
        SET v_momento = 'Comida';
        INSERT INTO Plan_Semanal (Dia, Momento, Id_Receta)
        SELECT v_dia, v_momento, Id_Receta
        FROM Temp_Disponibles
        WHERE Id_Tipo_Consumo = 2
        LIMIT 1;

        IF ROW_COUNT() = 0 THEN
            INSERT INTO Plan_Semanal (Dia, Momento, Id_Receta)
            SELECT v_dia, v_momento, Id_Receta
            FROM Temp_Restantes
            WHERE Id_Tipo_Consumo = 2
            LIMIT 1;
        END IF;

        -- CENA
        SET v_momento = 'Cena';
        INSERT INTO Plan_Semanal (Dia, Momento, Id_Receta)
        SELECT v_dia, v_momento, Id_Receta
        FROM Temp_Disponibles
        WHERE Id_Tipo_Consumo = 3
        LIMIT 1;

        IF ROW_COUNT() = 0 THEN
            INSERT INTO Plan_Semanal (Dia, Momento, Id_Receta)
            SELECT v_dia, v_momento, Id_Receta
            FROM Temp_Restantes
            WHERE Id_Tipo_Consumo = 3
            LIMIT 1;
        END IF;

        -- Eliminar recetas ya usadas
        DELETE FROM Temp_Disponibles
        WHERE Id_Receta IN (
            SELECT Id_Receta FROM Plan_Semanal WHERE Dia = v_dia
        );

        DELETE FROM Temp_Restantes
        WHERE Id_Receta IN (
            SELECT Id_Receta FROM Plan_Semanal WHERE Dia = v_dia
        );

        SET v_dia = v_dia + 1;
    END WHILE;

    -- Resultado final
    SELECT * FROM Plan_Semanal;

    -- Limpieza
    DROP TEMPORARY TABLE IF EXISTS Temp_Disponibles;
    DROP TEMPORARY TABLE IF EXISTS Temp_Restantes;
    DROP TEMPORARY TABLE IF EXISTS Plan_Semanal;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Generar_Plan_Disponible_Hoy` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Generar_Plan_Disponible_Hoy`(
    IN p_Id_Usuario INT
)
BEGIN
    -- 1. Crear tablas temporales necesarias
    CREATE TEMPORARY TABLE Temp_Disponibles AS
    SELECT DISTINCT rd.Id_Receta, rd.Id_Tipo_Consumo, MIN(s.Fecha_Caducidad) AS Fecha_Cad
    FROM vw_Receta_Detalle_Disponible rd
    JOIN vw_stock_detalle s ON rd.Id_Alimento = s.Id_Alimento
    WHERE rd.Id_Usuario = p_Id_Usuario
      AND s.Id_Usuario = p_Id_Usuario
      AND rd.Puede_Comer = 1
      AND s.Fecha_Caducidad < ADDDATE(DATE(NOW()), 300)
    GROUP BY rd.Id_Receta, rd.Id_Tipo_Consumo;

    CREATE TEMPORARY TABLE Temp_Restantes AS
    SELECT DISTINCT rd.Id_Receta, rd.Id_Tipo_Consumo, NULL AS Fecha_Cad
    FROM vw_Receta_Detalle_Disponible rd
    WHERE rd.Id_Usuario = p_Id_Usuario
      AND rd.Puede_Comer = 1
      AND rd.Id_Receta NOT IN (SELECT Id_Receta FROM Temp_Disponibles);

    CREATE TEMPORARY TABLE IF NOT EXISTS Plan_Semanal (
        Dia INT,
        Momento VARCHAR(10),
        Id_Receta INT
    );

    -- 2. Insertar recetas disponibles primero
    INSERT INTO Plan_Semanal (Dia, Momento, Id_Receta)
    SELECT
        FLOOR((ROW_NUMBER() OVER (ORDER BY Fecha_Cad ASC) - 1) / 3) + 1 AS Dia,
        CASE (ROW_NUMBER() OVER (ORDER BY Fecha_Cad ASC) - 1) % 3
            WHEN 0 THEN 'Desayuno'
            WHEN 1 THEN 'Comida'
            WHEN 2 THEN 'Cena'
        END AS Momento,
        Id_Receta
    FROM Temp_Disponibles;

    -- 3. Capturar cuántas recetas ya se insertaron
    SET @offset := (SELECT COUNT(*) FROM Temp_Disponibles);

    -- 4. Completar con recetas restantes si hacen falta
    INSERT INTO Plan_Semanal (Dia, Momento, Id_Receta)
    SELECT
        FLOOR((ROW_NUMBER() OVER () + @offset - 1) / 3) + 1 AS Dia,
        CASE (ROW_NUMBER() OVER () + @offset - 1) % 3
            WHEN 0 THEN 'Desayuno'
            WHEN 1 THEN 'Comida'
            WHEN 2 THEN 'Cena'
        END AS Momento,
        Id_Receta
    FROM Temp_Restantes;

    -- 5. Resultado final
	SELECT
		p.Dia,
		MAX(CASE WHEN p.Momento = 'Desayuno' THEN p.Id_Receta END) AS Id_Desayuno,
		MAX(CASE WHEN p.Momento = 'Desayuno' THEN r.Nombre END) AS Desayuno,
		MAX(CASE WHEN p.Momento = 'Comida' THEN p.Id_Receta END) AS Id_Comer,
		MAX(CASE WHEN p.Momento = 'Comida' THEN r.Nombre END) AS Comer,
		MAX(CASE WHEN p.Momento = 'Cena' THEN p.Id_Receta END) AS Id_Cena,
		MAX(CASE WHEN p.Momento = 'Cena' THEN r.Nombre END) AS Cena
	FROM Plan_Semanal p
	JOIN Receta r ON p.Id_Receta = r.Id_Receta
	GROUP BY p.Dia
	ORDER BY p.Dia LIMIT 1;

    -- 6. Limpieza
    DROP TEMPORARY TABLE IF EXISTS Temp_Disponibles;
    DROP TEMPORARY TABLE IF EXISTS Temp_Restantes;
    DROP TEMPORARY TABLE IF EXISTS Plan_Semanal;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Generar_Plan_Estricto` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Generar_Plan_Estricto`(
    IN p_Id_Usuario INT
)
BEGIN
    -- 1. Declaraciones
    DECLARE v_dia INT DEFAULT 1;
    DECLARE v_receta INT;
    DECLARE done INT DEFAULT 0;

    -- Cursores para desayuno, comida y cena
    DECLARE cur_desayuno CURSOR FOR
        SELECT Id_Receta FROM Temp_Recetas_Estrictas
        WHERE Id_Tipo_Consumo = 1
        ORDER BY Fecha_Mas_Cercana;

    DECLARE cur_comida CURSOR FOR
        SELECT Id_Receta FROM Temp_Recetas_Estrictas
        WHERE Id_Tipo_Consumo = 2
        ORDER BY Fecha_Mas_Cercana;

    DECLARE cur_cena CURSOR FOR
        SELECT Id_Receta FROM Temp_Recetas_Estrictas
        WHERE Id_Tipo_Consumo = 3
        ORDER BY Fecha_Mas_Cercana;

    -- Handler único para fin de cursores
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    -- 2. Crear tablas temporales necesarias
    CREATE TEMPORARY TABLE Temp_Stock_Detalle AS
    SELECT Id_Alimento, Fecha_Caducidad
    FROM vw_stock_detalle 
    WHERE Fecha_Caducidad < ADDDATE(DATE(NOW()), 300)
      AND Id_Usuario = p_Id_Usuario;

    CREATE TEMPORARY TABLE Temp_Ingredientes_Usuario AS
    SELECT Id_Receta, Id_Alimento, Id_Tipo_Consumo
    FROM vw_Receta_Detalle_Disponible 
    WHERE Id_Usuario = p_Id_Usuario
      AND Puede_Comer = 1;

    CREATE TEMPORARY TABLE Temp_Receta_Ingredientes_Totales AS
    SELECT Id_Receta, COUNT(*) AS Total_Ingredientes
    FROM vw_receta_detalle
    GROUP BY Id_Receta;

    CREATE TEMPORARY TABLE Temp_Receta_Ingredientes_Disponibles AS
    SELECT i.Id_Receta, COUNT(*) AS Ingredientes_Disponibles
    FROM Temp_Ingredientes_Usuario i
    INNER JOIN Temp_Stock_Detalle s ON i.Id_Alimento = s.Id_Alimento
    GROUP BY i.Id_Receta;

    CREATE TEMPORARY TABLE Temp_Recetas_Estrictas AS
    SELECT t.Id_Receta, u.Id_Tipo_Consumo, MIN(s.Fecha_Caducidad) AS Fecha_Mas_Cercana
    FROM Temp_Receta_Ingredientes_Totales t
    JOIN Temp_Receta_Ingredientes_Disponibles d ON t.Id_Receta = d.Id_Receta
    JOIN Temp_Ingredientes_Usuario u ON t.Id_Receta = u.Id_Receta
    JOIN Temp_Stock_Detalle s ON u.Id_Alimento = s.Id_Alimento
    WHERE t.Total_Ingredientes = d.Ingredientes_Disponibles
    GROUP BY t.Id_Receta, u.Id_Tipo_Consumo;

    CREATE TEMPORARY TABLE Plan_Semanal (
        Dia INT,
        Momento VARCHAR(10),
        Id_Receta INT
    );

    -- 3. Generar plan semanal
    OPEN cur_desayuno;
    OPEN cur_comida;
    OPEN cur_cena;

    WHILE v_dia <= 7 DO
        -- DESAYUNO
        SET done = 0;
        FETCH cur_desayuno INTO v_receta;
        IF done = 1 THEN
            INSERT INTO Plan_Semanal VALUES (v_dia, 'Desayuno', NULL);
        ELSE
            INSERT INTO Plan_Semanal VALUES (v_dia, 'Desayuno', v_receta);
        END IF;

        -- COMIDA
        SET done = 0;
        FETCH cur_comida INTO v_receta;
        IF done = 1 THEN
            INSERT INTO Plan_Semanal VALUES (v_dia, 'Comida', NULL);
        ELSE
            INSERT INTO Plan_Semanal VALUES (v_dia, 'Comida', v_receta);
        END IF;

        -- CENA
        SET done = 0;
        FETCH cur_cena INTO v_receta;
        IF done = 1 THEN
            INSERT INTO Plan_Semanal VALUES (v_dia, 'Cena', NULL);
        ELSE
            INSERT INTO Plan_Semanal VALUES (v_dia, 'Cena', v_receta);
        END IF;

        SET v_dia = v_dia + 1;
    END WHILE;

    CLOSE cur_desayuno;
    CLOSE cur_comida;
    CLOSE cur_cena;

    -- 4. Mostrar resultado
	SELECT
		p.Dia,
		MAX(CASE WHEN p.Momento = 'Desayuno' THEN p.Id_Receta END) AS Id_Desayuno,
		MAX(CASE WHEN p.Momento = 'Desayuno' THEN r.Nombre END) AS Desayuno,
		MAX(CASE WHEN p.Momento = 'Comida' THEN p.Id_Receta END) AS Id_Comer,
		MAX(CASE WHEN p.Momento = 'Comida' THEN r.Nombre END) AS Comer,
		MAX(CASE WHEN p.Momento = 'Cena' THEN p.Id_Receta END) AS Id_Cena,
		MAX(CASE WHEN p.Momento = 'Cena' THEN r.Nombre END) AS Cena
	FROM Plan_Semanal p
	JOIN Receta r ON p.Id_Receta = r.Id_Receta
	GROUP BY p.Dia
	ORDER BY p.Dia;

    -- 5. Limpieza
    DROP TEMPORARY TABLE IF EXISTS Temp_Stock_Detalle;
    DROP TEMPORARY TABLE IF EXISTS Temp_Ingredientes_Usuario;
    DROP TEMPORARY TABLE IF EXISTS Temp_Receta_Ingredientes_Totales;
    DROP TEMPORARY TABLE IF EXISTS Temp_Receta_Ingredientes_Disponibles;
    DROP TEMPORARY TABLE IF EXISTS Temp_Recetas_Estrictas;
    DROP TEMPORARY TABLE IF EXISTS Plan_Semanal;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Generar_Plan_Estricto_Hoy` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Generar_Plan_Estricto_Hoy`(
    IN p_Id_Usuario INT
)
BEGIN

    -- 2. Crear tablas temporales necesarias
    CREATE TEMPORARY TABLE Temp_Stock_Detalle AS
    SELECT Id_Alimento, Fecha_Caducidad
    FROM vw_stock_detalle 
    WHERE Fecha_Caducidad < ADDDATE(DATE(NOW()), 300)
      AND Id_Usuario = p_Id_Usuario;

    CREATE TEMPORARY TABLE Temp_Ingredientes_Usuario AS
    SELECT Id_Receta, Id_Alimento, Id_Tipo_Consumo
    FROM vw_Receta_Detalle_Disponible 
    WHERE Id_Usuario = p_Id_Usuario
      AND Puede_Comer = 1;

    CREATE TEMPORARY TABLE Temp_Receta_Ingredientes_Totales AS
    SELECT Id_Receta, COUNT(*) AS Total_Ingredientes
    FROM vw_receta_detalle
    GROUP BY Id_Receta;

    CREATE TEMPORARY TABLE Temp_Receta_Ingredientes_Disponibles AS
    SELECT i.Id_Receta, COUNT(*) AS Ingredientes_Disponibles
    FROM Temp_Ingredientes_Usuario i
    INNER JOIN Temp_Stock_Detalle s ON i.Id_Alimento = s.Id_Alimento
    GROUP BY i.Id_Receta;

    CREATE TEMPORARY TABLE Temp_Recetas_Estrictas AS
    SELECT t.Id_Receta, u.Id_Tipo_Consumo, MIN(s.Fecha_Caducidad) AS Fecha_Mas_Cercana
    FROM Temp_Receta_Ingredientes_Totales t
    JOIN Temp_Receta_Ingredientes_Disponibles d ON t.Id_Receta = d.Id_Receta
    JOIN Temp_Ingredientes_Usuario u ON t.Id_Receta = u.Id_Receta
    JOIN Temp_Stock_Detalle s ON u.Id_Alimento = s.Id_Alimento
    WHERE t.Total_Ingredientes = d.Ingredientes_Disponibles
    GROUP BY t.Id_Receta, u.Id_Tipo_Consumo;

    -- Tabla temporal para el plan
    CREATE TEMPORARY TABLE IF NOT EXISTS Plan_Semanal (
        Dia INT,
        Momento VARCHAR(10),
        Id_Receta INT
    );
    
    -- Insertar todas las recetas en Plan_Semanal, distribuidas por día y momento
	INSERT INTO Plan_Semanal (Dia, Momento, Id_Receta)
	SELECT 
		FLOOR((ROW_NUMBER() OVER (ORDER BY Fecha_Mas_Cercana ASC) - 1) / 3) + 1 AS Dia,
		CASE (ROW_NUMBER() OVER (ORDER BY Fecha_Mas_Cercana ASC) - 1) % 3
			WHEN 0 THEN 'Desayuno'
			WHEN 1 THEN 'Comida'
			WHEN 2 THEN 'Cena'
		END AS Momento,
		Id_Receta
	FROM Temp_Recetas_Estrictas;
    
	SELECT
		p.Dia,
		MAX(CASE WHEN p.Momento = 'Desayuno' THEN p.Id_Receta END) AS Id_Desayuno,
		MAX(CASE WHEN p.Momento = 'Desayuno' THEN r.Nombre END) AS Desayuno,
		MAX(CASE WHEN p.Momento = 'Comida' THEN p.Id_Receta END) AS Id_Comer,
		MAX(CASE WHEN p.Momento = 'Comida' THEN r.Nombre END) AS Comer,
		MAX(CASE WHEN p.Momento = 'Cena' THEN p.Id_Receta END) AS Id_Cena,
		MAX(CASE WHEN p.Momento = 'Cena' THEN r.Nombre END) AS Cena
	FROM Plan_Semanal p
	JOIN Receta r ON p.Id_Receta = r.Id_Receta
	GROUP BY p.Dia
	ORDER BY p.Dia LIMIT 1;
    
    -- 5. Limpieza
    DROP TEMPORARY TABLE IF EXISTS Temp_Stock_Detalle;
    DROP TEMPORARY TABLE IF EXISTS Temp_Ingredientes_Usuario;
    DROP TEMPORARY TABLE IF EXISTS Temp_Receta_Ingredientes_Totales;
    DROP TEMPORARY TABLE IF EXISTS Temp_Receta_Ingredientes_Disponibles;
    DROP TEMPORARY TABLE IF EXISTS Temp_Recetas_Estrictas;
    DROP TEMPORARY TABLE IF EXISTS Plan_Semanal;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Obtener_Alimentos_Faltantes` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Obtener_Alimentos_Faltantes`(
    IN p_Id_Usuario INT
)
BEGIN
    -- Crear tabla temporal para el stock filtrado
    CREATE TEMPORARY TABLE Temp_Stock_Detalle AS
    SELECT Id_Alimento 
    FROM vw_stock_detalle 
    WHERE Fecha_Caducidad < ADDDATE(DATE(NOW()), 300) 
      AND Id_Usuario = p_Id_Usuario;

    -- Crear tabla temporal para las recetas disponibles
    CREATE TEMPORARY TABLE Temp_Recetas_Disponibles AS
    SELECT DISTINCT Id_Receta 
    FROM vw_Receta_Detalle_Disponible 
    WHERE Id_Usuario = p_Id_Usuario 
      AND Puede_Comer = 1 
      AND Id_Alimento IN (SELECT Id_Alimento FROM Temp_Stock_Detalle);

    -- Obtener alimentos faltantes
    SELECT a.Id_Alimento
    FROM vw_receta_detalle a
    LEFT JOIN Temp_Stock_Detalle b 
        ON a.Id_Alimento = b.Id_Alimento
    WHERE b.Id_Alimento IS NULL 
      AND a.Id_Receta IN (SELECT Id_Receta FROM Temp_Recetas_Disponibles);

    -- Limpiar las tablas temporales
    DROP TEMPORARY TABLE IF EXISTS Temp_Stock_Detalle;
    DROP TEMPORARY TABLE IF EXISTS Temp_Recetas_Disponibles;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Obtener_Recetas_Disponibles` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Obtener_Recetas_Disponibles`(
    IN p_Id_Usuario INT
)
BEGIN
    -- Crear tabla temporal para el stock filtrado
    CREATE TEMPORARY TABLE Temp_Stock_Detalle AS
    SELECT Id_Alimento 
    FROM vw_stock_detalle 
    WHERE Fecha_Caducidad < ADDDATE(DATE(NOW()), 300) 
      AND Id_Usuario = p_Id_Usuario;

    -- Crear tabla temporal para las recetas disponibles
    CREATE TEMPORARY TABLE Temp_Recetas_Disponibles AS
    SELECT DISTINCT Id_Receta 
    FROM vw_Receta_Detalle_Disponible 
    WHERE Id_Usuario = p_Id_Usuario 
      AND Puede_Comer = 1 
      AND Id_Alimento IN (SELECT Id_Alimento FROM Temp_Stock_Detalle);

    SELECT Id_Receta FROM Temp_Recetas_Disponibles;

    -- Limpiar las tablas temporales
    DROP TEMPORARY TABLE IF EXISTS Temp_Stock_Detalle;
    DROP TEMPORARY TABLE IF EXISTS Temp_Recetas_Disponibles;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Obtener_Recetas_Estricto` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Obtener_Recetas_Estricto`(
    IN p_Id_Usuario INT
)
BEGIN
    -- Stock válido del usuario
    CREATE TEMPORARY TABLE Temp_Stock_Detalle AS
    SELECT Id_Alimento 
    FROM vw_stock_detalle 
    WHERE Fecha_Caducidad < ADDDATE(DATE(NOW()), 300) 
      AND Id_Usuario = p_Id_Usuario;

    -- Ingredientes permitidos al usuario por receta
    CREATE TEMPORARY TABLE Temp_Ingredientes_Usuario AS
    SELECT Id_Receta, Id_Alimento
    FROM vw_Receta_Detalle_Disponible 
    WHERE Id_Usuario = p_Id_Usuario 
      AND Puede_Comer = 1;

    -- Conteo total de ingredientes por receta
    CREATE TEMPORARY TABLE Temp_Receta_Ingredientes_Totales AS
    SELECT Id_Receta, COUNT(*) AS Total_Ingredientes
    FROM vw_receta_detalle
    GROUP BY Id_Receta;

    -- Conteo de ingredientes disponibles en stock por receta
    CREATE TEMPORARY TABLE Temp_Receta_Ingredientes_Disponibles AS
    SELECT i.Id_Receta, COUNT(*) AS Ingredientes_Disponibles
    FROM Temp_Ingredientes_Usuario i
    INNER JOIN Temp_Stock_Detalle s ON i.Id_Alimento = s.Id_Alimento
    GROUP BY i.Id_Receta;

    -- Seleccionar recetas donde el total de ingredientes coincida con los disponibles
    SELECT t.Id_Receta
    FROM Temp_Receta_Ingredientes_Totales t
    INNER JOIN Temp_Receta_Ingredientes_Disponibles d ON t.Id_Receta = d.Id_Receta
    WHERE t.Total_Ingredientes = d.Ingredientes_Disponibles;

    -- Limpiar
    DROP TEMPORARY TABLE IF EXISTS Temp_Stock_Detalle;
    DROP TEMPORARY TABLE IF EXISTS Temp_Ingredientes_Usuario;
    DROP TEMPORARY TABLE IF EXISTS Temp_Receta_Ingredientes_Totales;
    DROP TEMPORARY TABLE IF EXISTS Temp_Receta_Ingredientes_Disponibles;
END ;;
DELIMITER ;


DELIMITER //

CREATE TRIGGER Nuevo_Alimento_Usuario
AFTER INSERT ON cat_alimento
FOR EACH ROW
BEGIN
    INSERT IGNORE INTO usuario_cat_alimento (Id_Usuario, Id_Alimento, PuedeComer)
    SELECT u.Id_Usuario, NEW.Id_Alimento, 1
    FROM usuario u;
END//

DELIMITER ;


DELIMITER //

CREATE TRIGGER Nuevo_Usuario_Alimento
AFTER INSERT ON usuario
FOR EACH ROW
BEGIN
    INSERT INTO usuario_cat_alimento (Id_Usuario, Id_Alimento, Puede_Comer)
    SELECT NEW.Id_Usuario, a.Id_Alimento, 1
    FROM cat_alimento a
    ON DUPLICATE KEY UPDATE Puede_Comer = VALUES(Puede_Comer);
END//

DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `vw_cat_alimento`
--

/*!50001 DROP VIEW IF EXISTS `vw_cat_alimento`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_cat_alimento` AS select `ca`.`Id_Alimento` AS `Id_Alimento`,`ca`.`Id_Tipo_Alimento` AS `Id_Tipo_Alimento`,`ca`.`Alimento` AS `Alimento`,`ca`.`Activo` AS `Activo`,`ca`.`Es_Perecedero` AS `Es_Perecedero`,`ct`.`Tipo_Alimento` AS `Tipo_Alimento`,`uca`.`Id_Usuario` AS `Id_Usuario`,`uca`.`Puede_Comer` AS `Puede_Comer` from ((`cat_alimento` `ca` join `cat_tipo_alimento` `ct` on((`ca`.`Id_Tipo_Alimento` = `ct`.`Id_Tipo_Alimento`))) join `usuario_cat_alimento` `uca` on((`ca`.`Id_Alimento` = `uca`.`Id_Alimento`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_lista_compra`
--

/*!50001 DROP VIEW IF EXISTS `vw_lista_compra`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_lista_compra` AS select `r`.`Id_Receta` AS `Id_Receta`,`r`.`Nombre` AS `Nombre`,`lc`.`Id_Lista_Compra` AS `Id_Lista_Compra`,`lc`.`Id_Unidad_Medida` AS `Id_Unidad_Medida`,`cu`.`Unidad_Medida` AS `Unidad_Medida`,`cu`.`Abreviatura` AS `Abreviatura`,`lc`.`Cantidad` AS `Cantidad`,`lc`.`Id_Alimento` AS `Id_Alimento`,`ca`.`Alimento` AS `Alimento`,`ct`.`Tipo_Alimento` AS `Tipo_Alimento` from ((((`receta` `r` join `lista_compra` `lc` on((`r`.`Id_Receta` = `lc`.`Id_Receta`))) join `cat_alimento` `ca` on((`ca`.`Id_Alimento` = `lc`.`Id_Alimento`))) join `cat_unidad_medida` `cu` on((`cu`.`Id_Unidad_Medida` = `lc`.`Id_Unidad_Medida`))) join `cat_tipo_alimento` `ct` on((`ct`.`Id_Tipo_Alimento` = `ca`.`Id_Tipo_Alimento`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_receta`
--

/*!50001 DROP VIEW IF EXISTS `vw_receta`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_receta` AS select `r`.`Id_Receta` AS `Id_Receta`,`r`.`Nombre` AS `Nombre`,`r`.`Activo` AS `Activo`,`r`.`Id_Tipo_Consumo` AS `Id_Tipo_Consumo`,`ctc`.`Tipo_Consumo` AS `Tipo_Consumo` from (`receta` `r` join `cat_tipo_consumo` `ctc` on((`ctc`.`Id_Tipo_Consumo` = `r`.`Id_Tipo_Consumo`))) where (`r`.`Activo` = 1) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_receta_detalle`
--

/*!50001 DROP VIEW IF EXISTS `vw_receta_detalle`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_receta_detalle` AS select `r`.`Id_Receta` AS `Id_Receta`,`r`.`Nombre` AS `Nombre`,`rd`.`Id_Receta_Detalle` AS `Id_Receta_Detalle`,`rd`.`Id_Unidad_Medida` AS `Id_Unidad_Medida`,`cu`.`Unidad_Medida` AS `Unidad_Medida`,`rd`.`Cantidad` AS `Cantidad`,`rd`.`Id_Alimento` AS `Id_Alimento`,`ca`.`Alimento` AS `Alimento`,`ct`.`Tipo_Alimento` AS `Tipo_Alimento` from ((((`receta` `r` join `receta_detalle` `rd` on((`r`.`Id_Receta` = `rd`.`Id_Receta`))) join `cat_alimento` `ca` on((`ca`.`Id_Alimento` = `rd`.`Id_Alimento`))) join `cat_unidad_medida` `cu` on((`cu`.`Id_Unidad_Medida` = `rd`.`Id_Unidad_Medida`))) join `cat_tipo_alimento` `ct` on((`ct`.`Id_Tipo_Alimento` = `ca`.`Id_Tipo_Alimento`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_receta_detalle_disponible`
--

/*!50001 DROP VIEW IF EXISTS `vw_receta_detalle_disponible`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_receta_detalle_disponible` AS select `rd`.`Id_Receta` AS `Id_Receta`,`r`.`Id_Tipo_Consumo` AS `Id_Tipo_Consumo`,`rd`.`Id_Unidad_Medida` AS `Id_Unidad_Medida`,`rd`.`Id_Alimento` AS `Id_Alimento`,`vwsd`.`Alimento` AS `Alimento`,`vwsd`.`Unidad_Medida` AS `Unidad_Medida`,`rd`.`Cantidad` AS `Cantidad_Receta`,`uca`.`Id_Usuario` AS `Id_Usuario`,`uca`.`Puede_Comer` AS `Puede_Comer` from (((`receta_detalle` `rd` join `receta` `r` on((`rd`.`Id_Receta` = `r`.`Id_Receta`))) join `vw_stock_detalle` `vwsd` on((`vwsd`.`Id_Alimento` = `rd`.`Id_Alimento`))) join `usuario_cat_alimento` `uca` on((`uca`.`Id_Alimento` = `rd`.`Id_Alimento`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_stock_detalle`
--

/*!50001 DROP VIEW IF EXISTS `vw_stock_detalle`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_stock_detalle` AS select `sd`.`Id_Stock_Detalle` AS `Id_Stock_Detalle`,`sd`.`Id_Usuario_Alta` AS `Id_Usuario`,`sd`.`Id_Alimento` AS `Id_Alimento`,`sd`.`Id_Unidad_Medida` AS `Id_Unidad_Medida`,`sd`.`Cantidad` AS `Cantidad`,`sd`.`Activo` AS `Activo`,`sd`.`Total` AS `Total`,`sd`.`Cantidad_Consumida` AS `Cantidad_Consumida`,`sd`.`Fecha_Caducidad` AS `Fecha_Caducidad`,`sd`.`Es_Perecedero` AS `Es_Perecedero`,`ca`.`Alimento` AS `Alimento`,`cta`.`Tipo_Alimento` AS `Tipo_Alimento`,`cu`.`Unidad_Medida` AS `Unidad_Medida`,`cu`.`Abreviatura` AS `Abreviatura` from (((`stock_detalle` `sd` join `cat_alimento` `ca` on((`ca`.`Id_Alimento` = `sd`.`Id_Alimento`))) join `cat_tipo_alimento` `cta` on((`cta`.`Id_Tipo_Alimento` = `ca`.`Id_Tipo_Alimento`))) join `cat_unidad_medida` `cu` on((`cu`.`Id_Unidad_Medida` = `sd`.`Id_Unidad_Medida`))) where ((`sd`.`Activo` = true) and (`sd`.`Total` > 0) and (((`sd`.`Fecha_Caducidad` > now()) and (`sd`.`Es_Perecedero` = 1)) or (`sd`.`Es_Perecedero` = 0))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_stock_total`
--

/*!50001 DROP VIEW IF EXISTS `vw_stock_total`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_stock_total` AS select `vw_stock_detalle`.`Id_Alimento` AS `Id_Alimento`,(sum(`vw_stock_detalle`.`Total`) - sum(`vw_stock_detalle`.`Cantidad_Consumida`)) AS `Total` from `vw_stock_detalle` group by `vw_stock_detalle`.`Id_Alimento` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-05 17:50:50
