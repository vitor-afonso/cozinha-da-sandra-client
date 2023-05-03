import { grey } from '@mui/material/colors';
import { maxDays, minDays, APP } from 'utils/app.utils';
import mapImage from 'images/aboutMap.png';
import ownerImage from 'images/aboutChef.jpeg';

export const shopOrderClasses = {
  container: {
    width: 300,
    backgroundColor: '#E3DDE3',
    mx: 'auto',
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

export const addReviewPageClasses = {
  container: {
    px: 3,
    pb: 8,
  },
  form: {
    marginLeft: 'auto',
    marginRight: 'auto',
    minWidth: 300,
    maxWidth: 600,
    mb: 4,
  },
  rating: {
    mb: 2,
    mt: 4,
  },
  ratingError: {
    p: 1,
    outline: '2px solid #d32f2f',
    borderRadius: '3px',
    my: 4,
  },
  formField: {
    marginTop: 0,
    marginBottom: 4,
    display: 'block',
  },
  formTextArea: {
    minWidth: '100%',
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
  },
  heroDescription: {
    fontSize: '16px',
    color: '#031D44',
    maxWidth: '600px',
    minWidth: '250px',
  },
  bottomContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    pt: 3,
    px: 3,
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
    mx: 'auto',
    textAlign: { md: 'left' },
    maxWidth: '600px',
  },
  mapImg: {
    width: '100%',
    height: '450px',
    backgroundImage: `url(${mapImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    maxWidth: '600px',
  },
  social: {
    display: 'flex',
    justifyContent: { xs: 'center', md: 'space-between' },
    flexDirection: { xs: 'column', md: 'row' },
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
    textAlign: 'left',
  },
  terms: {
    padding: 0,
    mb: { xs: 1 },
    alignSelf: { xs: 'start', md: 'center' },
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
    mb: 9,
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
    mb: 9,
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
  },
  formContainer: {
    margin: 0,
  },
  form: {
    mx: 'auto',
    minWidth: 300,
    maxWidth: 600,
  },
  formField: {
    marginTop: 0,
    mb: 2,
    display: 'block',
  },
  nameField: {
    marginTop: 0,
    mb: 2,
    display: 'block',
  },
  formTextArea: {
    minWidth: '100%',
    mb: 2,
  },
};

export const signupClasses = {
  container: {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    justifyContent: 'center',
    alignItems: 'center',
    mt: { md: '10vh' },
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
    px: 3,
    mt: '10vh',
  },
  top: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  image: {
    maxWidth: { xs: '150px', md: '300px' },
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
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    justifyContent: 'center',
    alignItems: 'center',
    mt: { md: '10vh' },
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
  titleField: {
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
    flexDirection: { xs: 'column', md: 'row' },
    justifyContent: { md: 'center' },
    alignItems: { xs: 'center', md: 'start' },
    mt: { md: '10vh' },
    px: 3,
    pt: 3,
  },
  topText: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  image: {
    maxWidth: { xs: '150px', md: '350px' },
    mr: { md: 12 },
  },
  form: {
    width: { xs: '300px', md: '500px' },
  },
  field: {
    marginTop: 0,
    marginBottom: 2,
    display: 'block',
  },
};

export const sendEmailClasses = {
  container: {
    px: 3,
  },
  form: {
    mt: 4,
    mx: 'auto',
    minWidth: 300,
    maxWidth: 600,
  },
  formField: {
    marginTop: 0,
    mb: 2,
    display: 'block',
  },
  formTextArea: {
    minWidth: '100%',
    mb: 2,
  },
};

export const usersClasses = {
  container: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    px: 3,
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

export const layoutStyle = {
  page: {
    width: '100vw',
    height: `calc(100vh - ${APP.navbarHeight})`,
  },

  cartTotalButton: {
    width: '240px',
    height: '60px',
    position: 'fixed',
    marginLeft: '-120px',
    borderRadius: '20px',
    bottom: 76,
    fontSize: '18px',
  },

  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    py: 1,
    px: 3,
    backgroundImage: 'linear-gradient(to bottom right, #b2dfdb, #fff)',
  },
  footerSocial: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '200px',
  },
  footerTerms: {
    flexShrink: 0,
    padding: 0,
    alignSelf: 'center',

    fontSize: 10,
  },
};

export const homeClasses = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    p: 3,
    backgroundImage: 'linear-gradient(to bottom right, #ffe0b2, #b2dfdb)',
    minHeight: { xs: `calc(100vh - ${APP.navbarHeight})`, md: '50vh' },
  },
  heroText: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    pb: 3,
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
    pt: 3,
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
export const reviewsClasses = {
  container: {
    display: 'flex',
    justifyContent: 'end',
    alignItems: 'center',
    /* px: 3, */
    width: '100%',
  },

  reviewsBtn: {
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'end',
    fontWeight: 'bold',
    height: 32,
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
export const termsModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 500,
  maxHeight: '90%',
  bgcolor: 'background.paper',
  border: '2px solid #816E94',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  overflow: 'scroll',
  overflowX: 'hidden',
};
export const reviewsModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 600,
  maxHeight: '90%',
  bgcolor: 'background.paper',
  border: '2px solid #816E94',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  overflow: 'scroll',
  overflowX: 'hidden',
};

export const componentProps = {
  type: {
    button: 'button',
    text: 'text',
    submit: 'submit',
    password: 'password',
    email: 'email',
    number: 'number',
    datetimeLocal: 'datetime-local',
  },
  name: {
    username: 'username',
    email: 'email',
    contact: 'contact',
    password: 'password',
    password2: 'password2',
    title: 'title',
    price: 'price',
    category: 'category',
    description: 'description',
    ingredients: 'ingredients',
    info: 'info',
    deliveryDate: 'deliveryDate',
    deliveryMethod: 'deliveryMethod',
    haveExtraFee: 'haveExtraFee',
    customDeliveryFee: 'customDeliveryFee',
    fullAddress: 'fullAddress',
    addressStreet: 'addressStreet',
    addressCode: 'addressCode',
    addressCity: 'addressCity',
    message: 'message',
    to: 'to',
    subject: 'subject',
    content: 'content',
    rating: 'rating',
  },
  variant: {
    contained: 'contained',
    outlined: 'outlined',
    text: 'text',
    string: 'string',
    filled: 'filled',
    standard: 'standard',
    button: 'button',
    inherit: 'inherit',
    caption: 'caption',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    subtitle1: 'subtitle1',
    subtitle2: 'subtitle2',
    body1: 'body1',
    body2: 'body2',
    overline: 'overline',
  },
  color: {
    inherit: 'inherit',
    primary: 'primary',
    secondary: 'secondary',
    neutral: 'neutral',
    success: 'success',
    error: 'error',
    info: 'info',
    warning: 'warning',
    string: 'string',
    textSecondary: 'text.secondary',
  },
  fontSize: {
    inherit: 'inherit',
    large: 'large',
    medium: 'medium',
    small: 'small',
    string: 'string',
  },
  size: {
    small: 'small',
    medium: 'medium',
    large: 'large',
    string: 'string',
  },
};
