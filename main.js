let upload = document.getElementById('upload');
upload.addEventListener('change', () => {
    let fr = new FileReader();
    fr.readAsText(upload.files[0]);
    fr.onload = function () {
        let Arr = fr.result.split(/\r?\n|\n/).map(e => e.split(','));
        window.validEmails = [];
        let valTableBody = document.querySelector('#val tbody');
        let invalTableBody = document.querySelector('#invaltab tbody');

        // Clear previous table content
        valTableBody.innerHTML = '';
        invalTableBody.innerHTML = '';

        Arr.forEach(e => {
            let em = String(e[0]).trim(); // Adjusted to consider only the first element in each row
            if (em) {
                let creEle = document.createElement("tr");
                creEle.innerHTML = `<td>${em}</td>`;
                if (isValidEmail(em)) {
                    valTableBody.appendChild(creEle);
                    window.validEmails.push(em);
                } else {
                    invalTableBody.appendChild(creEle);
                }
            }
        });
        document.querySelector('#valcount').innerHTML = window.validEmails.length;
        document.querySelector('#invalcount').innerHTML = invalTableBody.children.length;
    };
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email);
}

function logEmailHistory(email, status) {
    let table = document.querySelector('#historyTable tbody');
    let row = document.createElement('tr');
    row.innerHTML = `<td>${email}</td><td>${status}</td><td>${new Date().toLocaleString()}</td>`;
    table.appendChild(row);
}

document.getElementById('mailForm').addEventListener('submit', function(event) {
    event.preventDefault();
    document.getElementById('previewSubject').textContent = document.querySelector('#subject').value;

    let template = document.querySelector('#templateSelector').value;
    let customTemplate = document.querySelector('#customTemplate').value;

    let body = '';
    if (template === 'template1') {
        body = 'This is Template 1 content...'; // Replace with actual template content
    } else if (template === 'template2') {
        body = 'This is Template 2 content...'; // Replace with actual template content
    } else if (customTemplate) {
        body = customTemplate;
    } else {
        body = 'Default content if no template selected...'; // Default content
    }

    document.getElementById('previewBody').textContent = body;
    document.getElementById('previewContainer').style.display = 'block';
});

function confirmSend() {
    let totalEmails = window.validEmails.length;
    let sentCount = 0;

    function sendNextEmail() {
        if (sentCount < totalEmails) {
            let email = window.validEmails[sentCount];
            let template = document.querySelector('#templateSelector').value;
            let customTemplate = document.querySelector('#customTemplate').value;

            let body = '';
            if (template === 'template1') {
                body = 'This is Template 1 content...'; // Replace with actual template content
            } else if (template === 'template2') {
                body = 'This is Template 2 content...'; // Replace with actual template content
            } else if (customTemplate) {
                body = customTemplate;
            } else {
                body = 'Default content if no template selected...'; // Default content
            }

            Email.send({
                Host: "smtp.elasticemail.com",
                Username: "your-email@example.com",
                Password: "your-password",
                To: email,
                From: "your-email@example.com",
                Subject: document.querySelector('#subject').value,
                Body: body
            }).then(
                () => {
                    logEmailHistory(email, 'Sent');
                    sentCount++;
                    if (sentCount < totalEmails) {
                        sendNextEmail();
                    } else {
                        alert(`All ${totalEmails} mails have been sent successfully.`);
                        document.getElementById('previewContainer').style.display = 'none';
                    }
                }
            ).catch(error => {
                logEmailHistory(email, 'Failed');
                sentCount++;
                if (sentCount < totalEmails) {
                    sendNextEmail();
                } else {
                    alert(`All ${totalEmails} mails have been processed.`);
                    document.getElementById('previewContainer').style.display = 'none';
                }
            });
        }
    }
    sendNextEmail();
}

function cancelSend() {
    document.getElementById('previewContainer').style.display = 'none';
}
