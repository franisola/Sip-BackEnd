export const roleClient = (req, res, next) => {
	const { role } = req.user;


	
	if (role != 1) return res.status(401).json({ message: 'Authorization denied' });


	next();
};

export const rolePetSitter = (req, res, next) => {
	const { role } = req.user;

    
	if (role != 2) return res.status(401).json({ message: 'Authorization denied' });
    
   
	next();
};
