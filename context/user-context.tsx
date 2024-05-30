"use client";
import { useEffect, useState, ReactNode, createContext } from "react";
import axios from "axios";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const BaseUrl = process.env.BASE_URL;

export interface User {
  _id: string;
  username: string;
  password: string;
  role: string;
  created_at: Date;
}

interface UserContextType {
  login: (values: any) => void;
  userRole: string | null;
  logout: () => void;
  loading: boolean;
  users: User[];
  createUser: (user: User) => void;
  updateUser: (user: User, id: string) => void;
  deleteUser: (id: string) => void;
  setIsDrawerVisible?: (value: boolean) => void;
  isDrawerVisible?: boolean;
  getAllUsers?: () => void;
}

export const UserContext = createContext<UserContextType>(
  {} as UserContextType
);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = () => {
    setLoading(true);
    axios
      .get(`${BaseUrl}/user`)
      .then((res) => {
        console.log(res.data);
        if (res.data.error == null) {
          setLoading(false);
          setUsers(res.data.data.users);
        } else {
          message.error(res.data.error);
        }
      })
      .catch((err) => {
        message.error(err.message);
        setLoading(false);
      });
  };
  const createUser = (user: User) => {
    setLoading(true);
    axios
      .post(`${BaseUrl}/user/registerUser`, user)
      .then((res) => {
        console.log(res.data);
        if (res.data.error == null) {
          message.success("User created successfully");
          getAllUsers();
          setLoading(false);
          setIsDrawerVisible(false);
        } else {
          message.error(res.data.error);
        }
      })
      .catch((err) => {
        message.error(err.message);
        setLoading(false);
      });
  };

  const updateUser = (user: User, id: string) => {
    console.log(user);
    console.log(user._id);

    setLoading(true);
    axios
      .put(`${BaseUrl}/user/${id}`, user)
      .then((res) => {
        console.log(res.data);
        if (res.data.error == null) {
          getAllUsers();
          setIsDrawerVisible(false);
          // setUsers(
          //   users.map((customer) => (user._id === id ? res.data.data : user))
          // );
          setLoading(false);
          message.success("User updated successfully");
        } else {
          message.error(res.data.error);
        }
      })
      .catch((err) => {
        message.error(err.message);
        setLoading(false);
      });
  };
  const deleteUser = (id: string) => {
    axios
      .delete(`${BaseUrl}/user/${id}`)
      .then((res) => {
        console.log(res.data);
        if (res.data.error == null) {
          message.success("User Deleted Successfully");
          getAllUsers();
        } else {
          message.error(res.data.error);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  // Function to decode token
  const decodeToken = (token: string) => {
    try {
      // Decode the JWT token
      const decodedToken = jwtDecode(token);
      return decodedToken;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // If token exists, set the user role
      const decodedToken = decodeToken(token);
      if (decodedToken && "role" in decodedToken) {
        const userRole = decodedToken.role as string | null;
        setUserRole(userRole);
        router.push("/dashboard");
      }
    }
  }, []);

  const login = (values: any) => {
    setLoading(true);
    axios
      .post(`${BaseUrl}/user/login`, values)
      .then((res) => {
        if (!res.data.error) {
          const token = res.data.data.token;
          localStorage.setItem("token", token);
          const decodedToken = decodeToken(token);
          if (decodedToken && "role" in decodedToken) {
            const userRole = decodedToken.role as string | null;
            setUserRole(userRole);
            setLoading(false);
            message.success("Login Successful");
            router.push("/dashboard");
          } else {
            message.error("Role information missing in token");
            setLoading(false);
          }
        } else {
          setLoading(false);
          message.error(res.data.error);
        }
      })
      .catch((err) => {
        message.error("Invalid username or password");
        setLoading(false);
      });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUserRole(null);
    router.push("/login");
    router.replace("/");
  };

  return (
    <UserContext.Provider
      value={{
        login,
        userRole,
        logout,
        loading,
        users,
        isDrawerVisible,
        setIsDrawerVisible,
        createUser,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
