const pageUrls = {
    about: '/index.html?about',
    contact: '/index.html?contact',
    gallery: '/index.html?gallery'
};

function OnStartUp() {
    popStateHandler();
}

document.querySelector('#about-link').addEventListener('click', () => {
    navigateTo('about', 'About Me');
});

document.querySelector('#contact-link').addEventListener('click', () => {
    navigateTo('contact', 'Contact');
});

document.querySelector('#gallery-link').addEventListener('click', () => {
    navigateTo('gallery', 'Gallery');
});

document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

function navigateTo(pageKey, title) {
    const stateObj = { page: pageKey };
    document.title = title;
    history.pushState(stateObj, pageKey, `?${pageKey}`);
    renderPage(pageKey);
}

function renderPage(pageKey) {
    if (pageKey === 'about') RenderAboutPage();
    else if (pageKey === 'contact') RenderContactPage();
    else if (pageKey === 'gallery') RenderGalleryPage();
}

function popStateHandler() {
    const loc = window.location.href.toString().split(window.location.host)[1];
    
    if (loc && loc.includes('contact')) renderPage('contact');
    else if (loc && loc.includes('gallery')) renderPage('gallery');
    else renderPage('about');
}

window.onpopstate = popStateHandler;

function RenderAboutPage() {
    document.querySelector('main').innerHTML = `
        <h1 class="title">About Me</h1>
        <p>To jest aplikacja SPA wykorzystująca Vanilla JS.</p>
        <p>Przejdź do galerii, aby zobaczyć ładowanie obrazów.</p>`;
}

function RenderContactPage() {
    document.querySelector('main').innerHTML = `
        <h1 class="title">Contact with me</h1>
        <form id="contact-form" novalidate>
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required minlength="3">
            <span class="error-msg" id="err-name" style="display:none; color:red;">Imię musi mieć min. 3 znaki.</span>

            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
            <span class="error-msg" id="err-email" style="display:none; color:red;">Podaj poprawny adres email.</span>

            <label for="message">Message:</label>
            <textarea id="message" name="message" required minlength="10"></textarea>
            <span class="error-msg" id="err-msg" style="display:none; color:red;">Wiadomość jest za krótka.</span>
            
            <div class="g-recaptcha" data-sitekey="TU_WKLEJ_SWOJ_KLUCZ_WITRYNY" style="margin-top: 15px;"></div>
            <span class="error-msg" id="err-captcha" style="display:none; color:red;">Potwierdź, że nie jesteś robotem.</span>

            <button type="submit">Send</button>
        </form>`;

    if (window.grecaptcha && window.grecaptcha.render) {
        const captchaContainer = document.querySelector('.g-recaptcha');
        try {
            grecaptcha.render(captchaContainer, {
                'sitekey': '6LdccyksAAAAAO2AhMkWpJnwLV0wXAzz6YRMEpLn'
            });
        } catch (error) {}
    }

    const form = document.getElementById('contact-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        let isValid = true;
        
        const name = document.getElementById('name');
        if (name.value.trim().length < 3) {
            document.getElementById('err-name').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('err-name').style.display = 'none';
        }

        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            document.getElementById('err-email').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('err-email').style.display = 'none';
        }

        const msg = document.getElementById('message');
        if (msg.value.trim().length < 10) {
            document.getElementById('err-msg').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('err-msg').style.display = 'none';
        }

        const captchaResponse = grecaptcha.getResponse();
        if (captchaResponse.length === 0) {
            document.getElementById('err-captcha').style.display = 'block';
            isValid = false;
        } else {
            document.getElementById('err-captcha').style.display = 'none';
        }

        if (isValid) {
            alert('Formularz został wysłany!');
            form.reset();
            grecaptcha.reset();
        }
    });
}

function RenderGalleryPage() {
    document.querySelector('main').innerHTML = `
        <h1 class="title">My Gallery</h1>
        <div class="gallery-grid" id="gallery-container"></div>
    `;

    const container = document.getElementById('gallery-container');
    
    for (let i = 0; i < 9; i++) {
        const img = document.createElement('img');
        img.classList.add('gallery-item');
        img.alt = `Image ${i + 1}`;
        img.dataset.url = `https://picsum.photos/600/400?random=${i}`;
        
        img.addEventListener('click', () => {
            openModal(img.src);
        });

        container.appendChild(img);
        lazyLoadImage(img);
    }
}

function lazyLoadImage(imgElement) {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const url = imgElement.dataset.url;
                
                fetch(url)
                    .then(response => response.blob())
                    .then(blob => {
                        const objectURL = URL.createObjectURL(blob);
                        imgElement.src = objectURL;
                        imgElement.removeAttribute('data-url');
                    })
                    .catch(err => console.error(err));

                obs.unobserve(imgElement);
            }
        });
    });
    
    observer.observe(imgElement);
}

const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-img');
const closeBtn = document.querySelector('.close-modal');

function openModal(src) {
    modal.style.display = "block";
    modalImg.src = src;
}

closeBtn.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

OnStartUp();