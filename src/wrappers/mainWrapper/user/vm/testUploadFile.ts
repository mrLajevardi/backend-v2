// const userGetMediaItem = require('./getMediaItem');
// const userPartialUpload = require('./partialUpload');
// const uploadFile = require('./uploadFile');
// const fs = require('fs');
// const { pipeline } = require('stream');

// async function test(authToken, catalogId, data, filePath) {
//   // const file = await uploadFile(authToken, catalogId, data);
//   // const {id: catalogItemId} = file.data.entity;
//   const catalogItem = await userGetMediaItem(authToken, '6d092d9c-2e70-412a-bfe7-d3ec90740a0a');
//   // 'C:/Users/Administrator/Downloads/alpine-standard-3.17.1-x86_64.iso'
//   // const fullAddress = catalogItem.files.file[0].link[0].href;
//   // const fileSize = getFilesizeInBytes(filePath);
//   console.log(catalogItem.files.file);
//   // await sendFile(fullAddress, filePath, authToken, 0, fileSize);
// }
// function getFilesizeInBytes(path) {
//   const stats = fs.statSync(path);
//   const fileSizeInBytes = stats.size;
//   return fileSizeInBytes;
// }
// function sendFile(fullAddress, filePath, authToken, uploadSize, fileSize) {
//   return new Promise((resolve, reject) => {
//     let partialUpdateSize = 1024 ** 2 * 20;
//     if (uploadSize + partialUpdateSize > fileSize) {
//       partialUpdateSize = fileSize - uploadSize;
//     }
//     const stream = fs.createReadStream(filePath, {start: uploadSize, end: uploadSize + partialUpdateSize});
//     console.log({uploadSize, fileSize, end: uploadSize + partialUpdateSize}, '😎😎😎😎😎😎');
//     uploadSize += partialUpdateSize;
//     userPartialUpload(authToken, fullAddress, stream, {
//       'Content-Length': partialUpdateSize,
//       'Content-Range': `bytes ${uploadSize} - ${partialUpdateSize} / ${fileSize}`,
//       'Connection': 'keep-alive',
//     }).then(() => {
//       if (uploadSize !== fileSize) {
//         return sendFile(fullAddress, filePath, authToken, uploadSize, fileSize);
//       }
//       resolve();
//     }).catch((err) => {
//       reject(err);
//     });
//   });
// }
// test(
//     'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJkZXZ0ZWFtIiwiaXNzIjoiYTkzYzlkYjktNzQ3MS0zMTkyLThkMDktYThmN2VlZGE4NWY5QGYyMWUxMjk4LWQ2NTktNDkyNC04MjhhLTM3YjEyZDlkZThmNyIsImV4cCI6MTY3NTM0NTUxMCwidmVyc2lvbiI6InZjbG91ZF8xLjAiLCJqdGkiOiIxMGVkNWY5MDgxOWM0NjQwOGEyODUzMDdhNGRkYTZhZSJ9.O9Pw5xPI-lqqxgx-c4f6tJGPm4GUD5L3T1syoTAZbrkQyp-NSokNE7f_2LF8Qbt3LIrghHE8Pon_MHUXh33p96lv2Yoz_uyhddpe7UwstOtniT7HgbLI2LyIm79tbuoxxkaAmj9yACW7KyLq5f12eSV7yuwwJy_MUpCAE9rP9vgikFn1kQ05bExhTmzCP_SD-pBQfnQwrFQj_J-88UrbjzrpzYM87kSWVZtrYPomUxLxeG25g--_3qo7rNJvMA54oIusZIkme8m9HGt6c0oo7meJu9V_sbSueUltquG4J0349IuUxNFk0iePXCg-j_da6ZSrX4ri3WnzaXzjh3QsGQ',
//     '03bf065c-d37c-4dc6-b09d-4605fd5e8d7f',
//     {
//       name: 'alpine-standard-3.17.1-sssswwmmms987yyy7sffffss.iso',
//       size: '160432128', imageType: 'iso',
//     }, 'C:/Users/Administrator/Downloads/alpine-standard-3.17.1-x86_64.iso').then((data) => { }).catch((err) => {
//   console.log(err);
// });

