// Imports
const {Storage}=require('@google-cloud/storage');
//const {Firestore}=require('@google-cloud/firestore')
const path=require('path');
const fs=require('fs-extra');
const os=require('os');
const sharp=require('sharp');
const { getDefaultAutoSelectFamilyAttemptTimeout } = require('net');
const getExif=require('exif-async');
const parse=require('parse-dms');

// Generate thumbnail - v1,v2
exports.generateThumbnails = async (file, context) => {
  const gcsFile=file;
  const storage=new Storage();
  const sourceBucket=storage.bucket(gcsFile.bucket);
  const thumbBucket=storage.bucket('cloudapp-visaxen-gj-thumbnails');
  const finalBucket=storage.bucket('cloudapp-visaxen-gj-final');

  //Version control
  const version=process.env.K_REVISION;
  console.log(`Running Cloud Function version ${version}`);

  console.log(`File name: ${gcsFile.name}`);
  console.log(`Gen number: ${gcsFile.generation}`);
  console.log(`Content Type: ${gcsFile.contentType}`);

  // Reject images that are not jpeg or png files
  let fileExtention='';
  let validFile=false;

  if(gcsFile.contentType==='image/jpeg'){
    console.log('JPEG File');
    fileExtention='jpg';
    validFile=true;
  }
  else if(gcsFile.contentType==='image/png'){
    console.log('PNG File');
    fileExtention='png';
    validFile=true;
  }
  else
    console.log('Not a valid file');

  // If the file is a valid photograph, download it to the 'local' VM so that we can create a thumbnail image
  if (validFile) {
    // Create a new filename for the 'final' version of the image file
    // The value of this will be something like '12745649237578595.jpg'
    const finalFileName=`${gcsFile.generation}.${fileExtention}`;

    // Create a working directory on the VM that runs our GCF to download the original file
    // The value of this variable will be something like 'tmp/thumbs'
    const workDir=path.join(os.tmpdir(),'thumbs');

    // Create a variable that holds the path to the 'local' version of the file
    // The value of this will be something like 'tmp/thumbs/398575858493.png'
    const tempFilePath=path.join(workDir,finalFileName);

    // Wait until the working directory is ready
    await fs.ensureDir(workDir);

    // Download the original file to the path on the 'local' VM
    await sourceBucket.file(gcsFile.name).download({
      destination:tempFilePath
    });

    // Upload our local version of the file to the final images bucket
    await finalBucket.upload(tempFilePath);

    // Create a name for the thumbnail image
    // The value for this will be something like `thumb@64_1234567891234567.jpg`
    const thumbName=`thumb@64_${finalFileName}`;

    // Create a path where we will store the thumbnail image locally
    // This will be something like `tmp/thumbs/thumb@64_1234567891234567.jpg`
    const thumbPath=path.join(workDir, thumbName);

    // Use the sharp library to generate the thumbnail image and save it to the thumbPath
    // Then upload the thumbnail to the thumbnailsBucket in cloud storage
    await sharp(tempFilePath).resize(64).withMetadata().toFile(thumbPath).then(async ()=>{
      await thumbBucket.upload(thumbPath);
    })

    // Delete the temp working directory and its files from the GCF's VM
    await fs.remove(workDir);

    //Extract lat,long - v3
    let gpsobj=await readExifData('china1.jpeg');
    console.log(gpsobj);
    let gpsParse=getGPS(gpsobj);
    console.log(gpsParse);

    //Helper functions
    async function readExifData(localFile){
      let exifData;
      try{
        exifData=await getExif(localFile);
        //console.log(exifData);
        //console.log(exifData.gps);
        return exifData.gps;
      }
      catch(err){
        console.log(err);
        return null;
      }
    }
    function getGPS(gps){
      //parse-dms needs a string in the format of
      //51:30:0.5486N 0:7:34.4503W
      const lat=`${gps.GPSLatitude[0]}:${gps.GPSLatitude[1]}:${gps.GPSLatitude[2]}${gps.GPSLatitudeRef}`;
      const long=`${gps.GPSLongitude[0]}:${gps.GPSLongitude[1]}:${gps.GPSLongitude[2]}${gps.GPSLongitudeRef}`;
      const coord=parse(`${lat} ${long}`);
      return coord;
    }
  } // end of validFile==true

  // DELETE the original file uploaded to the "Uploads" bucket
  await sourceBucket.file(gcsFile.name).delete();
  console.log(`File Deleted: ${gcsFile.name}`);
}