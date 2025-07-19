import { Link as RouterLink } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  Typography
} from '@mui/material';
import Spinner from '../Spinner';
import { useUsers } from '../../queries/user';


const Users = () => {
  const { data: users, isLoading } = useUsers();

  if (isLoading) return <Spinner />;

  return (
    <TableContainer component={Paper} elevation={3}>
      <Table>
        <TableHead>
          <TableRow sx={{
            backgroundColor: 'grey.200'
          }}>
            <TableCell>
              <Typography variant="subtitle1" fontWeight={600}>
                Name
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1" fontWeight={600}>
                Blogs Created
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id} hover>
              <TableCell>
                <Link
                  component={RouterLink}
                  to={`/users/${user.id}`}
                  underline="hover"
                  color="primary"
                >
                  {user.name}
                </Link>
              </TableCell>
              <TableCell>{user.blogs.length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Users;