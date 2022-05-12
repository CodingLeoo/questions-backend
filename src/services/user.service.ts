import { IUserActivity, UserActivity } from './../models/activity.model';
import { Course, ICourse } from './../models/course.models';
import { User } from './../models/auth.models';
import { NOT_FOUND, INTERNAL_SERVER_ERROR } from 'http-status';
import { NO_COURSES_FOUND, USER_NOT_FOUND_STATUS } from './../utils/constants';
import { COURSES_EMPTY_STATE } from './../utils/icon-constants';
import { hash } from 'bcrypt';

export const findUser = (sessionId: string) => {
    return User.findOne({ session_id: sessionId },
        { _id: 0, __v: 0, role: 0, password: 0, session_id: 0, last_token_date: 0 }).populate('topic', '-_id -__v -courses');
}


export const getCreatedCourses = async (sessionId: string): Promise<ICourse[]> => {
    const result = await User.findOne({ session_id: sessionId }, { photo: 0 });
    const courses = await Course.find({ owner: result }, { exams: 0, sections: 0, students: 0, __v: 0 })
        .populate("topic owner", "-__v  -session_id -refresh_count -last_token_date -courses -_id -password -role -topic -photo");
    if (courses.length > 0) {
        return courses;
    }
    throw { code: NOT_FOUND, status: NO_COURSES_FOUND, image: COURSES_EMPTY_STATE };
}


export const getEnrolledCourses = async (sessionId: string): Promise<ICourse[]> => {
    const result = await User.findOne({ session_id: sessionId });
    const courses = await Course.find({ students: result }, { exams: 0, sections: 0, students: 0, __v: 0, owner: 0 })
        .populate("topic", "-__v -courses -_id");
    if (courses.length > 0) {
        return courses;
    }
    throw { code: NOT_FOUND, status: NO_COURSES_FOUND, image: COURSES_EMPTY_STATE };
}


export const getActivity = async (sessionId: string): Promise<IUserActivity> => {
    try {
        const result = await User.findOne({ session_id: sessionId });
        return UserActivity.findOne({ user: result }, { user: 0 });
    }
    catch (err) {
        throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    }
}


export const updatePhoto = async (sessionId: string, body: any): Promise<void> => {
    try {
        const result = await User.findOne({ session_id: sessionId });
        const image = new Buffer(body.value, 'base64');
        return result.updateOne({ $set: { photo: { content: image, content_type: body.content_type } } });
    }
    catch (err) {
        throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    }
}

export const updateEntity = async (sessionId: string, userName: string, password: string): Promise<void> => {
    try {
        const result = await User.findOne({ session_id: sessionId });
        if (password) {
            return hash(password, Math.floor(Math.random() * 10)).then((encryptedValue: string) => {
                return result.updateOne({ $set: { user_name: userName, password: encryptedValue } });
            });
        }
        else {
            return result.updateOne({ $set: { user_name: userName } });
        }
    }
    catch (err) {
        throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    }
}


export const deleteAccount = async (mail: string) => {
    try {
        const result = await User.deleteOne({ email: mail });
        if (result.deletedCount === 0) {
            throw { code: NOT_FOUND, status: USER_NOT_FOUND_STATUS };
        }
    }
    catch (err) {
        if (err.code)
            throw err;
        else
            throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    }
}