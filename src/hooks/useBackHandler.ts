import { useCallback } from 'react';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

// Intercepte le bouton de retour matériel Android pendant que l'écran est affiché.
// `handler` doit renvoyer `true` s'il a géré le retour (empêche le comportement par défaut).
export const useBackHandler = (handler: () => boolean) => {
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', handler);
      return () => subscription.remove();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handler])
  );
};
