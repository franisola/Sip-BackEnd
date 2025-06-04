import Contract from '../models/contract.model.js';
import Service from '../models/service.model.js';
import Payment from '../models/payment.model.js';

// function timesOverlap(startTime1, endTime1, startTime2, endTime2) {
// 	// Convert to minutes since midnight for comparison
// 	const [h1s, m1s] = startTime1.split(':').map(Number);
// 	const [h1e, m1e] = endTime1.split(':').map(Number);
// 	const [h2s, m2s] = startTime2.split(':').map(Number);
// 	const [h2e, m2e] = endTime2.split(':').map(Number);

// 	const start1 = h1s * 60 + m1s;
// 	const end1 = h1e * 60 + m1e;
// 	const start2 = h2s * 60 + m2s;
// 	const end2 = h2e * 60 + m2e;

// 	if (end1 <= start2 || end2 <= start1) {
// 		return false;
// 	}
// 	return true;
// }

// export const createContract = async (req, res, next) => {
// 	const { fecha, horarioInicio, horarioFin } = req.body;
// 	const { id_service } = req.params;

// 	const service = await Service.findById(id_service);
// 	if (!service) return res.status(404).json({ msg: 'Servicio no encontrado' });

// 	const idUserCliente = req.user.id;
// 	const idProveedor = await Service.findById(id_service);

// 	const newContract = new Contract({
// 		fecha,
// 		horarioInicio,
// 		horarioFin,
// 		service: id_service,
// 		idProveedor: idProveedor.user._id,
// 		cliente: idUserCliente,
// 	});

// 	try {
// 		const contractSaved = await newContract.save();
// 		res.status(201).json(contractSaved);
// 	} catch (error) {
// 		next(error);
// 	}
// };

export const getContracts = async (req, res, next) => {
	const { id } = req.user;
	console.log(id);
	try {
		const contracts = await Contract.find({ cliente: id }) // Buscar los contratos del cliente
			.populate('servicio')
			.populate('proveedor');
		const lastContracts = contracts.slice(-2);

		res.status(200).json({ contracts, lastContracts });
	} catch (error) {
		next(error);
	}
};

export const getContractsByService = async (req, res, next) => {
	const { id } = req.params; // o req.body, depende cómo lo mandes
	try {
		const contracts = await Contract.find({ servicio: id })
			.populate('cliente') // populate para traer la info del cliente
			.populate('servicio'); // populate del servicio también

		res.status(200).json({ contracts });
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
