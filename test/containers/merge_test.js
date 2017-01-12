import { renderComponent , expect } from '../test_helper';
import Merge from '../../src/containers/Merge';

describe('Merge' , () => {
  let component;

  beforeEach(() => {
    component = renderComponent(Merge);
  });

  it('has the correct class', () => {
    expect(component).to.have.class('merge');
  });
});
