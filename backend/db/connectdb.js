import mongoose from "mongoose";

const connectdb = async () => { 
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            
            /* Deprecated
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            */

        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectdb;