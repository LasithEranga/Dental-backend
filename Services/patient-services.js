import axios from 'axios';


export const getPatientDetails = async ( mobile, nic, uniqueId) => {
    const apiUrl = 'https://dev.api.medica.lk/api/v1/Patient/GetPatient';
    
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhYmMiLCJpYXQiOjE3MjkwNjgyMTcsImV4cCI6MTcyOTA3MTgxN30.93D4krbsyl9jsuF9AqdufzaU9l1WwRWYEi2bHh4aEIo"; 

    console.log('Unique ID:', uniqueId);
    const requestBody = {
        Mobile: mobile,
        NIC: nic ,
        UniqueId: uniqueId 
    };

    try {
        const response = await axios.post(apiUrl, requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        // Handle any errors
        console.error('Error calling patient API:', error);
        throw new Error('Failed to fetch patient details');
    }
};

