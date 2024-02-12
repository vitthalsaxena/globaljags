// Imports


// Entry point function
exports.generateThumbnail = async (file, context) => {

  // Reject images that are not jpeg or png files

  // If the file is a valid photograph, download it to the 'local' VM so that we can create a thumbnail image
  if (validFile) {
    // Create a new filename for the 'final' version of the image file
    // The value of this will be something like '12745649237578595.jpg'

    // Create a working directory on the VM that runs our GCF to download the original file
    // The value of this variable will be something like 'tmp/thumbs'

    // Create a variable that holds the path to the 'local' version of the file
    // The value of this will be something like 'tmp/thumbs/398575858493.png'

    // Wait until the working directory is ready

    // Download the original file to the path on the 'local' VM

    // Upload our local version of the file to the final images bucket

    // Create a name for the thumbnail image
    // The value for this will be something like `thumb@64_1234567891234567.jpg`

    // Create a path where we will store the thumbnail image locally
    // This will be something like `tmp/thumbs/thumb@64_1234567891234567.jpg`

    // Use the sharp library to generate the thumbnail image and save it to the thumbPath
    // Then upload the thumbnail to the thumbnailsBucket in cloud storage

    // Delete the temp working directory and its files from the GCF's VM

  } // end of validFile==true

  // DELETE the original file uploaded to the "Uploads" bucket

}