import * as constants from '../constants';
/**
 * This is the Video reducer which handles updating state to reflect the user's current
 * videos as well as associated data like which video comes next.
 * @param state Object current state
 * @param action Object action being dispatched (includes action.payload which is the data)
 * @returns {{result: *}}
 */
export default (state = {}, action) => {
    switch (action.type) {
        case constants.REQUEST_VIDEOS:
            return {
                ...state,
                isFetching: action.payload,
            };
        case constants.VIDEOS_FETCHED:
            return {
                ...state,
                isFetching: false, // Simply sets the isFetching property to false so the loading stops
                // This is useful if you want to control loading without updating any data
            };
        case constants.VIDEOS_SUCCESS:
            return {
                ...state,
                videoList: [...action.payload],
                isFetching: false,
                error: null,
            };
        case constants.VIDEOS_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: action.payload,
            };
        case constants.UPDATE_ACTIVE_VIDEO:
            return {
                ...state,
                activeVideo: action.payload,
            };
        case constants.PING_REQUEST:
            return {
                ...state,
                isFetching: action.payload,
            };
        case constants.PING_RESPONSE_SUCCESS:
            return {
                ...state,
                isFetching: false,
                videoList: action.payload,
                error: null,
            };
        case constants.PING_RESPONSE_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: action.payload,
            };
        case constants.GET_SIGNED_URL_REQUEST: {
            // We dont set isFetching to true here bc it causes an extraneous loading screen
            return {
                ...state,
            }
        }
        case constants.GET_SIGNED_URL_SUCCESS: {
            // Go through each chapter
            let activeVideo = null;
            const videoList = state.videoList.map(c => {
                // If the chapter includes the video we are searching for
                // return a non mutated copy of all attributes for the chapter
                if(c.chapter === action.payload.video.chapter)
                    return {
                        ...c,
                        // Map through all of the chapters videos until we find the video we want
                        // and update is signed url
                        videos: c.videos.map(video => {
                            if (video.sortKey === action.payload.video.sortKey) {
                                activeVideo = {
                                    ...video,
                                    signedUrl: action.payload.signedUrl,
                                };
                                return activeVideo;
                            } else
                                // Its not the right video leave it be
                                return video;
                        })
                    };
                // Otherwise just return the chapter as is it doesnt include the video
                // we are searching for
                 else
                    return c;
            });

            return {
                ...state,
                videoList,
                activeVideo,
                isFetching: false,
                error: null,
            }
        }
        case constants.GET_SIGNED_URL_FAILURE: {
            return {
                ...state,
                isFetching: false,
                error: action.payload,
            };
        }
        default:
            return {
                ...state
            }
    }
}
