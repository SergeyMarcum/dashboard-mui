import { useEffect, useState } from "react";
import { Box, Snackbar, Typography } from "@mui/material";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import LoginForm, {
  LoginFormData,
} from "../features/auth/components/LoginForm";

const Login = () => {
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const handleLogin = async (data: LoginFormData) => {
    console.log("Login.tsx -> handleLogin полученные данные:", data);
    try {
      await login(data.username, data.password, data.domain);

      localStorage.setItem("domain", data.domain);
      if (data.rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      navigate("/dashboard");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Неизвестная ошибка авторизации.");
      }
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
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage("")}
        message={errorMessage}
      />
    </Box>
  );
};

export default Login;
