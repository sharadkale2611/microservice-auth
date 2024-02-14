# Read Me
### «@» Setup Project

1. Initialize NPM
2. Add following in **package.json**   

```    
    "type": "module",
    "scripts": {
        "dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js"
    },
```
3. create directory structure
    -  Root
        -  public
        -  src
            -  controllers
            -  models
            -  routes
            -  middlewares
            -  utils
            -  db
        
4. create *src/index.js*

5. create *src/constants.js* for global constant variables

6. Import necessary packages:
   
        express, mongoose, nodemon, dotenv, cors

7. Create *.env* file and *.env.sample* and setup as follow:
   
    ```
    import dotenv from "dotenv"

    dotenv.config({
        path: "../.env"
    })

    console.log("Hello", process.env.PORT);
    ```
8. Set up Prettier for consistent code formatting across multiple codebases.
   1. Create *.prettierrc* with following settings:
    ```
   {
        "singleQuote": false,
        "bracketSpacing": true,
        "tabWidth": 2,
        "trailingComma": "es5",
        "semi": true
    }
    ```

    2.  Create *.prettierignore* with following settings:
    ```
        /.vscode
        /node_modules
        ./dist

        *.env
        .env
        .env.*
    ```

9. Create *src/app.js* for server configuration and import it in *index.js*
      
      - Configure **CORS** in *app.js* for all routes
      - configure Common Middlewares
      dsfsl 
