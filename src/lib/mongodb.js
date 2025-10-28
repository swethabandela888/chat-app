const mongoose = require('mongoose');

class MongoDBConnector {
    constructor() {
        this.isConnected = false;
        this.connection_string = process.env.MONGODB_URI; // || 'mongodb://localhost:27017/chatapp';  
    }

    async connect() {
        if (this.isConnected) {
            console.log('MongoDB is already connected');
            return;
        }
        try{
            await mongoose.connect(this.connection_string)
            .then(() => { 
                console.info('Connected to MongoDB');
                this.isConnected = true;
            }) 
            .catch(err => console.error('MongoDB connection error:', err));             
        }catch (err){
            console.error('Error connecting to MongoDB:', err);
        }

    }
    async disconnect() {
        if (!this.isConnected) {
            console.log('MongoDB is not connected');
            return;
        }   
        try {
            await mongoose.disconnect()
            .then(() => {
                this.isConnected = false;
                console.info('Disconnected from MongoDB');
            })
            .catch(err => console.error('Error during MongoDB disconnection:', err));
            
        } catch (err) {
            console.error('Error disconnecting from MongoDB:', err);
        }  
    } 
}


module.exports = new MongoDBConnector();