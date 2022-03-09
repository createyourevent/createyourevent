-- MySQL dump 10.13  Distrib 5.7.34, for Linux (x86_64)
--
-- Host: localhost    Database: createyourevent
-- ------------------------------------------------------
-- Server version	5.7.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `address` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `lat` float DEFAULT NULL,
  `lng` float DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `admin_fees_price`
--

DROP TABLE IF EXISTS `admin_fees_price`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin_fees_price` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `fees_organisator` float DEFAULT NULL,
  `fees_supplier` float DEFAULT NULL,
  `fees_service` float DEFAULT NULL,
  `fees_organizations` float DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bond`
--

DROP TABLE IF EXISTS `bond`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bond` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` longtext,
  `code` varchar(255) DEFAULT NULL,
  `points` bigint(20) DEFAULT NULL,
  `creation_date` datetime(6) DEFAULT NULL,
  `redemption_date` datetime(6) DEFAULT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  `points_exchange_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_bond__user_id` (`user_id`),
  KEY `fk_bond__points_exchange_id` (`points_exchange_id`),
  CONSTRAINT `fk_bond__points_exchange_id` FOREIGN KEY (`points_exchange_id`) REFERENCES `points_exchange` (`id`),
  CONSTRAINT `fk_bond__user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `building`
--

DROP TABLE IF EXISTS `building`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `building` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `surface` float DEFAULT NULL,
  `organization_id` bigint(20) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_building__organization_id` (`organization_id`),
  KEY `FK6jn8ubepqc5bn3ifvp3wwom70` (`user_id`),
  CONSTRAINT `FK6jn8ubepqc5bn3ifvp3wwom70` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`),
  CONSTRAINT `fk_building__organization_id` FOREIGN KEY (`organization_id`) REFERENCES `organization` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cart` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `date` datetime(6) DEFAULT NULL,
  `total_costs` float DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `chips`
--

DROP TABLE IF EXISTS `chips`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chips` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `points` int(11) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `x` int(11) DEFAULT NULL,
  `y` int(11) DEFAULT NULL,
  `image` longblob,
  `image_content_type` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `chips_admin`
--

DROP TABLE IF EXISTS `chips_admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chips_admin` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `game_active` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `chips_collection`
--

DROP TABLE IF EXISTS `chips_collection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chips_collection` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_chips_collection__user_id` (`user_id`),
  CONSTRAINT `fk_chips_collection__user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `chips_collection_chips`
--

DROP TABLE IF EXISTS `chips_collection_chips`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chips_collection_chips` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `chips_collection_id` bigint(20) DEFAULT NULL,
  `chips_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_chips_collection_chips__chips_collection_id` (`chips_collection_id`),
  KEY `fk_chips_collection_chips__chips_id` (`chips_id`),
  CONSTRAINT `fk_chips_collection_chips__chips_collection_id` FOREIGN KEY (`chips_collection_id`) REFERENCES `chips_collection` (`id`),
  CONSTRAINT `fk_chips_collection_chips__chips_id` FOREIGN KEY (`chips_id`) REFERENCES `chips` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `club`
--

DROP TABLE IF EXISTS `club`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `club` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `price_card` longtext,
  `organization_id` bigint(20) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UC_CLUBORGANIZATION_ID_COL` (`organization_id`),
  KEY `FK1v1qxxd7u28gliu1c5t1opo5m` (`user_id`),
  CONSTRAINT `FK1v1qxxd7u28gliu1c5t1opo5m` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`),
  CONSTRAINT `FKeg2cr5u2o2l8423b6nn4der6d` FOREIGN KEY (`organization_id`) REFERENCES `organization` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `contact`
--

DROP TABLE IF EXISTS `contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contact` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `message` longtext NOT NULL,
  `date` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `coupon`
--

DROP TABLE IF EXISTS `coupon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `coupon` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `value` float DEFAULT NULL,
  `event_id` bigint(20) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `coupon_nr` varchar(255) DEFAULT NULL,
  `description` longtext,
  `title` varchar(255) DEFAULT NULL,
  `used` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKoh8ut30aphlkx6odcme33u4lw` (`event_id`),
  KEY `FKq098abtxuct1q9l27qhonc0fe` (`user_id`),
  CONSTRAINT `FKoh8ut30aphlkx6odcme33u4lw` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`),
  CONSTRAINT `FKq098abtxuct1q9l27qhonc0fe` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `create_your_event_service`
--

DROP TABLE IF EXISTS `create_your_event_service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `create_your_event_service` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `logo` longblob,
  `logo_content_type` varchar(255) DEFAULT NULL,
  `active` bit(1) DEFAULT NULL,
  `active_owner` bit(1) DEFAULT NULL,
  `description` longtext NOT NULL,
  `address` varchar(255) NOT NULL,
  `motto` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `web_address` varchar(255) DEFAULT NULL,
  `category` varchar(255) NOT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_create_your_event_service__user_id` (`user_id`),
  CONSTRAINT `fk_create_your_event_service__user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `databasechangelog`
--

