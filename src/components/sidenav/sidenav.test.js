import React from 'react';
import { shallow } from 'enzyme';
import Sidenav from './sidenav';

describe('<Sidenav />', () => {
  test('renders', () => {
    const wrapper = shallow(<Sidenav />);
    expect(wrapper).toMatchSnapshot();
  });
});
