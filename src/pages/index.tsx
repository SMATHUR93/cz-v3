import React from 'react';
import { useUsers } from '../context/UserContext';
import UserForm from '../components/UserForm';

const Home = () => {
  const { users, deleteUser } = useUsers();
  return (
    <div>
      <h1>User Management</h1>
      <UserForm />
      <ul>
        {users.map((user: {
            id: React.Key | null | undefined; 
            name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; 
            email: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; 
        }) => (
          <li key={user.id}>
            {user.name} ({user.email}) <button onClick={() => deleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Home;


/* import { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import { Button } from "react-bootstrap";
import { Table } from "react-bootstrap";


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
        const newUser = await res.json();
        addUser(newUser);
    };

    const handleDeleteUser = async (id: number) => {
        await fetch(`/api/users/${id}`, { 
            method: "DELETE" 
        });
        deleteUser(id);
    };

    // not correct for update and anyways for users we don't need to do it
    const handleUpdateUser = async (id: number, user: User) => {
        let {name, email} = user;
        const res = await fetch("/api/users/${id}", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email }),
        });
        const updatedUser = await res.json();
        users[id] = updatedUser;
        setUsers([...users]);
    };

    return (
        <div className="container">
            <br/>
            <h2 className="text-primary">Add User</h2>
            <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <Button variant="primary" onClick={handleAddUser}>
                Add
            </Button>
            <br/>
            <br/>
            <h3 className="text-primary">User List</h3>
            <Table striped bordered style={{width:'600px'}}>
                <thead>
                    <tr>
                        <th style={{width:'40%'}}>Name</th>
                        <th style={{width:'40%'}}>Email </th>
                        <th style={{width:'20%'}} colSpan={2}> Actions </th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user)=>{
                        console.log(user);
                        return (
                            <tr key={user?.id}>
                                <td>{user?.name}</td>
                                <td>{user?.email}</td>
                                <td><Button variant="primary" onClick={() => handleDeleteUser(user.id)}>Delete</Button></td>
                                <td><Button variant="primary" onClick={() => handleUpdateUser(user.id, user)}>Update</Button></td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>            
        </div>
    );

} */