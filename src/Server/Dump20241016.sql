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
  `Activo` tinyint(1) NOT NULL DEFAULT (1),
  `Id_Usuario_Alta` int NOT NULL,
  `Fecha_Alta` datetime NOT NULL,
  `Id_Usuario_Modif` int DEFAULT NULL,
  `Fecha_Modif` datetime DEFAULT NULL,
  `Id_Usuario_Baja` int DEFAULT NULL,
  `Fecha_Baja` datetime DEFAULT NULL,
  `Es_Perecedero` tinyint(1) NOT NULL DEFAULT (true),
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
INSERT INTO `cat_alimento` VALUES (1,5,'Huevos',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(2,7,'Frijoles bayos',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(3,1,'Calabacita',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(4,9,'Sal con ajo en polvo',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,0),(5,9,'Sal',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,0),(6,9,'Pimienta negra molida',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,0),(7,6,'Harina de trigo',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,0),(8,5,'Huevos batidos',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(9,6,'Pan molido',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,0),(10,1,'Jitomate',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(11,1,'Cebolla asada',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(12,9,'Diente de ajo',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(13,9,'Concentrado de tomate con pollo',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(14,9,'Cilantro',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(15,3,'Filete de pescado',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(16,10,'Aceite vegetal',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,0),(17,3,'Pechuga de pollo',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(18,1,'Espinaca',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(19,1,'Champiñones',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(20,10,'Mantequilla',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(21,5,'Caldo de pollo',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(22,4,'Crema de leche',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(24,9,'Pimienta',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,0),(25,4,'Media crema',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(26,5,'Mayonesa',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(27,1,'Cebolla morada',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(28,2,'Pepino',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(29,3,'Atun',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(31,9,'Chile cerrano',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(32,6,'Paquete de galletas saladas',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(33,8,'Agua',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,0),(34,9,'Ajo en polvo',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,0),(35,10,'Aceite de maiz',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(36,3,'Carne de res molida',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(37,4,'Leche evaporada',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(38,6,'Paquete de pasta de espaguetti',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(39,9,'Sal con cebolla en polvo',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,0),(40,1,'Cebolla',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(41,9,'Apio',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(42,9,'Salsa de tomate',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(43,9,'Hojas de Laurel',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,0),(44,6,'Pasta para lasaña',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(45,4,'Queso mozzarella',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(47,4,'Queso parmesano',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(48,6,'Pasta de fideo',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(49,1,'Brocoli',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(50,6,'Pasta hojaldre',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(51,1,'Alcachofa',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(52,4,'Queso Chihuahua',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(53,9,'Ajonjoli',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,0),(54,9,'Pimiento morron',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(55,4,'Leche condensada',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(56,2,'Jugo de limon',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(57,6,'Galletas Marias',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(58,2,'Limon',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(59,9,'Rama de menta',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(60,2,'Pure de tomate',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(61,2,'Ralladura de limon',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(62,10,'Mazapan',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,0),(63,11,'Grenetina',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,0),(64,2,'Fresas',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(65,7,'Arroz',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,0),(66,9,'Canela',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,0),(67,8,'Hielo',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,0),(68,9,'Canela en polvo',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,0),(69,2,'Jugo de piña',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(70,4,'Crema de coco',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(71,3,'Jamón',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(72,4,'Queso panela',1,1,'2024-04-28 02:34:31',NULL,NULL,NULL,NULL,1),(73,3,'Chorizo',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(74,1,'Papas',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(75,7,'Garbanzos',1,4,'2024-06-03 10:23:50',NULL,NULL,NULL,NULL,0),(76,11,'Arándanos',1,4,'2024-06-03 14:14:00',NULL,NULL,NULL,NULL,0),(78,6,'Cereal Corn Pops',1,4,'2024-06-03 19:29:04',NULL,NULL,NULL,NULL,1),(80,2,'Plátano',1,4,'2024-06-04 10:45:41',NULL,NULL,NULL,NULL,1),(81,9,'Mostaza',1,4,'2024-06-04 17:42:27',NULL,NULL,NULL,NULL,1),(82,1,'Aguacate',1,4,'2024-06-04 19:03:13',NULL,NULL,NULL,NULL,1),(83,3,'Salmón ahumado',1,4,'2024-06-04 19:05:28',NULL,NULL,NULL,NULL,1),(84,1,'Pimiento dulce',1,4,'2024-06-04 19:06:41',NULL,NULL,NULL,NULL,1),(85,9,'Eneldo fresco',1,4,'2024-06-04 19:09:02',NULL,NULL,NULL,NULL,1),(86,3,'Carne molida',1,4,'2024-06-05 11:03:37',NULL,NULL,NULL,NULL,1),(87,1,'Zanahoria',1,4,'2024-06-05 11:10:02',NULL,NULL,NULL,NULL,1),(88,1,'Guisantes',1,4,'2024-06-05 11:10:35',NULL,NULL,NULL,NULL,1),(89,3,'Jamón ibérico',1,4,'2024-06-05 11:12:26',NULL,NULL,NULL,NULL,0),(90,9,'Pimentón dulce',1,4,'2024-06-05 11:16:00',NULL,NULL,NULL,NULL,0),(91,9,'Hoja de Laurel',1,4,'2024-06-05 11:17:52',NULL,NULL,NULL,NULL,0),(92,1,'Aceite de oliva',1,4,'2024-06-05 11:18:55',NULL,NULL,NULL,NULL,0),(93,9,'Orégano',1,4,'2024-06-05 11:24:26',NULL,NULL,NULL,NULL,0),(94,1,'Nopal',1,4,'2024-06-05 11:26:19',NULL,NULL,NULL,NULL,1),(95,4,'Queso manchego',1,4,'2024-06-05 11:27:10',NULL,NULL,NULL,NULL,1),(96,4,'Queso Oaxaca',1,4,'2024-06-05 16:05:12',NULL,NULL,NULL,NULL,1),(97,1,'Papa frita',1,4,'2024-06-05 16:25:21',NULL,NULL,NULL,NULL,1),(98,1,'Papas fritas',1,4,'2024-06-05 16:29:34',NULL,NULL,NULL,NULL,1);
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
INSERT INTO `cat_tipo_alimento` VALUES (1,'Vegetal',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL),(2,'Fruta',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL),(3,'Carne y pescado',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL),(4,'Lacteo',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL),(5,'Otro de origen animal',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL),(6,'Cereal',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL),(7,'Legumbre',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL),(8,'Bebida',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL),(9,'Especia',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL),(10,'Azúcares y grasas',1,1,'2024-04-28 02:34:41',NULL,NULL,NULL),(11,'Otros',1,1,'2024-04-30 04:24:30',NULL,NULL,NULL);
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
INSERT INTO `cat_tipo_consumo` VALUES (1,'Desayuno',1,1,'2024-04-28 02:33:38',NULL,NULL,NULL,NULL),(2,'Comida',1,1,'2024-04-28 02:33:38',NULL,NULL,NULL,NULL),(3,'Cena',1,1,'2024-04-28 02:33:38',NULL,NULL,NULL,NULL),(4,'Postre',1,1,'2024-04-28 02:33:38',NULL,NULL,NULL,NULL),(5,'Bebida',1,1,'2024-04-28 02:33:38',NULL,NULL,NULL,NULL),(6,'Snack',1,1,'2024-04-28 02:33:38',NULL,NULL,NULL,NULL);
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
INSERT INTO `lista_compra` VALUES (10,13,4,12,1,1,4,'2024-06-11 18:45:53',NULL,NULL,NULL,NULL),(11,2,6,0,1,81,4,'2024-06-11 18:45:53',NULL,NULL,NULL,NULL),(12,1,4,3,1,3,4,'2024-06-11 18:45:53',NULL,NULL,NULL,NULL),(13,11,6,1,1,68,4,'2024-06-11 18:45:53',NULL,NULL,NULL,NULL),(14,1,6,5,1,4,4,'2024-06-11 18:45:53',NULL,NULL,NULL,NULL),(15,2,8,1,1,6,4,'2024-06-11 18:45:53',NULL,NULL,NULL,NULL),(16,2,3,0,1,7,4,'2024-06-11 18:45:53',NULL,NULL,NULL,NULL),(17,2,3,0,1,9,4,'2024-06-11 18:45:53',NULL,NULL,NULL,NULL),(18,2,4,4,1,10,4,'2024-06-11 18:45:53',NULL,NULL,NULL,NULL);
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
  PRIMARY KEY (`Id_Receta`),
  KEY `Id_Usuario_Alta` (`Id_Usuario_Alta`),
  KEY `Id_Usuario_Modif` (`Id_Usuario_Modif`),
  KEY `Id_Usuario_Baja` (`Id_Usuario_Baja`),
  KEY `Id_Tipo_Consumo` (`Id_Tipo_Consumo`),
  CONSTRAINT `Id_Tipo_Consumo` FOREIGN KEY (`Id_Tipo_Consumo`) REFERENCES `cat_tipo_consumo` (`Id_Tipo_Consumo`),
  CONSTRAINT `receta_ibfk_1` FOREIGN KEY (`Id_Usuario_Alta`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `receta_ibfk_2` FOREIGN KEY (`Id_Usuario_Modif`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `receta_ibfk_3` FOREIGN KEY (`Id_Usuario_Baja`) REFERENCES `usuario` (`Id_Usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receta`
--

LOCK TABLES `receta` WRITE;
/*!40000 ALTER TABLE `receta` DISABLE KEYS */;
INSERT INTO `receta` VALUES (1,'Cazuela de Huevo con Calabacitas y Frijoles',1,1,'2024-04-28 01:30:24',4,'2024-06-04 18:46:11',NULL,NULL,1),(2,'Pescado empanizado',1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL,2),(3,'Pechuga con espinacas al champiñón',1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL,2),(4,'Ensalada de atún',1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL,2),(5,'Espagueti con albóndigas',1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL,2),(6,'Lasaña ',1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL,3),(7,'Sopa de fideo con brócoli',1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL,2),(8,'Empanadas de alcachofa',1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL,2),(9,'Carlota de limón',1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL,4),(10,'Gelatina de mazapan',1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL,4),(11,'Agua de horchata',1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL,5),(12,'Piña colada',1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL,5),(13,'Huevos con jamón y Frijoles',1,1,'2024-04-28 01:30:24',4,'2024-06-11 17:16:17',NULL,NULL,1),(14,'Calabacitas con queso panela y Frijoles',1,1,'2024-04-28 01:30:24',NULL,NULL,NULL,NULL,1),(15,'Huevos con chorizo y Frijoles',1,1,'2024-04-28 01:30:24',4,'2024-06-11 17:19:10',NULL,NULL,1),(16,'Papas con chorizo y Frijoles',1,1,'2024-04-28 01:30:24',4,'2024-06-11 17:20:09',NULL,NULL,1),(17,'Papas con queso y Frijoles',0,1,'2024-04-28 01:30:24',4,'2024-06-11 17:21:24',4,'2024-06-11 17:22:01',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=556 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receta_detalle`
--

LOCK TABLES `receta_detalle` WRITE;
/*!40000 ALTER TABLE `receta_detalle` DISABLE KEYS */;
INSERT INTO `receta_detalle` VALUES (1,1,4,2.0000,1,1,'2024-04-28 02:34:41',4,'2024-06-04 09:07:17',NULL,NULL,1),(2,1,6,1.0000,1,1,'2024-04-28 02:34:41',4,'2024-06-04 09:01:50',NULL,NULL,4),(3,1,3,1.0000,1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,2),(4,1,4,2.0000,1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,3),(5,2,8,1.0000,1,1,'2024-04-30 04:48:06',NULL,NULL,NULL,NULL,5),(6,2,8,1.0000,1,1,'2024-04-30 04:48:06',NULL,NULL,NULL,NULL,6),(7,2,3,0.2500,1,1,'2024-04-30 04:48:06',NULL,NULL,NULL,NULL,7),(8,2,4,1.0000,1,1,'2024-04-30 04:48:06',NULL,NULL,NULL,NULL,8),(9,2,3,0.2500,1,1,'2024-04-30 04:48:06',NULL,NULL,NULL,NULL,9),(10,2,4,1.0000,1,1,'2024-04-30 04:48:06',NULL,NULL,NULL,NULL,10),(316,2,4,0.2000,1,1,'2024-04-30 04:54:38',NULL,NULL,NULL,NULL,11),(407,2,4,0.5000,1,1,'2024-04-30 05:03:27',NULL,NULL,NULL,NULL,12),(408,2,4,1.0000,1,1,'2024-04-30 05:03:27',NULL,NULL,NULL,NULL,13),(409,2,4,1.0000,1,1,'2024-04-30 05:03:27',NULL,NULL,NULL,NULL,14),(410,2,4,1.0000,1,1,'2024-04-30 05:03:27',NULL,NULL,NULL,NULL,15),(411,2,2,4.0000,1,1,'2024-04-30 05:03:27',NULL,NULL,NULL,NULL,16),(412,3,4,1.0000,1,1,'2024-04-30 05:03:39',NULL,NULL,NULL,NULL,17),(413,3,3,0.5000,1,1,'2024-04-30 05:03:39',NULL,NULL,NULL,NULL,18),(414,3,10,0.2500,1,1,'2024-04-30 05:03:39',NULL,NULL,NULL,NULL,19),(415,3,6,0.5000,1,1,'2024-04-30 05:03:39',NULL,NULL,NULL,NULL,20),(416,3,3,0.2500,1,1,'2024-04-30 05:03:39',NULL,NULL,NULL,NULL,21),(417,3,3,0.2500,1,1,'2024-04-30 05:03:39',NULL,NULL,NULL,NULL,22),(418,3,6,2.0000,1,1,'2024-04-30 05:03:53',NULL,NULL,NULL,NULL,5),(419,3,6,2.0000,1,1,'2024-04-30 05:03:53',NULL,NULL,NULL,NULL,24),(420,4,10,0.2500,1,1,'2024-04-30 05:03:53',NULL,NULL,NULL,NULL,25),(421,4,3,0.1250,1,1,'2024-04-30 05:03:53',NULL,NULL,NULL,NULL,26),(422,4,8,1.0000,1,1,'2024-04-30 05:03:53',NULL,NULL,NULL,NULL,5),(423,4,4,0.5000,1,1,'2024-04-30 05:03:53',NULL,NULL,NULL,NULL,56),(424,4,4,1.0000,1,1,'2024-04-30 05:04:04',NULL,NULL,NULL,NULL,10),(425,4,4,0.2500,1,1,'2024-04-30 05:04:04',NULL,NULL,NULL,NULL,27),(426,4,4,1.0000,1,1,'2024-04-30 05:04:04',NULL,NULL,NULL,NULL,28),(427,4,10,1.0000,1,1,'2024-04-30 05:04:04',NULL,NULL,NULL,NULL,29),(428,4,4,1.0000,1,1,'2024-04-30 05:04:04',NULL,NULL,NULL,NULL,14),(429,4,4,0.5000,1,1,'2024-04-30 05:04:04',NULL,NULL,NULL,NULL,31),(441,4,4,0.5000,1,1,'2024-04-30 05:06:14',NULL,NULL,NULL,NULL,32),(443,5,3,0.1250,1,1,'2024-04-30 05:09:06',NULL,NULL,NULL,NULL,60),(444,5,3,0.1250,1,1,'2024-04-30 05:09:18',NULL,NULL,NULL,NULL,60),(445,5,3,0.1250,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,33),(446,5,8,1.0000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,34),(447,5,4,0.5000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,10),(448,5,6,1.0000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,35),(449,5,9,55.0000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,36),(450,5,4,0.5000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,13),(451,5,10,0.2500,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,37),(452,5,4,0.5000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,38),(453,5,6,1.0000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,39),(454,6,9,100.0000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,36),(455,6,8,1.0000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,34),(456,6,6,0.2500,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,16),(457,6,5,2.0000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,40),(458,6,4,0.2500,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,12),(459,6,5,1.0000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,41),(460,6,11,0.1250,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,42),(461,6,3,0.1000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,33),(462,6,4,0.5000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,43),(463,6,4,0.1666,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,44),(464,6,3,0.2000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,45),(465,6,8,1.0000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,5),(466,6,8,1.0000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,24),(467,6,5,4.0000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,47),(468,7,3,0.5000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,21),(469,7,4,1.0000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,10),(470,7,4,0.5000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,12),(471,7,4,0.1250,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,40),(472,7,6,1.0000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,16),(473,7,4,0.2500,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,48),(474,7,3,0.1666,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,49),(475,7,4,0.5000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,13),(476,8,9,85.0000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,50),(477,8,10,0.1666,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,51),(478,8,9,40.0000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,52),(479,8,4,1.0000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,1),(480,8,8,1.0000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,53),(481,8,10,0.1666,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,25),(482,8,4,0.2500,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,54),(483,8,8,1.0000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,39),(484,9,10,0.1250,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,55),(485,9,10,0.1250,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,37),(486,9,3,0.1250,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,56),(487,9,4,5.0000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,57),(488,9,4,0.5000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,58),(489,9,4,0.5000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,59),(490,9,4,0.2500,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,61),(491,10,10,0.0833,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,55),(492,10,3,0.0833,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,37),(493,10,10,0.0833,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,25),(494,10,3,0.2500,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,33),(495,10,4,1.0000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,62),(496,10,11,0.5000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,63),(497,10,4,3.0000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,64),(498,11,10,0.1250,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,55),(499,11,10,0.1250,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,37),(500,11,3,0.1250,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,65),(501,11,3,0.5000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,33),(502,11,4,0.1666,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,66),(503,11,3,0.5000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,67),(504,11,6,0.5000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,68),(505,12,3,0.5000,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,69),(506,12,10,0.2500,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,37),(507,12,3,0.1250,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,22),(508,12,3,0.2500,1,1,'2024-04-30 05:09:32',NULL,NULL,NULL,NULL,67),(509,13,4,4.0000,1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(510,13,6,1.0000,1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,4),(511,13,3,1.0000,1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,2),(512,13,4,2.0000,1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,71),(516,14,4,4.0000,1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(517,14,6,1.0000,1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,4),(518,14,3,1.0000,1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,2),(519,14,4,2.0000,1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,72),(523,15,4,4.0000,1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,1),(524,15,6,1.0000,1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,4),(525,15,3,1.0000,1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,2),(526,15,4,2.0000,1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,73),(530,16,4,4.0000,1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,73),(531,16,6,1.0000,1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,4),(532,16,3,1.0000,1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,2),(533,16,4,2.0000,1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,74),(537,17,4,4.0000,1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,52),(538,17,6,1.0000,1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,4),(539,17,3,1.0000,1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,2),(540,17,4,2.0000,1,1,'2024-04-28 02:34:41',NULL,NULL,NULL,NULL,74),(542,2,6,0.2500,1,4,'2024-06-04 17:49:18',NULL,NULL,NULL,NULL,81),(555,13,4,1.0000,1,4,'2024-06-11 16:52:42',NULL,NULL,NULL,NULL,3);
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
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receta_instrucciones`
--

LOCK TABLES `receta_instrucciones` WRITE;
/*!40000 ALTER TABLE `receta_instrucciones` DISABLE KEYS */;
INSERT INTO `receta_instrucciones` VALUES (1,1,'Corta las calabacitas en cuartos',1,1,1,'2024-04-28 02:34:41',4,'2024-06-04 18:44:23',NULL,NULL),(2,1,'Mezcla el huevo con la sal con ajo y cocina hasta que el huevo esté dorado ligeramente',3,1,1,'2024-04-28 02:34:41',4,'2024-06-04 18:44:23',NULL,NULL),(3,1,'Agrega los frijoles con las calabacitas y cocina a fuego bajo por 9 minutos más',4,1,1,'2024-04-28 02:34:41',4,'2024-06-04 18:44:23',NULL,NULL),(4,1,'Sirve y disfruta',5,1,1,'2024-04-28 02:34:41',4,'2024-06-04 18:44:23',NULL,NULL),(9,2,'Mezcla la sal y la pimienta, espolvorea los filetes y cúbrelos con la harina, el huevo y por el pan molido. Calienta el aceite y fríelos por ambos lados, colócalos sobre papel absorbente para retirar el exceso de grasa.',1,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(10,2,'Para la salsa, licúa los jitomates con la cebolla, el ajo y el concentrado de tomate con pollo, agrega el cilantro y mezcla.',2,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(11,2,'Acompaña los filetes con la salsa',3,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(12,3,'En una sartén grande, derrite la mantequilla a fuego medio-alto.',1,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(13,3,'Agrega las pechugas de pollo y cocínalas hasta que estén doradas por ambos lados.',2,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(14,3,'Incorpora las espinacas y los champiñones, y cocina por unos minutos hasta que las espinacas se hayan marchitado.',3,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(15,3,'Agrega el caldo de pollo y la crema de leche, y sazona con sal y pimienta al gusto.',4,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(16,3,'Cocina a fuego lento por unos 10-15 minutos, o hasta que la salsa se haya espesado y el pollo esté completamente cocido.',5,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(17,4,'Mezcla la media crema con la mayonesa, la sal, el jugo de limón, los jitomates, la cebolla, el pepino, el atún, el cilantro y el chile serrano.',1,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(18,4,'Sirve y acompaña con galletas saladas.',2,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(19,5,'Para la salsa, licúa el puré de tomate con el agua, el concentrado de tomate y pollo, media cucharada de el ajo y media cucharada de la cebolla en polvo y los tomates rojos. Fríe la salsa en una cacerola con aceite caliente.',1,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(20,5,'Mezcla la carne con la media cucharada de cebolla en polvo y la media cucharada de ajo en polvo y forma las albóndigas.',2,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(21,5,'Agrega las albóndigas a la salsa que ya preparaste, cocina por 15 minutos y añade la leche evaporada. Sirve el espagueti previamente cocido y escurrido en un refractario y báñala con la salsa.',3,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(22,6,'En un tazón colocar la carne, el ajo en polvo, el caldo de carne de res, la pimienta molida y marinar por 5 minutos.',1,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(23,6,'En una cacerola grande colocar el aceite, la cebolla, el ajo, el apio y sofreír por 2 minutos.',2,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(24,6,'Añadir la carne y cocinar por 10 minutos revolviendo constantemente.',3,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(25,6,'Cuando la carne adquiera una tonalidad gris clara, añadir la salsa de tomate estilo boloñesa, el agua, las hojas de laurel, sal, pimienta y cocinar a fuego medio por 15 minutos.',4,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(26,6,'Al momento de montar la lasaña, untar con un poco de aceite un recipiente refractario o la bandeja que utilice. Colocar una pequeña cantidad de salsa, cubrir el fondo de la bandeja con lascas de pasta precocida, verter una cantidad pequeña de carne, añadir el queso mozzarella y una mínima parte de queso parmesano.',5,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(27,7,'Licúa la mitad del caldo con los jitomates, el ajo y la cebolla; cuela.',1,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(28,7,'Calienta el aceite, fríe el fideo hasta que cambie de color, añade el resto del caldo con lo que licuaste y el brócoli; tapa y cocina a fuego medio de 8 a 10 minutos o hasta que el fideo y el brócoli estén suaves.',2,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(29,7,'Agrega el concentrado de tomate con pollo, mezcla y cocina 2 minutos más. ',3,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(30,8,'Horno precalentado a 180 °C.',1,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(31,8,'Con ayuda de un rodillo, extiende la pasta hojaldre sobre una superficie enharinada y corta cuadros de 15 cm. Coloca un poco de alcachofas y Queso Chihuahua al centro de cada cuadrado, cierra presionando las orillas con un tenedor y barniza con el huevo; colócalas sobre una charola con papel encerado, espolvorea un poco de ajonjolí sobre cada empanada y hornea a 180 °C por 30 minutos.',2,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(32,8,'Para el dip, licua la media crema con el pimiento y la sal con cebolla en polvo. Reserva. ',3,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(33,8,'Acompaña con el dip de pimiento. ',4,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(34,9,'Licúa la Leche condensada con la leche evaporada y sin dejar de licuar, agrega poco a poco el jugo de limón.',1,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(35,9,'En un refractario cuadrado, coloca una capa de galletas, un poco de la mezcla de limón y repite hasta terminar con el resto de los ingredientes. Cubre con plástico adherente y refrigera por 1 hora o hasta que esté firme.',2,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(36,9,'Decora con las rodajas de limón, las galletas troceadas, las hojas de menta y la ralladura de limón.',3,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(37,10,'Licúa la leche evaporada con la leche condensada, la media crema, el agua y 5 mazapanes, con la licuadora encendida agrega poco a poco la grenetina disuelta.',1,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(38,10,'Vierte lo que licuaste en un molde para gelatina engrasado, refrigera hasta que cuaje por completo.',2,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(39,10,'Desmolda, decora con el resto del mazapán y las fresas.',3,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(40,11,'Licúa el arroz con la leche condensada, la leche evaporada, el agua y la canela.',1,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(41,11,'Cuela y sirve en vasos con hielo.',2,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(42,11,'Decora con canela molida.',3,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(43,12,'Licúa la leche evaporada, el jugo de piña y la crema de coco.',1,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(44,12,'Vierte en vasos con un poco de hielo.',2,1,1,'2024-04-30 05:10:22',NULL,NULL,NULL,NULL),(56,13,'Mezcla el huevo con la sal con ajo y cocina hasta que el huevo esté dorado ligeramente',1,1,4,'2024-06-11 17:14:56',4,'2024-06-11 17:16:06',NULL,NULL),(57,13,'Agrega los frijoles con las calabacitas y cocina a fuego bajo por 9 minutos más',2,1,4,'2024-06-11 17:15:48',4,'2024-06-11 17:16:06',NULL,NULL),(58,13,'Sirve y disfruta',3,1,4,'2024-06-11 17:16:06',4,'2024-06-11 17:16:06',NULL,NULL),(59,15,'Asa el chorizo hasta que esté dorado.',1,1,4,'2024-06-11 17:18:22',4,'2024-06-11 17:19:09',NULL,NULL),(60,15,'Mezcla el huevo con la sal con ajo y cocina hasta que el huevo esté dorado ligeramente\n',2,1,4,'2024-06-11 17:18:29',4,'2024-06-11 17:19:09',NULL,NULL),(61,15,'Agrega los frijoles y cocina a fuego bajo por 9 minutos más.',3,1,4,'2024-06-11 17:19:00',4,'2024-06-11 17:19:09',NULL,NULL),(62,15,'Sirve y disfruta',4,1,4,'2024-06-11 17:19:09',4,'2024-06-11 17:19:09',NULL,NULL),(63,16,'Asar el chorizo hasta que esté dorado.',1,1,4,'2024-06-11 17:19:26',4,'2024-06-11 17:20:08',NULL,NULL),(64,16,'Hervir las papas y cortarlas en cuadros.',2,1,4,'2024-06-11 17:19:42',4,'2024-06-11 17:20:08',NULL,NULL),(65,16,'Mezclar las papas con el chorizo.',3,1,4,'2024-06-11 17:19:56',4,'2024-06-11 17:20:08',NULL,NULL),(66,16,'Agregar sal al gusto y disfrutar.',4,1,4,'2024-06-11 17:20:07',4,'2024-06-11 17:20:08',NULL,NULL),(67,17,'Hervir las papas, pelarlas y cortar en cubos.',1,1,4,'2024-06-11 17:20:37',4,'2024-06-11 17:21:22',NULL,NULL),(68,17,'Revolver las papas con el queso y sal al gusto.',2,1,4,'2024-06-11 17:20:58',4,'2024-06-11 17:21:22',NULL,NULL),(69,17,'Agregar frijoles refritos a un lado.',3,1,4,'2024-06-11 17:21:12',4,'2024-06-11 17:21:23',NULL,NULL),(70,17,'Disfrutar',4,1,4,'2024-06-11 17:21:22',4,'2024-06-11 17:21:23',NULL,NULL);
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
  `Fecha_Alta` datetime NOT NULL,
  `Id_Usuario_Modif` int DEFAULT NULL,
  `Fecha_Modif` datetime DEFAULT NULL,
  `Id_Usuario_Baja` int DEFAULT NULL,
  `Fecha_Baja` datetime DEFAULT NULL,
  PRIMARY KEY (`Id_Recetas_Dia`),
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
) ENGINE=InnoDB AUTO_INCREMENT=2314 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recetas_dia`
--

LOCK TABLES `recetas_dia` WRITE;
/*!40000 ALTER TABLE `recetas_dia` DISABLE KEYS */;
INSERT INTO `recetas_dia` VALUES (1,'2024-06-01 19:26:57',5,2,4,1,4,'2024-05-31 20:53:41',4,'2024-06-01 19:47:12',NULL,NULL),(1098,'2024-06-02 12:55:53',NULL,2,6,1,4,'2024-06-02 02:15:01',4,'2024-06-02 13:00:30',4,'2024-06-02 12:57:52'),(1223,'2024-06-03 16:06:50',1,NULL,NULL,1,4,'2024-06-03 16:07:08',4,'2024-06-03 16:34:02',NULL,NULL),(1224,'2024-06-05 16:59:52',NULL,NULL,NULL,1,9,'2024-06-05 16:59:52',NULL,NULL,NULL,NULL),(1225,'2024-06-05 17:09:11',NULL,NULL,NULL,1,4,'2024-06-05 17:12:59',NULL,NULL,NULL,NULL),(1226,'2024-06-05 17:27:38',NULL,3,NULL,1,10,'2024-06-05 17:27:38',10,'2024-06-05 17:27:38',NULL,NULL),(1227,'2024-06-06 20:34:14',NULL,NULL,NULL,1,11,'2024-06-06 20:33:32',11,'2024-06-06 20:34:14',11,'2024-06-06 20:34:20'),(1228,'2024-06-07 17:26:49',NULL,3,NULL,1,4,'2024-06-07 17:26:40',4,'2024-06-07 17:26:49',NULL,NULL),(2307,'2024-06-09 00:00:00',1,2,6,1,4,'2024-06-11 18:45:51',4,'2024-06-11 18:45:51',NULL,NULL),(2308,'2024-06-10 00:00:00',13,3,6,1,4,'2024-06-11 18:45:51',4,'2024-06-11 18:45:52',NULL,NULL),(2309,'2024-06-11 00:00:00',14,4,6,1,4,'2024-06-11 18:45:52',4,'2024-06-11 18:45:52',NULL,NULL),(2310,'2024-06-12 00:00:00',15,5,6,1,4,'2024-06-11 18:45:52',4,'2024-06-11 18:45:52',NULL,NULL),(2311,'2024-06-13 00:00:00',16,7,6,1,4,'2024-06-11 18:45:52',4,'2024-06-11 18:45:52',NULL,NULL),(2312,'2024-06-14 00:00:00',1,8,6,1,4,'2024-06-11 18:45:52',4,'2024-06-11 18:45:52',NULL,NULL),(2313,'2024-06-15 00:00:00',13,2,6,1,4,'2024-06-11 18:45:52',4,'2024-06-11 18:45:53',NULL,NULL);
/*!40000 ALTER TABLE `recetas_dia` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock`
--

LOCK TABLES `stock` WRITE;
/*!40000 ALTER TABLE `stock` DISABLE KEYS */;
INSERT INTO `stock` VALUES (1,1,1,'2024-04-30 08:41:28',NULL,NULL,NULL,NULL),(2,1,1,'2024-04-30 08:41:33',NULL,NULL,NULL,NULL),(3,1,1,'2024-04-30 08:41:42',NULL,NULL,NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=143 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_detalle`
--

LOCK TABLES `stock_detalle` WRITE;
/*!40000 ALTER TABLE `stock_detalle` DISABLE KEYS */;
INSERT INTO `stock_detalle` VALUES (3,9,200,1,1,'2024-04-30 08:52:52',4,'2024-06-03 17:37:43',NULL,NULL,200,0,'2025-01-01 00:00:00',1,76,1),(4,3,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,2,1),(5,4,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,3,1),(6,6,2230,1,1,'2024-04-30 08:52:52',4,'2024-06-06 10:20:47',4,'2024-06-03 14:23:35',2230,0,'2025-01-01 00:00:00',0,4,1),(7,8,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,4,'2024-06-03 19:57:04',2000,0,'2025-01-01 00:00:00',0,5,1),(8,8,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,4,'2024-06-03 14:24:53',2000,0,'2025-01-01 00:00:00',0,5,1),(9,8,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',0,6,1),(10,3,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',0,7,1),(11,4,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,8,1),(12,3,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',0,9,1),(13,4,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,4,'2024-06-03 15:40:25',2000,0,'2025-01-01 00:00:00',1,10,1),(14,4,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,4,'2024-06-03 15:51:11',2000,0,'2025-01-01 00:00:00',1,10,1),(15,4,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,4,'2024-06-03 15:43:09',2000,0,'2025-01-01 00:00:00',1,10,1),(16,4,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,4,'2024-06-03 14:36:50',2000,0,'2025-01-01 00:00:00',1,10,1),(17,4,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,11,1),(18,4,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,12,1),(19,4,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,4,'2024-06-03 14:32:45',2000,0,'2025-01-01 00:00:00',1,12,1),(20,4,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,4,'2024-06-03 14:26:58',2000,0,'2025-01-01 00:00:00',1,12,1),(21,4,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,4,'2024-06-03 15:40:48',2000,0,'2025-01-01 00:00:00',1,13,1),(22,4,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,4,'2024-06-03 15:40:59',2000,0,'2025-01-01 00:00:00',1,13,1),(23,4,2000,1,1,'2024-04-30 08:52:52',4,'2024-06-03 18:13:32',NULL,NULL,2000,0,'2025-01-01 00:00:00',1,13,1),(24,4,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,14,1),(25,4,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,15,1),(26,2,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',0,16,1),(27,6,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,4,'2024-06-03 14:46:14',2000,0,'2025-01-01 00:00:00',0,16,1),(28,6,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,4,'2024-06-03 14:43:11',2000,0,'2025-01-01 00:00:00',0,16,1),(29,4,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,17,1),(30,3,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,18,1),(31,10,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,19,1),(32,6,2100,1,1,'2024-04-30 08:52:52',4,'2024-06-03 19:26:57',NULL,NULL,2100,0,'2025-01-01 00:00:00',1,20,1),(33,3,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,21,1),(34,3,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,4,'2024-06-03 19:25:14',2000,0,'2025-01-01 00:00:00',1,21,1),(35,3,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,22,1),(36,6,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',0,5,1),(37,8,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',0,5,1),(38,6,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',0,24,1),(39,10,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,25,1),(40,10,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,25,1),(41,10,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,25,1),(42,3,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,26,1),(43,4,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,27,1),(44,4,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,28,1),(45,10,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,29,1),(46,4,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,4,'2024-06-03 19:25:39',2000,0,'2025-01-01 00:00:00',1,14,1),(47,4,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,31,1),(48,4,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,32,1),(49,3,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',0,33,1),(50,3,2000,0,1,'2024-04-30 08:52:52',NULL,NULL,4,'2024-06-03 18:54:32',2000,0,'2025-01-01 00:00:00',0,33,1),(51,3,2000,0,1,'2024-04-30 08:52:52',NULL,NULL,4,'2024-06-03 18:54:42',2000,0,'2025-01-01 00:00:00',0,33,1),(53,8,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',0,34,1),(54,8,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',0,34,1),(55,6,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,35,1),(56,9,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,36,1),(57,9,2000,0,1,'2024-04-30 08:52:52',NULL,NULL,4,'2024-06-03 19:25:02',2000,0,'2025-01-01 00:00:00',1,36,1),(58,10,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,37,1),(59,10,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,37,1),(60,3,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,37,1),(61,10,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,37,1),(62,10,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,37,1),(63,4,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,38,1),(64,6,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',0,39,1),(65,8,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',0,39,1),(66,5,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,40,1),(67,4,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,40,1),(68,5,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,41,1),(69,11,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,42,1),(70,4,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',0,43,1),(71,4,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,44,1),(72,3,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,45,1),(73,8,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,24,1),(74,5,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,47,1),(75,4,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,48,1),(76,3,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,49,1),(77,9,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,50,1),(78,10,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,51,1),(79,9,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,52,1),(80,8,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,53,1),(81,4,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,54,1),(82,10,2000,0,1,'2024-04-30 08:52:52',NULL,NULL,4,'2024-06-03 18:07:54',2000,0,'2025-01-01 00:00:00',1,55,1),(83,10,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,55,1),(84,10,2000,0,1,'2024-04-30 08:52:52',NULL,NULL,4,'2024-06-03 18:08:02',2000,0,'2025-01-01 00:00:00',1,55,1),(85,4,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,56,1),(86,3,2000,0,1,'2024-04-30 08:52:52',NULL,NULL,4,'2024-06-03 18:07:48',2000,0,'2025-01-01 00:00:00',1,56,1),(87,4,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,57,1),(88,4,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,58,1),(89,4,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,59,1),(90,3,2000,0,1,'2024-04-30 08:52:52',NULL,NULL,4,'2024-06-03 18:07:34',2000,0,'2025-01-01 00:00:00',1,60,1),(91,3,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,60,1),(92,4,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,61,1),(93,4,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,62,1),(94,11,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',0,63,1),(95,4,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,64,1),(96,3,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,65,1),(97,4,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',0,66,1),(98,3,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',0,67,1),(99,3,2000,0,1,'2024-04-30 08:52:52',NULL,NULL,4,'2024-06-03 18:07:10',2000,0,'2025-01-01 00:00:00',0,67,1),(100,6,2000,0,1,'2024-04-30 08:52:52',NULL,NULL,4,'2024-06-03 18:07:21',2000,0,'2025-01-01 00:00:00',1,68,1),(101,3,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,69,1),(102,3,2000,1,1,'2024-04-30 08:52:52',NULL,NULL,NULL,NULL,2000,0,'2025-01-01 00:00:00',1,70,1),(129,4,2000,1,1,'2024-04-28 02:20:20',NULL,NULL,NULL,NULL,2000,0,'2030-04-28 02:20:20',1,71,1),(130,4,2000,1,1,'2024-04-28 02:20:20',NULL,NULL,NULL,NULL,2000,0,'2030-04-28 02:20:20',1,72,1),(131,4,2000,1,1,'2024-04-28 02:20:20',NULL,NULL,NULL,NULL,2000,0,'2030-04-28 02:20:20',1,73,1),(132,4,2000,1,1,'2024-04-28 02:20:20',NULL,NULL,NULL,NULL,2000,0,'2030-04-28 02:20:20',1,74,1),(133,12,11,0,4,'2024-06-02 18:53:15',4,'2024-06-03 18:03:52',4,'2024-06-03 18:06:47',11,0,'2024-06-03 00:00:00',0,2,NULL),(134,12,2,1,4,'2024-06-02 18:56:04',4,'2024-06-04 01:40:36',NULL,NULL,-1,3,'2024-06-06 00:00:00',0,75,NULL),(135,12,1,0,4,'2024-06-03 16:38:06',NULL,NULL,4,'2024-06-03 19:24:48',1,0,'2025-01-01 00:00:00',0,3,NULL),(136,4,1,1,4,'2024-06-03 19:29:04',NULL,NULL,NULL,NULL,1,0,'2025-01-01 00:00:00',0,78,NULL),(137,12,3,1,4,'2024-06-03 19:29:45',11,'2024-06-06 20:35:11',NULL,NULL,3,0,'2024-07-10 00:00:00',0,11,NULL),(138,12,3,1,4,'2024-06-03 19:36:53',4,'2024-06-03 19:58:14',NULL,NULL,3,0,'2025-02-03 00:00:00',0,65,NULL),(139,1,1,1,4,'2024-06-04 18:39:47',NULL,NULL,NULL,NULL,1,0,'2024-08-08 00:00:00',0,35,NULL),(140,4,2,1,4,'2024-06-06 10:15:55',NULL,NULL,NULL,NULL,2,0,'2025-06-01 00:00:00',0,1,NULL),(141,6,200,1,4,'2024-06-06 10:23:28',NULL,NULL,NULL,NULL,200,0,NULL,1,4,NULL),(142,12,2,1,4,'2024-06-07 17:27:33',NULL,NULL,NULL,NULL,2,0,'2024-07-05 00:00:00',0,10,NULL);
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
  `foto_perfil` VARCHAR(255),
  `Cohabitantes` int NOT NULL DEFAULT (1),
  `Email` varchar(250) DEFAULT NULL,
  `Es_Gmail` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id_Usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

DELIMITER //
CREATE TRIGGER before_insert_usuario
BEFORE INSERT ON `usuario`
FOR EACH ROW
BEGIN
  IF NEW.Email LIKE '%@gmail.com' THEN
    SET NEW.Es_Gmail = 1;
  ELSE
    SET NEW.Es_Gmail = 0;
  END IF;
END;
//
DELIMITER ;



--
-- Dumping data for table `usuario`
--



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
) ENGINE=InnoDB AUTO_INCREMENT=1974 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_cat_alimento`
--

LOCK TABLES `usuario_cat_alimento` WRITE;
/*!40000 ALTER TABLE `usuario_cat_alimento` DISABLE KEYS */;
INSERT INTO `usuario_cat_alimento` VALUES (94,1,1,1),(96,1,2,1),(98,1,3,1),(100,1,4,1),(102,1,5,1),(104,1,6,1),(106,1,7,1),(108,1,8,1),(110,1,9,1),(112,1,10,1),(114,1,11,1),(116,1,12,1),(118,1,13,1),(120,1,14,1),(122,1,15,1),(124,1,16,1),(126,1,17,1),(128,1,18,1),(130,1,19,1),(132,1,20,1),(134,1,21,1),(136,1,22,1),(138,1,24,1),(140,1,25,1),(142,1,26,1),(144,1,27,1),(146,1,28,1),(148,1,29,1),(150,1,31,1),(152,1,32,1),(154,1,33,1),(156,1,34,1),(158,1,35,1),(160,1,36,1),(162,1,37,1),(164,1,38,1),(166,1,39,1),(168,1,40,1),(170,1,41,1),(172,1,42,1),(174,1,43,1),(176,1,44,1),(178,1,45,1),(180,1,47,1),(182,1,48,1),(184,1,49,1),(186,1,50,1),(188,1,51,1),(190,1,52,1),(192,1,53,1),(194,1,54,1),(196,1,55,1),(198,1,56,1),(200,1,57,1),(202,1,58,1),(204,1,59,1),(206,1,60,1),(208,1,61,1),(210,1,62,1),(212,1,63,1),(214,1,64,1),(216,1,65,1),(218,1,66,1),(220,1,67,1),(222,1,68,1),(224,1,69,1),(226,1,70,1),(228,1,71,1),(230,1,72,1),(232,1,73,1),(234,1,74,1),(236,1,75,1),(238,1,76,1),(240,1,78,1),(242,1,80,1),(244,1,81,1),(246,1,82,1),(248,1,83,1),(250,1,84,1),(252,1,85,1),(254,1,86,1),(256,1,87,1),(258,1,88,1),(260,1,89,1),(262,1,90,1),(264,1,91,1),(266,1,92,1),(268,1,93,1),(270,1,94,1),(272,1,95,1),(274,1,96,1),(276,1,97,1),(278,1,98,1),(373,3,1,1),(375,3,2,1),(377,3,3,1),(379,3,4,1),(381,3,5,1),(383,3,6,1),(385,3,7,1),(387,3,8,1),(389,3,9,1),(391,3,10,1),(393,3,11,1),(395,3,12,1),(397,3,13,1),(399,3,14,1),(401,3,15,1),(403,3,16,1),(405,3,17,1),(407,3,18,1),(409,3,19,1),(411,3,20,1),(413,3,21,1),(415,3,22,1),(417,3,24,1),(419,3,25,1),(421,3,26,1),(423,3,27,1),(425,3,28,1),(427,3,29,1),(429,3,31,1),(431,3,32,1),(433,3,33,1),(435,3,34,1),(437,3,35,1),(439,3,36,1),(441,3,37,1),(443,3,38,1),(445,3,39,1),(447,3,40,1),(449,3,41,1),(451,3,42,1),(453,3,43,1),(455,3,44,1),(457,3,45,1),(459,3,47,1),(461,3,48,1),(463,3,49,1),(465,3,50,1),(467,3,51,1),(469,3,52,1),(471,3,53,1),(473,3,54,1),(475,3,55,1),(477,3,56,1),(479,3,57,1),(481,3,58,1),(483,3,59,1),(485,3,60,1),(487,3,61,1),(489,3,62,1),(491,3,63,1),(493,3,64,1),(495,3,65,1),(497,3,66,1),(499,3,67,1),(501,3,68,1),(503,3,69,1),(505,3,70,1),(507,3,71,1),(509,3,72,1),(511,3,73,1),(513,3,74,1),(515,3,75,1),(517,3,76,1),(519,3,78,1),(521,3,80,1),(523,3,81,1),(525,3,82,1),(527,3,83,1),(529,3,84,1),(531,3,85,1),(533,3,86,1),(535,3,87,1),(537,3,88,1),(539,3,89,1),(541,3,90,1),(543,3,91,1),(545,3,92,1),(547,3,93,1),(549,3,94,1),(551,3,95,1),(553,3,96,1),(555,3,97,1),(557,3,98,1),(559,4,1,1),(561,4,2,1),(563,4,3,0),(565,4,4,0),(567,4,5,1),(569,4,6,0),(571,4,7,0),(573,4,8,1),(575,4,9,0),(577,4,10,0),(579,4,11,1),(581,4,12,1),(583,4,13,1),(585,4,14,1),(587,4,15,1),(589,4,16,1),(591,4,17,1),(593,4,18,1),(595,4,19,1),(597,4,20,1),(599,4,21,1),(601,4,22,1),(603,4,24,1),(605,4,25,1),(607,4,26,1),(609,4,27,1),(611,4,28,1),(613,4,29,1),(615,4,31,1),(617,4,32,1),(619,4,33,1),(621,4,34,1),(623,4,35,1),(625,4,36,1),(627,4,37,1),(629,4,38,1),(631,4,39,1),(633,4,40,1),(635,4,41,1),(637,4,42,1),(639,4,43,1),(641,4,44,1),(643,4,45,1),(645,4,47,1),(647,4,48,1),(649,4,49,1),(651,4,50,1),(653,4,51,1),(655,4,52,1),(657,4,53,1),(659,4,54,1),(661,4,55,1),(663,4,56,1),(665,4,57,1),(667,4,58,1),(669,4,59,1),(671,4,60,1),(673,4,61,1),(675,4,62,1),(677,4,63,1),(679,4,64,1),(681,4,65,1),(683,4,66,1),(685,4,67,1),(687,4,68,1),(689,4,69,1),(691,4,70,1),(693,4,71,1),(695,4,72,1),(697,4,73,1),(699,4,74,1),(701,4,75,1),(703,4,76,1),(705,4,78,1),(707,4,80,1),(709,4,81,1),(711,4,82,1),(713,4,83,1),(715,4,84,1),(717,4,85,1),(719,4,86,1),(721,4,87,1),(723,4,88,1),(725,4,89,1),(727,4,90,1),(729,4,91,1),(731,4,92,1),(733,4,93,1),(735,4,94,1),(737,4,95,1),(739,4,96,1),(741,4,97,1),(743,4,98,1),(745,5,1,1),(747,5,2,1),(749,5,3,1),(751,5,4,1),(753,5,5,1),(755,5,6,1),(757,5,7,1),(759,5,8,1),(761,5,9,1),(763,5,10,1),(765,5,11,1),(767,5,12,1),(769,5,13,1),(771,5,14,1),(773,5,15,1),(775,5,16,1),(777,5,17,1),(779,5,18,1),(781,5,19,1),(783,5,20,1),(785,5,21,1),(787,5,22,1),(789,5,24,1),(791,5,25,1),(793,5,26,1),(795,5,27,1),(797,5,28,1),(799,5,29,1),(801,5,31,1),(803,5,32,1),(805,5,33,1),(807,5,34,1),(809,5,35,1),(811,5,36,1),(813,5,37,1),(815,5,38,1),(817,5,39,1),(819,5,40,1),(821,5,41,1),(823,5,42,1),(825,5,43,1),(827,5,44,1),(829,5,45,1),(831,5,47,1),(833,5,48,1),(835,5,49,1),(837,5,50,1),(839,5,51,1),(841,5,52,1),(843,5,53,1),(845,5,54,1),(847,5,55,1),(849,5,56,1),(851,5,57,1),(853,5,58,1),(855,5,59,1),(857,5,60,1),(859,5,61,1),(861,5,62,1),(863,5,63,1),(865,5,64,1),(867,5,65,1),(869,5,66,1),(871,5,67,1),(873,5,68,1),(875,5,69,1),(877,5,70,1),(879,5,71,1),(881,5,72,1),(883,5,73,1),(885,5,74,1),(887,5,75,1),(889,5,76,1),(891,5,78,1),(893,5,80,1),(895,5,81,1),(897,5,82,1),(899,5,83,1),(901,5,84,1),(903,5,85,1),(905,5,86,1),(907,5,87,1),(909,5,88,1),(911,5,89,1),(913,5,90,1),(915,5,91,1),(917,5,92,1),(919,5,93,1),(921,5,94,1),(923,5,95,1),(925,5,96,1),(927,5,97,1),(929,5,98,1),(931,6,1,1),(933,6,2,1),(935,6,3,1),(937,6,4,1),(939,6,5,1),(941,6,6,1),(943,6,7,1),(945,6,8,1),(947,6,9,1),(949,6,10,1),(951,6,11,1),(953,6,12,1),(955,6,13,1),(957,6,14,1),(959,6,15,1),(961,6,16,1),(963,6,17,1),(965,6,18,1),(967,6,19,1),(969,6,20,1),(971,6,21,1),(973,6,22,1),(975,6,24,1),(977,6,25,1),(979,6,26,1),(981,6,27,1),(983,6,28,1),(985,6,29,1),(987,6,31,1),(989,6,32,1),(991,6,33,1),(993,6,34,1),(995,6,35,1),(997,6,36,1),(999,6,37,1),(1001,6,38,1),(1003,6,39,1),(1005,6,40,1),(1007,6,41,1),(1009,6,42,1),(1011,6,43,1),(1013,6,44,1),(1015,6,45,1),(1017,6,47,1),(1019,6,48,1),(1021,6,49,1),(1023,6,50,1),(1025,6,51,1),(1027,6,52,1),(1029,6,53,1),(1031,6,54,1),(1033,6,55,1),(1035,6,56,1),(1037,6,57,1),(1039,6,58,1),(1041,6,59,1),(1043,6,60,1),(1045,6,61,1),(1047,6,62,1),(1049,6,63,1),(1051,6,64,1),(1053,6,65,1),(1055,6,66,1),(1057,6,67,1),(1059,6,68,1),(1061,6,69,1),(1063,6,70,1),(1065,6,71,1),(1067,6,72,1),(1069,6,73,1),(1071,6,74,1),(1073,6,75,1),(1075,6,76,1),(1077,6,78,1),(1079,6,80,1),(1081,6,81,1),(1083,6,82,1),(1085,6,83,1),(1087,6,84,1),(1089,6,85,1),(1091,6,86,1),(1093,6,87,1),(1095,6,88,1),(1097,6,89,1),(1099,6,90,1),(1101,6,91,1),(1103,6,92,1),(1105,6,93,1),(1107,6,94,1),(1109,6,95,1),(1111,6,96,1),(1113,6,97,1),(1115,6,98,1),(1117,7,1,1),(1119,7,2,1),(1121,7,3,1),(1123,7,4,1),(1125,7,5,1),(1127,7,6,1),(1129,7,7,1),(1131,7,8,1),(1133,7,9,1),(1135,7,10,1),(1137,7,11,1),(1139,7,12,1),(1141,7,13,1),(1143,7,14,1),(1145,7,15,1),(1147,7,16,1),(1149,7,17,1),(1151,7,18,1),(1153,7,19,1),(1155,7,20,1),(1177,7,21,1),(1179,7,22,1),(1181,7,24,1),(1183,7,25,1),(1185,7,26,1),(1187,7,27,1),(1189,7,28,1),(1191,7,29,1),(1193,7,31,1),(1195,7,32,1),(1197,7,33,1),(1199,7,34,1),(1201,7,35,1),(1203,7,36,1),(1205,7,37,1),(1207,7,38,1),(1209,7,39,1),(1211,7,40,1),(1213,7,41,1),(1215,7,42,1),(1217,7,43,1),(1219,7,44,1),(1221,7,45,1),(1223,7,47,1),(1225,7,48,1),(1227,7,49,1),(1229,7,50,1),(1231,7,51,1),(1233,7,52,1),(1235,7,53,1),(1237,7,54,1),(1239,7,55,1),(1241,7,56,1),(1243,7,57,1),(1245,7,58,1),(1247,7,59,1),(1249,7,60,1),(1251,7,61,1),(1253,7,62,1),(1255,7,63,1),(1257,7,64,1),(1259,7,65,1),(1261,7,66,1),(1263,7,67,1),(1265,7,68,1),(1267,7,69,1),(1269,7,70,1),(1271,7,71,1),(1273,7,72,1),(1275,7,73,1),(1277,7,74,1),(1279,7,75,1),(1281,7,76,1),(1283,7,78,1),(1285,7,80,1),(1287,7,81,1),(1289,7,82,1),(1291,7,83,1),(1293,7,84,1),(1295,7,85,1),(1297,7,86,1),(1299,7,87,1),(1301,7,88,1),(1303,7,89,1),(1305,7,90,1),(1307,7,91,1),(1309,7,92,1),(1311,7,93,1),(1313,7,94,1),(1315,7,95,1),(1317,7,96,1),(1319,7,97,1),(1321,7,98,1),(1323,8,1,1),(1325,8,2,1),(1327,8,3,1),(1329,8,4,1),(1331,8,5,1),(1333,8,6,1),(1335,8,7,1),(1337,8,8,1),(1339,8,9,1),(1341,8,10,1),(1343,8,11,1),(1345,8,12,1),(1347,8,13,1),(1349,8,14,1),(1351,8,15,1),(1353,8,16,1),(1355,8,17,1),(1357,8,18,1),(1359,8,19,1),(1361,8,20,1),(1363,8,21,1),(1365,8,22,1),(1367,8,24,1),(1369,8,25,1),(1371,8,26,1),(1373,8,27,1),(1375,8,28,1),(1377,8,29,1),(1379,8,31,1),(1381,8,32,1),(1383,8,33,1),(1385,8,34,1),(1387,8,35,1),(1389,8,36,1),(1391,8,37,1),(1393,8,38,1),(1395,8,39,1),(1397,8,40,1),(1399,8,41,1),(1401,8,42,1),(1403,8,43,1),(1405,8,44,1),(1407,8,45,1),(1409,8,47,1),(1411,8,48,1),(1413,8,49,1),(1415,8,50,1),(1417,8,51,1),(1419,8,52,1),(1421,8,53,1),(1423,8,54,1),(1425,8,55,1),(1427,8,56,1),(1429,8,57,1),(1431,8,58,1),(1433,8,59,1),(1435,8,60,1),(1437,8,61,1),(1439,8,62,1),(1441,8,63,1),(1443,8,64,1),(1445,8,65,1),(1447,8,66,1),(1449,8,67,1),(1451,8,68,1),(1453,8,69,1),(1455,8,70,1),(1457,8,71,1),(1459,8,72,1),(1461,8,73,1),(1463,8,74,1),(1465,8,75,1),(1467,8,76,1),(1469,8,78,1),(1471,8,80,1),(1473,8,81,1),(1475,8,82,1),(1477,8,83,1),(1479,8,84,1),(1481,8,85,1),(1483,8,86,1),(1485,8,87,1),(1487,8,88,1),(1489,8,89,1),(1491,8,90,1),(1493,8,91,1),(1495,8,92,1),(1497,8,93,1),(1499,8,94,1),(1501,8,95,1),(1503,8,96,1),(1505,8,97,1),(1507,8,98,1),(1509,9,1,1),(1511,9,2,1),(1513,9,3,1),(1515,9,4,1),(1517,9,5,1),(1519,9,6,1),(1521,9,7,1),(1523,9,8,1),(1525,9,9,1),(1527,9,10,1),(1529,9,11,1),(1531,9,12,1),(1533,9,13,1),(1535,9,14,1),(1537,9,15,1),(1539,9,16,1),(1541,9,17,1),(1543,9,18,1),(1545,9,19,1),(1547,9,20,1),(1549,9,21,1),(1551,9,22,1),(1553,9,24,1),(1555,9,25,1),(1557,9,26,1),(1559,9,27,1),(1561,9,28,1),(1563,9,29,1),(1565,9,31,1),(1567,9,32,1),(1569,9,33,1),(1571,9,34,1),(1573,9,35,1),(1575,9,36,1),(1577,9,37,1),(1579,9,38,1),(1581,9,39,1),(1583,9,40,1),(1585,9,41,1),(1587,9,42,1),(1589,9,43,1),(1591,9,44,1),(1593,9,45,1),(1595,9,47,1),(1597,9,48,1),(1599,9,49,1),(1601,9,50,1),(1603,9,51,1),(1605,9,52,1),(1607,9,53,1),(1609,9,54,1),(1611,9,55,1),(1613,9,56,1),(1615,9,57,1),(1617,9,58,1),(1619,9,59,1),(1621,9,60,1),(1623,9,61,1),(1625,9,62,1),(1627,9,63,1),(1629,9,64,1),(1631,9,65,1),(1633,9,66,1),(1635,9,67,1),(1637,9,68,1),(1639,9,69,1),(1641,9,70,1),(1643,9,71,1),(1645,9,72,1),(1647,9,73,1),(1649,9,74,1),(1651,9,75,1),(1653,9,76,1),(1655,9,78,1),(1657,9,80,1),(1659,9,81,1),(1661,9,82,1),(1663,9,83,1),(1665,9,84,1),(1667,9,85,1),(1669,9,86,1),(1671,9,87,1),(1673,9,88,1),(1675,9,89,1),(1677,9,90,1),(1679,9,91,1),(1681,9,92,1),(1683,9,93,1),(1685,9,94,1),(1687,9,95,1),(1689,9,96,1),(1691,9,97,1),(1693,9,98,1),(1695,10,1,1),(1697,10,2,1),(1699,10,3,1),(1701,10,4,1),(1703,10,5,1),(1705,10,6,1),(1707,10,7,1),(1709,10,8,1),(1711,10,9,1),(1713,10,10,1),(1715,10,11,1),(1717,10,12,1),(1719,10,13,1),(1721,10,14,1),(1723,10,15,1),(1725,10,16,1),(1727,10,17,1),(1729,10,18,1),(1731,10,19,1),(1733,10,20,1),(1735,10,21,1),(1737,10,22,1),(1739,10,24,1),(1741,10,25,1),(1743,10,26,1),(1745,10,27,1),(1747,10,28,1),(1749,10,29,1),(1751,10,31,1),(1753,10,32,1),(1755,10,33,1),(1757,10,34,1),(1759,10,35,1),(1761,10,36,1),(1763,10,37,1),(1765,10,38,1),(1767,10,39,1),(1769,10,40,1),(1771,10,41,1),(1773,10,42,1),(1775,10,43,1),(1777,10,44,1),(1779,10,45,1),(1781,10,47,1),(1783,10,48,1),(1785,10,49,1),(1787,10,50,1),(1789,10,51,1),(1791,10,52,1),(1793,10,53,1),(1795,10,54,1),(1797,10,55,1),(1799,10,56,1),(1801,10,57,1),(1803,10,58,1),(1805,10,59,1),(1807,10,60,1),(1809,10,61,1),(1811,10,62,1),(1813,10,63,1),(1815,10,64,1),(1817,10,65,1),(1819,10,66,1),(1821,10,67,1),(1823,10,68,1),(1825,10,69,1),(1827,10,70,1),(1829,10,71,1),(1831,10,72,1),(1833,10,73,1),(1835,10,74,1),(1837,10,75,1),(1839,10,76,1),(1841,10,78,1),(1843,10,80,1),(1845,10,81,1),(1847,10,82,1),(1849,10,83,1),(1851,10,84,1),(1853,10,85,1),(1855,10,86,1),(1857,10,87,1),(1859,10,88,1),(1861,10,89,1),(1863,10,90,1),(1865,10,91,1),(1867,10,92,1),(1869,10,93,1),(1871,10,94,1),(1873,10,95,1),(1875,10,96,1),(1877,10,97,1),(1879,10,98,1);
/*!40000 ALTER TABLE `usuario_cat_alimento` ENABLE KEYS */;
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
/*!50001 VIEW `vw_receta_detalle_disponible` AS select `rd`.`Id_Receta` AS `Id_Receta`,`rd`.`Id_Unidad_Medida` AS `Id_Unidad_Medida`,`rd`.`Id_Alimento` AS `Id_Alimento`,`vwsd`.`Alimento` AS `Alimento`,`vwsd`.`Unidad_Medida` AS `Unidad_Medida`,`rd`.`Cantidad` AS `Cantidad_Receta`,`uca`.`Id_Usuario` AS `Id_Usuario`,`uca`.`Puede_Comer` AS `Puede_Comer` from ((`receta_detalle` `rd` join `vw_stock_detalle` `vwsd` on((`vwsd`.`Id_Alimento` = `rd`.`Id_Alimento`))) join `usuario_cat_alimento` `uca` on((`uca`.`Id_Alimento` = `rd`.`Id_Alimento`))) */;
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
/*!50001 VIEW `vw_stock_detalle` AS select `sd`.`Id_Stock_Detalle` AS `Id_Stock_Detalle`,`sd`.`Id_Alimento` AS `Id_Alimento`,`sd`.`Id_Unidad_Medida` AS `Id_Unidad_Medida`,`sd`.`Cantidad` AS `Cantidad`,`sd`.`Activo` AS `Activo`,`sd`.`Total` AS `Total`,`sd`.`Cantidad_Consumida` AS `Cantidad_Consumida`,`sd`.`Fecha_Caducidad` AS `Fecha_Caducidad`,`sd`.`Es_Perecedero` AS `Es_Perecedero`,`ca`.`Alimento` AS `Alimento`,`cta`.`Tipo_Alimento` AS `Tipo_Alimento`,`cu`.`Unidad_Medida` AS `Unidad_Medida`,`cu`.`Abreviatura` AS `Abreviatura` from (((`stock_detalle` `sd` join `cat_alimento` `ca` on((`ca`.`Id_Alimento` = `sd`.`Id_Alimento`))) join `cat_tipo_alimento` `cta` on((`cta`.`Id_Tipo_Alimento` = `ca`.`Id_Tipo_Alimento`))) join `cat_unidad_medida` `cu` on((`cu`.`Id_Unidad_Medida` = `sd`.`Id_Unidad_Medida`))) where ((`sd`.`Activo` = true) and (`sd`.`Total` > 0) and (((`sd`.`Fecha_Caducidad` > now()) and (`sd`.`Es_Perecedero` = 1)) or (`sd`.`Es_Perecedero` = 0))) */;
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

-- Dump completed on 2024-10-16 10:28:47
