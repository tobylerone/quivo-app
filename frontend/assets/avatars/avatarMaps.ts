import * as constants from '../../constants';

// Maps the avatar_id to the corresponding file source
const avatarImageMap = {
    0: require('./none.png'),
    1: require('../../assets/avatars/regular.png'),
    2: require('../../assets/avatars/cute.png'),        
    3: require('../../assets/avatars/dizzy.png'),
    4: require('../../assets/avatars/clever.png'),     
    5: require('../../assets/avatars/cool.png'),        
    6: require('../../assets/avatars/strong.png'),
    7: require('../../assets/avatars/wizard.png'),
    8: require('../../assets/avatars/devil.png'),
    9: require('../../assets/avatars/black-and-white.png')
}

// Level at which each avatar is unlocked
const avatarLevelUnlock = {
    0: [0, 1, 2],
    10: [3, 4, 5],
    20: [6, 7, 8],
    30: [9]
}

// The thematic colors corresponding to each set of levels
const avatarLevelColors = {
    0: constants.PRIMARYCOLOR,
    10: constants.ORANGE,
    20: constants.GREEN,
    30: constants.LIGHTBLUE
}

export { avatarImageMap, avatarLevelUnlock, avatarLevelColors };