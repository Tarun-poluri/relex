import { loginSuccess, loginFailure, setLoading } from '@/store/reducers/authReducer';
import { AppDispatch } from '@/store/store';
import { LOGIN_CREDENTIALS } from '@/data/login-details';

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const login = ({ email, password, rememberMe }: LoginCredentials) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));

  try {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === LOGIN_CREDENTIALS.email && password === LOGIN_CREDENTIALS.password) {
      const user = { email };

      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("user", JSON.stringify(user));
      }

      dispatch(loginSuccess(user));
      return { success: true, user };
    } else {
      const errorMessage = "Invalid email or password. Please try again.";
      dispatch(loginFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  } catch (error: any) {
    const errorMessage = error.message || "Login failed due to network error.";
    dispatch(loginFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const logout = () => (dispatch: AppDispatch) => {
  localStorage.removeItem("user");
  sessionStorage.removeItem("user");
  dispatch(loginFailure(null));
};
