-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: 172.22.0.2    Database: crm
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `apartments`
--

DROP TABLE IF EXISTS `apartments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `apartments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `building_id` bigint unsigned NOT NULL,
  `block_id` bigint unsigned NOT NULL,
  `floor_id` bigint unsigned NOT NULL,
  `number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','active','reserved','sold') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `reserved_at` date DEFAULT NULL,
  `sold_at` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parent_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `square_meter` double NOT NULL,
  `rooms` smallint NOT NULL,
  `old_status` enum('pending','active','reserved','sold') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `duplex` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `apartments_building_id_number_unique` (`building_id`,`number`),
  KEY `apartments_block_id_foreign` (`block_id`),
  KEY `apartments_floor_id_foreign` (`floor_id`),
  CONSTRAINT `apartments_block_id_foreign` FOREIGN KEY (`block_id`) REFERENCES `blocks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `apartments_building_id_foreign` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `apartments_floor_id_foreign` FOREIGN KEY (`floor_id`) REFERENCES `floors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=136 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apartments`
--

LOCK TABLES `apartments` WRITE;
/*!40000 ALTER TABLE `apartments` DISABLE KEYS */;
INSERT INTO `apartments` VALUES (1,1,22,6,'1','reserved',NULL,NULL,'2025-09-04 15:01:04','2025-09-08 10:54:31','/buildings/1/apartments/1/58a3dca7-467e-4dda-a84e-4bae900b81b3.png','/buildings/1/apartments/1/3be059c2-fec8-4b9e-a677-778927522d65.webp',56,2,NULL,0),(2,1,22,6,'2','active',NULL,NULL,'2025-09-04 15:02:52','2025-09-04 15:07:03','/buildings/1/apartments/2/8f5bf84f-7a5f-4dcf-9c73-b234be85708a.png','/buildings/1/apartments/2/e8ebc9de-a0c8-469b-a1a6-9e37d01ce0cb.webp',51,2,NULL,0),(3,1,22,6,'3','active',NULL,NULL,'2025-09-05 13:08:16','2025-09-05 13:08:19','/buildings/1/apartments/3/f7a2006b-60dd-4df5-91d9-3616e0295d49.png','/buildings/1/apartments/3/eec9eb0f-5b99-4fc3-9f1d-bb25f25d2857.jpg',46,2,NULL,0),(4,1,22,6,'4','active',NULL,NULL,'2025-09-05 13:10:06','2025-09-05 13:10:08','/buildings/1/apartments/4/3cee3f1f-151c-48b2-a9ae-38d56f71c113.png','/buildings/1/apartments/4/f578ce96-5af5-4f24-8096-cbe13af47945.jpg',76,3,NULL,0),(5,1,22,6,'5','active',NULL,NULL,'2025-09-05 13:11:49','2025-09-05 13:11:50','/buildings/1/apartments/5/284c16e8-be00-473b-8e9c-6fd3ce30929d.png','/buildings/1/apartments/5/5f986057-100c-4bb5-a023-a15b8be0b1b9.jpg',55,2,NULL,0),(6,1,22,6,'6','active',NULL,NULL,'2025-09-05 13:15:40','2025-09-05 13:15:41','/buildings/1/apartments/6/ea707fc3-567a-4690-a0f4-bedb0e8771ce.jpg','/buildings/1/apartments/6/40132874-a8e3-49d8-a5c7-c750e4e4d412.jpg',84,3,NULL,0),(7,1,22,6,'8','active',NULL,NULL,'2025-09-05 13:17:38','2025-09-05 13:17:41','/buildings/1/apartments/8/4642041e-3121-4d22-8d59-1c3a99aeb8fb.png','/buildings/1/apartments/8/7c9e9d9f-1ca2-423c-88aa-b2e26675d25f.jpg',62.4,2,NULL,0),(8,1,22,6,'9','active',NULL,NULL,'2025-09-05 13:19:17','2025-09-05 13:22:14','/buildings/1/apartments/9/12b4e3c1-5cfd-4410-bc1c-1d3ef70904af.jpg','/buildings/1/apartments/9/6d73bbb7-2503-46af-8f0b-011534e6517e.jpg',58,2,NULL,0),(9,1,22,6,'10','active',NULL,NULL,'2025-09-05 13:22:12','2025-09-05 13:22:16','/buildings/1/apartments/10/81d136cb-3e07-44de-9652-cd710c8a817a.jpg','/buildings/1/apartments/10/cda54bcd-2fd8-4200-9032-138ca7f3ab41.jpg',55,2,NULL,0),(13,1,23,6,'10ա','active',NULL,NULL,'2025-09-05 13:28:05','2025-09-05 14:04:25','/buildings/1/apartments/10ա/4dbfe2c2-379f-4ce3-a850-4e35e2f14054.jpg','/buildings/1/apartments/10ա/0a4f44f7-dd16-4d5f-8f7b-e7c04a03dee7.jpg',62,2,NULL,0),(14,1,22,6,'11','active',NULL,NULL,'2025-09-05 13:29:45','2025-09-05 14:04:26','/buildings/1/apartments/11/df73445c-6111-450b-8c1b-22be47a993b8.png','/buildings/1/apartments/11/daa95c11-58f0-45d2-a31c-2535e1bb4b61.jpg',63.7,2,NULL,0),(15,1,22,6,'12','reserved',NULL,NULL,'2025-09-05 13:31:09','2025-09-08 10:55:11','/buildings/1/apartments/12/20ce228b-94dd-45a2-b002-0d0a69e28758.png','/buildings/1/apartments/12/da8c808f-354a-4960-8efc-4510b034eb1a.jpg',89.1,4,NULL,0),(16,1,22,6,'13','active',NULL,NULL,'2025-09-05 13:32:11','2025-09-05 14:04:28','/buildings/1/apartments/13/2c549570-d4cc-4bbd-b1ac-3b0d3b2e5423.png','/buildings/1/apartments/13/c8011e1c-3cc2-45f2-8802-2cd3516ccd38.jpg',49.1,2,NULL,0),(17,1,22,6,'14','active',NULL,NULL,'2025-09-05 13:34:54','2025-09-05 14:04:29','/buildings/1/apartments/14/0e34d52a-c822-4240-8fa9-785c93fdd2b3.jpg','/buildings/1/apartments/14/6b98694d-e2f3-4e18-b60b-0bd7c8ed6443.jpg',56,2,NULL,0),(18,1,22,6,'14ա','active',NULL,NULL,'2025-09-05 13:37:24','2025-09-05 14:04:30','/buildings/1/apartments/14ա/f3841ef8-80d3-4b35-858d-001ce26f8d37.jpg','/buildings/1/apartments/14ա/feb6a93f-d1b2-4d7a-a05c-4a94454241e9.jpg',46,2,NULL,0),(19,1,22,6,'15','active',NULL,NULL,'2025-09-05 13:39:36','2025-09-05 14:04:37','/buildings/1/apartments/15/2a914f9b-7158-41b3-b26d-7e79d0173cac.jpg','/buildings/1/apartments/15/4f13ed00-493b-4b60-9beb-61774bd4eef5.jpg',46.6,2,NULL,0),(20,1,22,6,'15ա','active',NULL,NULL,'2025-09-05 13:40:44','2025-09-05 14:04:39','/buildings/1/apartments/15ա/3d00db90-d4e2-4cd3-a704-66c340595650.jpg','/buildings/1/apartments/15ա/715b22c9-8950-45e1-8a4a-7bacaaba8530.jpg',51.5,2,NULL,0),(21,1,22,6,'16','active',NULL,NULL,'2025-09-05 13:42:17','2025-09-05 14:05:25','/buildings/1/apartments/16/bb3bee0a-dfa8-4848-9493-a9a536d48441.jpg','/buildings/1/apartments/16/b5f9b847-416d-4251-ad42-3849be93158d.jpg',51.5,2,NULL,0),(22,1,22,6,'16ա','active',NULL,NULL,'2025-09-05 13:43:40','2025-09-05 14:05:24','/buildings/1/apartments/16ա/6f6f13ac-d088-40dd-ba1a-1d9930a74a8c.jpg','/buildings/1/apartments/16ա/ca9dcce2-46a7-4a9f-9a2b-c606b3a0bb5d.jpg',46.6,2,NULL,0),(23,1,22,6,'17','active',NULL,NULL,'2025-09-05 13:45:12','2025-09-05 14:05:24','/buildings/1/apartments/17/bfc27b03-f118-4637-802f-5f580d848331.jpg','/buildings/1/apartments/17/785fb4b8-7b20-4905-a325-65f9dbfa5b2d.jpg',46,2,NULL,0),(24,1,22,6,'17ա','active',NULL,NULL,'2025-09-05 13:46:43','2025-09-05 14:05:22','/buildings/1/apartments/17ա/dc574d41-b390-406a-a0df-3908d5145e21.png','/buildings/1/apartments/17ա/e4f20add-4daf-421e-b6a0-ff3a1f73d77b.jpg',49.1,2,NULL,0),(25,1,22,6,'18','active',NULL,NULL,'2025-09-05 13:48:38','2025-09-05 14:05:22','/buildings/1/apartments/18/796e3433-a680-4c4a-a677-17eac6aa93b9.jpg','/buildings/1/apartments/18/ebc6859c-e836-4de4-82be-722264420d40.jpg',56,2,NULL,0),(26,1,22,6,'19','active',NULL,NULL,'2025-09-05 13:49:35','2025-09-05 14:05:21','/buildings/1/apartments/19/279881c6-f1a6-46b2-b819-3aaab238d7ae.png','/buildings/1/apartments/19/fcc24485-cadb-434c-b2f7-e6e5f7f23398.jpg',69.2,2,NULL,0),(27,1,22,6,'20','active',NULL,NULL,'2025-09-05 13:51:16','2025-09-05 14:05:18','/buildings/1/apartments/20/40fd3e18-6621-4637-a06d-f7d584696bf0.png','/buildings/1/apartments/20/7bec2d0a-5be2-4fcd-8c6c-c3d2de883e23.jpg',89.1,4,NULL,0),(28,1,22,6,'21','active',NULL,NULL,'2025-09-05 13:52:32','2025-09-05 14:05:19','/buildings/1/apartments/21/2357e136-6f42-4b44-b0ce-cc53befa6881.png','/buildings/1/apartments/21/c63a7e4e-5244-431c-bdf4-56fdd2dd6335.jpg',63.7,2,NULL,0),(29,1,22,6,'22','active',NULL,NULL,'2025-09-05 13:53:54','2025-09-05 14:05:20','/buildings/1/apartments/22/cb41a994-4815-4790-b27d-4dfddc35d4ed.jpg','/buildings/1/apartments/22/a1a95928-143e-4ff3-80de-aafec8483fec.jpg',63,3,NULL,0),(30,1,22,6,'23','pending',NULL,NULL,'2025-09-05 13:55:14','2025-09-05 13:55:14','/buildings/1/apartments/23/8e5469c5-a39a-4f0a-8228-2350724d6434.png','/buildings/1/apartments/23/44e4ef56-5a8b-406c-85a2-f894dc5cc3cd.jpg',51,2,NULL,0),(31,1,22,6,'23ա','pending',NULL,NULL,'2025-09-05 13:56:21','2025-09-05 13:56:21','/buildings/1/apartments/23ա/be58ef7e-5587-4d5b-a59b-d0ec81eee286.jpg','/buildings/1/apartments/23ա/43719be0-c18a-438e-9610-d05bbd657071.jpg',54,2,NULL,0),(32,1,22,6,'24','pending',NULL,NULL,'2025-09-05 13:58:01','2025-09-05 13:58:01','/buildings/1/apartments/24/510153e5-4888-422d-879f-c93c032da9e9.jpg','/buildings/1/apartments/24/d8a8df80-2a65-4a5c-b507-50b52d42523b.jpg',56,2,NULL,0),(33,1,22,6,'25','pending',NULL,NULL,'2025-09-05 13:59:23','2025-09-05 13:59:23','/buildings/1/apartments/25/fb738f6e-00d7-4021-b73c-d71f538812d6.png','/buildings/1/apartments/25/02e3dc67-7dc7-4a1a-9617-36a580818aaf.jpg',65.5,2,NULL,0),(34,1,22,6,'26','pending',NULL,NULL,'2025-09-05 14:00:39','2025-09-05 14:00:39','/buildings/1/apartments/26/68b15c7e-8dec-4f23-92ba-c603c234d5a8.png','/buildings/1/apartments/26/c41e29dd-dbc0-41c5-95d2-dd16c67fafac.jpg',46,2,NULL,0),(35,1,22,6,'27','pending',NULL,NULL,'2025-09-05 14:01:36','2025-09-05 14:01:36','/buildings/1/apartments/27/e6a1b7b6-98c6-4ab1-a517-ece1b63fe1dc.png','/buildings/1/apartments/27/67077668-277c-4760-918a-1303f423bab1.jpg',56.9,2,NULL,0),(36,1,22,6,'28','pending',NULL,NULL,'2025-09-05 14:04:21','2025-09-05 14:04:21','/buildings/1/apartments/28/728f646e-64d2-4cdc-85fa-e60b9601f833.png','/buildings/1/apartments/28/225d5924-520a-4127-91b9-d8c10bc91c7f.jpg',40.2,2,NULL,0),(37,1,22,11,'29','pending',NULL,NULL,'2025-09-05 14:16:49','2025-09-05 14:16:49','/buildings/1/apartments/29/5a2c0d89-5507-4ae0-b444-80e05b546ae7.png','/buildings/1/apartments/29/27c6f5a7-71f8-4222-9ce2-9d486a7321a2.jpg',56,2,NULL,0),(38,1,22,11,'30','pending',NULL,NULL,'2025-09-05 14:17:38','2025-09-05 14:17:38','/buildings/1/apartments/30/4c4c1e89-4fc4-43ab-a72a-ff76254076f3.png','/buildings/1/apartments/30/44d386d0-33f4-4aa5-ae46-d9f668e725ad.jpg',51,2,NULL,0),(39,1,22,11,'31','pending',NULL,NULL,'2025-09-05 14:19:04','2025-09-05 14:19:04','/buildings/1/apartments/31/81fcad36-d6e5-44d5-8272-0975fcb4df72.png','/buildings/1/apartments/31/bc1bab33-7573-415c-89cd-20d12d1dea87.jpg',46,2,NULL,0),(40,1,22,11,'32','pending',NULL,NULL,'2025-09-05 14:20:20','2025-09-05 14:20:20','/buildings/1/apartments/32/324f086f-426e-4328-a536-af1509841400.png','/buildings/1/apartments/32/27d39ec8-29b2-4345-8689-a9c043f1b2d1.jpg',76,3,NULL,0),(41,1,22,11,'33','pending',NULL,NULL,'2025-09-05 14:21:40','2025-09-05 14:21:40','/buildings/1/apartments/33/27e740ca-341c-4dae-8f4f-f863e5bb5196.png','/buildings/1/apartments/33/5ac3fcff-ebf7-4491-910f-6f4c068474c4.jpg',55,2,NULL,0),(42,1,22,11,'34','pending',NULL,NULL,'2025-09-05 14:23:11','2025-09-05 14:23:11','/buildings/1/apartments/34/b156478e-c700-49d5-bfe9-43e5cc518312.png','/buildings/1/apartments/34/e8ddef63-0764-4c79-87f3-9ff4f66f8e44.jpg',35.1,1,NULL,0),(43,1,22,11,'35','pending',NULL,NULL,'2025-09-05 14:25:00','2025-09-05 14:25:00','/buildings/1/apartments/35/7996e5f7-f0ba-4e53-b252-0be473076171.png','/buildings/1/apartments/35/408d22ab-db14-44f5-9e91-01815e3e6716.jpg',62.8,2,NULL,0),(44,1,22,11,'36','pending',NULL,NULL,'2025-09-05 14:26:14','2025-09-05 14:26:14','/buildings/1/apartments/36/b43079d9-c36d-4be7-b6c3-17d3b2b7e834.png','/buildings/1/apartments/36/a6695e05-027b-474e-bfba-6bbd4cbe272a.jpg',62.4,2,NULL,0),(45,1,22,11,'37','pending',NULL,NULL,'2025-09-05 14:27:07','2025-09-05 14:27:07','/buildings/1/apartments/37/f55e995c-0c97-433c-85c6-9b182a5a4efb.jpg','/buildings/1/apartments/37/4a9f3d40-2f87-47ce-a782-1b95f5cdbe2e.jpg',58,2,NULL,0),(46,1,22,11,'38','pending',NULL,NULL,'2025-09-05 14:28:30','2025-09-05 14:28:30','/buildings/1/apartments/38/cb7f96e1-fa8e-4259-829e-665c7c2c0517.jpg','/buildings/1/apartments/38/fb141ad4-c144-48ba-beaf-d32a8164bcbf.jpg',55,2,NULL,0),(47,1,22,11,'38ա','pending',NULL,NULL,'2025-09-05 14:29:45','2025-09-05 14:29:45','/buildings/1/apartments/38ա/17a48b62-e4d9-453d-8136-0043122f3d04.jpg','/buildings/1/apartments/38ա/1e9dab85-1684-4d63-be5d-b20c71c31eb6.jpg',62,2,NULL,0),(48,1,22,11,'39','pending',NULL,NULL,'2025-09-05 14:30:52','2025-09-05 14:30:52','/buildings/1/apartments/39/5ad2078f-9a9f-455c-9072-074280d1e21b.jpg','/buildings/1/apartments/39/817ce824-5e82-4f38-bb51-286b6468dc40.jpg',63.4,2,NULL,0),(49,1,22,11,'40','pending',NULL,NULL,'2025-09-05 14:31:56','2025-09-05 14:31:56','/buildings/1/apartments/40/d6ff9238-c52a-40a5-9915-8f1d8cf9cbe7.png','/buildings/1/apartments/40/ab1c12ef-9d6f-4f76-b2e9-67b10b3cd17a.jpg',89.1,4,NULL,0),(50,1,22,11,'41','pending',NULL,NULL,'2025-09-05 14:33:05','2025-09-05 14:33:05','/buildings/1/apartments/41/5313ec0c-aa1e-434c-993d-119f2548a451.png','/buildings/1/apartments/41/2b2eb0cc-be14-4720-91eb-66a2b56a030c.jpg',49.1,2,NULL,0),(51,1,22,11,'42','pending',NULL,NULL,'2025-09-05 14:34:50','2025-09-05 14:34:50','/buildings/1/apartments/42/a417499e-c10e-426c-b914-1b2dca7d8e45.jpg','/buildings/1/apartments/42/ff6b9da6-a3f3-4494-bead-f3455d831cfd.jpg',56,2,NULL,0),(52,1,22,11,'42ա','pending',NULL,NULL,'2025-09-05 14:36:10','2025-09-05 14:36:10','/buildings/1/apartments/42ա/53d6f7e9-de47-4a2f-8eb6-9c58fc9cd750.jpg','/buildings/1/apartments/42ա/3e828fa6-09e0-40ec-b8c2-e95be983b51e.jpg',46,2,NULL,0),(53,1,22,11,'43','pending',NULL,NULL,'2025-09-05 14:37:22','2025-09-05 14:37:22','/buildings/1/apartments/43/c89bea0e-e919-4e78-91e1-bc5f805734d1.jpg','/buildings/1/apartments/43/64bb35fb-9a9e-40a5-933a-ea33c734ae32.jpg',46.6,2,NULL,0),(54,1,22,11,'43ա','pending',NULL,NULL,'2025-09-05 14:38:46','2025-09-05 14:38:46','/buildings/1/apartments/43ա/9aecd636-ad27-42bd-acb7-7ada3f7f838d.jpg','/buildings/1/apartments/43ա/f1f301a5-dffb-47b8-867a-914e7c1e59de.jpg',51.5,2,NULL,0),(55,1,22,11,'44','pending',NULL,NULL,'2025-09-05 14:39:49','2025-09-05 14:39:49','/buildings/1/apartments/44/faa0aa0d-f6c8-4560-9c86-28d8456ee11d.jpg','/buildings/1/apartments/44/18679551-86b5-41f2-8a22-27638454ba94.jpg',51.5,2,NULL,0),(56,1,22,11,'44ա','pending',NULL,NULL,'2025-09-05 14:41:12','2025-09-05 14:41:12','/buildings/1/apartments/44ա/4ac70b71-dce6-4b94-a844-e43a942e3e6d.jpg','/buildings/1/apartments/44ա/789628d7-c097-4bc6-9c85-33f4174e9b9d.jpg',46.6,2,NULL,0),(57,1,22,11,'45','pending',NULL,NULL,'2025-09-05 14:43:38','2025-09-05 14:43:38','/buildings/1/apartments/45/f4b1b358-8180-4e31-a59e-491751e2a1a7.jpg','/buildings/1/apartments/45/6a9a78fd-8927-47ea-b4a3-6ea0e83e6dda.jpg',46,2,NULL,0),(58,1,22,11,'45ա','pending',NULL,NULL,'2025-09-05 18:46:53','2025-09-05 18:46:53','/buildings/1/apartments/45ա/fea0b919-79ea-4430-abf1-d44ab0d9123f.jpg','/buildings/1/apartments/45ա/5e6fb0f7-2d42-471d-bc37-6aec26673f61.jpg',56,2,NULL,0),(59,1,22,11,'46','pending',NULL,NULL,'2025-09-05 18:48:41','2025-09-05 18:48:41','/buildings/1/apartments/46/101425af-8948-44af-bfd1-f0bc8dd00556.png','/buildings/1/apartments/46/2a95c108-b147-49a7-a758-c431844a87c6.jpg',49.1,2,NULL,0),(60,1,22,11,'47','pending',NULL,NULL,'2025-09-05 18:49:56','2025-09-05 18:49:56','/buildings/1/apartments/47/8ce2d96b-a39d-47f9-b366-34be819d81ed.png','/buildings/1/apartments/47/34e69344-c935-4c37-aadc-178c8fe71f1f.jpg',69.2,2,NULL,0),(61,1,22,11,'48','pending',NULL,NULL,'2025-09-05 18:51:12','2025-09-05 18:51:12','/buildings/1/apartments/48/25006d03-129c-47fa-a441-e9a716bb7b0b.png','/buildings/1/apartments/48/8d2c4975-dd02-463f-83b9-c481f60a35c7.jpg',89.1,4,NULL,0),(62,1,22,11,'49','pending',NULL,NULL,'2025-09-05 18:52:18','2025-09-05 18:52:18','/buildings/1/apartments/49/cf8919ea-149c-4e95-bd5e-c42eef409dbb.jpg','/buildings/1/apartments/49/36226596-681d-4cf3-9626-44cf3d3c170e.jpg',63.4,2,NULL,0),(63,1,22,11,'50','pending',NULL,NULL,'2025-09-05 18:53:34','2025-09-05 18:53:34','/buildings/1/apartments/50/c78bca95-f972-427c-a68d-fc73eddd5242.jpg','/buildings/1/apartments/50/84dc8073-a3b9-496e-bd3a-ad39b5f97556.jpg',63,3,NULL,0),(64,1,22,11,'51','pending',NULL,NULL,'2025-09-05 18:54:51','2025-09-05 18:54:51','/buildings/1/apartments/51/a1a5dd2f-dacf-45ef-b603-8327206c93c2.jpg','/buildings/1/apartments/51/28cdaf39-0d2f-41e5-a807-de08197a1250.jpg',51,2,NULL,0),(65,1,22,11,'51ա','pending',NULL,NULL,'2025-09-05 18:55:53','2025-09-05 18:55:53','/buildings/1/apartments/51ա/43bb1159-6a4d-46f3-b326-5ae89f6c3686.jpg','/buildings/1/apartments/51ա/205f20dd-da52-4c2b-9781-c378587eb904.jpg',54,2,NULL,0),(66,1,22,11,'52','pending',NULL,NULL,'2025-09-05 18:57:23','2025-09-05 18:57:23','/buildings/1/apartments/52/776b4df8-161f-4e6d-b18f-e304a1defb98.jpg','/buildings/1/apartments/52/aecd43e5-823f-4ad2-a672-bf7dd03e61d6.jpg',56,2,NULL,0),(67,1,22,11,'53','pending',NULL,NULL,'2025-09-05 18:58:50','2025-09-05 18:58:50','/buildings/1/apartments/53/7f3a9b10-1ebd-4b5b-9150-7a0241fabf2b.png','/buildings/1/apartments/53/3e5f4502-5909-4689-b827-b31ac02c280c.jpg',65.5,2,NULL,0),(68,1,22,11,'54','pending',NULL,NULL,'2025-09-05 19:00:01','2025-09-05 19:00:01','/buildings/1/apartments/54/3f00cb43-8f3c-4c9f-94fa-0b98b46be550.png','/buildings/1/apartments/54/033ea3fe-e269-4ebe-88f3-70a722c9ca35.jpg',46,2,NULL,0),(69,1,22,11,'55','pending',NULL,NULL,'2025-09-05 19:00:57','2025-09-05 19:00:57','/buildings/1/apartments/55/98feba4e-22fb-4695-83a4-f7e6e6e6bce3.png','/buildings/1/apartments/55/87b4b18a-6d1f-4603-99d3-92b40523981c.jpg',56.9,2,NULL,0),(70,1,22,11,'56','pending',NULL,NULL,'2025-09-05 19:01:53','2025-09-05 19:01:53','/buildings/1/apartments/56/04cd871d-2403-4596-a02d-0f0a7eba131c.png','/buildings/1/apartments/56/cdf613a7-97dc-49f6-89c5-cded44e4311e.jpg',40.2,2,NULL,0),(71,1,22,18,'57','pending',NULL,NULL,'2025-09-05 20:44:30','2025-09-05 20:44:30','/buildings/1/apartments/57/fd16b9e4-e082-47f8-a639-5e38f3bdbc12.png',NULL,56,2,NULL,0),(72,1,22,18,'58','pending',NULL,NULL,'2025-09-05 20:45:42','2025-09-05 20:45:42','/buildings/1/apartments/58/cf1f18f1-fb21-4812-b28e-feaf8b1f6ecc.png',NULL,51,2,NULL,0),(73,1,22,18,'59','pending',NULL,NULL,'2025-09-05 20:46:13','2025-09-05 20:46:13','/buildings/1/apartments/59/83e5534f-d96b-420b-acf9-37af46ac55d4.png',NULL,46,2,NULL,0),(74,1,22,18,'60','pending',NULL,NULL,'2025-09-05 20:46:29','2025-09-05 20:46:29','/buildings/1/apartments/60/6c4d0464-2596-4f45-9400-9c647c81f1b9.png',NULL,76,3,NULL,0),(75,1,22,18,'61','pending',NULL,NULL,'2025-09-05 20:47:16','2025-09-05 20:47:16','/buildings/1/apartments/61/9c14f4a5-3366-431c-9a9b-b6db696d7ab6.png',NULL,55,2,NULL,0),(76,1,22,18,'62','pending',NULL,NULL,'2025-09-05 20:50:22','2025-09-05 20:50:22',NULL,NULL,84,3,NULL,0),(77,1,22,18,'65','pending',NULL,NULL,'2025-09-05 20:51:01','2025-09-05 20:52:24',NULL,NULL,87.6,3,NULL,0),(78,1,22,18,'64','pending',NULL,NULL,'2025-09-05 20:52:55','2025-09-05 20:52:55','/buildings/1/apartments/64/18e05d9b-cbc6-428e-b317-e5aad974dad9.png',NULL,62.4,2,NULL,0),(79,1,22,18,'66','pending',NULL,NULL,'2025-09-05 20:53:20','2025-09-05 20:53:20','/buildings/1/apartments/66/cf142b6a-a9d0-4bcd-95aa-7033db582271.png',NULL,96.1,3,NULL,0),(80,1,22,18,'67','pending',NULL,NULL,'2025-09-05 20:53:55','2025-09-05 20:53:55',NULL,NULL,63.1,2,NULL,0),(81,1,22,18,'68','pending',NULL,NULL,'2025-09-05 20:54:14','2025-09-05 20:54:14','/buildings/1/apartments/68/b7918193-39c7-411d-9944-b408d4b6a77e.png',NULL,89.1,4,NULL,0),(82,1,22,18,'69','pending',NULL,NULL,'2025-09-05 20:54:51','2025-09-05 20:54:51','/buildings/1/apartments/69/90c1ecb2-6b43-46c1-b331-b244834c2c86.png',NULL,49.1,2,NULL,0),(83,1,22,18,'70','pending',NULL,NULL,'2025-09-05 20:55:21','2025-09-05 20:55:21',NULL,NULL,56,2,NULL,0),(84,1,22,18,'70ա','pending',NULL,NULL,'2025-09-05 20:55:48','2025-09-05 20:55:48',NULL,NULL,46,2,NULL,0),(85,1,22,18,'71','pending',NULL,NULL,'2025-09-05 20:56:10','2025-09-05 20:56:10',NULL,NULL,46.6,2,NULL,0),(86,1,22,18,'71ա','pending',NULL,NULL,'2025-09-05 20:56:36','2025-09-05 20:56:36',NULL,NULL,51.5,2,NULL,0),(87,1,22,18,'72','pending',NULL,NULL,'2025-09-05 20:56:51','2025-09-05 20:56:51',NULL,NULL,51.5,2,NULL,0),(88,1,22,18,'72ա','pending',NULL,NULL,'2025-09-05 20:57:14','2025-09-05 20:57:14',NULL,NULL,46.6,2,NULL,0),(89,1,22,18,'73','pending',NULL,NULL,'2025-09-05 20:57:28','2025-09-05 20:57:28',NULL,NULL,46,2,NULL,0),(90,1,22,18,'73ա','pending',NULL,NULL,'2025-09-05 20:57:41','2025-09-05 20:57:41',NULL,NULL,56,2,NULL,0),(91,1,22,18,'74','pending',NULL,NULL,'2025-09-05 20:57:59','2025-09-05 20:57:59','/buildings/1/apartments/74/ab3d1cae-1ff2-4cc6-8a0c-6868503514ba.png',NULL,49.1,2,NULL,0),(92,1,22,18,'75','pending',NULL,NULL,'2025-09-05 20:58:17','2025-09-05 20:58:17','/buildings/1/apartments/75/ace4ee1b-c709-41d7-9253-3884b0e5333e.png',NULL,69.2,2,NULL,0),(93,1,22,18,'76','pending',NULL,NULL,'2025-09-05 20:58:39','2025-09-05 20:58:39','/buildings/1/apartments/76/4323b8c0-7f1a-47a0-98aa-887cb4077441.png',NULL,89.1,4,NULL,0),(94,1,22,18,'77','pending',NULL,NULL,'2025-09-05 20:59:01','2025-09-05 20:59:01',NULL,NULL,63.1,2,NULL,0),(95,1,22,18,'78','pending',NULL,NULL,'2025-09-05 20:59:45','2025-09-05 20:59:45',NULL,NULL,63,3,NULL,0),(96,1,22,18,'79','pending',NULL,NULL,'2025-09-05 21:00:04','2025-09-05 21:00:04',NULL,NULL,51,2,NULL,0),(98,1,22,18,'79ա','pending',NULL,NULL,'2025-09-05 21:00:54','2025-09-05 21:00:54',NULL,NULL,54,2,NULL,0),(99,1,22,18,'80','pending',NULL,NULL,'2025-09-05 21:01:15','2025-09-05 21:01:15',NULL,NULL,56,2,NULL,0),(100,1,22,18,'81','pending',NULL,NULL,'2025-09-05 21:01:41','2025-09-05 21:01:41','/buildings/1/apartments/81/da1b1077-119b-46e0-9573-b64eb96e00a1.png',NULL,65.5,2,NULL,0),(101,1,22,18,'82','pending',NULL,NULL,'2025-09-05 21:02:03','2025-09-05 21:02:03','/buildings/1/apartments/82/6c2564bb-e961-4f7d-916a-36e8fe76e969.png',NULL,46,2,NULL,0),(102,1,22,18,'83','pending',NULL,NULL,'2025-09-05 21:02:19','2025-09-05 21:02:19','/buildings/1/apartments/83/d70e166f-aa88-4bb7-bfee-7d83efd41e6f.png',NULL,56.9,2,NULL,0),(103,1,22,18,'84','pending',NULL,NULL,'2025-09-05 21:02:38','2025-09-05 21:02:38','/buildings/1/apartments/84/8e3e8b40-3306-4f0d-81a7-757b2fdb9026.png',NULL,40.2,2,NULL,0),(104,1,22,23,'85','pending',NULL,NULL,'2025-09-05 21:03:22','2025-09-05 21:03:22','/buildings/1/apartments/85/912a6d74-7d0e-4242-8689-7e7011aba9d9.png',NULL,56,2,NULL,0),(105,1,22,23,'86','pending',NULL,NULL,'2025-09-05 21:03:37','2025-09-05 21:03:37','/buildings/1/apartments/86/6edb3ca2-894d-428a-b31d-e57bf1534957.png',NULL,51,2,NULL,0),(106,1,22,23,'87','pending',NULL,NULL,'2025-09-05 21:03:56','2025-09-05 21:03:56','/buildings/1/apartments/87/0f138f93-078b-4988-ab96-7a22778e5bb4.png',NULL,46,2,NULL,0),(107,1,22,23,'88','pending',NULL,NULL,'2025-09-05 21:04:14','2025-09-05 21:04:14','/buildings/1/apartments/88/ef513042-e54f-4672-b5ce-8516bc7a52be.png',NULL,76,3,NULL,0),(108,1,22,23,'89','pending',NULL,NULL,'2025-09-05 21:04:31','2025-09-05 21:04:31','/buildings/1/apartments/89/f788509c-48e0-4e3c-bfc8-926a0daf5776.png',NULL,55,2,NULL,0),(109,1,22,23,'90','pending',NULL,NULL,'2025-09-05 21:04:45','2025-09-05 21:04:45','/buildings/1/apartments/90/54e8363a-fca2-47af-a8b2-47d5c683cf2f.png',NULL,35.1,1,NULL,0),(110,1,22,23,'91','pending',NULL,NULL,'2025-09-05 21:05:02','2025-09-05 21:05:02','/buildings/1/apartments/91/ddbaa1f4-2bbf-469a-b2f0-155b2d9351f9.png',NULL,62.8,2,NULL,0),(111,1,22,23,'93','pending',NULL,NULL,'2025-09-05 21:05:41','2025-09-05 21:05:41',NULL,NULL,58,2,NULL,0),(112,1,22,23,'94','pending',NULL,NULL,'2025-09-05 21:06:06','2025-09-05 21:06:06',NULL,NULL,55,2,NULL,0),(113,1,22,23,'94ա','pending',NULL,NULL,'2025-09-05 21:06:29','2025-09-05 21:06:29',NULL,NULL,62,2,NULL,0),(114,1,22,23,'95','pending',NULL,NULL,'2025-09-05 21:07:44','2025-09-05 21:07:44',NULL,NULL,62.8,2,NULL,0),(115,1,22,23,'96','pending',NULL,NULL,'2025-09-05 21:08:05','2025-09-05 21:08:05','/buildings/1/apartments/96/d565d2ab-94e1-44b9-af6a-6b0434a8bf04.png',NULL,89.1,4,NULL,0),(116,1,22,23,'97','pending',NULL,NULL,'2025-09-05 21:08:28','2025-09-05 21:08:28','/buildings/1/apartments/97/f40ffb89-4163-41f8-b0e7-c561570426fe.png',NULL,49.1,2,NULL,0),(117,1,22,23,'98','pending',NULL,NULL,'2025-09-05 21:08:51','2025-09-05 21:08:51','/buildings/1/apartments/98/1662d773-e07e-4b4e-835a-f7f6c30a8d33.png',NULL,109.4,2,NULL,0),(118,1,22,23,'99','pending',NULL,NULL,'2025-09-05 21:09:11','2025-09-05 21:09:11',NULL,NULL,46.6,2,NULL,0),(119,1,22,23,'99ա','pending',NULL,NULL,'2025-09-05 21:09:29','2025-09-05 21:09:29',NULL,NULL,51.5,2,NULL,0),(120,1,22,23,'100','pending',NULL,NULL,'2025-09-05 21:09:50','2025-09-05 21:09:50','/buildings/1/apartments/100/990349cb-7b7d-462c-9186-96544197d792.png',NULL,102.6,2,NULL,0),(121,1,22,23,'101','pending',NULL,NULL,'2025-09-05 21:10:45','2025-09-05 21:10:45',NULL,NULL,46,2,NULL,0),(122,1,22,23,'101ա','pending',NULL,NULL,'2025-09-05 21:11:02','2025-09-05 21:11:02',NULL,NULL,56,2,NULL,0),(123,1,22,23,'102','pending',NULL,NULL,'2025-09-05 21:11:25','2025-09-05 21:11:25','/buildings/1/apartments/102/8f39b0cd-07a9-4e64-8e85-1f1333ee4597.png',NULL,49.1,2,NULL,0),(124,1,22,23,'103','pending',NULL,NULL,'2025-09-05 21:11:55','2025-09-05 21:11:55','/buildings/1/apartments/103/565ff5c5-67df-42ab-a754-ef2e4d495423.png',NULL,69.2,2,NULL,0),(125,1,22,23,'104','pending',NULL,NULL,'2025-09-05 21:12:14','2025-09-05 21:12:14','/buildings/1/apartments/104/5471b3ab-f3a3-4082-bd83-9a673dc2e541.png',NULL,89.1,4,NULL,0),(126,1,22,23,'105','pending',NULL,NULL,'2025-09-05 21:12:42','2025-09-05 21:12:42',NULL,NULL,62.8,2,NULL,0),(127,1,22,23,'106','pending',NULL,NULL,'2025-09-05 21:13:02','2025-09-05 21:13:02',NULL,NULL,63,3,NULL,0),(128,1,22,23,'107','pending',NULL,NULL,'2025-09-05 21:13:22','2025-09-05 21:13:22',NULL,NULL,51,3,NULL,0),(129,1,22,23,'107ա','pending',NULL,NULL,'2025-09-05 21:13:46','2025-09-05 21:13:46',NULL,NULL,54,2,NULL,0),(130,1,22,23,'108','pending',NULL,NULL,'2025-09-05 21:14:24','2025-09-05 21:14:24',NULL,NULL,56,2,NULL,0),(131,1,22,23,'109','pending',NULL,NULL,'2025-09-05 21:14:59','2025-09-05 21:14:59','/buildings/1/apartments/109/f95cfaa7-8f83-4d2b-8c98-89b41805ec35.png',NULL,65.5,2,NULL,0),(132,1,22,23,'110','pending',NULL,NULL,'2025-09-05 21:15:26','2025-09-05 21:15:26','/buildings/1/apartments/110/593e2ff9-357c-408b-8b58-1a2af7c3e5cf.png',NULL,46,2,NULL,0),(133,1,22,23,'111','pending',NULL,NULL,'2025-09-05 21:15:44','2025-09-05 21:15:44','/buildings/1/apartments/111/d025d1f3-e715-449b-902b-9f5774d63d77.png',NULL,56.9,2,NULL,0),(134,1,22,23,'112','pending',NULL,NULL,'2025-09-05 21:16:05','2025-09-05 21:16:05','/buildings/1/apartments/112/f5a0dabc-de03-4f5b-ab48-e41597e5f4a5.png',NULL,40.2,2,NULL,0),(135,2,81,175,'1','sold',NULL,NULL,'2025-09-07 08:15:39','2025-09-07 08:24:56',NULL,NULL,78,3,NULL,0);
/*!40000 ALTER TABLE `apartments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blocks`
--

DROP TABLE IF EXISTS `blocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blocks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `building_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `blocks_building_id_foreign` (`building_id`),
  CONSTRAINT `blocks_building_id_foreign` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blocks`
--

LOCK TABLES `blocks` WRITE;
/*!40000 ALTER TABLE `blocks` DISABLE KEYS */;
INSERT INTO `blocks` VALUES (22,1,'1','2025-09-04 14:51:51','2025-09-04 14:51:51'),(23,1,'2','2025-09-04 14:51:51','2025-09-04 14:51:51'),(24,1,'3','2025-09-04 14:51:51','2025-09-04 14:51:51'),(25,1,'4','2025-09-04 14:51:51','2025-09-04 14:51:51'),(81,2,'1','2025-09-06 05:53:24','2025-09-06 05:53:24'),(82,2,'2','2025-09-06 05:53:24','2025-09-06 05:53:24'),(83,2,'3','2025-09-06 05:53:24','2025-09-06 05:53:24'),(84,2,'4','2025-09-06 05:53:24','2025-09-06 05:53:24'),(85,2,'5','2025-09-06 05:53:24','2025-09-06 05:53:24');
/*!40000 ALTER TABLE `blocks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `building_garages`
--

DROP TABLE IF EXISTS `building_garages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `building_garages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `building_id` bigint unsigned NOT NULL,
  `floor_id` bigint unsigned NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `old_status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `square_meter` double NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `building_garages_building_id_number_unique` (`building_id`,`number`),
  KEY `building_garages_floor_id_foreign` (`floor_id`),
  CONSTRAINT `building_garages_building_id_foreign` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`),
  CONSTRAINT `building_garages_floor_id_foreign` FOREIGN KEY (`floor_id`) REFERENCES `floors` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `building_garages`
--

LOCK TABLES `building_garages` WRITE;
/*!40000 ALTER TABLE `building_garages` DISABLE KEYS */;
INSERT INTO `building_garages` VALUES (1,2,151,'active',NULL,'1',17.5,'2025-09-06 12:54:39','2025-09-06 12:54:41');
/*!40000 ALTER TABLE `building_garages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `buildings`
--

DROP TABLE IF EXISTS `buildings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `buildings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `main_image_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `buildings_main_image_id_foreign` (`main_image_id`),
  CONSTRAINT `buildings_main_image_id_foreign` FOREIGN KEY (`main_image_id`) REFERENCES `images` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buildings`
--

LOCK TABLES `buildings` WRITE;
/*!40000 ALTER TABLE `buildings` DISABLE KEYS */;
INSERT INTO `buildings` VALUES (1,'active','2024-11-01','2027-10-01','2025-09-04 13:16:05','2025-09-06 05:53:28',5),(2,'pending','2023-09-19','2026-09-08','2025-09-06 05:32:39','2025-09-06 05:32:39',NULL);
/*!40000 ALTER TABLE `buildings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
INSERT INTO `cache` VALUES ('laravel-cache-spatie.permission.cache','a:3:{s:5:\"alias\";a:4:{s:1:\"a\";s:2:\"id\";s:1:\"b\";s:4:\"name\";s:1:\"c\";s:10:\"guard_name\";s:1:\"r\";s:5:\"roles\";}s:11:\"permissions\";a:17:{i:0;a:4:{s:1:\"a\";i:1;s:1:\"b\";s:12:\"pages.manage\";s:1:\"c\";s:3:\"api\";s:1:\"r\";a:1:{i:0;i:1;}}i:1;a:4:{s:1:\"a\";i:2;s:1:\"b\";s:10:\"roles.view\";s:1:\"c\";s:3:\"api\";s:1:\"r\";a:1:{i:0;i:1;}}i:2;a:4:{s:1:\"a\";i:3;s:1:\"b\";s:12:\"roles.manage\";s:1:\"c\";s:3:\"api\";s:1:\"r\";a:1:{i:0;i:1;}}i:3;a:4:{s:1:\"a\";i:4;s:1:\"b\";s:16:\"permissions.view\";s:1:\"c\";s:3:\"api\";s:1:\"r\";a:1:{i:0;i:1;}}i:4;a:4:{s:1:\"a\";i:5;s:1:\"b\";s:18:\"permissions.manage\";s:1:\"c\";s:3:\"api\";s:1:\"r\";a:1:{i:0;i:1;}}i:5;a:3:{s:1:\"a\";i:6;s:1:\"b\";s:17:\"apartments.manage\";s:1:\"c\";s:3:\"api\";}i:6;a:3:{s:1:\"a\";i:7;s:1:\"b\";s:15:\"apartments.view\";s:1:\"c\";s:3:\"api\";}i:7;a:3:{s:1:\"a\";i:8;s:1:\"b\";s:16:\"buildings.manage\";s:1:\"c\";s:3:\"api\";}i:8;a:3:{s:1:\"a\";i:9;s:1:\"b\";s:14:\"buildings.view\";s:1:\"c\";s:3:\"api\";}i:9;a:3:{s:1:\"a\";i:10;s:1:\"b\";s:14:\"designs.manage\";s:1:\"c\";s:3:\"api\";}i:10;a:3:{s:1:\"a\";i:11;s:1:\"b\";s:14:\"garages.manage\";s:1:\"c\";s:3:\"api\";}i:11;a:3:{s:1:\"a\";i:12;s:1:\"b\";s:12:\"garages.view\";s:1:\"c\";s:3:\"api\";}i:12;a:3:{s:1:\"a\";i:13;s:1:\"b\";s:13:\"houses.manage\";s:1:\"c\";s:3:\"api\";}i:13;a:3:{s:1:\"a\";i:14;s:1:\"b\";s:15:\"requests.manage\";s:1:\"c\";s:3:\"api\";}i:14;a:3:{s:1:\"a\";i:15;s:1:\"b\";s:12:\"sales.manage\";s:1:\"c\";s:3:\"api\";}i:15;a:3:{s:1:\"a\";i:16;s:1:\"b\";s:12:\"users.manage\";s:1:\"c\";s:3:\"api\";}i:16;a:3:{s:1:\"a\";i:17;s:1:\"b\";s:10:\"users.view\";s:1:\"c\";s:3:\"api\";}}s:5:\"roles\";a:1:{i:0;a:3:{s:1:\"a\";i:1;s:1:\"b\";s:11:\"super-admin\";s:1:\"c\";s:3:\"api\";}}}',1757442191);
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `designs`
--

DROP TABLE IF EXISTS `designs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `designs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `designs_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `designs`
--

LOCK TABLES `designs` WRITE;
/*!40000 ALTER TABLE `designs` DISABLE KEYS */;
INSERT INTO `designs` VALUES (1,'Թաունհաուզ առինջ','thavounhavouz-arinj','2025-09-04 15:09:15','2025-09-04 15:09:15');
/*!40000 ALTER TABLE `designs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `floors`
--

DROP TABLE IF EXISTS `floors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `floors` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `building_id` bigint unsigned NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `level` smallint NOT NULL,
  `price` decimal(8,2) NOT NULL,
  `model_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `floors_building_id_level_unique` (`building_id`,`level`),
  CONSTRAINT `floors_building_id_foreign` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=218 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `floors`
--

LOCK TABLES `floors` WRITE;
/*!40000 ALTER TABLE `floors` DISABLE KEYS */;
INSERT INTO `floors` VALUES (1,1,'corporate',1,0.00,NULL,NULL,'2025-09-04 13:16:05','2025-09-04 14:51:51'),(6,1,'residential',2,420000.00,'/buildings/floors/1/models/b406c6ab-4cf3-4806-bed8-fb807bd578bd.jpg',NULL,'2025-09-04 13:40:46','2025-09-04 14:51:51'),(11,1,'residential',3,420000.00,'/buildings/floors/1/models/3acf54db-a126-4ce7-a7d5-fbbfcd2c1fbf.jpg',NULL,'2025-09-04 14:34:47','2025-09-04 14:51:51'),(18,1,'residential',4,420000.00,'/buildings/floors/1/models/ec135526-cb32-4835-b6a8-ede84f8f0a39.webp',NULL,'2025-09-04 14:40:46','2025-09-04 14:51:51'),(23,1,'residential',5,420000.00,'/buildings/floors/1/models/2faacca4-6664-444c-8949-69492c739cfa.webp',NULL,'2025-09-04 14:41:08','2025-09-04 14:51:51'),(29,1,'residential',6,430000.00,'/buildings/floors/1/models/79d92294-7d31-4337-b19a-f8a557df0ae2.webp',NULL,'2025-09-04 14:41:34','2025-09-04 14:51:51'),(36,1,'residential',7,430000.00,'/buildings/floors/1/models/6bef5e5f-7779-4edd-a545-19f4f370f43c.webp',NULL,'2025-09-04 14:41:53','2025-09-04 14:51:51'),(44,1,'residential',8,430000.00,'/buildings/floors/1/models/985f6a29-e966-4520-94b4-0fe772813c25.webp',NULL,'2025-09-04 14:42:13','2025-09-04 14:51:51'),(53,1,'residential',9,430000.00,'/buildings/floors/1/models/fd5e35b2-c599-4591-98f5-8b0ef1b9e33e.webp',NULL,'2025-09-04 14:42:30','2025-09-04 14:51:51'),(63,1,'residential',10,430000.00,'/buildings/floors/1/models/980832c5-f5cb-40e0-966c-be4db58a6266.webp',NULL,'2025-09-04 14:44:47','2025-09-04 14:51:51'),(74,1,'residential',11,440000.00,'/buildings/floors/1/models/d40b0905-4ee9-41cd-adee-db2ed06111ec.webp',NULL,'2025-09-04 14:45:05','2025-09-04 14:51:51'),(86,1,'residential',12,440000.00,'/buildings/floors/1/models/ff85d177-f368-4853-875f-3c101dd44150.webp',NULL,'2025-09-04 14:45:25','2025-09-04 14:51:51'),(99,1,'residential',13,440000.00,'/buildings/floors/1/models/cf6c9bea-fec2-45f2-8a09-c3bbc5a76777.webp',NULL,'2025-09-04 14:45:43','2025-09-04 14:51:51'),(113,1,'residential',14,440000.00,'/buildings/floors/1/models/7d316697-9d01-45b1-9384-cc7e5c58c4ba.webp',NULL,'2025-09-04 14:46:19','2025-09-04 14:51:51'),(114,1,'residential',15,440000.00,'/buildings/floors/1/models/79c31c78-a7f5-4024-8045-80ed10de2e81.webp',NULL,'2025-09-04 14:46:19','2025-09-04 14:51:51'),(130,1,'residential',16,440000.00,'/buildings/floors/1/models/40563d05-6446-492a-bdbb-f205f4301d17.webp',NULL,'2025-09-04 14:47:36','2025-09-04 14:51:51'),(147,1,'garage',-1,50000.00,NULL,NULL,NULL,NULL),(148,1,'garage',-2,50000.00,NULL,NULL,NULL,NULL),(150,2,'garage',-1,50000.00,'/buildings/floors/2/models/7d4a0122-0ab8-4ddb-a09c-d4e62b2699e0.jpg',NULL,NULL,'2025-09-06 05:53:24'),(151,2,'garage',-2,50000.00,'/buildings/floors/2/models/e7d219d7-ec7f-446e-90c6-a26ce982d40e.jpg',NULL,NULL,'2025-09-06 05:53:24'),(160,2,'corporate',1,0.00,'/buildings/floors/2/models/e7d219d7-ec7f-446e-90c6-a26ce982d40e.jpg',NULL,'2025-09-06 05:39:57','2025-09-06 05:53:24'),(170,2,'corporate',2,0.00,'/buildings/floors/2/models/7336fa97-552a-4cec-9d63-b77fa560fd61.jpg',NULL,'2025-09-06 05:48:13','2025-09-06 05:53:24'),(175,2,'residential',3,420000.00,'/buildings/floors/2/models/e3285999-0746-42df-8a92-a9d2fd082909.jpg',NULL,'2025-09-06 05:50:21','2025-09-06 05:53:24'),(181,2,'residential',4,420000.00,'/buildings/floors/2/models/7336fa97-552a-4cec-9d63-b77fa560fd61.jpg',NULL,'2025-09-06 05:51:00','2025-09-06 05:53:24'),(182,2,'residential',5,420000.00,'/buildings/floors/2/models/e3285999-0746-42df-8a92-a9d2fd082909.jpg',NULL,'2025-09-06 05:51:00','2025-09-06 05:53:24'),(190,2,'residential',6,440000.00,'/buildings/floors/2/models/6c8b58b4-3d3e-4ed9-8757-15bab003c021.jpg',NULL,'2025-09-06 05:51:41','2025-09-06 05:53:24'),(191,2,'residential',7,440000.00,'/buildings/floors/2/models/8fab723c-323b-447c-871d-a63d12f7fe80.jpg',NULL,'2025-09-06 05:51:41','2025-09-06 05:53:24'),(201,2,'residential',8,460000.00,'/buildings/floors/2/models/bfa78c2f-b4b8-43e4-8301-e27a03b1c912.jpg',NULL,'2025-09-06 05:52:36','2025-09-06 05:53:24'),(202,2,'residential',9,460000.00,'/buildings/floors/2/models/8fab723c-323b-447c-871d-a63d12f7fe80.jpg',NULL,'2025-09-06 05:52:36','2025-09-06 05:53:24'),(203,2,'residential',10,470000.00,'/buildings/floors/2/models/bfa78c2f-b4b8-43e4-8301-e27a03b1c912.jpg',NULL,'2025-09-06 05:52:36','2025-09-06 05:53:24'),(216,2,'residential',11,470000.00,'/buildings/floors/2/models/d1feac4e-9666-4efa-bc65-9ad123fb64fb.jpg',NULL,'2025-09-06 05:53:24','2025-09-06 05:53:24'),(217,2,'residential',12,470000.00,'/buildings/floors/2/models/acd4ee03-a3bc-4672-bfb3-8a8eb73b982b.jpg',NULL,'2025-09-06 05:53:24','2025-09-06 05:53:24');
/*!40000 ALTER TABLE `floors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `house_floors`
--

DROP TABLE IF EXISTS `house_floors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `house_floors` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `level` smallint NOT NULL,
  `house_id` bigint unsigned NOT NULL,
  `square_meter` double NOT NULL,
  `model_image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `house_floors_house_id_level_unique` (`house_id`,`level`),
  CONSTRAINT `house_floors_house_id_foreign` FOREIGN KEY (`house_id`) REFERENCES `houses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `house_floors`
--

LOCK TABLES `house_floors` WRITE;
/*!40000 ALTER TABLE `house_floors` DISABLE KEYS */;
INSERT INTO `house_floors` VALUES (1,1,1,71,'houses/1/floors/9b45890b-7a16-44b4-89e9-9d22f1b39097.jpeg','2025-09-04 15:27:10','2025-09-04 15:32:55'),(4,2,1,78.6,'/houses/1/floors/9f8bf87c-39ef-4628-aa82-90720d7f9865.jpeg','2025-09-04 15:31:38','2025-09-04 15:32:55'),(7,3,1,80.7,'/houses/1/floors/411edeea-4937-40fa-8530-11aa77abdc3f.jpeg','2025-09-04 15:32:17','2025-09-04 15:32:55'),(11,1,2,71,'houses/2/floors/386b3865-eb5d-4935-b66e-47d63d92b7f6.jpeg','2025-09-06 06:29:14','2025-09-06 06:29:14'),(12,2,2,78.6,'houses/2/floors/c5042168-b26e-4107-b45f-47dd2acab5dc.jpeg','2025-09-06 06:29:14','2025-09-06 06:29:14'),(13,3,2,71.3,'houses/2/floors/dc72a14d-807c-4735-8d3e-4230f6e57088.jpeg','2025-09-06 06:29:14','2025-09-06 06:29:14'),(14,1,3,71,'houses/3/floors/96a3637d-be8d-4a03-9bec-a387feb0cf4b.jpeg','2025-09-06 06:30:46','2025-09-06 06:30:46'),(15,2,3,78.6,'houses/3/floors/b281d7e5-1578-4d77-9483-2db18a7c1bb9.jpeg','2025-09-06 06:30:46','2025-09-06 06:30:46'),(16,3,3,80.7,'houses/3/floors/1f775f6d-653e-4a98-9baf-f0bebff900d1.jpeg','2025-09-06 06:30:46','2025-09-06 06:30:46'),(17,1,4,71,'houses/4/floors/0d42139c-7006-461e-81cd-25681606e89a.jpeg','2025-09-06 06:31:38','2025-09-06 06:31:38'),(18,2,4,78.6,'houses/4/floors/c6420feb-0822-4f20-be8a-7f5884dbbf53.jpeg','2025-09-06 06:31:38','2025-09-06 06:31:38'),(19,3,4,80.7,'houses/4/floors/71859711-200e-4a99-82cb-81d1c0017547.jpeg','2025-09-06 06:31:38','2025-09-06 06:31:38'),(20,1,5,71,'houses/5/floors/44104dde-49a6-404c-8364-b44e700e8fff.jpeg','2025-09-06 06:32:35','2025-09-06 06:32:35'),(21,2,5,78.6,'houses/5/floors/96a1968d-a0df-4683-8bbc-b3c98fdc075d.jpeg','2025-09-06 06:32:36','2025-09-06 06:32:36'),(22,3,5,71.3,'houses/5/floors/3dc7f208-525c-4cee-a1db-1ef163d661ac.jpeg','2025-09-06 06:32:36','2025-09-06 06:32:36'),(23,1,6,71,'houses/6/floors/221a59e9-7ff2-4a55-a518-ee9bcf997858.jpeg','2025-09-06 06:33:39','2025-09-06 06:33:39'),(24,2,6,78.6,'houses/6/floors/b732e630-eb6f-4a7f-be92-46ee10c6c9b9.jpeg','2025-09-06 06:33:39','2025-09-06 06:33:39'),(25,3,6,80.7,'houses/6/floors/267d94b5-1ad2-444f-a17d-534dfbdd2f5d.jpeg','2025-09-06 06:33:39','2025-09-06 06:33:39'),(26,1,7,71,'houses/7/floors/d69df7bb-6ac6-4cbe-8047-9a87703208eb.jpeg','2025-09-06 06:34:31','2025-09-06 06:34:31'),(27,2,7,78.6,'houses/7/floors/307fe9f4-c898-4654-b68d-d17dcf6138d1.jpeg','2025-09-06 06:34:31','2025-09-06 06:34:31'),(28,3,7,80.7,'houses/7/floors/824eb9a6-74d7-438d-8f45-64ae0c2f926c.jpeg','2025-09-06 06:34:31','2025-09-06 06:34:31'),(29,1,8,71,'houses/8/floors/f56a29e2-3dc2-47ae-b176-3128a6773314.jpeg','2025-09-06 06:35:16','2025-09-06 06:35:16'),(30,2,8,78.6,'houses/8/floors/236ccec2-c394-47a7-8b7b-3030833f4d6f.jpeg','2025-09-06 06:35:16','2025-09-06 06:35:16'),(31,3,8,80.7,'houses/8/floors/7ad85c3c-7052-4e56-8120-2868589c5296.jpeg','2025-09-06 06:35:16','2025-09-06 06:35:16'),(32,1,9,71,'houses/9/floors/2c746dc9-fd45-4fda-bb18-21c72379f6f1.jpeg','2025-09-06 06:36:09','2025-09-06 06:36:09'),(33,2,9,78.6,'houses/9/floors/30355909-556c-4e03-a20d-6dd938c5a3d1.jpeg','2025-09-06 06:36:09','2025-09-06 06:36:09'),(34,3,9,71.3,'houses/9/floors/59aa8c7c-4097-408f-9c7d-95d82449b93f.jpeg','2025-09-06 06:36:09','2025-09-06 06:36:09'),(35,1,10,71,'houses/10/floors/53f84c8f-58cb-4fbe-80d3-c52a9f81626e.jpeg','2025-09-06 06:37:03','2025-09-06 06:37:03'),(36,2,10,78.6,'houses/10/floors/311cb3ed-4f19-45a8-a932-e367832d3a43.jpeg','2025-09-06 06:37:03','2025-09-06 06:37:03'),(37,3,10,80.7,'houses/10/floors/2aa9b4af-2b1a-4a65-95af-8ef3950f9103.jpeg','2025-09-06 06:37:03','2025-09-06 06:37:03'),(38,1,11,71,'houses/11/floors/2c7fe605-bbed-457f-9c9a-bd2a7bb1eb44.jpeg','2025-09-06 06:38:10','2025-09-06 06:38:10'),(39,2,11,78.6,'houses/11/floors/f0789214-e566-492e-b52d-6c61613cf1ca.jpeg','2025-09-06 06:38:10','2025-09-06 06:38:10'),(40,3,11,80.7,'houses/11/floors/2d57b856-2c1f-4467-a868-2f6897a31fbe.jpeg','2025-09-06 06:38:10','2025-09-06 06:38:10'),(41,1,12,71,'houses/12/floors/7c446f6a-4675-480c-b7de-e421b684402e.jpeg','2025-09-06 06:39:32','2025-09-06 06:39:32'),(42,2,12,78.6,'houses/12/floors/663f5a14-3ea2-4195-818e-5f38565142b9.jpeg','2025-09-06 06:39:32','2025-09-06 06:39:32'),(43,3,12,71.3,'houses/12/floors/709dc826-625d-43d2-9e87-4f911c9957de.jpeg','2025-09-06 06:39:32','2025-09-06 06:39:32'),(44,1,13,71,'houses/13/floors/4fc0e84d-3695-4178-bb4d-10117faf7eae.jpeg','2025-09-06 06:40:30','2025-09-06 06:40:30'),(45,2,13,78.6,'houses/13/floors/d94a2185-531f-4ccb-8d37-2b85f1ad1e34.jpeg','2025-09-06 06:40:30','2025-09-06 06:40:30'),(46,3,13,80.7,'houses/13/floors/b879207d-9e29-46d8-9fe5-d96004bf3267.jpeg','2025-09-06 06:40:30','2025-09-06 06:40:30'),(47,1,14,71,'houses/14/floors/df0451cc-b28b-4adb-b777-e28415ee7dfc.jpeg','2025-09-06 06:41:54','2025-09-06 06:41:54'),(48,2,14,78.6,'houses/14/floors/7cbfcbb0-1d43-419f-b877-98cefabdef96.jpeg','2025-09-06 06:41:54','2025-09-06 06:41:54'),(49,3,14,80.7,'houses/14/floors/e8fc7ed1-73e6-45f0-9c34-eb0b3b2122ce.jpeg','2025-09-06 06:41:54','2025-09-06 06:41:54'),(50,1,15,71,'houses/15/floors/73e376ad-ea09-486e-807e-6eb5ecaa40bc.jpeg','2025-09-06 06:42:37','2025-09-06 06:42:37'),(51,2,15,78.6,'houses/15/floors/3ae602c0-a00e-4b1c-ab1a-0de969b17f5a.jpeg','2025-09-06 06:42:37','2025-09-06 06:42:37'),(52,3,15,80.7,'houses/15/floors/89d2c65a-106f-40cb-b372-a30518e0510c.jpeg','2025-09-06 06:42:37','2025-09-06 06:42:37'),(53,1,16,71,'houses/16/floors/208d75f4-f456-4322-ba78-eef0b5a55aeb.jpeg','2025-09-06 06:43:19','2025-09-06 06:43:19'),(54,2,16,78.6,'houses/16/floors/8bf75efe-2bbe-4185-bd9f-8206bc6c341b.jpeg','2025-09-06 06:43:19','2025-09-06 06:43:19'),(55,3,16,80.7,'houses/16/floors/1392d0d6-427c-4f62-97f2-8985724b329d.jpeg','2025-09-06 06:43:19','2025-09-06 06:43:19');
/*!40000 ALTER TABLE `house_floors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `house_translations`
--

DROP TABLE IF EXISTS `house_translations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `house_translations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `house_id` bigint unsigned NOT NULL,
  `locale` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `house_translations_house_id_foreign` (`house_id`),
  CONSTRAINT `house_translations_house_id_foreign` FOREIGN KEY (`house_id`) REFERENCES `houses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `house_translations`
--

LOCK TABLES `house_translations` WRITE;
/*!40000 ALTER TABLE `house_translations` DISABLE KEYS */;
INSERT INTO `house_translations` VALUES (15,1,'am','address','համայնք Առինջ, Բ թաղամաս, տուն 7/4','2025-09-04 15:32:55','2025-09-04 15:32:55'),(16,1,'ru','address','община Ариндж, район Б, дом 7/4','2025-09-04 15:32:55','2025-09-04 15:32:55'),(17,2,'am','address','համայնք Առինջ, Բ թաղամաս, տուն 7/5','2025-09-06 06:29:14','2025-09-06 06:29:14'),(18,2,'ru','address','община Ариндж, район Б, дом 7/5','2025-09-06 06:29:14','2025-09-06 06:29:14'),(19,3,'am','address','համայնք Առինջ, Բ թաղամաս, տուն 7/11','2025-09-06 06:30:46','2025-09-06 06:30:46'),(20,3,'ru','address','община Ариндж, район Б, дом 7/11','2025-09-06 06:30:46','2025-09-06 06:30:46'),(21,4,'am','address','համայնք Առինջ, Բ թաղամաս, տուն 7/12','2025-09-06 06:31:38','2025-09-06 06:31:38'),(22,4,'ru','address','община Ариндж, район Б, дом 7/12','2025-09-06 06:31:38','2025-09-06 06:31:38'),(23,5,'am','address','համայնք Առինջ, Բ թաղամաս, տուն 7/6','2025-09-06 06:32:35','2025-09-06 06:32:35'),(24,5,'ru','address','община Ариндж, район Б, дом 7/6','2025-09-06 06:32:35','2025-09-06 06:32:35'),(25,6,'am','address','համայնք Առինջ, Բ թաղամաս, տուն 7/13','2025-09-06 06:33:39','2025-09-06 06:33:39'),(26,6,'ru','address','община Ариндж, район Б, дом 7/13','2025-09-06 06:33:39','2025-09-06 06:33:39'),(27,7,'am','address','համայնք Առինջ, Բ թաղամաս, տուն 7/14','2025-09-06 06:34:31','2025-09-06 06:34:31'),(28,7,'ru','address','община Ариндж, район Б, дом 7/14','2025-09-06 06:34:31','2025-09-06 06:34:31'),(29,8,'am','address','համայնք Առինջ, Բ թաղամաս, տուն 7/15','2025-09-06 06:35:16','2025-09-06 06:35:16'),(30,8,'ru','address','община Ариндж, район Б, дом 7/15','2025-09-06 06:35:16','2025-09-06 06:35:16'),(31,9,'am','address','համայնք Առինջ, Բ թաղամաս, տուն 7/16','2025-09-06 06:36:09','2025-09-06 06:36:09'),(32,9,'ru','address','община Ариндж, район Б, дом 7/16','2025-09-06 06:36:09','2025-09-06 06:36:09'),(33,10,'am','address','համայնք Առինջ, Բ թաղամաս, տուն 7/17','2025-09-06 06:37:03','2025-09-06 06:37:03'),(34,10,'ru','address','община Ариндж, район Б, дом 7/17','2025-09-06 06:37:03','2025-09-06 06:37:03'),(35,11,'am','address','համայնք Առինջ, Բ թաղամաս, տուն 7/18','2025-09-06 06:38:10','2025-09-06 06:38:10'),(36,11,'ru','address','община Ариндж, район Б, дом 7/18','2025-09-06 06:38:10','2025-09-06 06:38:10'),(37,12,'am','address','համայնք Առինջ, Բ թաղամաս, տուն 7/19','2025-09-06 06:39:32','2025-09-06 06:39:32'),(38,12,'ru','address','община Ариндж, район Б, дом 7/19','2025-09-06 06:39:32','2025-09-06 06:39:32'),(39,13,'am','address','համայնք Առինջ, Բ թաղամաս, տուն 7/7','2025-09-06 06:40:30','2025-09-06 06:40:30'),(40,13,'ru','address','община Ариндж, район Б, дом 7/7','2025-09-06 06:40:30','2025-09-06 06:40:30'),(41,14,'am','address','համայնք Առինջ, Բ թաղամաս, տուն 7/10','2025-09-06 06:41:54','2025-09-06 06:41:54'),(42,14,'ru','address','община Ариндж, район Б, дом 7/10','2025-09-06 06:41:54','2025-09-06 06:41:54'),(43,15,'am','address','համայնք Առինջ, Բ թաղամաս, տուն 7/29','2025-09-06 06:42:37','2025-09-06 06:42:37'),(44,15,'ru','address','община Ариндж, район Б, дом 7/29','2025-09-06 06:42:37','2025-09-06 06:42:37'),(45,16,'am','address','համայնք Առինջ, Բ թաղամաս, տուն 7/30','2025-09-06 06:43:19','2025-09-06 06:43:19'),(46,16,'ru','address','община Ариндж, район Б, дом 7/30','2025-09-06 06:43:19','2025-09-06 06:43:19');
/*!40000 ALTER TABLE `house_translations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `houses`
--

DROP TABLE IF EXISTS `houses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `houses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `design_id` bigint unsigned DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','active','reserved','sold') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `price` double NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `old_status` enum('pending','active','reserved','sold') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `terrace_size` double DEFAULT NULL,
  `plot_size` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `houses_design_id_foreign` (`design_id`),
  CONSTRAINT `houses_design_id_foreign` FOREIGN KEY (`design_id`) REFERENCES `designs` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `houses`
--

LOCK TABLES `houses` WRITE;
/*!40000 ALTER TABLE `houses` DISABLE KEYS */;
INSERT INTO `houses` VALUES (1,1,'townhouse','pending',0,'2025-09-04 15:27:10','2025-09-06 06:43:28','active',42,0),(2,1,'townhouse','pending',0,'2025-09-06 06:29:14','2025-09-06 06:29:14',NULL,67,0),(3,1,'townhouse','active',0,'2025-09-06 06:30:46','2025-09-06 06:43:32',NULL,42,0),(4,1,'townhouse','active',0,'2025-09-06 06:31:38','2025-09-06 06:43:33',NULL,42,0),(5,1,'townhouse','pending',0,'2025-09-06 06:32:35','2025-09-06 06:32:35',NULL,67,0),(6,1,'townhouse','pending',0,'2025-09-06 06:33:39','2025-09-06 06:33:39',NULL,42,0),(7,1,'townhouse','pending',0,'2025-09-06 06:34:31','2025-09-06 06:34:31',NULL,42,0),(8,1,'townhouse','pending',0,'2025-09-06 06:35:16','2025-09-06 06:35:16',NULL,42,0),(9,1,'townhouse','pending',0,'2025-09-06 06:36:09','2025-09-06 06:36:09',NULL,97,0),(10,1,'townhouse','pending',0,'2025-09-06 06:37:03','2025-09-06 06:37:03',NULL,42,0),(11,1,'townhouse','reserved',0,'2025-09-06 06:38:10','2025-09-08 18:16:42',NULL,42,0),(12,1,'townhouse','pending',0,'2025-09-06 06:39:32','2025-09-06 06:39:32',NULL,67,0),(13,1,'townhouse','pending',0,'2025-09-06 06:40:30','2025-09-06 06:40:30',NULL,42,0),(14,1,'townhouse','pending',0,'2025-09-06 06:41:54','2025-09-06 06:41:54',NULL,42,0),(15,1,'townhouse','sold',0,'2025-09-06 06:42:37','2025-09-07 08:13:37',NULL,42,0),(16,1,'townhouse','pending',0,'2025-09-06 06:43:19','2025-09-06 06:43:19',NULL,42,0);
/*!40000 ALTER TABLE `houses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `images`
--

DROP TABLE IF EXISTS `images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `table` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `relation_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `extension` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `images`
--

LOCK TABLES `images` WRITE;
/*!40000 ALTER TABLE `images` DISABLE KEYS */;
INSERT INTO `images` VALUES (1,'buildings','1','buildings/1/ecfa0a1c-bc50-4c47-962e-8813a75f8d59.jpg','jpg','2025-09-04 13:16:05','2025-09-04 13:16:05'),(2,'buildings','1','buildings/1/e06671ed-4ebc-43f6-803b-d52373afbd8d.jpg','jpg','2025-09-04 13:16:25','2025-09-04 13:16:25'),(3,'buildings','1','buildings/1/782b190d-7509-462c-bad7-98709d4ab96f.jpg','jpg','2025-09-04 13:16:30','2025-09-04 13:16:30'),(4,'buildings','1','buildings/1/d7f312cc-d36d-4453-8a92-1249dcefeaa2.jpg','jpg','2025-09-04 13:16:36','2025-09-04 13:16:36'),(5,'buildings','1','buildings/1/1d77ebc7-bd81-403b-9dfb-09e3bfbe2a25.jpg','jpg','2025-09-04 13:16:40','2025-09-04 13:16:40'),(6,'buildings','1','buildings/1/850fd6a5-a0b6-4e97-b0cb-bb6e0f0d37e3.jpg','jpg','2025-09-04 13:17:01','2025-09-04 13:17:01'),(8,'buildings','1','buildings/1/628f313a-e587-4efc-9a15-6808a3d67b6d.jpg','jpg','2025-09-04 13:17:34','2025-09-04 13:17:34'),(9,'buildings','1','buildings/1/7cb6abf4-fdb9-4505-89cd-a000c70d952c.jpg','jpg','2025-09-04 13:17:41','2025-09-04 13:17:41'),(10,'buildings','1','buildings/1/974b9555-365e-461a-8d88-6b3d881bb677.jpg','jpg','2025-09-04 13:17:47','2025-09-04 13:17:47'),(11,'buildings','1','buildings/1/bcd9f429-4e46-441d-8580-fb22b59c15d5.jpg','jpg','2025-09-04 13:17:51','2025-09-04 13:17:51'),(12,'designs','1','designs/1/c0c935ed-4afa-48e9-ab69-dc295cb42402.jpg','jpg','2025-09-04 15:09:15','2025-09-04 15:09:15'),(13,'designs','1','designs/1/9990ac95-6bec-4f80-bcc1-c469ce4f046d.jpg','jpg','2025-09-04 15:09:24','2025-09-04 15:09:24'),(14,'designs','1','designs/1/f06f59bb-a09a-4132-a444-aa811508ceea.jpg','jpg','2025-09-04 15:09:30','2025-09-04 15:09:30'),(15,'designs','1','designs/1/e3841bd4-0fbd-4fda-926a-e2286eee13cd.jpg','jpg','2025-09-04 15:09:50','2025-09-04 15:09:50'),(16,'designs','1','designs/1/0ac82e1b-03c7-4259-bf10-1d761c5ca64c.jpg','jpg','2025-09-04 15:09:58','2025-09-04 15:09:58'),(17,'buildings','2','buildings/2/84f45eb1-12e9-40dc-b0a2-7f166760b529.png','png','2025-09-06 05:32:39','2025-09-06 05:32:39'),(18,'buildings','2','buildings/2/73bd6579-333d-4c7c-a112-75089d037c1f.png','png','2025-09-06 05:32:39','2025-09-06 05:32:39'),(19,'buildings','2','buildings/2/4f280540-58ba-4d7a-a17e-3f12e7ee82a2.png','png','2025-09-06 05:32:39','2025-09-06 05:32:39'),(20,'buildings','2','buildings/2/5c859aed-a601-4566-a462-e18ca6ac128b.png','png','2025-09-06 05:32:50','2025-09-06 05:32:50'),(21,'buildings','2','buildings/2/3379cf72-c753-4931-bdfc-82d9ff69a114.png','png','2025-09-06 05:32:55','2025-09-06 05:32:55'),(22,'buildings','2','buildings/2/02a19b6c-41c1-448f-a46c-67f1440834b8.png','png','2025-09-06 05:33:00','2025-09-06 05:33:00'),(23,'buildings','2','buildings/2/f4549fc2-1ce3-4127-8c9f-7c705817b71b.png','png','2025-09-06 05:33:06','2025-09-06 05:33:06'),(24,'buildings','2','buildings/2/cc3e3553-33af-41f3-9712-0650fd5c82ae.png','png','2025-09-06 05:33:11','2025-09-06 05:33:11'),(25,'buildings','2','buildings/2/fa16a80f-9966-4b92-bf0f-ec7039165cba.png','png','2025-09-06 05:33:15','2025-09-06 05:33:15'),(26,'buildings','2','buildings/2/4a1a35eb-45fa-4adf-acb9-f16ae69670ac.png','png','2025-09-06 05:33:20','2025-09-06 05:33:20'),(27,'buildings','2','buildings/2/061a3db6-58a3-4743-9cc1-217549372212.png','png','2025-09-06 05:33:24','2025-09-06 05:33:24'),(28,'buildings','2','buildings/2/28b33333-0a90-4388-bc08-fc10a9d98df9.png','png','2025-09-06 05:33:30','2025-09-06 05:33:30'),(29,'buildings','2','buildings/2/9747b2da-53b2-4c1b-9ba6-2640f73b79d1.png','png','2025-09-06 05:33:34','2025-09-06 05:33:34'),(30,'buildings','2','buildings/2/d318bd01-31d9-4296-9b24-9e4a9efcce52.png','png','2025-09-06 05:33:39','2025-09-06 05:33:39'),(31,'buildings','2','buildings/2/e41098e4-7b1e-46a1-955e-bfbb9700b221.png','png','2025-09-06 05:33:43','2025-09-06 05:33:43'),(32,'buildings','2','buildings/2/7f179633-ab40-4426-afcf-03a1f7d26c79.png','png','2025-09-06 05:33:48','2025-09-06 05:33:48'),(33,'buildings','2','buildings/2/afa028e4-e7d8-41d3-a555-6ba84070974e.png','png','2025-09-06 05:33:53','2025-09-06 05:33:53');
/*!40000 ALTER TABLE `images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2025_08_13_093615_create_personal_access_tokens_table',1),(5,'2025_08_13_094603_create_permission_tables',1),(6,'2025_08_14_090051_create_pages_table',1),(7,'2025_08_17_141014_alter_users_table_soft_deletes',1),(8,'2025_08_31_092624_create_buildings_table',1),(9,'2025_08_31_092726_create_translation_keys_table',1),(10,'2025_08_31_092730_create_translations_table',1),(11,'2025_08_31_092913_create_blocks_table',1),(12,'2025_08_31_093514_create_floors_table',1),(13,'2025_08_31_093623_create_apartments_table',1),(14,'2025_09_02_083603_create_images_table',1),(15,'2025_09_02_142940_add_unique_for_floors_table',1),(16,'2025_09_02_151736_alter_apartments_table_image_fields',1),(17,'2025_09_03_062623_alter_apartment_additional_fields',1),(18,'2025_09_03_081621_create_designs_table',1),(19,'2025_09_03_090317_create_houses_table',1),(20,'2025_09_03_090701_create_house_floors_table',1),(21,'2025_09_03_091834_create_house_translations_table',1),(22,'2025_09_04_111651_alter_houses_table_old_status_field',1),(23,'2025_09_04_151617_alter_houses_table_additional_fields',2),(24,'2025_09_04_153646_alter_buildings_table_main_image_id_field',3),(25,'2025_09_05_065325_create_requests_table',4),(42,'2025_09_06_063640_create_building_garages_table',5),(49,'2025_09_06_064451_create_residents_table',6),(50,'2025_09_06_064547_create_apartment_sales_table',6),(51,'2025_09_06_113954_alter_requests_table_from_staff_field',7),(52,'2025_09_07_084624_apartments_and_sales_additional',8);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `model_has_permissions`
--

DROP TABLE IF EXISTS `model_has_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `model_has_permissions` (
  `permission_id` bigint unsigned NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `model_has_permissions`
--

LOCK TABLES `model_has_permissions` WRITE;
/*!40000 ALTER TABLE `model_has_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `model_has_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `model_has_roles`
--

DROP TABLE IF EXISTS `model_has_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `model_has_roles` (
  `role_id` bigint unsigned NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `model_has_roles`
--

LOCK TABLES `model_has_roles` WRITE;
/*!40000 ALTER TABLE `model_has_roles` DISABLE KEYS */;
INSERT INTO `model_has_roles` VALUES (1,'App\\Models\\User',1);
/*!40000 ALTER TABLE `model_has_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pages`
--

DROP TABLE IF EXISTS `pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `permissions` json DEFAULT NULL,
  `sort` int unsigned NOT NULL DEFAULT '0',
  `parent_id` bigint unsigned DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pages_key_unique` (`key`),
  KEY `pages_parent_id_foreign` (`parent_id`),
  CONSTRAINT `pages_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `pages` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pages`
--

LOCK TABLES `pages` WRITE;
/*!40000 ALTER TABLE `pages` DISABLE KEYS */;
INSERT INTO `pages` VALUES (1,'dashboard','Dashboard','/','Squares2X2Icon',NULL,0,NULL,1,'2025-09-04 11:55:37','2025-09-04 11:55:37'),(2,'role_management','Role Management','/access','Cog6ToothIcon','[\"pages.manage\", \"roles.view\"]',50,NULL,1,'2025-09-04 11:55:37','2025-09-04 11:55:37'),(3,'pages','Pages','/pages','RectangleGroupIcon','[\"pages.manage\"]',0,2,1,'2025-09-04 11:55:37','2025-09-04 11:55:37'),(4,'roles','Roles','/roles','ShieldCheckIcon','[\"roles.view\"]',1,2,1,'2025-09-04 11:55:37','2025-09-04 11:55:37'),(5,'users','Users','/users','UserGroupIcon','[\"users.manage\"]',0,2,1,'2025-09-04 11:55:37','2025-09-04 11:55:37'),(6,'buildings','Buildings','/buildings','BuildingLibraryIcon','[\"buildings.manage\", \"buildings.view\"]',0,NULL,1,'2025-09-04 11:55:37','2025-09-04 11:55:37'),(7,'apartments','Apartments','/apartments','BuildingOfficeIcon','[\"apartments.manage\"]',0,NULL,1,'2025-09-04 11:55:37','2025-09-04 11:55:37'),(8,'houses','Houses','/houses','HomeIcon','[\"houses.manage\"]',0,NULL,1,'2025-09-04 11:55:37','2025-09-04 11:55:37'),(9,'requests','Requests','/requests','InboxArrowDownIcon','[\"requests.manage\"]',0,NULL,1,'2025-09-05 09:25:50','2025-09-05 09:25:50'),(10,'sales','Sales','/sales','BanknotesIcon','[\"sales.manage\"]',0,NULL,1,'2025-09-06 18:50:43','2025-09-06 18:50:43'),(11,'residents','Residents','/residents','UsersIcon','[\"residents.manage\"]',0,NULL,1,'2025-09-06 18:50:43','2025-09-06 18:50:43');
/*!40000 ALTER TABLE `pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'pages.manage','api','2025-09-04 11:55:36','2025-09-04 11:55:36'),(2,'roles.view','api','2025-09-04 11:55:37','2025-09-04 11:55:37'),(3,'roles.manage','api','2025-09-04 11:55:37','2025-09-04 11:55:37'),(4,'permissions.view','api','2025-09-04 11:55:37','2025-09-04 11:55:37'),(5,'permissions.manage','api','2025-09-04 11:55:37','2025-09-04 11:55:37'),(6,'apartments.manage','api','2025-09-08 18:18:40','2025-09-08 18:18:40'),(7,'apartments.view','api','2025-09-08 18:18:40','2025-09-08 18:18:40'),(8,'buildings.manage','api','2025-09-08 18:18:40','2025-09-08 18:18:40'),(9,'buildings.view','api','2025-09-08 18:18:40','2025-09-08 18:18:40'),(10,'designs.manage','api','2025-09-08 18:18:40','2025-09-08 18:18:40'),(11,'garages.manage','api','2025-09-08 18:18:40','2025-09-08 18:18:40'),(12,'garages.view','api','2025-09-08 18:18:40','2025-09-08 18:18:40'),(13,'houses.manage','api','2025-09-08 18:18:40','2025-09-08 18:18:40'),(14,'requests.manage','api','2025-09-08 18:18:40','2025-09-08 18:18:40'),(15,'sales.manage','api','2025-09-08 18:18:40','2025-09-08 18:18:40'),(16,'users.manage','api','2025-09-08 18:18:40','2025-09-08 18:18:40'),(17,'users.view','api','2025-09-08 18:18:40','2025-09-08 18:18:40');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\User',1,'dev','e95ad938dec5a43f6b9463a532b715e05631235aee241fdc5d78f6b296dee3ce','[\"*\"]',NULL,NULL,'2025-09-04 11:55:59','2025-09-04 11:55:59'),(2,'App\\Models\\User',1,'api','28f8e738d7e34c9220e366c91b2bcd57cd340dbe5472fb5eec316c232b236c14','[\"*\"]','2025-09-08 18:23:31',NULL,'2025-09-04 11:56:09','2025-09-08 18:23:31');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `requests`
--

DROP TABLE IF EXISTS `requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `requests` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `relation_id` int NOT NULL,
  `locale` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `from_staff` tinyint(1) NOT NULL DEFAULT '0',
  `preferred_price` decimal(8,2) DEFAULT NULL,
  `comments` text COLLATE utf8mb4_unicode_ci,
  `building_garage_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `requests_building_garage_id_foreign` (`building_garage_id`),
  CONSTRAINT `requests_building_garage_id_foreign` FOREIGN KEY (`building_garage_id`) REFERENCES `building_garages` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `requests`
--

LOCK TABLES `requests` WRITE;
/*!40000 ALTER TABLE `requests` DISABLE KEYS */;
INSERT INTO `requests` VALUES (15,'apartments',1,'am','asdasd','+37494465633','2025-09-06 13:00:31','2025-09-06 14:09:12',1,380000.00,NULL,NULL),(16,'apartments',1,'am','asdasdasd','+37494465634','2025-09-07 07:54:25','2025-09-07 07:54:25',1,NULL,NULL,NULL),(18,'apartments',15,'am','tersasfsdf','+37494465634','2025-09-07 08:07:47','2025-09-07 08:07:47',1,NULL,NULL,NULL),(19,'apartments',1,'am','asdasdasdasd','+37494465634','2025-09-08 10:51:41','2025-09-08 10:51:41',1,390000.00,NULL,NULL),(20,'apartments',11,'am','asdasdasd','+37494465634','2025-09-08 18:16:42','2025-09-08 18:16:42',1,NULL,NULL,NULL);
/*!40000 ALTER TABLE `requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `residents`
--

DROP TABLE IF EXISTS `residents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `residents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `residents`
--

LOCK TABLES `residents` WRITE;
/*!40000 ALTER TABLE `residents` DISABLE KEYS */;
INSERT INTO `residents` VALUES (3,'asdasdasd','+37494465634','2025-09-07 08:13:37','2025-09-07 08:13:37');
/*!40000 ALTER TABLE `residents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_has_permissions`
--

DROP TABLE IF EXISTS `role_has_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_has_permissions` (
  `permission_id` bigint unsigned NOT NULL,
  `role_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`role_id`),
  KEY `role_has_permissions_role_id_foreign` (`role_id`),
  CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_has_permissions`
--

LOCK TABLES `role_has_permissions` WRITE;
/*!40000 ALTER TABLE `role_has_permissions` DISABLE KEYS */;
INSERT INTO `role_has_permissions` VALUES (1,1),(2,1),(3,1),(4,1),(5,1);
/*!40000 ALTER TABLE `role_has_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'super-admin','api','2025-09-04 11:55:37','2025-09-04 11:55:37');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales`
--

DROP TABLE IF EXISTS `sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `block` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `request_id` bigint unsigned DEFAULT NULL,
  `resident_id` bigint unsigned DEFAULT NULL,
  `apartment_id` bigint unsigned DEFAULT NULL,
  `house_id` bigint unsigned DEFAULT NULL,
  `building_garage_id` bigint unsigned DEFAULT NULL,
  `price` decimal(12,2) DEFAULT NULL,
  `garage_price` decimal(12,2) DEFAULT NULL,
  `deposit` decimal(12,2) DEFAULT NULL,
  `repayment_months_quantity` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `sale_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sales_request_id_foreign` (`request_id`),
  KEY `sales_resident_id_foreign` (`resident_id`),
  KEY `sales_apartment_id_foreign` (`apartment_id`),
  KEY `sales_house_id_foreign` (`house_id`),
  KEY `sales_building_garage_id_foreign` (`building_garage_id`),
  CONSTRAINT `sales_apartment_id_foreign` FOREIGN KEY (`apartment_id`) REFERENCES `apartments` (`id`),
  CONSTRAINT `sales_building_garage_id_foreign` FOREIGN KEY (`building_garage_id`) REFERENCES `building_garages` (`id`),
  CONSTRAINT `sales_house_id_foreign` FOREIGN KEY (`house_id`) REFERENCES `houses` (`id`),
  CONSTRAINT `sales_request_id_foreign` FOREIGN KEY (`request_id`) REFERENCES `requests` (`id`),
  CONSTRAINT `sales_resident_id_foreign` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales`
--

LOCK TABLES `sales` WRITE;
/*!40000 ALTER TABLE `sales` DISABLE KEYS */;
INSERT INTO `sales` VALUES (1,'apartments',NULL,'canceled',NULL,NULL,1,NULL,NULL,NULL,NULL,0.00,NULL,'2025-09-06 17:48:16','2025-09-07 07:54:40',NULL),(2,'apartments',NULL,'canceled',NULL,NULL,1,NULL,NULL,NULL,NULL,0.00,NULL,'2025-09-07 07:54:25','2025-09-08 18:15:30','2025-09-08'),(3,'houses',NULL,'canceled',NULL,NULL,NULL,15,NULL,NULL,NULL,0.00,NULL,'2025-09-07 08:07:47','2025-09-07 08:10:24',NULL),(4,'houses',NULL,'canceled',NULL,3,NULL,15,NULL,50000000.00,NULL,5000000.00,36,'2025-09-07 08:13:37','2025-09-08 18:17:27',NULL),(5,'apartments','sale','canceled',NULL,3,135,NULL,1,56000000.00,500000.00,0.00,NULL,'2025-09-07 08:24:56','2025-09-08 18:17:34',NULL),(6,'apartments',NULL,'canceled',NULL,NULL,1,NULL,NULL,NULL,NULL,0.00,NULL,'2025-09-08 10:54:31','2025-09-08 18:17:30',NULL),(7,'apartments',NULL,'canceled',18,NULL,15,NULL,NULL,NULL,NULL,0.00,NULL,'2025-09-08 10:55:11','2025-09-08 18:17:32',NULL),(8,'houses',NULL,'canceled',20,NULL,NULL,11,NULL,NULL,NULL,0.00,NULL,'2025-09-08 18:16:42','2025-09-08 18:17:25','2025-09-08');
/*!40000 ALTER TABLE `sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('09EiJFJZTeztTqwGCaxzdBxhHya72cMMpnKi4FGb',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTo0OntzOjY6Il90b2tlbiI7czo0MDoiNHpaUW02NXdEaW9jSFdTVFN4OURzc0FEUGF4S3lEeXNUQXhZR2xNNCI7czoxMDoiX2NzcmZfYm9vdCI7YjoxO3M6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjMzOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvY3NyZi1jb29raWUiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1757318814),('1gQYIF7GT7UngEsxBZvEhlLmRWgF2l5wjurNnOjP',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiQlRjRUtyUjhJcmFnV1hwZXdYMmwyaG1OaWxiNWJmOHpvQ2FMRUYwOCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175977),('26UukkOuOVCPdb8GyZxPfKG8t4kwetuBgUb1Uf3I',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiT3RTWHFucU1ES2YzVlZRUEJha0hGWVZSYWVqcWYxSkRqaU5Nc0I1ZyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175765),('2DA9iQlIjSSFgCKJRwYlhpM1GuF81dcJIqHmsZbF',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoia3k4NVp0cVc2WWFaZWQ2SkJTcG1EWURwa3d6N0JESThrcWdYcmJ0NiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175977),('3fi5cIWQHvZcDYST0bpGiJfBt9RTi0UooDHDi1M4',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiOVN0dTdMYVg0RXV4cnZwMnRLdFRwTlZnYUZveW9ZUWY4S1hkMG5xTSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175782),('5oTrEkxgsXXj1O9fNBONwxuJynfaIO5iftqjUvNG',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiT3puRlFLWnZ4SUNtNGUwV3VVWTJSa3BxdEl4WlA3blE5clNFT2NidiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175366),('8KYj3UaRwEzZ2BQwJUjsCg1AF15i1uLEd3inUjZl',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiR21UTmxWVUc1djV0TlpGemZ0MmRQZEFyMEp0RGxPbzJIY3VmQTJ1YyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175594),('8LhmAntHcwKWTetmNxJX4sA6LJ2PiAG3MMgKKIxY',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoidUZwNzNlbzk1dzhwTzFjVVczd2NLN1g0RU1MMzlYSTZjMVhYd2lsWSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDg6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9ob3VzZXM/YXZhaWxhYmxlPTEmbGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175939),('8TvzVljlOyltnApRO2rCtXgQd5HPmRYfIKvDEtAC',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiaDB4TXI3S1FGVkdvbEM3QXZoSjJLNjg5MkpudHNjMWNobVRRUnd2WCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175690),('8y6zWQaJ5b2GC4WGKj13nF0rVEHh5KzthIxIDXUj',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoia3VMaWpUcXRWYnVXdTlyWXhuRFVWYWhFR3ZhSXVldk1zcHI4U0pXVSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175440),('9mhD8enCLjJLEANPN0w9FOrMNVtjLta93EjMQWX7',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTo0OntzOjY6Il90b2tlbiI7czo0MDoiT3hrWmdBSm15N1lYT2pHek53WU5uVVRUR1FqV2gzOWdnazhwTmtkWSI7czoxMDoiX2NzcmZfYm9vdCI7YjoxO3M6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjMzOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvY3NyZi1jb29raWUiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1757184549),('BvrdTqYCBh6KtjeNBwVYi8IrUoxA342IzacAQyzH',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoibjJ6V0g4cklDTml2NXhTWGN1TERtSzg0eEhseDBtRHJzOG5ybHJpQyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175700),('dxy41hubzMqnQGzPzjCNjH7Q9A2yaO4lS8PWEhcT',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiOHlnWG1La1NLczJmY05RbTdWNWxDcWc4M0wzWmxEaVBxWUhHNnFXSyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175700),('EOLbh1vQkuB3BWQJfWN0ThoGXKocN5yhpjBGavOy',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiYkFDTXZmZUdJUW1xckllZXJ1QmhXSHFMTjdVcFZxTW11YXhSWjllNSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175354),('fuT3cKBvmJx1KiLVeS5JoTB98OnTKrXjurLFNfMx',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTo0OntzOjY6Il90b2tlbiI7czo0MDoiUFRoQXQzU1d0eHpacE1lU2xRYjV0RUFZYUlheDZwUG9yc0xMeUU4MyI7czoxMDoiX2NzcmZfYm9vdCI7YjoxO3M6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjMzOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvY3NyZi1jb29raWUiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1757230556),('GDOOeDB1biG5dqcK0l6gQuK3sU6OsqTQWKIaEHqX',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTo0OntzOjY6Il90b2tlbiI7czo0MDoiUU9kS0tGanFweUZVNnNJMHpVNGdnRnYwcktZRFhyZzNLZlg5OXdjMCI7czoxMDoiX2NzcmZfYm9vdCI7YjoxO3M6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjMzOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvY3NyZi1jb29raWUiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1757230557),('GpzaXDncj2VuxoSpiDlDBdFJQ5yEvEnO49v758jh',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiQUx2Z1pCRVppd0w0d2duM1g4dW9kSzZIWUI4eTRua09xaE05SHpJQiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175934),('gRpxFTV0WCuNmx2jpmpOBrnLERgBQFxMQRjujTB3',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiRG4xcHRPc0pjMnpWQlVlSHhCNnhqTGloTWtpa1NLYUFIS0swQjhjZiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757176069),('gtYeBJ80kDQOZMGUm3fPnU8G7blVgKGLYgQCdAKA',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiQWdKR2xob1F5emlPVXdoQkQxWXV4Q3Z6T2kzTURySE94QmZyb2FDVyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175437),('hRmxWM4ABot1pfTPhnA9ppelrSWwomvLfJ5b7QhC',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoialVRYXNFMlpqa1p2QTRRTVFnVnBvMUV0OHo2MlhZeU1aMzZjY1lmaCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175612),('hxRIhIiwEoww81tFcRqys4iBE3vLjKEUTQ4Ttesm',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoib0I1MzgxcFZpN0Z6clhXQWJOdVlNTnpvODh6UlZYNW5HQmo2bVVUSyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175782),('jIli7vxYG77aSJUuP3CjHoM1dYPNahTKP9oA4L5l',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiQXZ5UW85bVR3cm9Eb05oemplS3VVTUV6WW5mcklUWTJIaHVEdjVZRyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757176290),('jlYBUqOaz5sDSA9FUQvjGulKugMTqmzHWvW39uih',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoib01pS0FLZE15dUtlV0wzclZ0OGg2Z2xCUVN1UlRROTMxdEZPSnJSdCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757176069),('ki8CXKdwupYckbbHHFJPmY04DeNLhFhPR5dyitIN',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiOW1CQmJmSDFjTGJoMEtqSjVueGdGWmlBWWJ4aEFlc0Z1TmdLZzdXWCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175442),('lmcoKh2LTVx6DmZ0PgC8V1w0zvVw6upDO8NrrpVB',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTo0OntzOjY6Il90b2tlbiI7czo0MDoiWU1mWjRHbUlMS2NoNXJFbndFNnBwNU9CamROcTVONnVHazRJZE1wTCI7czoxMDoiX2NzcmZfYm9vdCI7YjoxO3M6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjMzOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvY3NyZi1jb29raWUiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1757318813),('LUhu5LOF7W1gXVyKslTgYITbjmmyWKTrObyEBMie',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoia1lIb0xCcENSTU5kWTNZUmFWTGh2WjdiQ3J6YjRlWUlSMXhtU21CeiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757176415),('mH5ATCAXCCW8EUtvOrdbItjAWgYKUq0K5rhhv4jr',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoicDZkSmVpZTVZbG9lNEhSdmxLSTljb3lWdjR4eVJjd01IYjc0dktHOSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175366),('mOVpH67Sr7MMEqrxCTqv9IOjkBBYt0JBzXzYXMPS',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiWkFZajRhRnROSUZJSHNtcE1EQWNJYzR5bTNsRXJlN0lRWjNWcHBjUSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175382),('MQDqNidkKsPFnslbEdBnyjbq2BOLsW08inbfAiz7',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiWnFoSjlaNnlmbk5GWFJ3WXRqZFgyQ1paTzNLRmtzUnZNY2sxN2hqcSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175943),('MQT2OoYYC0b9oC3VBe56TiRWXTb515lBALHD0yHR',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiemFQS0t0anp1ZFhRYWxVMUt6Y3g2aWtzYUtLdlJidDFIWEJEU0szcSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175782),('N7ovmFTf6DHX5TZpBzQClbTLb5oOpJ5uytQOokbb',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiTmY0RHZ0RkxNQk4yVnlldW9JRjBNQngzWndiTHlMSWZBZHpNZFFNaSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175934),('Ni3PlOgz3YaoJNQskMWiaBtFNo7fH605QffHtReT',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoidkZ6bnRLQXNGaWhPT0NzOFAzblRkeHpxM25jUVRrUlk5WlZHVWp2MyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175500),('NVZKVamofHLSmfbATaDO5XpZrLpKHzFgXrLIEp2e',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiNXh6SEtxdUoyaUlwd3hWNmlFckhXSEZFRFRSaktkRXNuaHMzVXI3NSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757184549),('NzA3cQtlPkNdNzki1G489Z4KVrn4Wj5tE1Jz7IAv',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoidFdqRnBDSlk2VUFtOUF1Z2tMdGZjZ1hUWHVkUHU3S255NUI1UTdHcCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175500),('OSuT5iDP45f8I6Q967cHjblZ9ezvQ0Ol9uuNC3NZ',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiMUtzZlBuNFhIdEx3Zk1DNEN5cTlmalNGbnlQbHpjczRYRTZBdTR3eSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175782),('oX41ij7buRLbu7e7qvOgkhAbli7cLSlz5m3VcjvW',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiaUtrTE9OR2lHMlozN2FhODdHQzduTUNWTW9QTzh2WVRqWTZPS3FFMCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175765),('P0ucneLnP0ZHcN60eqQU3xgCrXTcmmYGIX0Hwzw2',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiUzZmVXN3eEtpRjZ5c0JQSGFiYUl0VGpVY3U4aUpTdXFqa2w3WXdMdiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175437),('Q8cfRlzl4VZE7eHlp6CPoKjqPFH7dK4dS0LogMox',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiZzhNb3A4S0s2b1BLZ2hvMWFxSERGSUxLeEdHTVRGNUxDbDJiTHpQRyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175448),('qdO0UwIr0ZOuvtbJs3szY4fpBe60CaV4EhoClKyV',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTo0OntzOjY6Il90b2tlbiI7czo0MDoiRDVzcFF3UWdkWGlwVVd3b2dHNFZLckFWT2lVWEd2VkhRQkl3Q2xDQyI7czoxMDoiX2NzcmZfYm9vdCI7YjoxO3M6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjMzOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvY3NyZi1jb29raWUiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1757176069),('Qij7AdKucpsIQBDJtPatfZoBCHwJWAC5x85VKeyS',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiOHIxS3ZLQVNTRUdlcUVKRXlmdVJjQnJrMUlRYnFwcm1qRjZrOGdNNyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175690),('SJhh9jnXNTduNpEJvsiAreJtkEvTsG2HTka48sgQ',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiZFllTHlIYVZPRFJGN3RmbUdkaWMzNjgzaEJxdUVab1hxYkptQ04weiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175442),('SMwNFNuKIRlQizlqGvY05EBWECRkFC1GN5VD5fdW',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoicVVBQW1kcVU2Z3A3bUhRbjZGOFVlN1VuQ3c4OE8wY1RVb2FoaUp5SyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDg6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9ob3VzZXM/YXZhaWxhYmxlPTEmbGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175944),('StESDUscSnEjNW9g1wNMNPf7o5bDsr4gI9O9WC2W',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiOURYeWZvTXVsWUFJenNPbGduS0JYdjFkTkFEcWhlZ3BHSVZyUFM3TCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175354),('U29120QFkLvmyKVzhOIaNTPg8VF5lubsPIHO0wt7',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoidXhDS2NWbFZ2UW9jMzFaMnNDd1RMUUVlNXZ6V0tIUjNqRHpYUXhBTSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175595),('U9aEET7oEmNpHui7ho0RrJSnciPcJtaMDVFa5A2J',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiaUJLUUJJSkt2ZFVHcmY4d0JJeWNLRUpVWVR0Ymw2QmNpSmpTYWlMZiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757176356),('uCaC9UYU7xVTpgDgmv8kdG8vG6JxA9OTb5PFxf71',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoid0Jybzg4V09zY016eUdWd21JUVdhUmQyYm4zVUVDTEpkWWZncnowWCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757318813),('UH0zUPzs7oJX0eWQ0AWbBodApiSvTJjSNlrq8jQu',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiMWZqNG03NmVEc29yeTRkVzQ5ZkxiQWU3OWhRMjFWQzJBZ1l3NHZrSCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175612),('UPV76wfLMGu2YuPa65nWpwpjjAOHMqy2lrHFGu5F',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiRUhIOTJKOGdwRlN4cURuQjJPUEQyNnd1eThxMnFPRmUzWHpFbzI4biI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175440),('UY80PWqFVGIvhYfZuPQteLcmzKunJRw52L9HeZ2D',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiSm1wM1AwMDZhMUdGYjJuSjdFR3NxVHp2cVVuQWNnNGhvU2Q0aW1xeSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757230556),('VikpcL5ojh2alZ1k4drWCoSSTKBgDWoyXUNuRJF5',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiaVNybEdyak5aUzM2S2tCUFRpNXZQQnhmcUJncGQwb0hINDVWOWZObiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDg6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9ob3VzZXM/YXZhaWxhYmxlPTEmbGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757176071),('Vj9eZrgCNLTfEuND56efDfxfkAzJHN4d7L8HEQYu',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoieUNiYnE1aUtpYlM1RUFRNWJzRWdtSGkxWkVZZlI3SzNUUjREZ0VtSyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175943),('we1tdyk8KcDwqCaQwPcKizwePoAWmBETrIPc8gAh',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiYUpYNU1FZjFvS1hSZEYzenQ5eGJPdUVLSkljN3VXbTNDS1NMSFBGWiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757318813),('WGzPQHnLouMQusaXyTStAuDORx0zkh1dtc7BsUyg',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTo0OntzOjY6Il90b2tlbiI7czo0MDoiNGdYYlNOd2VobTRoVVdHdmpFSHFmQXpYd0tOOFhuRDhLa252OGEzaiI7czoxMDoiX2NzcmZfYm9vdCI7YjoxO3M6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjMzOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvY3NyZi1jb29raWUiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1757175448),('Wxf1UQXX5zesTcM6XKoDummbsZvGj9luoKE6oUhZ',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTo0OntzOjY6Il90b2tlbiI7czo0MDoiZHZFOU5RUEl0V2dRbzBwbE1ub3pZcVZkQ0lpamIySUVOU1dpV1paaCI7czoxMDoiX2NzcmZfYm9vdCI7YjoxO3M6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjMzOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvY3NyZi1jb29raWUiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1757175448),('xg9iIsiA3Pp1f2t3ybOMhx2BzxxygKlRwPJsbYT5',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiTTJPMndNbDhjMUJGVHh6UjI4QUUxWkZPR0lhanM4UFcwbXRzdEVQYyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757230557),('XQc87yypskMQZRrHfGsqCbYLEfm25xJQOu6LYIDq',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTo0OntzOjY6Il90b2tlbiI7czo0MDoibmxMVWVDNDdHcUEwOVJvYVRNRm9aMTBWdXcxWWhtMG9TenRpMGhiMiI7czoxMDoiX2NzcmZfYm9vdCI7YjoxO3M6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjMzOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvY3NyZi1jb29raWUiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1757184549),('XyVFCqWZthKD2UmobhfAzLPFSx8a0xWkUeehYQX9',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiOWxtUW1DT0hEdVNGWjE1T0NuaWhHTkFpMjFTdjNVU0tySjBLTzNhUyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175448),('y3Blo06BFFfVTDyuFZ00JdbxJKlnhxlb8K0aI52s',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiR1FVc0xaODc3dXhmTmpjRm5yUlBLQnFXOUVxZlhKVk1tbmFPUzVGZCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDg6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9ob3VzZXM/YXZhaWxhYmxlPTEmbGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757175977),('Z4MU6t3R8936SNHStUZBthNVjqOhtCvj8TBUlQSb',NULL,'172.22.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiRkw1YlVjS2ZaSVplRGh1cUxwcjVqZVdUM0hlT1I3YkNEeVp3dGNmNSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idWlsZGluZ3M/bGFuZz1oeSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1757184549);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `translation_keys`
--

DROP TABLE IF EXISTS `translation_keys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `translation_keys` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `table_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `translation_keys`
--

LOCK TABLES `translation_keys` WRITE;
/*!40000 ALTER TABLE `translation_keys` DISABLE KEYS */;
INSERT INTO `translation_keys` VALUES (1,'buildings','name','2025-09-04 11:55:52','2025-09-04 11:55:52'),(2,'buildings','address','2025-09-04 11:55:52','2025-09-04 11:55:52');
/*!40000 ALTER TABLE `translation_keys` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `translations`
--

DROP TABLE IF EXISTS `translations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `translations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `relation_id` bigint unsigned NOT NULL,
  `key_id` bigint unsigned NOT NULL,
  `locale` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `translations_key_id_foreign` (`key_id`),
  CONSTRAINT `translations_key_id_foreign` FOREIGN KEY (`key_id`) REFERENCES `translation_keys` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=137 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `translations`
--

LOCK TABLES `translations` WRITE;
/*!40000 ALTER TABLE `translations` DISABLE KEYS */;
INSERT INTO `translations` VALUES (85,1,1,'am','ՄԻԼՈՆ ԹԱՈՒԵՐ ՀԱՄԱԼԻՐ','2025-09-04 14:51:51','2025-09-04 14:51:51'),(86,1,2,'am','Կոտայքի մարզ, ք․ Աբովյան, Բարեկամության հրապարակ, 5/1','2025-09-04 14:51:51','2025-09-04 14:51:51'),(87,1,1,'ru','ЖК «Милон Тауэр»','2025-09-04 14:51:51','2025-09-04 14:51:51'),(88,1,2,'ru','Котайкский марз, г. Абовян, площадь Дружбы, д. 5/1','2025-09-04 14:51:51','2025-09-04 14:51:51'),(133,2,1,'am',' ՄԻԼՈՆ ՀԻԼԼՍ ԹԱՂԱՄԱՍ','2025-09-06 05:53:24','2025-09-06 05:53:24'),(134,2,1,'ru','Район Майлон-Хиллз','2025-09-06 05:53:24','2025-09-06 05:53:24'),(135,2,2,'am','Կոտայքի մարզ, գ․Առինջ Բ թաղամաս, 1-ին փ., թիվ 7','2025-09-06 05:53:24','2025-09-06 05:53:24'),(136,2,2,'ru','Котайкская область, село Ариндж, микрорайон Б, 1-я улица, дом 7','2025-09-06 05:53:24','2025-09-06 05:53:24');
/*!40000 ALTER TABLE `translations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Super Admin','admin@example.com',NULL,'$2y$12$05AYrDen1SqnEU8ZZatbJeXeEgut5WFpRv/syL3/SjRSHTPo9xX66',NULL,'2025-09-04 11:55:59','2025-09-04 11:55:59',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-08 22:27:41
