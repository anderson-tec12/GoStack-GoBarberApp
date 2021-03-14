import React, { useCallback, useRef } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import {
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';

import * as Yup from 'yup';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import { useNavigation } from '@react-navigation/native';

// contextAPi
import { useAuth } from '../../hooks/auth';

import getValidation from '../../utils/getValidationErrors';
import api from '../../services/api';

import Input from '../../components/Input';
import Button from '../../components/Button';

import LogoImg from '../../assets/logo.png';
import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreatAcountButton,
  CreatAcountButtonText,
} from './styles';

interface SignFormData {
  email: string;
  password: string;
}
const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const navigation = useNavigation();
  const { signIn, user } = useAuth();

  console.log(user);

  const handlerSignIn = useCallback(async (data: SignFormData): Promise<
    void
  > => {
    try {
      console.log('entro');
      formRef.current?.setErrors({});
      // validar um objeto inteiro
      const schema = Yup.object().shape({
        email: Yup.string().required('Email obrigatório'),
        password: Yup.string().required('Senha obrigatório'),
      });
      await schema.validate(data, {
        abortEarly: false,
      });

      await signIn({
        email: data.email,
        password: data.password,
      });
    } catch (err) {
      console.log(err);

      if (err instanceof Yup.ValidationError) {
        const erros = getValidation(err);
        formRef.current?.setErrors(erros);
        return;
      }

      Alert.alert(
        'Erro na autenticação',
        'Ocorreu um erro ao fazer login, cheque a credencias',
      );
    }
  }, []);

  // const handlerSubmit = useCallback(async (data: SignFormData): Promise<
  //   void
  // > => {},
  // []);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        enabled
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <Image source={LogoImg} />
            <View>
              <Title>Faça seu logon</Title>
            </View>

            {/* <Form ref={formRef} onSubmit={handlerSignIn}> */}
            <Form
              style={{ width: '100%' }}
              ref={formRef}
              onSubmit={handlerSignIn}
            >
              <Input
                name="email"
                icon="mail"
                placeholder="E-mail"
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus();
                }}
              />
              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />
              <Button
                onPress={() => {
                  formRef.current?.submitForm();
                }}
              >
                Entrar
              </Button>
            </Form>

            <ForgotPassword
              onPress={() => {
                console.log('Esqueci minha senha precionado');
              }}
            >
              <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <CreatAcountButton
        onPress={() => {
          navigation.navigate('SignUp');
        }}
      >
        <Icon name="log-in" size={20} color="#ff9000" />
        <CreatAcountButtonText>Criar uma conta</CreatAcountButtonText>
      </CreatAcountButton>
    </>
  );
};

export default SignIn;
