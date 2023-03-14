import { grey } from '@mui/material/colors';

export const orderClasses = {
  container: {
    width: 300,
    backgroundColor: '#E3DDE3',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  infoField: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  addressField: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: '1px solid #CCC',
  },
  editBtn: {
    color: grey[700],
    cursor: 'pointer',
  },
};

export const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  border: '2px solid #816E94',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};
