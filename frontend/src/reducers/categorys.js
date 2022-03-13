const categorysReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_CATEGORYS':
      return action.categorys;
    default:
      return state;
  }
};

export default categorysReducer;
