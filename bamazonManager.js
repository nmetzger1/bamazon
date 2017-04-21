//required packages / modules
var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("cli-table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",
    password: "root",

    database: "bamazon"
});

connection.connect(function (err) {
    if(err){
        throw err;
    }

    managerMenu();
});

function managerMenu() {
    inquirer.prompt([
        {
            type: "list",
            message: "Select an action.",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"],
            name: "menu"
        }
    ]).then(function (answer) {

        switch (answer.menu){
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                viewLowInventory();
                break;
            case "Add to Inventory":
                addToInventory();
                break;
            case "Add New Product":
                addNewProduct();
                break;
            default:
                connection.end();
        }
    })
}

function viewProducts() {
    var query = "SELECT * FROM products";
    createTable(query);
}

function viewLowInventory() {
    var query = "SELECT * FROM products WHERE stock_quantity < 5";
    createTable(query);
}

function addToInventory() {

    //prompt for user input
    inquirer.prompt([
        {
            type: "input",
            message: "Enter an item number",
            name: "itemNumber"
        },
        {
            type: "input",
            message: "Enter the quantity you'd like to add",
            name: "quantity",
            validate: function (value) {
                return isNaN(value) === false;
            }

        }
    ]).then(function (answer) {

            //get current inventory
            connection.query("SELECT `stock_quantity` FROM products WHERE ?",
                {item_id: answer.itemNumber},
                function (err, response) {

                    var currentStock = parseInt(response[0].stock_quantity);

                    //Update Inventory
                    connection.query("UPDATE `products` SET ? WHERE ?", [
                        {
                            stock_quantity: parseInt(answer.quantity) + currentStock
                        },
                        {
                            item_id: answer.itemNumber
                        }
                    ], function (err, response) {
                        if(err){
                            throw err;
                        }

                        console.log("New stock added successfully.");
                        managerMenu();
                    })
                }
            );
        }
    )
}

function addNewProduct() {

    console.log("Adding a new product")

    //prompt user for input
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the product name",
            name: "name",
            validate: function (value) {
                return value.length < 256;
            }
        },
        {
            type: "input",
            message: "Enter department name",
            name: "department",
            validate: function (value) {
               return value.length < 101
            }
        },
        {
            type: "input",
            message: "Enter price of product",
            name: "price",
            validate: function (value) {
                return isNaN(parseInt(value)) === false;
            }
        },
        {
            type: "input",
            message: "Enter quantity of product",
            name: "quantity",
            validate: function (value) {
                return isNaN(parseInt(value)) === false;
            }
        }
    ]).then(function (answer) {
        connection.query("INSERT INTO `products` SET ?", {
            product_name: answer.name,
            department_name: answer.department,
            price: answer.price,
            stock_quantity: answer.quantity
        }, function (err, response) {
            if(err){
                throw err;
            }

            console.log("Product added successfully.");
            managerMenu();
        })
    })
}

function createTable(query) {

    //Create Table
    var table = new Table({
        head: ['Item Number', 'Product Name', 'Department', 'Price', 'Quantity']
    });

    //Get Data
    connection.query(query,function (err, results) {
        //Check for Error
        if (err) {
            throw err;
        }

        //Loop through results, add to table array
        for (var i = 0; i < results.length; i++) {
            var tempArray = [];

            tempArray.push(results[i].item_id);
            tempArray.push(results[i].product_name);
            tempArray.push(results[i].department_name);
            tempArray.push(results[i].price);
            tempArray.push(results[i].stock_quantity);

            table.push(tempArray);
        }

        //Display table in terminal
        console.log(table.toString());

        managerMenu();
    })
}