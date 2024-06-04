import { logoutAction as doLogout } from '../actions/UserActions';
import { useDispatch, useSelector } from './ReduxHooks';

const useUser = () => {
  const { username, team, isAdmin, isAuthenticated } = useSelector(({ user }) => user);

  const dispatch = useDispatch();

  const logout = async () => {
    return await dispatch(doLogout());
  }

  return {
    username,
    team,
    isAdmin,
    isAuthenticated,
    logout,
  };
};

export default useUser;