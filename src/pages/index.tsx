import React, { useEffect, useState } from 'react';
import { useProduct } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { Product } from '@/types';

const Home = () => {
  const { user, logout } = useAuth();
  const { products, fetchProducts, addProduct, deleteProduct } = useProduct();
  const router = useRouter();
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (!user) {
        router.push('/login');
    }
    else fetchProducts();
  }, [user]);

  return (
    <div>
      <h1>Product Management</h1>
      <button onClick={logout}>Logout</button>
      <br/>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
      <button onClick={() => addProduct({ name, price })}>Add Product</button>
      <br/>
      <ul>
        {products.map((product: Product) => (
          <li key={product.id}>
            {product.name} - ${product.price}
            {/* <button onClick={() => updateProduct(product.id!, { name, price })}>Edit</button> */}
            <button onClick={() => deleteProduct(product.id!)}>Delete</button>
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