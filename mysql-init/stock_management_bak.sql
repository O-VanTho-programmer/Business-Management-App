-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: stock_management
-- ------------------------------------------------------
-- Server version	8.0.38

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `category_id` varchar(5) NOT NULL,
  `category_name` varchar(45) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES ('796R0','Plastic Bag',NULL),('ALL','All',NULL),('CAT01','Fruit','Fresh and organic fruits.'),('CAT02','Vegetables','Fresh and organic vegetables.'),('CAT03','Dairy','Milk, cheese, yogurt, and other dairy products.'),('CAT04','Bakery','Freshly baked bread, pastries, and cakes.'),('CAT05','Beverages','Drinks including coffee, tea, and juices.'),('CAT06','Pantry','Dry goods, canned foods, and cooking essentials.'),('NH6PY','Protein',NULL);
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discount`
--

DROP TABLE IF EXISTS `discount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discount` (
  `discount_id` varchar(25) NOT NULL,
  `name` varchar(45) NOT NULL DEFAULT 'DISCOUNT',
  `description` text,
  `type` enum('PERCENTAGE','FIXED_AMOUNT') NOT NULL DEFAULT 'PERCENTAGE',
  `value` decimal(3,0) NOT NULL DEFAULT '5',
  `discount_limit` decimal(5,0) DEFAULT NULL,
  `order_minimum` decimal(10,0) DEFAULT NULL,
  `status` enum('ACTIVE','IN_ACTIVE') NOT NULL DEFAULT 'IN_ACTIVE',
  `start_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `end_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `usage_limit` int NOT NULL,
  `used` int DEFAULT '0',
  PRIMARY KEY (`discount_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discount`
--

LOCK TABLES `discount` WRITE;
/*!40000 ALTER TABLE `discount` DISABLE KEYS */;
INSERT INTO `discount` VALUES ('6I1EL01W','AUG_DISCOUNT','','PERCENTAGE',20,5,1,'ACTIVE','2025-08-06 13:00:00','2025-08-30 05:00:00',10,0);
/*!40000 ALTER TABLE `discount` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discount_apply`
--

DROP TABLE IF EXISTS `discount_apply`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discount_apply` (
  `id` int NOT NULL AUTO_INCREMENT,
  `discount_id` varchar(25) NOT NULL,
  `product_id` varchar(5) DEFAULT NULL,
  `category_id` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_discount_apply_idx` (`discount_id`),
  KEY `fk_product_apply_idx` (`category_id`),
  KEY `fk_product_apply` (`product_id`),
  CONSTRAINT `fk_category_apply` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`),
  CONSTRAINT `fk_discount_apply` FOREIGN KEY (`discount_id`) REFERENCES `discount` (`discount_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_product_apply` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discount_apply`
--

