export const headerToName = header => header.toLowerCase().split(' ').join('_');
export const nameToUrl = name => encodeURIComponent(name);
export const randomName = () => Math.random().toString(16).substring(2, 8);
