import mongoose from "mongoose"
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const _model = new Schema({
  blogId: { type: ObjectId, ref: 'Blog', required: true },
  author: {
    name: { type: String, required: true },
  },
  body: { type: String, required: true }
}, { timestamps: true })

export default class CommentsService {
  get repository() {
    return mongoose.model('comments', _model)
  }
}