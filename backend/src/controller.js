var fs = require('fs');
var path = require('path');
var content = fs.readFileSync('./test1.jpg')
const toSend = new Buffer(content, 'base64')
const formidable = require('formidable');
require('isomorphic-fetch')
const Dropbox = require('dropbox').Dropbox;
var dbx = new Dropbox({ accessToken: process.env.dropboxToken });
const dropBoxController = require('./dropbox')
function regexMaker (str) {
  return new RegExp(`.(?:${str})$`);
}

module.exports.uploadFile = async ctx => {

  const data = await dbx.filesListFolder({ path: '/upload' })
    .then(function (response) {
      return response.entries;
    })
    .catch(function (error) {
      console.log(error);
    });
  console.log(data)

  dbx.filesUpload({ path: '/', content: content })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.error(error);
    });
}

module.exports.copyFolder = async ctx => {

  const { body } = ctx.request;
  const regexQuery = body.selectedFile && regexMaker(body.selectedFile.join('|'))
  const originPath = body.from || 'upload';
  const targetPath = body.to || 'copy';
  const size = body.max ? body.max * 8 * 1024 : 8 * 1024;
  const { toRemove } = body;
  let successfulOperations = 0;

  await dropBoxController.createNewFolder(targetPath);

  let upload = await dropBoxController.listFolderContent(originPath);
  upload = upload.entries;

  let copy = await dropBoxController.listFolderContent(targetPath)
  copy = copy.entries.map(el => el.name);

  let toUpload = upload.filter(el => (!copy.includes(el.name)) && el.size <= size);
  if (regexQuery) toUpload = toUpload.filter(el => el.name.toLowerCase().match(regexQuery));

  const toUploadLength = toUpload.length;
  const argObj = {
    toUpload,
    toRemove,
    originPath,
    targetPath
  }

  successfulOperations = await dropBoxController.moveOrCopy(argObj);

  if (successfulOperations === toUploadLength) {
    ctx.status = 201;
    ctx.body = { successfulOperations };
  }
  else {
    ctx.status = 501;
    ctx.body = {
      successfulOperations,
      toUploadLength
    }
  }
}
































  // dbx.filesCopyV2({
  //   from_path:'/upload',
  //   to_path:'/copy',
  //   autorename: false

  // })
  // .then(response => console.log(response))
  // .catch(err => console.log(err))

  // dbx.filesCreateFolder({
  //   path:'/myTest'

  // })
  // .then(response => console.log(response))
  // .catch(err => console.log(err))

  // dbx.filesListFolder({path: '/upload'})
  // .then(function(response) {
  //   console.log(response);
  // })
  // .catch(function(error) {
  //   console.log(error);
  // });

  // dbx.filesCopyV2({
  //   from_path:'upload',
  //   to_path:'copy',
  //   autorename: false

  // })
  // .then(response => console.log(response))
  // .catch(err => console.log(err))


