import moment from "moment-timezone";

export const formatDateKR = (date: any, time: boolean) => {
    if(date) {
        try {
            const formattedDate = moment(date).tz('Asia/Seoul').format(time ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD')
            return formattedDate
        } catch (error) {
            console.error(error)
            return null
        }
    } else {
        return null
    }
};