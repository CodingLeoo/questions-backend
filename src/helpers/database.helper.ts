import mongoose from 'mongoose';

const status = mongoose.connection;

export const initConnection = (databaseUrl: string) => {
    mongoose.connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => { console.log(`connected sucessfully to : ${databaseUrl}`) })
        .catch((err) => { console.log(`unable to connect to : ${databaseUrl} , error : ${err}`) });
}

status.on('error', console.error.bind(console, 'connection error:'));

status.once('open', () => {
    console.log('opened connection to database.');
})