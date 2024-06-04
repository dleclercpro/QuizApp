import { useTranslation } from 'react-i18next';
import { ScoresData } from '../types/DataTypes';
import { toSortedArray } from '../utils/array';
import './Scoreboard.scss';
import useQuiz from '../hooks/useQuiz';
import { NO_VOTE_INDEX } from '../constants';

interface Props {
  scores: ScoresData,
}

const Scoreboard: React.FC<Props> = (props) => {
  const { scores } = props;

  const { t } = useTranslation();

  const quiz = useQuiz();

  if (!quiz.questions || !quiz.status) {
    return null;
  }

  const questionsCount = quiz.questions.length;
  const questionsAnsweredCount = quiz.votes.filter((vote) => vote !== NO_VOTE_INDEX).length;

  const sortedScores = toSortedArray(scores, 'DESC')
    .map(({ key, value }) => ({ username: key, score: value }));

  return (
    <div className='scoreboard'>
      <h2 className='scoreboard-title'>{t('common:COMMON.SCOREBOARD')}</h2>
      <p className='scoreboard-sub-title'>
        {t('common:COMMON.QUIZ')}:
        <strong className='scoreboard-quiz-label'>
          {quiz.id}
        </strong>
      </p>
      <p className='scoreboard-text'>
        {t(quiz.isOver ? 'PAGES.SCOREBOARD.STATUS_OVER' : 'PAGES.SCOREBOARD.STATUS_NOT_OVER', { questionsCount, questionsAnsweredCount })}
      </p>
      <table className='scoreboard-table'>
        <thead>
          <tr>
              <th>{t('common:COMMON.RANK')}</th>
              <th>{t('common:COMMON.USERNAME')}</th>
              <th>{t('common:COMMON.SCORE')}</th>
          </tr>
        </thead>
        <tbody>
          {sortedScores.map(({ username, score }, i) => {
            return (
              <tr key={`scoreboard-table-row-${i}`}>
                  <td>{i + 1}</td>
                  <td>
                    <strong>{username}</strong>
                  </td>
                  <td>{score}/{quiz.questionIndex + 1}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Scoreboard;