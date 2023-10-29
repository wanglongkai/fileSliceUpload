const express = require('express')
const bodyParser = require('body-parser')
const uploader = require('express-fileupload')
const { resolve } = require('path')
const { existsSync, appendFileSync, writeFileSync, mkdirSync } = require('fs')

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(uploader());
app.use('/',express.static('upload'));

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, GET');
  next();
})

app.post('/upload_video', (req, res) => {
  const { fileName, uploadedSize } = req.body;
  const { file } = req.files;
  if(!file){
    res.send({
      code: 2,
      msg: 'No file uploaded'
    });
    return;
  }
  const filePath = resolve(__dirname, './upload/'+fileName);
  
  if(uploadedSize !== '0'){
    if(!existsSync(filePath)){
      res.send({
        code: 2,
        msg: 'The file is not existes'
      })
      return;
    }
    appendFileSync(filePath, file.data)
    res.send({
      code: 0,
      msg: 'Appended',
      video_url: 'http://localhost:8000/'+fileName
    })
    return;``
  }

  if(!existsSync('./upload')){
    mkdirSync('./upload');
  }
  writeFileSync(filePath, file.data);
  res.send({
    code: 0,
    msg: 'File is created.'
  })
})

app.listen(8000, () => {
  console.log('server is running at '+ 8000);
})