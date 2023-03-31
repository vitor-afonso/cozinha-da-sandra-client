import InfoIcon from '@mui/icons-material/Info';
import { Tooltip, Zoom } from '@mui/material';
import { componentProps } from '../utils/app.styleClasses';

const TooltipDeliveryFee = () => {
  return (
    <Tooltip title='Este valor pode variar consoante local de entrega.' placement='top-start' enterDelay={200} leaveDelay={200} TransitionComponent={Zoom} arrow>
      <InfoIcon color={componentProps.color.primary} fontSize={componentProps.fontSize.inherit} />
    </Tooltip>
  );
};

export default TooltipDeliveryFee;
