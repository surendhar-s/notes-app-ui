import React from 'react';
import { shallow } from 'enzyme';
import Notes from './Notes';

describe('<Notes />', () => {
  test('renders', () => {
    const wrapper = shallow(<Notes />);
    expect(wrapper).toMatchSnapshot();
  });
});
