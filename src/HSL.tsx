import {BackgroundProperty} from "csstype"

export interface HSL {
    hue: number,
    saturation: number,
    light: number,
}

export function hsl(hue: number, saturation: number, light: number) : HSL {
    return { hue, saturation, light };
}

export function css(hsl : HSL) : BackgroundProperty<3> {
    return "hsl("+hsl.hue + ", " + hsl.saturation + "%, " + hsl.light + "%)";
}

export function cssString(hsl: HSL) : string {
    return "hsl("+hsl.hue + ", " + hsl.saturation + "%, " + hsl.light + "%)";
}
