import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "../store/authStore";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  username: z.string().min(3, "Минимум 3 символа"),
  password: z.string().min(6, "Минимум 6 символов"),
});

const Login = () => {
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: { username: string; password: string }) => {
    await login(data.username, data.password);
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          {...register("username")}
          label="Логин"
          fullWidth
          error={!!errors.username}
          helperText={errors.username?.message}
          sx={{ mb: 2 }}
        />
        <TextField
          {...register("password")}
          label="Пароль"
          type="password"
          fullWidth
          error={!!errors.password}
          helperText={errors.password?.message}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" fullWidth>
          Войти
        </Button>
      </form>
    </Box>
  );
};

export default Login;
