import { HttpMethod, ContentType } from 'common/enums/enums';

class Post {
  constructor({ apiPath, http }) {
    this._apiPath = apiPath;
    this._http = http;
  }

  getAllPosts(filter) {
    return this._http.load(`${this._apiPath}/posts`, {
      method: HttpMethod.GET,
      query: filter
    });
  }

  getPost(id) {
    return this._http.load(`${this._apiPath}/posts/${id}`, {
      method: HttpMethod.GET
    });
  }

  addPost(payload) {
    return this._http.load(`${this._apiPath}/posts`, {
      method: HttpMethod.POST,
      contentType: ContentType.JSON,
      payload: JSON.stringify(payload)
    });
  }

  updatePost(id,data){
    return this._http.load(`${this._apiPath}/posts/${id}`,{
      method: HttpMethod.PUT,
      contentType: ContentType.JSON,
      payload: JSON.stringify(data)
    })
  }

  likePost(postId,isLike) {
    return this._http.load(`${this._apiPath}/posts/react`, {
      method: HttpMethod.PUT,
      contentType: ContentType.JSON,
      payload: JSON.stringify({
        postId,
        isLike: isLike
      })
    });
  }

  getPostReaction(postId){
    return this._http.load(`${this._apiPath}/posts/react/${postId}`, {
      method: HttpMethod.GET
    })
  }



}

export { Post };
