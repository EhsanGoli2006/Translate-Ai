const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});

function ViewProcessInButton() {
    const button = document.getElementById('helpButton');
    let dots = 1;

    intervalId = setInterval(() => {
        button.innerHTML = ".".repeat(dots);
        dots = (dots + 1) % 4;
    }, 280);
    return intervalId;
}

function StopProcessInButton(intervalId) {
    clearInterval(intervalId);
    document.getElementById("helpButton").innerHTML = "Ai";
}

function AddCustomFontDocument() {
    var styleElement = document.createElement('style');
    var fontFaceCSS = `
h2#swal2-title {
    font-family: Calibri ;
    text-align: right;
}
#helpButton {
    text-align: center !important;
}
`;
    styleElement.innerHTML = fontFaceCSS;
    document.head.appendChild(styleElement);
}

function createButtonElement() {
    const button = document.createElement("button");
    const buttonStyles = {
        minHeight: "40px",
        minWidth: "40px",
        fontFamily: "Calibri",
        fontWeight: "bold",
        position: "absolute",
        backgroundColor: '#330000',
        borderRadius: '10px',
        color: '#ff9a00',
        cursor: 'pointer',
        display: "none",
        padding: '9px',
        textAlign: 'center !important',
        textDecoration: 'none',
        transition: 'all 250ms',
        border: 'none',
        fontSize: '16px',
        userSelect: 'none',
        touchAction: 'manipulation',
    };
    button.innerHTML = " Ai";
    button.id = "helpButton";

    Object.assign(button.style, buttonStyles);
    document.body.appendChild(button);
}

function IsClipboardEmpty() {
    return window.getSelection().toString() === '';
}

function ShowButtonInSelection() {
    selection_position = window.getSelection().getRangeAt(0).getBoundingClientRect();
    var Button = document.getElementById('helpButton');

    Button.style.left = (selection_position.left + window.scrollX) + 'px';
    Button.style.top = (selection_position.top + window.scrollY) + 'px';

    Button.style.display = 'block';
}

function hideButtonInDocument() {
    const button = document.getElementById('helpButton');
    button.style.display = IsClipboardEmpty() ? 'none' : 'block';
}

function ShowResultInDocument(result) {
    Swal.fire({
        title: '',
        // icon: 'success',
        text: result,
        confirmButtonText: "بستن"
    });
}

function ShowRequestProcess() {
    const button = document.getElementById('helpButton');
    let dots = 1;

    intervalId = setInterval(() => {
        button.innerHTML = ".".repeat(dots);
        dots = (dots + 1) % 4;
    }, 280);
}

// - - - - - - - - - - - - - --- - - - - - - - - - - - - - - - - - 
async function sendRequestToOpenAI(questions) {
    try {
        const token = await chrome.storage.local.get(["openai_token"]);
        
        if (!token.openai_token) {
            Toast.fire({
                icon: 'error',
                title: 'توکنی در مروگر ثبت نشده است!'
            });
            return;
        }
        
        if (!navigator.onLine) {
            Toast.fire({
                icon: 'error',
                title: 'اینترنت متصل نیست'
            });
            return;
        }
        
        const api_url = "https://api.openai.com/v1/chat/completions";
        const data = {
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You' },
                {
                    role: 'user', content: 'جمله پایین را به فارسی ترجمه کن\nاگر معنی نداشت بنویس "متن شما صحیح نیست"\nجمله:\n\n' + questions
                }
            ]
        };

        const response = await fetch(api_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.openai_token}`
            },
            body: JSON.stringify(data)
        });

        // 0_0
        if (response.status === 200) {
            const responseData = await response.json();
            const datas = responseData.choices[0].message.content;
            ShowResultInDocument(datas);
        } else if (response.status === 429) {
            Toast.fire({
                icon: 'error',
                title: 'استفاده ازهوش مصنوعی در طول روز بیشتر از حد مجاز است'
            });
        } else {
            Toast.fire({
                icon: 'error',
                title: 'خطا در اتصال به Open AI'
            });
        }
    } catch (error) {
        Toast.fire({
            icon: 'error',
            title: 'خطا در ارتباط با هوش مصنوعی!'
        });
    }
}
// - - - - - - - - - - - - - --- - - - - - - - - - - - - - - - - - 

window.onload = async function () {
    createButtonElement();
    AddCustomFontDocument();
    document.getElementById("helpButton").addEventListener("click", async () => {
        
    const selectedText = window.getSelection().toString();
        intervalId = ViewProcessInButton();
        await sendRequestToOpenAI(selectedText);
        StopProcessInButton(intervalId);
    });
}

// show Button if selection is not empty
document.addEventListener("mouseup", () => {
    if (!IsClipboardEmpty()) {
        ShowButtonInSelection();
    }
});

// hide Button if selection is empty
document.onselectionchange = () => {
    hideButtonInDocument();
};