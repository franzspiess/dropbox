module.exports.copyFolder = async ctx => {

  const { body } = ctx.request;
  const regexQuery = body.selectedFile && regexMaker(body.selectedFile.join('|'))
  const originPath = body.from || 'upload';
  const targetPath = body.to || 'copy';
  const size = body.max ? body.max * 8 * 1024 : 8 * 1024;
  const { toRemove } = body;
  let successfulOperations = 0;


  dbx.filesCreateFolder({
    path:`/${targetPath}`,
    autorename:false
  })
  .then(function(response) {
    console.log(response);
  })
  .catch(function(error) {
    console.log(error);
  })


  let upload = await dbx.filesListFolder({ path: `/${originPath}` })
  upload = upload.entries
  console.log(upload);

  let copy = await dbx.filesListFolder({ path: `/${targetPath}` });
  copy = copy.entries.map(el => el.name);
  console.log(copy);

  let toUpload = upload.filter(el => (!copy.includes(el.name)) && el.size <= size);
  if (regexQuery) toUpload = toUpload.filter(el => el.name.toLowerCase().match(regexQuery));
  console.log(toUpload, 'AAA');
  const toUploadLength = toUpload.length;

  while (toUpload.length) {
    let el = toUpload.pop();
    console.log(toRemove)

    if (toRemove) {
      console.log('XXXXXX')
      await dbx.filesMoveV2({
        from_path:`/${originPath}/${el.name}`,
        to_path:`/${targetPath}/${el.name}`
      })
      .then(function(response) {
        successfulOperations++;
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      })
    }
    else {
      console.log('ZZZZZZZ')
      await dbx.filesCopyV2({
        from_path:`/${originPath}/${el.name}`,
        to_path:`/${targetPath}/${el.name}`
      })
      .then(function(response) {
        successfulOperations++;
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      })
    }
  }

  if (successfulOperations === toUploadLength) {
    ctx.status = 201;
    ctx.body = {successfulOperations};
  }
  else {
    ctx.status = 501;
    ctx.body = {
      successfulOperations,
      toUploadLength
    }
  }

  function regexMaker (str) {
    return new RegExp(`.(?:${str})$`);
  }


}

// .use(require('koa-body')({
//       formidable:{
//           uploadDir: __dirname + '/public/uploads', // directory where files will be uploaded
//           keepExtensions: true // keep file extension on upload
//       },
//       multipart: true,
//       urlencoded: true,

/\.(?:txt|jpg)$/