const userGetMediaItem = require('./getMediaItem');
const userPartialUpload = require('./partialUpload');
const uploadFile = require('./uploadFile');
const fs = require('fs');
const { pipeline } = require('stream');

export async function test(authToken, catalogId, data, filePath) {
  const file = await uploadFile(authToken, catalogId, data);
  const { id: catalogItemId } = file.data.entity;
  const catalogItem = await userGetMediaItem(
    authToken,
    catalogItemId.split(':').slice(-1)[0],
  );
  // 'C:/Users/Administrator/Downloads/alpine-standard-3.17.1-x86_64.iso'
  const fullAddress = catalogItem.files.file[0].link[0].href;
  const fileSize = getFilesizeInBytes(filePath);
  await sendFile(fullAddress, filePath, authToken, 0, fileSize);
}
function getFilesizeInBytes(path) {
  const stats = fs.statSync(path);
  const fileSizeInBytes = stats.size;
  return fileSizeInBytes;
}
function sendFile(fullAddress, filePath, authToken, uploadSize, fileSize) {
  return new Promise((resolve, reject) => {
    let partialUpdateSize = 1024 ** 2 * 20;
    if (uploadSize + partialUpdateSize > fileSize) {
      partialUpdateSize = fileSize - uploadSize;
    }
    const stream = fs.createReadStream(filePath, {
      start: uploadSize,
      end: uploadSize + partialUpdateSize,
    });
    console.log(
      { uploadSize, fileSize, end: uploadSize + partialUpdateSize },
      '😎😎😎😎😎😎',
    );
    const uploadedData = userPartialUpload(authToken, fullAddress, stream, {
      'Content-Length': partialUpdateSize,
      'Content-Range': `bytes ${uploadSize} - ${partialUpdateSize} / ${fileSize}`,
      Connection: 'keep-alive',
    });
    uploadSize += partialUpdateSize;
    uploadedData
      .then(() => {
        if (uploadSize !== fileSize) {
          return sendFile(
            fullAddress,
            filePath,
            authToken,
            uploadSize,
            fileSize,
          );
        }
        //resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}
test(
  'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJkZXZ0ZWFtIiwiaXNzIjoiYTkzYzlkYjktNzQ3MS0zMTkyLThkMDktYThmN2VlZGE4NWY5QGYyMWUxMjk4LWQ2NTktNDkyNC04MjhhLTM3YjEyZDlkZThmNyIsImV4cCI6MTY3NTM0NTUxMCwidmVyc2lvbiI6InZjbG91ZF8xLjAiLCJqdGkiOiIxMGVkNWY5MDgxOWM0NjQwOGEyODUzMDdhNGRkYTZhZSJ9.O9Pw5xPI-lqqxgx-c4f6tJGPm4GUD5L3T1syoTAZbrkQyp-NSokNE7f_2LF8Qbt3LIrghHE8Pon_MHUXh33p96lv2Yoz_uyhddpe7UwstOtniT7HgbLI2LyIm79tbuoxxkaAmj9yACW7KyLq5f12eSV7yuwwJy_MUpCAE9rP9vgikFn1kQ05bExhTmzCP_SD-pBQfnQwrFQj_J-88UrbjzrpzYM87kSWVZtrYPomUxLxeG25g--_3qo7rNJvMA54oIusZIkme8m9HGt6c0oo7meJu9V_sbSueUltquG4J0349IuUxNFk0iePXCg-j_da6ZSrX4ri3WnzaXzjh3QsGQ',
  '03bf065c-d37c-4dc6-b09d-4605fd5e8d7f',
  {
    name: 'alpine-standard-3.17.1-ssssxxx87yyy7sfasdasafffss.iso',
    size: '160432128',
    imageType: 'iso',
  },
  'C:/Users/Administrator/Downloads/alpine-standard-3.17.1-x86_64.iso',
)
  .then((data) => {})
  .catch((err) => {
    // console.log(err);
  });
