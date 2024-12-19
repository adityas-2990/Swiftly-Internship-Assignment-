To run the app locally :-

1. Change the directory to backend
    ```
     cd backend
   ```
2. Create a .env file with these two values. Make sure you have created a mongoDB database locally
    ```
    PORT=5000
    MONGODB_URI= <Your MongoDB Connection String>
    ```
3. Run the following command to download all dependencies
   ```
   npm install
   ```

4. Start the server 
    ```
    nodemon server.js
    ```

5. Change directory to frontend
    ```
    cd ..
    ```
    ```
    cd frontend
    ```

6. Install Dependencies
   ```
   npm install
   ```

7. Run the client
   ```
   npm run dev
   ```
