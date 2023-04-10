import * as MUIcon from "@mui/icons-material";
import { Button, IconButton, TextField, Typography } from '@mui/material';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface IconProps {
  icon?: keyof typeof MUIcon;
}

const IconComp: React.FC<IconProps> = ({
  icon,
}) => {
  const Icon = icon && MUIcon[icon];
  return (<>{Icon && <Icon />}</>);
};

interface Todo {
  id: string;
  title: string;
  iconName: string;
}

function useLocalStorage<T>(key: string): [T[], (data: T[]) => void] {
  const [_data, _setData] = useState<T[]>([]);

  useEffect(() => {
    _setData(JSON.parse(localStorage.getItem(key) || '[]'));
  }, [key]);

  function setData(data: T[]) {
    localStorage.setItem(key, JSON.stringify(data));
    _setData(data);
  }

  return [_data, setData];
}

export default function Home() {
  const [todos, setTodos] = useLocalStorage<Todo>('qid_todos');

  async function handleAdd(newTodo: string) {
    const { iconName } = await (await fetch(`/api/iconName?query=the%20best%20icon%20for%20a%20new%20task%20titled%20${newTodo}`)).json();

    const newTodos = [...todos, {
      id: uuidv4(),
      title: newTodo,
      iconName,
    }];
    setTodos(newTodos);
  }

  function handleDelete(todoId: string) {
    const newTodos = todos.filter(todo => todo.id !== todoId);
    setTodos(newTodos);
  }

  return (
    <div className='flex flex-col items-center justify-center mt-40'>
      <Formik
        initialValues={{
          newTodo: '',
        }}
        onSubmit={async ({ newTodo }, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          await handleAdd(newTodo);
          resetForm();
          setSubmitting(false);
        }}
      >
        {({ values, handleChange, handleSubmit }) => (
          <form className="flex flex-row mb-8 w-72 items-center justify-between" onSubmit={handleSubmit}>
            <TextField
              name="newTodo"
              value={values.newTodo}
              onChange={handleChange}
              label="New Todo"
            />
            <Button className="h-14" type="submit" variant="outlined">Add</Button>
          </form>
        )}
      </Formik>
      {todos.map((todo, index) => (
        <div className="flex justify-start items-center p-4 mb-2 w-72 bg-slate-200 rounded-md" key={index}>
          <div className="mr-4">
            <IconComp icon={todo.iconName as keyof typeof MUIcon} />
          </div>
          <Typography variant="body1" fontWeight="bold">{todo.title}</Typography>
          <div className="ml-auto">
            <IconButton onClick={() => handleDelete(todo.id)}>
              <MUIcon.Delete color="warning" />
            </IconButton>
          </div>
        </div>
      ))}
    </div>
  );
}
