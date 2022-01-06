import PropTypes from 'prop-types';

import { getFromNowTime } from 'helpers/helpers';
import { ButtonColor, ButtonType, IconName } from 'common/enums/enums';
import { postType } from 'common/prop-types/prop-types';
import { IconButton, Image, Button, TextArea } from 'components/common/common';

import styles from './styles.module.scss';
import { useCallback, useState } from '../../../hooks/hooks';

// eslint-disable-next-line react/prop-types
const Post = ({ userId, post, onPostLike, onPostDislike, onExpandedPostToggle, sharePost, onPostUpdate }) => {
  const {
    id,
    image,
    body,
    user,
    likeCount,
    dislikeCount,
    commentCount,
    createdAt
  } = post;
  const [editPost, setEditPost] = useState(false);
  const [bodyText, setBody] = useState(body);
  const date = getFromNowTime(createdAt);

  const handlePostLike = () => onPostLike(id);
  const handlePostDisLike = () => onPostDislike(id);

  const handleExpandedPostToggle = () => onExpandedPostToggle(id);

  const close = () => {
    setEditPost(false);

  };

  const handleUpdatePost = () => {
    onPostUpdate(id, { 'body': bodyText });
    close()

  };


  const handleTextAreaChange = useCallback(ev => setBody(ev.target.value), [setBody]);

  return (
    <div className={styles.card}>
      {image && <Image src={image.link} alt='post image' />}
      <div className={styles.content}>
        <div className={styles.meta}>
          <span>{`posted by ${user.username} - ${date}`}</span>
        </div>
        {editPost && userId === user.id ?
          null :
          <p className={styles.description}>{body}</p>}
      </div>
      {editPost && userId === user.id ?
        <form onSubmit={handleUpdatePost}>
          <div className={styles.content}>
            <TextArea type='text' value={bodyText} onChange={handleTextAreaChange} placeholder={''} />
          </div>
          <div className={styles.extra}>
            <Button color={ButtonColor.BLUE} type={ButtonType.SUBMIT}>Save</Button>
            <Button color={ButtonColor.RED} onClick={close}>Close</Button>
          </div>
        </form>
        :
        <div className={styles.extra}>
          <IconButton
            iconName={IconName.THUMBS_UP}
            label={likeCount}
            onClick={handlePostLike}
          />
          <IconButton
            iconName={IconName.THUMBS_DOWN}
            label={dislikeCount}
            onClick={handlePostDisLike}
          />
          <IconButton
            iconName={IconName.COMMENT}
            label={commentCount}
            onClick={handleExpandedPostToggle}
          />
          <IconButton
            iconName={IconName.SHARE_ALTERNATE}
            onClick={() => sharePost(id)}
          />
          {userId === user.id ?
          <span className={styles.userPanel}>
            <IconButton
              iconName={IconName.PEN_SQUARE}
              onClick={() => {
                setEditPost(true);
              }}
            />
            <IconButton
              iconName={IconName.TRASH}
              onClick={() => {}}
            />
          </span>:null
          }

        </div>}
    </div>
  );
};

Post.propTypes = {
  post: postType.isRequired,
  onPostLike: PropTypes.func.isRequired,
  onExpandedPostToggle: PropTypes.func.isRequired,
  sharePost: PropTypes.func.isRequired
};

export default Post;
