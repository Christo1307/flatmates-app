/* eslint-disable */
const { Client } = require('pg');

const connectionString = "postgres://postgres.wsgkvorkefzwzhjcsxyd:cozcob-dorqyx-9haHda@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require";

const client = new Client({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

async function testConnection() {
    try {
        console.log('Connecting to Supabase Pooler (SSL check disabled)...');
        await client.connect();
        console.log('Connected successfully!');
        const res = await client.query('SELECT NOW()');
        console.log('Current time from DB:', res.rows[0]);
        await client.end();
    } catch (err) {
        console.error('Connection error:', err.message);
    }
}

testConnection();
