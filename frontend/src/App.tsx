import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from "./components/sign-in.tsx"
import RegisterPage from './components/register.tsx';
import TaskUserPage from './components/task-user.tsx';

function App() {
  

  return (
    <>
   
      <Router>
        <Routes>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path='/sign-in' element={<SignIn/>} />
          <Route path='/user-tasks' element={<TaskUserPage/>}/>
        </Routes>

      </Router>
    
      
      
    </>
  )
}

export default App
