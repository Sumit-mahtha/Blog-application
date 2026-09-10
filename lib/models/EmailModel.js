import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const EmailModel = mongoose.models.Email || mongoose.models.email || mongoose.model("Email", Schema);

export default EmailModel;
