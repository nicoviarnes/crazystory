import axios from '../axios-config';
import { categorysSelector } from '../selectors';

export const setCategorys = (categorys) => ({
  type: 'SET_CATEGORYS',
  categorys,
});

export const getCategorys = () => async (dispatch) => {
  try {
    dispatch({ type: 'GET_CATEGORYS_REQUEST' });
    const response = await axios.get('/categorys');
    dispatch(setCategorys(response.data));
    dispatch({ type: 'GET_CATEGORYS_SUCCESS' });
  } catch (e) {
    dispatch({
      type: 'GET_CATEGORYS_FAILURE',
      message: e.message,
      response: e.response,
    });
  }
};

export const createCategory = (name, description) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({ type: 'CREATE_CATEGORY_REQUEST' });
    const response = await axios.post('/categorys', { name, description });
    dispatch(
      setCategorys(categorysSelector(getState()).concat(response.data))
    );
    dispatch({ type: 'CREATE_CATEGORY_SUCCESS' });
    return response.data;
  } catch (e) {
    dispatch({
      type: 'CREATE_CATEGORY_FAILURE',
      message: e.message,
      response: e.response,
    });
  }
};
