import { LoggerMiddleware } from './logger.middleware';
import { Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

describe('LoggerMiddleware', () => {
  let loggerMiddleware: LoggerMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let loggerSpy: jest.SpyInstance;

  beforeEach(() => {
    loggerMiddleware = new LoggerMiddleware();
    loggerSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
    jest.spyOn(Logger.prototype, 'warn').mockImplementation();

    mockRequest = {
      method: 'GET',
      originalUrl: '/test-url',
      get: jest.fn().mockReturnValue('test-user-agent'),
    };
    mockResponse = {
      statusCode: 200,
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === 'finish') callback();
      }),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log successful requests with status 200', () => {
    loggerMiddleware.use(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockNext).toHaveBeenCalled();
    expect(loggerSpy).toHaveBeenCalledWith(
      'GET /test-url 200 - test-user-agent',
    );
  });

  it('should warn for client errors with status 404', () => {
    mockResponse.statusCode = 404;

    loggerMiddleware.use(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockNext).toHaveBeenCalled();
    expect(Logger.prototype.warn).toHaveBeenCalledWith(
      'GET /test-url 404 - test-user-agent',
    );
  });

  it('should warn for server errors with status 500', () => {
    mockResponse.statusCode = 500;

    loggerMiddleware.use(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(mockNext).toHaveBeenCalled();
    expect(Logger.prototype.warn).toHaveBeenCalledWith(
      'GET /test-url 500 - test-user-agent',
    );
  });
});
