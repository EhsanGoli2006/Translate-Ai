let intervalId; // save interval Id

function ViewProcessOnButton() {
    const button = document.getElementById('saveButton');
    let dots = 0;

    intervalId = setInterval(() => {
        button.innerHTML = 'در حال پردازش' + ".".repeat(dots);
        dots = (dots + 1) % 4;
    }, 500);
}

function StopViewProcess() {
    clearInterval(intervalId);
    document.getElementById('saveButton').innerHTML = "بررسی و ثبت";
}

window.onload = () => {
    chrome.storage.local.get(["openai_token"]).then((token) => {
        document.getElementById("key").value = token.openai_token;
    });
};

document.getElementById("saveButton").addEventListener("click", async function () {
    ViewProcessOnButton();
    await SaveToken();
    StopViewProcess();
});

document.getElementById("key").addEventListener("keypress",() => {
    document.getElementById("status").innerHTML = "";
});

document.getElementsByTagName("a")[0].addEventListener("click",(event) => {
    window.open("https://platform.openai.com/account/api-keys");
    event.preventDefault();
});

async function isValidToken(token) {
    const api_url = "https://api.openai.com/v1/chat/completions";
    const data = {
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'You' },
            { role: 'user', content: 'Hi' }
        ]
    };

    try {
        const response = await fetch(api_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(data)
        });

        return response.status !== 401;
    } catch (error) {
        alert("خطا در ارتباط با سرور های Open AI");
        return false;
    }
}

async function SaveToken() {
    const token = document.getElementById("key").value;

    if (!token) {
        document.getElementById("status").innerHTML = "لطفاً توکن را وارد کنید";
        document.getElementById("status").style.color = "red";
        return;
    }

    if (!navigator.onLine) {
        document.getElementById("status").innerHTML = "اینترنت متصل نیست";
        document.getElementById("status").style.color = "red";
        return;
    }

    const isValid = await isValidToken(token);

    if (isValid) {
        chrome.storage.local.set({ openai_token: token });
        document.getElementById("status").innerHTML = "توکن با موفقیت ذخیره شد";
        document.getElementById("status").style.color = "green";
    } else {
        document.getElementById("status").innerHTML = "توکن معتبر نیست!";
        document.getElementById("status").style.color = "red";
    }
}
