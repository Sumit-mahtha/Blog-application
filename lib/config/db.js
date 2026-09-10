import mongoose from "mongoose";
import dns from "dns";

const ConnectDB = async () => {
    try {
        dns.setServers(["8.8.8.8", "8.8.4.4"]);
    } catch (e) {
        // Safe fallback if DNS setServers fails in environment
    }
    if (mongoose.connections[0].readyState) {
        return;
    }
    await mongoose.connect('mongodb+srv://chef_007:chef12345@cooking.ngoicfq.mongodb.net/blog-app?retryWrites=true&w=majority&appName=cooking');
    console.log("DB Connected");
}

export { ConnectDB };