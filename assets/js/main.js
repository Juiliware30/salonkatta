'use strict';
const RESEND_OTP_TIME = 90; // seconds
AOS.init({once: true});
if (undefined === String.prototype.toTitleCase) {
    Object.defineProperty(String.prototype, 'toTitleCase', {
        value: function() {
            return this.charAt(0).toUpperCase() + this.slice(1);
        },
        enumerable: false
    });
}

Node.prototype.startLoading = function(noText = true) {
    if (!this.classList.contains('bs-loading')) {
        this.classList.add('bs-loading');
        this.default = this.innerHTML;
        this.disabled = true;
        this.innerHTML = `<span class="spinner-border spinner-border-sm" role="status"></span>${noText ? '' :'Loading'}`;
    }
}
Node.prototype.stopLoading = function(text = null) {
    if (this.classList.contains('bs-loading')) {
        if (text) {
            this.default = text;
        }
        this.disabled = false;
        this.classList.remove('bs-loading');
        this.innerHTML = this.default;
    }
}
Node.prototype.toggleLoading = function(text = null) {
    if (this.classList.contains('bs-loading')) {
        this.stopLoading(text);
    } else {
        this.startLoading();
    }
}

/**
 * @var e   :   event
 * @var o   :   option
 * @var l   :   length
 * @var c   :   Case (upper|lower) 
 **/
function allowType(e, o = 'number', l = false, c=false) {
    let val = e.target.value;
    const devn = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    switch (o) {
        case 'alfanum':
            if (l) {
                val = val.substr(0, l).replaceAll(/[^0-9a-zA-Z]/gmi, '');
            } else {
                val = val.replaceAll(/[^0-9a-zA-Z]/gmi, '');
            }
            break;
        case 'number':
            devn.forEach(dn => {
                val = val.replaceAll(dn, devn.indexOf(dn));
            });
            if (l) {
                val = val.substr(0, l).replaceAll(/[^0-9]/gmi, '');
            } else {
                val = val.replaceAll(/[^0-9]/gmi, '');
            }
            break;
        case 'mobile':
            devn.forEach(dn => {
                val = val.replaceAll(dn, devn.indexOf(dn));
            });
            val = val.replaceAll(/[^0-9]/gmi, '');
            val = val.substr(0, 10);
            if (!val.charAt(0).match(/[6-9]/)) {
                val = val.substr(1);
            }
            break;
        case 'pincode':
            // RegEX to find pin code
            // ^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$
            devn.forEach(dn => {
                val = val.replaceAll(dn, devn.indexOf(dn));
            });
            val = val.replaceAll(/[^0-9]/gmi, '');
            val = val.substr(0, 6);
            if (!val.charAt(0).match(/[1-9]/)) {
                val = val.substr(1);
            }
            break;
        case 'decimal':
            devn.forEach(dn => {
                val = val.replaceAll(dn, devn.indexOf(dn));
            });
            let i = val.search(/\./gmi);
            if (val.length === 1) {
                val = val.replaceAll(/[^0-9]/gmi, '');
            }
            if (i >= 0) {
                if (l) {
                    val = val.substr(0, i + 1) + val.substr(i).substr(0, l + 1).replaceAll(/\./gmi, '');
                } else {
                    val = val.substr(0, i + 1) + val.substr(i).replaceAll(/\./gmi, '');
                }
            }
            val = val.replaceAll(/[^0-9.]/gmi, '');
            break;
    }
    if (c=='upper') {
        val = val.toUpperCase();
    } else if (c=='lower') {
        val = val.toLowerCase();
    } else if (c=='title') {
        val = val.toTitleCase();
    }
    e.target.value = val;
}