DROP TABLE IF EXISTS `databasechangelog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `databasechangelog` (
  `ID` varchar(255) NOT NULL,
  `AUTHOR` varchar(255) NOT NULL,
  `FILENAME` varchar(255) NOT NULL,
  `DATEEXECUTED` datetime NOT NULL,
  `ORDEREXECUTED` int(11) NOT NULL,
  `EXECTYPE` varchar(10) NOT NULL,
  `MD5SUM` varchar(35) DEFAULT NULL,
  `DESCRIPTION` varchar(255) DEFAULT NULL,
  `COMMENTS` varchar(255) DEFAULT NULL,
  `TAG` varchar(255) DEFAULT NULL,
  `LIQUIBASE` varchar(20) DEFAULT NULL,
  `CONTEXTS` varchar(255) DEFAULT NULL,
  `LABELS` varchar(255) DEFAULT NULL,
  `DEPLOYMENT_ID` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `databasechangeloglock`
--

DROP TABLE IF EXISTS `databasechangeloglock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `databasechangeloglock` (
  `ID` int(11) NOT NULL,
  `LOCKED` bit(1) NOT NULL,
  `LOCKGRANTED` datetime DEFAULT NULL,
  `LOCKEDBY` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `delivery_type`
--

DROP TABLE IF EXISTS `delivery_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `delivery_type` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `delivery_type` varchar(255) DEFAULT NULL,
  `minimum_order_quantity` float DEFAULT NULL,
  `price` float DEFAULT NULL,
  `price_per_kilometre` float DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_delivery_type__product_id` (`product_id`),
  CONSTRAINT `fk_delivery_type__product_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `date_start` datetime(6) NOT NULL,
  `date_end` datetime(6) NOT NULL,
  `category` varchar(255) NOT NULL,
  `price` float NOT NULL,
  `flyer` longblob,
  `flyer_content_type` varchar(255) DEFAULT NULL,
  `youtube` varchar(255) DEFAULT NULL,
  `private_or_public` varchar(255) NOT NULL,
  `active` bit(1) DEFAULT NULL,
  `min_placenumber` int(11) NOT NULL,
  `placenumber` int(11) NOT NULL,
  `investment` float NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `definitely_confirmed` bit(1) DEFAULT NULL,
  `motto` varchar(255) NOT NULL,
  `billed` bit(1) DEFAULT NULL,
  `stars` float DEFAULT NULL,
  `billed_organisator` bit(1) DEFAULT NULL,
  `billede_create_your_event` bit(1) DEFAULT NULL,
  `location_id` bigint(20) DEFAULT NULL,
  `event_detail_id` bigint(20) DEFAULT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_event__location_id` (`location_id`),
  UNIQUE KEY `ux_event__event_detail_id` (`event_detail_id`),
  KEY `fk_event__user_id` (`user_id`),
  CONSTRAINT `fk_event__event_detail_id` FOREIGN KEY (`event_detail_id`) REFERENCES `event_details` (`id`),
  CONSTRAINT `fk_event__location_id` FOREIGN KEY (`location_id`) REFERENCES `location` (`id`),
  CONSTRAINT `fk_event__user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `event_comment`
--

DROP TABLE IF EXISTS `event_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_comment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `comment` varchar(255) DEFAULT NULL,
  `date` datetime(6) DEFAULT NULL,
  `event_id` bigint(20) DEFAULT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  `event_comment_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_event_comment__event_id` (`event_id`),
  KEY `fk_event_comment__user_id` (`user_id`),
  KEY `fk_event_comment__event_comment_id` (`event_comment_id`),
  CONSTRAINT `fk_event_comment__event_comment_id` FOREIGN KEY (`event_comment_id`) REFERENCES `event_comment` (`id`),
  CONSTRAINT `fk_event_comment__event_id` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`),
  CONSTRAINT `fk_event_comment__user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `event_details`
--

DROP TABLE IF EXISTS `event_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_details` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `total_entrance_fee` float DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `event_like_dislike`
--

DROP TABLE IF EXISTS `event_like_dislike`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_like_dislike` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `jhi_like` int(11) DEFAULT NULL,
  `dislike` int(11) DEFAULT NULL,
  `date` datetime(6) DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `event_id` bigint(20) DEFAULT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_event_like_dislike__event_id` (`event_id`),
  KEY `fk_event_like_dislike__user_id` (`user_id`),
  CONSTRAINT `fk_event_like_dislike__event_id` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`),
  CONSTRAINT `fk_event_like_dislike__user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `event_product_order`
--

DROP TABLE IF EXISTS `event_product_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_product_order` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `amount` int(11) DEFAULT NULL,
  `total` float DEFAULT NULL,
  `date` datetime(6) DEFAULT NULL,
  `rental_period` int(11) DEFAULT NULL,
  `date_from` datetime(6) DEFAULT NULL,
  `date_until` datetime(6) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `billed` bit(1) DEFAULT NULL,
  `seen` bit(1) DEFAULT NULL,
  `approved` bit(1) DEFAULT NULL,
  `selling_price` float DEFAULT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  `event_id` bigint(20) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `shop_id` bigint(20) DEFAULT NULL,
  `cart_id` bigint(20) DEFAULT NULL,
  `delivery_type_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_event_product_order__user_id` (`user_id`),
  KEY `fk_event_product_order__event_id` (`event_id`),
  KEY `fk_event_product_order__product_id` (`product_id`),
  KEY `fk_event_product_order__shop_id` (`shop_id`),
  KEY `fk_event_product_order__cart_id` (`cart_id`),
  KEY `fk_event_product_order__delivery_type_id` (`delivery_type_id`),
  CONSTRAINT `fk_event_product_order__cart_id` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`),
  CONSTRAINT `fk_event_product_order__delivery_type_id` FOREIGN KEY (`delivery_type_id`) REFERENCES `delivery_type` (`id`),
  CONSTRAINT `fk_event_product_order__event_id` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`),
  CONSTRAINT `fk_event_product_order__product_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `fk_event_product_order__shop_id` FOREIGN KEY (`shop_id`) REFERENCES `shop` (`id`),
  CONSTRAINT `fk_event_product_order__user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `event_product_rating`
