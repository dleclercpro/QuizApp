import React, { useEffect } from 'react';
import { useDispatch, useSelector } from '../../hooks/redux';
import { vote } from '../../reducers/QuizReducer';
import { showAnswer } from '../../reducers/OverlaysReducer';
import './QuestionForm.scss';

type Question = {
  index: number,
  question: string,
  theme: string,
  options: string[],
  choice: string,
  setChoice: (choice: string) => void,
}

const QuestionBox: React.FC<Question> = ({ index, question, theme, options, choice, setChoice }) => {
  const quiz = useSelector(({ quiz }) => quiz);
  const quizId = quiz.id;
  const questions = quiz.questions.data;

  const dispatch = useDispatch();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setChoice(e.target.value);
  }

  const handleSubmit: React.ChangeEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (quizId === null) {
      return;
    }
    
    await dispatch(vote({
      quizId,
      questionIndex: index,
      vote: options.findIndex(option => option === choice),
    }));

    dispatch(showAnswer());
  }

  useEffect(() => {
    setChoice('');

  }, [index]);

  if (questions === null) {
    return null;
  }

  return (
    <form className='question-form' onSubmit={handleSubmit}>
      <div className='question-form-theme-container'>
        <p className='question-form-index'>Question: {index + 1}/{questions.length}</p>
        <p className='question-form-theme'>{theme}</p>
      </div>

      <h2 className='question-form-title'>{question}</h2>

      {options.map((option, i) => (
        <div className='checkbox' key={i}>
          <input
            type='radio'
            id={`option-${i}`}
            name='option'
            value={option}
            checked={choice === option}
            onChange={handleChange}
          />
          <label htmlFor={`option-${i}`}>{option}</label>
        </div>
      ))}

      <button type='submit' disabled={choice === ''}>Submit my answer</button>
    </form>
  );
};

export default QuestionBox;