let input1 = document.querySelector(".inpgrp input[type='text']");
let input2 = document.querySelectorAll(".inpgrp input[type='text']")[1];
if (input1 && input2) {
    let firstDropdown = document.getElementById("firstDropdown");
    let secondDropdown = document.getElementById("secondDropdown");
    
    input1.addEventListener("click", function () {
        if (firstDropdown.style.display === "block") {
            firstDropdown.style.display = "none";
        } else {
            firstDropdown.style.display = "block";
            secondDropdown.style.display = "none";
        }
    });

    input2.addEventListener("click", function () {
        if (secondDropdown.style.display === "block") {
            secondDropdown.style.display = "none";
        } else {
            secondDropdown.style.display = "block";
            firstDropdown.style.display = "none";
        }
    });
    
    document.addEventListener("click", function (e) {
        if (!e.target.closest(".inpgrp")) {
            firstDropdown.style.display = "none";
            secondDropdown.style.display = "none";
        }
    });
}

// for open modal below 800px 
$('#buttonModal').on('click', function () {
    if ($(document).width() <= 800) {
        $('#searchModal').modal('show');
    }
})

$('#locationModal').on('click', function () {
    if ($(document).width() <= 800) {
        $('#placeModal').modal('show');
    }
})

function base_url(url = '') {
    return `${location.origin}/${url}`;
}
function crm_url(url = '') {
    return `${location.protocol}//crm.${location.host}/${url}`;
}
function crm_uploads_url(url = '') {
    return `${crm_url(`uploads/${url}`)}`;
}
$(document).ready(() => {
    $.ajax({
        url: '/api/states/list',
        method: 'GET',
        beforeSend: () => {
            $('#state_id').html('<option value="">Select state</option>');
            $('#city_id').html('<option value="">Select city</option>');
        },
        success: res => {
            if (res.status===200) {
                res.data.forEach(state => {
                    $('#state_id').append(`<option value="${state.state_id}">${state.sname}</option>`);
                });
            }
        }
    });
    $('[name="state_id"]').on('change', function() {
        const state_id = this.value;
        $.ajax({
            url: `/api/states/${state_id}/cities`,
            method: 'GET',
            beforeSend: () => {
                $('[name="city_id"]').html('<option value="">Select city</option>');
            },
            success: res => {
                if (res.status===200) {
                    res.data.forEach(city => {
                        $('[name="city_id"]').append(`<option value="${city.districts_id}">${city.dname}</option>`);
                    });
                }
            }
        });
    });

    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        const form = $(this);
        const btn = form.find('button[type="submit"]')[0];
        $.ajax({
            url: form.attr('action'),
            method: 'POST',
            data: form.serialize(),
            beforeSend: () => {
                btn.startLoading();
            },
            success: res => {
                window.dispatchEvent(new Event('user-logged-in', { bubbles: true }));
                form.trigger('reset');
                $('#login').modal('hide');
                isLogged();
                new Toast({
                    parent: $('.toast-container')[0],
                    title: 'Logged in',
                    type: 'success',
                    body: 'authentication success, you are logged in now!'
                });
            },
            error: res => {
                const msg = res.responseJSON.msg
                new Toast({
                    parent: $('.toast-container')[0],
                    title: 'Login failed',
                    type: 'danger',
                    body: msg
                });
            },
            complete: () => {
                btn.stopLoading();
            }
        });
    });

    $('#register-form').on('submit', function(e) {
        e.preventDefault();
        const form = $(this);
        const btn = form.find('button[type="submit"]')[0];
        $.ajax({
            url: form.attr('action'),
            method: 'POST',
            data: form.serialize(),
            beforeSend: () => {
                btn.startLoading();
            },
            success: res => {
                form.trigger('reset');
                $('#register').modal('hide');
                new Toast({
                    parent: $('.toast-container')[0],
                    title: 'Registration success',
                    type: 'success',
                    body: 'User registered. please login to continue.'
                });
                $('#login').modal('show');
            },
            error: res => {
                const msg = res.responseJSON.msg
                new Toast({
                    parent: $('.toast-container')[0],
                    title: 'Registration failed',
                    type: 'danger',
                    body: msg
                });
            },
            complete: () => {
                btn.stopLoading();
            }
        });
    });

    $('[name="cus_image"]').on('change', function() {
        const input = this;
        const files = input.files;
        const avatar = $('.user-avatar');
        if (files.length && files[0].name) {
            if (['image/png', 'image/jpeg'].includes(files[0].type)) {
                const src = URL.createObjectURL(files[0]);
                avatar.attr('src', src);
            } else {
                return new Toast({
                    parent: $('.toast-container')[0],
                    title: 'Invalid input',
                    type: 'danger',
                    body: 'Invalid image file. allowed image files are PNG, JPG & JPEG'
                });
            }
        } else {
            avatar.attr('src', avatar.attr('data-default-src'));
        }
    });

    $('#profile-update-form').on('submit', function(e) {
        e.preventDefault();
        const btn = this.querySelector('[type="submit"]');
        $.ajax({
            url: base_url('api/user/update'),
            method: 'POST',
            data: new FormData(this),
            beforeSend: () => {
                btn.startLoading();
            },
            contentType: false,
            processData: false,
            cache: false,
            success: res => {
                const customer = isLogged();
                new Toast({
                    parent: $('.toast-container')[0],
                    title: 'Updated',
                    type: 'success',
                    body: `Dear ${customer.fname}, Your profile has been updated`
                });
            },
            error: xhr => {
                const res = xhr.responseJSON
                btn.stopLoading();
            },
            complete: () => {
                btn.stopLoading();
            }
        });
    });

    $('#mobile-login-form').on('submit', function(e) {
        e.preventDefault();
        const form = $(this);
        const btn = form.find('button[type="submit"]')[0];
        $.ajax({
            url: form.attr('action'),
            method: 'POST',
            data: form.serialize(),
            beforeSend: () => {
                btn.startLoading();
            },
            success: res => {
                if (res.status === 200) {
                    OTP_SEND_COUNT++;
                    form.trigger('reset');
                    $('#mobileotp').modal('hide');
                    new Toast({
                        parent: $('.toast-container')[0],
                        title: 'OTP Sent',
                        type: 'success',
                        body: (res.msg)
                    });
                    
                    $('#otp-sent-to').text(res.msg.match(/(\d+)/)[1].replace(/^(\d{2})\d*(\d{2})$/, '$1xxxxxx$2'));

                    $('#verifyotp').on('show.bs.modal', function() {
                        let wait = RESEND_OTP_TIME; // wait until (time in seconds)
                        const resend = setInterval(() => {
                            if (wait > 0 && OTP_SEND_COUNT < 3) {
                                let m = wait / 60;
                                let s = (wait - (Math.floor(m) * 60));
                                $('#timer').html(`Wait for <strong>${('0' + Math.floor(m)).slice(-2)}:${('0' + s).slice(-2)}</strong>, ${3 - OTP_SEND_COUNT} resend remains`);
                                wait--;
                            } else {
                                clearInterval(resend);
                                wait = RESEND_OTP_TIME;
                                let resendBtn;
                                if (OTP_SEND_COUNT < 3) {
                                    resendBtn = $(`<button name="resend_otp" type="submit" form="resend-otp-form" class="btn btn-sm btn-link text-decoration-none">Resend OTP</button>`);
                                    resendBtn.on('click', function() {
                                        resendOtp(this);
                                    });
                                } else {
                                    resendBtn = $(`<span class="text-danger">Maximum retry exceeded</span>`);
                                }
                                $('#timer').empty().append(resendBtn);
                            }
                        }, 1000);
                        $(this).on('hide.bs.modal', () => {
                            clearInterval(resend);
                            wait = RESEND_OTP_TIME;
                        });
                    });

                    $('#verifyotp').modal('show');
                }
            },
            error: res => {
                const msg = res.responseJSON.msg
                new Toast({
                    parent: $('.toast-container')[0],
                    title: 'Login failed',
                    type: 'danger',
                    body: msg
                });
            },
            complete: () => {
                btn.stopLoading();
            }
        });
    });
    let OTP_SEND_COUNT = 0;
    function resendOtp(el) {
        $.ajax({
            url: '/api/user/resend-otp',
            method: 'POST',
            beforeSend: () => {
                el.startLoading();
            },
            success: res => {
                OTP_SEND_COUNT++;
                new Toast({
                    parent: $('.toast-container')[0],
                    title: 'OTP Sent',
                    type: 'success',
                    body: (res.msg)
                });
                
                let wait = RESEND_OTP_TIME; // wait until (time in seconds)
                const resend = setInterval(() => {
                    if (wait > 0 && OTP_SEND_COUNT < 3) {
                        let m = wait / 60;
                        let s = (wait - (Math.floor(m) * 60));
                        $('#timer').html(`Wait for <strong>${('0' + Math.floor(m)).slice(-2)}:${('0' + s).slice(-2)}</strong>, ${3 - OTP_SEND_COUNT} resend remains`);
                        wait--;
                    } else {
                        clearInterval(resend);
                        wait = RESEND_OTP_TIME;
                        let resendBtn;
                        if (OTP_SEND_COUNT < 3) {
                            resendBtn = $(`<button name="resend_otp" type="submit" form="resend-otp-form" class="btn btn-sm btn-link text-decoration-none">Resend OTP</button>`);
                            resendBtn.on('click', function() {
                                resendOtp(this);
                            });
                        } else {
                            resendBtn = $(`<span class="text-danger">Maximum retry exceeded</span>`);
                        }
                        $('#timer').empty().append(resendBtn);
                    }
                }, 1000);
            },
            error: res => {
                const msg = res.responseJSON.msg
                new Toast({
                    parent: $('.toast-container')[0],
                    title: 'Failed',
                    type: 'danger',
                    body: msg
                });
            },
            complete: () => {
                el.stopLoading();
            }
        });
    }

    $('#verify-otp-form').on('submit', function(e) {
        e.preventDefault();
        const form = $(this);
        const btn = form.find('button[type="submit"]')[0];
        $.ajax({
            url: form.attr('action'),
            method: 'POST',
            data: form.serialize(),
            beforeSend: () => {
                btn.startLoading();
            },
            success: res => {
                form.trigger('reset');
                $('#verifyotp').modal('hide');
                isLogged();
                new Toast({
                    parent: $('.toast-container')[0],
                    title: 'OTP verified',
                    type: 'success',
                    body: 'OTP verification success, you are logged in now!'
                });
            },
           
            error: res => {
                const msg = res.responseJSON.msg
                new Toast({
                    parent: $('.toast-container')[0],
                    title: 'OTP verification Failed',
                    type: 'danger',
                    body: msg
                });
            },
            complete: () => {
                btn.stopLoading();
            }
        });
    });

    $('#password-reset-form').on('submit', function(e) {
        e.preventDefault();
        const form = $(this);
        const btn = form.find('button[type="submit"]')[0];
        $.ajax({
            url: form.attr('action'),
            method: 'POST',
            data: form.serialize(),
            beforeSend: () => {
                btn.startLoading();
            },
            success: res => {
                form.trigger('reset');
                $('#fpass').modal('hide');
                new Toast({
                    parent: $('.toast-container')[0],
                    title: 'Success',
                    type: 'success',
                    body: (res.msg)
                });
            },
            error: res => {
                const msg = res.responseJSON.msg
                new Toast({
                    parent: $('.toast-container')[0],
                    title: 'Warning',
                    type: 'warning',
                    body: msg
                });
            },
            complete: () => {
                btn.stopLoading();
            }
        });
    });

    $('#reset-change-password-form').on('submit', function(e) {
        e.preventDefault();
        const form = $(this);
        const btn = form.find('button[type="submit"]')[0];
        $.ajax({
            url: form.attr('action'),
            method: 'POST',
            data: form.serialize(),
            beforeSend: () => {
                btn.startLoading();
            },
            success: res => {
                form.trigger('reset');
                $('#changePasswordModal').modal('hide');
                new Toast({
                    parent: $('.toast-container')[0],
                    title: 'Success',
                    type: 'success',
                    body: (res.msg)
                });
            },
            error: res => {
                const msg = res.responseJSON.msg
                new Toast({
                    parent: $('.toast-container')[0],
                    title: 'Warning',
                    type: 'danger',
                    body: msg
                });
                btn.stopLoading();
            },
            complete: () => {
                btn.stopLoading();
            }
        });
    });

    window.isLogged = function() {
        let response = false;
        $.ajax({
            url: '/api/user/is-logged-in',
            method: 'GET',
            async: false,
            success: res => {
                if (res?.status === 200 && undefined !== res.user) {
                    response = res.user;
                    $('.auth-user-container').html(`
                    <div class="dropdown">
                        <button class="btn border-0 d-flex align-items-center gap-2 profile profile-sm p-0" type="button" data-bs-toggle="dropdown">
                            <img src="${crm_uploads_url(`user/${response.cus_image ? response.cus_image : 'avatar.png'}`)}" alt="user avatar" class="bg-body bg-opacity-75 border shadow-sm">
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end user-select-none rounded-1 shadow border-0 p-2">
                            <li>
                                <a class="dropdown-item px-2 mb-1 rounded-1 small d-flex align-items-center gap-2" href="${base_url('user/profile')}">
                                    <span><i class="bi bi-person-fill"></i></span>
                                    <span>Profile</span>
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-item px-2 mb-1 rounded-1 small d-flex align-items-center gap-2" href="${base_url('user/appointments')}">
                                    <span><i class="bi bi-calendar-check-fill"></i></span>
                                    <span>Appointments</span>
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-item px-2 mb-1 rounded-1 small d-flex align-items-center gap-2" href="${base_url('user/refer')}">
                                    <span><i class="bi bi-megaphone-fill"></i></span>
                                    <span>Referral Program</span>
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-item px-2 rounded-1 small d-flex align-items-center gap-2 fw-bold text-bg-danger" href="${base_url('user/logout')}">
                                    <span><i class="bi bi-power"></i></span>
                                    <span>Logout</span>
                                </a>
                            </li>
                        </ul>
                    </div>`);
                }
            }
        }); 
        return response;
    };
    isLogged();

    // setInterval(isLogged, 2000);
    $('.copy-to-clipboard').on('click', function() {
        let text = $($(this).attr('copy-target')).text();
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                new Toast({
                    parent: $('.toast-container')[0],
                    title: 'Copied',
                    body: 'Link copied to clipboard'
                });
            });
        } else {
            const tempInput = document.createElement("input");
            tempInput.setAttribute("type", "text");
            tempInput.setAttribute("value", text);
            tempInput.setAttribute("readonly", "");
            tempInput.style.position = "absolute";
            tempInput.style.left = "-9999px";
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand("copy");
            document.body.removeChild(tempInput);
            new Toast({
                parent: $('.toast-container')[0],
                title: 'Copied',
                body: 'Link copied to clipboard'
            });
        }
    });
    $('.share-btn').on('click', function() {
        const target = $(this);
        let link = null;
        let url = $('#refer-link').text();
        switch(true) {
            case target.hasClass('share-btn-fb'):
                link = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case target.hasClass('share-btn-tw'):
                link = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`I trusted SalonKatta, and it was an excellent choice to book appointments on nearby salons.\nTry SalonKatta yourself and earn point on refer. Which can be redeemed on any salon agains appointment booking.`)}`;
                break;
            case target.hasClass('share-btn-wa'):
                link = `https://wa.me/?text=${encodeURIComponent(url)}`;
                break;
        }
        window.open(link, "_blank", "titlebar=0,menubar=0,location=0,toolbar=0");
    });
    $(document).ready(e => {
        if (location.search.startsWith('?register')) {
            $('#register').modal('show');
        }
    });
    $('#refer-form').on('submit', function(e) {
        e.preventDefault();
        const emailEl = this.elements.email;
        const email = emailEl.value.trim();
        const btn = this.querySelector('[type="submit"]');
        if (validateEmail(email)) {
            $.ajax({
                url: base_url('api/user/invite'),
                method: 'POST',
                data: {email},
                beforeSend: () => {
                    btn.startLoading();
                },
                success: res => {
                    if (res && res?.status === 200) {
                        emailEl.value = '';
                        new Toast({
                            parent: $('.toast-container')[0],
                            title: 'Invited',
                            type: 'success',
                            body: (res.msg)
                        });
                    }
                },
                error: xhr => {
                    btn.stopLoading();
                    const res = xhr.responseJSON;
                    new Toast({
                        parent: $('.toast-container')[0],
                        title: 'Failed',
                        type: 'danger',
                        body: (res.msg)
                    });
                },
                complete: res => {
                    console.log(res);
                    btn.stopLoading();
                }
            });
        } else {
            emailEl.nextElementSibling.querySelector('.error').innerText = '*Invalid email address';
            new Toast({
                parent: $('.toast-container')[0],
                title: 'Invalid Input',
                type: 'warning',
                body: 'Invalid email address to send invitation'
            });
        }
    });
    function validateEmail(email) {
        const regex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        return !!regex.test(email);
    }
    $('#refer-form [name="email"]').on('input', function() {
        if (!validateEmail(this.value)) {
            this.nextElementSibling.querySelector('.error').innerText = '*Invalid email address';
        } else {
            this.nextElementSibling.querySelector('.error').innerText = '';
        }
    });

    $('.appointment-cancel-button').on('click', function(e) {
        const button = this;
        const apid = button.dataset.apid;
        const confirmed = confirm('Are you sure want to cancel this appointment?');
        if (confirmed) {
            let reason = prompt('Why you want to cancel this appointment');
            if (reason) {
                reason = reason.trim();
                if (reason.length) {
                    cancelAppointment(button, apid, reason);
                }
            } else {
                new Toast({
                    parent: $('.toast-container')[0],
                    title: 'Invalid reason',
                    type: 'warning',
                    body: 'Reason required to cancel an appointment'
                });
            }
        }
    });
    $('.appointment-invoice-button').on('click', function(e) {
        const button = this;
        const apid = button.dataset.apid;
        open(crm_url(`ajax_reports/invoice-download?apid=${apid}&action=print`), '_blank');
    });

    function cancelAppointment(button, apid, reason) {
        const btn = button;
        $.ajax({
            url: `/user/appointments/${apid}`,
            method: 'POST',
            data: {reason},
            beforeSend: () => {
                btn.startLoading();
            },
            success: res => {
                new Toast({
                    parent: $('.toast-container')[0],
                    title: 'Success',
                    type: 'success',
                    body: (res.msg)
                });
                setTimeout(() => location.reload(), 1500);
            },
            error: res => {
                const msg = res.responseJSON.msg
                new Toast({
                    parent: $('.toast-container')[0],
                    title: 'Warning',
                    type: 'danger',
                    body: msg
                });
                btn.stopLoading();
            },
            complete: () => {
                btn.stopLoading();
            }
        });
    }
    function routeNotification(note, url) {
        let href;
        const status = note.n_title.split(' ').at(1);
        if (note.n_title.startsWith('Appointment') && status) {
            if ([ 'confirmed', 'completed', 'unpaid', 'cancelled' ].includes(status.toLowerCase())) {
                href = url + '#Appointment-' + status.toTitleCase();
            } else if (status === 'paid') {
                href = url + '#Appointment-Completed';
            } else if (status === 'new') {
                href = url + '#Appointment-Upcoming';
            } else if (status === 'confirm') {
                href = base_url('user/appointments#Appointment-Confirmed');
            }
        } else {
            href = url;
        }
        $('#notificationOffcanvas').offcanvas('hide');
        location.href = href;
    }
    let notificationList = [];
    $(window).on('new-notification', function(e) {
        const offcanvasBody = $('#notificationOffcanvas .offcanvas-body');
        const note = notificationList.find(notif => notif.n_id === e.originalEvent.lastNotificationId); 
        const notiCount = $('#noti-count');
        const count = notificationList.filter(n => !n.n_seen).length;
        if (count > 0 && notiCount.hasClass('d-none')) {
            notiCount.removeClass('d-none');
        } else {
            notiCount.addClass('d-none');
        }
        notiCount.text(count);
        const pillsNew = $('#pills-new');
        const pillsArchive = $('#pills-archive');
        const container = (note.n_seen ? pillsArchive : pillsNew);
        const notification = container.find('.notification-message');
        if (!notification.length) {
            const noNotification = container.find('.no-notification');
            if (noNotification.hasClass('d-flex')) {
                noNotification.removeClass('d-flex');
                noNotification.addClass('d-none');
            }
        }
        const newMsg = $(`<div class="small mb-1 notification-item">
            <a href="${note.n_url}" class="notification-message text-decoration-none d-flex gap-2 border shadow-sm rounded p-2" data-notification-id="${note.n_id}" data-notification-seen="${note.n_seen}">
                <div class="align-items-center bg-primary bg-gradient bg-opacity-25 border border-primary d-flex flex-grow-0 flex-shrink-0 justify-content-center rounded-circle text-primary wh-45px">
                    <i class="bi bi-bell-fill fs-5"></i>
                </div>
                <div class="d-flex flex-column">
                    <strong>${note.n_title}</strong>
                    <small class="text-muted">${note.n_body}</small>
                </div>
            </a>
            <div class="text-end text-muted"><small>${note.n_time}</small></div>
        </div>`);
        newMsg.find('.notification-message').on('click', function(e) {
            let { notificationId, notificationSeen } = this.dataset;
            const url = this.href;
            notificationId = JSON.parse(notificationId);
            notificationSeen = JSON.parse(notificationSeen);
            e.preventDefault();
            if (!notificationSeen) {
                readNotifications(notificationId, () => {
                    routeNotification(note, url);
                });
            } else {
                routeNotification(note, url);
            }
        })
        container.prepend(newMsg);
        // offcanvasBody.html(`<h6 class="text-muted py-2">No new notifications available</h6>`);
    });

    $('#mark-all-notification-read').on('click', function() {
        readNotifications();
    });

    function readNotifications(n_id = null, callback = null) {
        $.ajax({
            url: '/api/user/notifications/read',
            method: 'POST',
            data: n_id ? { n_id } : {},
            success: res => {
                if (res.status === 200) {
                    if (!n_id) {
                        notificationList = [];
                        const notiCount = $('#noti-count');
                        notiCount.addClass('d-none');
                        $('.notification-item').remove();
                        const noNotification = $('.no-notification');
                        if (noNotification.hasClass('d-none')) {
                            noNotification.removeClass('d-none');
                            noNotification.addClass('d-flex');
                        }
                        fetchNotifications();
                    }
                    if (callback) {
                        callback();
                    }
                }
            }
        });
    }

    function fetchNotifications() {
        $.ajax({
            url: '/api/user/notifications',
            method: 'GET',
            success: res => {
                if (res.status === 200) {
                    if (res.data.length) {
                        res.data.reverse().forEach(note => {
                            const existing = notificationList.find(notif => notif.n_id === note.n_id);
                            if (undefined === existing) {
                                notificationList.push(note);
                                const newEvent = new Event('new-notification');
                                newEvent.lastNotificationId = note.n_id;
                                window.dispatchEvent(newEvent);
                            }
                        });
                    }
                }
            }
        });
    }
    fetchNotifications();
    setInterval(fetchNotifications, 15000);
});