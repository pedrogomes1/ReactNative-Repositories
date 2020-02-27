import React, {Component} from 'react';

import PropTypes from 'prop-types';
import api from '../../services/api';
import {
  Container,
  Header,
  Name,
  Avatar,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Details,
  TextDetails,
} from './styles';
import {ActivityIndicator} from 'react-native';

export default class User extends Component {
  static navigationOptions = ({navigation}) => ({
    // Como é estático, não posso alterar o titulo simplesmente assim:  title: this.props.navigation.getParam('user').name
    //Eu preciso transformar esse navigationOptions em umam função que vai retornar um objeto .. () => {}
    title: navigation.getParam('user').name,
  });
  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: true,
    page: 1,
  };

  async componentDidMount() {
    this.carregarItens();
  }

  carregarItens = async (page = 1) => {
    const {navigation} = this.props;
    const user = navigation.getParam('user');

    const {stars} = this.state;

    const response = await api.get(`/users/${user.login}/starred`, {
      params: {
        page,
      },
    });

    this.setState({
      stars: [...stars, ...response.data],
      page,
      loading: false,
    });
  };

  loadMore = () => {
    this.setState({loading: true});

    const {page} = this.state;

    const nextPage = page + 1;

    this.carregarItens(nextPage);
    this.setState({loading: false});
  };

  handleNavigate = item => {
    const {navigation} = this.props;
    navigation.navigate('RepositoryStar', {item});
  };

  render() {
    const {navigation} = this.props;
    const {stars, loading} = this.state;

    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{uri: user.avatar}} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Stars
            data={stars}
            keyExtractor={star => String(star.id)}
            onEndReachedThreshold={0.2}
            onEndReached={this.loadMore}
            renderItem={({item}) => (
              <Starred>
                <OwnerAvatar source={{uri: item.owner.avatar_url}} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
                <Details onPress={() => this.handleNavigate(item)}>
                  <TextDetails>Detalhes</TextDetails>
                </Details>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}
