# Notes on Node.js

## Node.js

### Note on creating a server

```plaintext
- The code below is a simple server that listens to incoming requests on port 3000
- The server will respond with "Hello World" to every incoming request
```

```javascript
const http = require('http');

function requestListener(req, res) {
    console.log(req);
    // process.exit();
    res.end('Hello World\n');
}

http.createServer(requestListener)

```

```plaintext
Now this is a function, 'requestListener' and now we can pass this function reference, so we don't execute it, don't set these curly braces, just passed the name to that function, because this will simply tell 'createServer', Hey, please look for this function with this name and execute it for every incoming requests.
```

### Note on render method

```plaintext
In the getProducts method, the fetchAll function is used to retrieve all products. The render method is called to render the 'shop' view. The render method is set to use the Pug template engine, and it will try to find the corresponding .pug files.
```

```javascript
exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop', {
            pageTitle: "Shop",
            prods: products,
        });
    });
};
```

### Note on using this in a class

```plaintext
The code below is inside a class called "Product" here is the class definition
```

```javascript
module.exports = class Product{
  
  constructor(title, imageUrl, price, description) {
    this.title = title
    this.imageUrl = imageUrl
    this.description = description
    this.price = price
  }

};
```

```plaintext
- For the big files I can readStream to divide file into chunks
- To ensure "this" refers to the class "Product", You should use an arrow function, otherwise "this" will lose its context and will not refer to the class anymore
- The code below is inside a method called "save" here is the method definition
```

```javascript
save() {
    const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');
    fs.readFile(p, (err, fileContent) => {
        let products = [];
        if(!err) {
        products = JSON.parse(fileContent);
        }
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
        });
    });
}
```

### Note on the "this" keyword

```plaintext
- The "this" keyword is a reference to the current object. In the context of an object method, "this" refers to the owner object.
- The "this" keyword in an object constructor does not have a value. It is a substitute for the new object. The value of "this" will become the new object when a new object is created.
- The "this" keyword is not a variable. It is a keyword. You cannot change the value of "this".
- The "this" keyword is used as a reference to the object, it is a variable that refers to the current object.
- The "this" keyword is used to access an object's properties and methods from within the object.
- The "this" keyword is used in a method to refer to the object to which the method belongs.
- The value of "this" is defined at the time the function is called. It is not assigned a value until the function is called.
- The value of "this" is determined by how a function is called (runtime binding). It can't be set by assignment during execution, and it may be different each time the function is called.
- The "this" keyword in an object method refers to the object itself.
- The value of "this" is the object "before" the dot, the object that is "used to call" the method.
- The value of "this" is the object that "owns" the method.
- The value of "this" is the object that "calls" the method.
```

### Note on the Handling Dynamic Segments

Dynamic segments allow for flexible routing but must be ordered carefully in the routing file:

Specific Routes: Define specific routes before dynamic routes to avoid conflicts.

```javascript
router.get('/add-product', adminController.getAddProduct);
```

Dynamic Routes: Use for variable segments. Ensure they come after specific routes if both exist.

```javascript
router.get('/products/:productId', shopController.getProduct);
```

### Notes on showing the products using the "fs" module

- **Problem**: Products were not being retrieved correctly due to the asynchronous nature of the code. The `fetchAll` method was not returning the products array as expected.
- **Cause**: The return statements inside the `fetchAll` method belonged to an inner callback function, not the outer `fetchAll` function. Hence, `fetchAll` was returning `undefined`.
- **Solution**: Modified the `fetchAll` method to accept a callback function. This callback is executed once the product retrieval is complete.
- **Implementation**:
  - The `fetchAll` method was updated to take a callback function and execute this callback with the retrieved products.
  - In the controller, instead of directly storing the return value of `fetchAll`, the callback function is passed to handle the products once they are retrieved.

### Code Snippets

#### Controller

```javascript
exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop', {
      pageTitle: "Shop",
      prods: products,
      path: "/",
      hasProducts: products.length > 0
    });
  });
};
```

#### Model

```javascript
static fetchAll(cb) {
  const p = path.join(
    path.dirname(require.main.filename),
    'data',
    'products.json'
  );
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
}
```

### Note on the sequelize package

```plaintext
- The sequelize package is an ORM (Object-Relational Mapping) library for Node.js. It provides easy access to databases by mapping database tables to JavaScript objects.
- Sequelize supports multiple database systems such as MySQL, PostgreSQL, SQLite, and MSSQL.
- Sequelize provides a simple API to interact with databases, making it easier to perform CRUD operations.
- Sequelize provides a way to define models and relationships between them, making it easier to work with databases.
- Sequelize provides a way to define migrations, making it easier to manage database schema changes.
- Sequelize provides a way to define validations, making it easier to enforce data integrity.
- Sequelize provides a way to define associations, making it easier to work with related data.
- Sequelize provides a way to define hooks, making it easier to perform actions before or after database operations.
- Sequelize provides a way to define scopes, making it easier to define reusable queries.
- Sequelize provides a way to define transactions, making it easier to perform multiple operations in a single transaction.
```

### Note on sequelize.sync()

```plaintext
- The sequelize.sync() method is used to synchronize the model definitions with the database schema.
- The sequelize.sync() method creates tables based on the model definitions if they do not exist.
- The sequelize.sync() method updates tables based on the model definitions if they exist.
- The sequelize.sync() method drops tables based on the model definitions if they exist.
- The sequelize.sync() method can take an options object as an argument to customize the synchronization process.
- The sequelize.sync() method can take a force option to drop tables before creating them.
- The sequelize.sync() method can take an alter option to update tables without dropping them.
- The sequelize.sync() method can take a logging option to log the synchronization process.
- The sequelize.sync() method returns a Promise that resolves when the synchronization is complete.
- The sequelize.sync() method can be used to synchronize the model definitions with the database schema.
```

### Note on the sequelize.sync({ force: true }) // DANGER

```plaintext
- The sequelize.sync({ force: true }) method is used to drop tables before creating them.
- The sequelize.sync({ force: true }) method drops tables based on the model definitions if they exist.
- The sequelize.sync({ force: true }) method creates tables based on the model definitions.
- The sequelize.sync({ force: true }) method is useful for development and testing environments.
- The sequelize.sync({ force: true }) method should not be used in production environments.
- The sequelize.sync({ force: true }) method can be used to drop tables before creating them.
```

### Note on returning a value from a promise

```javascript
sequelize.sync()
  .then(() => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({
        name: 'Muhammed',
        email: 'muhammed@test.com'
      });
    }
    return user;
  });
```

```plaintext
If the user exists, the code returns the user. 
Returning a value from a promise automatically wraps it in a promise, so this is effectively the same as:
return Promise.resolve(user);
```
