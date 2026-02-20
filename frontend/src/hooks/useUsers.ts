import { useEffect, useState } from "react";
import api from "@/lib/userApi";

const useUsers = (name: string) => {
    const [users, setUsers] = useState<string[]>([]);

    const getUsers = async () => {
        if (!name) return;
        try {
            const res = await api.get("/users");
            console.log("Fetched all users successfully");
            const usernames = res.data.users
                .map((user: { username: string }) => user.username)
                .filter((username: string) => username !== name);
            setUsers(usernames);
            return res.data;
        } catch (error) {
            console.log("Failed to fetch all users!");
        }
    };

    useEffect(() => {
        getUsers();
    }, [name]);

    return {
        users,
        getUsers,
    };
};

export default useUsers;