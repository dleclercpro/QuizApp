import { NON_VOTE } from '../constants';
import { NO_QUESTION_INDEX } from '../reducers/AppReducer';
import { RootState } from '../stores/store';

export const selectQuestion = (state: RootState, questionIndex: number) => {
  const quiz = state.quiz;

  const questions = quiz.questions.data;

  if (!questions || questionIndex === NO_QUESTION_INDEX) {
    return null;
  }
  
  return questions[questionIndex];
}



export const selectAnswer = (state: RootState, questionIndex: number) => {
  const quiz = state.quiz;

  const questions = quiz.questions.data;
  const votes = quiz.votes.data;

  if (!questions || !votes || questionIndex === NO_QUESTION_INDEX) {
    return null;
  }

  const question = questions[questionIndex];
  const vote = votes[questionIndex];

  const answer = vote !== NON_VOTE ? question.options[vote] : null;

  return answer;
}



export const selectCorrectAnswer = (state: RootState, questionIndex: number) => {
  const quiz = state.quiz;

  const questions = quiz.questions.data;
  const status = quiz.status.data;

  if (!questions || !status || questionIndex === NO_QUESTION_INDEX) {
    return null;
  }
  
  const question = questions[questionIndex];
  const correctAnswer = question.options[question.answer];

  return correctAnswer;
}



export const haveAllPlayersAnswered = (state: RootState, questionIndex: number) => {
  const quiz = state.quiz;
  
  const status = quiz.status.data;
  const votes = quiz.votes.data;
  const players = quiz.players.data;
  
  if (!status || !votes || !players || players.length === 0 || questionIndex === NO_QUESTION_INDEX) {
    return false;
  }

  const { voteCounts } = status;

  return voteCounts[questionIndex] === players.length;
}