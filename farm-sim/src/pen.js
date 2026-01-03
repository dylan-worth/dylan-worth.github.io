import { Animal } from './Animal.js';

export class Pen {
    constructor() {
        this.animals = [];
        this.foodTroughFull = true;
    }

    addAnimal(gender, stage = "Baby") {
        const newAnimal = new Animal(gender);
        newAnimal.stage = stage;
        this.animals.push(newAnimal);
        return newAnimal;
    }

    // This is the core "Heartbeat" of our simulation
    tick() {
        let adultMales = 0;
        let adultFemales = 0;

        this.animals.forEach(animal => {
            // 1. Handle aging and growth
            animal.grow();
            
            // 2. Handle Health/Happiness based on food
            animal.updateStats(this.foodTroughFull);

            // 3. Identify breeding pairs
            if (animal.stage === "Adult") {
                if (animal.gender === "Male") adultMales++;
                if (animal.gender === "Female") adultFemales++;
            }
        });

        // 4. The 10% Breeding Check
        if (adultMales > 0 && adultFemales > 0) {
            if (Math.random() < 0.10) {
                const babyGender = Math.random() > 0.5 ? "Male" : "Female";
                this.addAnimal(babyGender);
                console.log("A baby was born!");
            }
        }
    }
}
