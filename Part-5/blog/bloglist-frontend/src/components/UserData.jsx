const UserData = ({ user }) => {
  const { username, name } = user;

  return (
    <div>
      <h2>User Information</h2>
      <div>
        <p>Username: {username}</p>
        <p>Name: {name}</p>
        <p>Status: Logged In</p>
      </div>
    </div>
  );
};

export default UserData;