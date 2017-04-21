# bamazon
This app simulates an inventory manager.  

**bamazonCustomer.js** allows the user to view available items stored in a SQL database.  Purchasing an item updates the table to display the new stock quantity of items purchased.

**bamazonManager.js** allows the user to view available items, items that are almost sold out (less than 5 available), replenish stock, and add new items for sale.


## How to run
Customer App:  
```node bamazonCustomer.js```

Manager App:  
``node bamazonCustomer.js``

## Options
Customer App:  
* Buy Item(s)
    * Displays a list of items available to purchse
    * Prompts the user to enter an item to purchase
* Quit
    * Closes the program and servers connection to SQL db.
    
Manager App:
*  View Products for Sale
    * Displays table with all items available to purchase
*  View Low Inventory
    * Displays table with all items that have less than 5 units in stock.
*  Add to Inventory
    * Prompts the user to enter an item and number
    * Adds the quantity given to the item selected by the user
*  Add New Product
    *  Prompts user to enter new item info, adds that item to the products table
*  Quit
    * Closes the program and servers connection to SQL db.


**Note:**
This program requires a products table setup on the localhost. For a video of the customer app in action, [please click here.](https://drive.google.com/open?id=0B9zQEDCjen74c0d5QWVzanJSblE)