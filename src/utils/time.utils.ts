export const getDateWithTimeZone = (databaseDate: Date, timezone: number = 300) => {
    return new Date(databaseDate.getTime() - timezone * 60000);
}

export const getDate = (date: Date) => {
    return date.toLocaleString().split(' ')[0];
}

export const getHours = (date: Date) => {
    return date.toLocaleString().split(' ')[1];
}