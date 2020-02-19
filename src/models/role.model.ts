import { Document, Schema, Model, model } from 'mongoose';


export interface IRole extends Document {
    role_description: string
    permission_create_course: boolean
    permission_update_course: boolean
    permission_delete_course: boolean
    permission_course_detail: boolean
    permission_create_question: boolean
    permission_update_question: boolean
    permission_delete_question: boolean
    permission_create_test: boolean
    permission_update_test: boolean
    permission_delete_test: boolean
    permission_enroll_course: boolean
    permission_create_users: boolean
    permission_view_user_statistics: boolean
    permission_view_general_statistics: boolean
}


const role: Schema = new Schema({
    role_description: String,
    permission_create_course: { type: Boolean, required: true },
    permission_update_course: { type: Boolean, required: true },
    permission_delete_course: { type: Boolean, required: true },
    permission_course_detail: { type: Boolean, required: true },
    permission_create_test: { type: Boolean, required: true },
    permission_update_test: { type: Boolean, required: true },
    permission_delete_test: { type: Boolean, required: true },
    permission_create_question: { type: Boolean, required: true },
    permission_update_question: { type: Boolean, required: true },
    permission_delete_question: { type: Boolean, required: true },
    permission_enroll_course: { type: Boolean, required: true },
    permission_create_users: { type: Boolean, required: true },
    permission_view_user_statistics: { type: Boolean, required: true },
    permission_view_general_statistics: { type: Boolean, required: true }
});




export const Role: Model<IRole> = model<IRole>("role", role);