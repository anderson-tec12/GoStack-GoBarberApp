// eslint-disable-next-line
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Dashboard from '../pages/Dashboard';
import AppointmentCreate from '../pages/AppointmentCreate';
import CreateAppointment from '../pages/CreateAppointment';
import Profile from '../pages/Profile';

const App = createStackNavigator();

const AuthRoutes: React.FC = () => {
  return (
    <App.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#312e38' },
      }}
    >
      <App.Screen name="Dashboard" component={Dashboard} />
      <App.Screen name="AppointmentCreate" component={AppointmentCreate} />
      <App.Screen name="CreateAppointment" component={CreateAppointment} />

      <App.Screen name="Profile" component={Profile} />
    </App.Navigator>
  );
};

export default AuthRoutes;
