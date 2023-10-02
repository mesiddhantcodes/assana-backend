const axios = require('axios');

// Define the user ID for whom you want to create tasks
const userId = '7114654452762786330';

// Function to create a single task
async function createTask(taskData) {
    try {
        await axios.post('http://localhost:3000/task', taskData, {
            headers: {
                Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjcxMTQ2NTQ0NTI3NjI3ODYzMzAiLCJuYW1lIjoic2lkZCIsImVtYWlsIjoic2lkQGdtYWlsLmNvbSIsInVzZXJOYW1lIjoic2lkZGhhbnQiLCJpYXQiOjE2OTYyNjU4MTYsImV4cCI6MTY5NjI2OTQxNn0.Qvyp_SfIzyBOyFvleZAv_dwydnQT92q53JizGvSQ3E8"

            }

        });
        console.log('Task created successfully:', taskData.name);
    } catch (error) {
        console.error('Error creating task:', error.response.data);
    }
}

// Function to generate and create a thousand tasks
async function generateAndCreateTasks() {
    for (let i = 0; i < 10000; i++) {
        const newTask = {
            name: `ktm ${i + 1}`,
            createdAt: new Date(),
            updatedAt: new Date(),
            deadline: new Date('2023-12-31'), // Replace with the desired deadline
            priority: 'Medium', // Replace with the desired priority
            createdBy: userId,
            columnId: '7114654851724012841', // Replace with the actual column ID
            assignedTo: [userId],
        };

        await createTask(newTask);
    }
}

// Call the function to generate and create a thousand tasks
generateAndCreateTasks();
