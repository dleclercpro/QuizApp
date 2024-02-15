import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { QuizData } from '../types/QuizTypes';
import { CallGetQuiz } from '../calls/data/CallGetQuiz';
import { RootState } from '../store';

interface QuizState {
  questionIndex: number,
  shouldShowAnswer: boolean,
  data: QuizData,
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: string | null,
}

const initialState: QuizState = {
  questionIndex: 0,
  shouldShowAnswer: false,
  data: [],
  status: 'idle',
  error: null,
};

export const fetchQuizData = createAsyncThunk(
  'quiz/data',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await new CallGetQuiz().execute();
      
      return data;

    } catch (err: unknown) {
      let error = 'UNKNOWN_ERROR';
      
      if (err instanceof Error) {
        error = err.message;
      }

      console.error(`Could not fetch quiz data: ${error}`);

      return rejectWithValue(error);
    }
  }
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setQuestionIndex: (state, action: PayloadAction<number>) => {
      state.questionIndex = action.payload;
    },
    incrementQuestionIndex: (state) => {
      state.questionIndex += 1;
    },
    showAnswer: (state) => {
      state.shouldShowAnswer = true;
    },
    hideAnswer: (state) => {
      state.shouldShowAnswer = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuizData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload as QuizData;
      })
      .addCase(fetchQuizData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setQuestionIndex, incrementQuestionIndex, showAnswer, hideAnswer } = authSlice.actions;

export const selectQuestionAnswer = (state: RootState) => {
  const { questionIndex } = state.quiz;
  const { data } = state.quiz;

  if (data.length === 0) {
    return null;
  }
  
  const question = data[questionIndex];
  const answer = question.options[question.answer];

  return answer;
}

export default authSlice.reducer;