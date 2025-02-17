import { useEffect, useState } from "react";
import { User } from "@/types";
import { useUserContext } from "../context/UserContext";
import { Button } from "react-bootstrap";

export default function Home () {

    // const [users, setUsers] = useState<User[]>([]);
    const { users, setUsers, addUser, deleteUser } = useUserContext();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(()=>{
        fetch("/api/users")
        .then(res => res.json())
        .then(data => setUsers([...data]));
    },[]);

    const handleAddUser = async () => {
        const res = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email }),
        });
        const newUsers = await res.json();
        setUsers([...newUsers]);
    };

    const handleDeleteUser = async (id: number) => {
        await fetch(`/api/users/${id}`, { 
            method: "DELETE" 
        });
        deleteUser(id);
    };

    /* const updateUser = async (id: number, user: User) => {
        let {name, email} = user;
        const res = await fetch("/api/users/${id}", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email }),
        });
        const updatedUser = await res.json();
        users[id] = updatedUser;
        setUsers([...users]);
    }; */

    return (
        <div className="container">
            <h1 className="text-primary">User List</h1>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.name} ({user.email})
                        <Button variant="primary" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                        {/* <button onClick={() => updateUser(user.id, user)}>Update</button> */}
                    </li>
                ))}
            </ul>

            <h2 className="text-primary">Add User</h2>
            <input type="text" placeholder="Name" onChange={e => setName(e.target.value)} />
            <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
            <Button variant="primary" onClick={handleAddUser}>
                Add
            </Button>
        </div>
    );

}