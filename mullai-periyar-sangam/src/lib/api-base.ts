const configured = import.meta.env.VITE_API_URL

export const API_URL =
  configured !== undefined && configured !== ''
    ? configured
    : import.meta.env.DEV
      ? 'http://localhost:3001'
      : ''
