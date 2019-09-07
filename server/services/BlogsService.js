import mongoose from "mongoose"
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const _model = new Schema({
    title: { type: String, required: true, maxlength: 60 },
    summary: { type: String, required: true, maxlength: 120 },
    author: {
        name: { type: String }
    },
    img: { type: String, default: 'https://placehold.it/200x200' },
    body: { type: String, required: true },


    comments: { type: ObjectId, ref: "Comments" },
}, { timestamps: true })

export default class BlogsService {
    get repository() {
        return mongoose.model('Blog', _model)
    }
}