import { IUserActivity, UserActivity } from './../models/activity.model';
import { Course, ICourse } from './../models/course.models';
import { User, IUser } from './../models/auth.models';
import { NOT_FOUND, INTERNAL_SERVER_ERROR } from 'http-status';
import { NO_COURSES_FOUND, USER_NOT_FOUND_STATUS } from './../utils/constants';
import { COURSES_EMPTY_STATE } from './../utils/icon-constants';
import { hash } from 'bcrypt';

export const findUser = (sessionId: string) => {
    return User.findOne({ session_id: sessionId },
        { _id: 0, __v: 0, role: 0, password: 0, session_id: 0, last_token_date: 0 }).populate('topic', '-_id -__v -courses');
}


export const getCreatedCourses = (sessionId: string): Promise<ICourse[]> => {
    return User.findOne({ session_id: sessionId }).then((result: IUser) => {
        return Course.find({ owner: result }, { exams: 0, questions: 0, students: 0, __v: 0 })
            .populate("topic owner", "-__v  -session_id -refresh_count -last_token_date -courses -_id -password -role -topic").then((courses: ICourse[]) => {
                if (courses.length > 0) {
                    return courses;
                }
                throw { code: NOT_FOUND, status: NO_COURSES_FOUND, image: COURSES_EMPTY_STATE };
            });
    })
}


export const getEnrolledCourses = (sessionId: string): Promise<ICourse[]> => {
    return User.findOne({ session_id: sessionId }).then((result: IUser) => {
        return Course.find({ students: result }, { exams: 0, questions: 0, students: 0, __v: 0 })
            .populate("topic owner", "-__v  -session_id -courses -_id -password -role -topic").then((courses: ICourse[]) => {
                if (courses.length > 0) {
                    return courses;
                }
                throw { code: NOT_FOUND, status: NO_COURSES_FOUND, image: COURSES_EMPTY_STATE };
            });
    })
}


export const getActivity = (sessionId: string): Promise<IUserActivity> => {
    return User.findOne({ session_id: sessionId }).then((result: IUser) => {
        return UserActivity.findOne({ user: result }, { user: 0 });
    }).catch((err: any) => {
        throw { code: INTERNAL_SERVER_ERROR, status: err.toString() }
    })
}


export const updatePhoto = (sessionId: string, value: any): Promise<void> => {
    return User.findOne({ session_id: sessionId }).then((result: IUser) => {
        const image = new Buffer(value, 'base64');
        return result.update({ $set: { photo: image } });
    }).catch((err: any) => {
        throw { code: INTERNAL_SERVER_ERROR, status: err.toString() }
    })
}

export const updateEntity = (sessionId: string, userName: string, password: string): Promise<void> => {
    return User.findOne({ session_id: sessionId }).then((result: IUser) => {
        if (password) {
            return hash(password, Math.floor(Math.random() * 10)).then((encryptedValue: string) => {
                return result.update({ $set: { user_name: userName, password: encryptedValue } });
            });
        } else {
            return result.update({ $set: { user_name: userName } });
        }
    }).catch((err: any) => {
        throw { code: INTERNAL_SERVER_ERROR, status: err.toString() }
    })
}


export const deleteAccount = (mail: string) => {
    return User.deleteOne({ email: mail }).then((result: any) => {
        if (result.deletedCount === 0) {
            throw { code: NOT_FOUND, status: USER_NOT_FOUND_STATUS };
        }
    }).catch((err) => {
        if (err.code)
            throw err;
        else
            throw { code: INTERNAL_SERVER_ERROR, status: err.toString() };
    })
}