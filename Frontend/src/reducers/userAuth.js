const userState = {
    authToken: null,
    user: {}
}

export const userAuthReducer = (state = userState, action) => {
    switch (action) {
        case 'USER_LOGIN':
            return { ...state, user: action.data }; //!not compleat
    }
}