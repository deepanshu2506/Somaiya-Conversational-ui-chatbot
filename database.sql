-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 26, 2020 at 04:54 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.1

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

INSERT INTO `answers` (`id`, `optionid`, `answer`) VALUES
(15, 35, '1)Computer Engineering<br/>2)Information Technology<br/>3) Electronics Engineering<br/>4) Electronics and Telecommunication Engineering<br/>5) Mechanical Engineering'),
(16, 36, '1)Computer Engineering<br/>2)Information Technology<br/>3) Electronics Engineering<br/>4) Electronics and Telecommunication Engineering<br/>5) Mechanical Engineering'),
(18, 42, 'Rs. 26,700'),
(19, 43, 'Rs. 1,74,328/-'),
(20, 44, 'Rs. 1,00,514'),
(21, 45, 'Rs. 1,66,303/- '),
(22, 46, 'Rs. 1,67,053/-'),
(23, 47, 'Rs. 1,67,053/-'),
(24, 41, 'Rs. 1,00,000/-'),
(25, 48, '1)Computer Engineering<br/>2)Information Technology<br/>3) Electronics Engineering<br/>4) Electronics and Telecommunication Engineering<br/>5) Mechanical Engineering');

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

INSERT INTO `options` (`id`, `option_name`, `for_question`, `next_question`) VALUES
(12, 'Not Listed', 1, -11),
(34, 'courses', 1, 13),
(35, 'UG', 13, NULL),
(36, 'PG', 13, NULL),
(38, 'Fees', 1, 14),
(39, 'UG', 14, 15),
(40, 'PG', 14, 16),
(41, 'Ph.D', 14, NULL),
(42, 'SC/ST', 15, NULL),
(43, 'OPEN', 15, NULL),
(44, 'OBC', 15, NULL),
(45, 'Mumbai University', 16, NULL),
(46, 'Other within Maharashtra', 16, NULL),
(47, 'Other outside Maharashtra', 16, NULL),
(48, 'P.hD', 13, NULL),
(49, 'abcd', 1, -1);

--
-- Triggers `options`
--
DELIMITER $$
CREATE TRIGGER `option_delete_trigger` AFTER DELETE ON `options` FOR EACH ROW DELETE from questions WHERE id in (OLD.next_question)
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `other_questions`
--

CREATE TABLE `other_questions` (
  `id` int(11) NOT NULL,
  `question` mediumtext NOT NULL,
  `email` varchar(50) NOT NULL,
  `location` text NOT NULL,
  `isReplied` int(11) NOT NULL DEFAULT 0,
  `reply` mediumtext NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `other_questions`
--

INSERT INTO `other_questions` (`id`, `question`, `email`, `location`, `isReplied`, `reply`, `timestamp`) VALUES
(1, 'hello everyone', 'taleleharshavardhan1@gmail.com', 'Mumbai', 0, '', '2020-01-20 13:16:40'),
(2, 'hellooo', 'vanganideepanshu@gmail.com', 'Mumbai', 0, '', '2020-01-20 13:45:50'),
(3, 'hello everyone', 'taleleharshavardhan1@gmail.com', 'Mumbai', 0, 'hellloooo', '2020-01-20 14:51:49'),
(4, 'heyyy', 'deepanshu.v@somaiya.edu', 'Mumbai', 0, 'hellloooo', '2020-01-20 17:40:01'),
(5, 'ok', 'vanganideepanshu@gmail.com', 'Mumbai', 0, 'heyyy', '2020-01-22 15:56:30'),
(6, 'hello', 'vanganideepanshu@gmail.com', 'Mumbai', 0, 'heyyy', '2020-01-23 14:50:36'),
(7, 'hellooo', 'vanganideepanshu@gmail.com', 'Mumbai', 0, 'heyyy', '2020-01-25 14:41:47');

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
(1, 'Hello, I am SAHEB<br/>How May I Help You'),
(13, 'what level of courses? '),
(14, 'what level of course? '),
(15, 'What category?'),
(16, 'What is your home university?');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email_id` varchar(50) NOT NULL,
  `password` mediumtext NOT NULL,
  `last_login` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email_id`, `password`, `last_login`, `date_created`) VALUES
(1, 'vanganideepanshu@gmail.com', '0e193ec2f6fa21b658bf871d898b2c19ad470990c32388964439a21b8a39bc2c', '2020-01-14 12:18:03', '2020-01-14 12:28:24');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `answers`
--
ALTER TABLE `other_questions` ADD `groupNo` INT NOT NULL DEFAULT '-1';

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
-- Indexes for table `other_questions`
--
ALTER TABLE `other_questions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `answers`
--
ALTER TABLE `answers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `options`
--
ALTER TABLE `options`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `other_questions`
--
ALTER TABLE `other_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
