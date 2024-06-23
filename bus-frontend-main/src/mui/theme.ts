import { createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
            main: '#29ABE2',
            contrastText: '#fff',
        },
        secondary: {
            main: '#4DD836',
            contrastText: '#fff',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '100px',
                    padding: "10px 20px"
                },
            }
        }
    },
    typography: {
        fontFamily: 'Poppins, Noto Nastaliq Urdu, sans-serif',
    },
});

const dashBoardTheme = createTheme({
    palette: {
        primary: {
            main: '#0a101d',
            contrastText: '#fff',
        },
        secondary: {
            main: '#29ABE2',
            contrastText: '#fff',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '100px',
                    padding: "10px 20px"
                },
            }
        }
    }
});

export { theme, dashBoardTheme }