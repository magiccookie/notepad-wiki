export const headerToUrl = (header) => header.toLowerCase()
                                             .split(' ')
                                             .join('_');


export const randomName = () => Math.random()
                                    .toString(16)
                                    .substring(2, 8);
