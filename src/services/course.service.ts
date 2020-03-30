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


export const getStudents = async (id: string): Promise<IUser[]> => {
    const course = await Course.findOne({ _id: id }).populate('students', '-_id -__v -session_id -refresh_count -password -topic -role');
    if (!course) {
        throw { code: NOT_FOUND, message: COURSE_NOT_FOUND };
    }
    else if (!course.students) {
        throw { code: NOT_FOUND, message: NO_STUDENTS_FOUND, image: STUDENTS_EMPTY_STATE };
    }
    return course.students;
}

export const getDetail = async (id: string): Promise<ICourse> => {
    try {
        const result = await Course.findOne({ _id: id }).populate('exams questions owner', '-_id -__v');
        if (!result) {
            throw { code: NOT_FOUND, message: COURSE_NOT_FOUND };
        }
        return result;
    }
    catch (err) {
        throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    }
}