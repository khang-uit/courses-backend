const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Course = new Schema(
    {
        _id: {type: Number, },
        name: { type: String, maxLength: 255, required: true },
        description: { type: String, maxLength: 600 },
        image: { type: String, maxLength: 255 },
        slug: { type: String, maxLength: 255, slug: 'name', unique: true },
        videoId: { type: String, maxLength: 255, required: true },
        level: { type: String, maxLength: 255 },
    },
    {

        _id: false,
        timestamps: true,
    },
);

mongoose.plugin(slug);

Course.plugin(AutoIncrement);

Course.plugin(mongooseDelete, {
    deleteAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('Course', Course);
