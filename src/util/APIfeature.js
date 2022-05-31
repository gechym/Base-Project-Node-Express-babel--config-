const APIfeature = async (resQuery, model) => {
    try {
        //Filtering EQ("="), GTE(">="), GT(">"), LT("<"), LTE("<=");
        // /tours?difficulty=easy&duration=5
        const queryObj = { ...resQuery };
        const excludedQuery = ['page', 'sort', 'limit', 'fields'];
        excludedQuery.forEach((el) => delete queryObj[el]);

        // Advanced Filtering
        // /tours?difficulty=easy&duration[gte]=5&price[lt]=1200
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        let query = model.find(JSON.parse(queryStr));

        // sort
        ///tours?difficulty=easy&duration[gte]=5&price[lt]=1200&sort=price,-rating
        if (resQuery.sort) {
            const sortBy = resQuery.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('createdAt');
        }

        const countData = (await query).length; // return

        //Limiting Fields
        ///api/v1/tours?fields=-name,-price
        if (resQuery.fields) {
            const fieldsLimit = resQuery.fields.split(',').join(' ');
            query = query.select(fieldsLimit);
        } else {
            query = query.select('-__v'); // loại bỏ ko lấy
        }

        //Better Pagination
        const limit = resQuery.limit * 1 || 100;
        const page =
            resQuery.page * 1 >= 1 && resQuery.page * 1 * limit <= countData
                ? resQuery.page
                : 1;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit); // return

        return { query, countData };
    } catch (error) {
        throw new Error('API feature fail 💢💢');
    }
};

export default APIfeature;
