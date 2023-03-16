import InfoIcon from '@mui/icons-material/Info';
import { Tooltip, Zoom } from '@mui/material';

const TooltipDeliveryFee = () => {
  return (
    <Tooltip title='Este valor pode variar consoante local de entrega.' placement='top-start' enterDelay={200} leaveDelay={200} TransitionComponent={Zoom} arrow>
      <InfoIcon color='primary' fontSize='inherit' />
    </Tooltip>
  );
};

export default TooltipDeliveryFee;
