import mongoose from "mongoose"
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const _model = new Schema({
    title: { type: String, required: true, maxlength: 60 },
    summary: { type: String, required: true, maxlength: 120 },
    img: { type: String, default: 'https://placehold.it/200x200' },
    body: { type: String, required: true },
    author: { type: ObjectId, ref: "User", required: true },
}, { timestamps: true })

export default class BlogsService {
    get repository() {
        return mongoose.model('Blogs', _model)
    }
}