import express from 'express'

import { Authorize } from '../middleware/authorize.js'
import BlogsService from '../services/BlogsService';
import CommentsService from '../services/CommentsService.js';

let _blogsService = new BlogsService().repository
let _commentsService = new CommentsService().repository

export default class BlogsController {
    constructor() {
        this.router = express.Router()
            //NOTE all routes after the authenticate method will require the user to be logged in to access
            .get('', this.getAll)
            .get('/:id', this.getById)
            .get('/:id/comments', this.getComments)
            .use(Authorize.authenticated)
            .post('', this.create)
            .put('/:id', this.edit)
            .delete('/:id', this.delete)
    }

    async getAll(req, res, next) {
        try {
            let data = await _blogsService.find({})
                .populate("author")
            return res.send(data)
        } catch (error) { next(error) }

    }

    async getById(req, res, next) {
        try {
            let data = await _blogsService
                .findById(req.params.id)
                .populate("author")
            if (!data) {
                throw new Error("Invalid Id")
            }
            res.send(data)
        } catch (error) { next(error) }
    }
    async getComments(req, res, next) {
        try {
            let data = await _commentsService
                .find({ blogId: req.params.id })
                .populate("author")

            return res.send(data)
        } catch (error) { next(error) }
    }

    async create(req, res, next) {
        try {
            //NOTE the user id is accessable through req.body.uid, never trust the client to provide you this information
            req.body.author = req.session.uid
            let data = await _blogsService.create(req.body)
            res.send(data)
        } catch (error) { next(error) }
    }

    async edit(req, res, next) {
        try {
            ///TODO: don't allow anyone other than the user to alter this blog
            let existing = await _blogsService.findById({ _id: req.params.id }).populate('author')
                .then(blog => {
                    if (blog.author.id !== req.session.uid) {
                        return res.status(401).send("not authorized")
                    }
                })
            let data = await _blogsService.findOneAndUpdate({ _id: req.params.id, }, req.body, { new: true })
            if (data) {
                return res.send(data)
            }
            throw new Error("invalid id")
        } catch (error) {
            next(error)
        }
    }

    async delete(req, res, next) {
        try {

            await _blogsService.findOneAndRemove({ _id: req.params.id })
            res.send("deleted blog")
        } catch (error) { next(error) }

    }

}