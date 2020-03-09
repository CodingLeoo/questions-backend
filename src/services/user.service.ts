import { Course, ICourse } from './../models/course.models';
import { User, IUser } from './../models/auth.models';
import { ACCEPTED } from 'http-status';
import { NO_COURSES_FOUND } from './../utils/constants';
import { COURSES_EMPTY_STATE } from './../utils/icon-constants';

export const findUser = (sessionId: string) => {
    return User.findOne({ session_id: sessionId },
        { _id: 0, __v: 0, role: 0, password: 0, session_id: 0, last_token_date: 0 });
}


export const getCreatedCourses = (sessionId: string): Promise<ICourse[]> => {
    return User.findOne({ session_id: sessionId }).then((result: IUser) => {
        return Course.find({ owner: result }, { exams: 0, questions: 0, students: 0, __v: 0 })
            .populate("topic owner", "-__v  -session_id -courses -_id").then((courses: ICourse[]) => {
                if (courses.length > 0) {
                    return courses;
                }
                throw { code: ACCEPTED, message: NO_COURSES_FOUND, image: COURSES_EMPTY_STATE };
            });
    })
}


export const getEnrolledCourses = (sessionId: string): Promise<ICourse[]> => {
    return User.findOne({ session_id: sessionId }).then((result: IUser) => {
        return Course.find({ students: result }, { exams: 0, questions: 0, students: 0, __v: 0 })
            .populate("topic owner", "-__v  -session_id -courses -_id").then((courses: ICourse[]) => {
                if (courses.length > 0) {
                    return courses;
                }
                throw { code: ACCEPTED, message: NO_COURSES_FOUND, image: COURSES_EMPTY_STATE };
            });
    })
}