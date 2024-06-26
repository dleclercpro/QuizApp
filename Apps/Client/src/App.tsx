import { Routes, Route, Navigate } from 'react-router-dom';
import './App.scss';
import HomePage from './components/pages/HomePage/HomePage';
import QuizPage from './components/pages/QuizPage/QuizPage';
import ScoresPage from './components/pages/ScoresPage/ScoresPage';
import { DEBUG } from './config';
import AdminPage from './components/pages/AdminPage/AdminPage';
import AuthRoute from './routes/AuthRoute';
import LoadingOverlay from './components/overlays/LoadingOverlay';
import AnswerOverlay from './components/overlays/AnswerOverlay';
import { useEffect } from 'react';
import { useDispatch } from './hooks/ReduxHooks';
import Nav from './components/Nav';
import { updateBackgroundAction } from './actions/AppActions';
import { fetchInitialDataAction } from './actions/DataActions';
import useQuiz from './hooks/useQuiz';
import useUser from './hooks/useUser';
import useApp from './hooks/useApp';
import LobbyOverlay from './components/overlays/LobbyOverlay';
import { PageUrl } from './constants';
import ErrorPage from './components/pages/ErrorPage/ErrorPage';
import QuizListPage from './components/pages/QuizzesPage/QuizListPage';

function App() {
  const dispatch = useDispatch();

  const app = useApp();
  const user = useUser();
  const quiz = useQuiz();
  
  // Load initial app data from server and hide
  // loading screen once done
  useEffect(() => {
    dispatch(fetchInitialDataAction());
  }, []);

  // Set app background once quiz name is known
  useEffect(() => {
    if (quiz.name === null) {
      return;
    }

    dispatch(updateBackgroundAction());
  }, [quiz.name]);
  
  return (
    <div className='app' style={{ backgroundImage: `url(${app.styles.bg})` }}>
      <div className='app-container'>
        <Nav />

        <Routes>
          {(DEBUG || user.isAdmin) && (
            <Route path={PageUrl.Admin} element={(
              <AdminPage />
            )} />
          )}

          <Route path={PageUrl.List} element={(
            <QuizListPage />
          )} />

          <Route path={PageUrl.Quiz} element={(
            <AuthRoute>
              <QuizPage />
            </AuthRoute>
          )} />
          <Route path={PageUrl.Scores} element={(
            <AuthRoute>
              <ScoresPage />
            </AuthRoute>
          )} />
          <Route path={PageUrl.Error} element={(
            <ErrorPage />
          )} />
          <Route path={PageUrl.Home} element={(
            <HomePage />
          )} />

          {/* Error route */}
          <Route path='*' element={(
            <Navigate to={PageUrl.Error} />
          )} />
        </Routes>
        
        <LoadingOverlay />
        <LobbyOverlay />
        <AnswerOverlay />
      </div>
    </div>
  );
}

export default App;