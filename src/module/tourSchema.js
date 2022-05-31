import mongoose from 'mongoose';
import slug from 'slugify';

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'tour must have name'],
            unique: true,
            trim: true,
        },
        slug: String,
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
        },
        rating: {
            type: Number,
            default: 4.5,
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
        priceDiscount: Number,
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
tourSchema.pre('save', function (next) {
    console.log('👉 will save data ... ', this);
    this.slug = slug(this.name, { trim: true, lower: true });
    next();
});

tourSchema.post('save', function (doc, next) {
    console.log(doc);
    next();
});

export default mongoose.model('Tour', tourSchema);
