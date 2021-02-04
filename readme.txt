SMALLCAFFE
------------------------------------------
******************************************
GUEST SIDE
******************************************
Create react application:
D:\nodejs\smallcaffe>npx create-react-app guest
D:\nodejs\smallcaffe>cd guest
D:\nodejs\smallcaffe\client>npm start
http://localhost:3000

Install packages:
D:\nodejs\smallcaffe\client>npm install @apollo/react-hooks
D:\nodejs\smallcaffe\client>npm install graphql
D:\nodejs\smallcaffe\client>npm install apollo-boost graphql react-apollo
D:\nodejs\smallcaffe\client>npm install reactstrap
D:\nodejs\smallcaffe\client>npm install react-router-dom
D:\nodejs\smallcaffe\client>npm install react-bootstrap

******************************************
SERVER SIDE
******************************************
Install packages:
D:\nodejs\smallcaffe\server>npm init
D:\nodejs\smallcaffe\server>npm install express
D:\nodejs\smallcaffe\server>npm install graphql express-graphql
D:\nodejs\smallcaffe\server>npm install cors
D:\nodejs\smallcaffe\server>npm install mysql

Testing using graphiql:
D:\nodejs\smallcaffe\server>node index.js

IN:
{
  getArticles {
    id
    name
    price
    active
  }
}
OUT:
{
  "data": {
    "getArticles": [
      {
        "id": 1,
        "name": "Piće 1",
        "price": 10,
        "active": true
      },
      {
        "id": 2,
        "name": "Piće 2",
        "price": 20,
        "active": true
      },
      {
        "id": 3,
        "name": "Piće 3",
        "price": 30,
        "active": true
      },
      {
        "id": 4,
        "name": "Piće 4",
        "price": 40,
        "active": true
      }
    ]
  }
}

IN:
{
  getArticle(id:1) {
    id
    name
    price
    active
  }
}
OUT:
{
  "data": {
    "getArticle": {
      "id": 1,
      "name": "Piće 1",
      "price": 10,
      "active": true
    }
  }
}

IN:
{
  getGuestorder(id: 1) {
    id
    id_table
    status
    price
    ordertime
  }
}
OUT:
{
  "data": {
    "getGuestorder": {
      "id": 1,
      "id_table": 1,
      "status": 1,
      "price": 100,
      "ordertime": "2020-11-05T22:45:35.000Z"
    }
  }
}

IN:
{
  getAllArticlesinorder(id: 1) {
    id_order
    id_article
    quantity
    price_article
    price_total
  }
}
OUT:
{
  "data": {
    "getAllArticlesinorder": [
      {
        "id_order": 1,
        "id_article": 1,
        "quantity": 1,
        "price_article": 10,
        "price_total": 10
      },
      {
        "id_order": 1,
        "id_article": 2,
        "quantity": 1,
        "price_article": 20,
        "price_total": 20
      },
      {
        "id_order": 1,
        "id_article": 3,
        "quantity": 1,
        "price_article": 30,
        "price_total": 30
      },
      {
        "id_order": 1,
        "id_article": 4,
        "quantity": 1,
        "price_article": 40,
        "price_total": 40
      }
    ]
  }
}

//Mutacija u graphiql
IN:
mutation{
  createGuestOrder(id_table: 1, price: 10) 
} 
OUT:
{
  "data": {
    "createGuestOrder": true
  }
}

IN:
{
  getGuestordersOnTable(id_table:2) {
    id
    id_table
    status
    price
    ordertime
  }
}
OUT:
{
  "data": {
    "getGuestordersOnTable": [
      {
        "id": "KHIGPE13D0R2E",
        "id_table": 2,
        "status": 0,
        "price": 40,
        "ordertime": "2020-11-15T01:50:32.000Z"
      },
      {
        "id": "KHIGRKGEZTG89",
        "id_table": 2,
        "status": 0,
        "price": 50,
        "ordertime": "2020-11-15T01:52:16.000Z"
      },
      {
        "id": "KHJG2C2TPBZXH",
        "id_table": 2,
        "status": 0,
        "price": 100,
        "ordertime": "2020-11-15T18:20:22.000Z"
      }
    ]
  }
}

IN:
{
  getEmployee(email:"admin@smallcaffe.com") {
    email
    password
  }
}
OUT:
{
  "data": {
    "getEmployee": {
      "email": "admin@smallcaffe.com",
      "password": "123"
    }
  }
}

IN:
{
  getEmployee(email:"admin@smallcaffe.com", password:"123") {
    email
    password
  }
}
OUT:
{
  "data": {
    "getEmployee": {
      "email": "admin@smallcaffe.com",
      "password": "123"
    }
  }
}

IN:
mutation {
  updateGuestOrderStatus(id: "KHTMV8CKKWI1W", status: "p")
}
OUT:
{
  "data": {
    "updateGuestOrderStatus": true
  }
}

******************************************
DATABASE - mySql (smallcaffedb)
******************************************
-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 05, 2020 at 07:39 PM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.2.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smallcaffedb`
--

-- --------------------------------------------------------

--
-- Table structure for table `articleinorder`
--

CREATE TABLE `articleinorder` (
  `id_article` int(11) NOT NULL,
  `id_order` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price_article` decimal(10,2) NOT NULL,
  `price_total` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `articleinorder`
--
ALTER TABLE `articleinorder`
  ADD PRIMARY KEY (`id_article`,`id_order`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;



ID - a unique ID/name generator for JavaScript

For unique you can use Date.now() plus a random:
(Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()

https://www.w3schools.com/icons/fontawesome5_icons_currency.asp

*************************************************************
https://makeawebsitehub.com/free-node-js-hosting/