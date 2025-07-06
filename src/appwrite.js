const database_id = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const collection_id = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const project_id = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const url = import.meta.env.VITE_APPWRITE_ENDPOINT;

import { Client, Databases, ID, Query } from "appwrite";

const client = new Client().setEndpoint(url).setProject(project_id);

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
    try {
        const result = await database.listDocuments(database_id,collection_id,[
            Query.equal('searchTerm', searchTerm)
        ])
        console.log(result)

        if(result.documents.length > 0) {
            const doc = result.documents[0];

            await database.updateDocument(database_id,collection_id, doc.$id, {count: doc.count+1})
        }
        else {
            await database.createDocument(database_id,collection_id,ID.unique(),{
                searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            })
        }
    } catch(error) {
        console.log(error)
    }
};

export const getTrendingMovies = async () => {
    try {
        const result = await database.listDocuments(database_id,collection_id,[
            Query.orderDesc('count'),
            Query.limit(5)
        ])
        console.log(result.documents)
        return result.documents;
    } catch(error) {
        console.log(error)
    }
}
