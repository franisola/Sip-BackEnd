import mongoose from "mongoose";
import { contractState } from "../config.js";

const ContractSchema = new mongoose.Schema(
    {
        fechaInicio: {
            type: Date,
            required: true,
        },
        fechaFin: {
            type: Date,
        },
        estado:{
            type: String,
            enum: contractState,
            default: "Solicitado",
            required: true,
        },
        horarioReferencia: {
            type: String,
            required: true,
            trim: true,
        },
        motivoDelServicio: {     
            type: String,
            required: true,
            trim: true,
        },
        idPetSitter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        },  
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    }, 
    {
        timestamps: true,
    }
)

export default mongoose.model("Contract", ContractSchema);