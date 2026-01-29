const axios = require('axios');

async function testStoriesAPI() {
    try {
        console.log('Testing GET /api/stories...');
        const response = await axios.get('http://localhost:5000/api/stories');

        console.log('Response Status:', response.status);
        console.log('Success:', response.data.success);
        console.log('Count:', response.data.count);
        console.log('First Story Situation:', response.data.data[0]?.situation);

        if (response.data.success && Array.isArray(response.data.data)) {
            console.log('\n✅ API works correctly!');
        } else {
            console.log('\n❌ API returned unexpected structure.');
        }
    } catch (error) {
        console.error('\n❌ API Request Failed:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

testStoriesAPI();
