/* eslint-disable no-unused-vars */
import { Card, CardContent, Typography } from '@mui/material'
import React, { useState, useRef, useEffect } from 'react'
import List from '../../components/todo/ListTodo'
import Input from '../../components/todo/CreateTodo'
import Modal from '../../components/shared/Modal'
import axios from 'axios'
import { getAllTodos } from '../../utils/todo.utils'
import api from '../../constants/api'
import { Container } from './styles'
import DeleteTodo from '../../components/todo/DeleteTodo'
import UpdateTodo from '../../components/todo/UpdateTodo'



const Todo = () => {
  const [todos, setTodos] = useState([])
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalType, setModalType] = useState('');
  let selectedTodoId = useRef('')
  const [time, setTime] = useState('');

  useEffect(() => {
    const fetchTimeRequest = async () => {
      try {
        const res = await axios.get(api.TIME);
        const data = res.data;
        setTime(data.datetime);
      } catch (err) {
        console.log(err);
      }
    };
    
    fetchTodoRequest();
    fetchTimeRequest();
  }, [])
  const fetchTodoRequest = async () => {
    try {
      const data = await getAllTodos();
      const sortedData = sortTodos(data)
      setTodos(sortedData);
    } catch (err) {
      console.log(err);
    }
  };


  const sortTodos = (arr) => {
    return arr.sort((x,y) => (x.done === y.done)? 0 : x.done? 1 : -1 )
  }
  const handleSubmit = (title, done) => {
    const newTodo = {
      _id: new Date(),
      title,
      done,
      date: new Date(),
      priority: 1,
      userId: "6184f82b6a22c9027e4a324d",
    }
    setTodos([newTodo, ...todos])
  }

  const handleChangeDone = (done, id) => {
    let newTodos = todos.map((todo) => {
      if(todo._id === id) {
        todo.done = done
      }
      return todo
    })
    newTodos =  sortTodos(newTodos)
    setTodos([...newTodos])
  }

  const handleChangeTitle = (title) => {
    const newTodos = todos.map((todo) => {
      if(todo._id === selectedTodoId.current) {
        todo.title = title
      }
      return todo
    })
    setTodos([...newTodos])
  }

  const handleDeleteTodo= () => {
    const newTodos = todos.filter((todo) => 
      todo._id !== selectedTodoId.current
    )
    setTodos([...newTodos])
  }

  const onToggleModal = (id, type) => {
    selectedTodoId.current = id
    setModalType(type)
    setIsOpenModal(true);
  }
  return (
    <Container>
      <Card sx={{ minWidth: 600 }}>
        <CardContent>
          <Typography gutterBottom variant="p" component="div">
            Time: {time}
          </Typography>
          <Typography gutterBottom variant="h5" component="div">
          TODO LIST
          </Typography>
          <Input handleSubmit={handleSubmit}/>
          <List handleChangeDone={handleChangeDone} todos={todos} onToggleModal={onToggleModal}/>
        </CardContent>
      </Card>
      <Modal 
        selectedTodoId={selectedTodoId.current}
        isOpenModal={isOpenModal} 
        modalType={modalType} 
        onCloseModal={() => setIsOpenModal(false)}
        handleChangeTitle={handleChangeTitle}
        handleDeleteTodo={handleDeleteTodo}>
        {modalType === 'delete' ? 
          <DeleteTodo handleClose={() => setIsOpenModal(false)} onClick={handleDeleteTodo} id={selectedTodoId.current}/> :
          <UpdateTodo handleClose={() => setIsOpenModal(false)} onClick={handleChangeTitle} id={selectedTodoId.current}/>
        }
      </Modal>
    </Container>

  )
}

export default Todo
