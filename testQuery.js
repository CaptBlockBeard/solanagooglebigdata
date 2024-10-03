'use strict';

const {BigQuery} = require('@google-cloud/bigquery');
const projectId = process.env.GOOGLE_CLOUD_PROJECT;

async function listTables() {
  const bigqueryClient = new BigQuery({
    projectId: 'magnetic-icon-436610-j4'
  });

  try {
    const [tables] = await bigqueryClient.dataset('crypto_solana_mainnet_us', {projectId: 'bigquery-public-data'}).getTables();
    console.log('Tables:');
    tables.forEach(table => console.log(table.id));
  } catch (error) {
    console.error('Error listing tables:', error);
  }
}

async function queryPublicDataset() {
  const bigqueryClient = new BigQuery({
    projectId: projectId
  });

  const queries = [
    `SELECT name, gender, number AS count
     FROM \`bigquery-public-data.usa_names.usa_1910_2013\`
     WHERE state = 'TX'
     LIMIT 10`,
    
    `SELECT COUNT(*) as count
     FROM \`bigquery-public-data.crypto_solana_mainnet_us.Accounts\``,
    
    `SELECT *
     FROM \`bigquery-public-data.crypto_solana_mainnet_us.Accounts\`
     LIMIT 10`
  ];

  for (let query of queries) {
    try {
      console.log(`Executing query: ${query}`);
      const [rows] = await bigqueryClient.query({query});
      console.log('Query results:');
      rows.forEach(row => console.log(JSON.stringify(row, null, 2)));
    } catch (error) {
      console.error('Error:', error);
    }
    console.log('---');
  }
}

async function main() {
  await listTables();
  await queryPublicDataset();
}

main();