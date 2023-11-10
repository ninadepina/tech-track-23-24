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

export { formatDateString, formatScheduleDate }