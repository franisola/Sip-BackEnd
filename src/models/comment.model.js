import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        },
        comentario: {
            type: String,
            required: [true, "Please provide a comment"],
            trim: true,
        },
        calificacion: {
            type: Number,
            min: 1,
            max: 5,
            default: 1,
        },
        fecha: {
            type: Date,
            default: Date.now,
        },
    }, {
        timestamps: true,
    }
);

export default mongoose.model("Comment", commentSchema);