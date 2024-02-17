const validateUser = (body) => {
    const { firstname, lastname, phone, email, password, confirmpassword } = body

    if(firstname === '' || lastname === '' || phone === 0 || email === '' || password === '' || confirmpassword === '') {
        return {msg: 'Fill the details completely'}
    }

    else if(phone.length < 12) {
        return {msg: 'phonenumber should be of length 10'}
    }

    else if(!email.includes('@')) {
        return {msg: 'Email should contain "@"'}
    }

    else if(password.length < 8) {
        return {msg: 'password should be of length >= 8'}
    }

    else if(password !== confirmpassword) {
        return {msg: 'password and confirmpassword are not matching'}
    }
}


module.exports = validateUser