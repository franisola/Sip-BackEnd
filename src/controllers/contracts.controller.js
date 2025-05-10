import Contract from '../models/contract.model.js';
import Service from '../models/service.model.js';

export const createContract = async (req, res, next) => {
	const { fechaInicio, fechaFin, horarioReferencia, motivoDelServicio } = req.body;
	const { id_service } = req.params;



	const idUser = req.user.id;

	const idPetSitter = await Service.findById(id_service);

	const newContract = new Contract({
		fechaInicio,
		fechaFin,
		horarioReferencia,
		motivoDelServicio,
		idPetSitter: idPetSitter.user._id,
		service: id_service,
		user: idUser,
	});

	try {
		const contractSaved = await newContract.save();
		res.status(201).json(contractSaved);
	} catch (error) {
  		next(error);
	}
};

export const getContracts = async (req, res, next) => {
	const { id } = req.user;
	try {
		const contracts = await Contract.find({ idPetSitter: id }).populate('service').populate('user');
        const lastContracts = contracts.slice(-2);

		res.status(200).json({contracts , lastContracts});
	} catch (error) {
		next(error);
	}
};

export const getContract = async (req, res, next) => {
	const { id } = req.params;
	try {
		const contract = await Contract.findById(id).populate('service').populate('user');
		res.status(200).json(contract);
	} catch (error) {
		next;
	}
};
export const updateContract = async (req, res, next) => {
	const { id } = req.params;

	const contract = await Contract.findByIdAndUpdate(id, req.body, {
		new: true,
	});

	if (!contract) return next({ message: 'Contrato no encontrado', statusCode: 404 });

	res.status(200).json(contract);
};
