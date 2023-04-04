import React from 'react';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Modal, Typography } from '@mui/material';
import { componentProps, termsModalStyle } from '../utils/app.styleClasses';
import { APP, capitalizeAppName } from '../utils/app.utils';

const TermsModal = ({ isModalOpen, setIsModalOpen, conditionsAccepted, setConditionsAccepted }) => {
  const handleConditions = () => {
    if (conditionsAccepted) {
      setIsModalOpen(false);
    }
  };
  return (
    <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <Box sx={termsModalStyle}>
        <Typography variant={componentProps.variant.h5} sx={{ mb: 2 }}>
          Termos e Condições
        </Typography>
        <Typography variant={componentProps.variant.body1}>
          Na {capitalizeAppName()}, valorizamos a sua privacidade e estamos empenhados em proteger as suas informações pessoais. Esta política de privacidade explica como recolhemos, usamos e
          divulgamos as suas informações quando você visita a nossa loja ou usa os nossos serviços.
        </Typography>
        <Typography variant={componentProps.variant.h6} sx={{ alignSelf: 'start', my: 1 }}>
          Informações que recolhemos
        </Typography>
        <Typography variant={componentProps.variant.body1}>Quando você visita a nossa loja ou usa nossos serviços, podemos recolher as seguintes informações:</Typography>
        <ul>
          <li>Informações pessoais, como seu nome, endereço, número de telefone e endereço de e-mail, quando você cria uma conta, faz um pedido ou entra em contacto connosco.</li>
          <li>Informações de pagamento, como o número do seu cartão de crédito, quando você faz uma compra.</li>
          <li>Informações sobre o uso de nossa loja, como endereço IP, tipo de navegador e sistema operacional.</li>
        </ul>
        <Typography variant={componentProps.variant.h6} sx={{ alignSelf: 'start' }}>
          Como usamos suas informações
        </Typography>
        <Typography variant={componentProps.variant.body1}>
          Usamos as suas informações para fornecer e melhorar nossos serviços, para processar e atender os seus pedidos e para comunicarmo-nos com você sobre nossa loja e promoções. Também podemos
          usar suas informações para personalizar sua experiência de compra e entender melhor os nossos clientes.
        </Typography>
        <Typography variant={componentProps.variant.h6} sx={{ alignSelf: 'start', mt: 1 }}>
          Compartilhamento e divulgação de informações
        </Typography>
        <Typography variant={componentProps.variant.body1}>
          Podemos compartilhar suas informações com prestadores de serviços terceirizados que nos ajudam a operar a nossa loja e fornecer os nossos serviços. Esses prestadores de serviços podem
          incluir processadores de pagamento, prestadores de envio e parceiros de marketing. Também podemos compartilhar suas informações com as forças de segurança e outros se formos obrigados a
          fazê-lo por lei, se acreditarmos que tal acção é necessária para cumprir a lei, proteger nossos direitos, evitar fraudes ou abusos.
        </Typography>
        <Typography variant={componentProps.variant.h6} sx={{ alignSelf: 'start', mt: 1 }}>
          As suas escolhas
        </Typography>
        <Typography variant={componentProps.variant.body1}>
          Você pode optar por não nos fornecer determinadas informações, mas isso pode limitar a possibilidade de usar alguns dos nossos serviços. Você também pode optar por não receber nossas
          comunicações promocionais seguindo as instruções de cancelamento incluídas nos nossos e-mails.
        </Typography>
        <Typography variant={componentProps.variant.h6} sx={{ alignSelf: 'start', mt: 1 }}>
          Segurança
        </Typography>
        <Typography variant={componentProps.variant.body1}>
          Tomamos medidas razoáveis para proteger suas informações contra acesso, uso e divulgação não autorizados. Utilizamos servidores seguros e encriptação SSL para proteger os seus dados e
          garantir a segurança dos nossos serviços.
        </Typography>
        <Typography variant={componentProps.variant.h6} sx={{ alignSelf: 'start', mt: 1 }}>
          Alterações a esta Política de Privacidade
        </Typography>
        <Typography variant={componentProps.variant.body1}>
          Podemos atualizar esta política de privacidade de tempos em tempos para refletir mudanças nas nossas práticas ou por outros motivos operacionais, legais ou regulatórios. Iremos notificá-lo
          sobre quaisquer alterações publicando a política atualizada em nosso site ou por outros meios.
        </Typography>
        <Typography variant={componentProps.variant.h6} sx={{ alignSelf: 'start', mt: 1 }}>
          Contacte-nos
        </Typography>
        <Typography variant={componentProps.variant.body1}>
          Se você tiver alguma dúvida ou preocupação sobre esta política de privacidade ou sobre as nossas práticas, entre em contato connosco através do email {APP.email}.
        </Typography>
        <Typography variant={componentProps.variant.body1} sx={{ alignSelf: 'start', mt: 1 }}>
          Data Efectiva: {APP.dataInicioActividade}
        </Typography>

        <FormGroup>
          <FormControlLabel
            control={<Checkbox color={componentProps.color.primary} checked={conditionsAccepted} onChange={() => setConditionsAccepted(!conditionsAccepted)} />}
            label='Li e aceito os termos e condições.'
            sx={{ my: 2 }}
          />
        </FormGroup>

        <Button type={componentProps.type.button} color={componentProps.color.primary} variant={componentProps.variant.contained} onClick={handleConditions}>
          Continuar
        </Button>
      </Box>
    </Modal>
  );
};

export default TermsModal;
