import { graphql, useStaticQuery } from 'gatsby';

export default function useMemes() {
  const { allContentfulMeme } = useStaticQuery(graphql`
    query Memes {
      allContentfulMeme {
        edges {
          node {
            memeFile {
              file {
                fileName
                url
              }
            }
          }
        }
      }
    }
  `);
  return allContentfulMeme.edges;
}
