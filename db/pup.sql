-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 03, 2025 at 11:29 AM
-- Server version: 8.0.32
-- PHP Version: 8.2.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pup`
--

-- --------------------------------------------------------

--
-- Table structure for table `md_account`
--

CREATE TABLE `md_account` (
  `sl_no` int NOT NULL,
  `account_head` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `modified_by` varchar(50) DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `md_account`
--

INSERT INTO `md_account` (`sl_no`, `account_head`, `created_by`, `created_at`, `modified_by`, `modified_at`) VALUES
(1, 'State Plan', NULL, NULL, NULL, NULL),
(2, 'Capex', NULL, NULL, NULL, NULL),
(3, 'RIDF', NULL, NULL, NULL, NULL),
(4, 'Others', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `md_block`
--

CREATE TABLE `md_block` (
  `block_id` bigint NOT NULL DEFAULT '0',
  `dist_id` int NOT NULL,
  `block_name` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `md_block`
--

INSERT INTO `md_block` (`block_id`, `dist_id`, `block_name`) VALUES
(1, 1, 'ALIPURDUAR - I'),
(2, 1, 'ALIPURDUAR - II'),
(3, 1, 'FALAKATA'),
(4, 1, 'KALCHINI'),
(5, 1, 'KUMARGRAM'),
(6, 1, 'MADARIHAT'),
(7, 2, 'BANKURA - I'),
(8, 2, 'BANKURA - II'),
(9, 2, 'BARJORA'),
(10, 2, 'CHHATNA'),
(11, 2, 'GANGAJALGHATI'),
(12, 2, 'HIRBANDH'),
(13, 2, 'INDPUR'),
(14, 2, 'INDUS'),
(15, 2, 'JAYPUR'),
(16, 2, 'KHATRA'),
(17, 2, 'KOTULPUR'),
(18, 2, 'MEJHIA'),
(19, 2, 'ONDA'),
(20, 2, 'PATRASAYER'),
(21, 2, 'RAIPUR'),
(22, 2, 'RANIBUNDH'),
(23, 2, 'SALTORA'),
(24, 2, 'SARENGA'),
(25, 2, 'SIMLAPAL'),
(26, 2, 'SONAMUKHI'),
(27, 2, 'TALDANGRA'),
(28, 2, 'VISHNUPUR'),
(29, 3, 'BOLPUR SRINIKETAN'),
(30, 3, 'DUBRAJPUR'),
(31, 3, 'ILLAMBAZAR'),
(32, 3, 'KHOYRASOL'),
(33, 3, 'LABPUR'),
(34, 3, 'MAYURESWAR - I'),
(35, 3, 'MAYURESWAR - II'),
(36, 3, 'MOHAMMAD BAZAR'),
(37, 3, 'MURARAI - I'),
(38, 3, 'MURARAI - II'),
(39, 3, 'NALHATI - I'),
(40, 3, 'NALHATI - II'),
(41, 3, 'NANOOR'),
(42, 3, 'RAJNAGAR'),
(43, 3, 'RAMPURHAT - I'),
(44, 3, 'RAMPURHAT - II'),
(45, 3, 'SAINTHIA'),
(46, 3, 'SURI - I'),
(47, 3, 'SURI - II'),
(48, 4, 'COOCH BEHAR - II'),
(49, 4, 'COOCHBEHAR I'),
(50, 4, 'DINHATA - I'),
(51, 4, 'DINHATA - II'),
(52, 4, 'HALDIBARI'),
(53, 4, 'MATHABHANGA - I'),
(54, 4, 'MATHABHANGA II'),
(55, 4, 'MEKLIGANJ'),
(56, 4, 'SITAI'),
(57, 4, 'SITALKUCHI'),
(58, 4, 'TUFANGANJ - I'),
(59, 4, 'TUFANGANJ - II'),
(60, 5, 'BALURGHAT'),
(61, 5, 'BANSIHARI'),
(62, 5, 'GANGARAMPUR'),
(63, 5, 'HARIRAMPUR'),
(64, 5, 'HILLI'),
(65, 5, 'KUMARGANJ'),
(66, 5, 'KUSHMUNDI'),
(67, 5, 'TAPAN'),
(68, 6, 'DARJEELING PULBAZAR'),
(69, 6, 'JOREBUNGLOW SUKIAPOKHRI'),
(70, 6, 'KHARIBARI'),
(71, 6, 'KURSEONG'),
(72, 6, 'MATIGARA'),
(73, 6, 'MIRIK'),
(74, 6, 'NAXALBARI'),
(75, 6, 'PHANSIDEWA'),
(76, 6, 'RANGLI RANGLIOT'),
(77, 7, 'ARAMBAG'),
(78, 7, 'BALAGARH'),
(79, 7, 'CHANDITALA - I'),
(80, 7, 'CHANDITALA - II'),
(81, 7, 'CHINSURAH - MAGRA'),
(82, 7, 'DHANIAKHALI'),
(83, 7, 'GOGHAT - I'),
(84, 7, 'GOGHAT - II'),
(85, 7, 'HARIPAL'),
(86, 7, 'JANGIPARA'),
(87, 7, 'KHANAKUL - I'),
(88, 7, 'KHANAKUL - II'),
(89, 7, 'PANDUA'),
(90, 7, 'POLBA - DADPUR'),
(91, 7, 'PURSURA'),
(92, 7, 'SERAMPUR UTTARPARA'),
(93, 7, 'SINGUR'),
(94, 7, 'TARAKESWAR'),
(95, 8, 'AMTA - I'),
(96, 8, 'AMTA - II'),
(97, 8, 'BAGNAN - I'),
(98, 8, 'BAGNAN - II'),
(99, 8, 'BALLY JAGACHHA'),
(100, 8, 'DOMJUR'),
(101, 8, 'JAGATBALLAVPUR'),
(102, 8, 'PANCHLA'),
(103, 8, 'SANKRAIL'),
(104, 8, 'SHYAMPUR - I'),
(105, 8, 'SHYAMPUR - II'),
(106, 8, 'UDAYNARAYANPUR'),
(107, 8, 'ULUBERIA - I'),
(108, 8, 'ULUBERIA - II'),
(109, 9, 'BANARHAT'),
(110, 9, 'DHUPGURI'),
(111, 9, 'JALPAIGURI'),
(112, 9, 'KRANTI'),
(113, 9, 'MAL'),
(114, 9, 'MATIALI'),
(115, 9, 'MAYNAGURI'),
(116, 9, 'NAGRAKATA'),
(117, 9, 'RAJGANJ'),
(118, 10, 'BINPUR - I'),
(119, 10, 'BINPUR - II'),
(120, 10, 'GOPIBALLAVPUR - I'),
(121, 10, 'GOPIBALLAVPUR - II'),
(122, 10, 'JAMBONI'),
(123, 10, 'JHARGRAM'),
(124, 10, 'NAYAGRAM'),
(125, 10, 'SANKRAIL'),
(126, 11, 'GORUBATHAN'),
(127, 11, 'KALIMPONG -I'),
(128, 11, 'LAVA'),
(129, 11, 'PEDONG'),
(130, 12, 'BAMANGOLA'),
(131, 12, 'CHANCHAL - I'),
(132, 12, 'CHANCHAL - II'),
(133, 12, 'ENGLISH BAZAR'),
(134, 12, 'GAZOLE'),
(135, 12, 'HABIBPUR'),
(136, 12, 'HARISCHANDRAPUR - I'),
(137, 12, 'HARISCHANDRAPUR - II'),
(138, 12, 'KALIACHAK - I'),
(139, 12, 'KALIACHAK - II'),
(140, 12, 'KALIACHAK - III'),
(141, 12, 'MALDAH (OLD)'),
(142, 12, 'MANIKCHAK'),
(143, 12, 'RATUA - I'),
(144, 12, 'RATUA - II'),
(145, 13, 'BELDANGA - I'),
(146, 13, 'BELDANGA - II'),
(147, 13, 'BERHAMPORE'),
(148, 13, 'BHAGAWANGOLA - I'),
(149, 13, 'BHAGAWANGOLA - II'),
(150, 13, 'BHARATPUR - I'),
(151, 13, 'BHARATPUR - II'),
(152, 13, 'BURWAN'),
(153, 13, 'DOMKAL'),
(154, 13, 'FARAKKA'),
(155, 13, 'HARIHARPARA'),
(156, 13, 'JALANGI'),
(157, 13, 'KANDI'),
(158, 13, 'KHARGRAM'),
(159, 13, 'LALGOLA'),
(160, 13, 'MURSHIDABAD JIAGANJ'),
(161, 13, 'NABAGRAM'),
(162, 13, 'NAWDA'),
(163, 13, 'RAGHUNATHGANJ - I'),
(164, 13, 'RAGHUNATHGANJ - II'),
(165, 13, 'RANINAGAR - I'),
(166, 13, 'RANINAGAR - II'),
(167, 13, 'SAGARDIGHI'),
(168, 13, 'SAMSERGANJ'),
(169, 13, 'SUTI - I'),
(170, 13, 'SUTI - II'),
(171, 14, 'CHAKDAH'),
(172, 14, 'CHAPRA'),
(173, 14, 'HANSKHALI'),
(174, 14, 'HARINGHATA'),
(175, 14, 'KALIGANJ'),
(176, 14, 'KALYANI'),
(177, 14, 'KARIMPUR - I'),
(178, 14, 'KARIMPUR - II'),
(179, 14, 'KRISHNAGANJ'),
(180, 14, 'KRISHNAGAR - I'),
(181, 14, 'KRISHNAGAR - II'),
(182, 14, 'NABADWIP'),
(183, 14, 'NAKASHIPARA'),
(184, 14, 'RANAGHAT - I'),
(185, 14, 'RANAGHAT - II'),
(186, 14, 'SANTIPUR'),
(187, 14, 'TEHATTA - I'),
(188, 14, 'TEHATTA - II'),
(189, 15, 'AMDANGA'),
(190, 15, 'BADURIA'),
(191, 15, 'BAGDA'),
(192, 15, 'BARASAT - I'),
(193, 15, 'BARASAT - II'),
(194, 15, 'BARRACKPUR - I'),
(195, 15, 'BARRACKPUR - II'),
(196, 15, 'BASIRHAT - I'),
(197, 15, 'BASIRHAT - II'),
(198, 15, 'BONGAON'),
(199, 15, 'DEGANGA'),
(200, 15, 'GAIGHATA'),
(201, 15, 'HABRA - I'),
(202, 15, 'HABRA - II'),
(203, 15, 'HAROA'),
(204, 15, 'HASNABAD'),
(205, 15, 'HINGALGANJ'),
(206, 15, 'MINAKHAN'),
(207, 15, 'RAJARHAT'),
(208, 15, 'SANDESHKHALI - I'),
(209, 15, 'SANDESHKHALI - II'),
(210, 15, 'SWARUPNAGAR'),
(211, 16, 'BARABANI'),
(212, 16, 'FARIDPUR DURGAPUR'),
(213, 16, 'JAMURIA'),
(214, 16, 'KANKSA'),
(215, 16, 'ONDAL'),
(216, 16, 'PANDABESWAR'),
(217, 16, 'RANIGANJ'),
(218, 16, 'SALANPUR'),
(219, 17, 'CHANDRAKONA - I'),
(220, 17, 'CHANDRAKONA - II'),
(221, 17, 'DANTAN - I'),
(222, 17, 'DANTAN - II'),
(223, 17, 'DASPUR - I'),
(224, 17, 'DASPUR - II'),
(225, 17, 'DEBRA'),
(226, 17, 'GARBETA - I'),
(227, 17, 'GARBETA - II'),
(228, 17, 'GARBETA - III'),
(229, 17, 'GHATAL'),
(230, 17, 'KESHIARY'),
(231, 17, 'KESHPUR'),
(232, 17, 'KHARAGPUR - I'),
(233, 17, 'KHARAGPUR - II'),
(234, 17, 'MIDNAPORE'),
(235, 17, 'MOHANPUR'),
(236, 17, 'NARAYANGARH'),
(237, 17, 'PINGLA'),
(238, 17, 'SABANG'),
(239, 17, 'SALBANI'),
(240, 18, 'AUSGRAM - I'),
(241, 18, 'AUSGRAM - II'),
(242, 18, 'BHATAR'),
(243, 18, 'BURDWAN - I'),
(244, 18, 'BURDWAN - II'),
(245, 18, 'GALSI - I'),
(246, 18, 'GALSI - II'),
(247, 18, 'JAMALPUR'),
(248, 18, 'KALNA - I'),
(249, 18, 'KALNA - II'),
(250, 18, 'KATWA - I'),
(251, 18, 'KATWA - II'),
(252, 18, 'KETUGRAM - I'),
(253, 18, 'KETUGRAM - II'),
(254, 18, 'KHANDAGHOSH'),
(255, 18, 'MANGOLKOTE'),
(256, 18, 'MANTESWAR'),
(257, 18, 'MEMARI - I'),
(258, 18, 'MEMARI - II'),
(259, 18, 'PURBASTHALI - I'),
(260, 18, 'PURBASTHALI - II'),
(261, 18, 'RAINA - I'),
(262, 18, 'RAINA - II'),
(263, 19, 'BHAGAWANPUR - I'),
(264, 19, 'BHAGAWANPUR - II'),
(265, 19, 'CHANDIPUR'),
(266, 19, 'CONTAI - I'),
(267, 19, 'CONTAI - III'),
(268, 19, 'DESHOPRAN'),
(269, 19, 'EGRA - I'),
(270, 19, 'EGRA - II'),
(271, 19, 'HALDIA'),
(272, 19, 'KHEJURI - I'),
(273, 19, 'KHEJURI - II'),
(274, 19, 'KOLAGHAT'),
(275, 19, 'MAHISADAL'),
(276, 19, 'MOYNA'),
(277, 19, 'NANDA KUMAR'),
(278, 19, 'NANDIGRAM - I'),
(279, 19, 'NANDIGRAM - II'),
(280, 19, 'PANSKURA'),
(281, 19, 'POTASHPUR - I'),
(282, 19, 'POTASHPUR - II'),
(283, 19, 'RAMNAGAR - I'),
(284, 19, 'RAMNAGAR - II'),
(285, 19, 'SAHID MATANGINI'),
(286, 19, 'SUTAHATA'),
(287, 19, 'TAMLUK'),
(288, 20, 'ARSHA'),
(289, 20, 'BAGMUNDI'),
(290, 20, 'BALARAMPUR'),
(291, 20, 'BARABAZAR'),
(292, 20, 'BUNDWAN'),
(293, 20, 'HURA'),
(294, 20, 'JAIPUR'),
(295, 20, 'JHALDA - I'),
(296, 20, 'JHALDA - II'),
(297, 20, 'KASHIPUR'),
(298, 20, 'MANBAZAR - I'),
(299, 20, 'MANBAZAR - II'),
(300, 20, 'NETURIA'),
(301, 20, 'PARA'),
(302, 20, 'PUNCHA'),
(303, 20, 'PURULIA - I'),
(304, 20, 'PURULIA - II'),
(305, 20, 'RAGHUNATHPUR - I'),
(306, 20, 'RAGHUNATHPUR - II'),
(307, 20, 'SANTURI'),
(308, 21, 'BARUIPUR'),
(309, 21, 'BASANTI'),
(310, 21, 'BHANGAR - I'),
(311, 21, 'BHANGAR - II'),
(312, 21, 'BISHNUPUR - I'),
(313, 21, 'BISHNUPUR - II'),
(314, 21, 'BUDGE BUDGE - I'),
(315, 21, 'BUDGE BUDGE - II'),
(316, 21, 'CANNING - I'),
(317, 21, 'CANNING - II'),
(318, 21, 'DIAMOND HARBOUR - I'),
(319, 21, 'DIAMOND HARBOUR - II'),
(320, 21, 'FALTA'),
(321, 21, 'GOSABA'),
(322, 21, 'JAYNAGAR - I'),
(323, 21, 'JAYNAGAR - II'),
(324, 21, 'KAKDWIP'),
(325, 21, 'KULPI'),
(326, 21, 'KULTALI'),
(327, 21, 'MAGRAHAT - I'),
(328, 21, 'MAGRAHAT - II'),
(329, 21, 'MANDIRBAZAR'),
(330, 21, 'MATHURAPUR - I'),
(331, 21, 'MATHURAPUR - II'),
(332, 21, 'NAMKHANA'),
(333, 21, 'PATHARPRATIMA'),
(334, 21, 'SAGAR'),
(335, 21, 'SONAR PUR'),
(336, 21, 'THAKURPUKUR MAHESTOLA'),
(337, 22, 'CHOPRA'),
(338, 22, 'GOALPOKHAR - I'),
(339, 22, 'GOALPOKHAR - II'),
(340, 22, 'HEMTABAD'),
(341, 22, 'ISLAMPUR'),
(342, 22, 'ITAHAR'),
(343, 22, 'KALIAGANJ'),
(344, 22, 'KARANDIGHI'),
(345, 22, 'RAIGANJ'),
(346, 23, 'NA');

-- --------------------------------------------------------

--
-- Table structure for table `md_district`
--

CREATE TABLE `md_district` (
  `dist_code` int NOT NULL DEFAULT '0',
  `dist_name` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `md_district`
--

INSERT INTO `md_district` (`dist_code`, `dist_name`) VALUES
(1, 'ALIPURDUAR'),
(2, 'BANKURA'),
(3, 'BIRBHUM'),
(4, 'COOCHBEHAR'),
(5, 'DAKSHIN DINAJPUR'),
(6, 'DARJEELING'),
(7, 'HOOGHLY'),
(8, 'HOWRAH'),
(9, 'JALPAIGURI'),
(10, 'JHARGRAM'),
(11, 'KALIMPONG'),
(12, 'MALDAH'),
(13, 'MURSHIDABAD'),
(14, 'NADIA'),
(15, 'NORTH 24 PARAGANAS'),
(16, 'PASCHIM BARDHAMAN'),
(17, 'PASCHIM MEDINIPUR'),
(18, 'PURBA BARDHAMAN'),
(19, 'PURBA MEDINIPUR'),
(20, 'PURULIA'),
(21, 'SOUTH 24 PARAGANAS'),
(22, 'UTTAR DINAJPUR'),
(23, 'KOLKATA');

-- --------------------------------------------------------

--
-- Table structure for table `md_fin_year`
--

CREATE TABLE `md_fin_year` (
  `sl_no` int NOT NULL,
  `fin_year` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `md_fin_year`
--

INSERT INTO `md_fin_year` (`sl_no`, `fin_year`) VALUES
(1, '2024-25'),
(2, '2025-26'),
(3, '2026-27'),
(4, '2027-28'),
(5, '2028-29'),
(6, '2029-30');

-- --------------------------------------------------------

--
-- Table structure for table `md_fund`
--

CREATE TABLE `md_fund` (
  `sl_no` int NOT NULL,
  `fund_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `modified_by` varchar(50) DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `md_fund`
