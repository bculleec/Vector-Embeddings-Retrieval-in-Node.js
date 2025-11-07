// Go to main.js to see how we build our vectors.
import { readFile } from 'fs/promises';

const vectors = JSON.parse(await readFile('./data/vectors.json', { encoding: 'utf-8'}));

// Now that we have our vectors, we need to build a similarity search index.
// We are organizing each vector spatially, kind of like a proximity map of ideas!

import faiss from 'faiss-node';

const dimension = vectors[0].vector.size;
const index = new faiss.IndexFlatL2(dimension);

const matrix = [];

vectors.forEach(( vector ) => {
    matrix.push(Array.from(Object.values(vector.vector.data)));  
});

matrix.forEach(( m ) => {
    index.add(m);
});

import { embedString } from './VectorCreation.js';
import express from 'express';
import cors from 'cors';