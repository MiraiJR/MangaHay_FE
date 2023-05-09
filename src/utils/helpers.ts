import moment from 'moment-timezone';

export function checkExistedComicInHistory(comic: any, history: any): boolean {
    for(const ele of history) {
        if(ele.id === comic.id) {
            return true;
        }
    }

    return false;
}

export function relativeTime(date: Date): string {
    return moment(date).tz('Asia/Ho_Chi_Minh').fromNow();
}