LOCK TABLES `discount_apply` WRITE;
/*!40000 ALTER TABLE `discount_apply` DISABLE KEYS */;
INSERT INTO `discount_apply` VALUES (22,'6I1EL01W',NULL,'NH6PY'),(23,'6I1EL01W',NULL,'CAT03'),(24,'6I1EL01W',NULL,'CAT02'),(25,'6I1EL01W','PRO05',NULL),(26,'6I1EL01W','WUFZT',NULL),(27,'6I1EL01W','PRO01',NULL),(28,'6I1EL01W','PRO07',NULL);
/*!40000 ALTER TABLE `discount_apply` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_transaction`
--

DROP TABLE IF EXISTS `inventory_transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_transaction` (
  `inventory_transaction_id` int NOT NULL AUTO_INCREMENT,
  `type` enum('RESTOCK','SALE','RETURN') NOT NULL,
  `quantity` int NOT NULL DEFAULT '0',
  `previous_quantity` int NOT NULL,
  `new_quantity` int NOT NULL,
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `product_id` varchar(5) NOT NULL,
  `user_id` varchar(10) NOT NULL,
  `trans_id` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`inventory_transaction_id`),
  KEY `fk_trans_product_idx` (`product_id`),
  KEY `fk_trans_user_idx` (`user_id`),
  KEY `fk_inventory_trans_idx` (`trans_id`),
  CONSTRAINT `fk_trans_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`),
  CONSTRAINT `fk_trans_sale` FOREIGN KEY (`trans_id`) REFERENCES `sale_transaction` (`transaction_id`),
  CONSTRAINT `fk_trans_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_transaction`
--

LOCK TABLES `inventory_transaction` WRITE;
/*!40000 ALTER TABLE `inventory_transaction` DISABLE KEYS */;
INSERT INTO `inventory_transaction` VALUES (3,'RESTOCK',1,9,10,'2025-06-30 06:38:47','PRO04','U123','IYHKK'),(4,'SALE',10,10,0,'2025-06-30 07:13:51','PRO04','U123','L1HZK'),(5,'SALE',1,10,9,'2025-06-30 07:13:51','PRO10','U123','L1HZK'),(6,'SALE',1,15,14,'2025-06-30 07:13:51','PRO02','U123','L1HZK'),(7,'SALE',20,30,10,'2025-08-10 07:36:32','PRO07','U123','FIDT3'),(8,'SALE',1,45,44,'2025-08-10 07:36:32','PRO03','U123','FIDT3');
/*!40000 ALTER TABLE `inventory_transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `product_id` varchar(5) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity_in_stock` int NOT NULL DEFAULT '0',
  `unit` varchar(20) DEFAULT NULL,
  `price` decimal(10,0) NOT NULL DEFAULT '0',
  `cost` decimal(10,0) NOT NULL DEFAULT '0',
  `ROP` int DEFAULT '0',
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `category_id` varchar(5) NOT NULL DEFAULT 'ALL',
  PRIMARY KEY (`product_id`),
  KEY `fk_product_category_idx` (`category_id`),
  CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES ('JT33R','Máy điều hòa treo tường hiên Erivo V15CR32',16,'unit',1,6300000,0,'2025-07-22 08:45:26','2025-07-22 08:54:44','ALL'),('PRO01','Organic Apples (Red)',150,'pcs',2,1,50,'2024-01-10 01:00:00','2025-06-14 03:00:00','CAT01'),('PRO02','Premium Coffee Beans',14,'bags',13,8,20,'2024-02-15 02:30:00','2025-06-14 04:30:00','CAT05'),('PRO03','Whole Wheat Bread',44,'loaves',3,2,15,'2024-03-01 07:00:00','2025-08-10 07:36:32','CAT04'),('PRO04','Artisan Cheese (Cheddar)',0,'blocks',9,4,11,'2024-04-20 04:00:00','2025-06-13 07:45:00','CAT03'),('PRO05','Organic Milk (1 Gallon)',20,'gallons',5,3,10,'2024-05-05 03:00:00','2025-06-12 09:00:00','CAT03'),('PRO06','Fresh Eggs (Large)',25,'dozens',4,3,8,'2024-06-01 01:00:00','2025-06-11 01:00:00','CAT03'),('PRO07','Avocado (Haas)',10,'pcs',2,1,10,'2024-07-10 05:00:00','2025-08-10 07:36:32','CAT01'),('PRO08','Canned Tomatoes (Diced)',200,'cans',1,1,50,'2024-08-01 02:00:00','2025-06-10 02:00:00','CAT06'),('PRO09','Spinach (Organic)',60,'bags',4,2,20,'2024-09-05 08:00:00','2025-06-09 07:00:00','CAT02'),('PRO10','Ground Beef (Lean)',9,'lbs',7,4,5,'2024-10-12 03:00:00','2025-06-08 03:00:00','CAT06'),('WUFZT','Chicken Breast (Skinless)',100,'bags',150,100,NULL,'2025-07-09 03:05:41','2025-07-09 03:05:41','CAT06');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sale_transaction`
--

DROP TABLE IF EXISTS `sale_transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sale_transaction` (
  `transaction_id` varchar(5) NOT NULL,
  `user_id` varchar(10) NOT NULL,
  `total_amount` decimal(10,0) NOT NULL DEFAULT '0',
  `type` enum('ORDER','SELL') DEFAULT NULL,
  `trans_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `customer` varchar(45) DEFAULT '"Unknown"',
  PRIMARY KEY (`transaction_id`),
  KEY `fk_rt_user_idx` (`user_id`),
  CONSTRAINT `fk_transale_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sale_transaction`
--

LOCK TABLES `sale_transaction` WRITE;
/*!40000 ALTER TABLE `sale_transaction` DISABLE KEYS */;
INSERT INTO `sale_transaction` VALUES ('1QKNN','U123',25200000,'ORDER','2025-07-22 08:54:44','\"Unknown\"'),('FIDT3','U123',43,'SELL','2025-08-10 07:36:32',''),('IYHKK','U123',9,'ORDER','2025-06-30 06:38:47','Unknown'),('KH7ET','U123',25200000,'ORDER','2025-07-22 08:52:08','\"Unknown\"'),('L1HZK','U123',110,'SELL','2025-06-30 07:13:51','Binh'),('MRYA2','U123',89800000,'ORDER','2025-07-22 08:52:46','\"Unknown\"');
/*!40000 ALTER TABLE `sale_transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction_product`
--

DROP TABLE IF EXISTS `transaction_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_product` (
  `transaction_product_id` int NOT NULL AUTO_INCREMENT,
  `transaction_id` varchar(5) NOT NULL,
  `product_id` varchar(5) NOT NULL,
  `change_quantity` int NOT NULL,
  `price_at_trans` decimal(10,0) NOT NULL,
  `discounted_price` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`transaction_product_id`),
  KEY `fk_order_product_idx` (`product_id`),
  KEY `fk_order_idx` (`transaction_id`),
  CONSTRAINT `fk_order_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_trans` FOREIGN KEY (`transaction_id`) REFERENCES `sale_transaction` (`transaction_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction_product`
--

LOCK TABLES `transaction_product` WRITE;
/*!40000 ALTER TABLE `transaction_product` DISABLE KEYS */;
INSERT INTO `transaction_product` VALUES (6,'IYHKK','PRO04',1,9,NULL),(7,'L1HZK','PRO04',10,9,NULL),(8,'L1HZK','PRO10',1,7,NULL),(9,'L1HZK','PRO02',1,13,NULL),(11,'KH7ET','JT33R',4,6300000,NULL),(12,'MRYA2','JT33R',4,6300000,NULL),(13,'1QKNN','JT33R',4,6300000,NULL),(14,'FIDT3','PRO07',20,2,NULL),(15,'FIDT3','PRO03',1,3,NULL);
/*!40000 ALTER TABLE `transaction_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` varchar(10) NOT NULL,
  `username` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `role` enum('EMPLOYEE','OWNER') DEFAULT NULL,
  `hash_password` varchar(255) NOT NULL DEFAULT '123',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('SXA117HZ46','Van Binh','vanbinh@gmail.com','EMPLOYEE','$2b$10$uhpgMCTCLzxqLN76atQHDuvOcG04sUIPWN..NIioMXmSMqgX4Wd5u'),('U123','Van Tho','vantho@gmail.com','OWNER','123');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-17 12:37:17
