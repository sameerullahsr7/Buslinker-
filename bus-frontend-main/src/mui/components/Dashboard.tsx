import "./main.css"

import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { ThemeProvider } from '@emotion/react';
import { dashBoardTheme } from '../theme';
import logo from "../../assets/images/logo.png"
import { FaRegBell } from "react-icons/fa";
import { useSelector } from "react-redux";
import { profileImage } from "../../core";
// import { IoPersonSharp } from "react-icons/io5";
import { MdDirectionsBus } from "react-icons/md";
// import { RiGlobalLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { baseUrl } from "../../core"
import { useDispatch } from "react-redux"
import { logout } from "../../redux/user"
import axios from "axios";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);
export default function Dashboard({ component }: any) {

    const currentUser = useSelector((state: any) => state?.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const _logout = async () => {

        try {

            const logoutResp = await axios.post(`${baseUrl}/api/v1/logout`, {}, { withCredentials: true })

            console.log("logoutResp", logoutResp)

            dispatch(logout())

        } catch (error) {
            console.log(error)
        }

    }

    return (
        <ThemeProvider theme={dashBoardTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" open={open}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{
                                marginRight: 5,
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <img src={logo} alt="logo"
                                className='object-contain object-center rounded-full cursor-pointer'
                                style={{
                                    width: 40,
                                    height: 40,
                                    marginLeft: -8,
                                }}
                            />
                        </IconButton>
                        <div className="w-full ml-auto flex flex-row-reverse items-center gap-4">
                            <div className="flex justify-center items-center gap-4">
                                <FaRegBell />
                                <img src={
                                    currentUser?.profilePhoto ? currentUser?.profilePhoto : profileImage
                                } alt="profilePhoto"
                                    className='object-contain my-4 object-center rounded-full cursor-pointer'
                                    style={{
                                        width: 40,
                                        height: 40,
                                    }}
                                />
                                <div className="w-fit flex flex-col justify-start gap-0">
                                    <p className="text-[#fff] cursor-pointer">{currentUser?.userName}</p>
                                    <p className="text-[#fff] cursor-pointer"
                                        style={{
                                            fontSize: "16px"
                                        }}
                                    >Admin</p>
                                </div>
                                <Button onClick={_logout}
                                    sx={{
                                        background: "#0099ff"
                                    }}
                                    variant="contained" color="primary"
                                >Logout</Button>
                            </div>
                        </div>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}
                    sx={{
                        backgroundColor: "#0a101d"
                    }}
                >
                    <DrawerHeader
                        sx={{
                            backgroundColor: "#0a101d"
                        }}
                    >
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <List
                        sx={{
                            backgroundColor: "#0a101d"
                        }}
                    >
                        {
                            open && <img src={logo} alt="logo"
                                className="w-[80px] h-[80px] rounded-full object-contain object-center mx-auto my-4"
                            />
                        }
                        <>
                            {/* <ListItem
                                onClick={() => navigate("/admin/reservations")}
                                className={window?.location?.pathname === "/admin/reservations" ? "activeAdmin" : ""}
                                disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <IoPersonSharp />
                                    </ListItemIcon>
                                    <ListItemText primary="Reservations" sx={{ opacity: open ? 1 : 0 }} />
                                </ListItemButton>
                            </ListItem> */}
                            <ListItem
                                onClick={() => navigate("/admin/buses")}
                                className={(window?.location?.pathname?.startsWith("/admin/buses") || window?.location?.pathname?.startsWith("/admin/companies") || window?.location?.pathname.startsWith("/admin/routes") || window?.location?.pathname?.startsWith("/admin/passengers")) ? "activeAdmin" : ""}
                                disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <MdDirectionsBus />
                                    </ListItemIcon>
                                    <ListItemText primary="Bus Details" sx={{ opacity: open ? 1 : 0 }} />
                                </ListItemButton>
                            </ListItem>
                            {/* <ListItem
                                onClick={() => navigate("/admin/global")}
                                className={window?.location?.pathname === "/admin/global" ? "activeAdmin" : ""}
                                disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <RiGlobalLine />
                                    </ListItemIcon>
                                    <ListItemText primary="Global" sx={{
                                        opacity: open ? 1 : 0,
                                    }}
                                    />
                                </ListItemButton>
                            </ListItem> */}
                        </>
                    </List>
                </Drawer>
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <DrawerHeader />
                    {component}
                </Box>
            </Box>
        </ThemeProvider>
    );
}