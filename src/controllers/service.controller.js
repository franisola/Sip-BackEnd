import Service from '../models/service.model.js';
import Comment from '../models/comment.model.js';
import User from '../models/user.model.js';

import {
	tipoMascota as TP,
	categoria as C,
	frecuencia as F,
	barriosCABA as CABA,
    estado,
} from '../config.js';

export const createService = async (req, res, next) => {
	const { nombre, categoria, frecuencia, tipoMascota, costoHR, estado, descripcion } = req.body;
	const calificacion = 1;

	const user = await User.findById(req.user.id);

	const newService = new Service({
		nombre,
		categoria,
		frecuencia,
		tipoMascota,
		costoHR,
		estado,
		calificacion,
		zona: user.zona,
		descripcion,
		user: req.user.id,
	});

	// user: req.user.id,
	const serviceSaved = await newService.save();
	res.status(201).json(serviceSaved);
};

export const getServices = async (req, res, next) => {
	const { idUser } = req.params;
	try {
		const services = await Service.find({ user: idUser, isDeleted: false }).populate('user');
		res.status(200).json(services);
	} catch (error) {
		next(error);
	}
};

export const getServiceQuery = async (req, res, next) => {
	const { categoria, tipoMascota, frecuencia, zona, calificacion } = req.query;

	let queryObj = {
		isDeleted: false,
        estado: 'Publicado'
	};

	if (categoria !== 'undefined') queryObj.categoria = C[categoria];
	if (tipoMascota !== 'undefined') queryObj.tipoMascota = TP[tipoMascota];
	if (frecuencia !== 'undefined') queryObj.frecuencia = F[frecuencia];
	if (zona !== 'undefined') queryObj.zona = CABA[zona];
	if (calificacion !== 'undefined') queryObj.calificacion = calificacion;

	const page = parseInt(req.query.page) || 1;
	const limit = 10;
	const skip = (page - 1) * limit;

	try {
		const services = await Service.find(queryObj).skip(skip).limit(limit).populate('user');

		if (!services) return next({ message: 'No services found', statusCode: 404 });

		const hasMore = await Service.exists({
			...queryObj,
			_id: { $gt: services[services.length - 1]._id },
		});

		res.status(200).json({ data: services, hasMore });
	} catch (error) {
		next(error);
	}
};

export const getService = async (req, res, next) => {
	const { id } = req.params;

	try {
		const service = await Service.findById({ _id: id }).populate('user');
		const totalComments = await Comment.countDocuments({ service: id });

		const feedback = {
			totalComments,
			totalServicesCompleted: null,
			averageServiceRating: service.calificacion,
		};

		if (!service || service.isDeleted)
			return next({ message: 'Service not found', statusCode: 404 });

		res.status(200).json({ service, feedback });
	} catch (error) {
		next(error);
	}
};

export const updateService = async (req, res, next) => {
	const { id } = req.params;
	const { nombre, categoria, frecuencia, tipoMascota, costoHR, estado, descripcion } = req.body;

	try {
		const updatedService = await Service.findByIdAndUpdate(
			id,
			{
				nombre,
				categoria,
				frecuencia,
				tipoMascota,
				costoHR,
				estado,
				descripcion,
			},
			{ new: true }
		);

		if (!updatedService) return next({ message: 'Service not found', statusCode: 404 });

		res.status(200).json(updatedService);
	} catch (error) {
		next(error);
	}
};

export const deleteService = async (req, res, next) => {
	const { id } = req.params;

	try {
		const updatedService = await Service.findByIdAndUpdate(
			id,
			{ isDeleted: true },
			{ new: true, runValidators: true } // Opciones para devolver el documento actualizado y ejecutar validaciones del esquema
		);


		if (!updatedService) return next({ message: 'Service not found', statusCode: 404 });


		res.status(201).json({ success: true, message: 'Service deleted' });
	} catch (error) {
		next(error);
	}
};


