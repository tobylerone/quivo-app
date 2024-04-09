import * as constants from '../../constants';

// Maps the avatar_id to the corresponding file source
const avatarImageMap = {
    0: require('../../assets/avatars/none-med.png'),
    1: require('../../assets/avatars/poop-med.png'),
    2: require('../../assets/avatars/cute-med.png'),
    3: require('../../assets/avatars/regular-med.png'),        
    4: require('../../assets/avatars/dizzy-med.png'),
    5: require('../../assets/avatars/clever-med.png'),
    6: require('../../assets/avatars/sleepy-med.png'),     
    7: require('../../assets/avatars/cool-med.png'),        
    8: require('../../assets/avatars/black-and-white-med.png'),
    9: require('../../assets/avatars/wizard-med.png'),
    10: require('../../assets/avatars/devil-med.png'),
    11: require('../../assets/avatars/strong-med.png'),
    12: require('../../assets/avatars/dead-med.png'),
    13: require('../../assets/avatars/rich-med.png'),
}

// Level at which each avatar is unlocked
const avatarLevelUnlock = {
    0: [0],
    5: [1, 2],
    10: [3, 4, 5],
    15: [6, 7, 8],
    20: [9, 10],
    25: [11, 12],
    30: [13]
}

// The thematic colors corresponding to each set of levels
const avatarLevelColors = {
    0: constants.PRIMARYCOLOR,
    5: constants.ORANGE,
    10: constants.GREEN,
    15: constants.LIGHTBLUE,
    20: constants.LIGHTBLUE,
    25: constants.LIGHTBLUE,
    30: constants.LIGHTBLUE
}

export { avatarImageMap, avatarLevelUnlock, avatarLevelColors };