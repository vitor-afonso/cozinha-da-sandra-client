import { grey } from '@mui/material/colors';
import { maxDays, minDays, APP } from './app.utils';
import mapImage from '../images/aboutMap.png';
import ownerImage from '../images/aboutChef.jpeg';

export const shopOrderClasses = {
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

export const cartFormClasses = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    mx: 'auto',
    minWidth: 300,
    maxWidth: 600,
  },
  innerForm: {
    width: '100%',
  },
  formField: {
    marginTop: 0,
    marginBottom: 2,
  },

  formTextArea: {
    minWidth: '100%',
    marginBottom: 5,
  },
  notVisible: {
    display: 'none',
  },
  dateProps: {
    min: new Date(+new Date() + minDays).toISOString().slice(0, -8),
    max: new Date(+new Date() + maxDays).toISOString().slice(0, -8),
  },
};

export const editOrderPageClasses = {
  container: {
    px: 3,
    pb: 8,
  },
  list: {
    //minWidth: 300,
  },
  listItem: {
    width: '100%',
    minWidth: 200,
    display: 'flex',
    justifyContent: 'space-between',
  },
  gridItem: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  infoContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: 600,
  },
  infoField: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  deliveryField: {
    display: 'flex',
  },
  addressField: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  formContainer: {
    marginTop: 0,
    marginBottom: 5,
  },
  form: {
    marginLeft: 'auto',
    marginRight: 'auto',
    minWidth: 300,
    maxWidth: 600,
  },
  formField: {
    marginTop: 0,
    marginBottom: 5,
    display: 'block',
  },
  formTextArea: {
    minWidth: '100%',
  },
};

export const editOrderClasses = {
  formContainer: {
    marginTop: 0,
    marginBottom: 1,
  },
  form: {
    marginLeft: 'auto',
    marginRight: 'auto',
    minWidth: 300,
    maxWidth: 600,
  },
  formField: {
    marginTop: 0,
    marginBottom: 2,
    display: 'block',
  },
  formTextArea: {
    minWidth: '100%',
  },
  datePropsUser: {
    min: new Date(+new Date() + minDays).toISOString().slice(0, -8),
    max: new Date(+new Date() + maxDays).toISOString().slice(0, -8),
  },
  datePropsAdmin: {
    min: new Date().toISOString().slice(0, -8),
  },
};

export const cardClasses = {
  avatar: {
    backgroundColor: '#FFF',
    cursor: 'pointer',
  },
  avatarLetter: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  editBtn: {
    color: grey[700],
    cursor: 'pointer',
    mt: 1,
  },
  cardContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export const aboutClasses = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '90vh',
  },
  hero: {
    width: '100%',
    padding: 3,
    backgroundImage: 'linear-gradient(to bottom right, #ffe0b2, #b2dfdb)',
  },
  imgContainer: {
    border: '5px solid #816E94',
    borderRadius: '50%',
    width: '300px',
    height: '300px',
    mx: 'auto',
    mt: { xs: 2, md: 0 },
    backgroundImage: `url(${ownerImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  heroText: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    py: 3,
  },
  heroTitle: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#031D44',
    pb: 2,
    //whiteSpace: 'nowrap',
  },
  heroDescription: {
    fontSize: '16px',
    color: '#031D44',
    maxWidth: '600px',
  },
  bottom: {
    width: '100%',
    display: 'flex',
    justifyContent: { md: 'flex-start', xs: 'center' },
    padding: 3,
  },
  bottomContainer: {
    pt: 3,
    px: 3,
    maxWidth: '600px',
  },
  bottomTitle: {
    fontWeight: 'bold',
    color: '#031D44',
    pb: 2,
    textAlign: { md: 'left' },
  },
  bottomDescription: {
    fontSize: '16px',
    color: '#031D44',
    mb: 3,
    mx: 'auto',
    textAlign: 'left',
  },
  mapImg: {
    width: '100%',
    height: '400px',

    backgroundImage: `url(${mapImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  social: {
    width: '100%',
    py: 1,
    px: 3,
    backgroundImage: 'linear-gradient(to bottom right, #b2dfdb, #fff)',
    alignSelf: 'flex-end',
  },
  socialContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '200px',
  },
  socialTitle: {
    fontWeight: 'bold',
    color: '#031D44',
    pb: 1,
    textAlign: 'left',
  },
};

export const cartClasses = {
  container: {
    px: 3,
    pb: 8,
  },
  itemsContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },

  formContainer: {
    marginTop: 0,
    marginBottom: 5,
  },
  form: {
    marginLeft: 'auto',
    marginRight: 'auto',
    minWidth: 300,
    maxWidth: 600,
  },
  formField: {
    marginTop: 0,
    marginBottom: 5,
    display: 'block',
  },
  formTextArea: {
    minWidth: '100%',
  },

  image: {
    mx: 'auto',
    width: { xs: '200px', md: '300px' },
    marginBottom: 4,
  },
};

