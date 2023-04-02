$(document).ready(function() {
    const apiUrl = 'http://localhost:8000/api/chatbot'; // Replace with your API URL
    const converter = new showdown.Converter();

    function sendUserMessage() {
        const userMessage = $('#user-message').val();
        if (!userMessage.trim()) return;
        
        // Append user message to the chat
        $('#chat-container').append(`<div class="alert alert-warning"><strong>You:</strong> ${userMessage}</div>`);

        // Call API and process the response
        callApi(userMessage).then((markdown) => {
            console.log(markdown)
            const botMessage = converter.makeHtml(markdown);
            $('#chat-container').append(`<div class="alert alert-success"><strong>Bot:</strong> ${botMessage}</div>`);
            //$('#bot-text').html(botMessage);
        });
        
        $('#user-message').val('');
    }

    async function callApi(message) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "message": message })
            });
            const data = await response.json();
            return data.markdown || 'Sorry, I could not process your request.';
        } catch (error) {
            console.error('Error:', error);
            return 'An error occurred while processing your request.';
        }
    }

    $('#send-message').on('click', sendUserMessage);
    $('#user-message').on('keypress', function(e) {
        if (e.which === 13) {
            sendUserMessage();
        }
    });
});
