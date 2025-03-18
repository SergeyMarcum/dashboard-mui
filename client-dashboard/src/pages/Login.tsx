import { useEffect, useReducer } from "react";
import { Box, Snackbar, Typography } from "@mui/material";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import LoginForm, {
  LoginFormData,
} from "../features/auth/components/LoginForm";

const initialState = {
  errorMessage: "",
};

type Action = { type: "SET_ERROR"; error: string };

const reducer = (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case "SET_ERROR":
      return { ...state, errorMessage: action.error };
    default:
      return state;
  }
};

const Login = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const handleLogin = async (data: LoginFormData) => {
    console.log("Login.tsx -> handleLogin полученные данные:", data);
    try {
      await login(data.username, data.password, data.domain);
      navigate("/dashboard");
    } catch (error: unknown) {
      dispatch({
        type: "SET_ERROR",
        error:
          error instanceof Error
            ? error.message
            : "Неизвестная ошибка авторизации.",
      });
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 5,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" mb={2}>
        Вход
      </Typography>
      <LoginForm onSubmit={handleLogin} />
      <Snackbar
        open={!!state.errorMessage}
        autoHideDuration={6000}
        onClose={() => dispatch({ type: "SET_ERROR", error: "" })}
        message={state.errorMessage}
      />
    </Box>
  );
};

export default Login;
