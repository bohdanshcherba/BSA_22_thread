import { useSelector } from 'hooks/hooks';
import { Grid, Image, Input } from 'components/common/common';
import { DEFAULT_USER_AVATAR } from 'common/constants/constants';

const Profile = () => {
  const { user } = useSelector(state => ({
    user: state.profile.user
  }));

  return (
    <Grid container textAlign="center" style={{ paddingTop: 30 }}>
      <Grid.Column>
        <Image
          centered
          src={user.image?.link ?? DEFAULT_USER_AVATAR}
          size="medium"
          circular
        />
        <br />
        <Input
          icon="user"
          iconPosition="left"
          placeholder="Username"
          type="text"
          disabled
          value={user.username}
        />
        <br />
        <br />
        <Input
          icon="at"
          iconPosition="left"
          placeholder="Email"
          type="email"
          disabled
          value={user.email}
        />
      </Grid.Column>
    </Grid>
  );
};

export default Profile;