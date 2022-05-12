export const getDateWithTimeZone = (databaseDate: Date, timezone: number = 300) => {
    return new Date(databaseDate.getTime() - timezone * 60000);
}

export const isValidCode = (validUntilDate: Date): boolean => {
    return getDateWithTimeZone(new Date()) < validUntilDate;
}

export const addMinutes = (date: Date, minutes: number): Date => {
    return new Date(date.getTime() + minutes * 60000);
}