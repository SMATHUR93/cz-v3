import { NextApiRequest, NextApiResponse } from "next";
import { users } from "./db";

export default function handler(req: NextApiRequest, res: NextApiResponse){
    
    for(var el in users){
        console.log(users[el]);
    }

    if(req.method == 'GET'){
        console.log("I am in : GET all");
        return res.status(200).json(users);
    }
    if(req.method == 'POST'){
        console.log("I am in : POST");
        const {name, email} = req.body;
        const newUser = {id: users.length+1, name: name, email: email};
        users.push(newUser);
        return res.status(201).json(users);
    }
}