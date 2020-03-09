import { IUser } from './../models/auth.models';
import { UserActivity, IUserActivity, IActivity } from './../models/activity.model';


export const createRecord = (record: IUser): Promise<void> => {
    return UserActivity.create({
        user: record,
        activity: []
    }).then(() => { return });
}

export const registryUserActivity = (record: IUser, action: string, actionDesc: string, actionIcon: string) => {
    UserActivity.findOne({ user: record }).then((activity: IUserActivity) => {

        const userActivity = {
            activity: action,
            description: actionDesc,
            icon: actionIcon
        } as IActivity;

        activity.activity.push(userActivity);
        activity.save();
    })
}