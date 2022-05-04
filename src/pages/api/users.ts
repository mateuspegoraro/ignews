import { NextApiRequest, NextApiResponse } from "next"

export default (request, response) => {
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