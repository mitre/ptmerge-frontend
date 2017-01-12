import { renderComponent , expect } from '../test_helper';
import App from '../../src/containers/App';

describe('App' , () => {
  let component;

  beforeEach(() => {
    component = renderComponent(App);
  });

  it('has the correct class', () => {
    expect(component).to.have.class('app');
  });
});
