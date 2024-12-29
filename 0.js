fetch('https://api.ipify.org?format=json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch IP address');
        }
        return response.json();
    })
    .then(data => {
        const ip = data.ip;

        fetch(`https://ipinfo.io/${ip}/json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch location data');
                }
                return response.json();
            })
            .then(locationData => {
                const country = locationData.country || "Unknown";

                if (country === "Unknown") {
                    console.error('مشكلة في تحديد البلد.');
                } else {
                    console.log('Country:', country);

                    const googleSheetUrl = 'https://script.google.com/macros/s/AKfycby-JzzdlCqh3WIMjV3x4WvtrxESNkkLr2xZjIT6bCic1oiImEPjAyMT7l6xbtJKwziEEA/exec';
                    const params = new URLSearchParams();
                    params.append('ip', ip);
                    params.append('country', country);

                    fetch(googleSheetUrl, {
                        method: 'POST',
                        body: params,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to send data to Google Sheets');
                        }
                        return response.text();
                    })
                    .then(result => {
                        console.log('Data saved:', result);
                    })
                    .catch(error => console.error('Error sending data:', error));
                }
            })
            .catch(error => {
                console.error('Error fetching location data from ipinfo.io:', error);
            });
    })
    .catch(error => {
        console.error('Error fetching IP:', error);
    });