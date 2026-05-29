'use strict';

const path = require('path');
const { BlobServiceClient } = require('@azure/storage-blob');

module.exports = function upload(connStr, directory, assets) {
  const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
  const containerName = 'atom-build';
  const containerClient = blobServiceClient.getContainerClient(containerName);

  async function listExistingAssetsForDirectory() {
    return containerClient.listBlobsFlat({ prefix: directory });
  }

  async function deleteExistingAssets(existingAssets = []) {
    try {
      for await (const asset of existingAssets) {
        console.log(`Deleting blob ${asset.name}`);
        containerClient.deleteBlob(asset.name);
      }
      return Promise.resolve(true);
    } catch (ex) {
      return Promise.reject(ex.message);
    }
  }

  function uploadAssets(assets) {
    return assets.reduce(function (promise, asset) {
      return promise.then(() => uploadAsset(asset));
    }, Promise.resolve());
  }

  async function uploadAsset(assetPath) {
    console.info(`Uploading ${assetPath}`);
    const blockBlobClient = containerClient.getBlockBlobClient(
      path.join(directory, path.basename(assetPath)),
    );
    return blockBlobClient.uploadFile(assetPath);
  }

  return listExistingAssetsForDirectory()
    .then(deleteExistingAssets)
    .then(() => uploadAssets(assets));
};
