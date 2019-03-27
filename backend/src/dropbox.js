require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;
var dbx = new Dropbox({ accessToken: process.env.dropboxToken });

module.exports.createNewFolder = str => {

  dbx.filesCreateFolder({
    path: `/${str}`,
    autorename: false
  })
    .then(function (response) {
      console.log('11111', response);
    })
    .catch(function (error) {
      console.log(error);
    })

}

module.exports.listFolderContent = str => {

  return dbx.filesListFolder({ path: `/${str}` })
    .then(function (response) {
      console.log('11111', response)
      return response;
    })
    .catch(function (error) {
      console.log(error);
    })


}

module.exports.moveOrCopy = async obj => {
  const {toUpload,toRemove,originPath,targetPath} = obj;
  let successfulOperations = 0;

  while (toUpload.length) {
    let el = toUpload.pop();

    if (toRemove) {

      await dbx.filesMoveV2({
        from_path: `/${originPath}/${el.name}`,
        to_path: `/${targetPath}/${el.name}`
      })
        .then(function (response) {
          successfulOperations++;
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        })
    }
    else {

      await dbx.filesCopyV2({
        from_path: `/${originPath}/${el.name}`,
        to_path: `/${targetPath}/${el.name}`
      })
        .then(function (response) {
          successfulOperations++;
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        })
    }
  }

  return successfulOperations;
}