export const docesClasses = {
  container: {
    px: 3,
    mb: 12,
  },
  field: {
    minWidth: '300px',
    maxWidth: '600px',
    marginTop: 0,
    marginBottom: 5,
    mx: 'auto',
    display: 'block',
  },
};

export const salgadosClasses = {
  container: {
    px: 3,
    mb: 12,
  },
  field: {
    minWidth: '300px',
    maxWidth: '600px',
    marginTop: 0,
    marginBottom: 5,
    mx: 'auto',
    display: 'block',
  },
};

export const editItemClasses = {
  container: {
    px: 3,
    pb: 8,
  },
  formContainer: {
    marginTop: 0,
  },
  form: {
    marginLeft: 'auto',
    marginRight: 'auto',
    minWidth: 300,
    maxWidth: 600,
  },
  formField: {
    marginTop: 0,
    marginBottom: 5,
    display: 'block',
  },
  nameField: {
    marginTop: 0,
    marginBottom: 2,
    display: 'block',
  },
  formTextArea: {
    minWidth: '100%',
    marginBottom: 5,
  },
};

export const editProfileClasses = {
  container: {
    px: 3,
    pb: 8,
  },
  formContainer: {
    marginTop: 0,
  },
  form: {
    marginLeft: 'auto',
    marginRight: 'auto',
    minWidth: 300,
    maxWidth: 600,
  },
  formField: {
    marginTop: 0,
    marginBottom: 5,
    display: 'block',
  },
  nameField: {
    marginTop: 0,
    marginBottom: 2,
    display: 'block',
  },
  formTextArea: {
    minWidth: '100%',
    marginBottom: 5,
  },
};

export const signupClasses = {
  container: {
    height: `calc(100vh - ${APP.navbarHeight})`,
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    justifyContent: 'center',
    alignItems: 'center',
    py: 5,
  },
  top: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: { md: 4 },
    marginBottom: { md: 6 },
  },
  image: {
    maxWidth: { xs: '200px', md: '450px' },
    order: { xs: 0, md: 1 },
    marginTop: { xs: 4 },
  },
  form: {
    width: { xs: '300px', md: '500px' },
    marginBottom: 4,
  },
  field: {
    marginTop: 0,
    marginBottom: 2,
    display: 'block',
  },
};

export const forgotClasses = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    py: 5,
    height: `calc(100vh - ${APP.navbarHeight})`,
    justifyContent: 'center',
  },
  top: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  image: {
    maxWidth: { xs: '200px', md: '350px' },
  },
  form: {
    width: { xs: '300px', md: '500px' },
  },
  field: {
    marginTop: 2,
    marginBottom: 2,
    display: 'block',
  },
};

export const loginClasses = {
  container: {
    height: `calc(100vh - ${APP.navbarHeight})`,
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    justifyContent: 'center',
    alignItems: 'center',
    py: 5,
  },
  top: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: { md: 4 },
  },
  image: {
    maxWidth: { xs: '200px', md: '450px' },
    transform: 'scaleX(-1)',
    order: { xs: 0, md: 1 },
    marginBottom: { xs: 4 },
    marginTop: { xs: 4 },
  },
  form: {
    width: { xs: '300px', md: '500px' },
  },
  field: {
    marginTop: 2,
    marginBottom: 2,
    display: 'block',
  },
};

