import * as constants from '../../constants';

// Maps the avatar_id to the corresponding file source
const avatarImageMap = {
    0: require('./none.png'),
    1: require('../../assets/avatars/poop.png'),
    2: require('../../assets/avatars/cute.png'),
    3: require('../../assets/avatars/regular.png'),        
    4: require('../../assets/avatars/dizzy.png'),
    5: require('../../assets/avatars/clever.png'),     
    6: require('../../assets/avatars/cool.png'),        
    7: require('../../assets/avatars/black-and-white.png'),
    8: require('../../assets/avatars/wizard.png'),
    9: require('../../assets/avatars/devil.png'),
    10: require('../../assets/avatars/strong.png'),
    11: require('../../assets/avatars/rich.png'),
    12: require('../../assets/avatars/dead.png'),
}

// Level at which each avatar is unlocked
const avatarLevelUnlock = {
    0: [0],
    5: [1, 2],
    10: [3, 4, 5],
    15: [6, 7, 8],
    20: [9, 10],
    25: [11, 12]
}

// The thematic colors corresponding to each set of levels
const avatarLevelColors = {
    0: constants.PRIMARYCOLOR,
    5: constants.ORANGE,
    10: constants.GREEN,
    15: constants.LIGHTBLUE,
    20: constants.LIGHTBLUE,
    25: constants.LIGHTBLUE
}

export { avatarImageMap, avatarLevelUnlock, avatarLevelColors };