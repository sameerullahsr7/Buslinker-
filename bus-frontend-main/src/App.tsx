import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/700.css';
import "./App.css"
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import SplashScreen from './components/SplashScreen';
import { useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from './core';
import { login, logout } from './redux/user';
import { ThemeProvider } from '@mui/system';
import { theme } from './mui/theme';
import Booking from './pages/Booking';
import Buses from "./pages/admin/Buses"
import Reservations from './pages/admin/Reservations';
import Global from './pages/admin/Global';
import BusRoutesTables from './pages/admin/BusRoutesTable';
import Companies from './pages/admin/Companies';
import Passengers from './pages/admin/Passengers';
import MyReservations from './pages/MyReservations';

const App = () => {

  const currentUser = useSelector((state: any) => state.user)
  console.log("currentUser", currentUser)
  const dispatch = useDispatch()

  useEffect(() => {
    axios.interceptors.request.use(
      function (config) {
        config.withCredentials = true;
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    return () => {
      // cleanup function
    };
  }, [])

  useEffect(() => {

    const checkLoginStatus = async () => {
      try {
        const resp = await axios.get(`${baseUrl}/api/v1/profile`, {
          withCredentials: true,
        });
        dispatch(login(resp?.data?.data));
      } catch (err) {
        console.error(err);
        dispatch(logout());
      }
    };

    checkLoginStatus();

    return () => {
      // cleanup function
    };

  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <>
          {
            currentUser?.isLogin == true && currentUser?.isAdmin == false && (
              <>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/booking" element={<Booking />} />
                  <Route path="/my-reservations" element={<MyReservations />} />
                  <Route path="*" element={<Navigate to="/" replace={true} />} />
                </Routes>
              </>
            )
          }
          {
            currentUser?.isLogin == true && currentUser?.isAdmin == true && (
              <>
                <Routes>
                  {/* <Route path="/" element={<Home />} /> */}
                  <Route path="/admin/reservations" element={<Reservations />} />
                  <Route path="/admin/buses/:companyId" element={<Buses />} />
                  <Route path="/admin/companies" element={<Companies />} />
                  <Route path="/admin/global" element={<Global />} />
                  <Route path="/admin/routes/:busId" element={<BusRoutesTables />} />
                  <Route path="/admin/passengers/:routeId" element={<Passengers />} />
                  <Route path="*" element={<Navigate to="/admin/companies" replace={true} />} />
                </Routes>
              </>
            )
          }
          {
            currentUser?.isLogin == false && (
              <>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="*" element={<Navigate to="/auth" replace={true} />} />
                </Routes>
              </>
            )
          }
          {
            currentUser?.isLogin == null && (
              <>
                <SplashScreen />
              </>
            )
          }
        </>
      </ThemeProvider>
    </>
  )
}

export default App