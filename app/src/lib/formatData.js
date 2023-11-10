const formatDateString = (dateString) => {
    if (dateString) {
        const parts = dateString.split('T')[0].split('-').reverse().join('-');
        return parts;
    }
    return null;
};

const formatScheduleDate = (scheduleDate) => {
    const parts = scheduleDate.split('-');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

const getStatus = (actualLandingTime, scheduleDateTime) => {
    if (actualLandingTime && scheduleDateTime) {
        return 'landed';
    }

    const currentDateTime = new Date();
    const scheduleDateTimeObj = new Date(scheduleDateTime);

    return scheduleDateTimeObj < currentDateTime ? 'enroute' : 'scheduled';
};

export { formatDateString, formatScheduleDate, getStatus };
