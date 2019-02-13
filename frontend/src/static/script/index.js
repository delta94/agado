var user

function show(obj) {
    obj.fadeIn(500)
    obj.removeClass('d-none')
}

function hide(obj) {
    obj.fadeOut(500)
    obj.addClass('d-none')
}

$(document).ready(function () {

    $(".carousel").carousel({
        pause: false
    })

    $(".back-btn").click(function () {
        hide($("#travelerUser"))
        hide($("#hotelUser"))
        show($("#welcome"))
    })

    $("#travelerBtn").click(function () {
        hide($("#welcome"))
        show($("#travelerUser"))
    })

    $("#travelerLoginLink").click(function () {
        $("#travelerRegisterLink").removeClass("active")
        $(this).addClass("active")
        hide($("#travelerRegisterForm"))
        show($("#travelerLoginForm"))
    })

    $("#travelerRegisterLink").click(function () {
        $("#travelerLoginLink").removeClass("active")
        $(this).addClass("active")
        hide($("#travelerLoginForm"))
        show($("#travelerRegisterForm"))
    })

    $("#travelerRegisterForm").delegate(".btn-register", "click", function () {
        if ($("#travelerRegisterUsr").val() && $("#travelerRegisterPwd").val() && $("#travelerRegisterFname").val() && $("#travelerRegisterSname").val() &&
            $("#travelerRegisterGender").val() && $("#travelerRegisterEmail").val() && $("#travelerRegisterPhone").val() && $("#travelerRegisterBirthDate").val()) {
            
            user = {
                username: $("#travelerRegisterUsr").val(),
                password: $("#travelerRegisterPwd").val(),
                first_name: $("#travelerRegisterFname").val(),
                last_name: $("#travelerRegisterSname").val(),
                gender: $("#travelerRegisterGender").val(),
                email: $("#travelerRegisterEmail").val(),
                phone_num: $("#travelerRegisterPhone").val(),
                date_of_birth: $("#travelerRegisterBirthDate").val(),
                user_type: "traveler"
            }
            
            $.ajax({
                method: "POST",
                url: `${window.location.origin}/api/user`,
                data: user,
                success: function () {
                    $("#modalTitle").html("Register completed");
                    $("#modalBody").html("Please log in with this account.")
                    $("#modal").modal("show")

                    $("#travelerRegisterLink").removeClass("active")
                    $(this).addClass("active")
                    hide($("#travelerRegisterForm"))
                    show($("#travelerLoginForm"))
                },
                error: function (error) {
                    $("#modalTitle").html("This username is taken")
                    $("#modalBody").html("Please try another username.")
                    $("#modal").modal("show")
                }
            })
        }
    })

    $("#travelerLoginForm").delegate(".btn-login", "click", function () {
        event.preventDefault()
        $.ajax({
            method: "POST",
            url: `${window.location.origin}/api/login`,
            data: {
                username: $("#travelerLoginUsr").val(),
                password: $("#travelerLoginPwd").val()
            },
            success: function (usr) {
                localStorage.setItem("user", JSON.stringify(usr))

                window.location.href = "../../traveler.html"
            },
            error: function (error) {
                if ($("#travelerLoginUsr").val() && $("#travelerLoginPwd").val()) {
                    $("#modalTitle").html("Incorrect username or password");
                    $("#modalBody").html("Please try again.");
                    $("#modal").modal("show");
                }
            }
        });
    })

    $("#hotelBtn").click(function () {
        hide($("#welcome"))
        show($("#hotelUser"))
    })

    $("#hotelLoginLink").click(function () {
        $("#hotelRegisterLink").removeClass("active")
        $(this).addClass("active")
        hide($("#hotelRegisterForm"))
        show($("#hotelLoginForm"))
    })

    $("#hotelRegisterLink").click(function () {
        $("#hotelLoginLink").removeClass("active")
        $(this).addClass("active")
        hide($("#hotelLoginForm"))
        show($("#hotelRegisterForm"))
    })

    $("#hotelRegisterForm").delegate(".btn-register", "click", function () {
        if ($("#hotelRegisterUsr").val() && $("#hotelRegisterPwd").val() && $("#hotelRegisterFname").val() && $("#hotelRegisterSname").val() &&
            $("#hotelRegisterGender").val() && $("#hotelRegisterEmail").val() && $("#hotelRegisterPhone").val() && $("#hotelRegisterBirthDate").val()) {
            
            user = {
                username: $("#hotelRegisterUsr").val(),
                password: $("#hotelRegisterPwd").val(),
                first_name: $("#hotelRegisterFname").val(),
                last_name: $("#hotelRegisterSname").val(),
                gender: $("#hotelRegisterGender").val(),
                email: $("#hotelRegisterEmail").val(),
                phone_num: $("#hotelRegisterPhone").val(),
                date_of_birth: $("#hotelRegisterBirthDate").val(),
                user_type: "hotel_manager"
            }
            
            $.ajax({
                method: "POST",
                url: `${window.location.origin}/api/user`,
                data: user,
                success: function () {
                    $("#modalTitle").html("Register completed");
                    $("#modalBody").html("Please log in with this account.")
                    $("#modal").modal("show")

                    $("#hotelRegisterLink").removeClass("active")
                    $(this).addClass("active")
                    hide($("#hotelRegisterForm"))
                    show($("#hotelLoginForm"))
                },
                error: function (error) {
                    $("#modalTitle").html("This username is taken")
                    $("#modalBody").html("Please try another username.")
                    $("#modal").modal("show")
                }
            })
        }
    })

    $("#hotelLoginForm").delegate(".btn-login", "click", function () {
        event.preventDefault()
        $.ajax({
            method: "POST",
            url: `${window.location.origin}/api/login`,
            data: {
                username: $("#hotelLoginUsr").val(),
                password: $("#hotelLoginPwd").val()
            },
            success: function (usr) {
                localStorage.setItem("hotelManager", JSON.stringify(usr))

                window.location.href = "../../hotel_manager.html"
            },
            error: function (error) {
                if ($("#hotelLoginUsr").val() && $("#hotelLoginPwd").val()) {
                    $("#modalTitle").html("Incorrect username or password");
                    $("#modalBody").html("Please try again.");
                    $("#modal").modal("show");
                }
            }
        });
    })
})