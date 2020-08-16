
export function validateEmail(email: string, msg?: string): void {
    const regexp = /^[a-zA-Z0-9.!#$%&'*+\/=?^`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email.match(regexp)) {
      throw new Error(msg ? msg : 'Email parameter is invalid.');
    }
  }
  