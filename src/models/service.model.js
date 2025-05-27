import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'Por favor proporciona un título'],
        trim: true,
    },
    animales: {
        type: [String], // Ejemplo: ['0', '1']
        required: [true, 'Por favor proporciona los tipos de animales'],
    },
    dias: {
        type: [String], // Ejemplo: ["miercoles", "jueves"]
        required: [true, 'Por favor proporciona los días'],
    },
    descripcion: {
        type: String,
        required: [true, 'Por favor proporciona una descripción'],
        trim: true,
    },
    precio: {
        type: Number,
        required: [true, 'Por favor proporciona un precio'],
    },
    horaInicio: {
        type: String,
        required: [true, 'Por favor proporciona la hora de inicio'],
        trim: true,
    },
    horaFin: {
        type: String,
        required: [true, 'Por favor proporciona la hora de fin'],
        trim: true,
    },
	calificacion: {
		type: Number,
		default: 1,
	},
    domicilio: {
        type: String,
        required: [true, 'Por favor proporciona el domicilio'],
        trim: true,
    },
    telefono: {
        type: String,
        required: [true, 'Por favor proporciona el teléfono'],
        trim: true,
    },
    imagen: {
        type: String,
        required: false,
        trim: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

}, 
{
	timestamps: true,
	versionKey: false,
});

export default mongoose.model('Service', serviceSchema);