export const newItemClasses = {
  container: {
    px: 3,
    pb: 8,
  },
  formContainer: {
    marginTop: 0,
  },
  form: {
    marginLeft: 'auto',
    marginRight: 'auto',
    minWidth: 300,
    maxWidth: 600,
  },
  formField: {
    marginTop: 0,
    marginBottom: 5,
    display: 'block',
  },
  nameField: {
    marginTop: 0,
    marginBottom: 2,
    display: 'block',
  },
  formTextArea: {
    minWidth: '100%',
    marginBottom: 5,
  },
};

export const ordersClasses = {
  breakpoints: {
    default: 4,
    1600: 3,
    1100: 2,
    700: 1,
  },
};

export const profileClasses = {
  container: {
    px: 3,
    pb: 3,
  },
  formContainer: {
    marginTop: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    mx: 'auto',
    minWidth: 300,
    maxWidth: 600,
  },
  formField: {
    marginTop: 0,
    marginBottom: 2,
    display: 'block',
  },
  nameField: {
    marginTop: 0,
    marginBottom: 2,
    display: 'block',
  },
  formTextArea: {
    minWidth: '100%',
    marginBottom: 5,
  },
  ordersNotVisible: {
    display: 'none',
  },
  ordersVisible: {
    //outline: '1px solid red',
  },
  breakpoints: {
    default: 4,
    1600: 3,
    1100: 2,
    700: 1,
  },
};

export const resetClasses = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    py: 5,
  },
  top: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  image: {
    maxWidth: { xs: '250px', md: '450px' },
  },
  form: {
    width: { xs: '300px', md: '500px' },
  },
  field: {
    marginTop: 0,
    marginBottom: 5,
    display: 'block',
  },
};

export const sendEmailClasses = {
  container: {
    px: 3,
    pb: 3,
  },
  formContainer: {
    marginTop: 5,
    marginBottom: 5,
  },
  form: {
    marginLeft: 'auto',
    marginRight: 'auto',
    minWidth: 300,
    maxWidth: 600,
  },
  formField: {
    marginTop: 0,
    marginBottom: 5,
    display: 'block',
  },
  formTextArea: {
    minWidth: '100%',
  },
};

export const usersClasses = {
  container: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    px: 3,
    pb: 6,
  },

  top: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  field: {
    minWidth: '300px',
    maxWidth: '600px',
    marginTop: 0,
    marginBottom: 5,
    display: 'block',
  },
  bottom: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  avatarContainer: {
    width: '100%',
    maxWidth: '600px',
    display: 'flex',
    alignItems: 'center',
    padding: 1,
    backgroundColor: '#E3DDE3',
    cursor: 'pointer',
  },
  deletedAvatarContainer: {
    width: '100%',
    maxWidth: '600px',
    display: 'flex',
    alignItems: 'center',
    padding: 1,
    backgroundColor: '#ddd',
    cursor: 'pointer',
  },
  avatar: {
    width: '40px',
    height: 'auto',
    backgroundColor: '#FFF',
    padding: 1,
    mr: 3,
  },
};

export const homeClasses = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
  },
  hero: {
    width: '100%',
    padding: 3,
    backgroundImage: 'linear-gradient(to bottom right, #ffe0b2, #b2dfdb)',
  },
  heroText: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    py: 3,
  },
  heroTitle: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#031D44',
    pb: 2,
    //whiteSpace: 'nowrap',
  },
  heroDescription: {
    fontSize: '18px',
    color: '#031D44',
    maxWidth: '600px',
  },
  itemsContainer: {
    mt: 3,
    width: '100%',
  },
  docesContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    px: 3,
  },
  salgadosContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    px: 3,
    pb: 6,
  },
  seeMoreBtn: {
    my: 2,
    alignSelf: 'end',
    fontWeight: 'bold',
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
