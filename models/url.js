const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlSchema = new Schema(
    {
        fullUrl: {type: String, required: [true, "Original URL is required."]},
        shortUrl: {type: String, required: [true, "New URL is required."]},
        urlCode: {type: String, required: [true, "Unique URL code is required."], unique: true},
    },
    {
        timestamps: true
    }
);

urlSchema.index({urlCode: 1});

// Compile model from schema
const Url = mongoose.model('Url', urlSchema, 'urls');

module.exports = Url;
