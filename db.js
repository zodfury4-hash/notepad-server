import mongoose from "mongoose";


const connectDB = async () => {
    const mongoURI = "mongodb+srv://zodfury4_db_user:3388@cluster0.l6hgyjn.mongodb.net/notezilla?retryWrites=true&w=majority";

    try {
        const conn = await mongoose.connect(mongoURI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`❌ Error: ${err.message}`);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;