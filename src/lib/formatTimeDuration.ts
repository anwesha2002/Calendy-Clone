export function formatTimeDuration(durationInSeconds: number): string {
    const hours = Math.floor(durationInSeconds / 60);
    const minutes = durationInSeconds % 60;
    const minutesString = minutes < 2 ? `${minutes} min` : `${minutes} mins`;
    const hourString = hours > 1 ? `${hours} hrs` : `${hours} hr`;

    if(minutes == 0){
        return hourString;
    }else if(hours == 0){
        return minutesString;
    }else{
        return `${hourString} ${minutesString}`;
    }
}