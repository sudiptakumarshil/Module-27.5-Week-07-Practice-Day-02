const login = async (event) => {
    event.preventDefault();
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    if (username == '' && password == '') {
        alert("Username & password are required!");
        return;
    }

    const response = await fetch('https://fakestoreapi.com/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    });

    if (response.status == 200) {
        const data = await response.json();
        localStorage.setItem('auth_token', data.token);
        window.location.href = 'index.html';
    }

    if (response.status == 401) {
        alert("Email or password invalid!");
    }
}

const logout = () => {
    if (!confirm('Are you sure to logout?')) return;
    localStorage.removeItem('auth_token');
    window.location.href = 'login.html';
}

const users = async () => {
    let response = await fetch('https://fakestoreapi.com/users');
    let data = await response.json();

    let html = "";
    data.map((item, index) => {
        html += `
            <tr>
                <th>${index + 1}</th>
                <td>${item.name.firstname} ${item.name.lastname}</td>
                <td>${item.username}</td>
                <td>${item.email}</td>
                <td>${item.password}</td>
                <td>
                    <button type="button" class="btn btn-warning btn-sm" onclick="editUser(${item.id})">Edit</button>
                </td>
            </tr>
        `;
    });
    document.getElementById('users').innerHTML = html;
}

const addUser = async (event) => {
    event.preventDefault();
    let firstname = document.getElementById('firstname').value;
    let lastname = document.getElementById('lastname').value;
    let email = document.getElementById('email').value;
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    if (firstname == '' || lastname == '' || email == '' || username == '' || password == '') {
        alert('Please! fill up all fields');
        return;
    }

    let response = await fetch('https://fakestoreapi.com/users', {
        method: "POST",
        body: JSON.stringify(
            {
                email: email,
                username: username,
                password: password,
                name: {
                    firstname: firstname,
                    lastname: lastname
                },
                address: {
                    city: 'kilcoole',
                    street: '7835 new road',
                    number: 3,
                    zipcode: '12926-3874',
                    geolocation: {
                        lat: '-37.3159',
                        long: '81.1496'
                    }
                },
                phone: '1-570-236-7033'
            }
        )
    });

    if (response.status != 200) {
        alert("An error occured!");
        return;
    }

    users();
    resetForm();

    alert('User created successfully!')

}

const resetForm = () => {
    document.getElementById('myForm').reset();
}

const editUser = async (id) => {
    let response = await fetch(`https://fakestoreapi.com/users/${id}`);
    let data = await response.json();
    if (response.status == 200) {
        document.getElementById('firstname').value = data.name.firstname;
        document.getElementById('lastname').value = data.name.lastname;
        document.getElementById('email').value = data.email;
        document.getElementById('username').value = data.username;
        document.getElementById('password').value = data.password;
    }
}

users();