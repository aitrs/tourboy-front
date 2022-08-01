import Moment from "moment";

export function dateFormatAny(input: any): string {
    Moment.locale('fr');
    return Moment(input).format('d/MM/YYYY hh:mm:ss');
}