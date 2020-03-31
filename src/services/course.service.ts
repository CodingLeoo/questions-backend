import { getDateWithTimeZone } from './../utils/time.utils';
import { ISection } from './../models/section.model';
import { COURSE_ENROLLMENT_ICON, COURSE_CREATION_ICON, STUDENTS_EMPTY_STATE } from './../utils/icon-constants';
import { firstName } from './../utils/string.utils';
import { USER_COURSE_ENROLL, USER_COURSE_ENROLLMENT_DESCRIPTION, USER_COURSE_CREATION_DESCRIPTION, USER_COURSE_CREATION } from './../utils/event-constants';
import { registryUserActivity } from './../helpers/user.activity.helper';
import { OK_STATUS, UNAUTHORIZED_STATUS, COURSE_NOT_FOUND, NO_STUDENTS_FOUND } from './../utils/constants';
import { OK, UNAUTHORIZED, NOT_FOUND, INTERNAL_SERVER_ERROR } from 'http-status';
import { Topic } from './../models/topic.models';
import { ICourse, Course } from './../models/course.models';
import { User, IUser } from './../models/auth.models';



export const createCourse = async (sessionId: string, request: any): Promise<any> => {
    const result = await User.findOne({ session_id: sessionId }).populate('topic');
    if (!result.topic) {
        throw { code: UNAUTHORIZED, message: UNAUTHORIZED_STATUS };
    }
    const course = ({
        title: request.title,
        owner: result,
        topic: result.topic,
        description: request.description
    } as ICourse);
    const createdCourse = await Course.create(course);
    await Topic.updateOne({ _id: result.topic._id }, { $push: { courses: createdCourse } });
    registryUserActivity(result, USER_COURSE_CREATION, USER_COURSE_CREATION_DESCRIPTION(firstName(result.user_name), createdCourse.title), COURSE_CREATION_ICON);
    return {
        code: OK,
        message: OK_STATUS,
        created_at: createdCourse.create_date
    };
}


export const enrollCourse = async (sessionId: string, id: string): Promise<any> => {
    const course = await Course.findOne({ _id: id });
    if (!course) {
        throw { code: NOT_FOUND, message: COURSE_NOT_FOUND };
    }
    const result = await User.findOne({ session_id: sessionId });
    await course.updateOne({ $push: { students: result } });
    registryUserActivity(result, USER_COURSE_ENROLL, USER_COURSE_ENROLLMENT_DESCRIPTION(firstName(result.user_name), course.title), COURSE_ENROLLMENT_ICON);
    return {
        code: OK,
        message: OK_STATUS,
        enrolled_at: new Date()
    };
}


export const getDetail = async (id: string): Promise<any> => {
    try {
        const result = await Course.findOne({ _id: id })
            .populate('sections', '-_id -__v')
            .populate('topic', '-__v -courses');

        if (!result) {
            throw { code: NOT_FOUND, message: COURSE_NOT_FOUND };
        }

        const questionsCount = result.sections
            .map((section: ISection) => section.questions.length)
            .reduce((total: number, current: number) => total + current, 0);

        return {
            _id: result._id,
            title: result.title,
            description: result.description,
            exams_count: result.exams.length,
            sections_count: result.sections.length,
            students_count: result.students.length,
            questions_count: questionsCount,
            topic: result.topic,
            last_update_date: result.last_update_date
        }
    }
    catch (err) {
        if (err.code)
            throw err
        else
            throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    }
}


export const getOwner = async (courseId: string): Promise<any> => {
    try {
        const course = await Course.findOne({ _id: courseId }).populate({
            path: 'owner',
            model: 'user',
            select: '-password -_id -__v -session_id -refresh_count -last_update_date -creation_date -role'
        }).populate('topic', '-__v -create_date -last_update_date -courses');

        if (!course)
            throw { code: NOT_FOUND, message: COURSE_NOT_FOUND };

        return {
            email: course.owner.email,
            user_name: course.owner.user_name,
            photo: course.owner.photo.toString('base64'),
            code: course.owner.code,
            topic: course.topic,
            last_token_date: getDateWithTimeZone(course.owner.last_token_date),
        }
    } catch (err) {
        if (err.code)
            throw err
        else
            throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    }
}


export const getStudents = async (id: string): Promise<IUser[]> => {
    try {
        const course = await Course.findOne({ _id: id }).populate('students', '-_id -__v -session_id -refresh_count -password -topic -role');
        if (!course) {
            throw { code: NOT_FOUND, message: COURSE_NOT_FOUND };
        }
        else if (!course.students) {
            throw { code: NOT_FOUND, message: NO_STUDENTS_FOUND, image: STUDENTS_EMPTY_STATE };
        }
        return course.students;
    } catch (err) {
        if (err.code)
            throw err
        else
            throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    }
}


export const getExams = async (courseId: string) => {
    try {
        const course = await Course.findById(courseId).populate('exams', '-__v -course');
        if (!course)
            throw { code: NOT_FOUND, message: COURSE_NOT_FOUND };

        return course.exams;
    } catch (err) {
        if (err.code)
            throw err
        else
            throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    }
}


export const getSections = async (courseId: string) => {
    try {
        const course = await Course.findById(courseId).populate('sections', '-__v -course -buffer -context -image -example -sharedOptions');
        if (!course)
            throw { code: NOT_FOUND, message: COURSE_NOT_FOUND };
        return course.sections
    } catch (err) {
        if (err.code)
            throw err
        else
            throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    }
}