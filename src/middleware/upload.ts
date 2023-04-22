import multer from 'multer';

// const toSnakeCase = (str: string) => {
//   const string =
//     str &&
//     str.match(
//       /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
//     );

//   if (string) {
//     return string.map((x: string) => x.toLowerCase()).join('_');
//   }
//   return str;
// };

const storage = multer.diskStorage({});
const upload = multer({ storage });

export default upload;
