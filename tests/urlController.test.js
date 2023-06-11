const Url = require('../models/url');
const urlController = require('../controllers/urlController');
const urlCodeService = require('../services/urlCodeService');

jest.mock('../services/urlCodeService'); // Mock the urlCodeService module

describe('URL Controller', () => {
    describe('show', () => {
        it('should redirect to the full URL if a URL with the provided urlCode exists', async () => {
            // Mock the request and response objects
            const req = {
                params: {
                    urlCode: 'abc123',
                },
            };
            const res = {
                redirect: jest.fn(),
                status: jest.fn().mockReturnThis(), // Mock the `status` method
            };
            const url = {
                fullUrl: 'https://example.com/original-url',
            };

            // Mock the `findOne` method of the Url model
            Url.findOne = jest.fn().mockResolvedValue(url);

            // Call the show method
            await urlController.show(req, res);

            // Assert that the redirect method was called with the correct URL
            expect(res.redirect).toHaveBeenCalledWith(url.fullUrl);
            // Assert that the status method was not called
            expect(res.status).not.toHaveBeenCalled();
        });

        it('should send a 404 error if no URL with the provided urlCode exists', async () => {
            // Mock the request and response objects
            const req = {
                params: {
                    urlCode: 'nonexistent',
                },
            };
            const res = {
                redirect: jest.fn(),
                status: jest.fn().mockReturnThis(), // Mock the `status` method
                send: jest.fn(),
            };

            // Mock the `findOne` method of the Url model
            Url.findOne = jest.fn().mockResolvedValue(null);

            // Call the show method
            await urlController.show(req, res);

            // Assert that the status and send methods were called with the correct error message
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({ error: 'Url not found' });
            // Assert that the redirect method was not called
            expect(res.redirect).not.toHaveBeenCalled();
        });
    });


    describe('store', () => {
        beforeEach(() => {
            urlCodeService.generate.mockReset(); // Reset the mock function before each test case
        });

        it('should respond with a short URL if the URL is already in the database', async () => {
            // Mock the request and response objects
            const req = {
                body: {
                    fullUrl: 'https://example.com',
                },
            };
            const res = {
                send: jest.fn(),
                status: jest.fn().mockReturnThis(), // Mock the `status` method
            };
            const url = {
                shortUrl: 'https://domainname.com/short-url',
            };

            // Mock the `findOne` method of the Url model
            Url.findOne = jest.fn().mockResolvedValue(url);

            // Call the store method
            await urlController.store(req, res);

            // Assert that the send method was called with the correct short URL
            expect(res.send).toHaveBeenCalledWith({ shortUrl: url.shortUrl });
            // Assert that the status method was not called
            expect(res.status).not.toHaveBeenCalled();
        });

        it('should respond with a new short URL if the URL is not in the database', async () => {
            // Mock the request and response objects
            const req = {
                body: {
                    fullUrl: 'https://example.com',
                },
            };
            const res = {
                send: jest.fn(),
                status: jest.fn().mockReturnThis(), // Mock the `status` method
            };
            const generatedUrlCode = 'abc123';
            const shortUrl = `${process.env.APP_URL}/${generatedUrlCode}`;
            const newUrl = {
                shortUrl: shortUrl,
            };

            // Mock the `findOne` method of the Url model
            Url.findOne = jest.fn().mockResolvedValue(null);
            // Mock the `save` method of the Url model
            Url.prototype.save = jest.fn().mockResolvedValue(newUrl);

            // Mock the generate function from the urlCodeService
            urlCodeService.generate.mockResolvedValue(generatedUrlCode);

            // Call the store method
            await urlController.store(req, res);

            // Assert that the send method was called with the correct short URL
            expect(res.send).toHaveBeenCalledWith({ shortUrl: shortUrl });
            // Assert that the status method was not called
            expect(res.status).not.toHaveBeenCalled();
        });

        it('should respond with a 400 error if the provided URL is invalid', async () => {
            // Mock the request and response objects
            const req = {
                body: {
                    fullUrl: 'invalid-url',
                },
            };
            const res = {
                send: jest.fn(),
                status: jest.fn().mockReturnThis(), // Mock the `status` method
            };
            Url.prototype.save.mockReset();

            // Call the store method
            await urlController.store(req, res);

            // Assert that the status and send methods were called with the correct error message
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ error: 'Invalid URL.' });
            // Assert that the generate and save methods were not called
            expect(urlCodeService.generate).not.toHaveBeenCalled();
            expect(Url.prototype.save).not.toHaveBeenCalled();
        });
    });
});
