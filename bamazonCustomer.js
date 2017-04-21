//packages / modules
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

//SQL connection settings
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",
    password: "root",
    database: "bamazon"
});

//Connect to SQL
connection.connect(function (err) {
    if(err){
        throw err;
    }

    customerMenu();
});

function customerMenu() {
    inquirer.prompt([
        {
            type: "list",
            message: "Select an action.",
            choices: ["Buy Item(s)", "Quit"],
            name: "action"
        }
    ]).then(function (answer) {

        if(answer.action === "Quit"){
            connection.end();
        }
        else {
            purchaseMenu();
        }
    })
}

function purchaseMenu() {

    //Display inventory

    //Create Table
    var table = new Table({
        head: ['Item Number', 'Product Name', 'Department', 'Price', 'Quantity']
    });

    //Get Inventory
    connection.query('Select * FROM products',function (err, results) {
        //Check for Error
        if(err){
            throw err;
        }

        //Loop through results, add to table array
        for(var i = 0; i < results.length; i++){
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

        //Get user purchase input
        inquirer.prompt([
            {
                type: "input",
                message: "Enter the item number of the product you'd like to purchase.",
                name: "item_number"
            },
            {
                type: "input",
                message: "Enter the quanity you'd like to purchase.",
                name: "item_quantity"
            }
        ]).then(function (answer) {

            var chosenItem = answer.item_number;
            var chosenQuantity = parseInt(answer.item_quantity);

            completePurchase(chosenItem, chosenQuantity);
        })
    })
}

function completePurchase(itemNumber, quantity) {
    connection.query("SELECT stock_quantity, price FROM products WHERE ?", [
        {
            item_id: itemNumber
        }
    ], function (err, response) {
        if(err){
            throw err;
        }

        //Check for results returned
        if(response.length < 1){
            console.log("Item number not found.");
            connection.end();
            return;
        }

        var actualQuantity = parseInt(response[0].stock_quantity);

        if(actualQuantity < quantity){
            console.log("You cannot buy more product than what is available.");
            //Return to Main Menu
            customerMenu();
        }
        else {

            var newQuantity = actualQuantity - quantity;
            var purchasePrice = quantity * parseInt(response[0].price);

            connection.query("UPDATE `products` SET stock_quantity = " + newQuantity + " WHERE ?", [
                {
                    item_id: itemNumber
                }
            ], function (err, response) {
                if (err) {
                    throw err;
                }

                console.log("Transaction Complete! Total cost: $" + purchasePrice);
                //Return to Main Menu
                customerMenu();
            })
        }

    })
}