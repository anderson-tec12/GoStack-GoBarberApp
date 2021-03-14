// eslint-disable-next-line
import React, {useCallback, useMemo} from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';

import {
  Container,
  Title,
  Description,
  OkButton,
  OkButtonText,
} from './styles';

interface IrouteParams {
  date: number;
}

const AppointmentCreate: React.FC = () => {
  const { reset } = useNavigation();
  const { params } = useRoute();

  const routeParams = params as IrouteParams;

  const handlePressOk = useCallback(() => {
    reset({
      routes: [
        {
          name: 'Dashboard',
        },
      ],
      index: 0,
    });
  }, [reset]);

  const formatedDate = useMemo(() => {
    return format(
      routeParams.date,
      "EEEE', dia' dd 'de' MMMM 'de' yyyy 'as' HH:mm'h'",
      {
        locale: ptBr,
      },
    );
  }, [routeParams.date]);
  return (
    <Container>
      <Icon name="check" size={80} color="#04d361" />
      <Title>Agendamento concluido</Title>
      <Description>{formatedDate}</Description>
      <OkButton onPress={handlePressOk}>
        <OkButtonText>OK</OkButtonText>
      </OkButton>
    </Container>
  );
};

export default AppointmentCreate;
