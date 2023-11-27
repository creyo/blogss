

// Some other file (perhaps StateActions.js)
import { SET_SELECTED_POST_TYPE_ID ,SET_SELECTED_PUBLICATION_ID} from './actionTypes';
// ...


export const setSelectedPostTypeId = (postId) => ({
  type: SET_SELECTED_POST_TYPE_ID,
  payload: postId,
});

export const setSelectedPublicationId = (publicationId) => ({
  type: SET_SELECTED_PUBLICATION_ID,
  payload: publicationId,
});
