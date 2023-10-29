const UPLOAD_INFO = {
  'NO_FILE': '请选择文件',
  'INVALID_TYPE': '不支持该类型文件',
  'UPLOAD_FAILD': '上传失败',
  'UPLOAD_SUCCESS': '上传成功',
  "UPLOAD_ING": '上传中'
}
const ALOAD_TYPE = {
  'video/mp4': 'mp4',
  'video/ogg': 'ogg'
}

const CHUNK_SIZE = 1024 * 1024 * 4; //4M

const UPLOAD_URL = 'http://localhost:8000/upload_video';

;((doc) => {
  const eUploader = doc.getElementById('videoUploader');
  const eProgress = doc.getElementById('uploadProgress');
  const eBtn = doc.getElementById('uploadBtn');
  const eInfo = doc.getElementById('uploadInfo');



  const init = () => {
    eBtn.addEventListener('click', uploadVideo, false);
  }

  init();

  async function uploadVideo(){
    const file = eUploader.files[0];

    if(!file){
      eInfo.innerText = UPLOAD_INFO['NO_FILE'];
      return;
    }
    if(!ALOAD_TYPE[file.type]){
      eInfo.innerText = UPLOAD_INFO['INVALID_TYPE'];
      return;
    }

    const { name, type, size } = file;
    let uploadedResult;
    let uploadedSize = 0;
    const fileName = new Date().getTime() + '_' + name;
    eProgress.max = size;
    eInfo.innerText = '';
    eBtn.disabled = true;

    while(uploadedSize < size){
      const fileChunk = file.slice(uploadedSize, uploadedSize+CHUNK_SIZE);
      const formData = createFormData({
        name, type, size, fileName, uploadedSize, file: fileChunk
      });
      eInfo.innerText = UPLOAD_INFO['UPLOAD_ING'];
      try {
        uploadedResult = await axios.post(UPLOAD_URL, formData)
      } catch (error) {
        eInfo.innerText = UPLOAD_INFO['UPLOAD_FAILD'];
        eBtn.disabled = false;
        return;
      }
      uploadedSize += fileChunk.size;
      eProgress.value = uploadedSize;
    }

    eInfo.innerText = UPLOAD_INFO['UPLOAD_SUCCESS'];
    eUploader.value = null;
    createVideo(uploadedResult.data.video_url);
    eBtn.disabled = false;
  }

  function createFormData({name, type, size, fileName, uploadedSize, file}){
    const fd = new FormData();
    fd.append('name', name);
    fd.append('type', type);
    fd.append('size', size);
    fd.append('fileName', fileName);
    fd.append('uploadedSize', uploadedSize);
    fd.append('file', file)
    return fd;
  }

  function createVideo(src){
    const eVideo = doc.createElement('video');
    eVideo.controls = true;
    eVideo.width = '500';
    eVideo.src = src;
    doc.body.appendChild(eVideo);
  }

})(document);