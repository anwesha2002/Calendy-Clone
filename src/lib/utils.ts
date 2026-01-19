import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function timeToInt (time : string){
    return parseFloat(time.replace(':', '.'));
}

export function formatTimeZoneOffset(tz : string){
    return new Intl.DateTimeFormat(undefined, {
        timeZone: tz,
        timeZoneName: "shortOffset"
    })
        .formatToParts(new Date())
        .find(part => part.type === "timeZoneName")?.value;

    //     new Date().toLocaleString('en-US', { timeZone: tz, timeZoneName: 'short' }).split(' ').pop()?.replace('GMT', '');
    // return offset ? `UTC${offset}` : 'UTC';
}
