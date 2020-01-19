-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 25, 2019 at 06:13 PM
-- Server version: 10.4.10-MariaDB
-- PHP Version: 7.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `chat-bot`
--

-- --------------------------------------------------------

--
-- Table structure for table `answers`
--

CREATE TABLE `answers` (
  `id` int(11) NOT NULL,
  `optionid` int(11) NOT NULL,
  `answer` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `answers`
--



-- --------------------------------------------------------

--
-- Table structure for table `options`
--

CREATE TABLE `options` (
  `id` int(11) NOT NULL,
  `option_name` text NOT NULL,
  `for_question` int(11) NOT NULL,
  `next_question` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `options`
--


--
-- Triggers `options`
--
DELIMITER $$
CREATE TRIGGER `option_delete_trigger` AFTER DELETE ON `options` FOR EACH ROW DELETE from questions WHERE id in (OLD.next_question)
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL,
  `question` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `question`) VALUES
(1, 'Hello, I am SAHEB<br>How May I Help You.'),
(2, 'Which Level of Courses are you Looking For?'),
(3, 'What category do you belong to?'),
(4, 'Fees for what type of course?');
INSERT INTO `options` (`id`, `option_name`, `for_question`, `next_question`) VALUES
(1, 'UG', 2, NULL),
(2, 'PG', 2, NULL),
(3, 'PHD', 2, NULL),
(4, 'Courses', 1, 2),
(5, 'Fees', 1, 4),
(6, 'UG', 4, 3),
(7, 'PG', 4, 3),
(8, 'PHD', 4, 3),
(9, 'OPEN', 3, NULL),
(10, 'SC/ST', 3, NULL),
(11, 'OBC', 3, NULL),
(12, 'Not Listed', 1, -11);
INSERT INTO `answers` (`id`, `optionid`, `answer`) VALUES
(1, 1, 'The various courses Offered are:<br>1)Computer Engineering<br>2)IT'),
(2, 2, 'The various courses Offered are:<br>1)M.Tech in Computer Engineering<br>2)M.tech in IT'),
(3, 3, 'The various courses Offered are:<br>1)PHD in Computer Engineering<br>2)PHD in IT'),
(4, 9, 'Rs. 1,72,000/-'),
(5, 10, 'Rs. 25,000/-'),
(6, 11, 'Rs. 97,000/-');


CREATE TABLE `chat-bot`.`other_questions` ( `id` INT NOT NULL AUTO_INCREMENT , `question` INT NOT NULL , `timestamp` INT NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (`id`)) ENGINE = InnoDB;
--
-- Indexes for dumped tables
--

--
-- Indexes for table `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `optionid_unique_key` (`optionid`);

--
-- Indexes for table `options`
--
ALTER TABLE `options`
  ADD PRIMARY KEY (`id`),
  ADD KEY `for_question` (`for_question`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `answers`
--
ALTER TABLE `answers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `options`
--
ALTER TABLE `options`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `answers`
--
ALTER TABLE `answers`
  ADD CONSTRAINT `answers_ibfk_1` FOREIGN KEY (`optionid`) REFERENCES `options` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `options`
--
ALTER TABLE `options`
  ADD CONSTRAINT `options_ibfk_1` FOREIGN KEY (`for_question`) REFERENCES `questions` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
