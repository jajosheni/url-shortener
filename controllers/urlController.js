const Url = require('../models/url');
const { generate } = require('../services/urlCodeService');

module.exports = {
  /**
   * Finds a URL by its urlCode and redirects to the URL if found.
   *
   * This function finds a URL in the database by its urlCode, which is taken from the request parameters.
   * If a URL with the provided urlCode is found, the function redirects the client to the full URL.
   * If no URL is found, the function sends a 404 response with an error message.
   *
   * @param {Object} req - The Express request object.
   * @param {Object} req.params - The request parameters.
   * @param {string} req.params.urlCode - The urlCode of the URL to find.
   * @param {Object} res - The Express response object.
   * @param {Function} next - The next middleware function.
   * @returns {Promise} A Promise that resolves to the Express response object, with a redirection or an error message.
   * @async
   */
  show: async function (req, res, next) {
    const url = await Url.findOne({ urlCode: req.params.urlCode });

    if (url) {
      res.redirect(url.fullUrl);
    } else {
      res.status(404).send({ error: 'Url not found' });
    }
  },

  /**
   * Stores a URL and its shortened version in the database.
   *
   * This function takes a full URL from the request body, checks if it's already in the database,
   * and returns the corresponding shortened URL if it is. If the URL is not in the database,
   * the function generates a unique 4-character urlCode, constructs a new shortened URL,
   * creates a new document in the Url model with the full URL, shortened URL, and urlCode,
   * saves the document in the database, and returns the new shortened URL.
   *
   * @param {Object} req - The Express request object.
   * @param {Object} req.body - The request body.
   * @param {string} req.body.fullUrl - The full URL to shorten.
   * @param {Object} res - The Express response object.
   * @param {Function} next - The next middleware function.
   * @returns {Promise} A Promise that resolves to the Express response object, with the shortened URL.
   * @async
   */
  store: async function (req, res, next) {
    const { fullUrl } = req.body;
    // Validate URL
    try {
      new URL(fullUrl);
    } catch (err) {
      return res.status(400).send({ error: 'Invalid URL.' });
    }

    // generates a unique four-characters long id
    const urlCode = await generate();

    // Check if the URL is already in the database
    const url = await Url.findOne({ fullUrl: fullUrl });

    if (url) {
      res.send({ shortUrl: url.shortUrl });
    } else {
      const shortUrl = `${process.env.APP_URL}/${urlCode}`;

      const newUrl = new Url({
        fullUrl: fullUrl,
        shortUrl: shortUrl,
        urlCode: urlCode,
      });

      await newUrl.save();

      res.send({ shortUrl: shortUrl });
    }
  },
};
