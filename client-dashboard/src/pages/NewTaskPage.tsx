import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import api from "../api/axios";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Определение типов данных
interface ObjectType {
  id: string;
  name: string;
}

interface OperatorType {
  id: string;
  name: string;
}

interface ParameterType {
  id: string;
  name: string;
}

interface HistoryType {
  id: string;
  date: string;
  operator: string;
}

// Валидация формы
const schema = z.object({
  objectName: z.string().min(1, "Выберите объект"),
  operator: z.string().min(1, "Выберите оператора"),
  date: z.string().min(1, "Введите дату"),
  time: z.string().min(1, "Введите время"),
  comment: z.string().optional(),
  parameters: z.array(z.string()).optional(),
});

const NewTaskPage = () => {
  const { control, handleSubmit, watch, register } = useForm<{
    objectName: string;
    operator: string;
    date: string;
    time: string;
    comment?: string;
    parameters?: string[];
  }>({
    resolver: zodResolver(schema),
    defaultValues: {
      objectName: "",
      operator: "",
      date: "",
      time: "",
      comment: "",
      parameters: [],
    },
  });

  const [objects, setObjects] = useState<ObjectType[]>([]);
  const [operators, setOperators] = useState<OperatorType[]>([]);
  const [parameters, setParameters] = useState<ParameterType[]>([]);
  const [history, setHistory] = useState<HistoryType[]>([]);
  const [isRepeatCheck, setIsRepeatCheck] = useState(false);

  useEffect(() => {
    api.get("/all-domain-objects").then(({ data }) => setObjects(data));
    api.get("/users-show-operators").then(({ data }) => setOperators(data));
    api.get("/object-type-parameters").then(({ data }) => setParameters(data));
    api.get("/all-tasks").then(({ data }) => setHistory(data));
  }, []);

  const onSubmit = (data: {
    objectName: string;
    operator: string;
    date: string;
    time: string;
    comment?: string;
    parameters?: string[];
  }) => {
    console.log("Отправка данных:", data);
    api.post("/add-new-task", data).then(() => alert("Задание добавлено!"));
  };

  return (
    <Box p={3}>
      <Typography variant="h4">Новое задание</Typography>
      <Typography variant="body2">
        Добавление нового задания по проверке объекта филиала.
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Наименование объекта</InputLabel>
          <Controller
            name="objectName"
            control={control}
            render={({ field }) => (
              <Select {...field}>
                {objects.map((obj) => (
                  <MenuItem key={obj.id} value={obj.name}>
                    {obj.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
        <Checkbox
          checked={isRepeatCheck}
          onChange={() => setIsRepeatCheck(!isRepeatCheck)}
        />{" "}
        Повторная проверка
        {isRepeatCheck && (
          <TextField
            label="Дата последней проверки"
            fullWidth
            margin="normal"
          />
        )}
        <TextField
          label="Дата проверки"
          fullWidth
          margin="normal"
          {...register("date")}
        />
        <TextField
          label="Время проверки"
          fullWidth
          margin="normal"
          {...register("time")}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Оператор</InputLabel>
          <Controller
            name="operator"
            control={control}
            render={({ field }) => (
              <Select {...field}>
                {operators.map((op) => (
                  <MenuItem key={op.id} value={op.name}>
                    {op.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
        <Typography variant="h6" mt={3}>
          Параметры проверки
        </Typography>
        {parameters.map((param) => (
          <Box key={param.id} display="flex" alignItems="center">
            <Checkbox {...register("parameters")} value={param.name} />
            <Typography>{param.name}</Typography>
          </Box>
        ))}
        <Typography variant="h6" mt={3}>
          История проверок
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Дата проверки</TableCell>
              <TableCell>Оператор</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.operator}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TextField
          label="Комментарий"
          fullWidth
          margin="normal"
          multiline
          rows={3}
          {...register("comment")}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!watch("objectName") || !watch("operator")}
        >
          Сохранить
        </Button>
      </form>
    </Box>
  );
};

export default NewTaskPage;
