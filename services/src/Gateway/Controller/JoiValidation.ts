import Joi from "joi";
import { DbTag } from "./GenericDbController";

export const JoiUrl = {
    url: Joi.string().description("Url to connect to database").required()
}

export const JoiFindParameters = (tag: DbTag) => (
    {
        repository: Joi.string().description(`${tag.repository} name`).required(),
        what: Joi.string().description("Injected 'what' data request, sanitised before used.").required(),
        skip: Joi.number().description(`Skip how many ${tag.entities}`).required(),
        limit: Joi.number().description(`Max number of ${tag.entities} returned`).required()
    });

export const JoiRepositoryParameters = (tag: DbTag) => (
    {
        repository: Joi.string().description(`${tag.repository} name`).required(),
    });

export const JoiQueryEntityParameters = (tag: DbTag) => (
    {
        repository: Joi.string().description(`${tag.repository} name`).required(),
        _id: Joi.string().description(`${tag.entities} identifiant`).optional(),
    });


export const JoiBodyEntityParameters = {
    entity: Joi.object().description(`data`).required()
}