--

DROP TABLE IF EXISTS `event_product_rating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_product_rating` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `jhi_like` int(11) DEFAULT NULL,
  `dislike` int(11) DEFAULT NULL,
  `date` datetime(6) DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `event_id` bigint(20) DEFAULT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_event_product_rating__product_id` (`product_id`),
  KEY `fk_event_product_rating__event_id` (`event_id`),
  KEY `fk_event_product_rating__user_id` (`user_id`),
  CONSTRAINT `fk_event_product_rating__event_id` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`),
  CONSTRAINT `fk_event_product_rating__product_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `fk_event_product_rating__user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `event_product_rating_comment`
--

DROP TABLE IF EXISTS `event_product_rating_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_product_rating_comment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `comment` varchar(255) DEFAULT NULL,
  `date` datetime(6) DEFAULT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  `event_id` bigint(20) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_event_product_rating_comment__user_id` (`user_id`),
  KEY `fk_event_product_rating_comment__event_id` (`event_id`),
  KEY `fk_event_product_rating_comment__product_id` (`product_id`),
  CONSTRAINT `fk_event_product_rating_comment__event_id` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`),
  CONSTRAINT `fk_event_product_rating_comment__product_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `fk_event_product_rating_comment__user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `event_service_map_order`
--

DROP TABLE IF EXISTS `event_service_map_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_service_map_order` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `date` datetime(6) DEFAULT NULL,
  `date_from` datetime(6) DEFAULT NULL,
  `date_until` datetime(6) DEFAULT NULL,
  `cost_hour` float DEFAULT NULL,
  `ride_costs` float DEFAULT NULL,
  `total` float DEFAULT NULL,
  `total_hours` varchar(255) DEFAULT NULL,
  `kilometre` float DEFAULT NULL,
  `billed` bit(1) DEFAULT NULL,
  `seen` bit(1) DEFAULT NULL,
  `approved` bit(1) DEFAULT NULL,
  `event_id` bigint(20) DEFAULT NULL,
  `service_map_id` bigint(20) DEFAULT NULL,
  `cart_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_event_service_map_order__event_id` (`event_id`),
  KEY `fk_event_service_map_order__service_map_id` (`service_map_id`),
  KEY `fk_event_service_map_order__cart_id` (`cart_id`),
  CONSTRAINT `fk_event_service_map_order__cart_id` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`),
  CONSTRAINT `fk_event_service_map_order__event_id` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`),
  CONSTRAINT `fk_event_service_map_order__service_map_id` FOREIGN KEY (`service_map_id`) REFERENCES `service_map` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `event_star_rating`
--

DROP TABLE IF EXISTS `event_star_rating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event_star_rating` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `stars` int(11) DEFAULT NULL,
  `date` datetime(6) DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `event_id` bigint(20) DEFAULT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_event_star_rating__event_id` (`event_id`),
  KEY `fk_event_star_rating__user_id` (`user_id`),
  CONSTRAINT `fk_event_star_rating__event_id` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`),
  CONSTRAINT `fk_event_star_rating__user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `fee_balance`
--

DROP TABLE IF EXISTS `fee_balance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fee_balance` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `date` datetime(6) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `total` float DEFAULT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_fee_balance__user_id` (`user_id`),
  CONSTRAINT `fk_fee_balance__user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `fee_transaction`
--

DROP TABLE IF EXISTS `fee_transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fee_transaction` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `date` datetime(6) DEFAULT NULL,
  `transaction_id_id` bigint(20) DEFAULT NULL,
  `event_product_order_id` bigint(20) DEFAULT NULL,
  `event_service_map_order_id` bigint(20) DEFAULT NULL,
  `event_id` bigint(20) DEFAULT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  `organization_reservation_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_fee_transaction__transaction_id_id` (`transaction_id_id`),
  UNIQUE KEY `ux_fee_transaction__event_product_order_id` (`event_product_order_id`),
  UNIQUE KEY `ux_fee_transaction__event_service_map_order_id` (`event_service_map_order_id`),
  UNIQUE KEY `ux_fee_transaction__event_id` (`event_id`),
  UNIQUE KEY `UC_FEE_TRANSACTIONORGANIZATION_RESERVATION_ID_COL` (`organization_reservation_id`),
  KEY `fk_fee_transaction__user_id` (`user_id`),
  CONSTRAINT `FK3inh4mp0df15eoty9v2fs8q6k` FOREIGN KEY (`organization_reservation_id`) REFERENCES `organization_reservation` (`id`),
  CONSTRAINT `fk_fee_transaction__event_id` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`),
  CONSTRAINT `fk_fee_transaction__event_product_order_id` FOREIGN KEY (`event_product_order_id`) REFERENCES `event_product_order` (`id`),
  CONSTRAINT `fk_fee_transaction__event_service_map_order_id` FOREIGN KEY (`event_service_map_order_id`) REFERENCES `event_service_map_order` (`id`),
  CONSTRAINT `fk_fee_transaction__transaction_id_id` FOREIGN KEY (`transaction_id_id`) REFERENCES `fee_transaction_id` (`id`),
  CONSTRAINT `fk_fee_transaction__user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `fee_transaction_entry`
