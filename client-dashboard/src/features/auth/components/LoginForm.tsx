import React, { useEffect, useReducer } from "react";
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

const initialState = {
  domain: "",
  username: "",
  password: "",
  rememberMe: false,
  showPassword: false,
  domains: {} as Record<string, string>,
  loading: true,
  error: null as string | null,
};

type Action =
  | { type: "SET_FIELD"; field: string; value: string | boolean }
  | { type: "SET_DOMAINS"; domains: Record<string, string> }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "SET_LOADING"; loading: boolean };

const reducer = (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_DOMAINS":
      return {
        ...state,
        domains: action.domains,
        domain: Object.keys(action.domains)[0] || "",
      };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    default:
      return state;
  }
};

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const loadDomains = async () => {
      dispatch({ type: "SET_LOADING", loading: true });
      try {
        const data = await fetchDomains();
        dispatch({ type: "SET_DOMAINS", domains: data });
      } catch (err) {
        dispatch({
          type: "SET_ERROR",
          error: `Ошибка загрузки доменов: ${err}`,
        });
      } finally {
        dispatch({ type: "SET_LOADING", loading: false });
      }
    };

    loadDomains();
  }, []);

  const handleChange = (field: string, value: string | boolean) => {
    dispatch({ type: "SET_FIELD", field, value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      domain: state.domain,
      username: state.username,
      password: state.password,
      rememberMe: state.rememberMe,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Выбор домена */}
      <FormControl fullWidth margin="normal" disabled={state.loading}>
        <InputLabel id="domain-label">Домен</InputLabel>
        {state.loading ? (
          <CircularProgress size={24} />
        ) : (
          <Select
            labelId="domain-label"
            value={state.domain}
            onChange={(e) => handleChange("domain", e.target.value)}
            label="Домен"
          >
            {Object.entries(state.domains).map(([key, label]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </Select>
        )}
      </FormControl>

      {/* Ошибка загрузки доменов */}
      {state.error && <p style={{ color: "red" }}>{state.error}</p>}

      {/* Поле логина */}
      <TextField
        fullWidth
        margin="normal"
        label="Логин"
        value={state.username}
        onChange={(e) => handleChange("username", e.target.value)}
      />

      {/* Поле пароля с "глазиком" */}
      <TextField
        fullWidth
        margin="normal"
        label="Пароль"
        type={state.showPassword ? "text" : "password"}
        value={state.password}
        onChange={(e) => handleChange("password", e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() =>
                  handleChange("showPassword", !state.showPassword)
                }
                edge="end"
              >
                {state.showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Чекбокс "Запомнить меня" */}
      <FormControlLabel
        control={
          <Checkbox
            checked={state.rememberMe}
            onChange={(e) => handleChange("rememberMe", e.target.checked)}
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
