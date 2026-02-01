export function changewindspeed(meterpersecond: number):string{
    const kilometerperhour=meterpersecond*3.6;
    return`${kilometerperhour.toFixed(0)}km/h`
}