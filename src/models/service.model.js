import mongoose from 'mongoose';
import { categoria, frecuencia, tipoMascota, estado } from '../config.js';

const serviceSchema = new mongoose.Schema({
	nombre: {
		type: String,
		required: [true, 'Please provide a name'],
		trim: true,
	},
	categoria: {
		type: String,
		required: [true, 'Please provide a category'],
		trim: true,
		enum: categoria,
	},
	frecuencia: {
		type: String,
		required: [true, 'Please provide a frequency'],
		trim: true,
		enum: frecuencia,
	},
	tipoMascota: {
		type: String,
		required: [true, 'Please provide a pet type'],
		trim: true,
		enum: tipoMascota,
	},
	costoHR: {
		type: Number,
		required: [true, 'Please provide a cost per hour'],
	},
	estado: {
		type: String,
		default: 'Publicado',
		enum: estado,
	},
    zona: {
        type: String,
        required: false,
    },
	descripcion: {
		type: String,
		required: [true, 'Please provide a description'],
		trim: true,
	},
	calificacion:{
		type: Number,
		default: 1,
	},
    isDeleted: {
        type: Boolean,
        default: false,
    },
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
});

export default mongoose.model('Service', serviceSchema);
