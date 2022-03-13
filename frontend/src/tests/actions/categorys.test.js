import { setCategorys } from '../../actions/categorys';
import { categorys } from '../fixtures/categorys';

it('should create set categorys action', () => {
  const action = setCategorys(categorys);
  expect(action).toEqual({
    type: 'SET_CATEGORYS',
    categorys,
  });
});
