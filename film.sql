-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 13, 2021 at 03:42 PM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 8.0.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `film`
--

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `dateBooking` date NOT NULL,
  `timeBooking` time NOT NULL,
  `movieId` int(11) NOT NULL,
  `scheduleId` int(11) NOT NULL,
  `totalTicket` int(20) NOT NULL,
  `totalPayment` int(20) NOT NULL,
  `paymentMethod` varchar(255) NOT NULL,
  `statusPayment` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updateAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `booking`
--

INSERT INTO `booking` (`id`, `userId`, `dateBooking`, `timeBooking`, `movieId`, `scheduleId`, `totalTicket`, `totalPayment`, `paymentMethod`, `statusPayment`, `createdAt`, `updateAt`) VALUES
(1, 1, '2020-09-09', '10:00:00', 3, 2, 0, 50000, 'paypal', 'success', '2021-09-26 14:33:36', NULL),
(2, 1, '2020-09-09', '10:00:00', 3, 2, 0, 50000, 'paypal', 'success', '2021-09-26 14:34:53', NULL),
(3, 1, '2020-09-09', '10:00:00', 3, 2, 0, 50000, 'paypal', 'success', '2021-09-26 14:36:24', NULL),
(4, 1, '2020-09-09', '10:00:00', 3, 2, 0, 50000, 'paypal', 'success', '2021-09-26 14:38:13', NULL),
(5, 1, '2020-09-09', '10:00:00', 3, 2, 0, 50000, 'paypal', 'success', '2021-09-26 14:41:49', NULL),
(6, 1, '2020-09-09', '10:00:00', 3, 2, 0, 50000, 'paypal', 'success', '2021-09-26 14:43:12', NULL),
(7, 1, '2020-09-09', '10:00:00', 3, 2, 0, 50000, 'paypal', 'success', '2021-09-26 14:44:32', NULL),
(8, 1, '2020-09-09', '10:00:00', 3, 2, 0, 50000, 'paypal', 'success', '2021-09-26 14:45:12', NULL),
(9, 1, '2020-09-09', '10:00:00', 3, 2, 0, 34000, 'BCA', 'success', '2021-09-27 04:48:14', NULL),
(10, 1, '2020-09-09', '10:00:00', 12, 3, 0, 34000, 'BCA', 'success', '2021-10-25 22:59:27', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `bookingseats`
--

CREATE TABLE `bookingseats` (
  `id` int(11) NOT NULL,
  `bookingId` int(11) NOT NULL,
  `movieId` int(11) NOT NULL,
  `scheduleId` int(11) NOT NULL,
  `dateSchedule` date NOT NULL,
  `timeSchedule` time NOT NULL,
  `seat` varchar(10) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updateAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `bookingseats`
--

INSERT INTO `bookingseats` (`id`, `bookingId`, `movieId`, `scheduleId`, `dateSchedule`, `timeSchedule`, `seat`, `createdAt`, `updateAt`) VALUES
(1, 8, 3, 2, '2020-09-09', '10:00:00', 'A1', '2021-09-26 14:45:12', NULL),
(2, 8, 3, 2, '2020-09-09', '10:00:00', 'A2', '2021-09-26 14:45:12', NULL),
(3, 8, 3, 2, '2020-09-09', '10:00:00', 'A3', '2021-09-26 14:45:12', NULL),
(4, 9, 3, 2, '2020-09-09', '10:00:00', 'A4', '2021-09-27 04:48:14', NULL),
(5, 9, 3, 2, '2020-09-09', '10:00:00', 'A5', '2021-09-27 04:48:14', NULL),
(6, 9, 3, 2, '2020-09-09', '10:00:00', 'A6', '2021-09-27 04:48:15', NULL),
(7, 10, 12, 3, '2020-09-09', '10:00:00', 'A4', '2021-10-25 22:59:27', NULL),
(8, 10, 12, 3, '2020-09-09', '10:00:00', 'A5', '2021-10-25 22:59:27', NULL),
(9, 10, 12, 3, '2020-09-09', '10:00:00', 'A6', '2021-10-25 22:59:27', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `movie`
--

CREATE TABLE `movie` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `genre` varchar(255) NOT NULL,
  `director` varchar(255) NOT NULL,
  `duration` varchar(255) NOT NULL,
  `cast` varchar(255) NOT NULL,
  `synopsis` varchar(255) NOT NULL,
  `releaseDate` date NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT NULL,
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `movie`
--

INSERT INTO `movie` (`id`, `name`, `genre`, `director`, `duration`, `cast`, `synopsis`, `releaseDate`, `createdAt`, `updatedAt`, `image`) VALUES
(9, 'Jumper', 'Adventure', 'David Koepp', '2 Hours', 'Joseph Gordon', 'For bike messenger Wilee (Joseph Gordon-Levitt), dodging speeding cars, evading crazy cabdrivers, and blowing by millions of cranky pedestrians is all in a day\'s work. Wilee is one of the best in a dangerous job, and his bike of choice is a Fixie, a light', '2017-11-11', '2021-10-07 03:07:07', NULL, '2021-10-07T03-07-06.154ZKoala.jpg'),
(10, 'Premium Rush', 'Adventure', 'David Koepp', '2 Hours', 'Joseph Gordon', 'For bike messenger Wilee (Joseph Gordon-Levitt), dodging speeding cars, evading crazy cabdrivers, and blowing by millions of cranky pedestrians is all in a day\'s work. Wilee is one of the best in a dangerous job, and his bike of choice is a Fixie, a light', '2017-10-11', '2021-10-25 08:50:56', NULL, '2021-10-25T08-50-54.400Zpremium rush.jpg'),
(11, 'Hugo', 'Adventure', 'Martin Scorsese', '2 Hours', 'Asa Butterfield', 'In 1931 Paris, an orphan living in the walls of a train station gets wrapped up in a mystery involving his late father and an automaton.', '2017-11-11', '2021-10-25 08:57:20', NULL, '2021-10-25T08-57-20.199Zhugo.jpg'),
(12, 'Bridge to Terabithia', 'Adventure', 'Gabor Csupo', '2 Hours', 'Josh Hutcherson', 'A preteen\'s life turns upside down when he befriends the new girl in school and they imagine a whole new fantasy world to escape reality.', '2017-11-11', '2021-10-25 09:07:20', NULL, '2021-10-25T09-07-20.866Zterabitha.jpg'),
(14, 'pandega', 'historical fiction', 'Vincent Ward', '2 hours', 'Robin Williams', 'dega', '2021-11-03', '2021-11-03 09:10:59', NULL, '2021-11-03T09-10-59.435Zdreams.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `schedule`
--

CREATE TABLE `schedule` (
  `id` int(11) NOT NULL,
  `movieId` int(11) NOT NULL,
  `premiere` varchar(255) NOT NULL,
  `price` int(20) NOT NULL,
  `location` varchar(255) NOT NULL,
  `dateStart` datetime NOT NULL,
  `dateEnd` datetime NOT NULL,
  `time` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `schedule`
--

INSERT INTO `schedule` (`id`, `movieId`, `premiere`, `price`, `location`, `dateStart`, `dateEnd`, `time`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'CInema 21', 50000, 'Bogor, Jakarta', '2021-09-23 10:00:00', '2021-10-23 10:00:00', '08:00', '2021-09-24 06:36:11', '2021-09-24 07:53:34'),
(2, 2, 'CInema 21', 35000, 'Bogor', '2021-09-23 10:00:00', '2021-10-23 10:00:00', '08:00,10:00', '2021-09-27 04:26:26', NULL),
(3, 2, 'CInema 21', 35000, 'Bogor', '2021-09-23 10:00:00', '2021-10-23 10:00:00', '08:00,10:00', '2021-09-27 04:27:22', NULL),
(4, 2, 'CInema 21', 35000, 'Bogor', '2021-09-23 10:00:00', '2021-10-23 10:00:00', '08:00,10:00', '2021-09-27 04:34:19', NULL),
(5, 2, 'CInema 21', 35000, 'Bogor', '2021-09-23 10:00:00', '2021-10-23 10:00:00', '08:00,10:00', '2021-09-27 04:34:24', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(255) NOT NULL,
  `email` varchar(155) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `isActive` int(2) NOT NULL DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updateAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `first_name`, `last_name`, `image`, `role`, `isActive`, `createdAt`, `updateAt`) VALUES
('11485f08-f731-4440-8d08-23724f3527f0', 'degaforphone@gmail.com', '123', 'wafi', 'pandega', '2021-10-04T00-52-49.244ZLighthouse.jpg', 'user', 0, '2021-10-04 00:52:49', NULL),
('1e0d335c-fde3-4ca8-b415-a2b1d9c25ff0', 'wpandega11@gmail.com', '$2b$10$J7F0Z9xtMuYTVv0MRoXCuuaWElPgqv6qDmjyGv4dmfOPLTymcGZmO', 'wafi', 'pandega', '2021-11-04T00-22-19.374ZLighthouse.jpg', 'user', 0, '2021-11-04 00:22:20', NULL),
('26c74863-b99a-4fde-96fd-a6c05ea6f057', 'wpandega1412@gmail.com', '123', 'wafi', 'pandega', '2021-10-04T00-57-52.514ZLighthouse.jpg', 'user', 0, '2021-10-04 00:57:52', NULL),
('3a365355-70df-4aaf-832c-b476ba6cf6a4', 'wpandega212@gmail.com', '$2b$10$a6KBYjJFgsXxsaDVjcFigeegwtsAbk2i6JrB94WKvqP6AH3A9i.De', 'pandega', 'wafi', '2021-10-04T01-06-35.029ZLighthouse.jpg', 'user', 0, '2021-10-04 01:06:35', '2021-10-04 04:09:17'),
('4680821e-81b0-492d-8627-d4f73c70b07d', 'wpandega81@gmail.com', '$2b$10$z6NAVxdhY5dgyWorNIzveOba5gr1iW5yAtlekeLch0/GIkLVSZbr2', 'wafi', 'pandega', NULL, 'user', 1, '2021-12-13 14:37:10', NULL),
('4a17eead-9b3f-4494-9ed1-c77edb08f619', 'wpandega12345@gmail.com', '$2b$10$Ra1oZCQb7x2UncrYOECSfOiQnYB.IxsKR46oK16UpgpilC7EWrUv.', 'wafi', 'dega', '', 'user', 0, '2021-12-13 03:21:00', NULL),
('58d88787-5715-4e11-92d2-139b0de41fb0', 'wpandega1413@gmail.com', '[object Promise]', 'wafi', 'pandega', '2021-10-04T01-04-39.691ZLighthouse.jpg', 'user', 0, '2021-10-04 01:04:39', NULL),
('5d3efb73-3d9b-4823-a8a3-aabf39521484', 'wpandega91@gmail.com', '$2b$10$1xvxxNdqmD5WTi8PdakUS.VvMXbwkoW6ww7L0oKyGQKFAgpeW.vke', 'Wafi', 'Pandega', '2021-12-13T00-10-23.762Zhutao.jpg', 'user', 1, '2021-10-21 04:53:33', '2021-12-13 02:09:40'),
('60a94e4b-26d6-4672-8bab-d208b05b1205', 'wpandega71@gmail.com', '$2b$10$ir1SqavKYCBhKS3HDdEVrenSjQH2YSYQJmjo79Px1wDb4hXzwdRYG', 'Ardhi banteng', 'Sakit mental', '2021-12-13T03-18-18.511Zzhongli.png', 'user', 1, '2021-10-07 07:16:52', '2021-12-13 04:38:21'),
('7a9a6a15-5caf-4945-aa24-ccc3f85df6f6', 'degacollege@gmail.com', '$2b$10$B9Pz2lo1SOiWgxFN7hKbs.UJ/crxv.eWZ/ukoTeOkyIPNlY/q8nCO', 'wafi', 'pandega', '2021-10-04T02-58-21.263ZDaftar Peserta Vaksin.docx', 'user', 0, '2021-10-03 19:33:32', '2021-10-07 06:55:18'),
('886e184d-1140-4b22-9c94-02badb443ce1', 'wpandega1415@gmail.com', '$2b$10$0FA5xwqTn.anJoekIrfZMu6OzIc5mCRjKG.nSeJBxsa5hF02QIBSK', 'wafi', 'pandega', '2021-10-04T01-32-01.619ZLighthouse.jpg', 'user', 0, '2021-10-04 01:32:02', NULL),
('bc2fe47b-fdad-49a6-b695-60a5ffa71dbf', 'reyhan21@gmail.com', '$2b$10$7lzOYJiSN9Iwo9HZ6Knn.u.NEpOkD0gH2lvNxJPBHVN/x/rkAXXbK', 'wafi', 'pandega', NULL, 'user', 0, '2021-12-13 12:57:39', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bookingseats`
--
ALTER TABLE `bookingseats`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `movie`
--
ALTER TABLE `movie`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `schedule`
--
ALTER TABLE `schedule`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `booking`
--
ALTER TABLE `booking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `bookingseats`
--
ALTER TABLE `bookingseats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `movie`
--
ALTER TABLE `movie`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `schedule`
--
ALTER TABLE `schedule`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
