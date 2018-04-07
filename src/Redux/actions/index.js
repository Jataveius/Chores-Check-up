import Service from '../../utils/_data'
import {
  SET_BUCKETS_LIST,
} from './ActionTypes'

export const getItems = payload => ( {
  type: SET_BUCKETS_LIST,
  payload,
} )

export const getBucketsList = () => dispatch => {

  Service.getBucketsList().then( ( res ) => {

    dispatch( getItems( res ) )

  } )

}
