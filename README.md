# SentimentAwareTranslation-API

How to Run the Project Locally

Prerequisites

Install Node.js.

Install MongoDB and ensure it is running locally or use a cloud database.

Steps

Clone the Repository:

git clone <repository-url>
cd <repository-folder>

Install Dependencies:

npm install

Set Up PORT and MongoDB Connection:

PORT= 2000

MongoDB URL= "mongodb://127.0.0.1:27017/Translation"

Start the Server:

npm start

The server will start at http://localhost:2000.

Test the APIs:
Use tools like Postman or curl to test the endpoints.

Run Rate-Limit Test:
Access http://localhost:2000/rate-limit-test multiple times to observe rate-limiting in action.

Conclusion

The project provides a robust backend for translation and sentiment analysis with JWT-based authentication, rate-limiting, and MongoDB integration. The system is designed to handle user-specific preferences and logs while ensuring security and scalability.

