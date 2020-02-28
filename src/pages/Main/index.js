/* eslint-disable react/no-did-mount-set-state */
import React, {Component} from 'react';
import {
  Container,
  SubmitButton,
  Form,
  Input,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
  Loading,
  DeleteButton,
} from './styles';
import PropTypes from 'prop-types';
import api from '../../services/api';
import AsyncStorage from '@react-native-community/async-storage';
import {Keyboard, ActivityIndicator, Alert} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

export default class Main extends Component {
  static navigationOptions = {
    title: 'Usuários',
  };

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    newUser: '',
    users: [],
  };

  async componentDidMount() {
    const users = await AsyncStorage.getItem('users');
    if (users) {
      this.setState({users: JSON.parse(users)});
    }
  }

  componentDidUpdate(_, prevState) {
    const {users} = this.state;

    if (prevState.users !== users) {
      AsyncStorage.setItem('users', JSON.stringify(users));
    }
  }
  handleSubmit = async nameUser => {
    console.tron.log(this.state.users);
    const {users, newUser} = this.state;

    const response = await api.get(`/users/${newUser}`);

    const findUsers = users.findIndex(user => user.login === nameUser);
    console.tron.log(findUsers);
    if (!(findUsers >= 0)) {
      const data = {
        name: response.data.name,
        login: response.data.login,
        bio: response.data.bio,
        avatar: response.data.avatar_url,
      };
      this.setState({users: [...users, data], newUser: ''});

      Keyboard.dismiss(); //Quando digitiar o usuário o teclado some
    } else {
      return Alert.alert(`O usuário ${nameUser} já foi adicionado!`);
    }
  };

  handleNavigate = user => {
    const {navigation} = this.props;

    navigation.navigate('User', {user});
  };

  deleteRepository = name => {
    const {users} = this.state;

    //Preciso criar uma cópia do array do estado, não posso alterar diretamente o original (imutabilidade)
    var arrayUsers = [...users];
    const verifyUser = arrayUsers.findIndex(user => user.name === name);

    //Retorna 0 se for true, ou seja, se for o usuario selecionado
    if (verifyUser !== -1) {
      arrayUsers.splice(verifyUser, 1);
      this.setState({users: arrayUsers});
    }

    console.tron.log('users', users);
  };

  render() {
    const {newUser, users, loading} = this.state;

    return (
      <Container>
        <Form>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Adicionar usuário"
            value={newUser}
            onChangeText={text => this.setState({newUser: text})}
            returnKeyType="send" //Mudo o return do teclado do mobile lá em baixo para send p quando clicar ele tb adicionar, não precisar ir no botão
            onSubmitEditing={this.handleSubmit} //Quando clicar no botão send do teclado ele chama a função tb
          />

          <SubmitButton
            onPress={() => this.handleSubmit(newUser)}
            loading={loading}>
            {loading ? (
              <ActivityIndicator color="fff" />
            ) : (
              <Icon name="add" size={20} color="#fff" />
            )}
          </SubmitButton>
        </Form>

        {loading ? (
          <Loading />
        ) : (
          <List
            data={users} //Onde vão estar os dados dessa minha lista, precisa ser um array
            keyExtractor={user => String(user.name)}
            renderItem={(
              {item}, //Esse item desestruturado é do user
            ) => (
              <>
                <User>
                  <DeleteButton
                    onPress={() => this.deleteRepository(item.name)}>
                    <Icon name="delete" size={30} color="#FF0000" />
                  </DeleteButton>
                  <Avatar source={{uri: item.avatar}} />
                  <Name>{item.name}</Name>
                  <Bio>{item.bio}</Bio>

                  <ProfileButton onPress={() => this.handleNavigate(item)}>
                    <ProfileButtonText>Ver perfil</ProfileButtonText>
                  </ProfileButton>
                </User>
              </>
            )}
          />
        )}
      </Container>
    );
  }
}
