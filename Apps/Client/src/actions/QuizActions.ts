import { createAsyncThunk } from '@reduxjs/toolkit';
import { StatusData, ScoreData } from '../types/DataTypes';
import { CallGetQuiz } from '../calls/quiz/CallGetQuiz';
import { CallGetStatus } from '../calls/quiz/CallGetStatus';
import { CallGetScores } from '../calls/quiz/CallGetScores';
import { CallGetVotes } from '../calls/quiz/CallGetVotes';
import { QuizJSON } from '../types/JSONTypes';
import { RootState } from '../stores/store';
import { setQuestionIndex } from '../reducers/AppReducer';
import { CallStartQuiz } from '../calls/quiz/CallStartQuiz';
import { CallStartQuestion } from '../calls/quiz/CallStartQuestion';

export const fetchQuestions = createAsyncThunk(
  'quiz/fetchQuestions',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await new CallGetQuiz().execute();
      
      return data as QuizJSON;

    } catch (err: unknown) {
      let error = 'UNKNOWN_ERROR';
      
      if (err instanceof Error) {
        error = err.message;
      }

      console.error(`Could not fetch questions: ${error}`);
      return rejectWithValue(error);
    }
  }
);

export const fetchStatus = createAsyncThunk(
  'quiz/fetchStatus',
  async (quizId: string, { rejectWithValue }) => {
    try {
      const { data } = await new CallGetStatus(quizId).execute();
      
      return data as StatusData;

    } catch (err: unknown) {
      let error = 'UNKNOWN_ERROR';
      
      if (err instanceof Error) {
        error = err.message;
      }

      console.error(`Could not fetch quiz status: ${error}`);
      return rejectWithValue(error);
    }
  }
);

export const fetchVotes = createAsyncThunk(
  'quiz/fetchVotes',
  async (quizId: string, { rejectWithValue }) => {
    try {
      const { data } = await new CallGetVotes(quizId).execute();
      
      return data as number[];

    } catch (err: unknown) {
      let error = 'UNKNOWN_ERROR';
      
      if (err instanceof Error) {
        error = err.message;
      }

      console.error(`Could not fetch user's votes: ${error}`);
      return rejectWithValue(error);
    }
  }
);

export const fetchScores = createAsyncThunk(
  'quiz/fetchScores',
  async (quizId: string, { rejectWithValue }) => {
    try {
      const { data } = await new CallGetScores(quizId).execute();
      
      return data as ScoreData;

    } catch (err: unknown) {
      let error = 'UNKNOWN_ERROR';
      
      if (err instanceof Error) {
        error = err.message;
      }

      console.error(`Could not fetch scores: ${error}`);
      return rejectWithValue(error);
    }
  }
);

export const fetchData = createAsyncThunk(
  'quiz/fetchData',
  async (quizId: string, { dispatch, getState, rejectWithValue }) => {
    try {
      const res = await Promise.all([
        dispatch(fetchQuestions()),
        dispatch(fetchVotes(quizId)),
        dispatch(fetchScores(quizId)),
        dispatch(fetchStatus(quizId)),
      ]);

      const someFetchActionFailed = res
        .map(({ type }) => type)
        .some(type => type.endsWith('/rejected'));

      if (someFetchActionFailed) {
        return;
      }
      
      const { quiz } = getState() as RootState;
      const status = quiz.status.data as StatusData;
      const questionIndex = status.questionIndex;

      // After first data fetch, set current question index in the app to match
      // the one on the server
      dispatch(setQuestionIndex(questionIndex));

    } catch (err: unknown) {
      let error = 'UNKNOWN_ERROR';
      
      if (err instanceof Error) {
        error = err.message;
      }

      console.error(`Could not fetch initial data: ${error}`);
      return rejectWithValue(error);
    }
  }
);

export const start = createAsyncThunk(
  'quiz/start',
  async ({ quizId, isSupervised }: { quizId: string, isSupervised: boolean }, { rejectWithValue }) => {
    try {
      await new CallStartQuiz(quizId).execute({ isSupervised });

      return;

    } catch (err: unknown) {
      let error = 'UNKNOWN_ERROR';
      
      if (err instanceof Error) {
        error = err.message;
      }

      console.error(error);

      return rejectWithValue(error);
    }
  }
);

export const startQuestion = createAsyncThunk(
  'quiz/question/start',
  async ({ quizId, questionIndex }: { quizId: string, questionIndex: number }, { dispatch, rejectWithValue }) => {
    try {
      await new CallStartQuestion(quizId, questionIndex).execute();

      dispatch(setQuestionIndex(questionIndex));

      return;

    } catch (err: unknown) {
      let error = 'UNKNOWN_ERROR';
      
      if (err instanceof Error) {
        error = err.message;
      }

      console.error(error);

      return rejectWithValue(error);
    }
  }
);