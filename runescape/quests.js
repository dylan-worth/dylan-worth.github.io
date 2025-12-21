import { addChatMessage } from './chat.js';
import { hasItem, removeItem, addItem } from './inventory.js';

export const QUEST_STATE = {
    cooks_assistant: 0 // 0=Start, 1=Gathering, 2=Done
};

export function talkToNPC(npcName) {
    if (npcName === 'Cook') handleCookDialogue();
    else if (npcName === 'Cow') {
        addItem('bucket_milk', 'Milk', 1);
        addChatMessage("You milk the cow.", "white");
    }
    else if (npcName === 'Chicken') {
        addItem('egg', 'Egg', 1);
        addChatMessage("You find an egg.", "white");
    }
    else if (npcName === 'Wheat') {
        addItem('pot_flour', 'Flour', 1);
        addChatMessage("You pick some wheat.", "white");
    }
    else {
        addChatMessage(`${npcName}: Hello there!`, "yellow");
    }
}

function handleCookDialogue() {
    const stage = QUEST_STATE.cooks_assistant;

    if (stage === 0) {
        addChatMessage("Cook: It's the Duke's birthday! I need ingredients for a cake!", "orange");
        addChatMessage("Cook: Please bring me 1 Egg, 1 Milk, and 1 Flour.", "orange");
        QUEST_STATE.cooks_assistant = 1;
    } 
    else if (stage === 1) {
        if (hasItem('egg') && hasItem('bucket_milk') && hasItem('pot_flour')) {
            removeItem('egg', 1);
            removeItem('bucket_milk', 1);
            removeItem('pot_flour', 1);
            
            addChatMessage("Cook: You saved the day! Here, take this.", "lime");
            addItem('chef_hat', 'Chef Hat', 1);
            addItem('coins', 'Coins', 500);
            
            QUEST_STATE.cooks_assistant = 2;
        } else {
            addChatMessage("Cook: I still need Egg, Milk, and Flour!", "orange");
        }
    } 
    else if (stage === 2) {
        addChatMessage("Cook: Thanks again! The cake looks delicious.", "yellow");
    }
}
