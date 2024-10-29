import { validate } from 'class-validator';
import { SignUpDto } from './signup.dto';

describe('SignUpDto', () => {
  it('should pass validation for a valid SignUpDto', async () => {
    const dto = new SignUpDto();
    dto.email = 'test@example.com';
    dto.name = 'Test User';
    dto.password = 'Valid1@Password';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation for missing email', async () => {
    const dto = new SignUpDto();
    dto.name = 'Test User';
    dto.password = 'Valid1@Password';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('should fail validation for invalid email format', async () => {
    const dto = new SignUpDto();
    dto.email = 'invalid-email';
    dto.name = 'Test User';
    dto.password = 'Valid1@Password';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('should fail validation for missing name', async () => {
    const dto = new SignUpDto();
    dto.email = 'test@example.com';
    dto.password = 'Valid1@Password';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
  });

  it('should fail validation for missing password', async () => {
    const dto = new SignUpDto();
    dto.email = 'test@example.com';
    dto.name = 'Test User';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
  });
});
