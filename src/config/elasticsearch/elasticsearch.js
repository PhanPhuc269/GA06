require('dotenv').config();


const { Client } = require('@elastic/elasticsearch');

const elasticClient = new Client({
    cloud: {
        id: process.env.ELASTICSEARCH_ID
    },
    auth: {
        apiKey: process.env.ELASTICSEARCH_API_KEY  // Thay bằng API key của bạn từ Elastic Cloud
      }
});

module.exports = elasticClient;
