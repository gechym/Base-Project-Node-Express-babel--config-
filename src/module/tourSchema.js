import mongoose from 'mongoose';
import slug from 'slugify';

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'tour must have name'],
            unique: true,
            trim: true,
            maxlength: [40, 'Tên ko quá 40 chữ '],
            minLength: [10, 'tối thiểu 10 chữ nha'],
        },
        slug: String,
        secretTour: {
            type: Boolean,
            default: false,
        },
        duration: {
            type: Number,
            required: [true, 'tour must have durations'],
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'tour must have maxGroupSize'],
        },
        difficulty: {
            type: String,
            required: [true, 'tour must have difficulity'],
            trim: true,
            emun: {
                values: ['easy', 'medium', 'difficult'],
                message: 'có chừng đó mấy thêm nhiều làm gì :p',
            },
        },
        rating: {
            type: Number,
            default: 4.5,
            min: [1, 'ai lại đánh giáo 0 sao :))'],
            max: [5, '5 sao thôi làm gì có hơn mà đánh giá bro'],
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, 'tour must have a price'],
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (val) {
                    return val < this.price;
                },
                message: 'Không làm mà đòi có ăn wtf',
            },
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'tour must have a summary'],
        },
        description: {
            type: String,
            trim: true,
        },
        imageCover: {
            type: String,
            trim: true,
            required: [true, 'tour must have a imageCover'],
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false,
        },
        startDates: [Date],
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

// midlewave schema
//controller chạy trước middle wave này chạy sau
tourSchema.pre('save', function (next) {
    console.log('---------Save data------------');
    console.log('👉 will save data ... ', this);
    this.slug = slug(this.name, { trim: true, lower: true });
    next();
});

tourSchema.post('save', function (doc, next) {
    // khi save xong thì chạy
    console.log(doc);
    console.log('save success');
    console.log('-------------------------- \n\n\n\n');
    next();
});

//middlewave query schema controller chạy trước middle wave này chạy sau
tourSchema.pre(/^find/, function (next) {
    console.log('-------- Query data ----------------');
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now();
    next();
});

tourSchema.post(/^find/, function (doc, next) {
    // khi save xong thì chạy
    console.log(`Query mất ${Date.now() - this.start}ms`);
    console.log('--------  ----------------\n\n\n\n');
    next();
});

// Aggregation Middleware
tourSchema.pre('aggregate', function (next) {
    console.log('-------- aggregation ----------------');
    this._pipeline = [
        // put thêm Aggregate vào đầu mảng để tránh hiện tour ẩn danh
        {
            $match: {
                secretTour: {
                    $ne: true,
                },
            },
        },
        ...this._pipeline,
    ];

    console.log(this.pipeline());
    this.start = Date.now();
    next();
});

tourSchema.post('aggregate', function (doc, next) {
    // khi save xong thì chạy
    console.log(`Query mất ${Date.now() - this.start}ms`);
    console.log('--------  ----------------\n\n\n\n');
    next();
});

export default mongoose.model('Tour', tourSchema);
