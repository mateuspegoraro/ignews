/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next"

export default (request: NextApiRequest, response: NextApiResponse) => {
   console.log(request.query);
   // http://localhost:3000/api/users/1
   // { id: '1' }
    
    const users = [
        {
           id: 1,
           name : "Mateus",
        },
        {
           id: 2,
           name : "Jones"
        },
        {
           id: 3,
           name : "Doe",
        },
    ]



    return response.json(users);
}