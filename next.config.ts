module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://sb-project-2.onrender.com/api/:path*',
      },
    ];
  },
};
