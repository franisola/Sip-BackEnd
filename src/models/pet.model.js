import mongoose from 'mongoose';
import { tipoMascota } from '../config.js';

const PetSchema = new mongoose.Schema(
	{
		nombre: {
			type: String,
			required: [true, 'Please provide a name'],
			trim: true,
		},
		tipoMascota: {
			type: String,
			required: [true],
			trim: true,
			enum: tipoMascota,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model('Pet', PetSchema);
