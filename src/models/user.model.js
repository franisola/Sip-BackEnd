import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

	
const UserSchema = new mongoose.Schema(
	{
		nombre: {
			type: String,
			trim: true,
			minlength: [3, 'El nombre debe tener al menos 2 caracteres'],
			maxlength: [30, 'El nombre no puede tener más de 50 caracteres'],
		},
		apellido: {
			type: String,
			trim: true,
			minlength: [3, 'El apellido debe tener al menos 2 caracteres'],
			maxlength: [30, 'El apellido no puede tener más de 50 caracteres'],
		},
		email: {
			type: String,
			required: [true, 'El correo electrónico es obligatorio'],
			trim: true,
			unique: true,
			match: [/.+@.+\..+/, 'Por favor, ingresa un correo electrónico válido'],
		},
		contrasena: {
			type: String,
			required: [true, 'La contraseña es obligatoria'],
			trim: true,
			minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
		},

		domicilio: {
			type: String,
			trim: true,
			minlength: [3, 'La dirección debe tener al menos 3 caracteres'],
			maxlength: [100, 'La dirección no puede tener más de 100 caracteres'],
		},
		telefono: {
			type: String,
			trim: true,
			validate: {
				validator: function (v) {
					return /^[0-9]{10}$/.test(v); // Only numbers, 10 digits
				},
				message: 'El teléfono debe contener 10 dígitos',
			},
		},
		foto: {
			type: String,
			trim: true,
			default:
				'https://firebasestorage.googleapis.com/v0/b/seminario-pet.firebasestorage.app/o/defaultImg%2FImage-not-found.png?alt=media&token=24ab2228-6d4d-425c-a59e-fdc6c3c2ef5c',
		},
	},
	{
		timestamps: true, // Automatically adds createdAt and updatedAt
		versionKey: false, // Removes the __v field
	}
);

// Middleware to hash the password before saving
UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next(); // Only hash if the password was modified
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

export default mongoose.model('User', UserSchema);
