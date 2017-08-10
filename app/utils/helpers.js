export const headerToUrl = (header) => {
  return header.toLowerCase()
               .split(' ')
               .join('_');
}
