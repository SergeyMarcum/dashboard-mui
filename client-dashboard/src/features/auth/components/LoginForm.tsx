import React, { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { fetchDomains } from "../api"; // Импортируем функцию для загрузки доменов

export interface LoginFormData {
  domain: string;
  username: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [domain, setDomain] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [domains, setDomains] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDomains = async () => {
      try {
        const data = await fetchDomains();
        setDomains(data);
        const firstDomain = Object.keys(data)[0] || "";
        setDomain(firstDomain); // Устанавливаем первый домен по умолчанию
      } catch (err) {
        setError(`Не удалось загрузить список доменов: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    loadDomains();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ domain, username, password, rememberMe });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Выбор домена */}
      <FormControl fullWidth margin="normal" disabled={loading}>
        <InputLabel id="domain-label">Домен</InputLabel>
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <Select
            labelId="domain-label"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            label="Домен"
          >
            {Object.entries(domains).map(([key, label]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </Select>
        )}
      </FormControl>

      {/* Ошибка загрузки доменов */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Поле логина */}
      <TextField
        fullWidth
        margin="normal"
        label="Логин"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      {/* Поле пароля с "глазиком" */}
      <TextField
        fullWidth
        margin="normal"
        label="Пароль"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Чекбокс "Запомнить меня" */}
      <FormControlLabel
        control={
          <Checkbox
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
        }
        label="Запомнить меня"
      />

      {/* Кнопка "Войти" */}
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Войти
      </Button>
    </form>
  );
};

export default LoginForm;