--

DROP TABLE IF EXISTS `fee_transaction_entry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fee_transaction_entry` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) DEFAULT NULL,
  `value` float DEFAULT NULL,
  `fee_transaction_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_fee_transaction_entry__fee_transaction_id` (`fee_transaction_id`),
  CONSTRAINT `fk_fee_transaction_entry__fee_transaction_id` FOREIGN KEY (`fee_transaction_id`) REFERENCES `fee_transaction` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `fee_transaction_id`
--

DROP TABLE IF EXISTS `fee_transaction_id`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fee_transaction_id` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `transaction_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `gift`
--

DROP TABLE IF EXISTS `gift`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gift` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `photo` longblob NOT NULL,
  `photo_content_type` varchar(255) NOT NULL,
  `points` int(11) NOT NULL,
  `active` bit(1) DEFAULT NULL,
  `stock` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `gift_shopping_cart`
--

DROP TABLE IF EXISTS `gift_shopping_cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gift_shopping_cart` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `date` datetime(6) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  `gift_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_gift_shopping_cart__user_id` (`user_id`),
  KEY `fk_gift_shopping_cart__gift_id` (`gift_id`),
  CONSTRAINT `fk_gift_shopping_cart__gift_id` FOREIGN KEY (`gift_id`) REFERENCES `gift` (`id`),
  CONSTRAINT `fk_gift_shopping_cart__user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `hotel`
--

DROP TABLE IF EXISTS `hotel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hotel` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `menu` longtext,
  `places_to_sleep` int(11) DEFAULT NULL,
  `organization_id` bigint(20) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UC_HOTELORGANIZATION_ID_COL` (`organization_id`),
  KEY `FKbritelsifdyqtek94rvjd07u6` (`user_id`),
  CONSTRAINT `FK42qteok1auprsridwf0862d75` FOREIGN KEY (`organization_id`) REFERENCES `organization` (`id`),
  CONSTRAINT `FKbritelsifdyqtek94rvjd07u6` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `image`
--

DROP TABLE IF EXISTS `image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `image` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `image` longblob,
  `image_content_type` varchar(255) DEFAULT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `shop_id` bigint(20) DEFAULT NULL,
  `event_id` bigint(20) DEFAULT NULL,
  `service_id` bigint(20) DEFAULT NULL,
  `organization_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_image__user_id` (`user_id`),
  KEY `fk_image__product_id` (`product_id`),
  KEY `fk_image__shop_id` (`shop_id`),
  KEY `fk_image__event_id` (`event_id`),
  KEY `fk_image__service_id` (`service_id`),
  KEY `FK8f1nu7ddf47bra1oynwue7149` (`organization_id`),
  CONSTRAINT `FK8f1nu7ddf47bra1oynwue7149` FOREIGN KEY (`organization_id`) REFERENCES `organization` (`id`),
  CONSTRAINT `fk_image__event_id` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`),
  CONSTRAINT `fk_image__product_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `fk_image__service_id` FOREIGN KEY (`service_id`) REFERENCES `create_your_event_service` (`id`),
  CONSTRAINT `fk_image__shop_id` FOREIGN KEY (`shop_id`) REFERENCES `shop` (`id`),
  CONSTRAINT `fk_image__user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jhi_authority`
--

DROP TABLE IF EXISTS `jhi_authority`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jhi_authority` (
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jhi_chat_message`
--

DROP TABLE IF EXISTS `jhi_chat_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jhi_chat_message` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `message_type` bigint(20) DEFAULT NULL,
  `message_from` varchar(350) DEFAULT NULL,
  `message_to` varchar(350) DEFAULT NULL,
  `message` varchar(350) DEFAULT NULL,
  `date_sent` timestamp NULL DEFAULT NULL,
  `date_seen` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jhi_order`
--

DROP TABLE IF EXISTS `jhi_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jhi_order` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `status` varchar(255) DEFAULT NULL,
  `date_added` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jhi_user`
--

DROP TABLE IF EXISTS `jhi_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jhi_user` (
  `id` varchar(100) NOT NULL,
  `login` varchar(50) NOT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `image_url` varchar(256) DEFAULT NULL,
  `activated` bit(1) NOT NULL,
  `logged_in` bit(1) NOT NULL,
  `address` varchar(250) DEFAULT NULL,
  `phone` varchar(250) DEFAULT NULL,
  `iban` varchar(250) DEFAULT NULL,
  `bankname` varchar(250) DEFAULT NULL,
  `bankaddress` varchar(250) DEFAULT NULL,
  `points` bigint(20) DEFAULT NULL,
  `agb` bit(1) DEFAULT NULL,
  `lang_key` varchar(10) DEFAULT NULL,
  `created_by` varchar(50) NOT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `last_modified_by` varchar(50) DEFAULT NULL,
  `last_modified_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_user_login` (`login`),
  UNIQUE KEY `ux_user_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jhi_user_authority`
--

DROP TABLE IF EXISTS `jhi_user_authority`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jhi_user_authority` (
  `user_id` varchar(100) NOT NULL,
  `authority_name` varchar(50) NOT NULL,
  PRIMARY KEY (`user_id`,`authority_name`),
  KEY `fk_authority_name` (`authority_name`),
  CONSTRAINT `fk_authority_name` FOREIGN KEY (`authority_name`) REFERENCES `jhi_authority` (`name`),
  CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `location` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `photo` longblob,
  `photo_content_type` varchar(255) DEFAULT NULL,
  `address_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_location__address_id` (`address_id`),
  CONSTRAINT `fk_location__address_id` FOREIGN KEY (`address_id`) REFERENCES `address` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mp_3`
--

DROP TABLE IF EXISTS `mp_3`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mp_3` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `artists` varchar(255) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `shop_id` bigint(20) DEFAULT NULL,
  `event_id` bigint(20) DEFAULT NULL,
  `service_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_mp_3__user_id` (`user_id`),
  KEY `fk_mp_3__product_id` (`product_id`),
  KEY `fk_mp_3__shop_id` (`shop_id`),
  KEY `fk_mp_3__event_id` (`event_id`),
  KEY `fk_mp_3__service_id` (`service_id`),
  CONSTRAINT `fk_mp_3__event_id` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`),
  CONSTRAINT `fk_mp_3__product_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `fk_mp_3__service_id` FOREIGN KEY (`service_id`) REFERENCES `create_your_event_service` (`id`),
  CONSTRAINT `fk_mp_3__shop_id` FOREIGN KEY (`shop_id`) REFERENCES `shop` (`id`),
  CONSTRAINT `fk_mp_3__user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `organization`
