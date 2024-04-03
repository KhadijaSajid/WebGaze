const puppeteer = require("puppeteer");
const axios = require("axios");

const imgbbApiKey = "{insert your imgbbApiKey}";

async function captureAndUploadScreenshot(url, w, h) {
  try {
    // Launch a headless browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
      width: w,
      height: h,
      isMobile: false,
      isLandscape: true,
      hasTouch: false,
      deviceScaleFactor: 1,
    });

    // Navigate to the specified URL
    // eslint-disable-next-line no-unused-expressions, no-sequences
    await page.goto(url), { waitUntil: "networkidle2" };
    await Promise.all([new Promise((resolve) => setTimeout(resolve, 17000))]);

    // Capture a screenshot
    const screenshotBuffer = await page.screenshot({
      fullPage: true,
    });

    // Close the browser
    await browser.close();

    const formData = new FormData();
    formData.append("key", imgbbApiKey);
    formData.append("image", screenshotBuffer.toString("base64"));

    const imgbbResponse = await axios.post(
      "https://api.imgbb.com/1/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    // Extract the image URL from the ImgBB API response
    const imageUrl = imgbbResponse.data.data.url;

    return imageUrl;
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
}

// Example usage
const webpageUrl = "{insert your website url}";
const width = 1200;
const height = 1000;

captureAndUploadScreenshot(webpageUrl, width, height)
  .then((imageUrl) => {
    console.log("Image URL:", imageUrl);
  })
  .catch((error) => {
    console.error(error.message);
  });
