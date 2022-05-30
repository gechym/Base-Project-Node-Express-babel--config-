export const getUsers = (req, res) => {
    res.status(200).json({
        message: 'success',
        requestTime: req.requestTime,
        data: [
            {
                id: 0,
                name: 'The Forest Hiker',
            },
        ],
    });
};
export const getUser = (req, res) => {
    console.log(req.body);
    res.status(200).json({ ...req.body, id: req.params.id });
};

export const createUser = (req, res) => {
    res.status(200).json({
        message: 'success',
        requestTime: req.requestTime,
        data: {
            tours: req.body,
        },
    });
};

export const updateUser = (req, res) => {
    const { id } = req.params;

    res.status(200).json({
        message: 'update success',
        requestTime: req.requestTime,
        data: {
            id,
            ...req.body,
        },
    });
};

export const deleteUser = (req, res) => {
    const { id } = req.params;

    res.status(200).json({
        message: 'update success',
        requestTime: req.requestTime,
        data: {
            id,
            ...req.body,
        },
    });
};

// middleware
export const checkBodyPaser = (req, res, next) => {
    const { name, price } = req.body;
    if (!name || !price) {
        return res.status(404).json({
            message: 'missing data name and price',
        });
    }

    next();
};

export const checkIdUser = (req, res, next, val) => {
    if (val > 200) {
        res.status(404).json({
            message: 'id is not invalid',
        });

        return;
    }

    next();
};
