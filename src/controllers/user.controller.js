import User from '../models/user.model.js';
import Pet from '../models/pet.model.js';
import Service from '../models/service.model.js';
import Comment from '../models/comment.model.js';
import bcrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';
import { sendWelcomeEmail } from '../libs/emailService.js';

export const register = async (req, res, next) => {
	const { nombre, apellido, email, contrasena, telefono, domicilio } = req.body;

	try {
		const passwordHashed = await bcrypt.hash(contrasena, 10);

		const newUser = await User.create({
			nombre,
			apellido,
			email: email.toLowerCase(),
			contrasena: passwordHashed,
			telefono: telefono,
			domicilio,
		});

		const userSaved = await newUser.save();
		const token = await createAccessToken({
			id: userSaved._id,
			email: userSaved.email,
		});

		const { contraseña: hashedPassword, ...user } = userSaved._doc;
		const expires = new Date(Date.now() + 43200000); // 12 horas en ms

		// Enviar email de bienvenida
		await sendWelcomeEmail(userSaved);

		res.cookie('token', token, {
			expires,
			sameSite: 'None',
			secure: true,
		});
		res.status(200).json(user);
	} catch (error) {
		console.log(error);

		next(error);
	}
};

export const login = async (req, res, next) => {
	const { email, contrasena } = req.body;

	try {
		const userFound = await User.findOne({ email: email.toLowerCase() });

		if (!userFound)
			return next({ message: 'Usuario no encontrado', key: 'email', statusCode: 400 });

		const isMatch = await bcrypt.compare(contrasena, userFound.contrasena);

		if (!isMatch)
			return next({ message: 'Contraseña incorrecta', key: 'contraseña', statusCode: 400 });

		const token = await createAccessToken({
			id: userFound._id,
			email: userFound.email,
		});
		const { contraseña: hashedPassword, ...user } = userFound._doc;

		const expires = new Date(Date.now() + 43200000); // 12 horas en ms

		res.cookie('token', token, {
			expires,
			sameSite: 'None',
			secure: true,
		});

		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};

export const logout = (req, res, next) => {
	try {
		res.clearCookie('token');
		res.send('Logged out');
	} catch (error) {
		next(error);
	}
};

export const profile = async (req, res, next) => {
	const { id } = req.params;

	try {
		const userFound = await User.findById(id);

		if (!userFound) return next({ message: 'Usuario no encontrado', statusCode: 400 });

		let user = { user: userFound };
		if (userFound.role === 1) {
			const pets = await Pet.find({ user: id });
			user.info = pets;
		} else {
			const listServices = await Service.distinct('categoria', { user: id });

			user.info = listServices;
		}

		return res.json(user);
	} catch (error) {
		next(error);
	}
};

export const editProfile = async (req, res, next) => {
	const user = await User.findByIdAndUpdate(req.user.id, req.body, {
		new: true,
	});

	if (!user) {
		return next({ message: 'Usuario no encontrado', key: 'email', statusCode: 400 });
	}

	res.status(200).json(user);
};

export const getUserFeedBack = async (req, res, next) => {
	const { id } = req.params;

	try {
		const userFound = await User.findById(id);

		if (!userFound) next({ message: 'Usuario no encontrado', statusCode: 400 });

		const user = {};

		if (userFound.role === 2) {
			const services = await Service.find({ user: id });
			let totalComments = 0;
			let totalServicesCompleted = 0;
			let totalRating = 0;
			for (let service of services) {
				const commentCount = await Comment.countDocuments({ service: service._id });
				totalComments += commentCount;
				totalRating += service.calificacion;
				totalServicesCompleted++;
			}
			let averageServiceRating = totalRating / totalServicesCompleted;

			const feedback = {
				totalComments,
				totalServicesCompleted,
				averageServiceRating: Math.round(averageServiceRating),
			};

			user.feedback = feedback;
		}

		return res.json(user);
	} catch (error) {
		next(error);
	}
};
