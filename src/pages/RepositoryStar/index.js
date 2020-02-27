import React, {Component} from 'react';
import {Header} from './style';
import {WebView} from 'react-native-webview';

export default class RepositoryStar extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('item').full_name,
  });
  render() {
    const {navigation} = this.props;

    const user = navigation.getParam('item').html_url;

    return (
      <>
        <Header />
        <WebView source={{uri: user}} style={{flex: 1}} />
      </>
    );
  }
}
