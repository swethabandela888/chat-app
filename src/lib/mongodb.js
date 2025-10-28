const mongoose = require('mongoose');
require('dotenv').config();

class MongoDBConnector {
    constructor() {
        this.isConnected = false;
        this.connection_string = process.env.MONGODB_URI; 
        this.retries = 0;
        this.maxRetries = 5; 

        mongoose.connection.on('connected', () => {
            this.isConnected = true;
            console.log('Mongoose connected to', this.connection_string);
        });

        mongoose.connection.on('error', (err) => {
            this.isConnected = false;
            console.error('Mongoose connection error:', err);
        }); 
    }

    async connect() {
        if (this.isConnected) {
            console.log('MongoDB is already connected');
            return;
        }
        while (!this.isConnected && this.retries < this.maxRetries) {
            try {
                await mongoose.connect(this.connection_string)
                console.info('Connected to MongoDB');
                this.isConnected = true;
                this.retries = 0;
            } catch (err) {
                this.retries++;
                console.error('MongoDB connection error:', err)
                await new Promise(res => setTimeout(res, 5000));
            }
        }
    }
    async disconnect() {
        if (!this.isConnected) {
            console.log('MongoDB is not connected');
            return;
        }   
        try {
            await mongoose.disconnect()
            this.isConnected = false;
            console.info('Disconnected from MongoDB');
        } catch (err) {
            console.error('Error disconnecting from MongoDB:', err);
        }  
    } 
}


module.exports = new MongoDBConnector();