export const AUTH_CONFIG = {
  jwt: {
    secret: process.env.JWT_SECRET || 'sua_chave_secreta_aqui_mude_em_producao',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
  },
  password: {
    minLength: parseInt(process.env.PASSWORD_MIN_LENGTH || '6', 10),
    maxLength: parseInt(process.env.PASSWORD_MAX_LENGTH || '50', 10),
  },
} as const;
