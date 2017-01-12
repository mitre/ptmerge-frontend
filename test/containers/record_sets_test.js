import { renderComponent , expect } from '../test_helper';
import RecordSets from '../../src/containers/RecordSets';

describe('Record Sets' , () => {
  let component;

  beforeEach(() => {
    component = renderComponent(RecordSets);
  });

  it('has the correct class', () => {
    expect(component).to.have.class('record-sets');
  });
});
