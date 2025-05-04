import jwt from 'jsonwebtoken';

export const validateUserInput = ({ username, email, password }) => {
  const errors = {};

  // Username validation
  if (!username || typeof username !== 'string') {
    errors.username = 'Kullanıcı adı zorunludur.';
  } else if (username.trim().length < 3) {
    errors.username = 'Kullanıcı adı en az 3 karakter olmalıdır.';
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string') {
    errors.email = 'E-posta zorunludur.';
  } else if (!emailRegex.test(email.trim())) {
    errors.email = 'Geçerli bir e-posta adresi girin.';
  }

  // Password validation
  if (!password || typeof password !== 'string') {
    errors.password = 'Şifre zorunludur.';
  } else if (password.length < 6) {
    errors.password = 'Şifre en az 6 karakter olmalıdır.';
  } else if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    errors.password = 'Şifre en az 1 büyük harf ve 1 rakam içermelidir.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: 'Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin.',
  standardHeaders: true, 
  legacyHeaders: false,  
});

