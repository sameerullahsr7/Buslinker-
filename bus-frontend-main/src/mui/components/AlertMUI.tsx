import * as React from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { RxCross2 } from "react-icons/rx";

export default function AlertMUI(props: any) {

    const [state, setState] = React.useState({
        open: true,
        vertical: 'top',
        horizontal: 'center',
    });

    // Destructure the 'open' property from the state
    const { open } = state;

    // ... (rest of your component)

    return (
        <div className='flex justify-center w-[100%] fixed top-[2em] z-10'>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={open}
                key={"top" + "center"}
                // Add onClose handler to update the state when Snackbar is closed
                onClose={() => setState({ ...state, open: false })}
            >
                <Alert severity={props.status} icon={<RxCross2 />} style={{
                    width: "fit-content",
                    fontSize: "1em",
                    margin: "0 1em"
                }}>
                    {props.text}
                </Alert>
            </Snackbar>
        </div>
    );
}