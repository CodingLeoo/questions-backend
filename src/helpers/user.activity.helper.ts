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
            icon: actionIcon,
            activity_date : new Date()
        } as IActivity;

        activity.updateOne({ $push: { activity: userActivity } })
            .then(() => { return })
            .catch((err) => console.log(err));
    })
}