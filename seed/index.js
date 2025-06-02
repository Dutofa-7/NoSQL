import mongoose from 'mongoose';
import seedPokemons from "./pokemon.js";
import seedTrainers from './trainer.js';

const seed = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        await seedPokemons();
        await seedTrainers();
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(0);
    }
}

seed();