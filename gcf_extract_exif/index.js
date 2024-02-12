// Import packages

// Entry Point function
exports.extractExif = async (file, context) => {

  // This shows me which GCP version of the function is executing
  const version = process.env.K_REVISION;
  console.log(`Running Cloud Function version ${version}`);

  // Create a working directory on the VM that runs our GCF to download the original file
  // The value of this variable will be something like 'tmp/exif'

  // Create a variable that holds the path to the 'local' version of the file
  // The value of this will be something like 'tmp/exif/thumb@64_398575858493.png'

  // Wait until the working directory is ready

  // Download the original file to the path on the 'local' VM

  // Ensure the file is downloaded to the 'local' VM

  // Pass the LOCAL file to our readExifData function
  // This will return an object with information about the CreateDate, latitude, and longitude of the photo

  // Create variables that hold the HTTP URLs to the different versions of the photo

  // Update the dataObject to add links to the image

  // Write the dataObject to a Firestore document

  // Delete the temp working directory and its files from the GCF's VM

};

// Helper functions
async function readExifData(localFile) {
  // Use the exif-async package to read the EXIF data
 
    // Create an object that will hold the pertient EXIF elements

    // If EXIF data exists, add it to the dataObject

}

function getGPSCoordinates(g) {
  // Parse DMS needs a string in the format of:
  // 51:30:0.5486N 0:7:34.4503W
  // DEG:MIN:SECDIRECTION DEG:MIN:SECDIRECTION

  // Use the parse-dms package to convert from DMS to decimal values

  // Return an object with the latitude and longitude in decimal
}