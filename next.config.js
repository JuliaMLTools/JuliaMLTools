module.exports = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/transformer-blocks',
          permanent: true,
        },
      ]
    },
}