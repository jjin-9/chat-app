const socket = io();

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');

socket.on('serverMsg', (msg) => {
    console.log(msg);
});

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    $messageFormButton.setAttribute('disabled', 'disabled');

    const msg = e.target.elements.msg.value;

    socket.emit('clientSendMsg', msg, (error) => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();

        if ( error ) {
            return console.log(error);
        }
        console.log('The message was delivered');
    });
});

$sendLocationButton.addEventListener('click', () => {
    if ( ! navigator.geolocation ) {
        return alert('Geolocation is not supported by your browser');
    }
    $sendLocationButton.setAttribute('disabled', 'disabled');
    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit('clientSendLocation', {
            latitude, 
            longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled');
            console.log('Location shared');
        });
    });

});