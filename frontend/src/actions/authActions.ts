import axios from 'axios';
import { URL_API } from '../config';

export const registerUser = (userData: any) => async (dispatch: any) => {
    try {
      dispatch({ type: 'REGISTER_REQUEST' });
      
      
      const response = await axios.post(`${URL_API}/api/auth/register`, userData);
      
  
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: {
          message: response.data.message, 
          token: response.data.token,
        },
      });
  
      return response.data.token;
    } catch (error: any) {
      console.error("Registration error:", error);          
      const errorMessage =
      error.response.data.message[0] || 
        error.message || 
        'Error al registrar';
  
      dispatch({
        type: 'REGISTER_FAILURE',
        payload: errorMessage,
      });
    }
  };