--

DROP TABLE IF EXISTS `organization`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `organization` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `organization_type` varchar(255) NOT NULL,
  `logo` longblob,
  `logo_content_type` varchar(255) DEFAULT NULL,
  `active` bit(1) DEFAULT NULL,
  `description` longtext NOT NULL,
  `address` varchar(255) NOT NULL,
  `motto` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `web_address` varchar(255) DEFAULT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  `active_owner` bit(1) DEFAULT NULL,
  `place_number` int(11) DEFAULT NULL,
  `price` float DEFAULT NULL,
  `rent_type` varchar(255) DEFAULT NULL,
  `rentable` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_organization__user_id` (`user_id`),
  CONSTRAINT `fk_organization__user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `organization_comment`
--

DROP TABLE IF EXISTS `organization_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `organization_comment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `comment` varchar(255) DEFAULT NULL,
  `date` datetime(6) DEFAULT NULL,
  `event_id` bigint(20) DEFAULT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  `organization_comment_id` bigint(20) DEFAULT NULL,
  `organization_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_organization_comment__event_id` (`event_id`),
  KEY `fk_organization_comment__user_id` (`user_id`),
  KEY `FK9nsmwdrjx9bxh2o13h25f3iht` (`organization_comment_id`),
  KEY `FKa0q1kbpki637crnnykpjgdf5r` (`organization_id`),
  CONSTRAINT `FK9nsmwdrjx9bxh2o13h25f3iht` FOREIGN KEY (`organization_comment_id`) REFERENCES `organization_comment` (`id`),
  CONSTRAINT `FKa0q1kbpki637crnnykpjgdf5r` FOREIGN KEY (`organization_id`) REFERENCES `organization` (`id`),
  CONSTRAINT `fk_organization_comment__event_id` FOREIGN KEY (`event_id`) REFERENCES `organization` (`id`),
  CONSTRAINT `fk_organization_comment__user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `organization_like_dislike`
--

DROP TABLE IF EXISTS `organization_like_dislike`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `organization_like_dislike` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `jhi_like` int(11) DEFAULT NULL,
  `dislike` int(11) DEFAULT NULL,
  `date` datetime(6) DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `event_id` bigint(20) DEFAULT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  `organization_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_organization_like_dislike__event_id` (`event_id`),
  KEY `fk_organization_like_dislike__user_id` (`user_id`),
  KEY `FKeipvmlr75p5bmocs8yxg28lhl` (`organization_id`),
  CONSTRAINT `FKeipvmlr75p5bmocs8yxg28lhl` FOREIGN KEY (`organization_id`) REFERENCES `organization` (`id`),
  CONSTRAINT `fk_organization_like_dislike__event_id` FOREIGN KEY (`event_id`) REFERENCES `organization` (`id`),
  CONSTRAINT `fk_organization_like_dislike__user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `organization_reservation`
--

DROP TABLE IF EXISTS `organization_reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `organization_reservation` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `date` datetime(6) DEFAULT NULL,
  `date_from` datetime(6) DEFAULT NULL,
  `date_until` datetime(6) DEFAULT NULL,
  `seen` bit(1) DEFAULT NULL,
  `approved` bit(1) DEFAULT NULL,
  `organization_id` bigint(20) DEFAULT NULL,
  `total` float DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `event_id` bigint(20) DEFAULT NULL,
  `fee_billed` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_organization_reservation__organization_id` (`organization_id`),
  KEY `FK6hw6liv6tcjhcuyquy0x88apg` (`user_id`),
  KEY `FKlw5gv2m9qn4syti2ieye51hvq` (`event_id`),
  CONSTRAINT `FK6hw6liv6tcjhcuyquy0x88apg` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`),
  CONSTRAINT `FKlw5gv2m9qn4syti2ieye51hvq` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`),
  CONSTRAINT `fk_organization_reservation__organization_id` FOREIGN KEY (`organization_id`) REFERENCES `organization` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `organization_star_rating`
--

