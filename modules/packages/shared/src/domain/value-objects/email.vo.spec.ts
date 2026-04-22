import { Email, InvalidEmailError } from './email.vo';

describe('Email', () => {
  it('normalizes to lowercase and trims whitespace', () => {
    const email = Email.from('  Foo@Example.COM  ');
    expect(email.value).toBe('foo@example.com');
  });

  it('considers equal emails value-equal', () => {
    expect(Email.from('a@b.com').equals(Email.from('A@B.COM'))).toBe(true);
  });

  it.each([
    ['empty', ''],
    ['no @', 'foobar.com'],
    ['no tld', 'foo@bar'],
    ['spaces', 'foo bar@baz.com'],
  ])('rejects %s', (_label, raw) => {
    expect(() => Email.from(raw)).toThrow(InvalidEmailError);
  });
});
