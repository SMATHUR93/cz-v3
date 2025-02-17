import { NextApiRequest, NextApiResponse } from "next";
import { users } from "../db";
import { User } from "@/types";

export default function handler(req: NextApiRequest, res: NextApiResponse){

    const { id } = req.query;
    const userIndex = users.findIndex( u => u.id == parseInt(id));

    if (userIndex === -1) return res.status(404).json({ message: "User not found" });

    if(req.method == 'GET'){
        console.log("I am in : GET single");
        return res.status(200).json(users[userIndex]);
    }

    /* if(req.method == 'PUT'){
        console.log("I am in : PUT");
        const {name, email} = req.body;
        users[userIndex] = {...users[userIndex], name, email};
        return res.status(200).json(users[userIndex]);
    } */

    if(req.method == 'DELETE'){
        console.log("I am in : DELETE");
        users.splice(userIndex, 1);
        return res.status(200).json({ message: "User deleted" });
    }

}