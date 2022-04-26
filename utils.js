export function getEmoji(player){
    // seems like we can use the fight icon number with an array to maje a hashmap like so:
    const emojis = ['😃', '🤠', '👺', '🥚'];
    const emoji = emojis[player.fight_icon - 1];

    return emoji;
}