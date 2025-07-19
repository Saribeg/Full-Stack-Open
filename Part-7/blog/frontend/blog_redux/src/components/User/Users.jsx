import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { AutoTable } from '../ui/Table';
import TextLink from '../ui/TextLink';
import PageTitle from '../PageTitle';
import InlineNotification from '../Notification/InlineNotification';
import Spinner from '../ui/Spinner';

import { fetchUsers } from '../../store/users/thunks';
import { selectVisibleUsersState } from '../../store/users/selectors';

import { getNestedValueFromObj } from '../../utils/commonHelpers';

const Users = () => {
  const { users, loading } = useSelector(selectVisibleUsersState);
  const dispatch = useDispatch();

  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length]);

  if (loading) return <Spinner />;

  if (!users || !users.length) {
    return <InlineNotification placement="Users" />;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-8">
      <PageTitle>Users</PageTitle>
      <AutoTable
        titles={['Name', 'Blogs Created']}
        listToRender={users}
        cellProps={['name', 'blogs.length']}
        getCellContent={(user, prop) =>
          prop === 'name' ? (
            <TextLink to={`/users/${user.id}`}>{getNestedValueFromObj(user, prop)}</TextLink>
          ) : (
            getNestedValueFromObj(user, prop)
          )
        }
      />
    </div>
  );
};

export default Users;
