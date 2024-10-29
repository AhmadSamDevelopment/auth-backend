import { validate } from 'class-validator';
import { SignInDto } from './signin.dto';

describe('SignInDto', () => {
  it('should pass validation for a valid SignInDto', async () => {
    const dto = new SignInDto();
    dto.email = 'test@example.com';
    dto.password = 'ValidPassword123';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation for missing email', async () => {
    const dto = new SignInDto();
    dto.password = 'ValidPassword123';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('should fail validation for invalid email format', async () => {
    const dto = new SignInDto();
    dto.email = 'invalid-email';
    dto.password = 'ValidPassword123';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('should fail validation for missing password', async () => {
    const dto = new SignInDto();
    dto.email = 'test@example.com';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
  });
});
