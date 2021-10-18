module.exports = {
  siteMetadata: {
    siteUrl: 'https://memes.reflexer.finance',
    title: 'RAI Meme World',
  },
  plugins: [
    {
      resolve: 'gatsby-source-contentful',
      options: {
        accessToken: '5ybfwuxolTWMU-T4L0jSsLGAEjhVyPF3EU-koAOcotI',
        spaceId: 'i9yewtly8bdr',
      },
    },
    'gatsby-plugin-sass',
    'gatsby-plugin-image',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: 'static/images/favicon/favicon-32x32.png',
      },
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'static',
        path: './static/',
      },
      __key: 'static',
    },
  ],
};
