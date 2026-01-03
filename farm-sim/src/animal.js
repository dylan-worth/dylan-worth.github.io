export class Animal {
    constructor(gender) {
        this.gender = gender; // "Male" or "Female"
        this.stage = "Baby";
        this.health = 50;
        this.happiness = 50;
        this.ageInMinutes = 0;
        
        // We will attach the Three.js mesh here later
        this.mesh = null; 
    }

    updateStats(isFed) {
        if (isFed) {
            this.health = Math.min(100, this.health + 5);
            this.happiness = Math.min(100, this.happiness + 5);
        } else {
            this.health = Math.max(0, this.health - 2);
            this.happiness = Math.max(0, this.happiness - 5);
        }
    }

    grow() {
        this.ageInMinutes++;
        
        // Life stage thresholds
        if (this.ageInMinutes >= 40) {
            this.stage = "Elder";
        } else if (this.ageInMinutes >= 15) {
            this.stage = "Adult";
        } else if (this.ageInMinutes >= 5) {
            this.stage = "Adolescent";
        }
    }
}
