import { COURSE_NOT_FOUND, OK_STATUS, SECTION_NOT_FOUND, UNAUTHORIZED_STATUS } from './../utils/constants';
import { NOT_FOUND, OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } from 'http-status';
import { Course } from './../models/course.models';
import { Section, ISection } from './../models/section.model';

const getAsBuffer = (base64String: string) => {
    if (base64String)
        return Buffer.from(base64String, 'base64');
    return undefined;
}

export const findSection = async (sectionId: string, access: string): Promise<ISection> => {
    const param = access === 'true' ? '' : '-answer';
    try {
        const section = await Section.findOne({ _id: sectionId }, { __v: 0 }).populate({
            path: 'questions example',
            model: 'question',
            populate: [{
                path: 'options',
                model: 'option',
                select: `-__v -question -section ${param}`
            }, {
                path: 'answer',
                model: 'option',
                select: ' -__v -question -section'
            }],
            select: `-section -__v ${param}`
        }).populate({
            path: 'sharedOptions',
            model: 'option',
            select: `-__v -question -section ${param}`
        })

        return section;
    } catch (err) {
        if (err.code)
            throw err;
        else
            throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    }
}


export const createSection = async (request: any, courseId: string): Promise<{ code: number, status: string, additional_information?: any }> => {
    try {
        const courseResult = await Course.findById(courseId);
        if (!courseResult)
            throw { code: NOT_FOUND, status: COURSE_NOT_FOUND };

        const result = await Section.create({
            course: courseResult,
            title: request.title,
            type: request.type,
            context: request.context
        });

        if (request.image) {
            await result.updateOne({ $set: { image: { content: getAsBuffer(request.image.content), content_type: request.image.content_type } } });
        }

        await courseResult.updateOne({ $push: { sections: result } });
        return { code: OK, status: OK_STATUS, additional_information: { _id: result._id } };
    }
    catch (err) {
        if (err.code)
            throw err;
        else
            throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    }
}

export const addSharedOption = async (optionId: string, sectionId: string): Promise<{ code: number, status: string, additional_information?: any }> => {
    try {
        const result = await Section.findById(sectionId);
        if (!result)
            throw { code: NOT_FOUND, status: SECTION_NOT_FOUND };
        const updateResult = await result.updateOne({ $push: { sharedOptions: optionId } });
        return { code: OK, status: OK_STATUS, additional_information: updateResult };
    }
    catch (err) {
        if (err.code)
            throw err;
        else
            throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    }
}

export const updateSection = async (request: any, sectionId: string, access: string): Promise<{ code: number, status: string, additional_information?: any }> => {
    if (request.image) {
        request.image.content = getAsBuffer(request.image.content);
    }
    try {
        if (access !== 'true')
            throw { code: UNAUTHORIZED, status: UNAUTHORIZED_STATUS };

        const result = await Section.update({ _id: sectionId }, request);
        return { code: OK, status: OK_STATUS, additional_information: result };
    }
    catch (err) {
        if (err.code)
            throw err;
        else
            throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    }
}


export const deleteSection = async (sectionId: string): Promise<{ code: number, status: string, additional_information?: any }> => {
    const result = await Section.findOneAndDelete({ _id: sectionId });
    return { code: OK, status: OK_STATUS, additional_information: { _id: result._id } };
}
