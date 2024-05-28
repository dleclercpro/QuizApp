import { QuizName } from "../constants";
import TimeDuration from "../models/units/TimeDuration";

export type Vote = {
  questionIndex: number,
  vote: number,
};

export type QuizStatus = {
  questionIndex: number,
  isStarted: boolean,
  isOver: boolean,
  isSupervised: boolean,
  timer: {
    isEnabled: boolean,
    startedAt?: Date,
    duration?: TimeDuration,
  },
}

export type Quiz = {
  name: QuizName,
  creator: string,
  players: string[],
  status: QuizStatus,
};