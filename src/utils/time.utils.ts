export const getDateWithTimeZone = (databaseDate: Date, timezone: number = 300) => {
    return new Date(databaseDate.getTime() - timezone * 60000);
}