import { AllExceptionsFilter } from './all-exceptions.filter';
import {
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let mockResponse: Partial<Response>;
  let mockRequest: Partial<Request>;
  let mockHost: ArgumentsHost;
  let loggerSpy: jest.SpyInstance;

  beforeEach(() => {
    filter = new AllExceptionsFilter();
    loggerSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();

    mockRequest = { url: '/test' };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: () => mockRequest,
        getResponse: () => mockResponse,
      }),
    } as unknown as ArgumentsHost;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle HttpException and return the correct response', () => {
    const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.FORBIDDEN,
      timestamp: expect.any(String),
      path: mockRequest.url,
      message: 'Forbidden',
    });
    expect(loggerSpy).toHaveBeenCalledWith(
      'Exception: Forbidden',
      exception.stack,
    );
  });

  it('should handle non-HttpException and return 500 status', () => {
    const exception = new Error('Something went wrong');

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 500,
      timestamp: expect.any(String),
      path: mockRequest.url,
      message: 'Internal server error',
    });
    expect(loggerSpy).toHaveBeenCalledWith(
      'Exception: Internal server error',
      exception.stack,
    );
  });

  it('should log the exception stack trace', () => {
    const exception = new Error('Test error');

    filter.catch(exception, mockHost);

    expect(loggerSpy).toHaveBeenCalledWith(
      'Exception: Internal server error',
      exception.stack,
    );
  });
});