DROP TABLE IF EXISTS `organization_star_rating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `organization_star_rating` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `stars` int(11) DEFAULT NULL,
  `date` datetime(6) DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `organization_id` bigint(20) DEFAULT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_organization_star_rating__organization_id` (`organization_id`),
  KEY `fk_organization_star_rating__user_id` (`user_id`),
  CONSTRAINT `fk_organization_star_rating__organization_id` FOREIGN KEY (`organization_id`) REFERENCES `organization` (`id`),
  CONSTRAINT `fk_organization_star_rating__user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `partner`
--

DROP TABLE IF EXISTS `partner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `partner` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `logo` longblob NOT NULL,
  `logo_content_type` varchar(255) NOT NULL,
  `mail` varchar(255) NOT NULL,
  `webaddress` varchar(255) NOT NULL,
  `sponsorship_amount` float DEFAULT NULL,
  `active` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `point`
--

DROP TABLE IF EXISTS `point`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `point` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `jhi_key` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `key_name` varchar(255) DEFAULT NULL,
  `description` longtext,
  `key_description` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `points` bigint(20) DEFAULT NULL,
  `count_per_day` bigint(20) DEFAULT NULL,
  `creation_date` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `points_exchange`
--

DROP TABLE IF EXISTS `points_exchange`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `points_exchange` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `points_total` bigint(20) DEFAULT NULL,
  `bond_points_total` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `keywords` varchar(255) DEFAULT NULL,
  `description` longtext NOT NULL,
  `date_added` datetime(6) DEFAULT NULL,
  `date_modified` datetime(6) DEFAULT NULL,
  `price_type` varchar(255) DEFAULT NULL,
  `rent_type` varchar(255) DEFAULT NULL,
  `price` float NOT NULL,
  `photo` longblob NOT NULL,
  `photo_content_type` varchar(255) NOT NULL,
  `photo_2` longblob,
  `photo_2_content_type` varchar(255) DEFAULT NULL,
  `photo_3` longblob,
  `photo_3_content_type` varchar(255) DEFAULT NULL,
  `youtube` varchar(255) DEFAULT NULL,
  `active` bit(1) DEFAULT NULL,
  `stock` float NOT NULL,
  `product_type` varchar(255) DEFAULT NULL,
  `item_number` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `unit` varchar(255) NOT NULL,
  `amount` float DEFAULT NULL,
  `motto` varchar(255) NOT NULL,
  `shop_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_product__shop_id` (`shop_id`),
  CONSTRAINT `fk_product__shop_id` FOREIGN KEY (`shop_id`) REFERENCES `shop` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product_comment`
--

DROP TABLE IF EXISTS `product_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_comment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `comment` varchar(255) DEFAULT NULL,
  `date` datetime(6) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  `product_comment_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_product_comment__product_id` (`product_id`),
  KEY `fk_product_comment__user_id` (`user_id`),
  KEY `fk_product_comment__product_comment_id` (`product_comment_id`),
  CONSTRAINT `fk_product_comment__product_comment_id` FOREIGN KEY (`product_comment_id`) REFERENCES `product_comment` (`id`),
  CONSTRAINT `fk_product_comment__product_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `fk_product_comment__user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product_like_dislike`
--

DROP TABLE IF EXISTS `product_like_dislike`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_like_dislike` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `jhi_like` int(11) DEFAULT NULL,
  `dislike` int(11) DEFAULT NULL,
  `date` datetime(6) DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_product_like_dislike__product_id` (`product_id`),
  KEY `fk_product_like_dislike__user_id` (`user_id`),
  CONSTRAINT `fk_product_like_dislike__product_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `fk_product_like_dislike__user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product_star_rating`
--

DROP TABLE IF EXISTS `product_star_rating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_star_rating` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `stars` int(11) DEFAULT NULL,
  `date` datetime(6) DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_product_star_rating__product_id` (`product_id`),
  KEY `fk_product_star_rating__user_id` (`user_id`),
  CONSTRAINT `fk_product_star_rating__product_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `fk_product_star_rating__user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `property`
--

DROP TABLE IF EXISTS `property`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `property` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `jhi_key` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rel_event__reserved_users`
--

DROP TABLE IF EXISTS `rel_event__reserved_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rel_event__reserved_users` (
  `reserved_users_id` varchar(100) NOT NULL,
  `event_id` bigint(20) NOT NULL,
  PRIMARY KEY (`event_id`,`reserved_users_id`),
  KEY `fk_rel_event__reserved_users__reserved_users_id` (`reserved_users_id`),
  CONSTRAINT `fk_rel_event__reserved_users__event_id` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`),
  CONSTRAINT `fk_rel_event__reserved_users__reserved_users_id` FOREIGN KEY (`reserved_users_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reservation`
--

DROP TABLE IF EXISTS `reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reservation` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `date` datetime(6) DEFAULT NULL,
  `billed` bit(1) DEFAULT NULL,
  `access_event` bit(1) DEFAULT NULL,
  `access_date` datetime(6) DEFAULT NULL,
  `td_tx_id` varchar(255) DEFAULT NULL,
  `transaction_id_id` bigint(20) DEFAULT NULL,
  `ticket_id` bigint(20) DEFAULT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  `event_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_reservation__transaction_id_id` (`transaction_id_id`),
  UNIQUE KEY `ux_reservation__ticket_id` (`ticket_id`),
  UNIQUE KEY `UC_RESERVATIONTICKET_ID_COL` (`ticket_id`),
  KEY `fk_reservation__user_id` (`user_id`),
  KEY `fk_reservation__event_id` (`event_id`),
  CONSTRAINT `FKkn72g30lgqj1a31doyr5qb6ln` FOREIGN KEY (`ticket_id`) REFERENCES `ticket` (`id`),
  CONSTRAINT `fk_reservation__event_id` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`),
  CONSTRAINT `fk_reservation__transaction_id_id` FOREIGN KEY (`transaction_id_id`) REFERENCES `reservation_transaction_id` (`id`),
  CONSTRAINT `fk_reservation__user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reservation_transaction_id`
