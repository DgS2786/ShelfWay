import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { useTheme } from '../../Resources/ThemeProvider'; // Ajusta la ruta si es diferente

export default function TutorialDialog({ visible, onDismiss }) {
  const [step, setStep] = React.useState(1);
  const { theme } = useTheme(); // Obtenemos tema actual del contexto

  const steps = [
    {
      title: '¡Bienvenido!',
      text: 'Esta es tu pantalla principal. Aquí podrás acceder a todas las funciones.',
    },
    {
      title: 'Escáner QR',
      text: 'Escanea el QR del mapa para ubicarte o el código de barras de un producto para más información.',
    },
    {
      title: 'Buscar',
      text: 'Usa la barra superior para buscar productos específicos.',
    },
    {
      title: 'Ofertas',
      text: 'En la sección Ofertas encontrarás promociones en nuestros productos.',
    },
    {
      title: 'Mapa',
      text: 'Consulta dónde se ubica cada producto tras escanear el QR del mapa.',
    },
    {
      title: 'Configuración',
      text: 'Configura y personaliza la app. Puedes revisar alertas o reportar fallos.',
    },
  ];

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      onDismiss();
      setStep(1);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        style={[styles.dialog, { backgroundColor: theme.colors.dialogS }]}
      >
        <Dialog.Title
          style={{ color: theme.colors.text, textAlign: 'center' }}
        >
          {steps[step - 1].title}
        </Dialog.Title>

        <Dialog.Content>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.text, textAlign: 'center' }}
          >
            {steps[step - 1].text}
          </Text>
        </Dialog.Content>

        <Dialog.Actions style={styles.actions}>
          {step > 1 && (
            <Button
              mode="outlined"
              onPress={handlePrev}
              textColor={theme.colors.primary}
            >
              Anterior
            </Button>
          )}
          <Button
            mode="contained"
            onPress={handleNext}
            buttonColor={theme.colors.primary}
            textColor={theme.colors.onPrimary}
          >
            {step < steps.length ? 'Siguiente' : 'Finalizar'}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 20,
    marginHorizontal: 15,
  },
  actions: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
});
