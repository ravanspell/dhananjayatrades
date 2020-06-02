const userState = {
    authToken: null,
    user: ""
}

const userAuthReducer = (state = userState, action) => {
    switch (action.type) {
        case 'USER_LOGIN':
            return { ...state, authToken: action.data };
        case 'VERIFY_USER':
            return { ...state, user: action.data }
        default:
            return state
    }
}
export default userAuthReducer;