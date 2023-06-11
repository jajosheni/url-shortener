const { customAlphabet } = require('nanoid');
const Url = require('../models/url');

const alphabet =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~';
const nanoid = customAlphabet(alphabet, 4);

module.exports = {
  /**
   * Generates a unique 4-character urlCode.
   *
   * This function creates a 4-character urlCode using the nanoid library. It checks
   * the database to ensure the urlCode is not already in use. If the urlCode is in use,
   * the function recursively calls itself until it generates a unique urlCode.
   *
   * @returns {Promise<string>} A Promise that resolves to a unique 4-character urlCode.
   * @async
   */
  generate: async function () {
    const urlCode = nanoid();

    // Check if the URLCode is already in the database
    const url = await Url.findOne({ urlCode: urlCode });

    if (url) {
      return this.generate();
    } else {
      return urlCode;
    }
  },
};
