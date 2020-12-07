document.querySelector('#user-form').addEventListener('submit', function(e) {
    e.preventDefault()

    let name = document.querySelector('[name=full_name]')
    let email = document.querySelector('[name=email]')
    let password = document.querySelector('[name=password]')

    /*if (password.value.length < 8) {
        password.style.background = '#F9D0C4'
    }
    else {
        if (password.value.match(/[A-Z]+/) && password.value.match(/[a-z]+/) && password.value.match(/[0-9]+/)) {
            password.style.background = '#C2E0C6'
        }
        else {
            password.style.background = '#F9D0C4'
        }
    }*/
    
    let fields = [
        name,
        email,
        password,
    ]

    //----------------rules-----------------
    
    let name_rule = /^[а-щіїьюяґє]+\s+[а-щіїьюяґє]+\s+[а-щіїьюяґє]+$/i
    let email_rule = /^([a-zA-Z0-9-]+[a-zA-Z0-9-.]*[a-zA-Z0-9-]|[a-zA-Z0-9-]+)@[A-Za-z0-9-]+[.]*[A-Za-z0-9-]*\.[A-Za-z0-9-]+$/
    let password_rule = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/

    let rules = [
        name_rule,
        email_rule,
        password_rule,
    ]

    for (let i = 0; i < fields.length; i++) {
        if (rules[i].test(fields[i].value.trim())) {
            fields[i].style.background = '#C2E0C6'
        }
        else {
            fields[i].style.background = '#F9D0C4'
        }
    }
})

document.querySelector('#view').addEventListener('click', function() {
    $(this).addClass('active')
    $('[data-show=description]').removeClass('active')
    $('#preview').removeClass('d-none')
    $('#description').addClass('d-none')

    let string = document.querySelector('#description').value;

    let strong_rule = /\+\+(.*?)\+\+/g
    string = string.replaceAll(strong_rule, '<strong>$1</strong>')

    let i_rule = /\-\-(.*?)\-\-/g
    string = string.replaceAll(i_rule, '<i>$1</i>')

    let img_rule = /\((https\:\/\/)(.*?)(\.png|\.jpg)\)/g
    string = string.replaceAll(img_rule, '<img src="$1$2$3">')

    let link_rule = /(https:\/\/)([^\s]+)(\s*?)/g
    let link_array = string.match(link_rule)
    link_array.forEach(function(link) {
        let index = string.indexOf(link)
        if (string.slice(index - 1, index) !== '"' && string.slice(index - 1, index) !== '(') {
            string = string.replaceAll(link, `<a href="${link}">${link}</a>`)
        }
    })

    document.querySelector('#preview').innerHTML = string
})

$('[data-show=description]').on('click', function() {
    $(this).addClass('active')
    $('#preview').addClass('d-none')
    $('#description').removeClass('d-none')
    $('[data-show=preview]').removeClass('active')
})