import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  rewrites: async () => [
    {
      source: '/',   // URL que l'utilisateur voit
      destination: '/dashboard',    // URL vers laquelle il est redirigé
    },
  ],
};

export default nextConfig;