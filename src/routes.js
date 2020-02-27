import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import Main from './pages/Main/index';
import User from './pages/User/index';
import RepositoryStar from './pages/RepositoryStar/index';

const Routes = createAppContainer(
  createStackNavigator(
    {
      Main,
      User,
      RepositoryStar,
    },
    {
      defaultNavigationOptions: {
        headerTitleAlign: 'center', //Centraliza o menu
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: '#7159c1',
        },
        headerTintColor: '#fff',
      },
    },
  ),
);

export default Routes;
