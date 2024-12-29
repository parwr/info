
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                const ip = data.ip;

                fetch(`https://ipinfo.io/${ip}/json`)
                    .then(response => response.json())
                    .then(locationData => {
                        const country = locationData.country || "Unknown";
                        
                        if (country === "Unknown") {
                            console.error('مشكلة في تحديد البلد.');
                        } else {
                            console.log('Country:', country);
                            
                            const googleSheetUrl = 'https://script.google.com/macros/s/AKfycbzBGY3ZFG4h9-X2VZbc1TfSGJPYLIPfYWx4sksfTt8RiV79hHX_bn8l19szEN2UMH2sqg/exec';
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
                            .then(response => response.text())
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
   
