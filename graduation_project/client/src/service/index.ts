import moment from 'moment';

export const date = moment();

export const getStartOfWeek: () => string = () => {
    return date.clone().startOf('isoWeek').format('YYYY-MM-DD')
}

export const getEndOfWeek: () => string = () => {
    return date.clone().endOf('isoWeek').format('YYYY-MM-DD')
}