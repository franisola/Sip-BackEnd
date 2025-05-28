import Service from '../models/service.model.js';
import Comment from '../models/comment.model.js';
import User from '../models/user.model.js';


export const createService = async (req, res, next) => {
	const { titulo, animales, dias, descripcion, precio, horaInicio, horaFin, userId } = req.body;

	const user = await User.findById(userId);

	const newService = new Service({
		titulo,
		animales,
		dias,
		descripcion,
		precio,
		horaInicio,
		horaFin,
		user: userId,
		telefono: user.telefono,
		foto: user.foto,
		domicilio: user.domicilio,
	});

	// user: userId,
	const serviceSaved = await newService.save();
	res.status(201).json(serviceSaved);
};

export const getServices = async (req, res, next) => {
	const { idUser } = req.params;
	try {
		const services = await Service.find({ user: idUser }).populate('user');
		res.status(200).json(services);
	} catch (error) {
		next(error);
	}
};

export const getRandomServices = async (req, res, next) => {
	try {
		const randomServices = await Service.aggregate([
			{ $sample: { size: 8 } },
			{
			  $lookup: {
				from: 'users', // nombre de la colección en MongoDB
				localField: 'user', // el campo en el documento `Service`
				foreignField: '_id', // el campo en el documento `User`
				as: 'user', // nombre del campo en el resultado
			  },
			},
			{
			  $unwind: '$user', // opcional: convierte el array 'user' en un objeto
			},
		  ]);

		res.status(200).json(randomServices);
	} catch (error) {
		next(error);
	}
};

export const getServiceQuery = async (req, res, next) => {
	const { categoria, tipoMascota, frecuencia, zona, calificacion } = req.query;

	let queryObj = {
		isDeleted: false,
		estado: 'Publicado',
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

		if (!service)
			return next({ message: 'Service not found', statusCode: 404 });


		const comments = await Comment.find({ service: id }).populate('user');	
		const totalComments = await Comment.countDocuments({ service: id });

		const feedback = {
			totalComments,
			averageServiceRating: service.calificacion,
		};

		const relatedServices = await Service.aggregate([
			{ $match: {
				user: service.user._id,
				_id: { $ne: service._id },
			}},
			{ $sample: { size: 4 } }, // 4 servicios aleatorios
		]);

		res.status(200).json({ service, feedback, comments, relatedServices });
	} catch (error) {
		next(error);
	}
};

export const updateService = async (req, res, next) => {
	const { id } = req.params;
	const { titulo, animales, dias, descripcion, precio, horaInicio, horaFin } = req.body;

	try {
		const updatedService = await Service.findByIdAndUpdate(
			id,
			{
				titulo,
				animales,
				dias,
				descripcion,
				precio,
				horaInicio,
				horaFin,
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
        const deletedService = await Service.findByIdAndDelete(id);

        if (!deletedService) return next({ message: 'Service not found', statusCode: 404 });

        res.status(200).json({ success: true, message: 'Service deleted', service: deletedService });
    } catch (error) {
        next(error);
    }
};