--

DROP TABLE IF EXISTS `reservation_transaction_id`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reservation_transaction_id` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `transaction_deposit_id` varchar(255) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `restaurant`
--

DROP TABLE IF EXISTS `restaurant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `restaurant` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `menu` longtext,
  `organization_id` bigint(20) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UC_RESTAURANTORGANIZATION_ID_COL` (`organization_id`),
  KEY `FKlwsfi12rhqxr92d5rhunpevy6` (`user_id`),
  CONSTRAINT `FKa26uar4ybl5m04b1t7xupq33e` FOREIGN KEY (`organization_id`) REFERENCES `organization` (`id`),
  CONSTRAINT `FKlwsfi12rhqxr92d5rhunpevy6` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ride_costs`
--

DROP TABLE IF EXISTS `ride_costs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ride_costs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `price_per_kilometre` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `service_comment`
--

DROP TABLE IF EXISTS `service_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service_comment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `comment` varchar(255) DEFAULT NULL,
  `date` datetime(6) DEFAULT NULL,
  `create_your_event_service_id` bigint(20) DEFAULT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  `service_comment_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_service_comment__create_your_event_service_id` (`create_your_event_service_id`),
  KEY `fk_service_comment__user_id` (`user_id`),
  KEY `fk_service_comment__service_comment_id` (`service_comment_id`),
  CONSTRAINT `fk_service_comment__create_your_event_service_id` FOREIGN KEY (`create_your_event_service_id`) REFERENCES `create_your_event_service` (`id`),
  CONSTRAINT `fk_service_comment__service_comment_id` FOREIGN KEY (`service_comment_id`) REFERENCES `service_comment` (`id`),
  CONSTRAINT `fk_service_comment__user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `service_like_dislike`
--

DROP TABLE IF EXISTS `service_like_dislike`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service_like_dislike` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `jhi_like` int(11) DEFAULT NULL,
  `dislike` int(11) DEFAULT NULL,
  `date` datetime(6) DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `create_your_event_service_id` bigint(20) DEFAULT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_service_like_dislike__create_your_event_service_id` (`create_your_event_service_id`),
  KEY `fk_service_like_dislike__user_id` (`user_id`),
  CONSTRAINT `fk_service_like_dislike__create_your_event_service_id` FOREIGN KEY (`create_your_event_service_id`) REFERENCES `create_your_event_service` (`id`),
  CONSTRAINT `fk_service_like_dislike__user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `service_map`
--

DROP TABLE IF EXISTS `service_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service_map` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `ride_cost_id` bigint(20) DEFAULT NULL,
  `create_your_event_service_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_service_map__ride_cost_id` (`ride_cost_id`),
  KEY `fk_service_map__create_your_event_service_id` (`create_your_event_service_id`),
  CONSTRAINT `fk_service_map__create_your_event_service_id` FOREIGN KEY (`create_your_event_service_id`) REFERENCES `create_your_event_service` (`id`),
  CONSTRAINT `fk_service_map__ride_cost_id` FOREIGN KEY (`ride_cost_id`) REFERENCES `ride_costs` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `service_offer`
--

DROP TABLE IF EXISTS `service_offer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service_offer` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `cost_hour` float NOT NULL,
  `service_maps_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_service_offer__service_maps_id` (`service_maps_id`),
  CONSTRAINT `fk_service_offer__service_maps_id` FOREIGN KEY (`service_maps_id`) REFERENCES `service_map` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `service_star_rating`
--

DROP TABLE IF EXISTS `service_star_rating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service_star_rating` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `stars` int(11) DEFAULT NULL,
  `date` datetime(6) DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `service_id` bigint(20) DEFAULT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_service_star_rating__service_id` (`service_id`),
  KEY `fk_service_star_rating__user_id` (`user_id`),
  CONSTRAINT `fk_service_star_rating__service_id` FOREIGN KEY (`service_id`) REFERENCES `create_your_event_service` (`id`),
  CONSTRAINT `fk_service_star_rating__user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop`
--

DROP TABLE IF EXISTS `shop`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `product_type` varchar(255) NOT NULL,
  `logo` longblob,
  `logo_content_type` varchar(255) DEFAULT NULL,
  `active` bit(1) DEFAULT NULL,
  `active_owner` bit(1) DEFAULT NULL,
  `description` longtext NOT NULL,
  `address` varchar(255) NOT NULL,
  `motto` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `web_address` varchar(255) DEFAULT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_shop__user_id` (`user_id`),
  CONSTRAINT `fk_shop__user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_comment`
--

