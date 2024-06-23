import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Button } from '@mui/material';
import { styled } from '@mui/system';

const CustomAccordionSummary = styled(AccordionSummary)({
    '& .MuiAccordionSummary-expandIconWrapper': {
        transform: 'none', // Prevent rotation
    },
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'none', // Prevent rotation when expanded
    },
});

export default function DropAccordion({ label, content, button }: any) {
    return (
        <Accordion sx={{ background: "#1E293B" }}>
            <CustomAccordionSummary
                expandIcon={
                    <Button color="secondary" variant='contained'
                    sx={{
                        marginRight: 8
                    }}
                    >{button}</Button>
                }
                aria-controls="panel1-content"
                id="panel1-header"
            >
                <div className='w-full text-[#fff] p-8'>
                    {label}
                </div>
            </CustomAccordionSummary>
            <AccordionDetails sx={{ color: "#fff" }}>
                <p className='w-full text-[#fff] p-2'>
                    {content}
                </p>
            </AccordionDetails>
        </Accordion>
    );
}