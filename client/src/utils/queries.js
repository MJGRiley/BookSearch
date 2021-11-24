import { gql } from "@apollo/client"

export const GET_ME = gql`
  {
    me {
      _id
      username
      email
      bookCount
      saveBooks {
        authors
        description
        title
        bookId
        link
        image
      }
    }
  }
`