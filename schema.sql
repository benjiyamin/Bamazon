DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;


CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL UNIQUE,
    overhead_costs FLOAT(2) NOT NULL,
    PRIMARY KEY (id)
);


CREATE TABLE products (
    id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL UNIQUE,
    department_id INT NOT NULL,
    price FLOAT(2) NOT NULL,
    stock_quantity INT NOT NULL,
    product_sales FLOAT(2) NOT NULL DEFAULT 0.00,
    PRIMARY KEY (id)
);
