import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSelector } from 'react-redux';

export default function AccordionMui({ title, description }: any) {

  const isSelectedEnglish = !(useSelector((state: any) => state?.user?.isSelectedUrdu))

  return (
    <>
      <Accordion sx={{
        background: "#1E293B"
      }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <p className={`w-full text-[#fff] ${isSelectedEnglish ? "p-2" : "p-4 text-right"}`}>
            {title}
          </p>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            color: "#fff"
          }}
        >
          <p className={`w-full text-[#fff] p-2 ${!isSelectedEnglish ? "leading-[48px] text-right" : ""}`}>
            {description}
          </p>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
