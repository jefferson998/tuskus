import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import SignIn from "./components/sign-in.tsx";
import RegisterPage from "./components/register.tsx";
import TaskUserPage from "./components/task-user.tsx";
import { CookiesProvider } from "react-cookie";
import { Provider } from 'react-redux';
import store from './_store/index.ts';


function App() {
  return (
    <>
    <Provider store={store}>
    <CookiesProvider>
        <Router>
          <Routes>
          <Route path="/" element={<Navigate to="/sign-in" replace />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/user-tasks" element={<TaskUserPage />} />
          </Routes>
        </Router>
      </CookiesProvider>

    </Provider>
      
    </>
  );
}

export default App;
