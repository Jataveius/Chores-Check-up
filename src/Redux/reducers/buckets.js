import {
  SET_BUCKETS_LIST,
} from '../actions/ActionTypes'

const initialState = {
  items: [],
}

export default ( state = initialState, action ) => {

  switch ( action.type ) {

  case SET_BUCKETS_LIST:
    return {
      ...state,
      items: action.payload,
    }
  default:
    return state

  }

}
