-- MySQL dump 10.16  Distrib 10.1.48-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: db
-- ------------------------------------------------------
-- Server version	10.1.48-MariaDB-0+deb9u2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Customer_per_Country_View1`
--

DROP TABLE IF EXISTS `Customer_per_Country_View1`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Customer_per_Country_View1` (
  `Num_customers` tinyint(4) DEFAULT NULL,
  `Country` varchar(14) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Customer_per_Country_View1`
--

LOCK TABLES `Customer_per_Country_View1` WRITE;
/*!40000 ALTER TABLE `Customer_per_Country_View1` DISABLE KEYS */;
INSERT INTO `Customer_per_Country_View1` VALUES (1,'Argentina'),(1,'Australia'),(1,'Austria'),(1,'Belgium'),(5,'Brazil'),(8,'Canada'),(1,'Chile'),(2,'Czech Republic'),(1,'Denmark'),(1,'Finland'),(5,'France'),(4,'Germany'),(1,'Hungary'),(2,'India'),(1,'Ireland'),(1,'Italy'),(1,'Netherlands'),(1,'Norway'),(1,'Poland'),(2,'Portugal'),(1,'Spain'),(1,'Sweden'),(13,'USA'),(3,'United Kingdom');
/*!40000 ALTER TABLE `Customer_per_Country_View1` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `albums`
--

DROP TABLE IF EXISTS `albums`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `albums` (
  `AlbumId` smallint(6) DEFAULT NULL,
  `Title` varchar(95) DEFAULT NULL,
  `ArtistId` smallint(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `albums`
--

LOCK TABLES `albums` WRITE;
/*!40000 ALTER TABLE `albums` DISABLE KEYS */;
INSERT INTO `albums` VALUES (1,'For Those About To Rock We Salute You',1),(2,'Balls to the Wall',2),(3,'Restless and Wild',2),(4,'Let There Be Rock',1),(5,'Big Ones',3),(6,'Jagged Little Pill',4),(7,'Facelift',5),(8,'Warner 25 Anos',6),(9,'Plays Metallica By Four Cellos',7),(10,'Audioslave',8),(11,'Out Of Exile',8),(12,'BackBeat Soundtrack',9),(13,'The Best Of Billy Cobham',10),(14,'Alcohol Fueled Brewtality Live! [Disc 1]',11),(15,'Alcohol Fueled Brewtality Live! [Disc 2]',11),(16,'Black Sabbath',12),(17,'Black Sabbath Vol. 4 (Remaster)',12),(18,'Body Count',13),(19,'Chemical Wedding',14),(20,'The Best Of Buddy Guy - The Millenium Collection',15),(21,'Prenda Minha',16),(22,'Sozinho Remix Ao Vivo',16),(23,'Minha Historia',17),(24,'Afrociberdelia',18),(25,'Da Lama Ao Caos',18),(26,'Acústico MTV [Live]',19),(27,'Cidade Negra - Hits',19),(28,'Na Pista',20),(29,'Axé Bahia 2001',21),(30,'BBC Sessions [Disc 1] [Live]',22),(31,'Bongo Fury',23),(32,'Carnaval 2001',21),(33,'Chill: Brazil (Disc 1)',24),(34,'Chill: Brazil (Disc 2)',6),(35,'Garage Inc. (Disc 1)',50),(36,'Greatest Hits II',51),(37,'Greatest Kiss',52),(38,'Heart of the Night',53),(39,'International Superhits',54),(40,'Into The Light',55),(41,'Meus Momentos',56),(42,'Minha História',57),(43,'MK III The Final Concerts [Disc 1]',58),(44,'Physical Graffiti [Disc 1]',22),(45,'Sambas De Enredo 2001',21),(46,'Supernatural',59),(47,'The Best of Ed Motta',37),(48,'The Essential Miles Davis [Disc 1]',68),(49,'The Essential Miles Davis [Disc 2]',68),(50,'The Final Concerts (Disc 2)',58),(51,'Up An\' Atom',69),(52,'Vinícius De Moraes - Sem Limite',70),(53,'Vozes do MPB',21),(54,'Chronicle, Vol. 1',76),(55,'Chronicle, Vol. 2',76),(56,'Cássia Eller - Coleção Sem Limite [Disc 2]',77),(57,'Cássia Eller - Sem Limite [Disc 1]',77),(58,'Come Taste The Band',58),(59,'Deep Purple In Rock',58),(60,'Fireball',58),(61,'Knocking at Your Back Door: The Best Of Deep Purple in the 80\'s',58),(62,'Machine Head',58),(63,'Purpendicular',58),(64,'Slaves And Masters',58),(65,'Stormbringer',58),(66,'The Battle Rages On',58),(67,'Vault: Def Leppard\'s Greatest Hits',78),(68,'Outbreak',79),(69,'Djavan Ao Vivo - Vol. 02',80),(70,'Djavan Ao Vivo - Vol. 1',80),(71,'Elis Regina-Minha História',41),(72,'The Cream Of Clapton',81),(73,'Unplugged',81),(74,'Album Of The Year',82),(75,'Angel Dust',82),(76,'King For A Day Fool For A Lifetime',82),(77,'The Real Thing',82),(78,'Deixa Entrar',83),(79,'In Your Honor [Disc 1]',84),(80,'In Your Honor [Disc 2]',84),(81,'One By One',84),(82,'The Colour And The Shape',84),(83,'My Way: The Best Of Frank Sinatra [Disc 1]',85),(84,'Roda De Funk',86),(85,'As Canções de Eu Tu Eles',27),(86,'Quanta Gente Veio Ver (Live)',27),(87,'Quanta Gente Veio ver--Bônus De Carnaval',27),(88,'Faceless',87),(89,'American Idiot',54),(90,'Appetite for Destruction',88),(91,'Use Your Illusion I',88),(92,'Use Your Illusion II',88),(93,'Blue Moods',89),(94,'A Matter of Life and Death',90),(95,'A Real Dead One',90),(96,'A Real Live One',90),(97,'Brave New World',90),(98,'Dance Of Death',90),(99,'Fear Of The Dark',90),(100,'Iron Maiden',90);
/*!40000 ALTER TABLE `albums` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `artists`
--

DROP TABLE IF EXISTS `artists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `artists` (
  `ArtistId` smallint(6) DEFAULT NULL,
  `Name` varchar(85) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `artists`
--

LOCK TABLES `artists` WRITE;
/*!40000 ALTER TABLE `artists` DISABLE KEYS */;
INSERT INTO `artists` VALUES (1,'AC/DC'),(2,'Accept'),(3,'Aerosmith'),(4,'Alanis Morissette'),(5,'Alice In Chains'),(6,'Antônio Carlos Jobim'),(7,'Apocalyptica'),(8,'Audioslave'),(9,'BackBeat'),(10,'Billy Cobham'),(11,'Black Label Society'),(12,'Black Sabbath'),(13,'Body Count'),(14,'Bruce Dickinson'),(15,'Buddy Guy'),(16,'Caetano Veloso'),(17,'Chico Buarque'),(18,'Chico Science & Nação Zumbi'),(19,'Cidade Negra'),(20,'Cláudio Zoli'),(21,'Various Artists'),(22,'Led Zeppelin'),(23,'Frank Zappa & Captain Beefheart'),(24,'Marcos Valle'),(25,'Milton Nascimento & Bebeto'),(26,'Azymuth'),(27,'Gilberto Gil'),(28,'João Gilberto'),(29,'Bebel Gilberto'),(30,'Jorge Vercilo'),(31,'Baby Consuelo'),(32,'Ney Matogrosso'),(33,'Luiz Melodia'),(34,'Nando Reis'),(35,'Pedro Luís & A Parede'),(36,'O Rappa'),(37,'Ed Motta'),(38,'Banda Black Rio'),(39,'Fernanda Porto'),(40,'Os Cariocas'),(41,'Elis Regina'),(42,'Milton Nascimento'),(43,'A Cor Do Som'),(44,'Kid Abelha'),(45,'Sandra De Sá'),(46,'Jorge Ben'),(47,'Hermeto Pascoal'),(48,'Barão Vermelho'),(49,'Edson, DJ Marky & DJ Patife Featuring Fernanda Porto'),(50,'Metallica'),(51,'Queen'),(52,'Kiss'),(53,'Spyro Gyra'),(54,'Green Day'),(55,'David Coverdale'),(56,'Gonzaguinha'),(57,'Os Mutantes'),(58,'Deep Purple'),(59,'Santana'),(60,'Santana Feat. Dave Matthews'),(61,'Santana Feat. Everlast'),(62,'Santana Feat. Rob Thomas'),(63,'Santana Feat. Lauryn Hill & Cee-Lo'),(64,'Santana Feat. The Project G&B'),(65,'Santana Feat. Maná'),(66,'Santana Feat. Eagle-Eye Cherry'),(67,'Santana Feat. Eric Clapton'),(68,'Miles Davis'),(69,'Gene Krupa'),(70,'Toquinho & Vinícius'),(71,'Vinícius De Moraes & Baden Powell'),(72,'Vinícius De Moraes'),(73,'Vinícius E Qurteto Em Cy'),(74,'Vinícius E Odette Lara'),(75,'Vinicius, Toquinho & Quarteto Em Cy'),(76,'Creedence Clearwater Revival'),(77,'Cássia Eller'),(78,'Def Leppard'),(79,'Dennis Chambers'),(80,'Djavan'),(81,'Eric Clapton'),(82,'Faith No More'),(83,'Falamansa'),(84,'Foo Fighters'),(85,'Frank Sinatra'),(86,'Funk Como Le Gusta'),(87,'Godsmack'),(88,'Guns N\' Roses'),(89,'Incognito'),(90,'Iron Maiden'),(91,'James Brown'),(92,'Jamiroquai'),(93,'JET'),(94,'Jimi Hendrix'),(95,'Joe Satriani'),(96,'Jota Quest'),(97,'João Suplicy'),(98,'Judas Priest'),(99,'Legião Urbana'),(100,'Lenny Kravitz');
/*!40000 ALTER TABLE `artists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customers` (
  `CustomerId` tinyint(4) DEFAULT NULL,
  `FirstName` varchar(9) DEFAULT NULL,
  `LastName` varchar(12) DEFAULT NULL,
  `Company` varchar(48) DEFAULT NULL,
  `Address` varchar(40) DEFAULT NULL,
  `City` varchar(19) DEFAULT NULL,
  `State` varchar(6) DEFAULT NULL,
  `Country` varchar(14) DEFAULT NULL,
  `PostalCode` varchar(10) DEFAULT NULL,
  `Phone` varchar(19) DEFAULT NULL,
  `Fax` varchar(18) DEFAULT NULL,
  `Email` varchar(29) DEFAULT NULL,
  `SupportRepId` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'Luís','Gonçalves','Embraer - Empresa Brasileira de Aeronáutica S.A.','Av. Brigadeiro Faria Lima, 2170','São José dos Campos','SP','Brazil','12227-000','+55 (12) 3923-5555','+55 (12) 3923-5566','luisg@embraer.com.br',3),(2,'Leonie','Köhler','','Theodor-Heuss-Straße 34','Stuttgart','','Germany','70174','+49 0711 2842222','','leonekohler@surfeu.de',5),(3,'François','Tremblay','','1498 rue Bélanger','Montréal','QC','Canada','H2G 1A7','+1 (514) 721-4711','','ftremblay@gmail.com',3),(4,'Bjørn','Hansen','','Ullevålsveien 14','Oslo','','Norway','0171','+47 22 44 22 22','','bjorn.hansen@yahoo.no',4),(5,'František','Wichterlová','JetBrains s.r.o.','Klanova 9/506','Prague','','Czech Republic','14700','+420 2 4172 5555','+420 2 4172 5555','frantisekw@jetbrains.com',4),(6,'Helena','Holý','','Rilská 3174/6','Prague','','Czech Republic','14300','+420 2 4177 0449','','hholy@gmail.com',5),(7,'Astrid','Gruber','','Rotenturmstraße 4, 1010 Innere Stadt','Vienne','','Austria','1010','+43 01 5134505','','astrid.gruber@apple.at',5),(8,'Daan','Peeters','','Grétrystraat 63','Brussels','','Belgium','1000','+32 02 219 03 03','','daan_peeters@apple.be',4),(9,'Kara','Nielsen','','Sønder Boulevard 51','Copenhagen','','Denmark','1720','+453 3331 9991','','kara.nielsen@jubii.dk',4),(10,'Eduardo','Martins','Woodstock Discos','Rua Dr. Falcão Filho, 155','São Paulo','SP','Brazil','01007-010','+55 (11) 3033-5446','+55 (11) 3033-4564','eduardo@woodstock.com.br',4),(11,'Alexandre','Rocha','Banco do Brasil S.A.','Av. Paulista, 2022','São Paulo','SP','Brazil','01310-200','+55 (11) 3055-3278','+55 (11) 3055-8131','alero@uol.com.br',5),(12,'Roberto','Almeida','Riotur','Praça Pio X, 119','Rio de Janeiro','RJ','Brazil','20040-020','+55 (21) 2271-7000','+55 (21) 2271-7070','roberto.almeida@riotur.gov.br',3),(13,'Fernanda','Ramos','','Qe 7 Bloco G','Brasília','DF','Brazil','71020-677','+55 (61) 3363-5547','+55 (61) 3363-7855','fernadaramos4@uol.com.br',4),(14,'Mark','Philips','Telus','8210 111 ST NW','Edmonton','AB','Canada','T6G 2C7','+1 (780) 434-4554','+1 (780) 434-5565','mphilips12@shaw.ca',5),(15,'Jennifer','Peterson','Rogers Canada','700 W Pender Street','Vancouver','BC','Canada','V6C 1G8','+1 (604) 688-2255','+1 (604) 688-8756','jenniferp@rogers.ca',3),(16,'Frank','Harris','Google Inc.','1600 Amphitheatre Parkway','Mountain View','CA','USA','94043-1351','+1 (650) 253-0000','+1 (650) 253-0000','fharris@google.com',4),(17,'Jack','Smith','Microsoft Corporation','1 Microsoft Way','Redmond','WA','USA','98052-8300','+1 (425) 882-8080','+1 (425) 882-8081','jacksmith@microsoft.com',5),(18,'Michelle','Brooks','','627 Broadway','New York','NY','USA','10012-2612','+1 (212) 221-3546','+1 (212) 221-4679','michelleb@aol.com',3),(19,'Tim','Goyer','Apple Inc.','1 Infinite Loop','Cupertino','CA','USA','95014','+1 (408) 996-1010','+1 (408) 996-1011','tgoyer@apple.com',3),(20,'Dan','Miller','','541 Del Medio Avenue','Mountain View','CA','USA','94040-111','+1 (650) 644-3358','','dmiller@comcast.com',4),(21,'Kathy','Chase','','801 W 4th Street','Reno','NV','USA','89503','+1 (775) 223-7665','','kachase@hotmail.com',5),(22,'Heather','Leacock','','120 S Orange Ave','Orlando','FL','USA','32801','+1 (407) 999-7788','','hleacock@gmail.com',4),(23,'John','Gordon','','69 Salem Street','Boston','MA','USA','2113','+1 (617) 522-1333','','johngordon22@yahoo.com',4),(24,'Frank','Ralston','','162 E Superior Street','Chicago','IL','USA','60611','+1 (312) 332-3232','','fralston@gmail.com',3),(25,'Victor','Stevens','','319 N. Frances Street','Madison','WI','USA','53703','+1 (608) 257-0597','','vstevens@yahoo.com',5),(26,'Richard','Cunningham','','2211 W Berry Street','Fort Worth','TX','USA','76110','+1 (817) 924-7272','','ricunningham@hotmail.com',4),(27,'Patrick','Gray','','1033 N Park Ave','Tucson','AZ','USA','85719','+1 (520) 622-4200','','patrick.gray@aol.com',4),(28,'Julia','Barnett','','302 S 700 E','Salt Lake City','UT','USA','84102','+1 (801) 531-7272','','jubarnett@gmail.com',5),(29,'Robert','Brown','','796 Dundas Street West','Toronto','ON','Canada','M6J 1V1','+1 (416) 363-8888','','robbrown@shaw.ca',3),(30,'Edward','Francis','','230 Elgin Street','Ottawa','ON','Canada','K2P 1L7','+1 (613) 234-3322','','edfrancis@yachoo.ca',3),(31,'Martha','Silk','','194A Chain Lake Drive','Halifax','NS','Canada','B3S 1C5','+1 (902) 450-0450','','marthasilk@gmail.com',5),(32,'Aaron','Mitchell','','696 Osborne Street','Winnipeg','MB','Canada','R3L 2B9','+1 (204) 452-6452','','aaronmitchell@yahoo.ca',4),(33,'Ellie','Sullivan','','5112 48 Street','Yellowknife','NT','Canada','X1A 1N6','+1 (867) 920-2233','','ellie.sullivan@shaw.ca',3),(34,'João','Fernandes','','Rua da Assunção 53','Lisbon','','Portugal','','+351 (213) 466-111','','jfernandes@yahoo.pt',4),(35,'Madalena','Sampaio','','Rua dos Campeões Europeus de Viena, 4350','Porto','','Portugal','','+351 (225) 022-448','','masampaio@sapo.pt',4),(36,'Hannah','Schneider','','Tauentzienstraße 8','Berlin','','Germany','10789','+49 030 26550280','','hannah.schneider@yahoo.de',5),(37,'Fynn','Zimmermann','','Berger Straße 10','Frankfurt','','Germany','60316','+49 069 40598889','','fzimmermann@yahoo.de',3),(38,'Niklas','Schröder','','Barbarossastraße 19','Berlin','','Germany','10779','+49 030 2141444','','nschroder@surfeu.de',3),(39,'Camille','Bernard','','4, Rue Milton','Paris','','France','75009','+33 01 49 70 65 65','','camille.bernard@yahoo.fr',4),(40,'Dominique','Lefebvre','','8, Rue Hanovre','Paris','','France','75002','+33 01 47 42 71 71','','dominiquelefebvre@gmail.com',4),(41,'Marc','Dubois','','11, Place Bellecour','Lyon','','France','69002','+33 04 78 30 30 30','','marc.dubois@hotmail.com',5),(42,'Wyatt','Girard','','9, Place Louis Barthou','Bordeaux','','France','33000','+33 05 56 96 96 96','','wyatt.girard@yahoo.fr',3),(43,'Isabelle','Mercier','','68, Rue Jouvence','Dijon','','France','21000','+33 03 80 73 66 99','','isabelle_mercier@apple.fr',3),(44,'Terhi','Hämäläinen','','Porthaninkatu 9','Helsinki','','Finland','00530','+358 09 870 2000','','terhi.hamalainen@apple.fi',3),(45,'Ladislav','Kovács','','Erzsébet krt. 58.','Budapest','','Hungary','H-1073','','','ladislav_kovacs@apple.hu',3),(46,'Hugh','O\'Reilly','','3 Chatham Street','Dublin','Dublin','Ireland','','+353 01 6792424','','hughoreilly@apple.ie',3),(47,'Lucas','Mancini','','Via Degli Scipioni, 43','Rome','RM','Italy','00192','+39 06 39733434','','lucas.mancini@yahoo.it',5),(48,'Johannes','Van der Berg','','Lijnbaansgracht 120bg','Amsterdam','VV','Netherlands','1016','+31 020 6223130','','johavanderberg@yahoo.nl',5),(49,'Stanisław','Wójcik','','Ordynacka 10','Warsaw','','Poland','00-358','+48 22 828 37 39','','stanisław.wójcik@wp.pl',4),(50,'Enrique','Muñoz','','C/ San Bernardo 85','Madrid','','Spain','28015','+34 914 454 454','','enrique_munoz@yahoo.es',5),(51,'Joakim','Johansson','','Celsiusg. 9','Stockholm','','Sweden','11230','+46 08-651 52 52','','joakim.johansson@yahoo.se',5),(52,'Emma','Jones','','202 Hoxton Street','London','','United Kingdom','N1 5LH','+44 020 7707 0707','','emma_jones@hotmail.com',3),(53,'Phil','Hughes','','113 Lupus St','London','','United Kingdom','SW1V 3EN','+44 020 7976 5722','','phil.hughes@gmail.com',3),(54,'Steve','Murray','','110 Raeburn Pl','Edinburgh ','','United Kingdom','EH4 1HH','+44 0131 315 3300','','steve.murray@yahoo.uk',5),(55,'Mark','Taylor','','421 Bourke Street','Sidney','NSW','Australia','2010','+61 (02) 9332 3633','','mark.taylor@yahoo.au',4),(56,'Diego','Gutiérrez','','307 Macacha Güemes','Buenos Aires','','Argentina','1106','+54 (0)11 4311 4333','','diego.gutierrez@yahoo.ar',4),(57,'Luis','Rojas','','Calle Lira, 198','Santiago','','Chile','','+56 (0)2 635 4444','','luisrojas@yahoo.cl',5),(58,'Manoj','Pareek','','12,Community Centre','Delhi','','India','110017','+91 0124 39883988','','manoj.pareek@rediff.com',3),(59,'Puja','Srivastava','','3,Raj Bhavan Road','Bangalore','','India','560001','+91 080 22289999','','puja_srivastava@yahoo.in',3);
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `employees` (
  `EmployeeId` tinyint(4) DEFAULT NULL,
  `LastName` varchar(8) DEFAULT NULL,
  `FirstName` varchar(8) DEFAULT NULL,
  `Title` varchar(19) DEFAULT NULL,
  `ReportsTo` varchar(1) DEFAULT NULL,
  `BirthDate` varchar(0) DEFAULT NULL,
  `HireDate` varchar(0) DEFAULT NULL,
  `Address` varchar(27) DEFAULT NULL,
  `City` varchar(10) DEFAULT NULL,
  `State` varchar(2) DEFAULT NULL,
  `Country` varchar(6) DEFAULT NULL,
  `PostalCode` varchar(7) DEFAULT NULL,
  `Phone` varchar(17) DEFAULT NULL,
  `Fax` varchar(17) DEFAULT NULL,
  `Email` varchar(24) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,'Adams','Andrew','General Manager','','','','11120 Jasper Ave NW','Edmonton','AB','Canada','T5K 2N1','+1 (780) 428-9482','+1 (780) 428-3457','andrew@chinookcorp.com'),(2,'Edwards','Nancy','Sales Manager','1','','','825 8 Ave SW','Calgary','AB','Canada','T2P 2T3','+1 (403) 262-3443','+1 (403) 262-3322','nancy@chinookcorp.com'),(3,'Peacock','Jane','Sales Support Agent','2','','','1111 6 Ave SW','Calgary','AB','Canada','T2P 5M5','+1 (403) 262-3443','+1 (403) 262-6712','jane@chinookcorp.com'),(4,'Park','Margaret','Sales Support Agent','2','','','683 10 Street SW','Calgary','AB','Canada','T2P 5G3','+1 (403) 263-4423','+1 (403) 263-4289','margaret@chinookcorp.com'),(5,'Johnson','Steve','Sales Support Agent','2','','','7727B 41 Ave','Calgary','AB','Canada','T3B 1Y7','1 (780) 836-9987','1 (780) 836-9543','steve@chinookcorp.com'),(6,'Mitchell','Michael','IT Manager','1','','','5827 Bowness Road NW','Calgary','AB','Canada','T3B 0C5','+1 (403) 246-9887','+1 (403) 246-9899','michael@chinookcorp.com'),(7,'King','Robert','IT Staff','6','','','590 Columbia Boulevard West','Lethbridge','AB','Canada','T1K 5N8','+1 (403) 456-9986','+1 (403) 456-8485','robert@chinookcorp.com'),(8,'Callahan','Laura','IT Staff','6','','','923 7 ST NW','Lethbridge','AB','Canada','T1H 1Y8','+1 (403) 467-3351','+1 (403) 467-8772','laura@chinookcorp.com');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genres`
--

DROP TABLE IF EXISTS `genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `genres` (
  `GenreId` tinyint(4) DEFAULT NULL,
  `Name` varchar(18) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genres`
--

LOCK TABLES `genres` WRITE;
/*!40000 ALTER TABLE `genres` DISABLE KEYS */;
INSERT INTO `genres` VALUES (1,'Rock'),(2,'Jazz'),(3,'Metal'),(4,'Alternative & Punk'),(5,'Rock And Roll'),(6,'Blues'),(7,'Latin'),(8,'Reggae'),(9,'Pop'),(10,'Soundtrack'),(11,'Bossa Nova'),(12,'Easy Listening'),(13,'Heavy Metal'),(14,'R&B/Soul'),(15,'Electronica/Dance'),(16,'World'),(17,'Hip Hop/Rap'),(18,'Science Fiction'),(19,'TV Shows'),(20,'Sci Fi & Fantasy'),(21,'Drama'),(22,'Comedy'),(23,'Alternative'),(24,'Classical'),(25,'Opera');
/*!40000 ALTER TABLE `genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoice_items`
--

DROP TABLE IF EXISTS `invoice_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `invoice_items` (
  `InvoiceLineId` smallint(6) DEFAULT NULL,
  `InvoiceId` smallint(6) DEFAULT NULL,
  `TrackId` smallint(6) DEFAULT NULL,
  `UnitPrice` decimal(3,2) DEFAULT NULL,
  `Quantity` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice_items`
--

LOCK TABLES `invoice_items` WRITE;
/*!40000 ALTER TABLE `invoice_items` DISABLE KEYS */;
INSERT INTO `invoice_items` VALUES (1,1,2,0.99,1),(2,1,4,0.99,1),(3,2,6,0.99,1),(4,2,8,0.99,1),(5,2,10,0.99,1),(6,2,12,0.99,1),(7,3,16,0.99,1),(8,3,20,0.99,1),(9,3,24,0.99,1),(10,3,28,0.99,1),(11,3,32,0.99,1),(12,3,36,0.99,1),(13,4,42,0.99,1),(14,4,48,0.99,1),(15,4,54,0.99,1),(16,4,60,0.99,1),(17,4,66,0.99,1),(18,4,72,0.99,1),(19,4,78,0.99,1),(20,4,84,0.99,1),(21,4,90,0.99,1),(22,5,99,0.99,1),(23,5,108,0.99,1),(24,5,117,0.99,1),(25,5,126,0.99,1),(26,5,135,0.99,1),(27,5,144,0.99,1),(28,5,153,0.99,1),(29,5,162,0.99,1),(30,5,171,0.99,1),(31,5,180,0.99,1),(32,5,189,0.99,1),(33,5,198,0.99,1),(34,5,207,0.99,1),(35,5,216,0.99,1),(36,6,230,0.99,1),(37,7,231,0.99,1),(38,7,232,0.99,1),(39,8,234,0.99,1),(40,8,236,0.99,1),(41,9,238,0.99,1),(42,9,240,0.99,1),(43,9,242,0.99,1),(44,9,244,0.99,1),(45,10,248,0.99,1),(46,10,252,0.99,1),(47,10,256,0.99,1),(48,10,260,0.99,1),(49,10,264,0.99,1),(50,10,268,0.99,1),(51,11,274,0.99,1),(52,11,280,0.99,1),(53,11,286,0.99,1),(54,11,292,0.99,1),(55,11,298,0.99,1),(56,11,304,0.99,1),(57,11,310,0.99,1),(58,11,316,0.99,1),(59,11,322,0.99,1),(60,12,331,0.99,1),(61,12,340,0.99,1),(62,12,349,0.99,1),(63,12,358,0.99,1),(64,12,367,0.99,1),(65,12,376,0.99,1),(66,12,385,0.99,1),(67,12,394,0.99,1),(68,12,403,0.99,1),(69,12,412,0.99,1),(70,12,421,0.99,1),(71,12,430,0.99,1),(72,12,439,0.99,1),(73,12,448,0.99,1),(74,13,462,0.99,1),(75,14,463,0.99,1),(76,14,464,0.99,1),(77,15,466,0.99,1),(78,15,468,0.99,1),(79,16,470,0.99,1),(80,16,472,0.99,1),(81,16,474,0.99,1),(82,16,476,0.99,1),(83,17,480,0.99,1),(84,17,484,0.99,1),(85,17,488,0.99,1),(86,17,492,0.99,1),(87,17,496,0.99,1),(88,17,500,0.99,1),(89,18,506,0.99,1),(90,18,512,0.99,1),(91,18,518,0.99,1),(92,18,524,0.99,1),(93,18,530,0.99,1),(94,18,536,0.99,1),(95,18,542,0.99,1),(96,18,548,0.99,1),(97,18,554,0.99,1),(98,19,563,0.99,1),(99,19,572,0.99,1),(100,19,581,0.99,1);
/*!40000 ALTER TABLE `invoice_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `invoices` (
  `InvoiceId` smallint(6) DEFAULT NULL,
  `CustomerId` tinyint(4) DEFAULT NULL,
  `InvoiceDate` varchar(0) DEFAULT NULL,
  `BillingAddress` varchar(40) DEFAULT NULL,
  `BillingCity` varchar(19) DEFAULT NULL,
  `BillingState` varchar(6) DEFAULT NULL,
  `BillingCountry` varchar(14) DEFAULT NULL,
  `BillingPostalCode` varchar(10) DEFAULT NULL,
  `Total` decimal(4,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
INSERT INTO `invoices` VALUES (1,2,'','Theodor-Heuss-Straße 34','Stuttgart','','Germany','70174',1.98),(2,4,'','Ullevålsveien 14','Oslo','','Norway','0171',3.96),(3,8,'','Grétrystraat 63','Brussels','','Belgium','1000',5.94),(4,14,'','8210 111 ST NW','Edmonton','AB','Canada','T6G 2C7',8.91),(5,23,'','69 Salem Street','Boston','MA','USA','2113',13.86),(6,37,'','Berger Straße 10','Frankfurt','','Germany','60316',0.99),(7,38,'','Barbarossastraße 19','Berlin','','Germany','10779',1.98),(8,40,'','8, Rue Hanovre','Paris','','France','75002',1.98),(9,42,'','9, Place Louis Barthou','Bordeaux','','France','33000',3.96),(10,46,'','3 Chatham Street','Dublin','Dublin','Ireland','',5.94),(11,52,'','202 Hoxton Street','London','','United Kingdom','N1 5LH',8.91),(12,2,'','Theodor-Heuss-Straße 34','Stuttgart','','Germany','70174',13.86),(13,16,'','1600 Amphitheatre Parkway','Mountain View','CA','USA','94043-1351',0.99),(14,17,'','1 Microsoft Way','Redmond','WA','USA','98052-8300',1.98),(15,19,'','1 Infinite Loop','Cupertino','CA','USA','95014',1.98),(16,21,'','801 W 4th Street','Reno','NV','USA','89503',3.96),(17,25,'','319 N. Frances Street','Madison','WI','USA','53703',5.94),(18,31,'','194A Chain Lake Drive','Halifax','NS','Canada','B3S 1C5',8.91),(19,40,'','8, Rue Hanovre','Paris','','France','75002',13.86),(20,54,'','110 Raeburn Pl','Edinburgh ','','United Kingdom','EH4 1HH',0.99),(21,55,'','421 Bourke Street','Sidney','NSW','Australia','2010',1.98),(22,57,'','Calle Lira, 198','Santiago','','Chile','',1.98),(23,59,'','3,Raj Bhavan Road','Bangalore','','India','560001',3.96),(24,4,'','Ullevålsveien 14','Oslo','','Norway','0171',5.94),(25,10,'','Rua Dr. Falcão Filho, 155','São Paulo','SP','Brazil','01007-010',8.91),(26,19,'','1 Infinite Loop','Cupertino','CA','USA','95014',13.86),(27,33,'','5112 48 Street','Yellowknife','NT','Canada','X1A 1N6',0.99),(28,34,'','Rua da Assunção 53','Lisbon','','Portugal','',1.98),(29,36,'','Tauentzienstraße 8','Berlin','','Germany','10789',1.98),(30,38,'','Barbarossastraße 19','Berlin','','Germany','10779',3.96),(31,42,'','9, Place Louis Barthou','Bordeaux','','France','33000',5.94),(32,48,'','Lijnbaansgracht 120bg','Amsterdam','VV','Netherlands','1016',8.91),(33,57,'','Calle Lira, 198','Santiago','','Chile','',13.86),(34,12,'','Praça Pio X, 119','Rio de Janeiro','RJ','Brazil','20040-020',0.99),(35,13,'','Qe 7 Bloco G','Brasília','DF','Brazil','71020-677',1.98),(36,15,'','700 W Pender Street','Vancouver','BC','Canada','V6C 1G8',1.98),(37,17,'','1 Microsoft Way','Redmond','WA','USA','98052-8300',3.96),(38,21,'','801 W 4th Street','Reno','NV','USA','89503',5.94),(39,27,'','1033 N Park Ave','Tucson','AZ','USA','85719',8.91),(40,36,'','Tauentzienstraße 8','Berlin','','Germany','10789',13.86),(41,50,'','C/ San Bernardo 85','Madrid','','Spain','28015',0.99),(42,51,'','Celsiusg. 9','Stockholm','','Sweden','11230',1.98),(43,53,'','113 Lupus St','London','','United Kingdom','SW1V 3EN',1.98),(44,55,'','421 Bourke Street','Sidney','NSW','Australia','2010',3.96),(45,59,'','3,Raj Bhavan Road','Bangalore','','India','560001',5.94),(46,6,'','Rilská 3174/6','Prague','','Czech Republic','14300',8.91),(47,15,'','700 W Pender Street','Vancouver','BC','Canada','V6C 1G8',13.86),(48,29,'','796 Dundas Street West','Toronto','ON','Canada','M6J 1V1',0.99),(49,30,'','230 Elgin Street','Ottawa','ON','Canada','K2P 1L7',1.98),(50,32,'','696 Osborne Street','Winnipeg','MB','Canada','R3L 2B9',1.98),(51,34,'','Rua da Assunção 53','Lisbon','','Portugal','',3.96),(52,38,'','Barbarossastraße 19','Berlin','','Germany','10779',5.94),(53,44,'','Porthaninkatu 9','Helsinki','','Finland','00530',8.91),(54,53,'','113 Lupus St','London','','United Kingdom','SW1V 3EN',13.86),(55,8,'','Grétrystraat 63','Brussels','','Belgium','1000',0.99),(56,9,'','Sønder Boulevard 51','Copenhagen','','Denmark','1720',1.98),(57,11,'','Av. Paulista, 2022','São Paulo','SP','Brazil','01310-200',1.98),(58,13,'','Qe 7 Bloco G','Brasília','DF','Brazil','71020-677',3.96),(59,17,'','1 Microsoft Way','Redmond','WA','USA','98052-8300',5.94),(60,23,'','69 Salem Street','Boston','MA','USA','2113',8.91),(61,32,'','696 Osborne Street','Winnipeg','MB','Canada','R3L 2B9',13.86),(62,46,'','3 Chatham Street','Dublin','Dublin','Ireland','',0.99),(63,47,'','Via Degli Scipioni, 43','Rome','RM','Italy','00192',1.98),(64,49,'','Ordynacka 10','Warsaw','','Poland','00-358',1.98),(65,51,'','Celsiusg. 9','Stockholm','','Sweden','11230',3.96),(66,55,'','421 Bourke Street','Sidney','NSW','Australia','2010',5.94),(67,2,'','Theodor-Heuss-Straße 34','Stuttgart','','Germany','70174',8.91),(68,11,'','Av. Paulista, 2022','São Paulo','SP','Brazil','01310-200',13.86),(69,25,'','319 N. Frances Street','Madison','WI','USA','53703',0.99),(70,26,'','2211 W Berry Street','Fort Worth','TX','USA','76110',1.98),(71,28,'','302 S 700 E','Salt Lake City','UT','USA','84102',1.98),(72,30,'','230 Elgin Street','Ottawa','ON','Canada','K2P 1L7',3.96),(73,34,'','Rua da Assunção 53','Lisbon','','Portugal','',5.94),(74,40,'','8, Rue Hanovre','Paris','','France','75002',8.91),(75,49,'','Ordynacka 10','Warsaw','','Poland','00-358',13.86),(76,4,'','Ullevålsveien 14','Oslo','','Norway','0171',0.99),(77,5,'','Klanova 9/506','Prague','','Czech Republic','14700',1.98),(78,7,'','Rotenturmstraße 4, 1010 Innere Stadt','Vienne','','Austria','1010',1.98),(79,9,'','Sønder Boulevard 51','Copenhagen','','Denmark','1720',3.96),(80,13,'','Qe 7 Bloco G','Brasília','DF','Brazil','71020-677',5.94),(81,19,'','1 Infinite Loop','Cupertino','CA','USA','95014',8.91),(82,28,'','302 S 700 E','Salt Lake City','UT','USA','84102',13.86),(83,42,'','9, Place Louis Barthou','Bordeaux','','France','33000',0.99),(84,43,'','68, Rue Jouvence','Dijon','','France','21000',1.98),(85,45,'','Erzsébet krt. 58.','Budapest','','Hungary','H-1073',1.98),(86,47,'','Via Degli Scipioni, 43','Rome','RM','Italy','00192',3.96),(87,51,'','Celsiusg. 9','Stockholm','','Sweden','11230',6.94),(88,57,'','Calle Lira, 198','Santiago','','Chile','',17.91),(89,7,'','Rotenturmstraße 4, 1010 Innere Stadt','Vienne','','Austria','1010',18.86),(90,21,'','801 W 4th Street','Reno','NV','USA','89503',0.99),(91,22,'','120 S Orange Ave','Orlando','FL','USA','32801',1.98),(92,24,'','162 E Superior Street','Chicago','IL','USA','60611',1.98),(93,26,'','2211 W Berry Street','Fort Worth','TX','USA','76110',3.96),(94,30,'','230 Elgin Street','Ottawa','ON','Canada','K2P 1L7',5.94),(95,36,'','Tauentzienstraße 8','Berlin','','Germany','10789',8.91),(96,45,'','Erzsébet krt. 58.','Budapest','','Hungary','H-1073',21.86),(97,59,'','3,Raj Bhavan Road','Bangalore','','India','560001',1.99),(98,1,'','Av. Brigadeiro Faria Lima, 2170','São José dos Campos','SP','Brazil','12227-000',3.98),(99,3,'','1498 rue Bélanger','Montréal','QC','Canada','H2G 1A7',3.98),(100,5,'','Klanova 9/506','Prague','','Czech Republic','14700',3.96);
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media_types`
--

DROP TABLE IF EXISTS `media_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `media_types` (
  `MediaTypeId` tinyint(4) DEFAULT NULL,
  `Name` varchar(27) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media_types`
--

LOCK TABLES `media_types` WRITE;
/*!40000 ALTER TABLE `media_types` DISABLE KEYS */;
INSERT INTO `media_types` VALUES (1,'MPEG audio file'),(2,'Protected AAC audio file'),(3,'Protected MPEG-4 video file'),(4,'Purchased AAC audio file'),(5,'AAC audio file');
/*!40000 ALTER TABLE `media_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `playlist_track`
--

DROP TABLE IF EXISTS `playlist_track`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `playlist_track` (
  `PlaylistId` tinyint(4) DEFAULT NULL,
  `TrackId` smallint(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `playlist_track`
--

LOCK TABLES `playlist_track` WRITE;
/*!40000 ALTER TABLE `playlist_track` DISABLE KEYS */;
INSERT INTO `playlist_track` VALUES (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(1,12),(1,13),(1,14),(1,15),(1,16),(1,17),(1,18),(1,19),(1,20),(1,21),(1,22),(1,23),(1,24),(1,25),(1,26),(1,27),(1,28),(1,29),(1,30),(1,31),(1,32),(1,33),(1,34),(1,35),(1,36),(1,37),(1,38),(1,39),(1,40),(1,41),(1,42),(1,43),(1,44),(1,45),(1,46),(1,47),(1,48),(1,49),(1,50),(1,51),(1,52),(1,53),(1,54),(1,55),(1,56),(1,57),(1,58),(1,59),(1,60),(1,61),(1,62),(1,63),(1,64),(1,65),(1,66),(1,67),(1,68),(1,69),(1,70),(1,71),(1,72),(1,73),(1,74),(1,75),(1,76),(1,77),(1,78),(1,79),(1,80),(1,81),(1,82),(1,83),(1,84),(1,85),(1,86),(1,87),(1,88),(1,89),(1,90),(1,91),(1,92),(1,93),(1,94),(1,95),(1,96),(1,97),(1,98),(1,99),(1,100);
/*!40000 ALTER TABLE `playlist_track` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `playlists`
--

DROP TABLE IF EXISTS `playlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `playlists` (
  `PlaylistId` tinyint(4) DEFAULT NULL,
  `Name` varchar(26) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `playlists`
--

LOCK TABLES `playlists` WRITE;
/*!40000 ALTER TABLE `playlists` DISABLE KEYS */;
INSERT INTO `playlists` VALUES (1,'Music'),(2,'Movies'),(3,'TV Shows'),(4,'Audiobooks'),(5,'90’s Music'),(6,'Audiobooks'),(7,'Movies'),(8,'Music'),(9,'Music Videos'),(10,'TV Shows'),(11,'Brazilian Music'),(12,'Classical'),(13,'Classical 101 - Deep Cuts'),(14,'Classical 101 - Next Steps'),(15,'Classical 101 - The Basics'),(16,'Grunge'),(17,'Heavy Metal Classic'),(18,'On-The-Go 1');
/*!40000 ALTER TABLE `playlists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sqlite_sequence`
--

DROP TABLE IF EXISTS `sqlite_sequence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sqlite_sequence` (
  `name` varchar(13) DEFAULT NULL,
  `seq` smallint(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sqlite_sequence`
--

LOCK TABLES `sqlite_sequence` WRITE;
/*!40000 ALTER TABLE `sqlite_sequence` DISABLE KEYS */;
INSERT INTO `sqlite_sequence` VALUES ('genres',25),('media_types',5),('artists',275),('albums',347),('tracks',3503),('employees',8),('customers',59),('invoices',412),('invoice_items',2240),('playlists',18);
/*!40000 ALTER TABLE `sqlite_sequence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sqlite_stat1`
--

DROP TABLE IF EXISTS `sqlite_stat1`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sqlite_stat1` (
  `tbl` varchar(14) DEFAULT NULL,
  `idx` varchar(36) DEFAULT NULL,
  `stat` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sqlite_stat1`
--

LOCK TABLES `sqlite_stat1` WRITE;
/*!40000 ALTER TABLE `sqlite_stat1` DISABLE KEYS */;
INSERT INTO `sqlite_stat1` VALUES ('tracks','IFK_TrackMediaTypeId','3503 701'),('tracks','IFK_TrackGenreId','3503 141'),('tracks','IFK_TrackAlbumId','3503 11'),('playlist_track','IFK_PlaylistTrackTrackId','8715 3'),('playlist_track','sqlite_autoindex_playlist_track_1','8715 623 1'),('albums','IFK_AlbumArtistId','347 2'),('artists','unknown_value_please_contact_support','275'),('customers','IFK_CustomerSupportRepId','59 20'),('playlists','unknown_value_please_contact_support','18'),('employees','IFK_EmployeeReportsTo','8 2'),('genres','unknown_value_please_contact_support','25'),('invoices','IFK_InvoiceCustomerId','412 7'),('media_types','unknown_value_please_contact_support','5'),('invoice_items','IFK_InvoiceLineTrackId','2240 2'),('invoice_items','IFK_InvoiceLineInvoiceId','2240 6');
/*!40000 ALTER TABLE `sqlite_stat1` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tracks`
--

DROP TABLE IF EXISTS `tracks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tracks` (
  `TrackId` smallint(6) DEFAULT NULL,
  `Name` varchar(123) DEFAULT NULL,
  `AlbumId` smallint(6) DEFAULT NULL,
  `MediaTypeId` tinyint(4) DEFAULT NULL,
  `GenreId` tinyint(4) DEFAULT NULL,
  `Composer` varchar(188) DEFAULT NULL,
  `Milliseconds` int(11) DEFAULT NULL,
  `Bytes` bigint(20) DEFAULT NULL,
  `UnitPrice` decimal(3,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tracks`
--

LOCK TABLES `tracks` WRITE;
/*!40000 ALTER TABLE `tracks` DISABLE KEYS */;
INSERT INTO `tracks` VALUES (1,'For Those About To Rock (We Salute You)',1,1,1,'Angus Young, Malcolm Young, Brian Johnson',343719,11170334,0.99),(2,'Balls to the Wall',2,2,1,'',342562,5510424,0.99),(3,'Fast As a Shark',3,2,1,'F. Baltes, S. Kaufman, U. Dirkscneider & W. Hoffman',230619,3990994,0.99),(4,'Restless and Wild',3,2,1,'F. Baltes, R.A. Smith-Diesel, S. Kaufman, U. Dirkscneider & W. Hoffman',252051,4331779,0.99),(5,'Princess of the Dawn',3,2,1,'Deaffy & R.A. Smith-Diesel',375418,6290521,0.99),(6,'Put The Finger On You',1,1,1,'Angus Young, Malcolm Young, Brian Johnson',205662,6713451,0.99),(7,'Let\'s Get It Up',1,1,1,'Angus Young, Malcolm Young, Brian Johnson',233926,7636561,0.99),(8,'Inject The Venom',1,1,1,'Angus Young, Malcolm Young, Brian Johnson',210834,6852860,0.99),(9,'Snowballed',1,1,1,'Angus Young, Malcolm Young, Brian Johnson',203102,6599424,0.99),(10,'Evil Walks',1,1,1,'Angus Young, Malcolm Young, Brian Johnson',263497,8611245,0.99),(11,'C.O.D.',1,1,1,'Angus Young, Malcolm Young, Brian Johnson',199836,6566314,0.99),(12,'Breaking The Rules',1,1,1,'Angus Young, Malcolm Young, Brian Johnson',263288,8596840,0.99),(13,'Night Of The Long Knives',1,1,1,'Angus Young, Malcolm Young, Brian Johnson',205688,6706347,0.99),(14,'Spellbound',1,1,1,'Angus Young, Malcolm Young, Brian Johnson',270863,8817038,0.99),(15,'Go Down',4,1,1,'AC/DC',331180,10847611,0.99),(16,'Dog Eat Dog',4,1,1,'AC/DC',215196,7032162,0.99),(17,'Let There Be Rock',4,1,1,'AC/DC',366654,12021261,0.99),(18,'Bad Boy Boogie',4,1,1,'AC/DC',267728,8776140,0.99),(19,'Problem Child',4,1,1,'AC/DC',325041,10617116,0.99),(20,'Overdose',4,1,1,'AC/DC',369319,12066294,0.99),(21,'Hell Ain\'t A Bad Place To Be',4,1,1,'AC/DC',254380,8331286,0.99),(22,'Whole Lotta Rosie',4,1,1,'AC/DC',323761,10547154,0.99),(23,'Walk On Water',5,1,1,'Steven Tyler, Joe Perry, Jack Blades, Tommy Shaw',295680,9719579,0.99),(24,'Love In An Elevator',5,1,1,'Steven Tyler, Joe Perry',321828,10552051,0.99),(25,'Rag Doll',5,1,1,'Steven Tyler, Joe Perry, Jim Vallance, Holly Knight',264698,8675345,0.99),(26,'What It Takes',5,1,1,'Steven Tyler, Joe Perry, Desmond Child',310622,10144730,0.99),(27,'Dude (Looks Like A Lady)',5,1,1,'Steven Tyler, Joe Perry, Desmond Child',264855,8679940,0.99),(28,'Janie\'s Got A Gun',5,1,1,'Steven Tyler, Tom Hamilton',330736,10869391,0.99),(29,'Cryin\'',5,1,1,'Steven Tyler, Joe Perry, Taylor Rhodes',309263,10056995,0.99),(30,'Amazing',5,1,1,'Steven Tyler, Richie Supa',356519,11616195,0.99),(31,'Blind Man',5,1,1,'Steven Tyler, Joe Perry, Taylor Rhodes',240718,7877453,0.99),(32,'Deuces Are Wild',5,1,1,'Steven Tyler, Jim Vallance',215875,7074167,0.99),(33,'The Other Side',5,1,1,'Steven Tyler, Jim Vallance',244375,7983270,0.99),(34,'Crazy',5,1,1,'Steven Tyler, Joe Perry, Desmond Child',316656,10402398,0.99),(35,'Eat The Rich',5,1,1,'Steven Tyler, Joe Perry, Jim Vallance',251036,8262039,0.99),(36,'Angel',5,1,1,'Steven Tyler, Desmond Child',307617,9989331,0.99),(37,'Livin\' On The Edge',5,1,1,'Steven Tyler, Joe Perry, Mark Hudson',381231,12374569,0.99),(38,'All I Really Want',6,1,1,'Alanis Morissette & Glenn Ballard',284891,9375567,0.99),(39,'You Oughta Know',6,1,1,'Alanis Morissette & Glenn Ballard',249234,8196916,0.99),(40,'Perfect',6,1,1,'Alanis Morissette & Glenn Ballard',188133,6145404,0.99),(41,'Hand In My Pocket',6,1,1,'Alanis Morissette & Glenn Ballard',221570,7224246,0.99),(42,'Right Through You',6,1,1,'Alanis Morissette & Glenn Ballard',176117,5793082,0.99),(43,'Forgiven',6,1,1,'Alanis Morissette & Glenn Ballard',300355,9753256,0.99),(44,'You Learn',6,1,1,'Alanis Morissette & Glenn Ballard',239699,7824837,0.99),(45,'Head Over Feet',6,1,1,'Alanis Morissette & Glenn Ballard',267493,8758008,0.99),(46,'Mary Jane',6,1,1,'Alanis Morissette & Glenn Ballard',280607,9163588,0.99),(47,'Ironic',6,1,1,'Alanis Morissette & Glenn Ballard',229825,7598866,0.99),(48,'Not The Doctor',6,1,1,'Alanis Morissette & Glenn Ballard',227631,7604601,0.99),(49,'Wake Up',6,1,1,'Alanis Morissette & Glenn Ballard',293485,9703359,0.99),(50,'You Oughta Know (Alternate)',6,1,1,'Alanis Morissette & Glenn Ballard',491885,16008629,0.99),(51,'We Die Young',7,1,1,'Jerry Cantrell',152084,4925362,0.99),(52,'Man In The Box',7,1,1,'Jerry Cantrell, Layne Staley',286641,9310272,0.99),(53,'Sea Of Sorrow',7,1,1,'Jerry Cantrell',349831,11316328,0.99),(54,'Bleed The Freak',7,1,1,'Jerry Cantrell',241946,7847716,0.99),(55,'I Can\'t Remember',7,1,1,'Jerry Cantrell, Layne Staley',222955,7302550,0.99),(56,'Love, Hate, Love',7,1,1,'Jerry Cantrell, Layne Staley',387134,12575396,0.99),(57,'It Ain\'t Like That',7,1,1,'Jerry Cantrell, Michael Starr, Sean Kinney',277577,8993793,0.99),(58,'Sunshine',7,1,1,'Jerry Cantrell',284969,9216057,0.99),(59,'Put You Down',7,1,1,'Jerry Cantrell',196231,6420530,0.99),(60,'Confusion',7,1,1,'Jerry Cantrell, Michael Starr, Layne Staley',344163,11183647,0.99),(61,'I Know Somethin (Bout You)',7,1,1,'Jerry Cantrell',261955,8497788,0.99),(62,'Real Thing',7,1,1,'Jerry Cantrell, Layne Staley',243879,7937731,0.99),(63,'Desafinado',8,1,2,'',185338,5990473,0.99),(64,'Garota De Ipanema',8,1,2,'',285048,9348428,0.99),(65,'Samba De Uma Nota Só (One Note Samba)',8,1,2,'',137273,4535401,0.99),(66,'Por Causa De Você',8,1,2,'',169900,5536496,0.99),(67,'Ligia',8,1,2,'',251977,8226934,0.99),(68,'Fotografia',8,1,2,'',129227,4198774,0.99),(69,'Dindi (Dindi)',8,1,2,'',253178,8149148,0.99),(70,'Se Todos Fossem Iguais A Você (Instrumental)',8,1,2,'',134948,4393377,0.99),(71,'Falando De Amor',8,1,2,'',219663,7121735,0.99),(72,'Angela',8,1,2,'',169508,5574957,0.99),(73,'Corcovado (Quiet Nights Of Quiet Stars)',8,1,2,'',205662,6687994,0.99),(74,'Outra Vez',8,1,2,'',126511,4110053,0.99),(75,'O Boto (Bôto)',8,1,2,'',366837,12089673,0.99),(76,'Canta, Canta Mais',8,1,2,'',271856,8719426,0.99),(77,'Enter Sandman',9,1,3,'Apocalyptica',221701,7286305,0.99),(78,'Master Of Puppets',9,1,3,'Apocalyptica',436453,14375310,0.99),(79,'Harvester Of Sorrow',9,1,3,'Apocalyptica',374543,12372536,0.99),(80,'The Unforgiven',9,1,3,'Apocalyptica',322925,10422447,0.99),(81,'Sad But True',9,1,3,'Apocalyptica',288208,9405526,0.99),(82,'Creeping Death',9,1,3,'Apocalyptica',308035,10110980,0.99),(83,'Wherever I May Roam',9,1,3,'Apocalyptica',369345,12033110,0.99),(84,'Welcome Home (Sanitarium)',9,1,3,'Apocalyptica',350197,11406431,0.99),(85,'Cochise',10,1,1,'Audioslave/Chris Cornell',222380,5339931,0.99),(86,'Show Me How to Live',10,1,1,'Audioslave/Chris Cornell',277890,6672176,0.99),(87,'Gasoline',10,1,1,'Audioslave/Chris Cornell',279457,6709793,0.99),(88,'What You Are',10,1,1,'Audioslave/Chris Cornell',249391,5988186,0.99),(89,'Like a Stone',10,1,1,'Audioslave/Chris Cornell',294034,7059624,0.99),(90,'Set It Off',10,1,1,'Audioslave/Chris Cornell',263262,6321091,0.99),(91,'Shadow on the Sun',10,1,1,'Audioslave/Chris Cornell',343457,8245793,0.99),(92,'I am the Highway',10,1,1,'Audioslave/Chris Cornell',334942,8041411,0.99),(93,'Exploder',10,1,1,'Audioslave/Chris Cornell',206053,4948095,0.99),(94,'Hypnotize',10,1,1,'Audioslave/Chris Cornell',206628,4961887,0.99),(95,'Bring\'em Back Alive',10,1,1,'Audioslave/Chris Cornell',329534,7911634,0.99),(96,'Light My Way',10,1,1,'Audioslave/Chris Cornell',303595,7289084,0.99),(97,'Getaway Car',10,1,1,'Audioslave/Chris Cornell',299598,7193162,0.99),(98,'The Last Remaining Light',10,1,1,'Audioslave/Chris Cornell',317492,7622615,0.99),(99,'Your Time Has Come',11,1,4,'Cornell, Commerford, Morello, Wilk',255529,8273592,0.99),(100,'Out Of Exile',11,1,4,'Cornell, Commerford, Morello, Wilk',291291,9506571,0.99);
/*!40000 ALTER TABLE `tracks` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-09-18 10:46:33
