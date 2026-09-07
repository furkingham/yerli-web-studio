const Jimp = require('jimp');

const imgPath = "C:\\Users\\Furkan\\.gemini\\antigravity\\brain\\5e7c009f-2d96-4377-8f5d-2203ae2f93ae\\.user_uploaded\\media_1788707831539.jpg";
const outPath = "C:\\Users\\Furkan\\Desktop\\yerli-web-studio\\public\\kaswa-logo-v2.png";

Jimp.read(imgPath)
  .then(image => {
    // Loop through all pixels
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      
      // If the pixel is near-black (threshold 30)
      if (red < 30 && green < 30 && blue < 30) {
        // Change to #db0000 (219, 0, 0)
        this.bitmap.data[idx + 0] = 219;
        this.bitmap.data[idx + 1] = 0;
        this.bitmap.data[idx + 2] = 0;
      }
    });
    
    // Save to the destination path
    return image.writeAsync(outPath);
  })
  .then(() => {
    console.log("Image processed successfully.");
  })
  .catch(err => {
    console.error("Error processing image:", err);
  });