--

INSERT INTO `md_fund` (`sl_no`, `fund_type`, `created_by`, `created_at`, `modified_by`, `modified_at`) VALUES
(1, 'Road', NULL, NULL, NULL, NULL),
(2, 'Culvert', NULL, NULL, NULL, NULL),
(3, 'Check Dam', NULL, NULL, NULL, NULL),
(4, 'Pond', NULL, NULL, NULL, NULL),
(5, 'Building', NULL, NULL, NULL, NULL),
(6, 'Bridge', NULL, NULL, NULL, NULL),
(7, 'Others', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `md_sector`
--

CREATE TABLE `md_sector` (
  `sl_no` int NOT NULL,
  `sector_desc` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `modified_by` varchar(50) DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `md_sector`
--

INSERT INTO `md_sector` (`sl_no`, `sector_desc`, `created_by`, `created_at`, `modified_by`, `modified_at`) VALUES
(1, 'State Plan', NULL, NULL, NULL, NULL),
(2, 'Capex', NULL, NULL, NULL, NULL),
(3, 'RIDF', NULL, NULL, NULL, NULL),
(4, 'Others', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `td_admin_approval`
--

CREATE TABLE `td_admin_approval` (
  `approval_no` int NOT NULL,
  `scheme_name` varchar(100) NOT NULL,
  `sector_id` int NOT NULL,
  `fin_year` int NOT NULL,
  `sch_amt` decimal(10,2) NOT NULL DEFAULT '0.00',
  `cont_amt` decimal(10,2) NOT NULL DEFAULT '0.00',
  `admin_approval` varchar(50) DEFAULT NULL,
  `project_id` varchar(100) NOT NULL,
  `account_head` int NOT NULL,
  `admin_approval_dt` date DEFAULT NULL,
  `project_submit` varchar(100) DEFAULT NULL,
  `impl_agency` varchar(100) DEFAULT NULL,
  `district_id` int NOT NULL,
  `block_id` int NOT NULL,
  `vetted_dpr` varchar(50) DEFAULT NULL,
  `fund_id` int NOT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `modified_by` varchar(50) DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `edit_flag` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'Y',
  `edit_permission_by` varchar(50) DEFAULT NULL,
  `edit_permission_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `td_admin_approval`
--

INSERT INTO `td_admin_approval` (`approval_no`, `scheme_name`, `sector_id`, `fin_year`, `sch_amt`, `cont_amt`, `admin_approval`, `project_id`, `account_head`, `admin_approval_dt`, `project_submit`, `impl_agency`, `district_id`, `block_id`, `vetted_dpr`, `fund_id`, `created_by`, `created_at`, `modified_by`, `modified_at`, `edit_flag`, `edit_permission_by`, `edit_permission_at`) VALUES
(1, 'ttttt', 1, 1, 100.00, 100.00, '7ccf7ff5989b155f01ce96a34550322b.pdf', '10', 10, '2024-02-26', 'teste', 'teste', 1, 1, '9c9db40c3223e7dd6cae88e3013e6e6c.pdf', 1, NULL, NULL, NULL, NULL, 'Y', NULL, NULL),
(2, 'gfhfghfgh', 2, 3, 12.00, 4534.00, '6d4b234d9e054fdd027cee011be50b2d.pdf', 'jkjh', 3, '2025-02-26', 'jhghj', 'ghjghj', 5, 65, 'b00c486b08ab6c7010408ea6bbbda2ff.pdf', 6, NULL, NULL, NULL, NULL, 'Y', NULL, NULL),
(3, 'Enter scheme name 1', 2, 3, 12.00, 4534.00, '47e20092675c8cd8ec1f331838364c28.pdf', '15', 3, '2025-02-26', 'jhghj', 'ghjghj', 5, 65, '9a87595aaa77817f4d695ef8c500ab79.pdf', 6, 'test', NULL, NULL, NULL, 'Y', NULL, NULL),
(4, 'gfhfghfgh', 2, 3, 12.00, 4534.00, NULL, 'jkjh', 3, '2025-02-26', 'jhghj', 'ghjghj', 5, 65, NULL, 6, 'test', NULL, NULL, NULL, 'Y', NULL, NULL),
(5, 'Enter scheme name 1', 2, 3, 12.00, 4534.00, NULL, '15', 3, '2025-02-26', 'jhghj', 'ghjghj', 7, 83, NULL, 6, 'test', NULL, NULL, NULL, 'Y', NULL, NULL),
(6, 'Enter scheme name 1', 2, 3, 12.00, 4534.00, NULL, '15', 3, '2025-02-26', 'jhghj', 'ghjghj', 5, 65, NULL, 6, 'test', NULL, NULL, NULL, 'Y', NULL, NULL),
(7, 'Enter scheme name 1', 2, 2, 10.00, 20.00, '9bd3bf9e038d7ff352df01f1f98ae4d6.pdf', '125456', 3, '2025-02-25', 'Project Submitted By 1', 'Project implemented By 2', 5, 65, '25329eb8ef18b97bd6fc34cff7950bcb.pdf', 6, 'test', NULL, NULL, NULL, 'Y', NULL, NULL),
(8, 'Enter scheme name 101000', 2, 2, 10.00, 2000000.00, NULL, '125456', 3, '2025-02-25', 'Project Submitted By 1', 'Project implemented By 2', 5, 0, NULL, 6, 'test', NULL, 'SSS Name Modified By', '2025-02-26 12:44:16', 'Y', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `td_expenditure`
--

CREATE TABLE `td_expenditure` (
  `approval_no` int NOT NULL,
  `payment_no` int NOT NULL,
  `payment_date` date NOT NULL,
  `payment_to` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `sch_amt` decimal(10,2) NOT NULL DEFAULT '0.00',
  `cont_amt` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_by` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `modified_by` varchar(50) DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `edit_flag` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'Y',
  `permission_by` varchar(50) DEFAULT NULL,
  `permission_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `td_expenditure`
--

INSERT INTO `td_expenditure` (`approval_no`, `payment_no`, `payment_date`, `payment_to`, `sch_amt`, `cont_amt`, `created_by`, `created_at`, `modified_by`, `modified_at`, `edit_flag`, `permission_by`, `permission_at`) VALUES
(2, 1, '2025-02-28', 'xddfg', 225.00, 50.00, 'SSS Name Created By', '2025-02-28 11:58:03', NULL, NULL, 'Y', NULL, NULL),
(3, 1, '2025-02-28', 'Expenditure One 558588', 200000.00, 1000001.00, 'SSS Name Created By', '2025-02-28 08:03:49', NULL, '2025-02-28 11:22:00', 'Y', NULL, NULL),
(3, 2, '2025-02-28', 'asd', 42.00, 45.00, 'SSS Name Created By', '2025-02-28 08:05:49', NULL, NULL, 'Y', NULL, NULL),
(3, 3, '2025-02-28', 'dfdfg', 1212.00, 21.00, 'SSS Name Created By', '2025-02-28 08:10:03', NULL, NULL, 'Y', NULL, NULL),
(4, 1, '2025-02-28', 'Expenditure One', 150.00, 120.00, 'SSS Name Created By', '2025-02-28 08:23:56', NULL, NULL, 'Y', NULL, NULL),
(4, 2, '2025-02-28', 'fghfgh', 52.00, 30.00, 'SSS Name Created By', '2025-02-28 08:24:43', NULL, NULL, 'Y', NULL, NULL),
(5, 1, '2025-02-28', 'Expenditure One 11', 101.00, 201.00, 'SSS Name Created By', '2025-02-28 07:35:21', NULL, NULL, 'Y', NULL, NULL),
(5, 2, '2025-02-28', 'Expenditure One 22', 501.00, 605.00, 'SSS Name Created By', '2025-02-28 07:42:31', NULL, NULL, 'Y', NULL, NULL),
(5, 3, '2025-02-28', 'Expenditure One 33', 501.00, 650.00, 'SSS Name Created By', '2025-02-28 07:43:21', NULL, NULL, 'Y', NULL, NULL),
(5, 4, '2025-02-28', 'Expenditure One 44', 504.00, 1022.00, 'SSS Name Created By', '2025-02-28 07:43:36', NULL, NULL, 'Y', NULL, NULL),
(7, 1, '2025-02-28', 'asdfsdf', 10.00, 20.00, 'SSS Name Created By', '2025-02-28 08:25:06', NULL, NULL, 'Y', NULL, NULL),
(7, 2, '2025-02-28', 'sadfdf', 20.00, 30.00, 'SSS Name Created By', '2025-02-28 08:26:03', NULL, NULL, 'Y', NULL, NULL),
(7, 3, '2025-02-28', 'sdfsdf', 10.00, 20.00, 'SSS Name Created By', '2025-02-28 08:26:22', NULL, NULL, 'Y', NULL, NULL),
(7, 4, '2025-02-28', 'ggfj', 10.00, 30.00, 'SSS Name Created By', '2025-02-28 08:26:41', NULL, NULL, 'Y', NULL, NULL),
(8, 1, '2025-02-28', 'Expenditure One test', 101.00, 202.00, 'SSS Name Created By', '2025-02-28 08:02:21', NULL, NULL, 'Y', NULL, NULL),
(8, 2, '2025-02-28', 'Expenditure One 555', 101.00, 301.00, 'SSS Name Created By', '2025-02-28 08:02:49', NULL, NULL, 'Y', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `td_fund_receive`
--

CREATE TABLE `td_fund_receive` (
  `approval_no` int NOT NULL,
  `receive_no` int NOT NULL,
  `receive_date` date NOT NULL,
  `received_by` varchar(100) NOT NULL,
  `instl_amt` decimal(10,2) NOT NULL DEFAULT '0.00',
  `allotment_no` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `sch_amt` decimal(10,2) NOT NULL DEFAULT '0.00',
  `cont_amt` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_by` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `modified_by` varchar(50) DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `edit_flag` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'Y',
  `permission_by` varchar(50) DEFAULT NULL,
  `permission_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `td_fund_receive`
--

INSERT INTO `td_fund_receive` (`approval_no`, `receive_no`, `receive_date`, `received_by`, `instl_amt`, `allotment_no`, `sch_amt`, `cont_amt`, `created_by`, `created_at`, `modified_by`, `modified_at`, `edit_flag`, `permission_by`, `permission_at`) VALUES
(3, 1, '2025-02-28', 'SSS Name Created By', 50.00, 'd51cf316b6f378604e2c20a667aa4231.pdf', 60.00, 50.00, 'SSS Name Created By', '2025-02-28 09:32:45', 'SSS Name Modified By', '2025-02-28 10:17:46', 'Y', NULL, NULL),
(5, 1, '2025-02-27', 'SSS Name Created By', 70.00, '5ae79e14cfd578c38bafa717f3961733.pdf', 10.00, 20.00, 'SSS Name Created By', '2025-02-27 12:43:07', 'SSS Name Modified By', '2025-02-28 10:52:57', 'Y', NULL, NULL),
(5, 2, '2025-02-27', 'SSS Name Created By', 2025.00, 'd85214eb1ce42e1c451a52b647df1b66.pdf', 501.00, 601.00, 'SSS Name Created By', '2025-02-27 12:54:58', NULL, NULL, 'Y', NULL, NULL),
(5, 3, '2025-02-27', 'SSS Name Created By', 2025.00, 'aeea777a1886ac803383d68a33a083f5.pdf', 1012.00, 202.00, 'SSS Name Created By', '2025-02-27 01:43:05', NULL, NULL, 'Y', NULL, NULL),
(5, 4, '2025-02-27', 'SSS Name Created By', 2025.00, 'f52e6b0fecddcc99d030715f59cd0181.pdf', 102.00, 150.00, 'SSS Name Created By', '2025-02-27 01:45:39', NULL, NULL, 'Y', NULL, NULL),
(8, 1, '2025-02-27', 'SSS Name Created By', 2025.00, '333d80258a665e5e75a393e386d3c832.pdf', 101.00, 202.00, 'SSS Name Created By', '2025-02-27 01:50:22', NULL, NULL, 'Y', NULL, NULL),
(8, 2, '2025-02-27', 'SSS Name Created By', 2025.00, '65bd91e0d46c89f88fb38714756fd309.pdf', 101.00, 102.00, 'SSS Name Created By', '2025-02-27 01:50:38', NULL, NULL, 'Y', NULL, NULL),
(8, 3, '2025-02-27', 'SSS Name Created By', 2025.00, '8f220dad60fc3c2d001b10f0c379c709.pdf', 102.00, 202.00, 'SSS Name Created By', '2025-02-27 01:51:08', NULL, NULL, 'Y', NULL, NULL),
(8, 4, '2025-02-27', 'SSS Name Created By', 2023.00, '9d9a2d9f924824b8da1b137d66bff652.pdf', 540.00, 650.00, 'SSS Name Created By', '2025-02-27 01:51:34', NULL, NULL, 'Y', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `td_progress`
--

CREATE TABLE `td_progress` (
  `approval_no` int NOT NULL,
  `visit_no` int NOT NULL,
  `progress_percent` int NOT NULL DEFAULT '0',
  `pic_path` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `created_by` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `modified_by` varchar(50) DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `edit_flag` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'Y',
  `permission_by` varchar(50) DEFAULT NULL,
  `permission_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `td_progress`
--

INSERT INTO `td_progress` (`approval_no`, `visit_no`, `progress_percent`, `pic_path`, `created_by`, `created_at`, `modified_by`, `modified_at`, `edit_flag`, `permission_by`, `permission_at`) VALUES
(1, 1, 20, '[\"0a718c580f4c7fd2a0e1a166bcfbf913.JPEG\",\"809e09d8f81636fc1fd71730157539e9.png\",\"0567094e3d0a5b3c316fc362b0bbeea0.png\",\"c1eb62dc6cdd07f62d4f768fad570c8a.png\"]', 'sss', '2025-02-28 12:03:37', NULL, NULL, 'Y', NULL, NULL),
(2, 1, 25, '[\"c82d55c685db45eb7e063685e27dd8f1.JPEG\",\"f4d8f708a32b1d99dca8f5a5e5e7effa.png\",\"29d98c8691a26cffb26ab270b2579792.png\",\"9ae0c7cea05e4e55b2767e56a48d03bf.png\"]', 'sss', '2025-02-28 11:54:02', NULL, NULL, 'Y', NULL, NULL),
(2, 2, 45, '[\"0dabed88b47c27f4565deb3e58d8680f.JPEG\",\"cab51860b21f496b7a29b24818d2483b.JPEG\"]', 'sss', '2025-02-28 12:56:33', NULL, NULL, 'Y', NULL, NULL),
(3, 1, 32, '[\"c72b982ace903f3269de9d679639312a.png\",\"0058b72889a9d2c4c6298902f5fcc1e6.png\",\"0de737e09b48036868d51e2a6a6b1b00.png\",\"35108fcedc5e76535a2e13a883f1bd7d.png\"]', 'sss', '2025-02-28 12:42:41', NULL, NULL, 'Y', NULL, NULL),
(4, 1, 25, '[\"34fffeda88dfad3158bd03ad35cdfbf7.JPEG\",\"06a366ef9fb08094b0e54c89433217f0.JPEG\"]', 'sss', '2025-02-28 12:51:54', NULL, NULL, 'Y', NULL, NULL),
(5, 1, 20, '[\"27b51a43bd33e17ef611292a8c1bb955.jpg\",\"f7662d9487581e7f22e8b0a4494fb0dc.jpeg\"]', 'ttttt', '2025-02-28 09:50:29', NULL, NULL, 'Y', NULL, NULL),
(5, 2, 20, '[\"e94849ea50fac492d59f5bbb7c11f465.jpg\",\"623d596671eaa45b8816a51de5cd3694.jpeg\"]', 'ttttt', '2025-02-28 10:00:25', NULL, NULL, 'Y', NULL, NULL),
(5, 3, 20, '[\"68fdb90179a98da7e692c57d4a522d83.jpeg\"]', 'ttttt', '2025-02-28 12:34:58', NULL, NULL, 'Y', NULL, NULL),
(7, 1, 35, '[\"6821f67da10fe33a14f1db9709f76dd3.JPEG\",\"556017be02a1229e4936fd3ed9324947.JPEG\",\"5b63dd7b66d504e1dd1a462e1cb1f54d.JPEG\"]', 'sss', '2025-02-28 12:25:07', NULL, NULL, 'Y', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `td_tender`
--

CREATE TABLE `td_tender` (
  `approval_no` int NOT NULL,
  `sl_no` int NOT NULL,
  `tender_date` date NOT NULL,
  `tender_notice` varchar(50) DEFAULT NULL,
  `invite_auth` varchar(100) DEFAULT NULL,
  `mat_date` date DEFAULT NULL,
  `tender_status` enum('M','N') NOT NULL COMMENT 'M - Matured\r\nN - Not Matured',
  `wo_date` date DEFAULT NULL,
  `wo_copy` varchar(50) DEFAULT NULL,
  `wo_value` decimal(10,2) NOT NULL DEFAULT '0.00',
  `comp_date_apprx` date DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `modified_by` varchar(50) DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `edit_flag` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'Y',
  `permission_by` varchar(50) DEFAULT NULL,
  `permission_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `td_tender`
--

INSERT INTO `td_tender` (`approval_no`, `sl_no`, `tender_date`, `tender_notice`, `invite_auth`, `mat_date`, `tender_status`, `wo_date`, `wo_copy`, `wo_value`, `comp_date_apprx`, `created_by`, `created_at`, `modified_by`, `modified_at`, `edit_flag`, `permission_by`, `permission_at`) VALUES
(1, 1, '2025-02-25', 'aa1cb183477bd2794d6f2e513bd5308f.pdf', 'fsffzXC', '2025-02-26', 'M', '2025-02-26', '78621b5e53663abf65b923b8f4bd2521.pdf', 0.00, '2025-02-26', 'test', '2025-02-26 07:02:34', NULL, NULL, 'Y', NULL, NULL),
(2, 2, '2025-02-25', 'c6a2a2201280ef945f713f518b88e448.pdf', 'fsffzXC_new', '2025-02-26', 'M', '2022-02-26', 'd07a79a86439110fa20b0769fb7ca4ed.pdf', 500.00, '2025-02-26', 'test', '2025-02-26 07:06:32', 'SSS Name Updated By', '2025-02-27 11:28:25', 'Y', NULL, NULL),
(5, 5, '2025-02-06', '8fa83806f2b6ea029d3c6b07a14abf56.pdf', 'Tender Inviting Authority testtttttttt', '2025-02-20', 'M', '2025-02-13', '85c4fa86112c8d0e76adb77f877ea718.pdf', 1000.00, '2025-02-11', 'test', '2025-02-27 10:47:11', NULL, NULL, 'Y', NULL, NULL),
(8, 3, '2025-02-13', '8511c7767b32f5770b7a69894c4e14d0.pdf', 'Tender Inviting Authority', '2025-02-05', 'M', '2025-02-13', '4c708f0b5289317ffa59d250370cd9c2.pdf', 1000.00, '2025-02-13', 'test', '2025-02-27 09:10:23', 'SSS Name Updated By', '2025-02-28 06:30:53', 'Y', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `td_user`
--

CREATE TABLE `td_user` (
  `id` int NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `pass` varchar(255) NOT NULL,
  `user_type` enum('U','A') NOT NULL,
  `name` varchar(150) NOT NULL,
  `user_status` enum('A','I') NOT NULL,
  `created_by` varchar(155) NOT NULL,
  `created_at` datetime NOT NULL,
  `created_ip` varchar(155) DEFAULT NULL,
  `modified_by` varchar(155) DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `modified_ip` varchar(155) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `td_user`
--

INSERT INTO `td_user` (`id`, `user_id`, `pass`, `user_type`, `name`, `user_status`, `created_by`, `created_at`, `created_ip`, `modified_by`, `modified_at`, `modified_ip`) VALUES
(1, 'sss', '$2y$10$8xEUeSojU2iJsoC0oAG8nuZ6fMNzOdfmWvs4eQ93p1XGJigPHaED2', 'U', 'Teste', 'A', 'Teste', '2025-02-27 11:51:33', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `td_utilization`
--

CREATE TABLE `td_utilization` (
  `approval_no` int NOT NULL,
  `certificate_no` int NOT NULL,
  `certificate_date` date NOT NULL,
  `certificate_path` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `issued_by` varchar(50) DEFAULT NULL,
  `issued_to` varchar(50) DEFAULT NULL,
  `created_by` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `modified_by` varchar(50) DEFAULT NULL,
  `modified_at` datetime DEFAULT NULL,
  `edit_flag` enum('Y','N') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'Y',
  `permission_by` varchar(50) DEFAULT NULL,
  `permission_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `td_utilization`
--

INSERT INTO `td_utilization` (`approval_no`, `certificate_no`, `certificate_date`, `certificate_path`, `issued_by`, `issued_to`, `created_by`, `created_at`, `modified_by`, `modified_at`, `edit_flag`, `permission_by`, `permission_at`) VALUES
(2, 1, '2025-02-28', '9d582505f5cd30ffbd5a57717f52421e.pdf', 'dsfsdfgfdfgdfg', 'dfgdfgdfgdfgdfg', 'SSS Name Created By', '2025-02-28 12:41:13', NULL, '2025-02-28 12:59:29', 'Y', NULL, NULL),
(2, 2, '2025-02-28', '471ca353a01758a8bba8401585a2908e.pdf', 'fdsdf', 'sdfgdfg', 'SSS Name Created By', '2025-02-28 01:13:30', NULL, NULL, 'Y', NULL, NULL),
(2, 3, '2025-02-28', '55dc3ccbfdd0a74b74692c204a87b910.pdf', 'dfgdfg', 'dfgdfg', 'SSS Name Created By', '2025-02-28 01:13:44', NULL, NULL, 'Y', NULL, NULL),
(2, 4, '2025-02-28', '8206e548fe67cd83143a623bf6ef2aac.pdf', 'dfgdfg', 'fgdfg', 'SSS Name Created By', '2025-02-28 01:13:51', NULL, NULL, 'Y', NULL, NULL),
(2, 5, '2025-02-28', 'a37ecb8c8eaad748eba608df5e16cc31.pdf', 'jgjhghj', 'jhghj', 'SSS Name Created By', '2025-02-28 01:16:44', NULL, NULL, 'Y', NULL, NULL),
(3, 1, '2025-02-28', '4dc99bc083fc8331546aa6e89eda6fad.pdf', 'dfsfg', 'dfgdfg', 'SSS Name Created By', '2025-02-28 12:02:45', NULL, NULL, 'Y', NULL, NULL),
(3, 2, '2025-02-28', '48fe4285c4703048fdf7e9a4702cf807.pdf', 'dfsgdgrf', 'dfgdfg', 'SSS Name Created By', '2025-02-28 12:03:52', NULL, NULL, 'Y', NULL, NULL),
(3, 3, '2025-02-28', 'f9ca6bc4cead9b353d11e08f948e3a33.pdf', 'Issued By name', 'Issued To name', 'SSS Name Created By', '2025-02-28 12:14:07', NULL, NULL, 'Y', NULL, NULL),
(3, 4, '2025-02-28', 'd8560b1c0c3404fd8060b4d9decac460.pdf', 'dfd', 'sdfgdsgf', 'SSS Name Created By', '2025-02-28 12:14:18', NULL, NULL, 'Y', NULL, NULL),
(8, 1, '2025-02-28', 'f34c028fbaba117ccd7c0fc60a54031e.pdf', 'Test11111111111111111', 'Kolkata', NULL, '2025-02-28 11:37:14', NULL, '2025-02-28 13:03:12', 'Y', NULL, NULL),
(8, 2, '2025-02-28', 'f75fc9199da7e7c5e17acfc765ce93d9.pdf', 'Test', 'Kolkata', NULL, '2025-02-28 11:37:59', NULL, NULL, 'Y', NULL, NULL),
(8, 3, '2025-02-28', '4762c60a69386ca32e59e5ef090815b8.pdf', 'Test', 'Kolkata', 'csadasdsa', '2025-02-28 11:52:10', NULL, NULL, 'Y', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `test_table`
--

CREATE TABLE `test_table` (
  `id` int NOT NULL,
  `name` varchar(155) DEFAULT NULL,
  `email` varchar(155) NOT NULL,
  `pdf_path` varchar(155) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `test_table`
--

INSERT INTO `test_table` (`id`, `name`, `email`, `pdf_path`) VALUES
(1, 'ttttttt', 'sadsadsafsdf', 'uploads/0315bace5c5f4b9c0c43bd461987015a.pdf'),
(2, 'kjljkj', 'kookjoik', 'uploads/a6508ff096e609c72d5430009f09466f.pdf');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `md_account`
--
ALTER TABLE `md_account`
  ADD PRIMARY KEY (`sl_no`);

--
-- Indexes for table `md_block`
--
ALTER TABLE `md_block`
  ADD PRIMARY KEY (`block_id`);

--
-- Indexes for table `md_district`
--
ALTER TABLE `md_district`
  ADD PRIMARY KEY (`dist_code`);

--
-- Indexes for table `md_fin_year`
--
ALTER TABLE `md_fin_year`
  ADD PRIMARY KEY (`sl_no`);

--
-- Indexes for table `md_fund`
--
ALTER TABLE `md_fund`
  ADD PRIMARY KEY (`sl_no`);

--
-- Indexes for table `md_sector`
--
ALTER TABLE `md_sector`
  ADD PRIMARY KEY (`sl_no`);

--
-- Indexes for table `td_admin_approval`
--
ALTER TABLE `td_admin_approval`
  ADD PRIMARY KEY (`approval_no`);

--
-- Indexes for table `td_expenditure`
--
ALTER TABLE `td_expenditure`
  ADD PRIMARY KEY (`approval_no`,`payment_date`,`payment_no`) USING BTREE;

--
-- Indexes for table `td_fund_receive`
--
ALTER TABLE `td_fund_receive`
  ADD PRIMARY KEY (`approval_no`,`receive_no`,`receive_date`) USING BTREE;

--
-- Indexes for table `td_progress`
--
ALTER TABLE `td_progress`
  ADD PRIMARY KEY (`approval_no`,`visit_no`) USING BTREE;

--
-- Indexes for table `td_tender`
--
ALTER TABLE `td_tender`
  ADD PRIMARY KEY (`approval_no`,`sl_no`) USING BTREE;

--
-- Indexes for table `td_user`
--
ALTER TABLE `td_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `td_utilization`
--
ALTER TABLE `td_utilization`
  ADD PRIMARY KEY (`approval_no`,`certificate_no`);

--
-- Indexes for table `test_table`
--
ALTER TABLE `test_table`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `md_account`
--
ALTER TABLE `md_account`
  MODIFY `sl_no` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `md_fin_year`
--
ALTER TABLE `md_fin_year`
  MODIFY `sl_no` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `md_fund`
--
ALTER TABLE `md_fund`
  MODIFY `sl_no` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `md_sector`
--
ALTER TABLE `md_sector`
  MODIFY `sl_no` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `td_user`
--
ALTER TABLE `td_user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `test_table`
--
ALTER TABLE `test_table`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
