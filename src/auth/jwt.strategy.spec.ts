import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import * as dotenv from 'dotenv';

dotenv.config();

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: JwtStrategy,
          useFactory: () => new JwtStrategy(process.env.JWT_SECRET),
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should validate a valid JWT and return the user payload', async () => {
    const payload = { sub: '123', email: 'test@example.com' };
    const result = await jwtStrategy.validate(payload);

    expect(result).toEqual({ userId: '123', email: 'test@example.com' });
  });

  it('should handle an invalid JWT gracefully', async () => {
    const payload = null;
    await expect(jwtStrategy.validate(payload)).rejects.toThrow();
  });
});
