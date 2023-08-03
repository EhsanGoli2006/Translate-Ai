window.onload = () => {
    Swal.fire({
        title: 'افزونه نصب شد',
        icon: 'success',
        text: 'برای استفاده از افزونه، کلید Open AI را دریافت کنید و سپس روی آیکون افزونه کلیک کنید و کلید را ذخیره کنید.',
        confirmButtonText: "بستن"
    });

    var closeButton = document.querySelector(".swal2-confirm.swal2-styled");

    closeButton.addEventListener("click", function() {
        window.close();
    });    
};