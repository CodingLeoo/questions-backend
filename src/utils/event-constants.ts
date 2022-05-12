export const NEW_USER_ACTIVITY = "welcome to questions!";
export const NEW_USER_DESCRIPTION = (username: string) => `${username} , you have been created your account succcessfully.`;

export const USER_LOGIN_ACTIVITY = "User Log-in";
export const USER_LOGIN_DESCRIPTION = (username: string) => `${username} has been logged in.`;

export const USER_LOGOUT_ACTIVITY = "User Log-out";
export const USER_LOGOUT_DESCRIPTION = (username: string) => `${username} has been logged out.`;

export const USER_COURSE_CREATION = "Course Creation";
export const USER_COURSE_CREATION_DESCRIPTION = (username: string , title : string) => `${username} has been create the course : ${title} `;

export const USER_COURSE_ENROLL = "Course enrollment";
export const USER_COURSE_ENROLLMENT_DESCRIPTION = (username: string , title : string) => `${username} has been enrolled to the course : ${title} `;