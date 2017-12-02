export const easingSin = k => 1 - Math.cos( k * Math.PI / 2 );
export const xFromCenter = (angle, distance) => Math.cos(angle * (Math.PI / 180)) * distance;
export const yFromCenter = (angle, distance) => Math.sin(angle * (Math.PI / 180)) * distance;
export const angleFromCenter = (x, y) => Math.atan2(y, x) * (180 / Math.PI);