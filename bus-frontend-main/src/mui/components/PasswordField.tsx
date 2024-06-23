import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function PasswordField(props: any) {
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: any) => {
        event.preventDefault();
    };

    const handleChange = (event: any) => {
        if (props.onChange) {
            props.onChange(event.target.value);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', width: props?.width }}>
            <FormControl variant="outlined" sx={{ width: props?.width }}>
                <InputLabel htmlFor={`outlined-adornment-password-${props?.un}`}>{props.label}</InputLabel>
                <OutlinedInput
                    id={`outlined-adornment-password-${props?.un}`}
                    type={showPassword ? 'text' : 'password'}
                    onChange={handleChange} // Call the handleChange function on input change
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff
                                    style={{
                                        backgroundColor: "#353535",
                                        borderRadius: "100%",
                                        padding: "4px"
                                    }}
                                /> : <Visibility
                                    style={{
                                        backgroundColor: "#353535",
                                        borderRadius: "100%",
                                        padding: "4px"
                                    }}
                                />}
                            </IconButton>
                        </InputAdornment>
                    }
                    label={props?.label}
                    placeholder={props?.placeholder}
                />
            </FormControl>
        </Box>
    );
}