"use client";
import { useEffect, useState, ReactNode, createContext } from "react";
import axios from "axios";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
const BaseUrl = process.env.BASE_URL;

export interface Route {
  _id: string;
  name: string;
  description: string;
  created_at: Date;
}

interface RouteContextType {
  routes: Route[];
  loading: boolean;
  createRoute: (route: Route) => void;
  updateRoute: (route: Route, id: string) => void;
  deleteRoute: (id: string) => void;
  setIsDrawerVisible?: (value: boolean) => void;
  isDrawerVisible?: boolean;
  getAllRoutes?: () => void;

}

export const RouteContext = createContext<RouteContextType>(
  {} as RouteContextType
);

export const RouteProvider = ({ children }: { children: ReactNode }) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);

  const getAllRoutes = () => {
    setLoading(true);
    axios
      .get(`${BaseUrl}/route`)
      .then((res) => {
        console.log(res.data);
        if (res.data.error == null) {
          setLoading(false);
          setRoutes(res.data.data.data);
        } else {
          message.error(res.data.error);
        }
      })
      .catch((err) => {
        message.error(err.message);
        setLoading(false);
      });
  };

  const createRoute = (route: Route) => {
    setLoading(true);
    axios
      .post(`${BaseUrl}/route`, route)
      .then((res) => {
        console.log(res.data);
        if (res.data.error == null) {
          message.success("Route created successfully");
          getAllRoutes();
        } else {
          message.error(res.data.error);
        }
      })
      .catch((err) => {
        message.error(err.message);
        setLoading(false);
      });
  };

  const updateRoute = (route: Route, id: string) => {
    setLoading(true);
    axios
      .put(`${BaseUrl}/route/${id}`, route)
      .then((res) => {
        console.log(res.data);
        if (res.data.error == null) {
          message.success("Route updated successfully");
          getAllRoutes();
        } else {
          message.error(res.data.error);
        }
      })
      .catch((err) => {
        message.error(err.message);
        setLoading(false);
      });
  };
  const deleteRoute = (id: string) => {
    setLoading(true);
    axios
      .delete(`${BaseUrl}/route/${id}`)
      .then((res) => {
        console.log(res.data);
        if (res.data.error == null) {
          message.success("Route deleted successfully");
          getAllRoutes();
        } else {
          message.error(res.data.error);
        }
      })
      .catch((err) => {
        message.error(err.message);
        setLoading(false);
      });
  };
  useEffect(() => {
    getAllRoutes();
  }, []);

  return (
    <RouteContext.Provider
      value={{
        routes,
        loading,
        createRoute,
        updateRoute,
        deleteRoute,
        isDrawerVisible,
        setIsDrawerVisible,
      }}
    >
      {children}
    </RouteContext.Provider>
  );
};
