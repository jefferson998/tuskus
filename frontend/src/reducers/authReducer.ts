const initialState = {
    loading: false,
    error: null,
    success: null,
    token: null,
  };
  
  const authReducer = (state = initialState, action: any) => {
    switch (action.type) {
      case 'REGISTER_REQUEST':
        return {
          ...state,
          loading: true,
          error: null,
        };
      case 'REGISTER_SUCCESS':
        return {
          ...state,
          loading: false,
          success: action.payload.message,
          token: action.payload.token,
        };
        case 'REGISTER_FAILURE':
            return {
              ...state,
              loading: false,
              error: action.payload, 
            };
      default:
        return state;
    }
  };
  
  export default authReducer;