DROP TABLE IF EXISTS `shop_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_comment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `comment` varchar(255) DEFAULT NULL,
  `date` datetime(6) DEFAULT NULL,
  `shop_id` bigint(20) DEFAULT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  `shop_comment_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_shop_comment__shop_id` (`shop_id`),
  KEY `fk_shop_comment__user_id` (`user_id`),
  KEY `fk_shop_comment__shop_comment_id` (`shop_comment_id`),
  CONSTRAINT `fk_shop_comment__shop_comment_id` FOREIGN KEY (`shop_comment_id`) REFERENCES `shop_comment` (`id`),
  CONSTRAINT `fk_shop_comment__shop_id` FOREIGN KEY (`shop_id`) REFERENCES `shop` (`id`),
  CONSTRAINT `fk_shop_comment__user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_like_dislike`
--

DROP TABLE IF EXISTS `shop_like_dislike`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_like_dislike` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `jhi_like` int(11) DEFAULT NULL,
  `dislike` int(11) DEFAULT NULL,
  `date` datetime(6) DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `shop_id` bigint(20) DEFAULT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_shop_like_dislike__shop_id` (`shop_id`),
  KEY `fk_shop_like_dislike__user_id` (`user_id`),
  CONSTRAINT `fk_shop_like_dislike__shop_id` FOREIGN KEY (`shop_id`) REFERENCES `shop` (`id`),
  CONSTRAINT `fk_shop_like_dislike__user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shop_star_rating`
--

DROP TABLE IF EXISTS `shop_star_rating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_star_rating` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `stars` int(11) DEFAULT NULL,
  `date` datetime(6) DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `shop_id` bigint(20) DEFAULT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_shop_star_rating__shop_id` (`shop_id`),
  KEY `fk_shop_star_rating__user_id` (`user_id`),
  CONSTRAINT `fk_shop_star_rating__shop_id` FOREIGN KEY (`shop_id`) REFERENCES `shop` (`id`),
  CONSTRAINT `fk_shop_star_rating__user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `slot_list_cherry`
--

DROP TABLE IF EXISTS `slot_list_cherry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `slot_list_cherry` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `coupons` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `slot_list_clock`
--

DROP TABLE IF EXISTS `slot_list_clock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `slot_list_clock` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `coupons` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `slot_list_orange`
--

DROP TABLE IF EXISTS `slot_list_orange`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `slot_list_orange` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `coupons` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `slot_list_plum`
--

DROP TABLE IF EXISTS `slot_list_plum`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `slot_list_plum` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `coupons` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tags` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `tag` varchar(255) DEFAULT NULL,
  `event_id` bigint(20) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `shop_id` bigint(20) DEFAULT NULL,
  `service_id` bigint(20) DEFAULT NULL,
  `organization_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tags__event_id` (`event_id`),
  KEY `fk_tags__product_id` (`product_id`),
  KEY `fk_tags__shop_id` (`shop_id`),
  KEY `fk_tags__service_id` (`service_id`),
  KEY `fk_tags__organization_id` (`organization_id`),
  CONSTRAINT `fk_tags__event_id` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`),
  CONSTRAINT `fk_tags__organization_id` FOREIGN KEY (`organization_id`) REFERENCES `organization` (`id`),
  CONSTRAINT `fk_tags__product_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `fk_tags__service_id` FOREIGN KEY (`service_id`) REFERENCES `create_your_event_service` (`id`),
  CONSTRAINT `fk_tags__shop_id` FOREIGN KEY (`shop_id`) REFERENCES `shop` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ticket`
--

DROP TABLE IF EXISTS `ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ticket` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `amount` int(11) DEFAULT NULL,
  `date` datetime(6) DEFAULT NULL,
  `total` float DEFAULT NULL,
  `event_id` bigint(20) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `access_date` datetime(6) DEFAULT NULL,
  `ref_no` varchar(255) DEFAULT NULL,
  `tickets_used` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK14p6i3tb23aol75bx9dtcej0d` (`user_id`),
  KEY `FKfytuhjopeamxbt1cpudy92x5n` (`event_id`),
  CONSTRAINT `FK14p6i3tb23aol75bx9dtcej0d` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`),
  CONSTRAINT `FKfytuhjopeamxbt1cpudy92x5n` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_extension`
--

DROP TABLE IF EXISTS `user_extension`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_extension` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `logged_in` bit(1) DEFAULT NULL,
  `points` int(11) DEFAULT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_extension__user_id` (`user_id`),
  CONSTRAINT `fk_user_extension__user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_point_association`
--

DROP TABLE IF EXISTS `user_point_association`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_point_association` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `date` datetime(6) DEFAULT NULL,
  `points_id` bigint(20) DEFAULT NULL,
  `users_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_point_association__points_id` (`points_id`),
  KEY `fk_user_point_association__users_id` (`users_id`),
  CONSTRAINT `fk_user_point_association__points_id` FOREIGN KEY (`points_id`) REFERENCES `point` (`id`),
  CONSTRAINT `fk_user_point_association__users_id` FOREIGN KEY (`users_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=144 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `worksheet`
--

DROP TABLE IF EXISTS `worksheet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `worksheet` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `start` datetime(6) NOT NULL,
  `end` datetime(6) NOT NULL,
  `cost_hour` float NOT NULL,
  `total` float NOT NULL,
  `billing_type` varchar(255) DEFAULT NULL,
  `user_type` varchar(255) DEFAULT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  `event_id` bigint(20) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_worksheet__user_id` (`user_id`),
  KEY `fk_worksheet__event_id` (`event_id`),
  KEY `fk_worksheet__product_id` (`product_id`),
  CONSTRAINT `fk_worksheet__event_id` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`),
  CONSTRAINT `fk_worksheet__product_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `fk_worksheet__user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-02-27 21:45:15
