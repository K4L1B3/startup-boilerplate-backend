import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsStrongPasswordConstraint
  implements ValidatorConstraintInterface
{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(password: string, _args: ValidationArguments): boolean {
    return this.validatePassword(password).isValid;
  }

  defaultMenssage(_args: ValidationArguments): string {
    const validationResult = this.validatePassword(_args.value);
    return validationResult.message;
  }

  validatePassword(password: string): { isValid: boolean; message: string } {
    const reasons = [];
    reasons.push('A sua senha: ');

    if (password.length < 8) reasons.push('deve ter no mínimo 8 caracteres');
    if (!/[a-z]/.test(password)) reasons.push('deve  conter letras minúsculas');
    if (!/[A-Z]/.test(password)) reasons.push('deve conter  letras maiúsculas');
    if (!/\d/.test(password)) reasons.push('deve conter pelo menos um numero');

    return {
      isValid: reasons.length === 1,
      message: reasons.join(', ') + '.',
    };
  }
}
