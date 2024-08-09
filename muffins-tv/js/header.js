document.addEventListener("DOMContentLoaded", function() {
    // Carregar o header
    fetch('html/header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            const headerElement = document.createElement('header');
            headerElement.id = 'gen-header';
            headerElement.innerHTML = data;
            document.body.insertBefore(headerElement, document.body.firstChild);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation for header:', error);
        });

    // Carregar o footer
    fetch('html/footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            const footerElement = document.createElement('footer');
            footerElement.id = 'gen-footer';
            footerElement.innerHTML = data;
            document.body.appendChild(footerElement);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation for footer:', error);
        });
});
