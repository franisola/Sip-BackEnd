import Comment from '../models/comment.model.js';
import Service from '../models/service.model.js';
import mongoose from 'mongoose';

export const createComment = async (req, res, next) => {
	const { comentario, calificacion } = req.body;
	const { id_service } = req.params;
	const { id } = req.user;

	const id_service_ObjectId = new mongoose.Types.ObjectId(id_service);

	try {
		const newComment = await Comment.create({
			user: id,
			service: id_service,
			comentario,
			calificacion,
			fecha: new Date(), // Date.now(),
		});

		const commentSaved = await newComment.save();

		const agg = await Comment.aggregate([
			{ $match: { service: id_service_ObjectId } },
			{
				$group: {
					_id: '$service',
					avgRating: { $avg: '$calificacion' },
				},
			},
		]);

		// Actualizar la calificación del servicio
		if (agg.length > 0) {
			await Service.updateOne(
				{ _id: id_service },
				{ calificacion: Math.round(agg[0].avgRating) }
			);
		}

		res.status(200).json(commentSaved);
	} catch (error) {
		next(error);
	}
};

export const getComments = async (req, res, next) => {
	const { id_service } = req.params;

	try {
		const comments = await Comment.find({ service: id_service }).populate('user'); //.populate('service');

		res.status(200).json({ comments });
	} catch (error) {
		next(error);
	}
};

export const getComment = async (req, res, next) => {
	const { id } = req.params;
	try {
		const comment = await Comment.findById(id); //.populate('user').populate('service');
		if (!comment) return next({ message: 'Comment not found', statusCode: 404 });

		res.status(200).json(comment);
	} catch (error) {
		next(error);
	}
};

export const deleteComment = async (req, res, next) => {
	const { id } = req.params;
    try {
        const comment = await Comment.findByIdAndDelete(id);
        if (!comment) return next({ message: 'Comment not found', statusCode: 404 });
    
        res.status(201).json({success: true, message: 'Comment deleted'});
        
    } catch (error) {
        next(error);
    }
};

export const getLastComments = async (req, res, next) => {
	try {
		const services = await Service.find({ user: req.user.id });

		const serviceIds = services.map((service) => service._id);
		const comments = await Comment.find({ service: { $in: serviceIds } }).populate('user');

		const lastComments = comments.slice(-2);



		res.status(200).json({ comments, lastComments });
	} catch (error) {
        next(error);
    }
};
