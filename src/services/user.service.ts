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
    const result = await User.findOne({ session_id: sessionId });
    const courses = await Course.find({ owner: result }, { exams: 0, questions: 0, students: 0, __v: 0 })
        .populate("topic owner", "-__v  -session_id -refresh_count -last_token_date -courses -_id -password -role -topic");
    if (courses.length > 0) {
        return courses;
    }
    throw { code: NOT_FOUND, status: NO_COURSES_FOUND, image: COURSES_EMPTY_STATE };
}


export const getEnrolledCourses = async (sessionId: string): Promise<ICourse[]> => {
    const result = await User.findOne({ session_id: sessionId });
    const courses = await Course.find({ students: result }, { exams: 0, questions: 0, students: 0, __v: 0 })
        .populate("topic owner", "-__v  -session_id -courses -_id -password -role -topic");
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


export const updatePhoto = async (sessionId: string, value: any): Promise<void> => {
    try {
        const result = await User.findOne({ session_id: sessionId });
        const image = new Buffer(value, 'base64');
        return result.update({ $set: { photo: image } });
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
                return result.update({ $set: { user_name: userName, password: encryptedValue } });
            });
        }
        else {
            return result.update({ $set: { user_name: userName } });
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