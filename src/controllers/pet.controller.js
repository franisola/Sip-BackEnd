import Pet from '../models/pet.model.js';
import { tipoMascota as list } from '../config.js';

export const createPet = async (req, res, next) => {
	const { nombre, tipoMascota } = req.body;

	const newPet = new Pet({
		nombre,
		tipoMascota: list[tipoMascota],
		user: req.user.id,
	});
	// : req.user.id,
	try {
		const petSaved = await newPet.save();
		res.status(201).json(petSaved);
	} catch (error) {
		next(error);
	}
};

export const getPets = async (req, res, next) => {
	try {
		const pets = await Pet.find({ user: req.user.id }).populate('user');
		res.status(200).json({ pets });
	} catch (error) {
		next(error);
	}
};

export const getPet = async (req, res, next) => {
	const { id } = req.params;
	try {
		const pet = await Pet.findById({ _id: id }).populate('user');
		res.status(200).json(pet);
	} catch (error) {
		next(error);
	}
};

export const deletePet = async (req, res, next) => {
	const { id } = req.params;

	try {
		const pet = await Pet.findByIdAndDelete(id);

		if (!pet) return next({ message: 'Pet not found', statusCode: 404 });

		res.status(201).json({success: true, message: 'Pet deleted'});
	} catch (error) {
		return next(error);
	}
};
